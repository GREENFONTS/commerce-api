import { DataTypes } from 'sequelize';
import { sequelize } from '../database/config';

// TypeScript interface
export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
}

// Sequelize model
const OrderItemModel = sequelize.define('OrderItem', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  orderId: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'order_id',
    references: {
      model: 'orders',
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
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
    onDelete: 'RESTRICT',
  },
  productName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'product_name',
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
    },
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
}, {
  tableName: 'order_items',
  timestamps: false,
  underscored: true,
  indexes: [
    {
      fields: ['order_id'],
    },
    {
      fields: ['product_id'],
    },
  ],
});

// Define associations
(OrderItemModel as any).associate = (models: any) => {
  OrderItemModel.belongsTo(models.Order, {
    foreignKey: 'orderId',
    as: 'order',
  });
  OrderItemModel.belongsTo(models.Product, {
    foreignKey: 'productId',
    as: 'product',
  });
};

export default OrderItemModel;
