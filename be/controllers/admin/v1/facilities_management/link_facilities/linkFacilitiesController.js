import { Op } from "sequelize";
import { MstBranchFacility } from "../../../../../models/mst_branch_facilities/mst_branch_facilities.js";
import { MstBranch } from "../../../../../models/mst_branch/mst_branch.js";
import { MstFacility } from "../../../../../models/mst_facilities/mst_facilities.js";

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

// ===== GET ALL BRANCH FACILITIES =====
export const getBranchFacilities = async (req, res) => {
  try {
    const facilities = await MstBranchFacility.findAll({
      include: [
        { model: MstBranch, attributes: ["mb_id", "mb_name"] },
        { model: MstFacility, attributes: ["mf_id", "mf_name", "mf_icon"] }
      ],
      order: [["mbf_id", "ASC"]]
    });

    res.json({
      success: true,
      data: facilities,
      message: "Branch facilities fetched successfully"
    });
  } catch (err) {
    handleSequelizeError(err, res);
  }
};

// ===== CREATE BRANCH FACILITY =====
export const createBranchFacility = async (req, res) => {
  try {
    let { mb_id, mf_id, mbf_status } = req.body;

    if (!mb_id) return res.status(400).json({ success: false, data: [], message: "mb_id is required" });
    if (!mf_id) return res.status(400).json({ success: false, data: [], message: "mf_id is required" });

    // Pastikan fasilitasnya ada
    const facility = await MstFacility.findByPk(mf_id);
    if (!facility) {
      return res.status(404).json({ success: false, data: [], message: "Facility not found" });
    }

    // Cek duplikat branch + facility
    const existing = await MstBranchFacility.findOne({
      where: { mb_id, mf_id }
    });
    if (existing) {
      return res.status(400).json({ success: false, data: [], message: "This branch already has the facility assigned" });
    }

    const newBranchFacility = await MstBranchFacility.create({
      mb_id,
      mf_id,
      mbf_icon: facility.mf_icon ? facility.mf_icon.trim().toLowerCase() : null, // ambil dari MstFacility
      mbf_status: mbf_status !== undefined ? mbf_status : true,
      created_at: new Date(),
      updated_at: new Date()
    });

    return res.status(201).json({
      success: true,
      data: newBranchFacility,
      message: "Branch facility assigned successfully"
    });

  } catch (err) {
    console.error(err);
    return handleSequelizeError(err, res);
  }
};

// ===== UPDATE BRANCH FACILITY =====
export const updateBranchFacility = async (req, res) => {
  try {
    const { mbf_id } = req.params;
    let { mb_id, mf_id, mbf_status } = req.body;

    if (!mbf_id)
      return res.status(400).json({ success: false, data: [], message: "mbf_id is required" });
    if (!mb_id)
      return res.status(400).json({ success: false, data: [], message: "mb_id is required" });
    if (!mf_id)
      return res.status(400).json({ success: false, data: [], message: "mf_id is required" });

    // Ambil record yang mau diupdate
    const branchFacility = await MstBranchFacility.findByPk(mbf_id);
    if (!branchFacility) {
      return res.status(404).json({ success: false, data: [], message: "Branch facility not found" });
    }

    // Pastikan fasilitasnya ada
    const facility = await MstFacility.findByPk(mf_id);
    if (!facility) {
      return res.status(404).json({ success: false, data: [], message: "Facility not found" });
    }

    // Update record
    await branchFacility.update({
      mb_id,
      mf_id,
      mbf_icon: facility.mf_icon ? facility.mf_icon.trim().toLowerCase() : branchFacility.mbf_icon,
      mbf_status: mbf_status !== undefined ? mbf_status : branchFacility.mbf_status,
      updated_at: new Date()
    });

    return res.status(200).json({
      success: true,
      data: branchFacility,
      message: "Branch facility updated successfully"
    });

  } catch (err) {
    console.error(err);
    return handleSequelizeError(err, res);
  }
};

// ===== SOFT DELETE SINGLE BRANCH FACILITY =====
export const deleteBranchFacility = async (req, res) => {
  try {
    const { mbf_id } = req.params;
    if (!mbf_id) return res.status(400).json({ success: false, data: [], message: "mbf_id is required" });

    const branchFacility = await MstBranchFacility.findByPk(mbf_id);
    if (!branchFacility) return res.status(404).json({ success: false, data: [], message: "Branch facility not found" });

    if (!branchFacility.mbf_status) {
      return res.status(400).json({ success: false, data: { mbf_id }, message: "Branch facility already inactive" });
    }

    await branchFacility.update({ mbf_status: false, updated_at: new Date() });

    res.status(200).json({ success: true, data: { mbf_id }, message: "Branch facility deactivated (soft deleted)" });

  } catch (err) {
    handleSequelizeError(err, res); 
  }
};

// ===== SOFT DELETE MULTIPLE BRANCH FACILITIES =====
export const deleteMultipleBranchFacilities = async (req, res) => {
  try {
    const { mbf_ids } = req.body; // ekspektasi: [1,2,3]
    if (!mbf_ids || !Array.isArray(mbf_ids) || mbf_ids.length === 0) {
      return res.status(400).json({ success: false, data: [], message: "mbf_ids must be a non-empty array" });
    }

    const branchFacilities = await MstBranchFacility.findAll({ where: { mbf_id: mbf_ids } });
    if (branchFacilities.length === 0) return res.status(404).json({ success: false, data: [], message: "No branch facilities found for provided IDs" });

    const results = [];
    for (const bf of branchFacilities) {
      if (!bf.mbf_status) results.push({ mbf_id: bf.mbf_id, status: "already inactive" });
      else {
        await bf.update({ mbf_status: false, updated_at: new Date() });
        results.push({ mbf_id: bf.mbf_id, status: "deactivated" });
      }
    }

    res.status(200).json({ success: true, data: results, message: "Branch facilities processed successfully" });

  } catch (err) {
    handleSequelizeError(err, res);
  }
};
