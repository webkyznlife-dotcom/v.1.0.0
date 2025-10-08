import { TrxContact } from "../../../../models/trx_contact/trx_contact.js";
import { MstBranch } from "../../../../models/mst_branch/mst_branch.js";
import { MstSubject } from "../../../../models/mst_subject/mst_subject.js";

import { Op } from "sequelize";

/**
 * Helper untuk handle error Sequelize
 */
export const handleSequelizeError = (err, res) => {
  if (
    err.name === "SequelizeValidationError" ||
    err.name === "SequelizeUniqueConstraintError"
  ) {
    const messages = err.errors.map((e) => e.message);
    return res.status(400).json({
      success: false,
      data: [],
      message: messages.join(", "),
    });
  }
  return res.status(500).json({
    success: false,
    data: [],
    message: err.message,
  });
};


// Create new contact
export const createContact = async (req, res) => {
  try {
    const {
      tc_pic_name,
      tc_institution,
      tc_whatsapp,
      tc_email,
      tc_message,
      mb_id = null,
      subject_id = null,
      tc_is_membership = false,
      tc_status = "NEW",
    } = req.body;

    // Minimal validation
    if (!tc_pic_name) {
      return res.status(400).json({
        success: false,
        data: [],
        message: "tc_pic_name is required",
      });
    }

    // Validate branch
    if (mb_id) {
      const branch = await MstBranch.findByPk(mb_id);
      if (!branch) {
        return res.status(400).json({
          success: false,
          data: [],
          message: `mb_id ${mb_id} not found`,
        });
      }
    }

    // Validate subject
    if (subject_id) {
      const subject = await MstSubject.findByPk(subject_id);
      if (!subject) {
        return res.status(400).json({
          success: false,
          data: [],
          message: `subject_id ${subject_id} not found`,
        });
      }
    }

    // Create new contact
    const newContact = await TrxContact.create({
      tc_pic_name,
      tc_institution,
      tc_whatsapp,
      tc_email,
      tc_message,
      mb_id,
      subject_id,
      tc_status,
      tc_is_membership,
    });

    // Fetch with relations
    const contactFull = await TrxContact.findByPk(newContact.tc_id, {
      include: [
        { model: MstBranch, attributes: ["mb_id", "mb_name"], required: false },
        { model: MstSubject, attributes: ["subject_id", "subject_name"], required: false },
      ],
    });

    return res.json({
      success: true,
      data: contactFull,
      message: "Contact created successfully",
    });
  } catch (err) {
    return handleSequelizeError(err, res);
  }
};
