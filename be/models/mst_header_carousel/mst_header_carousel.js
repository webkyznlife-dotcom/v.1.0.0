import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const MstHeaderCarousel = sequelize.define("MstHeaderCarousel", {
  mhc_id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  mhc_title: { 
    type: DataTypes.STRING(150), 
    allowNull: false 
  },
  mhc_description: { 
    type: DataTypes.TEXT, 
    allowNull: true 
  },
  mhc_image_url: { 
    type: DataTypes.STRING(255), 
    allowNull: true 
  },
  mhc_video_url: { 
    type: DataTypes.STRING(255), 
    allowNull: true 
  },
  mhc_order: { 
    type: DataTypes.INTEGER, 
    defaultValue: 0 
  },
  mhc_is_active: { 
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
  tableName: "mst_header_carousel",
  timestamps: false 
});
