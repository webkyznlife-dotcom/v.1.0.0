import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database.js";
import { MstProgram } from "../mst_programs/mst_programs.js";
import { MstBranch } from "../mst_branch/mst_branch.js";
import { MstCourt } from "../mst_courts/mst_courts.js";
import { MstTrainer } from "../mst_trainers/mst_trainers.js";
import { MstProgramAge } from "../mst_program_ages/mst_program_ages.js";

export const TrxProgramSchedule = sequelize.define("TrxProgramSchedule", {
  tpsd_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  mp_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: MstProgram,
      key: "mp_id",
    },
    onDelete: "CASCADE",
  },
  mb_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: MstBranch,
      key: "mb_id",
    },
    onDelete: "CASCADE",
  },
  tpsd_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  tpsd_start_time: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  tpsd_end_time: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  trainer_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: MstTrainer,
      key: "trainer_id",
    },
    onDelete: "SET NULL",
  },
  tpsd_status: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  mc_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: MstCourt,
      key: "mc_id",
    },
    onDelete: "CASCADE",
  },
  mpa_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: MstProgramAge,
        key: "mpa_id",
      },
      onDelete: "SET NULL",
    },  
}, {
  tableName: "trx_program_schedules",
  timestamps: false,
});

// Relasi
MstProgram.hasMany(TrxProgramSchedule, { foreignKey: "mp_id" });
TrxProgramSchedule.belongsTo(MstProgram, { foreignKey: "mp_id" });

MstBranch.hasMany(TrxProgramSchedule, { foreignKey: "mb_id" });
TrxProgramSchedule.belongsTo(MstBranch, { foreignKey: "mb_id" });

MstCourt.hasMany(TrxProgramSchedule, { foreignKey: "mc_id" });
TrxProgramSchedule.belongsTo(MstCourt, { foreignKey: "mc_id" });

MstTrainer.hasMany(TrxProgramSchedule, { foreignKey: "trainer_id" });
TrxProgramSchedule.belongsTo(MstTrainer, { foreignKey: "trainer_id" });

MstProgramAge.hasMany(TrxProgramSchedule, { foreignKey: "mpa_id" });
TrxProgramSchedule.belongsTo(MstProgramAge, { foreignKey: "mpa_id" });