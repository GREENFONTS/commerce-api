import { sequelize } from '../database/config';
import Product from './Product.model';
import CartItem from './CartItem.model';
import Order from './Order.model';
import OrderItem from './OrderItem.model';

const models: any = {
  Product,
  CartItem,
  Order,
  OrderItem,
};

// Initialize associations
Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

export {
  sequelize,
  Product,
  CartItem,
  Order,
  OrderItem,
};

export default models;


