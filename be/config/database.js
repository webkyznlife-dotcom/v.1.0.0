import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config({ path: `.env.${process.env.NODE_ENV || "development"}` });

// Inisialisasi koneksi Sequelize
export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,   // port PostgreSQL
    dialect: "postgres",                 // ganti "mysql" kalau pakai MySQL
    logging: false,                      // matikan logging SQL
    pool: {
      max: 50,        // maksimal koneksi
      min: 0,
      acquire: 60000, // timeout mendapatkan koneksi (ms)
      idle: 10000,    // timeout koneksi idle (ms)
    },
  }
);

// Test koneksi
sequelize.authenticate()
  .then(() => console.log("✅ Connected to PostgreSQL via Sequelize"))
  .catch((err) => console.error("❌ Connection error:", err));
