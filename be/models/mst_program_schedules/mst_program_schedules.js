import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import { MstProgram } from "./mst_programs.js";
import { MstTrainer } from "./mst_trainers.js";

export const MstProgramSchedule = sequelize.define("MstProgramSchedule", {
  mpsd_id: { 
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
  mpsd_branch: { 
    type: DataTypes.STRING(255), 
    allowNull: false 
  },
  mpsd_court: { 
    type: DataTypes.STRING(100), 
    allowNull: true 
  },
  mpsd_date: { 
    type: DataTypes.DATEONLY, 
    allowNull: false 
  },
  mpsd_start_time: { 
    type: DataTypes.TIME, 
    allowNull: false 
  },
  mpsd_end_time: { 
    type: DataTypes.TIME, 
    allowNull: false 
  },
  trainer_id: { 
    type: DataTypes.INTEGER, 
    allowNull: true,
    references: {
      model: MstTrainer,
      key: "trainer_id"
    },
    onDelete: "SET NULL"
  },
  mpsd_status: { 
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
  tableName: "mst_program_schedules",
  timestamps: false 
});

// Relasi
MstProgram.hasMany(MstProgramSchedule, { foreignKey: "mp_id" });
MstProgramSchedule.belongsTo(MstProgram, { foreignKey: "mp_id" });

MstTrainer.hasMany(MstProgramSchedule, { foreignKey: "trainer_id" });
MstProgramSchedule.belongsTo(MstTrainer, { foreignKey: "trainer_id" });
