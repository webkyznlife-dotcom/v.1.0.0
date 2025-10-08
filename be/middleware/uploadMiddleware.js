import multer from "multer";
import path from "path";
import fs from "fs";

// Tentukan folder penyimpanan dan nama file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Mapping folder berdasarkan fieldname
    let uploadPath = "uploads/others"; // default

    if (file.fieldname === "mp_header_image") {
      uploadPath = "uploads/program/header";
    } else if (file.fieldname === "mp_thumbnail") {
      uploadPath = "uploads/program/thumbnail";
    } else if (file.fieldname === "mpi_images") {
      uploadPath = "uploads/program/images";
    } else if (file.fieldname === "avatar") {
      uploadPath = "uploads/users/avatar";
    } else if (file.fieldname === "me_image_url") {
      uploadPath = "uploads/events"; // folder khusus untuk Events
    } else if (file.fieldname === "mc_image") {
      uploadPath = "uploads/collaborations"; // folder khusus untuk Collaborations
    } else if (file.fieldname === "mci_image") {
      uploadPath = "uploads/courts"; // folder khusus untuk Collaborations
    } else if (file.fieldname === "mbi_image") {
      uploadPath = "uploads/branchs"; // folder khusus untuk Collaborations
    } else if (file.fieldname === "mct_avatar") {
      uploadPath = "uploads/customer_testimonial"; // folder khusus untuk Collaborations
    }

    // Pastikan foldernya ada, kalau belum -> buat dulu
    fs.mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = path
      .basename(file.originalname, ext)
      .replace(/\s+/g, "_");
    cb(null, `${name}_${Date.now()}${ext}`);
  },
});

// Filter file hanya image
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

export const upload = multer({ storage, fileFilter });
