import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database.js";

export const MstCustomerTestimonial = sequelize.define("MstCustomerTestimonial", {
  mct_id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  mct_name: { 
    type: DataTypes.STRING(255), 
    allowNull: false 
  },
  mct_testimonial: { 
    type: DataTypes.TEXT, 
    allowNull: false 
  },
  mct_avatar: { 
    type: DataTypes.STRING(500), 
    allowNull: true 
  },
  mct_social_url: { 
    type: DataTypes.STRING(500), 
    allowNull: true 
  },
  mct_social_type: { 
    type: DataTypes.STRING(100), 
    allowNull: true 
  },
  mct_status: { 
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
  tableName: "mst_customer_testimonial",
  timestamps: false 
});
