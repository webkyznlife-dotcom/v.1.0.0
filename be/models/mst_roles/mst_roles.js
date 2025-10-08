import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database.js";

export const MstRole = sequelize.define("MstRole", {
  role_id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  role_name: { 
    type: DataTypes.STRING(50), 
    allowNull: false, 
    unique: true 
  },
  role_description: { 
    type: DataTypes.TEXT, 
    allowNull: true 
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
  tableName: "mst_roles",
  timestamps: false 
});
