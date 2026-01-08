// Load environment variables if running directly
if (require.main === module) {
  require('dotenv').config();
}

import { v4 as uuidv4 } from 'uuid';
import ProductModel from '../../models/Product.model';
import { sequelize } from '../config';

const products = [
  {
    id: uuidv4(),
    name: 'Laptop',
    description: 'High-performance laptop with latest processor',
    price: 999.99,
    stock: 10,
  },
  {
    id: uuidv4(),
    name: 'Mouse',
    description: 'Wireless ergonomic mouse',
    price: 29.99,
    stock: 50,
  },
  {
    id: uuidv4(),
    name: 'Keyboard',
    description: 'Mechanical keyboard with RGB lighting',
    price: 79.99,
    stock: 30,
  },
];

export const seedProducts = async (): Promise<void> => {
  try {
    // Check if products already exist
    const existingProducts = await ProductModel.count();
    
    if (existingProducts > 0) {
      console.log('✅ Products already seeded. Skipping...');
      return;
    }

    // Create products
    await ProductModel.bulkCreate(products as any);
    console.log(`✅ Successfully seeded ${products.length} products.`);
  } catch (error) {
    console.error('❌ Error seeding products:', error);
    throw error;
  }
};

// Run seeder if called directly
if (require.main === module) {
  (async () => {
    try {
      await sequelize.authenticate();
      await seedProducts();
      await sequelize.close();
      process.exit(0);
    } catch (error) {
      console.error('❌ Seeding failed:', error);
      await sequelize.close();
      process.exit(1);
    }
  })();
}
