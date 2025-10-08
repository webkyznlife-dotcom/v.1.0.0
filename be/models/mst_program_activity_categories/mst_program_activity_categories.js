import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database.js";

export const MstProgramActivityCategory = sequelize.define("MstProgramActivityCategory", {
  mpac_id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  mpac_name: { 
    type: DataTypes.STRING(100), 
    allowNull: false 
  },
  mpac_status: { 
    type: DataTypes.BOOLEAN, 
    allowNull: false, 
    defaultValue: true 
  }  
}, { 
  tableName: "mst_program_activity_categories",
  timestamps: false 
});
