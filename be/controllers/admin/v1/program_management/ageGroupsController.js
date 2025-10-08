import { MstProgramAge } from "../../../../models/mst_program_ages/mst_program_ages.js";
import { Op } from "sequelize";

export const getAgeGroups = async (req, res) => {
  try {
    const ages = await MstProgramAge.findAll({
      order: [['mpa_id', 'ASC']] // order by mpa_id ascending
    });

    res.json({
      success: true,
      data: ages,
      message: "Age Groups fetched successfully"
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      data: [],
      message: err.message
    });
  }
};

export const getAgeGroupSelect = async (req, res) => {
  try {
    const ages = await MstProgramAge.findAll({
      where: { mpa_status: true },   // filter hanya yang aktif
      order: [['mpa_id', 'ASC']]     // urutkan berdasarkan mpa_id ascending
    });

    res.json({
      success: true,
      data: ages,
      message: "Active Age Groups fetched successfully"
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      data: [],
      message: err.message
    });
  }
};

export const createAgeGroup = async (req, res) => {
  try {
    let { mpa_min, mpa_max, mpa_status } = req.body;

    // Validasi input minimal
    if (mpa_min === undefined || mpa_max === undefined) {
      return res.status(400).json({
        success: false,
        data: [],
        message: "mpa_min and mpa_max are required"
      });
    }

    // Default mpa_status ke true jika tidak dikirim
    mpa_status = mpa_status !== undefined ? mpa_status : true;

    // Cek apakah kombinasi mpa_min + mpa_max sudah ada
    const existing = await MstProgramAge.findOne({
      where: {
        mpa_min,
        mpa_max
      }
    });

    if (existing) {
      if (existing.mpa_status === true) {
        // Jika sudah ada dan aktif, return error
        return res.status(400).json({
          success: false,
          data: { mpa_min, mpa_max },
          message: "Age group with this range already exists and is active"
        });
      } else {
        // Jika ada tapi status false, update jadi true atau insert baru sesuai kebutuhan
        const updated = await existing.update({ mpa_status });
        return res.status(200).json({
          success: true,
          data: updated,
          message: "Existing age group was inactive and is now updated"
        });
      }
    }

    // Jika belum ada, buat baru
    const ageGroup = await MstProgramAge.create({
      mpa_min,
      mpa_max,
      mpa_status
    });

    res.status(201).json({
      success: true,
      data: ageGroup,
      message: "Age Group created successfully"
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


export const deleteAgeGroup = async (req, res) => {
  try {
    const { mpa_id } = req.params;

    if (!mpa_id) {
      return res.status(400).json({
        success: false,
        data: [],
        message: "mpa_id is required"
      });
    }

    // Cari data berdasarkan mpa_id
    const ageGroup = await MstProgramAge.findByPk(mpa_id);

    if (!ageGroup) {
      return res.status(404).json({
        success: false,
        data: [],
        message: "Age Group not found"
      });
    }

    // Soft delete: ubah mpa_status menjadi false
    if (!ageGroup.mpa_status) {
      return res.status(400).json({
        success: false,
        data: { mpa_id },
        message: "Age Group is already inactive"
      });
    }

    await ageGroup.update({ mpa_status: false });

    res.status(200).json({
      success: true,
      data: { mpa_id },
      message: "Age Group has been deactivated (soft deleted)"
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


export const updateAgeGroup = async (req, res) => {
  try {
    const { mpa_id } = req.params;
    let { mpa_min, mpa_max, mpa_status } = req.body;

    // Validasi mpa_id
    if (!mpa_id) {
      return res.status(400).json({
        success: false,
        data: [],
        message: "mpa_id is required"
      });
    }

    // Cari age group berdasarkan mpa_id
    const ageGroup = await MstProgramAge.findByPk(mpa_id);
    if (!ageGroup) {
      return res.status(404).json({
        success: false,
        data: [],
        message: "Age Group not found"
      });
    }

    // Cek apakah kombinasi mpa_min + mpa_max sudah ada di record lain
    if (mpa_min !== undefined && mpa_max !== undefined) {
      const existing = await MstProgramAge.findOne({
        where: {
          mpa_min,
          mpa_max,
          mpa_id: { [Op.ne]: mpa_id } // pastikan bukan record yang sama
        }
      });

      if (existing && existing.mpa_status === true) {
        return res.status(400).json({
          success: false,
          data: { mpa_min, mpa_max },
          message: "Another active age group with this range already exists"
        });
      }
    }

    // Update data
    const updated = await ageGroup.update({
      mpa_min: mpa_min !== undefined ? mpa_min : ageGroup.mpa_min,
      mpa_max: mpa_max !== undefined ? mpa_max : ageGroup.mpa_max,
      mpa_status: mpa_status !== undefined ? mpa_status : ageGroup.mpa_status
    });

    res.status(200).json({
      success: true,
      data: updated,
      message: "Age Group updated successfully"
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


export const deleteMultipleAgeGroups = async (req, res) => {
  try {
    const { mpa_ids } = req.body; // ekspektasi: [1, 2, 4, 5]

    if (!mpa_ids || !Array.isArray(mpa_ids) || mpa_ids.length === 0) {
      return res.status(400).json({
        success: false,
        data: [],
        message: "mpa_ids must be a non-empty array"
      });
    }

    // Cari semua age group yang ada
    const ageGroups = await MstProgramAge.findAll({
      where: { mpa_id: mpa_ids }
    });

    if (ageGroups.length === 0) {
      return res.status(404).json({
        success: false,
        data: [],
        message: "No Age Groups found for the provided IDs"
      });
    }

    // Lakukan soft delete (ubah mpa_status menjadi false)
    const results = [];
    for (const ageGroup of ageGroups) {
      if (!ageGroup.mpa_status) {
        results.push({ mpa_id: ageGroup.mpa_id, status: "already inactive" });
      } else {
        await ageGroup.update({ mpa_status: false });
        results.push({ mpa_id: ageGroup.mpa_id, status: "deactivated" });
      }
    }

    res.status(200).json({
      success: true,
      data: results,
      message: "Age Groups processed successfully"
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
