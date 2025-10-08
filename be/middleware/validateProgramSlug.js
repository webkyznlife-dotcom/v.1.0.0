import Joi from "joi";

// Schema validasi param mp_slug
const programSlugSchema = Joi.object({
  mp_slug: Joi.string().max(255).required()
});

export const validateProgramSlug = (req, res, next) => {
  const { error } = programSlugSchema.validate(req.params); // ambil dari params
  if (error) {
    return res.status(400).json({
      success: false,
      data: null,
      message: error.details.map(d => d.message).join(", ")
    });
  }
  next();
};
