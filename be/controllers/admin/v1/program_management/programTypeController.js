import { MstProgramType } from "../../../../models/mst_program_type/mst_program_type.js";
import { Op } from "sequelize";

/**
 * Helper untuk handle error Sequelize
 */
const handleSequelizeError = (err, res) => {
  if (
    err.name === "SequelizeValidationError" ||
    err.name === "SequelizeUniqueConstraintError"
  ) {
    const messages = err.errors.map((e) => e.message);
    return res
      .status(400)
      .json({ success: false, data: [], message: messages.join(", ") });
  }
  return res
    .status(500)
    .json({ success: false, data: [], message: err.message });
};

/**
 * GET ALL Program Types For Select
 */
export const getProgramTypeForSelect = async (req, res) => {
  try {
    const { mpt_id } = req.query; // optional filter

    const where = {
      mpt_status: true, // hanya yang aktif
    };
    if (mpt_id) where.mpt_id = mpt_id;

    const programTypes = await MstProgramType.findAll({
      where,
      order: [["mpt_id", "ASC"]],
    });

    res.json({
      success: true,
      data: programTypes,
      message: "Program Types fetched successfully",
    });
  } catch (err) {
    console.error("getProgramType error:", err);
    return handleSequelizeError(err, res);
  }
};