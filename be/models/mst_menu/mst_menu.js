import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database.js";
import { MstMenuLabel } from "../mst_menu_label/mst_menu_label.js"; // pastikan path sesuai

export const MstMenu = sequelize.define("MstMenu", {
  menu_id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  menu_name: { 
    type: DataTypes.STRING(100), 
    allowNull: false 
  },
  menu_slug: { 
    type: DataTypes.STRING(150), 
    allowNull: false, 
    unique: true 
  },
  menu_url: { 
    type: DataTypes.STRING(255), 
    allowNull: true 
  },
  menu_icon: { 
    type: DataTypes.STRING(100), 
    allowNull: true 
  },
  parent_id: { 
    type: DataTypes.INTEGER, 
    allowNull: true,
    references: {
      model: "mst_menu",
      key: "menu_id"
    },
    onDelete: "SET NULL"
  },
  mml_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: MstMenuLabel,
      key: "mml_id"
    },
    onDelete: "SET NULL"
  },
  is_active: { 
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
  tableName: "mst_menu",
  timestamps: false 
});

// Relasi self-referencing untuk sub-menu
MstMenu.hasMany(MstMenu, { foreignKey: "parent_id", as: "sub_menus" });
MstMenu.belongsTo(MstMenu, { foreignKey: "parent_id", as: "parent_menu" });

// Relasi ke label menu
MstMenuLabel.hasMany(MstMenu, { foreignKey: "mml_id", as: "menus" });
MstMenu.belongsTo(MstMenuLabel, { foreignKey: "mml_id", as: "label" });
