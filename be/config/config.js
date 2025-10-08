import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT || 3000;
export const UPLOAD_DIR = process.env.UPLOAD_DIR || "uploads";
