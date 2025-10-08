import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database.js";

export const MstProgramType = sequelize.define("MstProgramType", {
  mpt_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  mpt_name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  mpt_status: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
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
  tableName: "mst_program_type",
  timestamps: false
});
