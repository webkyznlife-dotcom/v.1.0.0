import { TrxTrialClass } from "../../../../models/trx_trial_class/trx_trial_class.js";
import { MstBranch } from "../../../../models/mst_branch/mst_branch.js";
import { MstProgramAge } from "../../../../models/mst_program_ages/mst_program_ages.js";
import { MstProgram } from "../../../../models/mst_programs/mst_programs.js";

import { Op } from "sequelize";

/**
 * Helper untuk handle error Sequelize
 */
const handleSequelizeError = (err, res) => {
  if (err.name === "SequelizeValidationError" || err.name === "SequelizeUniqueConstraintError") {
    const messages = err.errors.map(e => e.message);
    return res.status(400).json({
      success: false,
      data: [],
      message: messages.join(", "),
    });
  }
  return res.status(500).json({
    success: false,
    data: [],
    message: err.message,
  });
};

// Get all trial classes
export const getTrialClasses = async (req, res) => {
  try {
    const { status, mb_id } = req.query; // optional filter
    const where = {};

    if (status) where.ttc_status = status;
    if (mb_id) where.mb_id = mb_id;

    const trialClasses = await TrxTrialClass.findAll({
      where,
      include: [
        {
          model: MstBranch,
          attributes: ["mb_id", "mb_name"],
          required: false,
        },
        {
          model: MstProgramAge,
          attributes: ["mpa_id", "mpa_min", "mpa_max"], // ✅ sesuai struktur tabel
          required: false,
        },
        {
          model: MstProgram,
          attributes: ["mp_id", "mp_name"],
          required: false,
        },
      ],
      order: [["ttc_id", "DESC"]],
    });

    res.json({
      success: true,
      data: trialClasses,
      message: "Trial classes fetched successfully",
    });
  } catch (err) {
    return handleSequelizeError(err, res);
  }
};

// Update single trial class status
export const updateTrialClassStatus = async (req, res) => {
  try {
    const { ttc_id } = req.params;
    const { ttc_status } = req.body;

    if (!ttc_id) {
      return res.status(400).json({
        success: false,
        data: [],
        message: "ttc_id is required",
      });
    }

    if (!ttc_status || !["PENDING", "CONFIRMED", "CANCELLED"].includes(ttc_status)) {
      return res.status(400).json({
        success: false,
        data: [],
        message: "Valid ttc_status is required (PENDING, CONFIRMED, CANCELLED)",
      });
    }

    const trialClass = await TrxTrialClass.findByPk(ttc_id);
    if (!trialClass) {
      return res.status(404).json({
        success: false,
        data: [],
        message: "Trial Class not found",
      });
    }

    trialClass.ttc_status = ttc_status;
    await trialClass.save();

    return res.json({
      success: true,
      data: trialClass,
      message: "Trial Class status updated successfully",
    });
  } catch (err) {
    return handleSequelizeError(err, res);
  }
};

// Update multiple trial classes status
export const updateMultipleTrialClasses = async (req, res) => {
  try {
    const { ids, ttc_status } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        data: [],
        message: "ids must be a non-empty array",
      });
    }

    if (!ttc_status || !["PENDING", "CONFIRMED", "CANCELLED"].includes(ttc_status)) {
      return res.status(400).json({
        success: false,
        data: [],
        message: "Valid ttc_status is required (PENDING, CONFIRMED, CANCELLED)",
      });
    }

    const [updatedCount] = await TrxTrialClass.update(
      { ttc_status },
      { where: { ttc_id: ids } }
    );

    if (updatedCount === 0) {
      return res.status(404).json({
        success: false,
        data: [],
        message: "No Trial Classes found to update",
      });
    }

    return res.json({
      success: true,
      data: { updatedCount, ids, ttc_status },
      message: `Successfully updated ${updatedCount} trial classes`,
    });
  } catch (err) {
    return handleSequelizeError(err, res);
  }
};