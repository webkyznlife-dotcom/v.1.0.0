import Joi from "joi";

const trialClassSchema = Joi.object({
  ttc_name: Joi.string().max(255).required(),
  ttc_dob: Joi.date().required(),
  ttc_email: Joi.string().email().optional(),
  ttc_whatsapp: Joi.string().max(50).optional(),
  mb_id: Joi.number().integer().optional(),
  mpa_id: Joi.number().integer().optional(),
  mp_id: Joi.number().integer().optional(),
  ttc_day: Joi.string().max(50).required(),
  ttc_time: Joi.string().pattern(/^\d{2}:\d{2}$/).required(),
  ttc_terms_accepted: Joi.boolean().optional(),
  ttc_marketing_opt_in: Joi.boolean().optional(),
  ttc_status: Joi.string().valid("PENDING", "CONFIRMED", "CANCELLED").optional()
});

export const validateTrialClass = (req, res, next) => {
  const { error } = trialClassSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      data: [],
      message: error.details.map(d => d.message).join(", ")
    });
  }
  next();
};
