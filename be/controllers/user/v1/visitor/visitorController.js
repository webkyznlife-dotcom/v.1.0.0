import { TrxVisitor } from "../../../../models/trx_visitor/trx_visitor.js";
import axios from "axios";

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

/**
 * POST /api/visitor
 * body: { tv_ip_address?, tv_user_agent?, tv_page?, tv_city?, tv_country? }
 */
export const insertVisitor = async (req, res) => {
  try {
    const { tv_ip_address, tv_user_agent, tv_page, tv_city, tv_country } = req.body;

    // --- VALIDASI ---
    if (!tv_ip_address || typeof tv_ip_address !== "string") {
      return res.status(400).json({
        success: false,
        data: [],
        message: "Invalid or missing IP address",
      });
    }

    if (!tv_user_agent || typeof tv_user_agent !== "string") {
      return res.status(400).json({
        success: false,
        data: [],
        message: "Invalid or missing user agent",
      });
    }

    if (!tv_page || typeof tv_page !== "string") {
      return res.status(400).json({
        success: false,
        data: [],
        message: "Invalid or missing page",
      });
    }

    // city & country opsional, default ke kosong jika null/undefined
    const city = tv_city || "";
    const country = tv_country || "";

    // --- SIMPAN KE DATABASE ---
    const visitor = await TrxVisitor.create({
      tv_ip_address,
      tv_user_agent,
      tv_page,
      tv_city: city,
      tv_country: country,
    });

    return res.status(201).json({
      success: true,
      data: visitor,
      message: "Visitor logged successfully",
    });
  } catch (err) {
    console.error(err);
    handleSequelizeError(err, res);
  }
};