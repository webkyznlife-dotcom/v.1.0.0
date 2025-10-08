import { MstProgram } from "../../../../models/mst_programs/mst_programs.js";
import { MstProgramImage } from "../../../../models/mst_programs_image/mst_programs_image.js";
import { MstProgramCategory } from "../../../../models/mst_program_categories/mst_program_categories.js";
import { MstProgramAge } from "../../../../models/mst_program_ages/mst_program_ages.js";
import { MstProgramActivityCategory } from "../../../../models/mst_program_activity_categories/mst_program_activity_categories.js";
import { Op, fn, col, where } from "sequelize";

// Get all programs with optional relations
export const getPrograms = async (req, res) => {
  try {
    const programs = await MstProgram.findAll({
      order: [['mp_id', 'ASC']],
      include: [
        { model: MstProgramImage, required: false }, // ambil semua images tanpa filter status
        {
          model: MstProgramCategory,
          attributes: ['mpc_id', 'mpc_name'],
          required: false,
        },
        {
          model: MstProgramAge,
          attributes: ['mpa_id', 'mpa_min', 'mpa_max'],
          required: false,
        },
        {
          model: MstProgramActivityCategory,
          attributes: ['mpac_id', 'mpac_name'],
          required: false,
        },
      ],
    });

    res.json({
      success: true,
      data: programs,
      message: "Programs fetched successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      data: [],
      message: err.message,
    });
  }
};

// Get all programs for select
export const getProgramsForSelect = async (req, res) => {
  try {
    const programs = await MstProgram.findAll({
      where: { mp_status: true },       // hanya ambil program aktif
      order: [['mp_id', 'ASC']]
    });

    res.json({
      success: true,
      data: programs,
      message: "Programs fetched successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      data: [],
      message: err.message,
    });
  }
};

export const updateProgram = async (req, res) => {
  try {
    const { mp_id } = req.params;
    const {
      mp_name,
      mp_description,
      mp_category_id,
      mp_age_id,
      mp_activity_category_id,
      mp_status,
      mpt_id 
    } = req.body;

    if (!mp_id) {
      return res.status(400).json({
        success: false,
        data: [],
        message: "Program ID is required",
      });
    }

    // 🔹 Update data utama program
    await MstProgram.update(
      {
        mp_name,
        mp_description,
        mp_category_id,
        mp_age_id,
        mp_activity_category_id,
        mp_status,
        mpt_id,
        updated_at: new Date(),
      },
      { where: { mp_id } }
    );

    // 🔹 Hapus semua images lama dulu (supaya sinkron)
    await MstProgramImage.destroy({ where: { mp_id } });

    let newImages = [];
    let globalIndex = 0;

    // =========================
    // 1️⃣ Handle OLD Files
    // =========================
    let existingFiles = [];
    if (req.body.mpi_images_existing) {
      existingFiles = Array.isArray(req.body.mpi_images_existing)
        ? req.body.mpi_images_existing
        : [req.body.mpi_images_existing];

      existingFiles.forEach((filename) => {
        const desc = req.body[`mpi_description_${globalIndex}`] || null;
        const stat = req.body[`mpi_status_${globalIndex}`];

        console.log(
          "👉 OLD file:",
          filename,
          "| Desc:",
          desc,
          "| Status:",
          stat
        );

        newImages.push({
          mp_id,
          mpi_image: filename,
          mpi_description: desc,
          mpi_status: stat === "false" ? false : true,
        });

        globalIndex++;
      });
    }

    // =========================
    // 2️⃣ Handle NEW Files
    // =========================
    const uploadedFiles = req.files?.["mpi_images"] || [];
    uploadedFiles.forEach((file) => {
      const desc = req.body[`mpi_description_${globalIndex}`] || null;
      const stat = req.body[`mpi_status_${globalIndex}`];

      console.log(
        "👉 NEW file:",
        file.filename,
        "| Desc:",
        desc,
        "| Status:",
        stat
      );

      newImages.push({
        mp_id,
        mpi_image: file.filename,
        mpi_description: desc,
        mpi_status: stat === "false" ? false : true,
      });

      globalIndex++;
    });

    // =========================
    // 3️⃣ Insert ke DB
    // =========================
    if (newImages.length > 0) {
      await MstProgramImage.bulkCreate(newImages);
      console.log("Inserted images successfully!");
    }

    return res.status(200).json({
      success: true,
      message: "Program updated successfully",
    });
  } catch (error) {
    console.error("Error updating program:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update program",
      error: error.message,
    });
  }
};



// Create Program
export const createProgram = async (req, res) => {
  try {
    const {
      mp_name,
      mp_description,
      mp_category_id,
      mp_age_id,
      mp_activity_category_id,
      mp_status,
      mpt_id
    } = req.body;

    if (!mp_name) {
      return res.status(400).json({
        success: false,
        data: [],
        message: "mp_name is required"
      });
    }

    // Cek apakah mp_name sudah ada (case-insensitive)
    const existingProgram = await MstProgram.findOne({
      where: where(fn("LOWER", col("mp_name")), mp_name.toLowerCase())
    });

    if (existingProgram) {
      return res.status(400).json({
        success: false,
        data: [],
        message: "Program name already exists (case-insensitive check)"
      });
    }  

    // 🔹 Generate slug dari mp_name
    const mp_slug = mp_name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\-]/g, "");    

    // Simpan path file header & thumbnail jika ada
    const mp_header_image = req.files['mp_header_image']?.[0]?.filename || null;
    const mp_thumbnail = req.files['mp_thumbnail']?.[0]?.filename || null;

    // Create program
    const newProgram = await MstProgram.create({
      mp_name,
      mp_description,
      mp_category_id: mp_category_id || null,
      mp_age_id: mp_age_id || null,
      mp_activity_category_id: mp_activity_category_id || null,
      mp_status: mp_status !== undefined ? mp_status : true,
      mp_header_image,
      mp_thumbnail,
      mp_slug,
      mpt_id: mpt_id || null // ✅ sertakan Program Type
    });

    // Handle multiple images untuk MstProgramImage
    if (req.files['mpi_images'] && req.files['mpi_images'].length > 0) {

      const images = req.files['mpi_images'].map((file, index) => {
        const desc = req.body[`mpi_description_${index}`];
        const stat = req.body[`mpi_status_${index}`];

        return {
          mp_id: newProgram.mp_id,
          mpi_image: file.filename,
          mpi_description: desc || null,
          mpi_status: stat === "false" ? false : true,
        };
      });

      await MstProgramImage.bulkCreate(images);
    }

    return res.status(201).json({
      success: true,
      data: newProgram,
      message: "Program created successfully"
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      data: [],
      message: err.message
    });
  }
};


// Soft delete single program
export const deleteProgram = async (req, res) => {
  try {
    const { mp_id } = req.params;

    if (!mp_id) {
      return res.status(400).json({
        success: false,
        data: [],
        message: "mp_id is required"
      });
    }

    const program = await MstProgram.findByPk(mp_id);

    if (!program) {
      return res.status(404).json({
        success: false,
        data: [],
        message: "Program not found"
      });
    }

    if (!program.mp_status) {
      return res.status(400).json({
        success: false,
        data: { mp_id },
        message: "Program is already inactive"
      });
    }

    await program.update({ mp_status: false });

    res.status(200).json({
      success: true,
      data: { mp_id },
      message: "Program has been deactivated (soft deleted)"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      data: [],
      message: err.message
    });
  }
};

// Soft delete multiple programs
export const deleteMultiplePrograms = async (req, res) => {
  try {
    const { mp_ids } = req.body; // ekspektasi: [1,2,3]

    if (!mp_ids || !Array.isArray(mp_ids) || mp_ids.length === 0) {
      return res.status(400).json({
        success: false,
        data: [],
        message: "mp_ids must be a non-empty array"
      });
    }

    const programs = await MstProgram.findAll({ where: { mp_id: mp_ids } });

    if (programs.length === 0) {
      return res.status(404).json({
        success: false,
        data: [],
        message: "No programs found for the provided IDs"
      });
    }

    const results = [];
    for (const program of programs) {
      if (!program.mp_status) {
        results.push({ mp_id: program.mp_id, status: "already inactive" });
      } else {
        await program.update({ mp_status: false });
        results.push({ mp_id: program.mp_id, status: "deactivated" });
      }
    }

    res.status(200).json({
      success: true,
      data: results,
      message: "Programs processed successfully"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      data: [],
      message: err.message
    });
  }
};