import { Op } from "sequelize";
import { MstBranchMap } from "../../../../../models/mst_branch_map/mst_branch_map.js";
import { MstBranch } from "../../../../../models/mst_branch/mst_branch.js";

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

// ===== GET ALL MAPS =====
export const getBranchMaps = async (req, res) => {
  try {
    const maps = await MstBranchMap.findAll({
      include: [
        {
          model: MstBranch,
          attributes: ["mb_id", "mb_name"], // pilih kolom yg perlu
        },
      ],
      order: [["mbm_id", "ASC"]],
    });

    res.json({
      success: true,
      data: maps,
      message: "Branch maps fetched successfully",
    });
  } catch (err) {
    console.error(err);
    handleSequelizeError(err, res);
  }
};

// ===== CREATE MAP =====
export const createBranchMap = async (req, res) => {
  try {
    let { mb_id, mbm_title, mbm_url, mbm_status } = req.body;

    if (!mb_id)
      return res
        .status(400)
        .json({ success: false, data: [], message: "mb_id is required" });
    if (!mbm_title)
      return res
        .status(400)
        .json({ success: false, data: [], message: "mbm_title is required" });
    if (!mbm_url)
      return res
        .status(400)
        .json({ success: false, data: [], message: "mbm_url is required" });

    mbm_title = mbm_title.trim();
    mbm_url = mbm_url.trim();

    // Cek apakah sudah ada map untuk mb_id ini
    const existingBranchMap = await MstBranchMap.findOne({ where: { mb_id } });
    if (existingBranchMap) {
      return res.status(400).json({
        success: false,
        data: [],
        message: "This branch already has a map assigned",
      });
    }

    const newMap = await MstBranchMap.create({
      mb_id,
      mbm_title,
      mbm_url,
      mbm_status: mbm_status !== undefined ? mbm_status : true,
      created_at: new Date(),
      updated_at: new Date(),
    });

    return res.status(201).json({
      success: true,
      data: newMap,
      message: "Branch map created successfully",
    });
  } catch (err) {
    console.error(err);
    return handleSequelizeError(err, res);
  }
};


// ===== UPDATE MAP =====
export const updateBranchMap = async (req, res) => {
  try {
    const { mbm_id } = req.params;
    let { mb_id, mbm_title, mbm_url, mbm_status } = req.body;

    if (!mbm_id)
      return res
        .status(400)
        .json({ success: false, data: [], message: "mbm_id is required" });
    if (!mb_id)
      return res
        .status(400)
        .json({ success: false, data: [], message: "mb_id is required" });
    if (!mbm_title)
      return res
        .status(400)
        .json({ success: false, data: [], message: "mbm_title is required" });
    if (!mbm_url)
      return res
        .status(400)
        .json({ success: false, data: [], message: "mbm_url is required" });

    mbm_title = mbm_title.trim();
    mbm_url = mbm_url.trim();

    const map = await MstBranchMap.findByPk(mbm_id);
    if (!map)
      return res
        .status(404)
        .json({ success: false, data: [], message: "Branch map not found" });

    // ===== Validasi: hanya boleh 1 map per branch (exclude current record) =====
    const branchMapExist = await MstBranchMap.findOne({
      where: {
        mb_id,
        mbm_id: { [Op.ne]: mbm_id }, // abaikan data yg sedang diupdate
      },
    });

    if (branchMapExist) {
      return res.status(400).json({
        success: false,
        data: [],
        message: "This branch already has another map",
      });
    }

    // ===== Validasi judul unik per branch (exclude current record) =====
    const existing = await MstBranchMap.findOne({
      where: { mb_id, mbm_title, mbm_id: { [Op.ne]: mbm_id } },
    });
    if (existing) {
      return res.status(400).json({
        success: false,
        data: [],
        message: "Branch map with this title already exists for this branch",
      });
    }

    await map.update({
      mb_id,
      mbm_title,
      mbm_url,
      mbm_status: mbm_status !== undefined ? mbm_status : map.mbm_status,
      updated_at: new Date(),
    });

    return res.status(200).json({
      success: true,
      data: map,
      message: "Branch map updated successfully",
    });
  } catch (err) {
    console.error(err);
    return handleSequelizeError(err, res);
  }
};


// ===== SOFT DELETE SINGLE MAP =====
export const deleteBranchMap = async (req, res) => {
  try {
    const { mbm_id } = req.params;
    if (!mbm_id)
      return res
        .status(400)
        .json({ success: false, data: [], message: "mbm_id is required" });

    const map = await MstBranchMap.findByPk(mbm_id);
    if (!map)
      return res
        .status(404)
        .json({ success: false, data: [], message: "Branch map not found" });

    if (!map.mbm_status)
      return res.status(400).json({
        success: false,
        data: { mbm_id },
        message: "Branch map already inactive",
      });

    await map.update({ mbm_status: false, updated_at: new Date() });

    res.status(200).json({
      success: true,
      data: { mbm_id },
      message: "Branch map deactivated (soft deleted)",
    });
  } catch (err) {
    handleSequelizeError(err, res);
  }
};

// ===== SOFT DELETE MULTIPLE MAPS =====
export const deleteMultipleBranchMap = async (req, res) => {
  try {
    const { mbm_ids } = req.body; // ekspektasi: [1,2,3]
    if (!mbm_ids || !Array.isArray(mbm_ids) || mbm_ids.length === 0) {
      return res.status(400).json({
        success: false,
        data: [],
        message: "mbm_ids must be a non-empty array",
      });
    }

    const maps = await MstBranchMap.findAll({ where: { mbm_id: mbm_ids } });
    if (maps.length === 0)
      return res.status(404).json({
        success: false,
        data: [],
        message: "No branch maps found for provided IDs",
      });

    const results = [];
    for (const map of maps) {
      if (!map.mbm_status)
        results.push({ mbm_id: map.mbm_id, status: "already inactive" });
      else {
        await map.update({ mbm_status: false, updated_at: new Date() });
        results.push({ mbm_id: map.mbm_id, status: "deactivated" });
      }
    }

    res.status(200).json({
      success: true,
      data: results,
      message: "Branch maps processed successfully",
    });
  } catch (err) {
    handleSequelizeError(err, res);
  }
};
