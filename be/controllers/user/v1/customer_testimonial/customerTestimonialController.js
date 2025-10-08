import { MstCustomerTestimonial } from "../../../../models/mst_customer_testimonial/mst_customer_testimonial.js";

export const getCustomerTestimonials = async (req, res) => {
  try {
    const customertestimonials = await MstCustomerTestimonial.findAll({
      where: { mct_status: true }
    });
    res.json({
      success: true,
      data: customertestimonials,
      message: "Customer testimonials fetched successfully"
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      data: [],
      message: err.message
    });
  }
};
