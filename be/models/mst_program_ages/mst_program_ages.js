import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database.js";

export const MstProgramAge = sequelize.define("MstProgramAge", {
  mpa_id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  mpa_min: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  },
  mpa_max: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  },
  mpa_status: { 
    type: DataTypes.BOOLEAN, 
    defaultValue: true 
  }
}, { 
  tableName: "mst_program_ages",
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['mpa_min', 'mpa_max'] // gabungkan mpa_min + mpa_max jadi unik
    }
  ]
});
