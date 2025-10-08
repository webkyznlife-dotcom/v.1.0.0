import { MstProgram } from "../../../../models/mst_programs/mst_programs.js";
import { MstProgramImage } from "../../../../models/mst_programs_image/mst_programs_image.js";
import { MstProgramCategory } from "../../../../models/mst_program_categories/mst_program_categories.js";
import { MstProgramAge } from "../../../../models/mst_program_ages/mst_program_ages.js";
import { MstProgramActivityCategory } from "../../../../models/mst_program_activity_categories/mst_program_activity_categories.js";
import { Op } from "sequelize";

// Get all programs with optional relations
// export const getPrograms = async (req, res) => {
//   try {
//     const programs = await MstProgram.findAll({
//       order: [['mp_id', 'ASC']],
//       include: [
//         { model: MstProgramImage, where: { mpi_status: true }, required: false }, // include images if any
//         { model: MstProgramCategory, attributes: ['mpc_id', 'mpc_name'], required: false },
//         { model: MstProgramAge, attributes: ['mpa_id', 'mpa_min', 'mpa_max'], required: false },
//         { model: MstProgramActivityCategory, attributes: ['mpac_id', 'mpac_name'], required: false }
//       ]
//     });

//     res.json({
//       success: true,
//       data: programs,
//       message: "Programs fetched successfully"
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({
//       success: false,
//       data: [],
//       message: err.message
//     });
//   }
// };

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



// // Update program
// export const updateProgram = async (req, res) => {
//   try {
//     const { mp_id } = req.params;
//     let {
//       mp_name,
//       mp_description,
//       mp_category_id,
//       mp_age_id,
//       mp_activity_category_id,
//       mp_status,
//       mp_header_image,
//       mp_thumbnail
//     } = req.body;

//     if (!mp_id) {
//       return res.status(400).json({
//         success: false,
//         data: [],
//         message: "mp_id is required"
//       });
//     }

//     const program = await MstProgram.findByPk(mp_id);
//     if (!program) {
//       return res.status(404).json({
//         success: false,
//         data: [],
//         message: "Program not found"
//       });
//     }

//     // Normalize name if provided
//     if (mp_name) {
//       mp_name = mp_name.toLowerCase().trim();

//       // Check for duplicate name in other programs
//       const existing = await MstProgram.findOne({
//         where: {
//           mp_name,
//           mp_id: { [Op.ne]: mp_id }
//         }
//       });

//       if (existing && existing.mp_status === true) {
//         return res.status(400).json({
//           success: false,
//           data: { mp_name },
//           message: "Another active program with this name already exists"
//         });
//       }
//     }

//     // Update program
//     const updated = await program.update({
//       mp_name: mp_name !== undefined ? mp_name : program.mp_name.toLowerCase(),
//       mp_description: mp_description !== undefined ? mp_description : program.mp_description,
//       mp_category_id: mp_category_id !== undefined ? mp_category_id : program.mp_category_id,
//       mp_age_id: mp_age_id !== undefined ? mp_age_id : program.mp_age_id,
//       mp_activity_category_id: mp_activity_category_id !== undefined ? mp_activity_category_id : program.mp_activity_category_id,
//       mp_status: mp_status !== undefined ? mp_status : program.mp_status,
//       mp_header_image: mp_header_image !== undefined ? mp_header_image : program.mp_header_image,
//       mp_thumbnail: mp_thumbnail !== undefined ? mp_thumbnail : program.mp_thumbnail,
//       updated_at: new Date()
//     });

//     res.status(200).json({
//       success: true,
//       data: updated,
//       message: "Program updated successfully"
//     });

//   } catch (err) {
//     console.error(err);

//     if (err.name === "SequelizeValidationError" || err.name === "SequelizeUniqueConstraintError") {
//       const messages = err.errors.map(e => e.message);
//       return res.status(400).json({
//         success: false,
//         data: [],
//         message: messages.join(", ")
//       });
//     }

//     res.status(500).json({
//       success: false,
//       data: [],
//       message: err.message
//     });
//   }
// };

// Update program
// export const updateProgram = async (req, res) => {
//   try {
//     const { mp_id } = req.params;
//     let {
//       mp_name,
//       mp_description,
//       mp_category_id,
//       mp_age_id,
//       mp_activity_category_id,
//       mp_status
//     } = req.body;

//     if (!mp_id) {
//       return res.status(400).json({
//         success: false,
//         data: [],
//         message: "mp_id is required"
//       });
//     }

//     const program = await MstProgram.findByPk(mp_id);
//     if (!program) {
//       return res.status(404).json({
//         success: false,
//         data: [],
//         message: "Program not found"
//       });
//     }

//     // Simpan file baru jika ada upload
//     const mp_header_image = req.files['mp_header_image']?.[0]?.filename || program.mp_header_image;
//     const mp_thumbnail = req.files['mp_thumbnail']?.[0]?.filename || program.mp_thumbnail;

//     // Update program
//     const updatedProgram = await program.update({
//       mp_name,
//       mp_description,
//       mp_category_id: mp_category_id || null,
//       mp_age_id: mp_age_id || null,
//       mp_activity_category_id: mp_activity_category_id || null,
//       mp_status: mp_status !== undefined ? mp_status : program.mp_status,
//       mp_header_image,
//       mp_thumbnail,
//       updated_at: new Date()
//     });

//     // Handle multiple images
// // Handle multiple images
// if (req.files['mpi_images'] && req.files['mpi_images'].length > 0) {
//   // Hapus semua gambar lama
//   await MstProgramImage.destroy({ where: { mp_id } });

//   // Simpan semua gambar baru
//   const images = req.files['mpi_images'].map((file, index) => {
//     const desc = req.body[`mpi_description_${index}`]; // gunakan backtick dan index
//     const stat = req.body[`mpi_status_${index}`];

//     // Tambahkan log
//     console.log(`Preparing Image ${index}:`);
//     console.log(`  filename: ${file.filename}`);
//     console.log(`  description: ${desc}`);
//     console.log(`  status: ${stat}`);

//     return {
//       mp_id,
//       mpi_image: file.filename,
//       mpi_description: desc || null,
//       mpi_status: stat === "false" ? false : true,
//     };
//   });

//   console.log("All images to be inserted:", images);

//   await MstProgramImage.bulkCreate(images)
//     .then(() => console.log("Images saved successfully!"))
//     .catch((err) => console.error("Failed to save images:", err));
// }



//     return res.status(200).json({
//       success: true,
//       data: updatedProgram,
//       message: "Program updated successfully"
//     });

//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({
//       success: false,
//       data: [],
//       message: err.message
//     });
//   }
// };


// export const updateProgram = async (req, res) => {
//   try {
//     const { mp_id } = req.params;
//     let {
//       mp_name,
//       mp_description,
//       mp_category_id,
//       mp_age_id,
//       mp_activity_category_id,
//       mp_status
//     } = req.body;

//     if (!mp_id) {
//       return res.status(400).json({
//         success: false,
//         data: [],
//         message: "mp_id is required"
//       });
//     }

//     const program = await MstProgram.findByPk(mp_id);
//     if (!program) {
//       return res.status(404).json({
//         success: false,
//         data: [],
//         message: "Program not found"
//       });
//     }

//     // Simpan file baru jika ada upload
//     const mp_header_image = req.files['mp_header_image']?.[0]?.filename || program.mp_header_image;
//     const mp_thumbnail = req.files['mp_thumbnail']?.[0]?.filename || program.mp_thumbnail;

//     // Update program
//     const updatedProgram = await program.update({
//       mp_name,
//       mp_description,
//       mp_category_id: mp_category_id || null,
//       mp_age_id: mp_age_id || null,
//       mp_activity_category_id: mp_activity_category_id || null,
//       mp_status: mp_status !== undefined ? mp_status : program.mp_status,
//       mp_header_image,
//       mp_thumbnail,
//       updated_at: new Date()
//     });

//     // Handle multiple images

//     // Ambil semua gambar lama
//     const oldImages = await MstProgramImage.findAll({ where: { mp_id } });

//     // Update description/status gambar lama
//     for (let i = 0; i < oldImages.length; i++) {
//       const img = oldImages[i];
//       const newDesc = req.body[`mpi_description_${i}`];
//       const newStatus = req.body[`mpi_status_${i}`];

//       await img.update({
//         mpi_description: newDesc ?? img.mpi_description,
//         mpi_status: newStatus === undefined ? img.mpi_status : (newStatus === "false" ? false : true)
//       });

//       console.log(`Updated old image ${i}: filename=${img.mpi_image}, description=${newDesc}, status=${newStatus}`);
//     }

//     // Tambahkan gambar baru jika ada upload baru
//     if (req.files['mpi_images'] && req.files['mpi_images'].length > 0) {
//       const newImages = req.files['mpi_images'].map((file, index) => {
//         const desc = req.body[`mpi_description_new_${index}`] || null;
//         const stat = req.body[`mpi_status_new_${index}`] || true;

//         console.log(`Preparing new Image ${index}: filename=${file.filename}, description=${desc}, status=${stat}`);

//         return {
//           mp_id,
//           mpi_image: file.filename,
//           mpi_description: desc,
//           mpi_status: stat === "false" ? false : true
//         };
//       });

//       await MstProgramImage.bulkCreate(newImages)
//         .then(() => console.log("New images saved successfully!"))
//         .catch((err) => console.error("Failed to save new images:", err));
//     }

//     return res.status(200).json({
//       success: true,
//       data: updatedProgram,
//       message: "Program updated successfully"
//     });

//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({
//       success: false,
//       data: [],
//       message: err.message
//     });
//   }
// };


// export const updateProgram = async (req, res) => {
//   try {
//     const { mp_id } = req.params;
//     const {
//       mp_name,
//       mp_description,
//       mp_category_id,
//       mp_age_id,
//       mp_activity_category_id,
//       mp_status
//     } = req.body;

//     if (!mp_id) {
//       return res.status(400).json({
//         success: false,
//         data: [],
//         message: "mp_id is required"
//       });
//     }

//     const program = await MstProgram.findByPk(mp_id);
//     if (!program) {
//       return res.status(404).json({
//         success: false,
//         data: [],
//         message: "Program not found"
//       });
//     }

//     // Simpan file baru jika ada upload
//     const mp_header_image = req.files?.['mp_header_image']?.[0]?.filename || program.mp_header_image;
//     const mp_thumbnail = req.files?.['mp_thumbnail']?.[0]?.filename || program.mp_thumbnail;

//     // Update data utama program
//     const updatedProgram = await program.update({
//       mp_name,
//       mp_description,
//       mp_category_id: mp_category_id || null,
//       mp_age_id: mp_age_id || null,
//       mp_activity_category_id: mp_activity_category_id || null,
//       mp_status: mp_status !== undefined ? mp_status : program.mp_status,
//       mp_header_image,
//       mp_thumbnail,
//       updated_at: new Date()
//     });

//     // --- Update gambar lama ---
//     // const oldImages = await MstProgramImage.findAll({ where: { mp_id } });
//     // for (let i = 0; i < oldImages.length; i++) {
//     //   const img = oldImages[i];
//     //   const newDesc = img[`mpi_description_${i}`];
//     //   const newStatus = img[`mpi_status_${i}`];

//     //   await img.update({
//     //     mpi_description: newDesc ?? img.mpi_description,
//     //     mpi_status: newStatus === undefined ? img.mpi_status : (newStatus === "false" ? false : true)
//     //   });

//     //   console.log(`Updated old image ${i}: filename=${img.mpi_image}, description=${newDesc}, status=${newStatus}`);
//     // }


//     console.log("sssss", req.files?.['mpi_images']?.length);

//     // --- Tambah gambar baru ---
//     if (req.files?.['mpi_images']?.length > 0) {
//       const newImages = req.files['mpi_images'].map((file, index) => {
//         const desc = req.body[`mpi_description_new_${index}`] || null;
//         const stat = req.body[`mpi_status_new_${index}`];

//         console.log(`Preparing new image ${index}: filename=${file.filename}, description=${desc}, status=${stat}`);

//         return {
//           mp_id,
//           mpi_image: file.filename,
//           mpi_description: desc,
//           mpi_status: stat === "false" ? false : true
//         };
//       });

//       await MstProgramImage.bulkCreate(newImages);
//       console.log("New images saved successfully!");
//     }

//     return res.status(200).json({
//       success: true,
//       data: updatedProgram,
//       message: "Program updated successfully"
//     });

//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({
//       success: false,
//       data: [],
//       message: err.message
//     });
//   }
// };

// export const updateProgram = async (req, res) => {
//   try {
//     const { mp_id } = req.params;
//     const {
//       mp_name,
//       mp_description,
//       mp_category_id,
//       mp_age_id,
//       mp_activity_category_id,
//       mp_status
//     } = req.body;

//     if (!mp_id) {
//       return res.status(400).json({
//         success: false,
//         data: [],
//         message: "mp_id is required"
//       });
//     }

//     const program = await MstProgram.findByPk(mp_id);
//     if (!program) {
//       return res.status(404).json({
//         success: false,
//         data: [],
//         message: "Program not found"
//       });
//     }

//     // Simpan file baru jika ada upload
//     const mp_header_image = req.files?.['mp_header_image']?.[0]?.filename || program.mp_header_image;
//     const mp_thumbnail = req.files?.['mp_thumbnail']?.[0]?.filename || program.mp_thumbnail;

//     // Update data utama program
//     const updatedProgram = await program.update({
//       mp_name,
//       mp_description,
//       mp_category_id: mp_category_id || null,
//       mp_age_id: mp_age_id || null,
//       mp_activity_category_id: mp_activity_category_id || null,
//       mp_status: mp_status !== undefined ? mp_status : program.mp_status,
//       mp_header_image,
//       mp_thumbnail,
//       updated_at: new Date()
//     });

//     // --- Hapus semua gambar lama ---
//     await MstProgramImage.destroy({ where: { mp_id } });
//     console.log(`Deleted old images for program ${mp_id}`);

//     // --- Insert gambar baru ---
//     if (req.files?.['mpi_images']?.length > 0) {
//       const newImages = req.files['mpi_images'].map((file, index) => {
//         const desc = req.body[`mpi_description_${index}`] || null;
//         const stat = req.body[`mpi_status_${index}`];

//         console.log(
//           `Preparing new image ${index}: filename=${file.filename}, description=${desc}, status=${stat}`
//         );

//         return {
//           mp_id,
//           mpi_image: file.filename,
//           mpi_description: desc,
//           mpi_status: stat === "false" ? false : true
//         };
//       });

//       await MstProgramImage.bulkCreate(newImages);
//       console.log("Inserted new images successfully!");
//     } else {
//       console.log("No new images uploaded.");
//     }

//     return res.status(200).json({
//       success: true,
//       data: updatedProgram,
//       message: "Program updated successfully"
//     });

//   } catch (err) {
//     console.error("Update program failed:", err);
//     return res.status(500).json({
//       success: false,
//       data: [],
//       message: err.message
//     });
//   }
// };


// export const updateProgram = async (req, res) => {
//   try {


//     const { mp_id } = req.params;
//     const {
//       mp_name,
//       mp_description,
//       mp_category_id,
//       mp_age_id,
//       mp_activity_category_id,
//       mp_status,
//     } = req.body;

//     if (!mp_id) {
//       return res.status(400).json({
//         success: false,
//         data: [],
//         message: "mp_id is required",
//       });
//     }

//     const program = await MstProgram.findByPk(mp_id);
//     if (!program) {
//       return res.status(404).json({
//         success: false,
//         data: [],
//         message: "Program not found",
//       });
//     }

//     // --- Simpan file utama (header & thumbnail) ---
//     const mp_header_image =
//       req.files?.["mp_header_image"]?.[0]?.filename || program.mp_header_image;
//     const mp_thumbnail =
//       req.files?.["mp_thumbnail"]?.[0]?.filename || program.mp_thumbnail;

//     // --- Update data utama ---
//     const updatedProgram = await program.update({
//       mp_name,
//       mp_description,
//       mp_category_id: mp_category_id || null,
//       mp_age_id: mp_age_id || null,
//       mp_activity_category_id: mp_activity_category_id || null,
//       mp_status:
//         mp_status !== undefined ? mp_status : program.mp_status,
//       mp_header_image,
//       mp_thumbnail,
//       updated_at: new Date(),
//     });

//     // --- Hapus semua gambar lama ---
//     await MstProgramImage.destroy({ where: { mp_id } });
//     console.log(`Deleted old images for program ${mp_id}`);

// const newImages = [];

// // 1️⃣ File baru dari upload
// const uploadedFiles = req.files?.["mpi_images"] || [];
// uploadedFiles.forEach((file, index) => {
//   const desc = req.body[`mpi_description_${index}`] || null;
//   const stat = req.body[`mpi_status_${index}`];

//   console.log("👉 NEW file:", file.filename, "| Desc:", desc, "| Status:", stat);

//   newImages.push({
//     mp_id,
//     mpi_image: file.filename,
//     mpi_description: desc,
//     mpi_status: stat === "false" ? false : true,
//   });
// });

// // 2️⃣ File lama dari body (string)
// let existingFiles = [];
// if (req.body.mpi_images_existing) {
//   existingFiles = Array.isArray(req.body.mpi_images_existing)
//     ? req.body.mpi_images_existing
//     : [req.body.mpi_images_existing];

//   existingFiles.forEach((filename, index) => {
//     const desc = req.body[`mpi_description_${index}`] || null;
//     const stat = req.body[`mpi_status_${index}`];

//     console.log("👉 OLD file:", filename, "| Desc:", desc, "| Status:", stat);

//     newImages.push({
//       mp_id,
//       mpi_image: filename,
//       mpi_description: desc,
//       mpi_status: stat === "false" ? false : true,
//     });
//   });
// }

//     // --- Debug total images ---
//     console.log("Total images yang akan diinsert:", newImages.length);

//     // --- Bulk insert ---
//     if (newImages.length > 0) {
//       await MstProgramImage.bulkCreate(newImages);
//       console.log("Inserted images successfully!");
//     } else {
//       console.log("No images provided.");
//     }

//     return res.status(200).json({
//       success: true,
//       data: updatedProgram,
//       message: "Program updated successfully",
//     });
//   } catch (err) {
//     console.error("Update program failed:", err);
//     return res.status(500).json({
//       success: false,
//       data: [],
//       message: err.message,
//     });
//   }
// };

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
    } = req.body;

    if (!mp_id) {
      return res.status(400).json({
        success: false,
        data: [],
        message: "mp_id is required",
      });
    }

    const program = await MstProgram.findByPk(mp_id);
    if (!program) {
      return res.status(404).json({
        success: false,
        data: [],
        message: "Program not found",
      });
    }

    // --- Simpan file utama (header & thumbnail) ---
    const mp_header_image =
      req.files?.["mp_header_image"]?.[0]?.filename || program.mp_header_image;
    const mp_thumbnail =
      req.files?.["mp_thumbnail"]?.[0]?.filename || program.mp_thumbnail;

    // --- Update data utama ---
    const updatedProgram = await program.update({
      mp_name,
      mp_description,
      mp_category_id: mp_category_id || null,
      mp_age_id: mp_age_id || null,
      mp_activity_category_id: mp_activity_category_id || null,
      mp_status: mp_status !== undefined ? mp_status : program.mp_status,
      mp_header_image,
      mp_thumbnail,
      updated_at: new Date(),
    });

    // --- Proses Images ---
    const newImages = [];

    // 1️⃣ File baru dari upload → INSERT
    const uploadedFiles = req.files?.["mpi_images"] || [];
    for (let i = 0; i < uploadedFiles.length; i++) {
      const file = uploadedFiles[i];
      const desc = req.body[`mpi_description_${i}`] || null;
      const stat = req.body[`mpi_status_${i}`];

      console.log("👉 NEW file:", file.filename, "| Desc:", desc, "| Status:", stat);

      newImages.push({
        mp_id,
        mpi_image: file.filename,
        mpi_description: desc,
        mpi_status: stat === "false" ? false : true,
      });
    }

    // 2️⃣ File lama dari body (string) → UPDATE
    let existingFiles = [];
    if (req.body.mpi_images_existing) {
      existingFiles = Array.isArray(req.body.mpi_images_existing)
        ? req.body.mpi_images_existing
        : [req.body.mpi_images_existing];

      for (let i = 0; i < existingFiles.length; i++) {
        const filename = existingFiles[i];
        const desc = req.body[`mpi_description_${i}`] || null;
        const stat = req.body[`mpi_status_${i}`];

        console.log("👉 OLD file:", filename, "| Desc:", desc, "| Status:", stat);

        // update langsung by filename
        await MstProgramImage.update(
          {
            mpi_description: desc,
            mpi_status: stat === "false" ? false : true,
          },
          { where: { mp_id, mpi_image: filename } }
        );
      }
    }

    // --- Insert only untuk gambar baru ---
    if (newImages.length > 0) {
      await MstProgramImage.bulkCreate(newImages);
      console.log("Inserted new images successfully!");
    }

    return res.status(200).json({
      success: true,
      data: updatedProgram,
      message: "Program updated successfully",
    });
  } catch (err) {
    console.error("Update program failed:", err);
    return res.status(500).json({
      success: false,
      data: [],
      message: err.message,
    });
  }
};



// export const updateProgram = async (req, res) => {
//   try {
//     const { mp_id } = req.params;
//     const {
//       mp_name,
//       mp_description,
//       mp_category_id,
//       mp_age_id,
//       mp_activity_category_id,
//       mp_status
//     } = req.body;

//     if (!mp_id) {
//       return res.status(400).json({ success: false, data: [], message: "mp_id is required" });
//     }

//     const program = await MstProgram.findByPk(mp_id);
//     if (!program) {
//       return res.status(404).json({ success: false, data: [], message: "Program not found" });
//     }

//     // --- Update header & thumbnail jika ada file baru ---
//     const mp_header_image = req.files?.['mp_header_image']?.[0]?.filename || program.mp_header_image;
//     const mp_thumbnail = req.files?.['mp_thumbnail']?.[0]?.filename || program.mp_thumbnail;

//     const updatedProgram = await program.update({
//       mp_name,
//       mp_description,
//       mp_category_id: mp_category_id || null,
//       mp_age_id: mp_age_id || null,
//       mp_activity_category_id: mp_activity_category_id || null,
//       mp_status: mp_status !== undefined ? mp_status : program.mp_status,
//       mp_header_image,
//       mp_thumbnail,
//       updated_at: new Date()
//     });

//     // --- Update gambar lama ---
//     const oldImages = await MstProgramImage.findAll({ where: { mp_id } });
//     for (let i = 0; i < oldImages.length; i++) {
//       const img = oldImages[i];

//       // Description & status lama
//       const newDesc = req.body[`mpi_description_${i}`] ?? img.mpi_description;
//       const newStatus = req.body[`mpi_status_${i}`] !== undefined
//         ? req.body[`mpi_status_${i}`] === "false" ? false : true
//         : img.mpi_status;

//       // File baru jika ada
//       const newFile = req.files?.[`mpi_image_${i}`]?.[0]?.filename || img.mpi_image;

//       await img.update({
//         mpi_description: newDesc,
//         mpi_status: newStatus,
//         mpi_image: newFile
//       });

//       console.log(`Updated old image ${i}: filename=${newFile}, description=${newDesc}, status=${newStatus}`);
//     }

//     // --- Tambah gambar baru ---
//     if (req.files?.['mpi_images']?.length > 0) {
//       const newImages = req.files['mpi_images'].map((file, index) => {
//         const desc = req.body[`mpi_description_new_${index}`] || null;
//         const stat = req.body[`mpi_status_new_${index}`];

//         return {
//           mp_id,
//           mpi_image: file.filename,
//           mpi_description: desc,
//           mpi_status: stat === "false" ? false : true
//         };
//       });

//       await MstProgramImage.bulkCreate(newImages);
//       console.log("New images saved successfully!");
//     }

//     return res.status(200).json({
//       success: true,
//       data: updatedProgram,
//       message: "Program updated successfully"
//     });

//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({
//       success: false,
//       data: [],
//       message: err.message
//     });
//   }
// };






// Create Program
export const createProgram = async (req, res) => {
  try {
    const {
      mp_name,
      mp_description,
      mp_category_id,
      mp_age_id,
      mp_activity_category_id,
      mp_status
    } = req.body;

    if (!mp_name) {
      return res.status(400).json({
        success: false,
        data: [],
        message: "mp_name is required"
      });
    }

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
      mp_thumbnail
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