import { TrxContact } from "../../../../models/trx_contact/trx_contact.js";
import { MstBranch } from "../../../../models/mst_branch/mst_branch.js";
import { MstSubject } from "../../../../models/mst_subject/mst_subject.js";

import { Op } from "sequelize";

// Get all contacts
export const getContacts = async (req, res) => {
  try {
    const { status, mb_id } = req.query; // optional filter
    const where = {};

    if (status) where.tc_status = status;
    if (mb_id) where.mb_id = mb_id;

    const contacts = await TrxContact.findAll({
      where,
      include: [
        {
          model: MstBranch,
          attributes: ["mb_id", "mb_name"], // pilih field yang mau ditampilkan
          required: false, // biar tetap muncul meski ga ada branch
        },
        {
          model: MstSubject,
          attributes: ["subject_id", "subject_name"], // subject info
          required: false,
        },        
      ],
      order: [["tc_id", "DESC"]],
    });

    res.json({
      success: true,
      data: contacts,
      message: "Contacts fetched successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      data: [],
      message: err.message,
    });
  }
};

// Update single contact status
export const updateContactStatus = async (req, res) => {
  try {
    const { tc_id } = req.params; // ambil id dari URL
    const { tc_status } = req.body; // ambil status baru dari body

    if (!tc_id) {
      return res.status(400).json({
        success: false,
        data: [],
        message: "tc_id is required",
      });
    }

    if (!tc_status) {
      return res.status(400).json({
        success: false,
        data: [],
        message: "tc_status is required",
      });
    }

    const contact = await TrxContact.findByPk(tc_id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        data: [],
        message: `Contact with id ${tc_id} not found`,
      });
    }

    await contact.update({
      tc_status,
      updated_at: new Date(),
    });

    res.json({
      success: true,
      data: contact,
      message: "Contact status updated successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      data: [],
      message: err.message,
    });
  }
};

// Update multiple contacts status
export const updateMultipleContacts = async (req, res) => {
  try {
    const { tc_ids, tc_status } = req.body; // ekspektasi: { tc_ids: [1,2,3], tc_status: "DONE" }

    if (!tc_ids || !Array.isArray(tc_ids) || tc_ids.length === 0) {
      return res.status(400).json({
        success: false,
        data: [],
        message: "tc_ids must be a non-empty array"
      });
    }

    if (!tc_status || tc_status.trim() === "") {
      return res.status(400).json({
        success: false,
        data: [],
        message: "tc_status is required"
      });
    }

    const contacts = await TrxContact.findAll({
      where: { tc_id: tc_ids }
    });

    if (contacts.length === 0) {
      return res.status(404).json({
        success: false,
        data: [],
        message: "No contacts found for the provided IDs"
      });
    }

    const results = [];
    for (const contact of contacts) {
      await contact.update({
        tc_status,
        updated_at: new Date()
      });
      results.push({ tc_id: contact.tc_id, status: `updated to ${tc_status}` });
    }

    res.status(200).json({
      success: true,
      data: results,
      message: "Contacts updated successfully"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      data: [],
      message: err.message
    });
  }
};

