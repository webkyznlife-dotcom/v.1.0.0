import { MstProgramActivityCategory } from "../../../../models/mst_program_activity_categories/mst_program_activity_categories.js";
import { Op } from "sequelize";

// Get all programs with optional relations
export const getActivityCategories = async (req, res) => {
  try {
    const categories = await MstProgramActivityCategory.findAll({
      order: [["mpac_id", "ASC"]] // order by mpac_id ascending
    });

    res.json({
      success: true,
      data: categories,
      message: "Activity Categories fetched successfully"
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      data: [],
      message: err.message
    });
  }
};

// Update activity category
export const updateActivityCategory = async (req, res) => {
  try {
    const { mpac_id } = req.params;
    let { mpac_name, mpac_status } = req.body;

    // Validasi mpac_id
    if (!mpac_id) {
      return res.status(400).json({
        success: false,
        data: [],
        message: "mpac_id is required"
      });
    }

    // Validasi mpac_name
    if (!mpac_name || mpac_name.trim() === "") {
      return res.status(400).json({
        success: false,
        data: [],
        message: "mpac_name is required"
      });
    }

    // Validasi mpac_status
    if (mpac_status == null) {
      return res.status(400).json({
        success: false,
        data: [],
        message: "mpac_status is required"
      });
    }

    // Normalisasi input: trim + lowercase
    mpac_name = mpac_name.trim().toLowerCase();

    // Cari activity category berdasarkan mpac_id
    const category = await MstProgramActivityCategory.findByPk(mpac_id);
    if (!category) {
      return res.status(404).json({
        success: false,
        data: [],
        message: "Activity Category not found"
      });
    }

    // Cek apakah mpac_name sudah dipakai oleh record lain
    const existing = await MstProgramActivityCategory.findOne({
      where: {
        mpac_name,
        mpac_id: { [Op.ne]: mpac_id }
      }
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        data: { mpac_name },
        message: "Another category with this name already exists"
      });
    }

    // Update data
    const updated = await category.update({
      mpac_name,
      mpac_status
    });

    res.status(200).json({
      success: true,
      data: updated,
      message: "Activity Category updated successfully"
    });

  } catch (err) {
    console.error(err);

    if (
      err.name === "SequelizeValidationError" ||
      err.name === "SequelizeUniqueConstraintError"
    ) {
      const messages = err.errors.map(e => e.message);
      return res.status(400).json({
        success: false,
        data: [],
        message: messages.join(", ")
      });
    }

    res.status(500).json({
      success: false,
      data: [],
      message: err.message
    });
  }
};


// Create activity category
export const createActivityCategory = async (req, res) => {
  try {
    let { mpac_name, mpac_status } = req.body;

    // Validasi mpac_name
    if (!mpac_name || mpac_name.trim() === "") {
      return res.status(400).json({
        success: false,
        data: [],
        message: "mpac_name is required"
      });
    }

    // Validasi mpac_status
    if (mpac_status == null) {
      mpac_status = true; // default active
    }

    // Normalisasi input: trim + lowercase
    mpac_name = mpac_name.trim().toLowerCase();

    // Cek apakah sudah ada kategori dengan nama sama
    const existing = await MstProgramActivityCategory.findOne({
      where: { mpac_name }
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        data: { mpac_name },
        message: "Activity Category with this name already exists"
      });
    }

    // Simpan data baru
    const newCategory = await MstProgramActivityCategory.create({
      mpac_name,
      mpac_status
    });

    res.status(201).json({
      success: true,
      data: newCategory,
      message: "Activity Category created successfully"
    });

  } catch (err) {
    console.error(err);

    if (
      err.name === "SequelizeValidationError" ||
      err.name === "SequelizeUniqueConstraintError"
    ) {
      const messages = err.errors.map(e => e.message);
      return res.status(400).json({
        success: false,
        data: [],
        message: messages.join(", ")
      });
    }

    res.status(500).json({
      success: false,
      data: [],
      message: err.message
    });
  }
};


// Soft delete activity category
export const deleteActivityCategory = async (req, res) => {
  try {
    const { mpac_id } = req.params;

    if (!mpac_id) {
      return res.status(400).json({
        success: false,
        data: [],
        message: "mpac_id is required"
      });
    }

    const category = await MstProgramActivityCategory.findByPk(mpac_id);

    if (!category) {
      return res.status(404).json({
        success: false,
        data: [],
        message: "Activity Category not found"
      });
    }

    if (!category.mpac_status) {
      return res.status(400).json({
        success: false,
        data: { mpac_id },
        message: "Activity Category is already inactive"
      });
    }

    await category.update({ mpac_status: false });

    res.status(200).json({
      success: true,
      data: { mpac_id },
      message: "Activity Category has been deactivated (soft deleted)"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      data: [],
      message: err.message
    });
  }
};

// Soft delete multiple activity categories
export const deleteMultipleActivityCategories = async (req, res) => {
  try {
    const { mpac_ids } = req.body; // ekspektasi: [1,2,3]

    if (!mpac_ids || !Array.isArray(mpac_ids) || mpac_ids.length === 0) {
      return res.status(400).json({
        success: false,
        data: [],
        message: "mpac_ids must be a non-empty array"
      });
    }

    const categories = await MstProgramActivityCategory.findAll({
      where: { mpac_id: mpac_ids }
    });

    if (categories.length === 0) {
      return res.status(404).json({
        success: false,
        data: [],
        message: "No activity categories found for the provided IDs"
      });
    }

    const results = [];
    for (const category of categories) {
      if (!category.mpac_status) {
        results.push({ mpac_id: category.mpac_id, status: "already inactive" });
      } else {
        await category.update({ mpac_status: false });
        results.push({ mpac_id: category.mpac_id, status: "deactivated" });
      }
    }

    res.status(200).json({
      success: true,
      data: results,
      message: "Activity categories processed successfully"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      data: [],
      message: err.message
    });
  }
};