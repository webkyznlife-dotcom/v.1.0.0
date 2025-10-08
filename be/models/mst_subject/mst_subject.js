import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database.js"; // sesuaikan path

export const MstSubject = sequelize.define("MstSubject", {
  subject_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  subject_name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
  subject_description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  subject_status: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: true,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: "mst_subject",
  timestamps: false, // karena sudah ada created_at & updated_at
});

export default MstSubject;
