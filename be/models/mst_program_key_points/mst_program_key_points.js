import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database.js";
import { MstProgram } from "../mst_programs/mst_programs.js";

export const MstProgramKeyPoint = sequelize.define("MstProgramKeyPoint", {
  mpkp_id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  mp_id: { 
    type: DataTypes.INTEGER, 
    allowNull: true,
    references: {
      model: MstProgram,
      key: "mp_id"
    },
    onDelete: "CASCADE"
  },
  key_point: { 
    type: DataTypes.TEXT, 
    allowNull: false 
  },
  sort_order: { 
    type: DataTypes.INTEGER, 
    defaultValue: 1 
  },
  created_at: { 
    type: DataTypes.DATE, 
    defaultValue: DataTypes.NOW 
  },
  updated_at: { 
    type: DataTypes.DATE, 
    defaultValue: DataTypes.NOW 
  },
  status: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true, // true = aktif, false = soft delete
  },  
}, { 
  tableName: "mst_program_key_points",
  timestamps: false 
});

// Relasi
MstProgram.hasMany(MstProgramKeyPoint, { foreignKey: "mp_id" });
MstProgramKeyPoint.belongsTo(MstProgram, { foreignKey: "mp_id" });
