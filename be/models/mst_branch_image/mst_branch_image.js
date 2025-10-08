import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database.js";
import { MstBranch } from "../mst_branch/mst_branch.js";

export const MstBranchImage = sequelize.define("MstBranchImage", {
  mbi_id: { 
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
  mbi_image: { 
    type: DataTypes.STRING(500), 
    allowNull: false 
  },
  mbi_description: { 
    type: DataTypes.TEXT, 
    allowNull: true 
  },
  mbi_status: { 
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
  tableName: "mst_branch_image",
  timestamps: false 
});

// Relasi
MstBranch.hasMany(MstBranchImage, { foreignKey: "mb_id" });
MstBranchImage.belongsTo(MstBranch, { foreignKey: "mb_id" });
