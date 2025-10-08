import { Op } from "sequelize";
import { MstEvent } from "../../../../models/mst_event/mst_event.js";
import { MstBranch } from "../../../../models/mst_branch/mst_branch.js";
import slugify from "slugify"; // pastikan sudah install: npm install slugify

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

// ===== GET ALL EVENTS =====
export const getEvents = async (req, res) => {
  try {
    const events = await MstEvent.findAll({
      include: [{ model: MstBranch }],
      order: [["me_id", "ASC"]]
    });

    res.json({
      success: true,
      data: events,
      message: "Events fetched successfully"
    });
  } catch (err) {
    handleSequelizeError(err, res);
  }
};

// ===== CREATE EVENT =====
export const createEvent = async (req, res) => {
  try {
    const { me_name, me_description, me_youtube_url, mb_id, me_status } = req.body;

    if (!me_name) return res.status(400).json({ success: false, data: [], message: "me_name is required" });
    if (!mb_id) return res.status(400).json({ success: false, data: [], message: "mb_id is required" });

    // Simpan path file image jika ada
    const me_image_url = req.file?.filename || null;

    // buat tanggal untuk slug
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const uniqueId = Date.now(); // bisa dipakai sebagai "id unik" di slug
    const slugTitle = slugify(me_name, { lower: true, strict: true }); // replace spasi dan simbol
    const me_slug = `read/${year}/${month}/${day}/${uniqueId}/${slugTitle}`;    

    const newEvent = await MstEvent.create({
      me_name: me_name.trim(),
      me_description: me_description || null,
      me_youtube_url: me_youtube_url || null,
      me_image_url,
      mb_id,
      me_status: me_status,
      me_slug, // <-- tambahkan slug
      me_created_at: new Date(),
      me_updated_at: new Date()
    });

    return res.status(201).json({
      success: true,
      data: newEvent,
      message: "Event created successfully"
    });

  } catch (err) {
    console.error(err);
    return handleSequelizeError(err, res);
  }
};

// ===== UPDATE EVENT =====
export const updateEvent = async (req, res) => {
  try {
    const { me_id } = req.params;
    const { me_name, me_description, me_youtube_url, mb_id, me_status } = req.body;

    if (!me_id) return res.status(400).json({ success: false, data: [], message: "me_id is required" });
    if (!me_name) return res.status(400).json({ success: false, data: [], message: "me_name is required" });
    if (!mb_id) return res.status(400).json({ success: false, data: [], message: "mb_id is required" });

    const event = await MstEvent.findByPk(me_id);
    if (!event) return res.status(404).json({ success: false, data: [], message: "Event not found" });

    // Handle image: pakai yang baru jika diupload, kalau tidak pakai image lama
    const me_image_url = req.file?.filename || event.me_image_url;

    // update slug hanya jika me_name berubah
    const now = new Date(event.me_created_at);
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const uniqueId = event.me_id;
    const slugTitle = slugify(me_name || event.me_name, { lower: true, strict: true });
    const me_slug = `read/${year}/${month}/${day}/${uniqueId}/${slugTitle}`;

    await event.update({
      me_name: me_name.trim(),
      me_description: me_description || null,
      me_youtube_url: me_youtube_url || null,
      me_image_url,
      mb_id,
      me_status,
      me_slug, // <-- update slug
      me_updated_at: new Date()
    });

    return res.status(200).json({
      success: true,
      data: event,
      message: "Event updated successfully"
    });

  } catch (err) {
    console.error(err);
    return handleSequelizeError(err, res);
  }
};

// ===== SOFT DELETE SINGLE EVENT =====
export const deleteEvent = async (req, res) => {
  try {
    const { me_id } = req.params;
    if (!me_id) return res.status(400).json({ success: false, data: [], message: "me_id is required" });

    const event = await MstEvent.findByPk(me_id);
    if (!event) return res.status(404).json({ success: false, data: [], message: "Event not found" });

    if (!event.me_status) return res.status(400).json({ success: false, data: { me_id }, message: "Event already inactive" });

    await event.update({ me_status: false, me_updated_at: new Date() });

    res.status(200).json({ success: true, data: { me_id }, message: "Event deactivated (soft deleted)" });

  } catch (err) {
    handleSequelizeError(err, res);
  }
};

// ===== SOFT DELETE MULTIPLE EVENTS =====
export const deleteMultipleEvents = async (req, res) => {
  try {
    const { me_ids } = req.body; // ekspektasi: [1,2,3]
    if (!me_ids || !Array.isArray(me_ids) || me_ids.length === 0) {
      return res.status(400).json({ success: false, data: [], message: "me_ids must be a non-empty array" });
    }

    const events = await MstEvent.findAll({ where: { me_id: me_ids } });
    if (events.length === 0) return res.status(404).json({ success: false, data: [], message: "No events found for provided IDs" });

    const results = [];
    for (const event of events) {
      if (!event.me_status) results.push({ me_id: event.me_id, status: "already inactive" });
      else {
        await event.update({ me_status: false, me_updated_at: new Date() });
        results.push({ me_id: event.me_id, status: "deactivated" });
      }
    }

    res.status(200).json({ success: true, data: results, message: "Events processed successfully" });

  } catch (err) {
    handleSequelizeError(err, res);
  }
};
