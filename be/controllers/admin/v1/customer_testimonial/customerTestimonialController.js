import { Op } from "sequelize";
import { MstCustomerTestimonial } from "../../../../models/mst_customer_testimonial/mst_customer_testimonial.js";

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

// ===== GET ALL TESTIMONIALS =====
export const getCustomerTestimonials = async (req, res) => {
  try {
    const testimonials = await MstCustomerTestimonial.findAll({
      order: [["mct_id", "ASC"]]
    });

    res.json({
      success: true,
      data: testimonials,
      message: "Customer testimonials fetched successfully"
    });
  } catch (err) {
    handleSequelizeError(err, res);
  }
};

// ===== CREATE TESTIMONIAL =====
export const createCustomerTestimonial = async (req, res) => {
  try {
    const { mct_name, mct_testimonial, mct_social_url, mct_social_type, mct_status } = req.body;

    if (!mct_name) return res.status(400).json({ success: false, data: [], message: "mct_name is required" });
    if (!mct_testimonial) return res.status(400).json({ success: false, data: [], message: "mct_testimonial is required" });

    const mct_avatar = req.file?.filename || null;

    const newTestimonial = await MstCustomerTestimonial.create({
      mct_name: mct_name.trim(),
      mct_testimonial: mct_testimonial.trim(),
      mct_avatar,
      mct_social_url: mct_social_url || null,
      mct_social_type: mct_social_type || null,
      mct_status: mct_status !== undefined ? mct_status : true,
      created_at: new Date(),
      updated_at: new Date()
    });

    return res.status(201).json({
      success: true,
      data: newTestimonial,
      message: "Customer testimonial created successfully"
    });

  } catch (err) {
    console.error(err);
    return handleSequelizeError(err, res);
  }
};

// ===== UPDATE TESTIMONIAL =====
export const updateCustomerTestimonial = async (req, res) => {
  try {
    const { mct_id } = req.params;
    const { mct_name, mct_testimonial, mct_social_url, mct_social_type, mct_status } = req.body;

    if (!mct_id) return res.status(400).json({ success: false, data: [], message: "mct_id is required" });
    if (!mct_name) return res.status(400).json({ success: false, data: [], message: "mct_name is required" });
    if (!mct_testimonial) return res.status(400).json({ success: false, data: [], message: "mct_testimonial is required" });

    const testimonial = await MstCustomerTestimonial.findByPk(mct_id);
    if (!testimonial) return res.status(404).json({ success: false, data: [], message: "Customer testimonial not found" });

    const mct_avatar = req.file?.filename || testimonial.mct_avatar;

    await testimonial.update({
      mct_name: mct_name.trim(),
      mct_testimonial: mct_testimonial.trim(),
      mct_avatar,
      mct_social_url: mct_social_url || testimonial.mct_social_url,
      mct_social_type: mct_social_type || testimonial.mct_social_type,
      mct_status: mct_status !== undefined ? mct_status : testimonial.mct_status,
      updated_at: new Date()
    });

    return res.status(200).json({
      success: true,
      data: testimonial,
      message: "Customer testimonial updated successfully"
    });

  } catch (err) {
    console.error(err);
    return handleSequelizeError(err, res);
  }
};

// ===== SOFT DELETE SINGLE TESTIMONIAL =====
export const deleteCustomerTestimonial = async (req, res) => {
  try {
    const { mct_id } = req.params;
    if (!mct_id) return res.status(400).json({ success: false, data: [], message: "mct_id is required" });

    const testimonial = await MstCustomerTestimonial.findByPk(mct_id);
    if (!testimonial) return res.status(404).json({ success: false, data: [], message: "Customer testimonial not found" });

    if (!testimonial.mct_status) return res.status(400).json({ success: false, data: { mct_id }, message: "Customer testimonial already inactive" });

    await testimonial.update({ mct_status: false, updated_at: new Date() });

    res.status(200).json({ success: true, data: { mct_id }, message: "Customer testimonial deactivated (soft deleted)" });

  } catch (err) {
    handleSequelizeError(err, res);
  }
};

// ===== SOFT DELETE MULTIPLE TESTIMONIALS =====
export const deleteMultipleCustomerTestimonials = async (req, res) => {
  try {
    const { mct_ids } = req.body; // ekspektasi: [1,2,3]
    if (!mct_ids || !Array.isArray(mct_ids) || mct_ids.length === 0) {
      return res.status(400).json({ success: false, data: [], message: "mct_ids must be a non-empty array" });
    }

    const testimonials = await MstCustomerTestimonial.findAll({ where: { mct_id: mct_ids } });
    if (testimonials.length === 0) return res.status(404).json({ success: false, data: [], message: "No testimonials found for provided IDs" });

    const results = [];
    for (const testimonial of testimonials) {
      if (!testimonial.mct_status) results.push({ mct_id: testimonial.mct_id, status: "already inactive" });
      else {
        await testimonial.update({ mct_status: false, updated_at: new Date() });
        results.push({ mct_id: testimonial.mct_id, status: "deactivated" });
      }
    }

    res.status(200).json({ success: true, data: results, message: "Customer testimonials processed successfully" });

  } catch (err) {
    handleSequelizeError(err, res);
  }
};