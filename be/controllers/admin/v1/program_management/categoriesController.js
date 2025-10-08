import { MstProgramCategory } from "../../../../models/mst_program_categories/mst_program_categories.js";
import { Op } from "sequelize";

// Get all active categories
export const getCategories = async (req, res) => {
  try {
    const categories = await MstProgramCategory.findAll({
      order: [['mpc_id', 'ASC']]
    });

    res.json({
      success: true,
      data: categories,
      message: "Categories fetched successfully"
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      data: [],
      message: err.message
    });
  }
};

// Create a new category
export const createCategory = async (req, res) => {
  try {
    let { mpc_name, mpc_status } = req.body;

    if (!mpc_name) {
      return res.status(400).json({
        success: false,
        data: [],
        message: "mpc_name is required"
      });
    }

    // Normalisasi input: lowercase + trim
    mpc_name = mpc_name.toLowerCase().trim();

    // Default status ke true
    mpc_status = mpc_status !== undefined ? mpc_status : true;

    // Cek apakah nama category sudah ada
    const existing = await MstProgramCategory.findOne({ where: { mpc_name } });

    if (existing) {
      if (existing.mpc_status === true) {
        return res.status(400).json({
          success: false,
          data: { mpc_name },
          message: "Category with this name already exists and is active"
        });
      } else {
        const updated = await existing.update({ mpc_status });
        return res.status(200).json({
          success: true,
          data: updated,
          message: "Existing category was inactive and is now activated"
        });
      }
    }

    const category = await MstProgramCategory.create({ mpc_name, mpc_status });

    res.status(201).json({
      success: true,
      data: category,
      message: "Category created successfully"
    });

  } catch (err) {
    console.error(err);

    if (err.name === "SequelizeValidationError" || err.name === "SequelizeUniqueConstraintError") {
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


// Update category
export const updateCategory = async (req, res) => {
  try {
    const { mpc_id } = req.params;
    let { mpc_name, mpc_status } = req.body;

    if (!mpc_id) {
      return res.status(400).json({
        success: false,
        data: [],
        message: "mpc_id is required"
      });
    }

    const category = await MstProgramCategory.findByPk(mpc_id);
    if (!category) {
      return res.status(404).json({
        success: false,
        data: [],
        message: "Category not found"
      });
    }

    // Normalisasi input: jadikan huruf kecil dan trim
    if (mpc_name) {
      mpc_name = mpc_name.toLowerCase().trim();
    }

    // Cek duplikasi nama di record lain
    if (mpc_name) {
      const existing = await MstProgramCategory.findOne({
        where: {
          mpc_name,
          mpc_id: { [Op.ne]: mpc_id }
        }
      });

      if (existing && existing.mpc_status === true) {
        return res.status(400).json({
          success: false,
          data: { mpc_name },
          message: "Another active category with this name already exists"
        });
      }
    }

    // Update kategori
    const updated = await category.update({
      mpc_name: mpc_name !== undefined ? mpc_name : category.mpc_name.toLowerCase(),
      mpc_status: mpc_status !== undefined ? mpc_status : category.mpc_status
    });

    res.status(200).json({
      success: true,
      data: updated,
      message: "Category updated successfully"
    });

  } catch (err) {
    console.error(err);

    if (err.name === "SequelizeValidationError" || err.name === "SequelizeUniqueConstraintError") {
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

// Soft delete category
export const deleteCategory = async (req, res) => {
  try {
    const { mpc_id } = req.params;

    if (!mpc_id) {
      return res.status(400).json({
        success: false,
        data: [],
        message: "mpc_id is required"
      });
    }

    const category = await MstProgramCategory.findByPk(mpc_id);

    if (!category) {
      return res.status(404).json({
        success: false,
        data: [],
        message: "Category not found"
      });
    }

    if (!category.mpc_status) {
      return res.status(400).json({
        success: false,
        data: { mpc_id },
        message: "Category is already inactive"
      });
    }

    await category.update({ mpc_status: false });

    res.status(200).json({
      success: true,
      data: { mpc_id },
      message: "Category has been deactivated (soft deleted)"
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

// Delete multiple categories (soft delete)
export const deleteMultipleCategories = async (req, res) => {
  try {
    const { mpc_ids } = req.body; // ekspektasi: [1,2,3]

    if (!mpc_ids || !Array.isArray(mpc_ids) || mpc_ids.length === 0) {
      return res.status(400).json({
        success: false,
        data: [],
        message: "mpc_ids must be a non-empty array"
      });
    }

    const categories = await MstProgramCategory.findAll({ where: { mpc_id: mpc_ids } });

    if (categories.length === 0) {
      return res.status(404).json({
        success: false,
        data: [],
        message: "No categories found for the provided IDs"
      });
    }

    const results = [];
    for (const category of categories) {
      if (!category.mpc_status) {
        results.push({ mpc_id: category.mpc_id, status: "already inactive" });
      } else {
        await category.update({ mpc_status: false });
        results.push({ mpc_id: category.mpc_id, status: "deactivated" });
      }
    }

    res.status(200).json({
      success: true,
      data: results,
      message: "Categories processed successfully"
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
