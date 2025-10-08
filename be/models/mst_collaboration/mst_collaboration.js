import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database.js";

export const MstCollaboration = sequelize.define("MstCollaboration", {
  mc_id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  mc_name: { 
    type: DataTypes.STRING(255), 
    allowNull: false 
  },
  mc_description: { 
    type: DataTypes.TEXT, 
    allowNull: true 
  },
  mc_image: { 
    type: DataTypes.STRING(500), 
    allowNull: true 
  },
  mc_status: { 
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
  tableName: "mst_collaboration",
  timestamps: false 
});
