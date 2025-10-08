import Joi from "joi";

const programCategorySchema = Joi.object({
  mpc_status: Joi.boolean().optional(), // opsional, bisa filter aktif/inaktif
  mpc_name: Joi.string().max(50).optional() // opsional, filter berdasarkan nama
});

export const validateProgramCategories = (req, res, next) => {
  const { error } = programCategorySchema.validate(req.query); // pakai query untuk GET
  if (error) {
    return res.status(400).json({
      success: false,
      data: [],
      message: error.details.map((d) => d.message).join(", "),
    });
  }
  next();
};
