import { MstProgramKeyPoint } from "../../../../models/mst_program_key_points/mst_program_key_points.js";
import { MstProgram } from "../../../../models/mst_programs/mst_programs.js";
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
 * GET ALL Key Points
 */
export const getKeyPoints = async (req, res) => {
  try {
    const { mp_id, status } = req.query; // optional filter

    const where = {};
    if (mp_id) where.mp_id = mp_id;
    if (status !== undefined) where.status = status === "true";

    const keyPoints = await MstProgramKeyPoint.findAll({
      where,
      order: [["mpkp_id", "ASC"]],
      include: [
        {
          model: MstProgram,
          attributes: ["mp_id", "mp_name"],
          required: false,
        },
      ],
    });

    res.json({
      success: true,
      data: keyPoints,
      message: "Key Points fetched successfully",
    });
  } catch (err) {
    console.error("getKeyPoints error:", err);
    return handleSequelizeError(err, res);
  }
};

/**
 * CREATE Key Point
 */
export const createKeyPoint = async (req, res) => {
  try {
    const { mp_id, key_point } = req.body;

    if (!mp_id || !key_point) {
      return res.status(400).json({
        success: false,
        message: "mp_id and key_point are required",
      });
    }

    // Hitung jumlah key point yang sudah ada untuk mp_id ini
    const count = await MstProgramKeyPoint.count({ where: { mp_id } });
    const finalSortOrder = count + 1;

    const newKeyPoint = await MstProgramKeyPoint.create({
      mp_id,
      key_point,
      sort_order: finalSortOrder,
      status: true,
    });

    res.json({
      success: true,
      data: newKeyPoint,
      message: "Key Point created successfully",
    });
  } catch (err) {
    console.error("createKeyPoint error:", err);
    return handleSequelizeError(err, res);
  }
};

/**
 * UPDATE Key Point
 */
export const updateKeyPoint = async (req, res) => {
  try {
    const { mpkp_id } = req.params;
    const { mp_id, key_point, status } = req.body;

    const keyPoint = await MstProgramKeyPoint.findByPk(mpkp_id);
    if (!keyPoint) {
      return res.status(404).json({
        success: false,
        message: "Key Point not found",
      });
    }

    await keyPoint.update({
      mp_id,
      key_point,
      status,
      updated_at: new Date(),
    });

    res.json({
      success: true,
      data: keyPoint,
      message: "Key Point updated successfully",
    });
  } catch (err) {
    console.error("updateKeyPoint error:", err);
    return handleSequelizeError(err, res);
  }
};

/**
 * SOFT DELETE Key Point (by id)
 */
// Soft delete key point
export const deleteKeyPoint = async (req, res) => {
  try {
    const { mpkp_id } = req.params;

    if (!mpkp_id) {
      return res.status(400).json({
        success: false,
        data: [],
        message: "mpkp_id is required"
      });
    }

    const keyPoint = await MstProgramKeyPoint.findByPk(mpkp_id);

    if (!keyPoint) {
      return res.status(404).json({
        success: false,
        data: [],
        message: "Key Point not found"
      });
    }

    if (!keyPoint.status) {
      return res.status(400).json({
        success: false,
        data: { mpkp_id },
        message: "Key Point is already inactive"
      });
    }

    await keyPoint.update({ status: false, updated_at: new Date() });

    res.status(200).json({
      success: true,
      data: { mpkp_id },
      message: "Key Point has been deactivated (soft deleted)"
    });

  } catch (err) {
    console.error("deleteKeyPoint error:", err);
    res.status(500).json({
      success: false,
      data: [],
      message: err.message
    });
  }
};

// ===== SOFT DELETE MULTIPLE KEY POINTS =====
export const deleteMultipleKeyPoints = async (req, res) => {
  try {
    const { mpkp_ids } = req.body; // ekspektasi: [1,2,3]
    if (!mpkp_ids || !Array.isArray(mpkp_ids) || mpkp_ids.length === 0) {
      return res.status(400).json({
        success: false,
        data: [],
        message: "mpkp_ids must be a non-empty array",
      });
    }

    // Ambil semua key points berdasarkan mpkp_ids
    const keyPoints = await MstProgramKeyPoint.findAll({ where: { mpkp_id: mpkp_ids } });
    if (keyPoints.length === 0) {
      return res.status(404).json({
        success: false,
        data: [],
        message: "No key points found for provided IDs",
      });
    }

    const results = [];
    for (const kp of keyPoints) {
      if (!kp.status) {
        results.push({ mpkp_id: kp.mpkp_id, status: "already inactive" });
      } else {
        await kp.update({ status: false, updated_at: new Date() });
        results.push({ mpkp_id: kp.mpkp_id, status: "deactivated" });
      }
    }

    res.status(200).json({
      success: true,
      data: results,
      message: "Key Points processed successfully",
    });
  } catch (err) {
    console.error("deleteMultipleKeyPoints error:", err);
    return handleSequelizeError(err, res);
  }
};
