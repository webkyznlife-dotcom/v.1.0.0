import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database.js";
import { MstBranch } from "../mst_branch/mst_branch.js";

export const MstBranchMap = sequelize.define("MstBranchMap", {
  mbm_id: { 
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
  mbm_title: { 
    type: DataTypes.STRING(255), 
    allowNull: false 
  },
  mbm_url: { 
    type: DataTypes.STRING(500), 
    allowNull: false 
  },
  mbm_status: { 
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
  tableName: "mst_branch_map",
  timestamps: false 
});

// Relasi
MstBranch.hasMany(MstBranchMap, { foreignKey: "mb_id" });
MstBranchMap.belongsTo(MstBranch, { foreignKey: "mb_id" });
