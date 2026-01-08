import { DataTypes } from 'sequelize';
import { sequelize } from '../database/config';

// TypeScript interface
export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}

// Sequelize model
const CartItemModel = sequelize.define('CartItem', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  productId: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'product_id',
    references: {
      model: 'products',
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
    },
  },
}, {
  tableName: 'cart_items',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['product_id'],
    },
  ],
});

// Define associations
(CartItemModel as any).associate = (models: any) => {
  CartItemModel.belongsTo(models.Product, {
    foreignKey: 'productId',
    as: 'product',
  });
};

export default CartItemModel;
