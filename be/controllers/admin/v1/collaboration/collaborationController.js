import { Op } from "sequelize";
import { MstCollaboration } from "../../../../models/mst_collaboration/mst_collaboration.js";

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


// ===== GET ALL COLLABORATIONS =====
export const getCollaboration = async (req, res) => {
  try {
    const collaborations = await MstCollaboration.findAll({
      order: [["mc_id", "ASC"]]
    });

    res.json({
      success: true,
      data: collaborations,
      message: "Collaborations fetched successfully"
    });
  } catch (err) {
    handleSequelizeError(err, res);
  }
};


// ===== CREATE COLLABORATION =====
export const createCollaboration = async (req, res) => {
  try {
    const { mc_name, mc_description, mc_status } = req.body;

    if (!mc_name) return res.status(400).json({ success: false, data: [], message: "mc_name is required" });

    const mc_image = req.file?.filename || null;

    const newCollaboration = await MstCollaboration.create({
      mc_name: mc_name.trim(),
      mc_description: mc_description || null,
      mc_image,
      mc_status: mc_status !== undefined ? mc_status : true,
      created_at: new Date(),
      updated_at: new Date()
    });

    return res.status(201).json({
      success: true,
      data: newCollaboration,
      message: "Collaboration created successfully"
    });

  } catch (err) {
    console.error(err);
    return handleSequelizeError(err, res);
  }
};

// ===== UPDATE COLLABORATION =====
export const updateCollaboration = async (req, res) => {
  try {
    const { mc_id } = req.params;
    const { mc_name, mc_description, mc_status } = req.body;

    if (!mc_id) return res.status(400).json({ success: false, data: [], message: "mc_id is required" });
    if (!mc_name) return res.status(400).json({ success: false, data: [], message: "mc_name is required" });

    const collaboration = await MstCollaboration.findByPk(mc_id);
    if (!collaboration) return res.status(404).json({ success: false, data: [], message: "Collaboration not found" });

    const mc_image = req.file?.filename || collaboration.mc_image;

    await collaboration.update({
      mc_name: mc_name.trim(),
      mc_description: mc_description || null,
      mc_image,
      mc_status: mc_status !== undefined ? mc_status : collaboration.mc_status,
      updated_at: new Date()
    });

    return res.status(200).json({
      success: true,
      data: collaboration,
      message: "Collaboration updated successfully"
    });

  } catch (err) {
    console.error(err);
    return handleSequelizeError(err, res);
  }
};

// ===== SOFT DELETE SINGLE COLLABORATION =====
export const deleteCollaboration = async (req, res) => {
  try {
    const { mc_id } = req.params;
    if (!mc_id) return res.status(400).json({ success: false, data: [], message: "mc_id is required" });

    const collaboration = await MstCollaboration.findByPk(mc_id);
    if (!collaboration) return res.status(404).json({ success: false, data: [], message: "Collaboration not found" });

    if (!collaboration.mc_status) return res.status(400).json({ success: false, data: { mc_id }, message: "Collaboration already inactive" });

    await collaboration.update({ mc_status: false, updated_at: new Date() });

    res.status(200).json({ success: true, data: { mc_id }, message: "Collaboration deactivated (soft deleted)" });

  } catch (err) {
    handleSequelizeError(err, res);
  }
};

// ===== SOFT DELETE MULTIPLE COLLABORATIONS =====
export const deleteMultipleCollaboration = async (req, res) => {
  try {
    const { mc_ids } = req.body; // ekspektasi: [1,2,3]
    if (!mc_ids || !Array.isArray(mc_ids) || mc_ids.length === 0) {
      return res.status(400).json({ success: false, data: [], message: "mc_ids must be a non-empty array" });
    }

    const collaborations = await MstCollaboration.findAll({ where: { mc_id: mc_ids } });
    if (collaborations.length === 0) return res.status(404).json({ success: false, data: [], message: "No collaborations found for provided IDs" });

    const results = [];
    for (const collaboration of collaborations) {
      if (!collaboration.mc_status) results.push({ mc_id: collaboration.mc_id, status: "already inactive" });
      else {
        await collaboration.update({ mc_status: false, updated_at: new Date() });
        results.push({ mc_id: collaboration.mc_id, status: "deactivated" });
      }
    }

    res.status(200).json({ success: true, data: results, message: "Collaborations processed successfully" });

  } catch (err) {
    handleSequelizeError(err, res);
  }
};