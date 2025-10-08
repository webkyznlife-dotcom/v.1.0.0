import { MstProgramActivityCategory } from "../../../../models/mst_program_activity_categories/mst_program_activity_categories.js";
import { Op } from "sequelize";

export const getProgramActivityCategories = async (req, res) => {
  try {
    const categories = await MstProgramActivityCategory.findAll({
      where: {
        mpac_status: true // hanya yang aktif
      },
      order: [['mpac_id', 'ASC']] // order by mpac_id ascending
    });

    res.json({
      success: true,
      data: categories,
      message: "Program Activity Categories fetched successfully"
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      data: [],
      message: err.message
    });
  }
};