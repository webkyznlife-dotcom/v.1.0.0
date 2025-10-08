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

export const createTrialClass = async (req, res) => {
  try {
    const {
      ttc_name,
      ttc_dob,
      ttc_email,
      ttc_whatsapp,
      mb_id = null,
      mpa_id = null,
      mp_id = null,
      ttc_day,
      ttc_time,
      ttc_terms_accepted,
      ttc_marketing_opt_in = false,
      ttc_status = "PENDING"
    } = req.body;

    // Validasi minimal
    if (!ttc_name || !ttc_dob || !ttc_day || !ttc_time) {
      return res.status(400).json({
        success: false,
        data: [],
        message: "ttc_name, ttc_dob, ttc_day, and ttc_time are required",
      });
    }

    // Pastikan terms accepted wajib
    if (!ttc_terms_accepted) {
      return res.status(400).json({
        success: false,
        data: [],
        message: "Terms must be accepted"
      });
    }

    // Validasi foreign key
    if (mb_id) {
      const branch = await MstBranch.findByPk(mb_id);
      if (!branch) {
        return res.status(400).json({
          success: false,
          data: [],
          message: `mb_id ${mb_id} not found`
        });
      }
    }

    if (mp_id) {
      const program = await MstProgram.findByPk(mp_id);
      if (!program) {
        return res.status(400).json({
          success: false,
          data: [],
          message: `mp_id ${mp_id} not found`
        });
      }
    }

    if (mpa_id) {
      const age = await MstProgramAge.findByPk(mpa_id);
      if (!age) {
        return res.status(400).json({
          success: false,
          data: [],
          message: `mpa_id ${mpa_id} not found`
        });
      }
    }

    // Buat trial class baru
    const newTrialClass = await TrxTrialClass.create({
      ttc_name,
      ttc_dob,
      ttc_email,
      ttc_whatsapp,
      mb_id,
      mpa_id,
      mp_id,
      ttc_day,
      ttc_time,
      ttc_terms_accepted,
      ttc_marketing_opt_in,
      ttc_status
    });

    // Fetch data lengkap dengan relasi
    const trialClassFull = await TrxTrialClass.findByPk(newTrialClass.ttc_id, {
      include: [
        { model: MstBranch, attributes: ["mb_id", "mb_name"], required: false },
        { model: MstProgramAge, attributes: ["mpa_id", "mpa_min", "mpa_max"], required: false },
        { model: MstProgram, attributes: ["mp_id", "mp_name"], required: false },
      ]
    });

    return res.json({
      success: true,
      data: trialClassFull,
      message: "Trial Class created successfully",
    });
  } catch (err) {
    return handleSequelizeError(err, res);
  }
};