import { Op, fn, col, where, literal } from "sequelize";
import { TrxContact } from "../../../../models/trx_contact/trx_contact.js";
import { MstSubject } from "../../../../models/mst_subject/mst_subject.js";

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

/**
 * POST: Get Contact Summary By Subject (filter by month & year)
 */
export const getContactSummaryBySubject = async (req, res) => {
  try {
    let { month, year } = req.body;

    month = month ?? "All";
    year = year ?? "";

    let whereClause = {};

    const isMonthAll = month === "All" || month === "" || month === null;
    const isYearEmpty = year === "" || year === null;

    if (!isMonthAll && !isYearEmpty) {
      whereClause = literal(
        `EXTRACT(MONTH FROM "TrxContact"."created_at") = ${month} AND EXTRACT(YEAR FROM "TrxContact"."created_at") = ${year}`
      );
    } else if (!isYearEmpty) {
      whereClause = literal(
        `EXTRACT(YEAR FROM "TrxContact"."created_at") = ${year}`
      );
    } else if (!isMonthAll) {
      whereClause = literal(
        `EXTRACT(MONTH FROM "TrxContact"."created_at") = ${month}`
      );
    }

    const results = await TrxContact.findAll({
      attributes: [
        [col("MstSubject.subject_name"), "subject"],
        [fn("COUNT", col("TrxContact.tc_id")), "count"]
      ],
      include: [
        {
          model: MstSubject,
          attributes: [],
          required: false
        }
      ],
      where: whereClause,
      group: ["MstSubject.subject_name"],
      order: [[fn("COUNT", col("TrxContact.tc_id")), "DESC"]]
    });

    const data = results.map(r => ({
      subject: r.getDataValue("subject") || "other",
      count: parseInt(r.getDataValue("count"), 10)
    }));

    return res.json({
      success: true,
      data,
      message: "Contact summary by subject fetched successfully"
    });

  } catch (err) {
    console.error(err);
    handleSequelizeError(err, res);
  }
};

export const getMasterSubject = async (req, res) => {
  try {
  const subjects = await MstSubject.findAll({
    attributes: ["subject_id", "subject_name"], // gunakan subject_name, bukan subject_code
    where: { subject_status: true },
  });

    // Convert ke key-value object
    const subjectMap = {};
    subjects.forEach(sub => {
      subjectMap[sub.subject_name] = sub.subject_name;
    });

    return res.json({
      success: true,
      data: subjectMap,
      message: "Master subjects fetched successfully"
    });
  } catch (err) {
    console.error(err);
    handleSequelizeError(err, res);
  }
};