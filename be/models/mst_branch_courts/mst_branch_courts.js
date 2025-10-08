import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database.js";
import { MstBranch } from "../mst_branch/mst_branch.js";
import { MstCourt } from "../mst_courts/mst_courts.js";

export const MstBranchCourt = sequelize.define("MstBranchCourt", {
  mbc_id: { 
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
  mc_id: { 
    type: DataTypes.INTEGER, 
    allowNull: false,
    references: {
      model: MstCourt,
      key: "mc_id"
    },
    onDelete: "CASCADE"
  },
  mbc_status: { 
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
  tableName: "mst_branch_courts",
  timestamps: false 
});

// Relasi
MstBranch.hasMany(MstBranchCourt, { foreignKey: "mb_id" });
MstBranchCourt.belongsTo(MstBranch, { foreignKey: "mb_id" });

MstCourt.hasMany(MstBranchCourt, { foreignKey: "mc_id" });
MstBranchCourt.belongsTo(MstCourt, { foreignKey: "mc_id" });
