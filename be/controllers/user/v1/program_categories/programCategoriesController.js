import { MstProgramCategory } from "../../../../models/mst_program_categories/mst_program_categories.js";
import { Op } from "sequelize";

export const getProgramCategories = async (req, res) => {
  try {
    const categories = await MstProgramCategory.findAll({
      where: {
        mpc_status: true // hanya yang aktif
      },
      order: [['mpc_id', 'ASC']] // order by mpc_id ascending
    });

    res.json({
      success: true,
      data: categories,
      message: "Program Categories fetched successfully"
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      data: [],
      message: err.message
    });
  }
};
