import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database.js";
import { MstRole } from "../mst_roles/mst_roles.js";
import { MstMenu } from "../mst_menu/mst_menu.js";

export const MstRoleMenu = sequelize.define("MstRoleMenu", {
  role_menu_id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  role_id: { 
    type: DataTypes.INTEGER, 
    allowNull: false,
    references: {
      model: MstRole,
      key: "role_id"
    },
    onDelete: "CASCADE"
  },
  menu_id: { 
    type: DataTypes.INTEGER, 
    allowNull: false,
    references: {
      model: MstMenu,
      key: "menu_id"
    },
    onDelete: "CASCADE"
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
  tableName: "mst_role_menu",
  timestamps: false 
});

// Relasi
MstRole.hasMany(MstRoleMenu, { foreignKey: "role_id" });
MstRoleMenu.belongsTo(MstRole, { foreignKey: "role_id" });

MstMenu.hasMany(MstRoleMenu, { foreignKey: "menu_id" });
MstRoleMenu.belongsTo(MstMenu, { foreignKey: "menu_id" });
