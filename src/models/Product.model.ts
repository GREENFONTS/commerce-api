import { DataTypes } from 'sequelize';
import { sequelize } from '../database/config';

// TypeScript interface
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}

// Sequelize model
const ProductModel = sequelize.define('Product', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0,
    },
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
    },
  },
}, {
  tableName: 'products',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['name'],
    },
  ],
});

// Define associations
(ProductModel as any).associate = (models: any) => {
  ProductModel.hasMany(models.CartItem, {
    foreignKey: 'productId',
    as: 'cartItems',
  });
  ProductModel.hasMany(models.OrderItem, {
    foreignKey: 'productId',
    as: 'orderItems',
  });
};

export default ProductModel;
