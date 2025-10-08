import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database.js";

export const MstFacility = sequelize.define("MstFacility", {
  mf_id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  mf_name: { 
    type: DataTypes.STRING(255), 
    allowNull: false 
  },
  mf_description: { 
    type: DataTypes.TEXT, 
    allowNull: true 
  },
  mf_icon: { 
    type: DataTypes.STRING(500), 
    allowNull: true 
  },
  mf_status: { 
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
  tableName: "mst_facilities",
  timestamps: false 
});
