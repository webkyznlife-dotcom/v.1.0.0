import { MstCourt } from "../../../../models/mst_courts/mst_courts.js";
import { MstCourtImage } from "../../../../models/mst_courts_image/mst_courts_image.js";

export const getCourts = async (req, res) => {
  try {
    const courts = await MstCourt.findAll();
    res.json({
      success: true,
      data: courts,
      message: "Courts fetched successfully"
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      data: [],
      message: err.message
    });
  }
};

// Tambahkan controller untuk mengambil court beserta images-nya
export const getCourtWithImages = async (req, res) => {
  try {
    const courts = await MstCourt.findAll({
      include: [
        {
          model: MstCourtImage,
          as: "MstCourtImages", // gunakan alias jika diperlukan, atau hapus jika tidak pakai alias
        }
      ]
    });
    res.json({
      success: true,
      data: courts,
      message: "Courts with images fetched successfully"
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      data: [],
      message: err.message
    });
  }
};
