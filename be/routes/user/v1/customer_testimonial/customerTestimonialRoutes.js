import express from "express";
import { getCustomerTestimonials } from "../../../../controllers/user/v1/customer_testimonial/customerTestimonialController.js";

const router = express.Router();

router.get("/", getCustomerTestimonials);

export default router;
