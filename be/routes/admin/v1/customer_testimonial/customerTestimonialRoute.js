import express from "express";
import { 
  getCustomerTestimonials,
  createCustomerTestimonial,
  updateCustomerTestimonial,
  deleteCustomerTestimonial,
  deleteMultipleCustomerTestimonials
} from "../../../../controllers/admin/v1/customer_testimonial/customerTestimonialController.js";
import { upload } from "../../../../middleware/uploadMiddleware.js";

const router = express.Router();

// GET all customer testimonials
router.get("/", getCustomerTestimonials);

// CREATE customer testimonial
router.post(
  "/create",
  upload.single("mct_avatar"), // field untuk upload avatar customer
  createCustomerTestimonial
);

// UPDATE customer testimonial
router.put(
  "/update/:mct_id",
  upload.single("mct_avatar"), // field untuk update avatar customer
  updateCustomerTestimonial
);

// DELETE single customer testimonial (soft delete)
router.delete("/delete/:mct_id", deleteCustomerTestimonial);

// DELETE multiple customer testimonials (soft delete)
router.post("/delete-multiple", deleteMultipleCustomerTestimonials);

export default router;