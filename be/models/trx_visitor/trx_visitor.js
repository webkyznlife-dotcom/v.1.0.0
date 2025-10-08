import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database.js";

export const TrxVisitor = sequelize.define(
  "TrxVisitor",
  {
    tv_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    tv_ip_address: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    tv_user_agent: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    tv_page: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    tv_city: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    tv_country: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    tv_created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "trx_visitor",
    timestamps: false, // karena kita sudah punya tv_created_at
  }
);