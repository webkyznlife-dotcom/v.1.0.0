import { Op } from "sequelize";
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

// ===== GET ALL FACILITIES =====
export const getFacility = async (req, res) => {
  try {
    const facilities = await MstFacility.findAll({
      order: [["mf_id", "ASC"]]
    });

    res.json({
      success: true,
      data: facilities,
      message: "Facilities fetched successfully"
    });
  } catch (err) {
    handleSequelizeError(err, res); 
  }
};


// ===== GET ALL FACILITIES FOR SELECT =====
export const getFacilityForSelect = async (req, res) => {
  try {
    const facilities = await MstFacility.findAll({
      where: { mf_status: true },  
      order: [["mf_id", "ASC"]]
    });

    res.json({
      success: true,
      data: facilities,
      message: "Facilities fetched successfully"
    });
  } catch (err) {
    handleSequelizeError(err, res); 
  }
};

// ===== CREATE FACILITY =====
export const createFacility = async (req, res) => {
  try {
    let { mf_name, mf_description, mf_status, mf_icon } = req.body;

    if (!mf_name) return res.status(400).json({ success: false, data: [], message: "mf_name is required" });

    // Ubah semua input string jadi huruf kecil
    mf_name = mf_name.trim().toLowerCase();
    mf_description = mf_description ? mf_description.trim().toLowerCase() : null;
    mf_icon = mf_icon ? mf_icon.trim().toLowerCase() : null;

    // Cek apakah sudah ada mf_name yang sama (case-insensitive)
    const existing = await MstFacility.findOne({ 
      where: { mf_name: mf_name } 
    });
    if (existing) return res.status(400).json({ success: false, data: [], message: "Facility with this name already exists" });

    const newFacility = await MstFacility.create({
      mf_name,
      mf_description,
      mf_icon,
      mf_status: mf_status !== undefined ? mf_status : true,
      created_at: new Date(),
      updated_at: new Date()
    });

    return res.status(201).json({
      success: true,
      data: newFacility,
      message: "Facility created successfully"
    });

  } catch (err) {
    console.error(err);
    return handleSequelizeError(err, res);
  }
};


// ===== UPDATE FACILITY =====
// ===== UPDATE FACILITY =====
export const updateFacility = async (req, res) => {
  try {
    const { mf_id } = req.params;
    let { mf_name, mf_description, mf_status, mf_icon } = req.body;

    if (!mf_id) return res.status(400).json({ success: false, data: [], message: "mf_id is required" });
    if (!mf_name) return res.status(400).json({ success: false, data: [], message: "mf_name is required" });

    // Ubah semua input string jadi huruf kecil
    mf_name = mf_name.trim().toLowerCase();
    mf_description = mf_description ? mf_description.trim().toLowerCase() : null;
    mf_icon = mf_icon ? mf_icon.trim().toLowerCase() : null;

    const facility = await MstFacility.findByPk(mf_id);
    if (!facility) return res.status(404).json({ success: false, data: [], message: "Facility not found" });

    // Cek apakah mf_name sudah ada di fasilitas lain
    const existing = await MstFacility.findOne({ 
      where: { mf_name, mf_id: { [Op.ne]: mf_id } } 
    });
    if (existing) return res.status(400).json({ success: false, data: [], message: "Facility with this name already exists" });

    await facility.update({
      mf_name,
      mf_description,
      mf_icon: mf_icon || facility.mf_icon,
      mf_status: mf_status !== undefined ? mf_status : facility.mf_status,
      updated_at: new Date()
    });

    return res.status(200).json({
      success: true,
      data: facility,
      message: "Facility updated successfully"
    });

  } catch (err) {
    console.error(err);
    return handleSequelizeError(err, res);
  }
};

// ===== SOFT DELETE SINGLE FACILITY =====
export const deleteFacility = async (req, res) => {
  try {
    const { mf_id } = req.params;
    if (!mf_id) return res.status(400).json({ success: false, data: [], message: "mf_id is required" });

    const facility = await MstFacility.findByPk(mf_id);
    if (!facility) return res.status(404).json({ success: false, data: [], message: "Facility not found" });

    if (!facility.mf_status) return res.status(400).json({ success: false, data: { mf_id }, message: "Facility already inactive" });

    await facility.update({ mf_status: false, updated_at: new Date() });

    res.status(200).json({ success: true, data: { mf_id }, message: "Facility deactivated (soft deleted)" });

  } catch (err) {
    handleSequelizeError(err, res);
  }
};

// ===== SOFT DELETE MULTIPLE FACILITIES =====
export const deleteMultipleFacility = async (req, res) => {
  try {
    const { mf_ids } = req.body; // ekspektasi: [1,2,3]
    if (!mf_ids || !Array.isArray(mf_ids) || mf_ids.length === 0) {
      return res.status(400).json({ success: false, data: [], message: "mf_ids must be a non-empty array" });
    }

    const facilities = await MstFacility.findAll({ where: { mf_id: mf_ids } });
    if (facilities.length === 0) return res.status(404).json({ success: false, data: [], message: "No facilities found for provided IDs" });

    const results = [];
    for (const facility of facilities) {
      if (!facility.mf_status) results.push({ mf_id: facility.mf_id, status: "already inactive" });
      else {
        await facility.update({ mf_status: false, updated_at: new Date() });
        results.push({ mf_id: facility.mf_id, status: "deactivated" });
      }
    }

    res.status(200).json({ success: true, data: results, message: "Facilities processed successfully" });

  } catch (err) {
    handleSequelizeError(err, res);
  }
};
