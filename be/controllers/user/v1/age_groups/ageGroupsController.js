import { MstProgramAge } from "../../../../models/mst_program_ages/mst_program_ages.js";
import { Op } from "sequelize";

export const getAgeGroups = async (req, res) => {
  try {
    const ages = await MstProgramAge.findAll({
      where: {
        mpa_status: true // hanya yang aktif
      },
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