import { TrxProgramSchedule } from "../../../../models/trx_program_schedules/trx_program_schedules.js";
import { MstProgram } from "../../../../models/mst_programs/mst_programs.js";
import { MstBranch } from "../../../../models/mst_branch/mst_branch.js";
import { MstCourt } from "../../../../models/mst_courts/mst_courts.js";
import { MstTrainer } from "../../../../models/mst_trainers/mst_trainers.js";
import { MstProgramAge } from "../../../../models/mst_program_ages/mst_program_ages.js";

import axios from "axios";

import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek.js";
import Sequelize, { Op } from "sequelize";

dayjs.extend(isoWeek);

export const getSchedulesFromThirdParty = async (req, res) => {
  try {
    const { dateStart, dateEnd, programId, branch, min_age, max_age } = req.body;

    // console.log("Received params:", { dateStart, dateEnd, programId, branch, min_age, max_age });

    // 1. Login untuk dapat token
    const loginResponse = await axios.post(
      "https://api.kyzn.life/api/admin/auth/login",
      {
        email: process.env.KYZN_EMAIL,
        password: process.env.KYZN_PASSWORD,
      }
    );

    if (!loginResponse.data.success) {
      return res.status(401).json({
        success: false,
        message: "Login gagal",
      });
    }

    const token = loginResponse.data.token;

    console.log("Obtained token:", token);

    // 2. Fetch data schedule dari KYZN
    const scheduleResponse = await axios.get(
      "https://api.kyzn.life/api/admin/activity-schedule",
      {
        params: {
          limit: 10000000,
          venueId: 2,
          dateStart,
          dateEnd,
          activityId: "",
          courtId: "",
          workerId: "",
          workerTypeId: "",
        },
        headers: {
          Authorization: token, // tanpa "Bearer "
        },
      }
    );

    let schedules = scheduleResponse.data;

    // 4. Return hasil ke client
    res.json({
      success: true,
      data: schedules,
      message: "Schedules fetched successfully from third party",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      data: [],
      message: err.message, 
    });
  }
};

// Fetch 4 data terbaru
export const getSchedules = async (req, res) => {
  try {
    const schedules = await TrxProgramSchedule.findAll({
      limit: 4,
      order: [["tpsd_date", "DESC"], ["tpsd_start_time", "ASC"]],
      include: [
        { model: MstProgram, attributes: ["mp_id", "mp_name", "mp_description"] },
        { model: MstBranch, attributes: ["mb_id", "mb_name", "mb_address", "mb_city"] },
        { model: MstCourt, attributes: ["mc_id", "mc_name", "mc_location"] },
        { model: MstTrainer, attributes: ["trainer_id", "trainer_name"] }
      ]
    });

    const result = schedules.map(schedule => {
      const s = schedule.toJSON();
      return {
        tpsd_id: s.tpsd_id,
        date: s.tpsd_date,
        start_time: s.tpsd_start_time,
        end_time: s.tpsd_end_time,
        status: s.tpsd_status,
        created_at: s.created_at,
        updated_at: s.updated_at,
        Program: s.MstProgram,
        Branch: s.MstBranch,
        Court: s.MstCourt,
        Trainer: s.MstTrainer
      };
    });

    res.json({
      success: true,
      data: result,
      message: "Program schedules fetched successfully"
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      data: [],
      message: err.message
    });
  }
};

// Fetch dengan pagination
export const getSchedulesWithPagination = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 4;
    const offset = (page - 1) * limit;

    const { count, rows } = await TrxProgramSchedule.findAndCountAll({
      limit,
      offset,
      order: [["tpsd_date", "DESC"], ["tpsd_start_time", "ASC"]],
      include: [
        { model: MstProgram, attributes: ["mp_id", "mp_name", "mp_description"] },
        { model: MstBranch, attributes: ["mb_id", "mb_name", "mb_address", "mb_city"] },
        { model: MstCourt, attributes: ["mc_id", "mc_name", "mc_location"] },
        { model: MstTrainer, attributes: ["trainer_id", "trainer_name"] }
      ]
    });

    const result = rows.map(schedule => {
      const s = schedule.toJSON();
      return {
        tpsd_id: s.tpsd_id,
        date: s.tpsd_date,
        start_time: s.tpsd_start_time,
        end_time: s.tpsd_end_time,
        status: s.tpsd_status,
        created_at: s.created_at,
        updated_at: s.updated_at,
        Program: s.MstProgram,
        Branch: s.MstBranch,
        Court: s.MstCourt,
        Trainer: s.MstTrainer
      };
    });

    res.json({
      success: true,
      data: result,
      meta: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit)
      },
      message: "Program schedules fetched successfully with pagination"
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      data: [],
      meta: {},
      message: err.message
    });
  }
};

export const getSchedulesWithFilters = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 4;
    const offset = (page - 1) * limit;

    const { branch_id, date } = req.query;

    // Build kondisi where secara dinamis
    const whereCondition = {};
    if (branch_id) whereCondition.mb_id = branch_id;
    if (date) whereCondition.tpsd_date = date; // format 'YYYY-MM-DD'

    const { count, rows } = await TrxProgramSchedule.findAndCountAll({
      where: whereCondition,
      limit,
      offset,
      order: [["tpsd_date", "DESC"], ["tpsd_start_time", "ASC"]],
      include: [
        { model: MstProgram, attributes: ["mp_id", "mp_name", "mp_description"] },
        { model: MstBranch, attributes: ["mb_id", "mb_name", "mb_address", "mb_city"] },
        { model: MstCourt, attributes: ["mc_id", "mc_name", "mc_location"] },
        { model: MstTrainer, attributes: ["trainer_id", "trainer_name"] }
      ]
    });

    const result = rows.map(schedule => {
      const s = schedule.toJSON();
      return {
        tpsd_id: s.tpsd_id,
        date: s.tpsd_date,
        start_time: s.tpsd_start_time,
        end_time: s.tpsd_end_time,
        status: s.tpsd_status,
        created_at: s.created_at,
        updated_at: s.updated_at,
        Program: s.MstProgram,
        Branch: s.MstBranch,
        Court: s.MstCourt,
        Trainer: s.MstTrainer
      };
    });

    res.json({
      success: true,
      data: result,
      meta: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit)
      },
      message: "Program schedules fetched successfully with filters"
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      data: [],
      meta: {},
      message: err.message
    });
  }
};

export const getWeeklySchedule = async (req, res) => {
  try {
    const { selectedAge, selectedBranch, selectedCourt, pickDate } = req.body;

    // 🔹 Validasi body
    if (!selectedAge || !selectedCourt || !pickDate) {
      return res.status(400).json({
        success: false,
        message: "Invalid request body. Required: selectedAge, selectedBranch, selectedCourt, pickDate"
      });
    }

    if (pickDate && !dayjs(pickDate, "YYYY-MM-DD", true).isValid()) {
      return res.status(400).json({
        success: false,
        message: "Invalid pickDate format. Expected YYYY-MM-DD"
      });
    }    

    // 1. Tentukan range tanggal berdasarkan pickDate
    let startDate, endDate;

    if (pickDate && pickDate !== "") {
      startDate = pickDate;
      endDate = pickDate;
      console.log("📅 Using specific date:", pickDate);
    } else {
      const today = dayjs();
      const startOfWeek = today.startOf("isoWeek");
      const endOfWeek = today.endOf("isoWeek");

      startDate = startOfWeek.format("YYYY-MM-DD");
      endDate = endOfWeek.format("YYYY-MM-DD");
      console.log("📅 Using current week range:", startDate, "to", endDate);
    }

    // 2. Default where clause
    let where = {
      tpsd_date: {
        [Op.between]: [startDate, endDate]
      }
    };

    if (selectedBranch && selectedBranch !== "All" && selectedBranch !== "") {
      where.mb_id = selectedBranch;
    }
    if (selectedCourt && selectedCourt !== "All" && selectedCourt !== "") {
      where.mc_id = selectedCourt;
    }
    if (selectedAge && selectedAge !== "All" && selectedAge !== "") {
      where.mpa_id = selectedAge;
    }

    // 3. Ambil semua court aktif
    const allCourts = await MstCourt.findAll({
      where: { mc_status: true },
      attributes: ["mc_id", "mc_name"],
      order: [["mc_name", "ASC"]]
    });

    // 4. Ambil data schedule
    const schedules = await TrxProgramSchedule.findAll({
      where,
      include: [
        { model: MstProgram, attributes: ["mp_name"] },
        { model: MstTrainer, attributes: ["trainer_name"] },
        { model: MstProgramAge, attributes: ["mpa_min", "mpa_max"] },
        { model: MstCourt, attributes: ["mc_name"] }
      ],
      order: [["tpsd_start_time", "ASC"]],
      raw: false,
      nest: true
    });

    // 5. Fixed slots 07:00 - 22:00 (16 slots)
    const timeSlots = Array.from({ length: 16 }, (_, i) =>
      `${(7 + i).toString().padStart(2, "0")}:00`
    );

    // 6. Inisialisasi court dengan null
    const grouped = {};
    allCourts.forEach(court => {
      grouped[court.mc_name] = Array.from({ length: 16 }, () => null);
    });

    // 7. Populate schedule termasuk endTime
    schedules.forEach(sch => {
      const room = sch.MstCourt?.mc_name || "Unknown";
      if (!grouped[room]) return;

      // Parse start time
      let startHour;
      let timeForDisplay;
      if (typeof sch.tpsd_start_time === "string") {
        const parts = sch.tpsd_start_time.split(":");
        startHour = parseInt(parts[0], 10);
        timeForDisplay = `${parts[0]}:${parts[1]}`;
      } else {
        const parsed = dayjs(sch.tpsd_start_time);
        startHour = parsed.hour();
        timeForDisplay = parsed.format("HH:mm");
      }

      // Parse end time
      let endHour;
      if (typeof sch.tpsd_end_time === "string") {
        endHour = parseInt(sch.tpsd_end_time.split(":")[0], 10);
      } else {
        endHour = dayjs(sch.tpsd_end_time).hour();
      }

      const startSlot = startHour - 7;
      const endSlot = endHour - 7;

      const slotData = {
        program: sch.MstProgram?.mp_name || "",
        age: sch.MstProgramAge ? `${sch.MstProgramAge.mpa_min}-${sch.MstProgramAge.mpa_max} Years` : "",
        time: timeForDisplay,
        instructor: sch.MstTrainer?.trainer_name || "",
        endTime: typeof sch.tpsd_end_time === "string" ? sch.tpsd_end_time.slice(0,5) : dayjs(sch.tpsd_end_time).format("HH:mm")
      };

      for (let i = startSlot; i < endSlot && i < grouped[room].length; i++) {
        grouped[room][i] = slotData;
      }
    });

    // 8. Format output
    const rows = Object.keys(grouped).map(room => ({
      room,
      schedules: grouped[room]
    }));

    return res.json({ success: true, data: rows });

  } catch (err) {
    console.error("❌ Error get weekly schedule:", err);
    return res.status(500).json({
      success: false,
      message: "Error get weekly schedule",
      error: err.message
    });
  }
};

export const getWeeklyScheduleMobile = async (req, res) => {
  try {
    const { selectedAge, selectedBranch, selectedCourt, pickDate } = req.body;

    // 🔹 Validasi body
    if (!selectedAge || !selectedCourt || !pickDate) {
      return res.status(400).json({
        success: false,
        message: "Invalid request body. Required: selectedAge, selectedBranch, selectedCourt, pickDate"
      });
    }

    if (pickDate && !dayjs(pickDate, "YYYY-MM-DD", true).isValid()) {
      return res.status(400).json({
        success: false,
        message: "Invalid pickDate format. Expected YYYY-MM-DD"
      });
    }    

    // 1. Tentukan range tanggal berdasarkan pickDate
    let startDate, endDate;

    if (pickDate && pickDate !== "") {
      startDate = pickDate;
      endDate = pickDate;
      console.log("📅 Using specific date:", pickDate);
    } else {
      const today = dayjs();
      const startOfWeek = today.startOf("isoWeek");
      const endOfWeek = today.endOf("isoWeek");

      startDate = startOfWeek.format("YYYY-MM-DD");
      endDate = endOfWeek.format("YYYY-MM-DD");
      console.log("📅 Using current week range:", startDate, "to", endDate);
    }

    // 2. Default where clause
    let where = {
      tpsd_date: {
        [Op.between]: [startDate, endDate]
      }
    };

    if (selectedBranch && selectedBranch !== "All" && selectedBranch !== "") {
      where.mb_id = selectedBranch;
    }
    if (selectedCourt && selectedCourt !== "All" && selectedCourt !== "") {
      where.mc_id = selectedCourt;
    }
    if (selectedAge && selectedAge !== "All" && selectedAge !== "") {
      where.mpa_id = selectedAge;
    }

    // 3. Ambil semua court aktif
    const allCourts = await MstCourt.findAll({
      where: { mc_status: true },
      attributes: ["mc_id", "mc_name"],
      order: [["mc_name", "ASC"]]
    });

    console.log("🏟️ Total courts from MstCourt:", allCourts.length);

    // 4. Ambil data schedule
    const schedules = await TrxProgramSchedule.findAll({
      where,
      include: [
        { model: MstProgram, attributes: ["mp_name"] },
        { model: MstTrainer, attributes: ["trainer_name"] },
        { model: MstProgramAge, attributes: ["mpa_min", "mpa_max"] },
        { model: MstCourt, attributes: ["mc_name"] }
      ],
      order: [["tpsd_start_time", "ASC"]],
      raw: false,
      nest: true
    });

    console.log("📊 Total schedules found:", schedules.length);

    // 5. Fixed slots 07:00 - 22:00 (16 slots)
    const timeSlots = Array.from({ length: 16 }, (_, i) =>
      `${(7 + i).toString().padStart(2, "0")}:00`
    );

    // 6. Inisialisasi semua court dengan null
    const grouped = {};
    allCourts.forEach(court => {
      grouped[court.mc_name] = Array.from({ length: 16 }, () => null);
    });

    console.log("🔧 Initialized courts:", Object.keys(grouped));

    // 7. Populate schedule termasuk endTime
    schedules.forEach(sch => {
      const room = sch.MstCourt?.mc_name || "Unknown";
      if (!grouped[room]) {
        console.log("⚠️ Court not found in MstCourt:", room);
        return;
      }

      // Parse start time
      let startHour;
      let timeForDisplay;
      if (typeof sch.tpsd_start_time === "string") {
        const parts = sch.tpsd_start_time.split(":");
        startHour = parseInt(parts[0], 10);
        timeForDisplay = `${parts[0]}:${parts[1]}`;
      } else {
        const parsed = dayjs(sch.tpsd_start_time);
        startHour = parsed.hour();
        timeForDisplay = parsed.format("HH:mm");
      }

      // Parse end time
      let endHour;
      if (typeof sch.tpsd_end_time === "string") {
        endHour = parseInt(sch.tpsd_end_time.split(":")[0], 10);
      } else {
        endHour = dayjs(sch.tpsd_end_time).hour();
      }

      const startSlot = startHour - 7;
      const endSlot = endHour - 7;

      const slotData = {
        program: sch.MstProgram?.mp_name || "",
        age: sch.MstProgramAge ? `${sch.MstProgramAge.mpa_min}-${sch.MstProgramAge.mpa_max} Years` : "",
        date: sch.tpsd_date,
        time: timeForDisplay,
        instructor: sch.MstTrainer?.trainer_name || "",
        endTime: typeof sch.tpsd_end_time === "string" ? sch.tpsd_end_time.slice(0,5) : dayjs(sch.tpsd_end_time).format("HH:mm")
      };

      for (let i = startSlot; i < endSlot && i < grouped[room].length; i++) {
        grouped[room][i] = slotData;
      }
    });

    // 8. Format hasil akhir
    const rows = Object.keys(grouped).map(room => ({
      room,
      schedules: grouped[room]
    }));

    return res.json({ success: true, data: rows });

  } catch (err) {
    console.error("❌ Error get weekly schedule mobile:", err);
    return res.status(500).json({
      success: false,
      message: "Error get weekly schedule mobile",
      error: err.message
    });
  }
};