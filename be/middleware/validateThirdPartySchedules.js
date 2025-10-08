import Joi from "joi";

const thirdPartyScheduleSchema = Joi.object({
  dateStart: Joi.date().iso().required().messages({
    "any.required": "dateStart wajib diisi",
    "date.format": "dateStart harus format YYYY-MM-DD",
  }),
  dateEnd: Joi.date().iso().required().messages({
    "any.required": "dateEnd wajib diisi",
    "date.format": "dateEnd harus format YYYY-MM-DD",
  }),
  programId: Joi.number().integer().optional().messages({
    "number.base": "programId harus berupa angka",
    "number.integer": "programId harus bilangan bulat",
  }),
  branch: Joi.string().max(255).optional().messages({
    "string.base": "branch harus berupa string",
    "string.max": "branch maksimal 255 karakter",
  }),
  min_age: Joi.number().integer().min(0).optional().messages({
    "number.base": "min_age harus berupa angka",
    "number.integer": "min_age harus bilangan bulat",
    "number.min": "min_age minimal 0",
  }),
  max_age: Joi.number().integer().greater(Joi.ref("min_age")).optional().messages({
    "number.base": "max_age harus berupa angka",
    "number.integer": "max_age harus bilangan bulat",
    "number.greater": "max_age harus lebih besar dari min_age",
  }),
  venueId: Joi.number().integer().default(2).messages({
    "number.base": "venueId harus berupa angka",
    "number.integer": "venueId harus bilangan bulat",
  }),
  activityId: Joi.alternatives()
    .try(Joi.number().integer(), Joi.string().allow(""))
    .optional(),
  courtId: Joi.alternatives()
    .try(Joi.number().integer(), Joi.string().allow(""))
    .optional(),
  workerId: Joi.alternatives()
    .try(Joi.number().integer(), Joi.string().allow(""))
    .optional(),
  workerTypeId: Joi.alternatives()
    .try(Joi.number().integer(), Joi.string().allow(""))
    .optional(),
  limit: Joi.number().integer().default(10000000).messages({
    "number.base": "limit harus berupa angka",
    "number.integer": "limit harus bilangan bulat",
  }),
});

export const validateThirdPartySchedules = (req, res, next) => {
  const { error, value } = thirdPartyScheduleSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    return res.status(400).json({
      success: false,
      data: [],
      message: error.details.map((d) => d.message).join(", "),
    });
  }

  req.body = value; // overwrite body dengan hasil validasi
  next();
};
