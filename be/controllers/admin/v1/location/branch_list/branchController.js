import { Op } from "sequelize";
import { MstBranch } from "../../../../../models/mst_branch/mst_branch.js";
import { MstBranchImage } from "../../../../../models/mst_branch_image/mst_branch_image.js";

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

// ===== GET All Branches for Select Option (Admin) =====
export const getAllBranchesForSelectOptionAdmin = async (req, res) => {
  try {
    const branches = await MstBranch.findAll({
      where: { mb_status: true },
      order: [["mb_name", "ASC"]]
    });
    return res.status(200).json({ success: true, data: branches });
  } catch (err) {
    return handleSequelizeError(err, res);
  }
};

// ===== GET ALL BRANCHES =====
export const getAllBranches = async (req, res) => {
  try {
    const branches = await MstBranch.findAll({
      order: [["mb_id", "ASC"]],
      include: [{ model: MstBranchImage }] // sertakan images
    });
    return res.status(200).json({ success: true, data: branches, message: "Branches fetched successfully" });
  } catch (err) {
    return handleSequelizeError(err, res);
  }
};

// ===== CREATE BRANCH =====
export const createBranch = async (req, res) => {
  try {
    const { mb_name, mb_address, mb_city, mb_province, mb_postal_code, mb_phone, mb_status } = req.body;

    if (!mb_name) {
      return res.status(400).json({ success: false, data: [], message: "mb_name is required" });
    }

    const existing = await MstBranch.findOne({ where: { mb_name: mb_name.trim() } });
    if (existing) return res.status(400).json({ success: false, data: [], message: "Branch with this name already exists" });

    const newBranch = await MstBranch.create({
      mb_name: mb_name.trim(),
      mb_address: mb_address || null,
      mb_city: mb_city || null,
      mb_province: mb_province || null,
      mb_postal_code: mb_postal_code || null,
      mb_phone: mb_phone || null,
      mb_status: mb_status !== undefined ? mb_status === "true" : true,
      created_at: new Date(),
      updated_at: new Date(),
    });

    // ===== HANDLE IMAGES =====
    const files = req.files?.["mbi_image"] || [];
    if (files.length === 0) {
      return res.status(400).json({ success: false, data: [], message: "Please upload at least one image" });
    }

    const images = files.map((file, index) => ({
      mb_id: newBranch.mb_id,
      mbi_image: file.filename,
      mbi_description: req.body[`mbi_description_${index}`] || null,
      mbi_status: req.body[`mbi_status_${index}`] === "false" ? false : true,
      created_at: new Date(),
      updated_at: new Date()
    }));

    await MstBranchImage.bulkCreate(images);

    return res.status(201).json({ success: true, data: newBranch, message: "Branch created successfully" });
  } catch (err) {
    return handleSequelizeError(err, res);
  }
};

// ===== UPDATE BRANCH =====
export const updateBranch = async (req, res) => {
  try {
    const { mb_id } = req.params;
    let { mb_name, mb_address, mb_city, mb_province, mb_postal_code, mb_phone, mb_status } = req.body;

    if (!mb_id) return res.status(400).json({ success: false, data: [], message: "mb_id is required" });
    if (!mb_name) return res.status(400).json({ success: false, data: [], message: "mb_name is required" });

    const branch = await MstBranch.findByPk(mb_id);
    if (!branch) return res.status(404).json({ success: false, data: [], message: "Branch not found" });

    const existing = await MstBranch.findOne({ where: { mb_name: mb_name.trim(), mb_id: { [Op.ne]: mb_id } } });
    if (existing) return res.status(400).json({ success: false, data: [], message: "Branch with this name already exists" });

    await branch.update({
      mb_name: mb_name.trim(),
      mb_address: mb_address || null,
      mb_city: mb_city || null,
      mb_province: mb_province || null,
      mb_postal_code: mb_postal_code || null,
      mb_phone: mb_phone || null,
      mb_status: mb_status !== undefined ? mb_status === "true" : true,
      updated_at: new Date(),
    });

    // ===== HANDLE IMAGES (lama + baru) =====
    let newImages = [];
    let globalIndex = 0;

    // 1️⃣ Images lama
    let existingFiles = [];
    if (req.body.mbi_image_existing) {
      existingFiles = Array.isArray(req.body.mbi_image_existing) ? req.body.mbi_image_existing : [req.body.mbi_image_existing];
      existingFiles.forEach((filename) => {
        const desc = req.body[`mbi_description_${globalIndex}`] || null;
        const stat = req.body[`mbi_status_${globalIndex}`];
        newImages.push({
          mb_id,
          mbi_image: filename,
          mbi_description: desc,
          mbi_status: stat === "false" ? false : true,
          updated_at: new Date()
        });
        globalIndex++;
      });
    }

    // 2️⃣ Images baru
    const uploadedFiles = req.files?.["mbi_image"] || [];
    uploadedFiles.forEach((file) => {
      const desc = req.body[`mbi_description_${globalIndex}`] || null;
      const stat = req.body[`mbi_status_${globalIndex}`];
      newImages.push({
        mb_id,
        mbi_image: file.filename,
        mbi_description: desc,
        mbi_status: stat === "false" ? false : true,
        created_at: new Date(),
        updated_at: new Date()
      });
      globalIndex++;
    });

    // 3️⃣ Hapus semua images lama dulu
    await MstBranchImage.destroy({ where: { mb_id } });

    // 4️⃣ Insert semua images baru
    if (newImages.length > 0) await MstBranchImage.bulkCreate(newImages);

    return res.status(200).json({ success: true, data: branch, message: "Branch updated successfully" });
  } catch (err) {
    return handleSequelizeError(err, res);
  }
};

// ===== SOFT DELETE SINGLE BRANCH =====
export const deleteBranch = async (req, res) => {
  try {
    const { mb_id } = req.params;
    if (!mb_id) return res.status(400).json({ success: false, data: [], message: "mb_id is required" });

    const branch = await MstBranch.findByPk(mb_id);
    if (!branch) return res.status(404).json({ success: false, data: [], message: "Branch not found" });
    if (!branch.mb_status) return res.status(400).json({ success: false, data: { mb_id }, message: "Branch already inactive" });

    await branch.update({ mb_status: false, updated_at: new Date() });

    return res.status(200).json({ success: true, data: { mb_id }, message: "Branch deactivated (soft deleted)" });
  } catch (err) {
    return handleSequelizeError(err, res);
  }
};

// ===== SOFT DELETE MULTIPLE BRANCHES =====
export const deleteMultipleBranches = async (req, res) => {
  try {
    const { mb_ids } = req.body;
    if (!mb_ids || !Array.isArray(mb_ids) || mb_ids.length === 0) {
      return res.status(400).json({ success: false, data: [], message: "mb_ids must be a non-empty array" });
    }

    const branches = await MstBranch.findAll({ where: { mb_id: mb_ids } });
    if (branches.length === 0) return res.status(404).json({ success: false, data: [], message: "No branches found for provided IDs" });

    const results = [];
    for (const branch of branches) {
      if (!branch.mb_status) results.push({ mb_id: branch.mb_id, status: "already inactive" });
      else {
        await branch.update({ mb_status: false, updated_at: new Date() });
        results.push({ mb_id: branch.mb_id, status: "deactivated" });
      }
    }

    return res.status(200).json({ success: true, data: results, message: "Branches processed successfully" });
  } catch (err) {
    return handleSequelizeError(err, res);
  }
};
