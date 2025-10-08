import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database.js";
import { MstCourt } from "../mst_courts/mst_courts.js";

export const MstCourtImage = sequelize.define("MstCourtImage", {
  mci_id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  mc_id: { 
    type: DataTypes.INTEGER, 
    allowNull: false,
    references: {
      model: MstCourt,
      key: "mc_id"
    },
    onDelete: "CASCADE"
  },
  mci_image: { 
    type: DataTypes.STRING(500), 
    allowNull: false 
  },
  mci_description: { 
    type: DataTypes.TEXT, 
    allowNull: true 
  },
  mci_status: { 
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
  tableName: "mst_courts_image",
  timestamps: false 
});

// Relasi
MstCourt.hasMany(MstCourtImage, { foreignKey: "mc_id" });
MstCourtImage.belongsTo(MstCourt, { foreignKey: "mc_id" });
