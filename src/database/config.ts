import { Sequelize } from 'sequelize';
import { getEnvVar } from '../utils/env';

// Required database variables (no defaults)
const dbName = getEnvVar('DB_NAME', undefined, true);
const dbUser = getEnvVar('DB_USER', undefined, true);
const dbPassword = getEnvVar('DB_PASSWORD', undefined, true);
const dbHost = getEnvVar('DB_HOST', undefined, true);
const dbPort = parseInt(getEnvVar('DB_PORT', undefined, true), 10);

export const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  port: dbPort,
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  define: {
    underscored: true,
    timestamps: true,
  },
});

export const connectDatabase = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
    
    // Sync models (creates tables if they don't exist)
    await sequelize.sync({ alter: false });
    console.log('✅ Database models synchronized.');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    throw error;
  }
};
