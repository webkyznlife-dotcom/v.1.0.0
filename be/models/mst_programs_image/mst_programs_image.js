import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database.js";
import { MstProgram } from "../mst_programs/mst_programs.js";

export const MstProgramImage = sequelize.define("MstProgramImage", {
  mpi_id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  mp_id: { 
    type: DataTypes.INTEGER, 
    allowNull: false,
    references: {
      model: MstProgram,
      key: "mp_id"
    },
    onDelete: "CASCADE"
  },
  mpi_image: { 
    type: DataTypes.STRING(500), 
    allowNull: false 
  },
  mpi_description: { 
    type: DataTypes.TEXT, 
    allowNull: true 
  },
  mpi_status: { 
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
  tableName: "mst_programs_image",
  timestamps: false 
});

// Relasi
MstProgram.hasMany(MstProgramImage, { foreignKey: "mp_id" });
MstProgramImage.belongsTo(MstProgram, { foreignKey: "mp_id" });
