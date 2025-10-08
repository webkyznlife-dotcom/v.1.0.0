import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database.js";
import { MstBranch } from "../mst_branch/mst_branch.js";
import { MstProgram } from "../mst_programs/mst_programs.js";

export const MstBranchProgram = sequelize.define("MstBranchProgram", {
  mbp_id: { 
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
  mp_id: { 
    type: DataTypes.INTEGER, 
    allowNull: false,
    references: {
      model: MstProgram,
      key: "mp_id"
    },
    onDelete: "CASCADE"
  },
  mbp_status: { 
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
  tableName: "mst_branch_programs",
  timestamps: false 
});

// Relasi
MstBranch.hasMany(MstBranchProgram, { foreignKey: "mb_id" });
MstBranchProgram.belongsTo(MstBranch, { foreignKey: "mb_id" });

MstProgram.hasMany(MstBranchProgram, { foreignKey: "mp_id" });
MstBranchProgram.belongsTo(MstProgram, { foreignKey: "mp_id" });
