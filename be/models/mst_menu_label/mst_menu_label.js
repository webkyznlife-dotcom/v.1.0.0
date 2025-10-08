import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database.js";

export const MstMenuLabel = sequelize.define("MstMenuLabel", {
  mml_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  mml_name: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  mml_created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  mml_updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: "mst_menu_label",
  timestamps: false
});

// Relasi ke MstMenu akan dibuat di MstMenu.js
