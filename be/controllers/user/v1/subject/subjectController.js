import { MstSubject } from "../../../../models/mst_subject/mst_subject.js";

/**
 * Helper untuk handle error Sequelize
 */
const handleSequelizeError = (err, res) => {
  if (
    err.name === "SequelizeValidationError" ||
    err.name === "SequelizeUniqueConstraintError"
  ) {
    const messages = err.errors.map((e) => e.message);
    return res.status(400).json({
      success: false,
      data: [],
      message: messages.join(", "),
    });
  }
  return res.status(500).json({
    success: false,
    data: [],
    message: err.message,
  });
};

export const getSubjects = async (req, res) => {
  try {
    const subjects = await MstSubject.findAll({
      where: { subject_status: true },
    });

    res.json({
      success: true,
      data: subjects,
      message: "Active subjects fetched successfully",
    });
  } catch (err) {
    return handleSequelizeError(err, res);
  }
};
