import { MstEvent } from "../../../../models/mst_event/mst_event.js";
import { MstBranch } from "../../../../models/mst_branch/mst_branch.js";
import { Op } from "sequelize";

export const getEvents = async (req, res) => {
  try {
    const events = await MstEvent.findAll({
      limit: 4, // <-- membatasi 4 data
      order: [["me_created_at", "DESC"]], // opsional: data terbaru di atas
      include: [
        {
          model: MstBranch,
          attributes: ["mb_id", "mb_name", "mb_address", "mb_city", "mb_province", "mb_postal_code", "mb_phone", "mb_status"]
        }
      ]
    });

    const result = events.map(event => {
      const ev = event.toJSON();
      return {
        me_id: ev.me_id,
        me_name: ev.me_name,
        me_slug: ev.me_slug,
        me_description: ev.me_description,
        me_youtube_url: ev.me_youtube_url,
        me_image_url: ev.me_image_url,
        me_created_at: ev.me_created_at,
        me_updated_at: ev.me_updated_at,
        Branch: ev.MstBranch
      };
    });

    res.json({
      success: true,
      data: result,
      message: "Events fetched successfully"
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      data: [],
      message: err.message
    });
  }
};


export const getEventsWithPagination = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // default page 1
    const limit = parseInt(req.query.limit) || 4; // default limit 4
    const offset = (page - 1) * limit;

    const { count, rows } = await MstEvent.findAndCountAll({
      limit,
      offset,
      order: [["me_created_at", "DESC"]],
      include: [
        {
          model: MstBranch,
          attributes: ["mb_id", "mb_name", "mb_address", "mb_city", "mb_province", "mb_postal_code", "mb_phone", "mb_status"]
        }
      ]
    });

    const result = rows.map(event => {
      const ev = event.toJSON();
      return {
        me_id: ev.me_id,
        me_name: ev.me_name,
        me_slug: ev.me_slug,
        me_description: ev.me_description,
        me_youtube_url: ev.me_youtube_url,
        me_image_url: ev.me_image_url,
        me_created_at: ev.me_created_at,
        me_updated_at: ev.me_updated_at,
        Branch: ev.MstBranch
      };
    });

    res.json({
      success: true,
      data: result,
      meta: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit)
      },
      message: "Events fetched successfully with pagination"
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


export const getEventDetailBySlug = async (req, res) => {
  try {
    const { slug } = req.body;

    // Cek apakah slug ada
    if (!slug || slug.trim() === "") {
      return res.status(400).json({
        success: false,
        data: null,
        message: "Slug is required",
      });
    }

    const event = await MstEvent.findOne({
      where: { me_slug: slug },
      include: [
        {
          model: MstBranch,
          attributes: [
            "mb_id",
            "mb_name",
            "mb_address",
            "mb_city",
            "mb_province",
            "mb_postal_code",
            "mb_phone",
            "mb_status",
          ],
        },
      ],
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        data: null,
        message: "Event not found",
      });
    }

    const ev = event.toJSON();

    res.json({
      success: true,
      data: {
        me_id: ev.me_id,
        me_name: ev.me_name,
        me_slug: ev.me_slug,
        me_description: ev.me_description,
        me_youtube_url: ev.me_youtube_url,
        me_image_url: ev.me_image_url,
        me_created_at: ev.me_created_at,
        me_updated_at: ev.me_updated_at,
        Branch: ev.MstBranch,
      },
      message: "Event detail fetched successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      data: null,
      message: err.message,
    });
  }
};


export const getOtherEvents = async (req, res) => {
  try {
    const { slug } = req.body;

    if (!slug || slug.trim() === "") {
      return res.status(400).json({
        success: false,
        data: [],
        message: "Slug is required",
      });
    }

    // Ambil semua event selain slug yang dikirim
    const events = await MstEvent.findAll({
      where: {
        me_slug: { [Op.ne]: slug }, // Sequelize operator "not equal"
      },
      order: [["me_created_at", "DESC"]],
      limit: 5, // misal ambil 5 event lainnya
      include: [
        {
          model: MstBranch,
          attributes: [
            "mb_id",
            "mb_name",
            "mb_address",
            "mb_city",
            "mb_province",
            "mb_postal_code",
            "mb_phone",
            "mb_status",
          ],
        },
      ],
    });

    const result = events.map((event) => {
      const ev = event.toJSON();
      return {
        me_id: ev.me_id,
        me_name: ev.me_name,
        me_slug: ev.me_slug,
        me_description: ev.me_description,
        me_youtube_url: ev.me_youtube_url,
        me_image_url: ev.me_image_url,
        me_created_at: ev.me_created_at,
        me_updated_at: ev.me_updated_at,
        Branch: ev.MstBranch,
      };
    });

    res.json({
      success: true,
      data: result,
      message: "Other events fetched successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      data: [],
      message: err.message,
    });
  }
};