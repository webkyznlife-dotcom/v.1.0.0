import { MstBranch } from "../../../../models/mst_branch/mst_branch.js";
import { MstBranchFacility } from "../../../../models/mst_branch_facilities/mst_branch_facilities.js";
import { MstFacility } from "../../../../models/mst_facilities/mst_facilities.js";
import { MstBranchProgram } from "../../../../models/mst_branch_programs/mst_branch_programs.js";
import { MstProgram } from "../../../../models/mst_programs/mst_programs.js";
import { MstBranchCourt } from "../../../../models/mst_branch_courts/mst_branch_courts.js";
import { MstCourt } from "../../../../models/mst_courts/mst_courts.js";
import { MstBranchMap } from "../../../../models/mst_branch_map/mst_branch_map.js";
import { MstBranchImage } from "../../../../models/mst_branch_image/mst_branch_image.js";

export const getBranchs = async (req, res) => {
  try {
    const branch = await MstBranch.findAll();
    res.json({
      success: true,
      data: branch,
      message: "Branches fetched successfully"
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      data: [],
      message: err.message
    });
  }
};

export const getBranchsDetail = async (req, res) => {
  try {
    const branches = await MstBranch.findAll({
      include: [
        {
          model: MstBranchFacility,
          include: [MstFacility],
          separate: true // <-- ini kuncinya
        },
        {
          model: MstBranchProgram,
          include: [MstProgram],
          separate: true
        },
        {
          model: MstBranchCourt,
          include: [MstCourt],
          separate: true
        },
        {
          model: MstBranchMap,
          separate: true
        }
      ]
    });

    const result = branches.map(branch => {
      const branchJson = branch.toJSON();

      return {
        mb_id: branchJson.mb_id,
        mb_name: branchJson.mb_name,
        mb_address: branchJson.mb_address,
        mb_city: branchJson.mb_city,
        mb_province: branchJson.mb_province,
        mb_postal_code: branchJson.mb_postal_code,
        mb_phone: branchJson.mb_phone,
        mb_status: branchJson.mb_status,
        created_at: branchJson.created_at,
        updated_at: branchJson.updated_at,

        Facilities: branchJson.MstBranchFacilities?.map(f => f.MstFacility) || [],
        Programs: branchJson.MstBranchPrograms?.map(p => p.MstProgram) || [],
        Courts: branchJson.MstBranchCourts?.map(c => c.MstCourt) || [],
        Map: branchJson.MstBranchMaps || []
      };
    });

    res.json({
      success: true,
      data: result,
      message: "Branches details fetched successfully"
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      data: [],
      message: err.message
    });
  }
};

export const getBranchFormatted = async (req, res) => {
  try {
    const branches = await MstBranch.findAll({
      where: { mb_status: true }, // hanya ambil branch aktif
      include: [
        { model: MstBranchImage, separate: true },
        { model: MstBranchFacility, include: [MstFacility], separate: true },
        { model: MstBranchProgram, include: [MstProgram], separate: true },
        { model: MstBranchCourt, include: [MstCourt], separate: true },
        { model: MstBranchMap, separate: true },
      ],
    });

    const formatted = branches.map(branch => {
      const b = branch.toJSON();

      return {
        name: b.mb_name,
        description: `Address: ${b.mb_address}, ${b.mb_city}, ${b.mb_province}, ${b.mb_postal_code}. Phone: ${b.mb_phone}`,
        images: b.MstBranchImages?.map((img, index) => ({
          src: img.mbi_image,
          alt: `${b.mb_name} ${index === 0 ? "Front View" : img.mbi_description || "Image"}`,
        })) || [],
        facilities: b.MstBranchFacilities?.map(f => ({
          name: f.MstFacility.mf_name,
          img: f.mbf_icon || f.MstFacility.mf_icon || "",
        })) || [],
        mapEmbed: b.MstBranchMaps?.[0]?.mbm_url || "",
        programs: b.MstBranchPrograms?.map(p => p.MstProgram.mp_name) || [],
        courts: b.MstBranchCourts?.map(c => c.MstCourt.mc_name) || [],
      };
    });

    res.json({
      success: true,
      data: formatted,
      message: "Branches formatted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      data: [],
      message: err.message,
    });
  }
};
