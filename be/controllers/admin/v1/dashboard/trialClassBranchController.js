import { Sequelize, Op, fn, col, where, literal } from "sequelize";
import { TrxTrialClass } from "../../../../models/trx_trial_class/trx_trial_class.js";
import { MstBranch } from "../../../../models/mst_branch/mst_branch.js";
import { MstProgram } from "../../../../models/mst_programs/mst_programs.js";
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

/**
 * POST: Top Trial Class per Branch
 */
export const getTopTrialClassBranch = async (req, res) => {
  try {
    const { month, year } = req.body;

    // 🧩 Filter by month & year dari created_at
    const dateFilter =
      month && month !== "All"
        ? where(fn("TO_CHAR", col("TrxTrialClass.created_at"), "YYYY-MM"), `${year}-${month}`)
        : where(fn("TO_CHAR", col("TrxTrialClass.created_at"), "YYYY"), `${year}`);

    const trials = await TrxTrialClass.findAll({
      attributes: [
        "ttc_id",
        "ttc_name",
        "ttc_dob",
        "ttc_email",
        "ttc_whatsapp",
        "ttc_day",
        "ttc_time",
        "ttc_status",
        "created_at",
      ],
      include: [
        {
          model: MstBranch,
          attributes: ["mb_name"],
        },
        {
          model: MstProgram,
          attributes: ["mp_name"],
        },
        {
          model: MstProgramAge,
          attributes: ["mpa_min", "mpa_max"],
        },
      ],
      where: dateFilter,
      order: [["created_at", "DESC"]],
    });

    // 🧮 Bentuk output seperti format yang diinginkan
    const data = trials.map((trial, index) => ({
      key: trial.ttc_id.toString(),
      no: index + 1,
      name: trial.ttc_name,
      dateOfBirth: trial.ttc_dob,
      ageCategory: trial.MstProgramAge
        ? `${trial.MstProgramAge.mpa_min} - ${trial.MstProgramAge.mpa_max} Years`
        : "-",
      email: trial.ttc_email || "-",
      whatsapp: trial.ttc_whatsapp || "-",
      branch: trial.MstBranch?.mb_name || "-",
      trialClass: trial.MstProgram?.mp_name || "-",
      day: trial.ttc_day,
      time: trial.ttc_time,
      status: trial.ttc_status,
    }));

    return res.json({
      success: true,
      data,
      message: "Top Trial Class per Branch fetched successfully",
    });
  } catch (err) {
    console.error("❌ Error fetching trial data:", err);
    handleSequelizeError(err, res);
  }
};

/**
 * POST: Participant Trial Class
 */
export const getParticipantTrialClass = async (req, res) => {
  try {
    const { month, year, branchId } = req.body;

    // Filter by date
    const dateFilter =
      month && month !== "All"
        ? where(fn("TO_CHAR", col("TrxTrialClass.created_at"), "YYYY-MM"), `${year}-${month}`)
        : where(fn("TO_CHAR", col("TrxTrialClass.created_at"), "YYYY"), `${year}`);

    // Filter by branch
    const branchFilter =
      branchId && branchId !== "All" ? { mb_id: branchId } : undefined;

    const trials = await TrxTrialClass.findAll({
      attributes: [
        "ttc_id",
        "ttc_name",
        "ttc_dob",
        "ttc_email",
        "ttc_whatsapp",
        "ttc_day",
        "ttc_time",
        "ttc_status",
        "created_at",
      ],
      include: [
        {
          model: MstBranch,
          attributes: ["mb_id", "mb_name"],
          where: branchFilter,
        },
        {
          model: MstProgram,
          attributes: ["mp_name"],
        },
        {
          model: MstProgramAge,
          attributes: ["mpa_min", "mpa_max"],
        },
      ],
      where: dateFilter,
      order: [["created_at", "DESC"]],
    });

    const data = trials.map((trial, index) => ({
      key: trial.ttc_id.toString(),
      no: index + 1,
      name: trial.ttc_name,
      dateOfBirth: trial.ttc_dob,
      ageCategory: trial.MstProgramAge
        ? `${trial.MstProgramAge.mpa_min} - ${trial.MstProgramAge.mpa_max} Years`
        : "-",
      email: trial.ttc_email || "-",
      whatsapp: trial.ttc_whatsapp || "-",
      branch: trial.MstBranch?.mb_name || "-",
      trialClass: trial.MstProgram?.mp_name || "-",
      day: trial.ttc_day,
      time: trial.ttc_time,
      status: trial.ttc_status,
    }));

    return res.json({
      success: true,
      data,
      message: "Participant Trial Class fetched successfully",
    });
  } catch (err) {
    console.error("❌ Error fetching trial participants:", err);
    handleSequelizeError(err, res);
  }
};

/**
 * POST: Average by Branch
 */
export const getAverageByBranch = async (req, res) => {
  try {
    const { month, year, branchId } = req.body;

    // Filter by date
    const dateFilter =
      month && month !== "All"
        ? where(fn("TO_CHAR", col("TrxTrialClass.created_at"), "YYYY-MM"), `${year}-${month}`)
        : where(fn("TO_CHAR", col("TrxTrialClass.created_at"), "YYYY"), `${year}`);

    // Filter by branch
    const branchFilter =
      branchId && branchId !== "All" ? { mb_id: branchId } : undefined;

    const trials = await TrxTrialClass.findAll({
      attributes: [
        "ttc_id",
        "ttc_name",
        "ttc_dob",
        "ttc_email",
        "ttc_whatsapp",
        "ttc_day",
        "ttc_time",
        "ttc_status",
        "created_at",
      ],
      include: [
        {
          model: MstBranch,
          attributes: ["mb_id", "mb_name"],
          where: branchFilter,
        },
        {
          model: MstProgram,
          attributes: ["mp_name"],
        },
        {
          model: MstProgramAge,
          attributes: ["mpa_min", "mpa_max"],
        },
      ],
      where: dateFilter,
      order: [["created_at", "DESC"]],
    });

    const data = trials.map((trial, index) => ({
      key: trial.ttc_id.toString(),
      no: index + 1,
      name: trial.ttc_name,
      dateOfBirth: trial.ttc_dob,
      ageCategory: trial.MstProgramAge
        ? `${trial.MstProgramAge.mpa_min} - ${trial.MstProgramAge.mpa_max} Years`
        : "-",
      email: trial.ttc_email || "-",
      whatsapp: trial.ttc_whatsapp || "-",
      branch: trial.MstBranch?.mb_name || "-",
      trialClass: trial.MstProgram?.mp_name || "-",
      day: trial.ttc_day,
      time: trial.ttc_time,
      status: trial.ttc_status,
    }));

    return res.json({
      success: true,
      data,
      message: "Participant Trial Class fetched successfully",
    });
  } catch (err) {
    console.error("❌ Error fetching trial participants:", err);
    handleSequelizeError(err, res);
  }
};


/**
 * POST: Count Participants per Age Range
 */
export const getParticipantsByAgeRange = async (req, res) => {
  try {
    const { month, year, branchId } = req.body;

    // Filter by month/year
    const dateFilter =
      month && month !== "All"
        ? where(fn("TO_CHAR", col("TrxTrialClass.created_at"), "YYYY-MM"), `${year}-${month}`)
        : where(fn("TO_CHAR", col("TrxTrialClass.created_at"), "YYYY"), `${year}`);

    // Filter by branch jika ada
    const branchFilter = branchId && branchId !== "All" ? { mb_id: branchId } : undefined;

    // Ambil semua peserta dengan relasi MstProgramAge
    const participants = await TrxTrialClass.findAll({
      attributes: ["ttc_id"],
      include: [
        {
          model: MstProgramAge,
          attributes: ["mpa_min", "mpa_max"],
        },
        {
          model: MstBranch,
          attributes: ["mb_id"],
          where: branchFilter,
        },
      ],
      where: dateFilter,
    });

    // Hitung jumlah peserta per rentang usia
    const ageCountsMap = {};
    participants.forEach((p) => {
      if (!p.MstProgramAge) return;
      const range = `${p.MstProgramAge.mpa_min} - ${p.MstProgramAge.mpa_max}`;
      ageCountsMap[range] = (ageCountsMap[range] || 0) + 1;
    });

    // Konversi ke array & urutkan
    const data = Object.entries(ageCountsMap)
      .map(([range, count]) => ({ range, count }))
      .sort((a, b) => parseInt(a.range.split(" - ")[0]) - parseInt(b.range.split(" - ")[0]));

    return res.json({
      success: true,
      data,
      message: "Participant count per age range fetched successfully",
    });
  } catch (err) {
    console.error("❌ Error fetching age range counts:", err);
    handleSequelizeError(err, res);
  }
};


export const getMonthlyParticipantsByBranch = async (req, res) => {
  try {
    const { year, branchId } = req.body;

    if (!year) {
      return res.status(400).json({ success: false, data: [], message: "Year is required" });
    }

    // Ambil semua branch
    const branchFilter = branchId && branchId !== "All" ? { mb_id: branchId } : {};
    const branches = await MstBranch.findAll({
      attributes: ["mb_id", "mb_name"],
      where: branchFilter,
    });

    if (!branches.length) {
      return res.status(404).json({ success: false, data: [], message: "No branches found" });
    }

    const branchNames = branches.map(b => b.mb_name);

    // Array bulan
    const months = [
      { value: "01", name: "Jan" },
      { value: "02", name: "Feb" },
      { value: "03", name: "Mar" },
      { value: "04", name: "Apr" },
      { value: "05", name: "May" },
      { value: "06", name: "Jun" },
      { value: "07", name: "Jul" },
      { value: "08", name: "Aug" },
      { value: "09", name: "Sep" },
      { value: "10", name: "Oct" },
      { value: "11", name: "Nov" },
      { value: "12", name: "Dec" },
    ];

    // Ambil peserta tahun tertentu
    const trials = await TrxTrialClass.findAll({
      attributes: [
        "ttc_id",
        [fn("TO_CHAR", col("TrxTrialClass.created_at"), "MM"), "month"],
      ],
      include: [
        {
          model: MstBranch,
          attributes: ["mb_id", "mb_name"],
          where: branchFilter,
        },
      ],
      where: where(fn("TO_CHAR", col("TrxTrialClass.created_at"), "YYYY"), year.toString()),
    });

    // Build data output
    const data = months.map((m) => {
      const monthData = { name: m.name };

      branchNames.forEach(branch => {
        const count = trials.filter(
          t => t.MstBranch?.mb_name === branch && t.getDataValue("month") === m.value
        ).length;
        monthData[branch] = count; // default 0 jika tidak ada
      });

      return monthData;
    });

    return res.json({
      success: true,
      data,
      message: "Monthly participants per branch fetched successfully",
    });

  } catch (err) {
    console.error("❌ Error fetching monthly participants by branch:", err);
    return res.status(500).json({ success: false, data: [], message: err.message });
  }
};
