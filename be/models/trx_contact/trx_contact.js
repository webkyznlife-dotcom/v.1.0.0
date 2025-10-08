import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database.js";
import { MstBranch } from "../mst_branch/mst_branch.js";
import { MstSubject } from "../mst_subject/mst_subject.js";

export const TrxContact = sequelize.define("TrxContact", {
  tc_id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  tc_pic_name: { 
    type: DataTypes.STRING(255), 
    allowNull: false 
  },
  tc_institution: { 
    type: DataTypes.STRING(255), 
    allowNull: true 
  },
  tc_whatsapp: { 
    type: DataTypes.STRING(50), 
    allowNull: true 
  },
  tc_email: { 
    type: DataTypes.STRING(255), 
    allowNull: true 
  },
  tc_message: { 
    type: DataTypes.TEXT, 
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
  subject_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: MstSubject,
      key: "subject_id"
    },
    onDelete: "SET NULL"
  },
  tc_status: { 
    type: DataTypes.STRING(20), 
    defaultValue: "NEW" 
  },
  tc_is_membership: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
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
  tableName: "trx_contact",
  timestamps: false 
});

// Relasi
MstBranch.hasMany(TrxContact, { foreignKey: "mb_id" });
TrxContact.belongsTo(MstBranch, { foreignKey: "mb_id" });

MstSubject.hasMany(TrxContact, { foreignKey: "subject_id" });
TrxContact.belongsTo(MstSubject, { foreignKey: "subject_id" });
