import { Op } from "sequelize";
import { MstBranchCourt } from "../../../../../models/mst_branch_courts/mst_branch_courts.js";
import { MstBranch } from "../../../../../models/mst_branch/mst_branch.js";
import { MstCourt } from "../../../../../models/mst_courts/mst_courts.js";

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

// ===== GET ALL BRANCH COURTS =====
export const getBranchCourts = async (req, res) => {
  try {
    const courts = await MstBranchCourt.findAll({
      include: [
        { model: MstBranch, attributes: ["mb_id", "mb_name"] },
        { model: MstCourt, attributes: ["mc_id", "mc_name", "mc_type"] }
      ],
      order: [["mbc_id", "ASC"]]
    });

    res.json({
      success: true,
      data: courts,
      message: "Branch courts fetched successfully"
    });
  } catch (err) {
    handleSequelizeError(err, res);
  }
};

// ===== CREATE BRANCH COURT =====
export const createBranchCourt = async (req, res) => {
  try {
    let { mb_id, mc_id, mbc_status } = req.body;

    if (!mb_id) return res.status(400).json({ success: false, data: [], message: "mb_id is required" });
    if (!mc_id) return res.status(400).json({ success: false, data: [], message: "mc_id is required" });

    // Pastikan court ada
    const court = await MstCourt.findByPk(mc_id);
    if (!court) {
      return res.status(404).json({ success: false, data: [], message: "Court not found" });
    }

    // Cek duplikat branch + court
    const existing = await MstBranchCourt.findOne({ where: { mb_id, mc_id } });
    if (existing) {
      return res.status(400).json({ success: false, data: [], message: "This branch already has the court assigned" });
    }

    const newBranchCourt = await MstBranchCourt.create({
      mb_id,
      mc_id,
      mbc_status: mbc_status !== undefined ? mbc_status : true,
      created_at: new Date(),
      updated_at: new Date()
    });

    return res.status(201).json({
      success: true,
      data: newBranchCourt,
      message: "Branch court assigned successfully"
    });

  } catch (err) {
    console.error(err);
    return handleSequelizeError(err, res);
  }
};

// ===== UPDATE BRANCH COURT =====
export const updateBranchCourt = async (req, res) => {
  try {
    const { mbc_id } = req.params;
    let { mb_id, mc_id, mbc_status } = req.body;

    if (!mbc_id)
      return res.status(400).json({ success: false, data: [], message: "mbc_id is required" });
    if (!mb_id)
      return res.status(400).json({ success: false, data: [], message: "mb_id is required" });
    if (!mc_id)
      return res.status(400).json({ success: false, data: [], message: "mc_id is required" });

    // Ambil record yang mau diupdate
    const branchCourt = await MstBranchCourt.findByPk(mbc_id);
    if (!branchCourt) {
      return res.status(404).json({ success: false, data: [], message: "Branch court not found" });
    }

    // Pastikan court ada
    const court = await MstCourt.findByPk(mc_id);
    if (!court) {
      return res.status(404).json({ success: false, data: [], message: "Court not found" });
    }

    // Update record
    await branchCourt.update({
      mb_id,
      mc_id,
      mbc_status: mbc_status !== undefined ? mbc_status : branchCourt.mbc_status,
      updated_at: new Date()
    });

    return res.status(200).json({
      success: true,
      data: branchCourt,
      message: "Branch court updated successfully"
    });

  } catch (err) {
    console.error(err);
    return handleSequelizeError(err, res);
  }
};

// ===== SOFT DELETE SINGLE BRANCH COURT =====
export const deleteBranchCourt = async (req, res) => {
  try {
    const { mbc_id } = req.params;
    if (!mbc_id) return res.status(400).json({ success: false, data: [], message: "mbc_id is required" });

    const branchCourt = await MstBranchCourt.findByPk(mbc_id);
    if (!branchCourt) return res.status(404).json({ success: false, data: [], message: "Branch court not found" });

    if (!branchCourt.mbc_status) {
      return res.status(400).json({ success: false, data: { mbc_id }, message: "Branch court already inactive" });
    }

    await branchCourt.update({ mbc_status: false, updated_at: new Date() });

    res.status(200).json({ success: true, data: { mbc_id }, message: "Branch court deactivated (soft deleted)" });

  } catch (err) {
    handleSequelizeError(err, res);
  }
};

// ===== SOFT DELETE MULTIPLE BRANCH COURTS =====
export const deleteMultipleBranchCourts = async (req, res) => {
  try {
    const { mbc_ids } = req.body; // ekspektasi: [1,2,3]
    if (!mbc_ids || !Array.isArray(mbc_ids) || mbc_ids.length === 0) {
      return res.status(400).json({ success: false, data: [], message: "mbc_ids must be a non-empty array" });
    }

    const branchCourts = await MstBranchCourt.findAll({ where: { mbc_id: mbc_ids } });
    if (branchCourts.length === 0) return res.status(404).json({ success: false, data: [], message: "No branch courts found for provided IDs" });

    const results = [];
    for (const bc of branchCourts) {
      if (!bc.mbc_status) results.push({ mbc_id: bc.mbc_id, status: "already inactive" });
      else {
        await bc.update({ mbc_status: false, updated_at: new Date() });
        results.push({ mbc_id: bc.mbc_id, status: "deactivated" });
      }
    }

    res.status(200).json({ success: true, data: results, message: "Branch courts processed successfully" });

  } catch (err) {
    handleSequelizeError(err, res);
  }
};