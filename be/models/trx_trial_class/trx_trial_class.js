import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database.js";
import { MstBranch } from "../mst_branch/mst_branch.js";
import { MstProgramAge } from "../mst_program_ages/mst_program_ages.js";
import { MstProgram } from "../mst_programs/mst_programs.js";

export const TrxTrialClass = sequelize.define("TrxTrialClass", {
  ttc_id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  ttc_name: { 
    type: DataTypes.STRING(255), 
    allowNull: false 
  },
  ttc_dob: { 
    type: DataTypes.DATEONLY, 
    allowNull: false 
  },
  ttc_email: { 
    type: DataTypes.STRING(255), 
    allowNull: true 
  },
  ttc_whatsapp: { 
    type: DataTypes.STRING(50), 
    allowNull: true 
  },
  mb_id: { 
    type: DataTypes.INTEGER, 
    allowNull: true,
    references: {
      model: MstBranch,
      key: "mb_id"
    },
    onDelete: "SET NULL"
  },
  mpa_id: { 
    type: DataTypes.INTEGER, 
    allowNull: true,
    references: {
      model: MstProgramAge,
      key: "mpa_id"
    },
    onDelete: "SET NULL"
  },
  mp_id: { 
    type: DataTypes.INTEGER, 
    allowNull: true,
    references: {
      model: MstProgram,
      key: "mp_id"
    },
    onDelete: "SET NULL"
  },
  ttc_day: { 
    type: DataTypes.STRING(50), 
    allowNull: false 
  },
  ttc_time: { 
    type: DataTypes.TIME, 
    allowNull: false 
  },
  ttc_terms_accepted: { 
    type: DataTypes.BOOLEAN, 
    defaultValue: false 
  },
  ttc_marketing_opt_in: { 
    type: DataTypes.BOOLEAN, 
    defaultValue: false 
  },
  ttc_status: { 
    type: DataTypes.STRING(20), 
    defaultValue: "PENDING" 
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
  tableName: "trx_trial_class",
  timestamps: false 
});

// Relasi
MstBranch.hasMany(TrxTrialClass, { foreignKey: "mb_id" });
TrxTrialClass.belongsTo(MstBranch, { foreignKey: "mb_id" });

MstProgramAge.hasMany(TrxTrialClass, { foreignKey: "mpa_id" });
TrxTrialClass.belongsTo(MstProgramAge, { foreignKey: "mpa_id" });

MstProgram.hasMany(TrxTrialClass, { foreignKey: "mp_id" });
TrxTrialClass.belongsTo(MstProgram, { foreignKey: "mp_id" });
