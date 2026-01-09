import { Model } from 'sequelize';

/**
 * Type helper for Sequelize model instances
 * This allows us to access model properties without 'as any'
 */
export type SequelizeModelInstance<T> = Model<any, any> & T;

/**
 * Type helper for Sequelize model instances with includes/associations
 */
export type SequelizeModelWithIncludes<T, I = {}> = SequelizeModelInstance<T> & I;

