import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database.js";

export const MstProgramCategory = sequelize.define("MstProgramCategory", {
  mpc_id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  mpc_name: { 
    type: DataTypes.STRING(50), 
    allowNull: false, 
    unique: true 
  },
  mpc_status: { 
    type: DataTypes.BOOLEAN, 
    defaultValue: true 
  }
}, { 
  tableName: "mst_program_categories",
  timestamps: false 
});
