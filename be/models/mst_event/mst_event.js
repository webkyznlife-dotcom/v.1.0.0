import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database.js";
import { MstBranch } from "../mst_branch/mst_branch.js";
import slugify from "slugify"; // npm install slugify

export const MstEvent = sequelize.define("MstEvent", {
  me_id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  me_name: { 
    type: DataTypes.STRING(100), 
    allowNull: false 
  },
  me_description: { 
    type: DataTypes.TEXT, 
    allowNull: true 
  },
  me_youtube_url: { 
    type: DataTypes.STRING(255), 
    allowNull: true 
  },
  me_image_url: { 
    type: DataTypes.STRING(255), 
    allowNull: true 
  },
  mb_id: { 
    type: DataTypes.INTEGER, 
    allowNull: false,
    references: {
      model: MstBranch,
      key: "mb_id"
    },
    onDelete: "CASCADE"
  },
  me_created_at: { 
    type: DataTypes.DATE, 
    defaultValue: DataTypes.NOW 
  },
  me_updated_at: { 
    type: DataTypes.DATE, 
    defaultValue: DataTypes.NOW 
  },
  me_status: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  me_slug: {
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: true
  },
}, { 
  tableName: "mst_event",
  timestamps: false 
});

// Relasi
MstBranch.hasMany(MstEvent, { foreignKey: "mb_id" });
MstEvent.belongsTo(MstBranch, { foreignKey: "mb_id" });
