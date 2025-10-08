import { MstProgram } from "../../../../models/mst_programs/mst_programs.js";
import { MstProgramImage } from "../../../../models/mst_programs_image/mst_programs_image.js";

import { MstProgramCategory } from "../../../../models/mst_program_categories/mst_program_categories.js";
import { MstProgramAge } from "../../../../models/mst_program_ages/mst_program_ages.js";
import { MstProgramActivityCategory } from "../../../../models/mst_program_activity_categories/mst_program_activity_categories.js";

import { MstProgramKeyPoint } from "../../../../models/mst_program_key_points/mst_program_key_points.js";
import { MstProgramType } from "../../../../models/mst_program_type/mst_program_type.js";

import { Op } from "sequelize";


export const getPrograms = async (req, res) => {
  try {
    const mstprograms = await MstProgram.findAll({
      where: { mp_status: true }, // ✅ hanya ambil program aktif
      order: [["created_at", "DESC"]], // opsional: urutkan terbaru dulu
    });
    res.json({
      success: true,
      data: mstprograms,
      message: "Programs fetched successfully"
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      data: [],
      message: err.message 
    });
  }
};

export const getProgramsWithSearch = async (req, res) => {
  try {
    const { mp_category_id, search } = req.body;

    // filter dasar: hanya program aktif
    const whereClause = { mp_status: true };

    // filter kategori (opsional)
    if (mp_category_id) {
      whereClause.mp_category_id = mp_category_id;
    }

    // filter search (opsional, cek null / kosong)
    if (search && search.trim() !== "") {
      whereClause.mp_name = { [Op.like]: `%${search}%` };
    }

    const mstprograms = await MstProgram.findAll({
      where: whereClause,
      order: [["created_at", "DESC"]],
    });

    res.json({
      success: true,
      data: mstprograms,
      message: "Programs fetched successfully"
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      data: [],
      message: err.message
    });
  }
};

export const getProgramsWithPagination = async (req, res) => {
  try {
    const page = parseInt(req.body.page) || 1; // default page 1
    const limit = parseInt(req.body.limit) || 12; // default limit 4
    const offset = (page - 1) * limit;

    const { mp_category_id, mp_age_id } = req.body; // filter dari body

    // Build filter object untuk include
    const whereCategory = mp_category_id ? { mpc_id: mp_category_id } : {};
    const whereAge = mp_age_id ? { mpa_id: mp_age_id } : {};

    // Filter utama untuk MstProgram
    const whereProgram = { mp_status: true }; // hanya yang aktif

    const { count, rows } = await MstProgram.findAndCountAll({
      where: whereProgram,
      limit,
      offset,
      order: [["created_at", "DESC"]],
      distinct: true, // hitung program unik, bukan row hasil join
      include: [
        { model: MstProgramImage, attributes: ["mpi_id", "mpi_image", "mpi_description", "mpi_status"] },
        { model: MstProgramCategory, attributes: ["mpc_id", "mpc_name"], where: whereCategory, required: mp_category_id ? true : false },
        { model: MstProgramAge, attributes: ["mpa_id", "mpa_min", "mpa_max"], where: whereAge, required: mp_age_id ? true : false },
        { model: MstProgramActivityCategory, attributes: ["mpac_id", "mpac_name"] },
        { model: MstProgramType, attributes: ["mpt_id", "mpt_name"] } // ⬅️ Tambahan Program Type
      ]
    });

    const formattedPrograms = rows.map(p => ({
      mp_id: p.mp_id,
      mp_name: p.mp_name,
      mp_slug: p.mp_slug,
      mp_description: p.mp_description,
      mp_status: p.mp_status,
      mp_header_image: p.mp_header_image,
      mp_thumbnail: p.mp_thumbnail,
      created_at: p.created_at,
      updated_at: p.updated_at,
      images: p.MstProgramImages.map(img => ({
        id: img.mpi_id,
        image: img.mpi_image,
        description: img.mpi_description,
        status: img.mpi_status
      })),
      mp_category: p.MstProgramCategory
        ? { id: p.MstProgramCategory.mpc_id, name: p.MstProgramCategory.mpc_name }
        : null,
      mp_age: p.MstProgramAge
        ? { id: p.MstProgramAge.mpa_id, min: p.MstProgramAge.mpa_min, max: p.MstProgramAge.mpa_max }
        : null,
      mp_activity_category: p.MstProgramActivityCategory
        ? { id: p.MstProgramActivityCategory.mpac_id, name: p.MstProgramActivityCategory.mpac_name }
        : null,
      mp_type: p.MstProgramType
        ? { id: p.MstProgramType.mpt_id, name: p.MstProgramType.mpt_name }
        : null // ⬅️ Mapping Program Type
    }));

    res.json({
      success: true,
      data: formattedPrograms,
      meta: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit)
      },
      message: "Programs fetched successfully with pagination"
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      data: [],
      meta: {},
      message: err.message
    });
  }
};

export const getProgramsWithPaginationWithSearch = async (req, res) => {
  try {
    const page = parseInt(req.body.page) || 1;
    const limit = parseInt(req.body.limit) || 12;
    const offset = (page - 1) * limit;

    const { mp_category_id, mp_age_id, search } = req.body;

    // Build filter untuk include
    const whereCategory = mp_category_id ? { mpc_id: mp_category_id } : {};
    const whereAge = mp_age_id ? { mpa_id: mp_age_id } : {};

    // Filter utama untuk MstProgram
    let whereProgram = { mp_status: true };
    if (search) {
      whereProgram.mp_name = { [Op.like]: `%${search}%` }; // search partial
    }

    const { count, rows } = await MstProgram.findAndCountAll({
      where: whereProgram,
      limit,
      offset,
      order: [["created_at", "DESC"]],
      distinct: true,
      include: [
        { model: MstProgramImage, attributes: ["mpi_id", "mpi_image", "mpi_description", "mpi_status"] },
        { model: MstProgramCategory, attributes: ["mpc_id", "mpc_name"], where: whereCategory, required: mp_category_id ? true : false },
        { model: MstProgramAge, attributes: ["mpa_id", "mpa_min", "mpa_max"], where: whereAge, required: mp_age_id ? true : false },
        { model: MstProgramActivityCategory, attributes: ["mpac_id", "mpac_name"] },
        { model: MstProgramType, attributes: ["mpt_id", "mpt_name"] }
      ]
    });

    const formattedPrograms = rows.map(p => ({
      mp_id: p.mp_id,
      mp_name: p.mp_name,
      mp_slug: p.mp_slug,
      mp_description: p.mp_description,
      mp_status: p.mp_status,
      mp_header_image: p.mp_header_image,
      mp_thumbnail: p.mp_thumbnail,
      created_at: p.created_at,
      updated_at: p.updated_at,
      images: p.MstProgramImages.map(img => ({
        id: img.mpi_id,
        image: img.mpi_image,
        description: img.mpi_description,
        status: img.mpi_status
      })),
      mp_category: p.MstProgramCategory
        ? { id: p.MstProgramCategory.mpc_id, name: p.MstProgramCategory.mpc_name }
        : null,
      mp_age: p.MstProgramAge
        ? { id: p.MstProgramAge.mpa_id, min: p.MstProgramAge.mpa_min, max: p.MstProgramAge.mpa_max }
        : null,
      mp_activity_category: p.MstProgramActivityCategory
        ? { id: p.MstProgramActivityCategory.mpac_id, name: p.MstProgramActivityCategory.mpac_name }
        : null,
      mp_type: p.MstProgramType
        ? { id: p.MstProgramType.mpt_id, name: p.MstProgramType.mpt_name }
        : null
    }));

    res.json({
      success: true,
      data: formattedPrograms,
      meta: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit)
      },
      message: "Programs fetched successfully with pagination and search"
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      data: [],
      meta: {},
      message: err.message
    });
  }
};

export const getProgramsForSelect = async (req, res) => {
  try {
    const mstprograms = await MstProgram.findAll({
      where: { mp_status: true }   // hanya ambil yang aktif
    });
    res.json({
      success: true,
      data: mstprograms,
      message: "Programs fetched successfully"
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      data: [],
      message: err.message
    });
  }
};

export const getProgramsWithImages = async (req, res) => {
  try {
    const programs = await MstProgram.findAll({
      include: [
        {
          model: MstProgramImage,
          as: "MstProgramImages", // Optional alias jika dibutuhkan
          attributes: ["mpi_id", "mpi_image", "mpi_description", "mpi_status"]
        }
      ]
    });

    res.json({
      success: true,
      data: programs,
      message: "Programs with images fetched successfully"
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      data: [],
      message: err.message
    });
  }
};

export const getProgramsWithDetails = async (req, res) => {
  try {
    const programs = await MstProgram.findAll({
      include: [
        {
          model: MstProgramImage,
          attributes: ["mpi_id", "mpi_image", "mpi_description", "mpi_status"]
        },
        {
          model: MstProgramCategory,
          attributes: ["mpc_id", "mpc_name"]
        },
        {
          model: MstProgramAge,
          attributes: ["mpa_id", "mpa_min", "mpa_max"]
        },
        {
          model: MstProgramActivityCategory,
          attributes: ["mpac_id", "mpac_name"]
        }
      ]
    });

    // Merapikan response
    const formattedPrograms = programs.map(p => ({
      mp_id: p.mp_id,
      mp_name: p.mp_name,
      mp_description: p.mp_description,
      mp_status: p.mp_status,
      mp_header_image: p.mp_header_image,
      mp_thumbnail: p.mp_thumbnail,
      created_at: p.created_at,
      updated_at: p.updated_at,
      images: p.MstProgramImages.map(img => ({
        id: img.mpi_id,
        image: img.mpi_image,
        description: img.mpi_description,
        status: img.mpi_status
      })),
      mp_category: p.MstProgramCategory
        ? { id: p.MstProgramCategory.mpc_id, name: p.MstProgramCategory.mpc_name }
        : null,
      mp_age: p.MstProgramAge
        ? { id: p.MstProgramAge.mpa_id, min: p.MstProgramAge.mpa_min, max: p.MstProgramAge.mpa_max }
        : null,
      mp_activity_category: p.MstProgramActivityCategory
        ? { id: p.MstProgramActivityCategory.mpac_id, name: p.MstProgramActivityCategory.mpac_name }
        : null
    }));

    res.json({
      success: true,
      data: formattedPrograms,
      message: "Programs with full details fetched successfully"
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      data: [],
      message: err.message
    });
  }
};

export const getProgramDetailBySlug = async (req, res) => {
  try {
    const { mp_slug } = req.params;

    const program = await MstProgram.findOne({
      where: { mp_slug, mp_status: true },
      include: [
        { 
          model: MstProgramImage, 
          attributes: ["mpi_id", "mpi_image", "mpi_description", "mpi_status"] 
        },
        { 
          model: MstProgramCategory, 
          attributes: ["mpc_id", "mpc_name"] 
        },
        { 
          model: MstProgramAge, 
          attributes: ["mpa_id", "mpa_min", "mpa_max"] 
        },
        { 
          model: MstProgramActivityCategory, 
          attributes: ["mpac_id", "mpac_name"] 
        },
        { 
          model: MstProgramKeyPoint, 
          attributes: ["mpkp_id", "key_point", "sort_order", "status"],
          where: { status: true },
          required: false,
          order: [["sort_order", "ASC"]]
        }
      ]
    });

    if (!program) {
      return res.status(404).json({
        success: false,
        message: "Program not found",
        data: null
      });
    }

    // Format response
    const formattedProgram = {
      mp_id: program.mp_id,
      mp_name: program.mp_name,
      mp_slug: program.mp_slug,
      mp_description: program.mp_description,
      mp_status: program.mp_status,
      mp_header_image: program.mp_header_image,
      mp_thumbnail: program.mp_thumbnail,
      created_at: program.created_at,
      updated_at: program.updated_at,
      images: program.MstProgramImages.map(img => ({
        id: img.mpi_id,
        image: img.mpi_image,
        description: img.mpi_description,
        status: img.mpi_status
      })),
      mp_category: program.MstProgramCategory
        ? { id: program.MstProgramCategory.mpc_id, name: program.MstProgramCategory.mpc_name }
        : null,
      mp_age: program.MstProgramAge
        ? { id: program.MstProgramAge.mpa_id, min: program.MstProgramAge.mpa_min, max: program.MstProgramAge.mpa_max }
        : null,
      mp_activity_category: program.MstProgramActivityCategory
        ? { id: program.MstProgramActivityCategory.mpac_id, name: program.MstProgramActivityCategory.mpac_name }
        : null,
      key_points: program.MstProgramKeyPoints.map(kp => ({
        id: kp.mpkp_id,
        key_point: kp.key_point,
        sort_order: kp.sort_order,
        status: kp.status
      }))
    };

    res.json({
      success: true,
      data: formattedProgram,
      message: "Program detail fetched successfully"
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: err.message,
      data: null
    });
  }
};