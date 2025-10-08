import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database.js";
import { MstRole } from "../mst_roles/mst_roles.js";

export const MstUser = sequelize.define("MstUser", {
  user_id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  username: { 
    type: DataTypes.STRING(100), 
    allowNull: false, 
    unique: true 
  },
  email: { 
    type: DataTypes.STRING(255), 
    allowNull: true, 
    unique: true 
  },
  password_hash: { 
    type: DataTypes.STRING(255), 
    allowNull: false 
  },
  full_name: { 
    type: DataTypes.STRING(255), 
    allowNull: false 
  },
  phone: { 
    type: DataTypes.STRING(50), 
    allowNull: true 
  },
  role_id: { 
    type: DataTypes.INTEGER, 
    allowNull: true,
    references: {
      model: MstRole,
      key: "role_id"
    },
    onDelete: "SET NULL"
  },
  is_active: { 
    type: DataTypes.BOOLEAN, 
    defaultValue: true 
  },
  last_login: { 
    type: DataTypes.DATE, 
    allowNull: true 
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
  tableName: "mst_users",
  timestamps: false 
});

// Relasi
MstRole.hasMany(MstUser, { foreignKey: "role_id" });
MstUser.belongsTo(MstRole, { foreignKey: "role_id" });
