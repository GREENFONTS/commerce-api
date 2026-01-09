import { v4 as uuidv4 } from 'uuid';
import ProductModel, { Product } from '../models/Product.model';
import { PaginatedResult, PaginationParams } from '../utils/response';
import { SequelizeModelInstance } from '../types/sequelize';

class ProductRepository {
  async findAll(pagination?: PaginationParams): Promise<Product[] | PaginatedResult<Product>> {
    if (!pagination) {
      const products = await ProductModel.findAll({
        order: [['created_at', 'DESC']],
      });
      return products.map((p) => this.mapToProduct(p as SequelizeModelInstance<Product>));
    }

    const { page, limit } = pagination;
    const offset = (page - 1) * limit;

    const { count, rows } = await ProductModel.findAndCountAll({
      limit,
      offset,
      order: [['created_at', 'DESC']],
    });

    const totalPages = Math.ceil(count / limit);

    return {
      data: rows.map((p) => this.mapToProduct(p as SequelizeModelInstance<Product>)),
      pagination: {
        page,
        limit,
        total: count,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  async findById(id: string): Promise<Product | undefined> {
    const product = await ProductModel.findByPk(id);
    return product ? this.mapToProduct(product as SequelizeModelInstance<Product>) : undefined;
  }

  async create(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    const id = this.generateId();
    const created = await ProductModel.create({
      id,
      ...product,
    });
    return this.mapToProduct(created as SequelizeModelInstance<Product>);
  }

  async update(id: string, updates: Partial<Product>): Promise<Product | null> {
    const product = await ProductModel.findByPk(id);
    if (!product) return null;

    await (product as SequelizeModelInstance<Product>).update(updates);
    return this.mapToProduct(product as SequelizeModelInstance<Product>);
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await ProductModel.destroy({
      where: { id },
    });
    return deleted > 0;
  }

  private mapToProduct(model: SequelizeModelInstance<Product>): Product {
    return {
      id: model.id,
      name: model.name,
      description: model.description,
      price: parseFloat(model.price.toString()),
      stock: model.stock,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    };
  }

  private generateId(): string {
    return uuidv4();
  }
}

export const productRepository = new ProductRepository();
