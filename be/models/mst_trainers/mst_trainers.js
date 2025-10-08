import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database.js";

export const MstTrainer = sequelize.define("MstTrainer", {
  trainer_id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  trainer_name: { 
    type: DataTypes.STRING(255), 
    allowNull: false 
  },
  trainer_email: { 
    type: DataTypes.STRING(255), 
    allowNull: true 
  },
  trainer_phone: { 
    type: DataTypes.STRING(50), 
    allowNull: true 
  },
  trainer_speciality: { 
    type: DataTypes.STRING(255), 
    allowNull: true 
  },
  trainer_status: { 
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
  tableName: "mst_trainers",
  timestamps: false 
});
