import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database.js";
import { MstProgramCategory } from "../mst_program_categories/mst_program_categories.js";
import { MstProgramAge } from "../mst_program_ages/mst_program_ages.js";
import { MstProgramActivityCategory } from "../mst_program_activity_categories/mst_program_activity_categories.js";
import { MstProgramType } from "../mst_program_type/mst_program_type.js";

export const MstProgram = sequelize.define("MstProgram", {
  mp_id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  mp_name: { 
    type: DataTypes.STRING(255), 
    allowNull: false 
  },
  mp_description: { 
    type: DataTypes.TEXT, 
    allowNull: true 
  },
  mp_category_id: { 
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: MstProgramCategory,
      key: "mpc_id"
    },
    onDelete: "SET NULL"
  },
  mp_age_id: { 
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: MstProgramAge,
      key: "mpa_id"
    },
    onDelete: "SET NULL"
  },
  mp_activity_category_id: { 
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: MstProgramActivityCategory,
      key: "mpac_id"
    },
    onDelete: "SET NULL"
  },
  mp_status: { 
    type: DataTypes.BOOLEAN, 
    defaultValue: true 
  },
  mp_header_image: { 
    type: DataTypes.STRING(500), 
    allowNull: true 
  },
  mp_thumbnail: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  created_at: { 
    type: DataTypes.DATE, 
    defaultValue: DataTypes.NOW 
  },
  updated_at: { 
    type: DataTypes.DATE, 
    defaultValue: DataTypes.NOW 
  },
  mp_slug: {
    type: DataTypes.STRING(255),
    allowNull: true,
    unique: true
  },
  mpt_id: {  // ✅ Program Type
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: MstProgramType,
        key: "mpt_id"
      },
      onDelete: "SET NULL"
    },
}, { 
  tableName: "mst_programs",
  timestamps: false 
});

// Relasi
MstProgramCategory.hasMany(MstProgram, { foreignKey: "mp_category_id" });
MstProgram.belongsTo(MstProgramCategory, { foreignKey: "mp_category_id" });

MstProgramAge.hasMany(MstProgram, { foreignKey: "mp_age_id" });
MstProgram.belongsTo(MstProgramAge, { foreignKey: "mp_age_id" });

MstProgramActivityCategory.hasMany(MstProgram, { foreignKey: "mp_activity_category_id" });
MstProgram.belongsTo(MstProgramActivityCategory, { foreignKey: "mp_activity_category_id" });

MstProgramType.hasMany(MstProgram, { foreignKey: "mpt_id" });
MstProgram.belongsTo(MstProgramType, { foreignKey: "mpt_id" });