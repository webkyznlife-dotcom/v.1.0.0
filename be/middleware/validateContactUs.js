import Joi from "joi";

const contactSchema = Joi.object({
  tc_pic_name: Joi.string().max(255).required(),
  tc_institution: Joi.string().max(255).optional(),
  tc_whatsapp: Joi.string().max(50).optional(),
  tc_email: Joi.string().email().optional(),
  tc_message: Joi.string().optional(),
  mb_id: Joi.number().integer().optional(),
  subject_id: Joi.number().integer().optional(),
  tc_status: Joi.string().valid("NEW", "IN_PROGRESS", "DONE").optional(),
  tc_is_membership: Joi.boolean().optional()
});

export const validateContact = (req, res, next) => {
  const { error } = contactSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      data: [],
      message: error.details.map((d) => d.message).join(", "),
    });
  }
  next();
};
