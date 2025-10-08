import { Op, fn, col, literal } from "sequelize";
import { TrxVisitor } from "../../../../models/trx_visitor/trx_visitor.js";

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
 * GET: Visitor Summary with filter by period
 * filter: 'today', 'week', 'month', 'year'
 */
export const getVisitorSummaryCount = async (req, res) => {
  try {
    const { year } = req.body;
    const targetYear = year ? parseInt(year, 10) : new Date().getFullYear();

    const filters = ["today", "week", "month", "year"];
    const result = {};

    for (const filter of filters) {
      let whereClause;

      if (filter === "today") {
        // Hari ini di Jakarta
        whereClause = literal(`("tv_created_at" AT TIME ZONE 'Asia/Jakarta')::date = CURRENT_DATE`);
      } else if (filter === "week") {
        // Minggu kalender Senin–Minggu di Jakarta, sampai hari ini
        whereClause = literal(`
          DATE_TRUNC('week', "tv_created_at" AT TIME ZONE 'Asia/Jakarta') = 
          DATE_TRUNC('week', CURRENT_DATE AT TIME ZONE 'Asia/Jakarta')
        `);
      } else if (filter === "month") {
        // Bulan ini di Jakarta
        whereClause = literal(`
          DATE_TRUNC('month', "tv_created_at" AT TIME ZONE 'Asia/Jakarta') = 
          DATE_TRUNC('month', CURRENT_DATE AT TIME ZONE 'Asia/Jakarta')
        `);
      } else if (filter === "year") {
        // Tahun target di Jakarta
        whereClause = literal(`
          EXTRACT(YEAR FROM "tv_created_at" AT TIME ZONE 'Asia/Jakarta') = ${targetYear}
        `);
      }

      const count = await TrxVisitor.count({ where: whereClause });
      result[filter] = count;
    }

    return res.json({
      success: true,
      data: result,
      message: `Visitor summary count for year ${targetYear} fetched successfully`,
    });
  } catch (err) {
    console.error(err);
    handleSequelizeError(err, res);
  }
};


export const getVisitorForChart = async (req, res) => {
  try {
    let { year } = req.body;
    const currentYear = year ? parseInt(year, 10) : new Date().getFullYear();

    // Ambil data visitor per bulan untuk tahun yang dipilih
    const results = await TrxVisitor.findAll({
      attributes: [
        [fn("DATE_PART", "month", col("tv_created_at")), "month"],
        [fn("COUNT", col("tv_id")), "count"]
      ],
      where: literal(`EXTRACT(YEAR FROM "tv_created_at") = ${currentYear}`),
      group: [literal(`DATE_PART('month', "tv_created_at")`)],
      order: [literal(`DATE_PART('month', "tv_created_at") ASC`)]
    });

    // Buat array 12 bulan
    const months = [
      "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
      "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"
    ];

    // Map hasil query ke array 12 bulan, default 0
    const chartData = months.map((name, index) => {
      const monthNum = index + 1; // 1-12
      const row = results.find(r => parseInt(r.getDataValue("month"), 10) === monthNum);
      const count = row ? parseInt(row.getDataValue("count"), 10) : 0;
      return {
        name,
        uv: count,
        count
      };
    });

    return res.json({
      success: true,
      data: chartData,
      message: `Visitor chart data for year ${currentYear} fetched successfully`
    });

  } catch (err) {
    console.error(err);
    handleSequelizeError(err, res);
  }
};