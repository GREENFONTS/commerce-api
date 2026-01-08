import { DataTypes } from 'sequelize';
import { sequelize } from '../database/config';
import { OrderItem } from './OrderItem.model';

// TypeScript interface
export interface Order {
  id: string;
  orderNumber: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  total: number;
  customerEmail?: string;
  customerName?: string;
  shippingAddress?: string;
  notes?: string;
  createdAt: Date;
  updatedAt?: Date;
}

// Sequelize model
const OrderModel = sequelize.define('Order', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  orderNumber: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    field: 'order_number',
    validate: {
      notEmpty: true,
    },
  },
  status: {
    type: DataTypes.ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled'),
    defaultValue: 'pending',
    allowNull: false,
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0,
    },
  },
  customerEmail: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'customer_email',
    validate: {
      isEmail: true,
    },
  },
  customerName: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'customer_name',
  },
  shippingAddress: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'shipping_address',
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'created_at',
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'updated_at',
  },
}, {
  tableName: 'orders',
  timestamps: false,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['order_number'],
    },
    {
      fields: ['status'],
    },
    {
      fields: ['created_at'],
    },
    {
      fields: ['customer_email'],
    },
  ],
});

// Define associations
(OrderModel as any).associate = (models: any) => {
  OrderModel.hasMany(models.OrderItem, {
    foreignKey: 'orderId',
    as: 'items',
  });
};

export default OrderModel;
