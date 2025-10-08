import { MstCollaboration } from "../../../../models/mst_collaboration/mst_collaboration.js";

export const getCollaborations = async (req, res) => {
  try {
    const collaborations = await MstCollaboration.findAll({
      where: { mc_status: true } // hanya yang status true
    });
    res.json({
      success: true,
      data: collaborations,
      message: "Collaborations fetched successfully"
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      data: [],
      message: err.message
    });
  }
};
