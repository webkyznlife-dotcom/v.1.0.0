import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database.js";

export const MstBranch = sequelize.define("MstBranch", {
  mb_id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  mb_name: { 
    type: DataTypes.STRING(255), 
    allowNull: false 
  },
  mb_address: { 
    type: DataTypes.TEXT, 
    allowNull: true 
  },
  mb_city: { 
    type: DataTypes.STRING(100), 
    allowNull: true 
  },
  mb_province: { 
    type: DataTypes.STRING(100), 
    allowNull: true 
  },
  mb_postal_code: { 
    type: DataTypes.STRING(20), 
    allowNull: true 
  },
  mb_phone: { 
    type: DataTypes.STRING(50), 
    allowNull: true 
  },
  mb_status: { 
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
  tableName: "mst_branch",
  timestamps: false 
});
