import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database.js";

export const MstCourt = sequelize.define("MstCourt", {
  mc_id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  mc_name: { 
    type: DataTypes.STRING(255), 
    allowNull: false 
  },
  mc_type: { 
    type: DataTypes.STRING(100), 
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
  tableName: "mst_courts",
  timestamps: false 
});
