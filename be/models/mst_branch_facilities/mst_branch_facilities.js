import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database.js";
import { MstBranch } from "../mst_branch/mst_branch.js";
import { MstFacility } from "../mst_facilities/mst_facilities.js";

export const MstBranchFacility = sequelize.define("MstBranchFacility", {
  mbf_id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  mb_id: { 
    type: DataTypes.INTEGER, 
    allowNull: false,
    references: {
      model: MstBranch,
      key: "mb_id"
    },
    onDelete: "CASCADE"
  },
  mf_id: { 
    type: DataTypes.INTEGER, 
    allowNull: false,
    references: {
      model: MstFacility,
      key: "mf_id"
    },
    onDelete: "CASCADE"
  },
  mbf_icon: { 
    type: DataTypes.STRING(500), 
    allowNull: true 
  },
  mbf_status: { 
    type: DataTypes.BOOLEAN, 
    defaultValue: true 
  },
  created_at: { 
    type: DataTypes.DATE, 
    defaultValue: DataTypes.NOW 
  },
  updated_at: { 
    type: DataTypes.DATE, 
    defaultValue: DataTypes.NOW 
  }
}, { 
  tableName: "mst_branch_facilities",
  timestamps: false 
});

// Relasi
MstBranch.hasMany(MstBranchFacility, { foreignKey: "mb_id" });
MstBranchFacility.belongsTo(MstBranch, { foreignKey: "mb_id" });

MstFacility.hasMany(MstBranchFacility, { foreignKey: "mf_id" });
MstBranchFacility.belongsTo(MstFacility, { foreignKey: "mf_id" });
