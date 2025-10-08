import { MstBranchProgram } from "../../../../models/mst_branch_programs/mst_branch_programs.js";
import { MstBranch } from "../../../../models/mst_branch/mst_branch.js";
import { MstProgram } from "../../../../models/mst_programs/mst_programs.js";
import { Op } from "sequelize";

// ===========================
// 1️⃣ Get all branch programs with optional relations
// ===========================
export const getBranchsPrograms = async (req, res) => {
  try {
    const branchPrograms = await MstBranchProgram.findAll({
      order: [["mbp_id", "ASC"]],
      include: [
        { model: MstBranch, attributes: ["mb_id", "mb_name"], required: false },
        { model: MstProgram, attributes: ["mp_id", "mp_name"], required: false },
      ],
    });

    res.json({
      success: true,
      data: branchPrograms,
      message: "Branch programs fetched successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, data: [], message: err.message });
  }
};

// ===========================
// 2️⃣ Get active branch programs for select dropdown
// ===========================
export const getBranchsProgramsForSelect = async (req, res) => {
  try {
    const branchPrograms = await MstBranchProgram.findAll({
      where: { mbp_status: true },
      order: [["mbp_id", "ASC"]],
      include: [
        { model: MstBranch, attributes: ["mb_id", "mb_name"], required: false },
        { model: MstProgram, attributes: ["mp_id", "mp_name"], required: false },
      ],
    });

    res.json({
      success: true,
      data: branchPrograms,
      message: "Active branch programs fetched successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, data: [], message: err.message });
  }
};

// ===========================
// 3️⃣ Update branch program
// ===========================
export const updateBranchsProgram = async (req, res) => {
  try {
    const { mbp_id } = req.params;
    const { mb_id, mp_id, mbp_status } = req.body;

    if (!mbp_id)
      return res.status(400).json({ success: false, message: "Branch program ID is required" });

    const branchProgram = await MstBranchProgram.findByPk(mbp_id);
    if (!branchProgram) {
      return res.status(404).json({ success: false, message: "Branch program not found" });
    }

    // 🔹 Cek apakah sudah ada kombinasi mb_id + mp_id
    const existing = await MstBranchProgram.findOne({
      where: { mb_id, mp_id }
    });

    if (existing && existing.mbp_id !== branchProgram.mbp_id) {
      // ada record lain dengan kombinasi yang sama
      return res.status(400).json({
        success: false,
        message: "This branch already has the selected program linked"
      });
    }

    // 🔹 Update data
    await branchProgram.update({
      mb_id,
      mp_id,
      mbp_status,
      updated_at: new Date(),
    });

    res.json({ success: true, message: "Branch program updated successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};


// ===========================
// 4️⃣ Create branch program
// ===========================
export const createBranchsProgram = async (req, res) => {
  try {
    const { mb_id, mp_id, mbp_status } = req.body;

    if (!mb_id || !mp_id) return res.status(400).json({ success: false, message: "mb_id and mp_id are required" });

    const existing = await MstBranchProgram.findOne({ where: { mb_id, mp_id } });
    if (existing) return res.status(400).json({ success: false, message: "Branch program already exists" });

    const newBranchProgram = await MstBranchProgram.create({
      mb_id,
      mp_id,
      mbp_status: mbp_status !== undefined ? mbp_status : true,
      created_at: new Date(),
      updated_at: new Date(),
    });

    res.status(201).json({ success: true, data: newBranchProgram, message: "Branch program created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ===========================
// 5️⃣ Soft delete single branch program
// ===========================
export const deleteBranchsProgram = async (req, res) => {
  try {
    const { mbp_id } = req.params;
    if (!mbp_id) return res.status(400).json({ success: false, message: "mbp_id is required" });

    const branchProgram = await MstBranchProgram.findByPk(mbp_id);
    if (!branchProgram) return res.status(404).json({ success: false, message: "Branch program not found" });

    if (!branchProgram.mbp_status) return res.status(400).json({ success: false, message: "Branch program is already inactive" });

    await branchProgram.update({ mbp_status: false });
    res.json({ success: true, data: { mbp_id }, message: "Branch program deactivated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ===========================
// 6️⃣ Soft delete multiple branch programs
// ===========================
export const deleteMultipleBranchsPrograms = async (req, res) => {
  try {
    const { mbp_ids } = req.body;
    if (!mbp_ids || !Array.isArray(mbp_ids) || mbp_ids.length === 0)
      return res.status(400).json({ success: false, message: "mbp_ids must be a non-empty array" });

    const branchPrograms = await MstBranchProgram.findAll({ where: { mbp_id: mbp_ids } });
    if (branchPrograms.length === 0) return res.status(404).json({ success: false, message: "No branch programs found for the provided IDs" });

    const results = [];
    for (const program of branchPrograms) {
      if (!program.mbp_status) results.push({ mbp_id: program.mbp_id, status: "already inactive" });
      else {
        await program.update({ mbp_status: false });
        results.push({ mbp_id: program.mbp_id, status: "deactivated" });
      }
    }

    res.json({ success: true, data: results, message: "Branch programs processed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};