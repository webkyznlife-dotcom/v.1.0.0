import { Op } from "sequelize";
import { TrxProgramSchedule } from "../../../../models/trx_program_schedules/trx_program_schedules.js";
import { MstBranch } from "../../../../models/mst_branch/mst_branch.js";
import { MstProgram } from "../../../../models/mst_programs/mst_programs.js";
import { MstTrainer } from "../../../../models/mst_trainers/mst_trainers.js";
import { MstCourt } from "../../../../models/mst_courts/mst_courts.js";
import { MstProgramAge } from "../../../../models/mst_program_ages/mst_program_ages.js";

/**
 * Helper untuk handle error Sequelize
 */
const handleSequelizeError = (err, res) => {
  if (err.name === "SequelizeValidationError" || err.name === "SequelizeUniqueConstraintError") {
    const messages = err.errors.map(e => e.message);
    return res.status(400).json({ success: false, data: [], message: messages.join(", ") });
  }
  return res.status(500).json({ success: false, data: [], message: err.message });
};

// ===== GET ALL SCHEDULES DENGAN JOIN SEMUA RELASI =====
export const getAllSchedule = async (req, res) => {
  try {
    const schedules = await TrxProgramSchedule.findAll({
      include: [
        { model: MstProgram, attributes: ["mp_id", "mp_name", "mp_description"] },
        { model: MstBranch, attributes: ["mb_id", "mb_name", "mb_city", "mb_province"] },
        { model: MstCourt, attributes: ["mc_id", "mc_name", "mc_type"] },
        { model: MstTrainer, attributes: ["trainer_id", "trainer_name", "trainer_speciality"] },
        { model: MstProgramAge, attributes: ["mpa_id", "mpa_min", "mpa_max"] }
      ],
      order: [
        ["tpsd_id", "ASC"]
      ]
    });

    res.json({
      success: true,
      data: schedules,
      message: "Schedules fetched successfully"
    });
  } catch (err) {
    handleSequelizeError(err, res);
  }
};

// ===== CREATE SCHEDULE =====
export const createSchedule = async (req, res) => {
  try {
    const {
      mp_id,
      mb_id,
      mc_id,
      tpsd_date,
      tpsd_start_time,
      tpsd_end_time,
      trainer_id,
      mpa_id
    } = req.body;

    // ✅ Validasi required fields
    if (!mp_id || !mb_id || !mc_id || !tpsd_date || !tpsd_start_time || !tpsd_end_time) {
      return res.status(400).json({ success: false, data: [], message: "Missing required fields" });
    }

    // ✅ Cek apakah jadwal sudah ada untuk kombinasi program + court + tanggal
    const existingSchedule = await TrxProgramSchedule.findOne({
      where: {
        mp_id,
        mc_id,
        tpsd_date,
        tpsd_status: true  // hanya cek yang masih aktif
      }
    });

    if (existingSchedule) {
      return res.status(400).json({
        success: false,
        data: [],
        message: "Schedule already exists for this program and court on the selected date"
      });
    }

    // ✅ Cek tumpang tindih waktu
    const overlappingSchedule = await TrxProgramSchedule.findOne({
      where: {
        mc_id,
        tpsd_date,
        tpsd_status: true,
        [Op.or]: [
          {
            tpsd_start_time: { [Op.between]: [tpsd_start_time, tpsd_end_time] }
          },
          {
            tpsd_end_time: { [Op.between]: [tpsd_start_time, tpsd_end_time] }
          },
          {
            [Op.and]: [
              { tpsd_start_time: { [Op.lte]: tpsd_start_time } },
              { tpsd_end_time: { [Op.gte]: tpsd_end_time } }
            ]
          }
        ]
      }
    });

    if (overlappingSchedule) {
      return res.status(400).json({
        success: false,
        data: [],
        message: "There is already a schedule in the selected time range for this court"
      });
    }    

    // ✅ Buat schedule baru
    const newSchedule = await TrxProgramSchedule.create({
      mp_id,
      mb_id,
      mc_id,
      tpsd_date,
      tpsd_start_time,
      tpsd_end_time,
      trainer_id: trainer_id || null,
      mpa_id: mpa_id || null
    });

    // ✅ Fetch detail lengkap dengan relasi
    const scheduleWithRelations = await TrxProgramSchedule.findByPk(newSchedule.tpsd_id, {
      include: [
        { model: MstProgram, attributes: ["mp_id", "mp_name"] },
        { model: MstBranch, attributes: ["mb_id", "mb_name"] },
        { model: MstCourt, attributes: ["mc_id", "mc_name"] },
        { model: MstTrainer, attributes: ["trainer_id", "trainer_name"] },
        { model: MstProgramAge, attributes: ["mpa_id", "mpa_min", "mpa_max"] }
      ]
    });

    res.status(201).json({
      success: true,
      data: scheduleWithRelations,
      message: "Schedule created successfully"
    });

  } catch (err) {
    console.error(err);
    handleSequelizeError(err, res);
  }
};

export const updateSchedule = async (req, res) => {
  try {
    const { tpsd_id } = req.params;
    const {
      mp_id,
      mb_id,
      mc_id,
      tpsd_date,
      tpsd_start_time,
      tpsd_end_time,
      trainer_id,
      mpa_id,
      tpsd_status
    } = req.body;

    // ✅ Cek apakah schedule ada
    const schedule = await TrxProgramSchedule.findByPk(tpsd_id);
    if (!schedule) {
      return res.status(404).json({ success: false, data: [], message: "Schedule not found" });
    }

    // ✅ Cek overlap / duplikat di DB
    if (mp_id && mc_id && tpsd_date && tpsd_start_time && tpsd_end_time) {
      const overlappingSchedule = await TrxProgramSchedule.findOne({
        where: {
          mc_id,
          tpsd_date,
          tpsd_status: true,
          tpsd_id: { [Op.ne]: tpsd_id }, // exclude dirinya sendiri
          [Op.or]: [
            {
              tpsd_start_time: { [Op.between]: [tpsd_start_time, tpsd_end_time] }
            },
            {
              tpsd_end_time: { [Op.between]: [tpsd_start_time, tpsd_end_time] }
            },
            {
              [Op.and]: [
                { tpsd_start_time: { [Op.lte]: tpsd_start_time } },
                { tpsd_end_time: { [Op.gte]: tpsd_end_time } }
              ]
            }
          ]
        }
      });

      if (overlappingSchedule) {
        // ✅ Cek apakah duplikat persis start, end, trainer
        if (
          overlappingSchedule.tpsd_start_time === tpsd_start_time &&
          overlappingSchedule.tpsd_end_time === tpsd_end_time &&
          overlappingSchedule.trainer_id === trainer_id
        ) {
          return res.status(400).json({
            success: false,
            data: [],
            message: "Duplicate schedule exists for this program, court, date, and trainer"
          });
        }

        return res.status(400).json({
          success: false,
          data: [],
          message: `Schedule time conflict with another schedule (ID: ${overlappingSchedule.tpsd_id})`
        });
      }
    }

    // ✅ Update data
    await schedule.update({
      mp_id: mp_id || schedule.mp_id,
      mb_id: mb_id || schedule.mb_id,
      mc_id: mc_id || schedule.mc_id,
      tpsd_date: tpsd_date || schedule.tpsd_date,
      tpsd_start_time: tpsd_start_time || schedule.tpsd_start_time,
      tpsd_end_time: tpsd_end_time || schedule.tpsd_end_time,
      trainer_id: trainer_id !== undefined ? trainer_id : schedule.trainer_id,
      mpa_id: mpa_id !== undefined ? mpa_id : schedule.mpa_id,
      tpsd_status: tpsd_status !== undefined ? tpsd_status : schedule.tpsd_status,
      updated_at: new Date()
    });

    // ✅ Ambil data lengkap dengan relasi
    const updatedSchedule = await TrxProgramSchedule.findByPk(schedule.tpsd_id, {
      include: [
        { model: MstProgram, attributes: ["mp_id", "mp_name"] },
        { model: MstBranch, attributes: ["mb_id", "mb_name"] },
        { model: MstCourt, attributes: ["mc_id", "mc_name"] },
        { model: MstTrainer, attributes: ["trainer_id", "trainer_name"] },
        { model: MstProgramAge, attributes: ["mpa_id", "mpa_min", "mpa_max"] }
      ]
    });

    res.json({
      success: true,
      data: updatedSchedule,
      message: "Schedule updated successfully"
    });

  } catch (err) {
    console.error(err);
    handleSequelizeError(err, res);
  }
};


// ===== SOFT DELETE SINGLE SCHEDULE =====
export const deleteSchedule = async (req, res) => {
  try {
    const { tpsd_id } = req.params;
    if (!tpsd_id) {
      return res.status(400).json({ success: false, data: [], message: "tpsd_id is required" });
    }

    const schedule = await TrxProgramSchedule.findByPk(tpsd_id);
    if (!schedule) {
      return res.status(404).json({ success: false, data: [], message: "Schedule not found" });
    }

    if (!schedule.tpsd_status) {
      return res.status(400).json({
        success: false,
        data: { tpsd_id },
        message: "Schedule already inactive"
      });
    }

    await schedule.update({ tpsd_status: false, updated_at: new Date() });

    res.status(200).json({
      success: true,
      data: { tpsd_id },
      message: "Schedule deactivated (soft deleted)"
    });

  } catch (err) {
    handleSequelizeError(err, res);
  }
};

// ===== SOFT DELETE MULTIPLE SCHEDULES =====
export const deleteMultipleSchedule = async (req, res) => {
  try {
    const { tpsd_ids } = req.body; // ekspektasi: [1,2,3]

    if (!tpsd_ids || !Array.isArray(tpsd_ids) || tpsd_ids.length === 0) {
      return res.status(400).json({
        success: false,
        data: [],
        message: "tpsd_ids must be a non-empty array"
      });
    }

    const schedules = await TrxProgramSchedule.findAll({
      where: { tpsd_id: tpsd_ids }
    });

    if (schedules.length === 0) {
      return res.status(404).json({
        success: false,
        data: [],
        message: "No schedules found for provided IDs"
      });
    }

    const results = [];
    for (const sc of schedules) {
      if (!sc.tpsd_status) {
        results.push({ tpsd_id: sc.tpsd_id, status: "already inactive" });
      } else {
        await sc.update({ tpsd_status: false, updated_at: new Date() });
        results.push({ tpsd_id: sc.tpsd_id, status: "deactivated" });
      }
    }

    res.status(200).json({
      success: true,
      data: results,
      message: "Schedules processed successfully"
    });
  } catch (err) {
    handleSequelizeError(err, res);
  }
};
