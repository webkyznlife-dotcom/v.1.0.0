import { Op } from "sequelize";
import { MstCourt } from "../../../../../models/mst_courts/mst_courts.js";
import { MstCourtImage } from "../../../../../models/mst_courts_image/mst_courts_image.js"; 

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

// ===== GET ALL COURTS =====
export const getCourt = async (req, res) => {
  try {
    const courts = await MstCourt.findAll({
      order: [["mc_id", "ASC"]],
      include: [{ model: MstCourtImage }] // Jika ingin menampilkan image court
    });

    res.json({
      success: true,
      data: courts,
      message: "Courts fetched successfully"
    });
  } catch (err) {
    handleSequelizeError(err, res);
  }
};

// ===== GET ALL COURTS FOR SELECT =====
export const getCourtForSelect = async (req, res) => {
  try {
    const courts = await MstCourt.findAll({
      where: { mc_status: true }, 
      order: [["mc_id", "ASC"]],
      include: [{ model: MstCourtImage }] // Jika ingin menampilkan image court
    });

    res.json({
      success: true,
      data: courts,
      message: "Courts fetched successfully"
    });
  } catch (err) {
    handleSequelizeError(err, res);
  }
};

// ===== CREATE COURT =====
export const createCourt = async (req, res) => {
  try {
    const { mc_name, mc_type, mc_status } = req.body;

    console.log("Files received:", req.files);
    console.log("Body received:", req.body);

    // Validasi nama court
    if (!mc_name) {
      return res.status(400).json({
        success: false,
        data: [],
        message: "mc_name is required",
      });
    }

    // Validasi minimal 1 image
    if (!req.files['mci_image'] || req.files['mci_image'].length === 0) {
      return res.status(400).json({
        success: false,
        data: [],
        message: "Please upload at least one image",
      });
    }

    // Normalisasi data
    const name = mc_name.trim().toLowerCase();
    const type = mc_type ? mc_type.trim() : null;
    const status = mc_status !== undefined ? mc_status === "true" : true;

    // Cek court yang sama
    const existing = await MstCourt.findOne({ where: { mc_name: name } });
    if (existing) {
      return res.status(400).json({
        success: false,
        data: [],
        message: "Court with this name already exists",
      });
    }

    // Simpan court
    const newCourt = await MstCourt.create({
      mc_name: name,
      mc_type: type,
      mc_status: status,
      created_at: new Date(),
      updated_at: new Date(),
    });

    // Simpan images
    const images = req.files['mci_image'].map((file, index) => {
      const desc = req.body[`mci_description_${index}`] || null;
      const stat = req.body[`mci_status_${index}`] === "true";

      return {
        mc_id: newCourt.mc_id,
        mci_image: file.filename,
        mci_description: desc,
        mci_status: stat,
        created_at: new Date(),
        updated_at: new Date(),
      };
    });

    await MstCourtImage.bulkCreate(images);

    return res.status(201).json({
      success: true,
      data: newCourt,
      message: "Court created successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      data: [],
      message: err.message,
    });
  }
};

// ===== UPDATE COURT =====
export const updateCourt = async (req, res) => {
  try {
    const { mc_id } = req.params;
    let { mc_name, mc_type, mc_status } = req.body;

    if (!mc_id) return res.status(400).json({ success: false, data: [], message: "mc_id is required" });
    if (!mc_name) return res.status(400).json({ success: false, data: [], message: "mc_name is required" });

    mc_name = mc_name.trim().toLowerCase();
    mc_type = mc_type ? mc_type.trim() : null;
    mc_status = mc_status !== undefined ? mc_status === "true" : true;

    const court = await MstCourt.findByPk(mc_id);
    if (!court) return res.status(404).json({ success: false, data: [], message: "Court not found" });

    // Cek duplikat nama court
    const existing = await MstCourt.findOne({
      where: { mc_name, mc_id: { [Op.ne]: mc_id } }
    });
    if (existing) return res.status(400).json({ success: false, data: [], message: "Court with this name already exists" });

    // Update court
    await court.update({ mc_name, mc_type, mc_status, updated_at: new Date() });

    // 🔹 Handle images (lama + baru)
    let newImages = [];
    let globalIndex = 0;

    // 1️⃣ Images lama
    let existingFiles = [];
    if (req.body.mci_image_existing) {
      existingFiles = Array.isArray(req.body.mci_image_existing)
        ? req.body.mci_image_existing
        : [req.body.mci_image_existing];

      existingFiles.forEach((filename) => {
        const desc = req.body[`mci_description_${globalIndex}`] || null;
        const stat = req.body[`mci_status_${globalIndex}`];

        newImages.push({
          mc_id,
          mci_image: filename,
          mci_description: desc,
          mci_status: stat === "false" ? false : true,
          updated_at: new Date()
        });

        globalIndex++;
      });
    }

    // 2️⃣ Images baru
    const uploadedFiles = req.files?.["mci_image"] || [];
    uploadedFiles.forEach((file) => {
      const desc = req.body[`mci_description_${globalIndex}`] || null;
      const stat = req.body[`mci_status_${globalIndex}`];

      newImages.push({
        mc_id,
        mci_image: file.filename,
        mci_description: desc,
        mci_status: stat === "false" ? false : true,
        created_at: new Date(),
        updated_at: new Date()
      });

      globalIndex++;
    });

    // 3️⃣ Hapus semua images lama dulu (supaya sinkron)
    await MstCourtImage.destroy({ where: { mc_id } });

    // 4️⃣ Insert semua images baru
    if (newImages.length > 0) await MstCourtImage.bulkCreate(newImages);

    return res.status(200).json({
      success: true,
      data: court,
      message: "Court updated successfully",
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, data: [], message: err.message });
  }
};

// ===== SOFT DELETE SINGLE COURT =====
export const deleteCourt = async (req, res) => {
  try {
    const { mc_id } = req.params;
    if (!mc_id) return res.status(400).json({ success: false, data: [], message: "mc_id is required" });

    const court = await MstCourt.findByPk(mc_id);
    if (!court) return res.status(404).json({ success: false, data: [], message: "Court not found" });

    if (!court.mc_status) return res.status(400).json({ success: false, data: { mc_id }, message: "Court already inactive" });

    await court.update({ mc_status: false, updated_at: new Date() });

    res.status(200).json({ success: true, data: { mc_id }, message: "Court deactivated (soft deleted)" });

  } catch (err) {
    handleSequelizeError(err, res);
  }
};

// ===== SOFT DELETE MULTIPLE COURTS =====
export const deleteMultipleCourt = async (req, res) => {
  try {
    const { mc_ids } = req.body; // ekspektasi: [1,2,3]
    if (!mc_ids || !Array.isArray(mc_ids) || mc_ids.length === 0) {
      return res.status(400).json({ success: false, data: [], message: "mc_ids must be a non-empty array" });
    }

    const courts = await MstCourt.findAll({ where: { mc_id: mc_ids } });
    if (courts.length === 0) return res.status(404).json({ success: false, data: [], message: "No courts found for provided IDs" });

    const results = [];
    for (const court of courts) {
      if (!court.mc_status) results.push({ mc_id: court.mc_id, status: "already inactive" });
      else {
        await court.update({ mc_status: false, updated_at: new Date() });
        results.push({ mc_id: court.mc_id, status: "deactivated" });
      }
    }

    res.status(200).json({ success: true, data: results, message: "Courts processed successfully" });

  } catch (err) {
    handleSequelizeError(err, res);
  }
};
