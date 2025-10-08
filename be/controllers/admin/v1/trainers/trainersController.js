import { Op, fn, col, where } from "sequelize";
import { MstTrainer } from "../../../../models/mst_trainers/mst_trainers.js";

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

// ===== GET ALL TRAINERS =====
export const getTrainer = async (req, res) => {
  try {
    const trainers = await MstTrainer.findAll({
      order: [["trainer_id", "ASC"]]
    });

    res.json({
      success: true,
      data: trainers,
      message: "Trainers fetched successfully"
    });
  } catch (err) {
    handleSequelizeError(err, res);
  }
};

// ===== GET ALL TRAINERS FOR SELECT =====
export const getTrainerForSelect = async (req, res) => {
  try {
    const trainers = await MstTrainer.findAll({
      where: { trainer_status: true },
      order: [["trainer_id", "ASC"]]
    });

    res.json({
      success: true,
      data: trainers,
      message: "Trainers fetched successfully"
    });
  } catch (err) {
    handleSequelizeError(err, res);
  }
};

// ===== CREATE TRAINER =====
export const createTrainer = async (req, res) => {
  try {
    let { trainer_name, trainer_email, trainer_phone, trainer_speciality, trainer_status } = req.body;

    if (!trainer_name) {
      return res.status(400).json({
        success: false,
        data: [],
        message: "trainer_name is required"
      });
    }

    const status = trainer_status !== undefined ? trainer_status === "true" : true;
    const trimmedName = trainer_name.trim();

    // Cek duplicate name (case-insensitive)
    const existing = await MstTrainer.findOne({
      where: where(fn("LOWER", col("trainer_name")), trimmedName.toLowerCase())
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        data: [],
        message: "Trainer with this name already exists"
      });
    }

    const newTrainer = await MstTrainer.create({
      trainer_name: trimmedName,
      trainer_email: trainer_email ? trainer_email.trim() : null,
      trainer_phone: trainer_phone ? trainer_phone.trim() : null,
      trainer_speciality: trainer_speciality ? trainer_speciality.trim() : null,
      trainer_status: status,
      created_at: new Date(),
      updated_at: new Date()
    });

    res.status(201).json({
      success: true,
      data: newTrainer,
      message: "Trainer created successfully"
    });
  } catch (err) {
    handleSequelizeError(err, res);
  }
};

// ===== UPDATE TRAINER =====
export const updateTrainer = async (req, res) => {
  try {
    const { trainer_id } = req.params;
    let { trainer_name, trainer_email, trainer_phone, trainer_speciality, trainer_status } = req.body;

    if (!trainer_id) return res.status(400).json({ success: false, data: [], message: "trainer_id is required" });
    if (!trainer_name) return res.status(400).json({ success: false, data: [], message: "trainer_name is required" });

    const trainer = await MstTrainer.findByPk(trainer_id);
    if (!trainer) return res.status(404).json({ success: false, data: [], message: "Trainer not found" });

    // Cek duplicate name
    const existing = await MstTrainer.findOne({
      where: { trainer_name, trainer_id: { [Op.ne]: trainer_id } }
    });
    if (existing) return res.status(400).json({ success: false, data: [], message: "Trainer with this name already exists" });

    trainer_name = trainer_name.trim();
    trainer_email = trainer_email ? trainer_email.trim() : null;
    trainer_phone = trainer_phone ? trainer_phone.trim() : null;
    trainer_speciality = trainer_speciality ? trainer_speciality.trim() : null;
    trainer_status = trainer_status !== undefined ? trainer_status === "true" : true;

    await trainer.update({
      trainer_name,
      trainer_email,
      trainer_phone,
      trainer_speciality,
      trainer_status,
      updated_at: new Date()
    });

    res.status(200).json({
      success: true,
      data: trainer,
      message: "Trainer updated successfully"
    });

  } catch (err) {
    handleSequelizeError(err, res);
  }
};

// ===== SOFT DELETE SINGLE TRAINER =====
export const deleteTrainer = async (req, res) => {
  try {
    const { trainer_id } = req.params;
    if (!trainer_id) return res.status(400).json({ success: false, data: [], message: "trainer_id is required" });

    const trainer = await MstTrainer.findByPk(trainer_id);
    if (!trainer) return res.status(404).json({ success: false, data: [], message: "Trainer not found" });

    if (!trainer.trainer_status) return res.status(400).json({ success: false, data: { trainer_id }, message: "Trainer already inactive" });

    await trainer.update({ trainer_status: false, updated_at: new Date() });

    res.status(200).json({ success: true, data: { trainer_id }, message: "Trainer deactivated (soft deleted)" });

  } catch (err) {
    handleSequelizeError(err, res);
  }
};

// ===== SOFT DELETE MULTIPLE TRAINERS =====
export const deleteMultipleTrainer = async (req, res) => {
  try {
    const { trainer_ids } = req.body; // ekspektasi: [1,2,3]
    if (!trainer_ids || !Array.isArray(trainer_ids) || trainer_ids.length === 0) {
      return res.status(400).json({ success: false, data: [], message: "trainer_ids must be a non-empty array" });
    }

    const trainers = await MstTrainer.findAll({ where: { trainer_id: trainer_ids } });
    if (trainers.length === 0) return res.status(404).json({ success: false, data: [], message: "No trainers found for provided IDs" });

    const results = [];
    for (const trainer of trainers) {
      if (!trainer.trainer_status) results.push({ trainer_id: trainer.trainer_id, status: "already inactive" });
      else {
        await trainer.update({ trainer_status: false, updated_at: new Date() });
        results.push({ trainer_id: trainer.trainer_id, status: "deactivated" });
      }
    }

    res.status(200).json({ success: true, data: results, message: "Trainers processed successfully" });

  } catch (err) {
    handleSequelizeError(err, res);
  }
};