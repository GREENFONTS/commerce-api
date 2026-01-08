import { v4 as uuidv4 } from 'uuid';
import ProductModel, { Product } from '../models/Product.model';

class ProductRepository {
  async findAll(): Promise<Product[]> {
    const products = await ProductModel.findAll({
      order: [['created_at', 'DESC']],
    });
    return products.map((p: any) => this.mapToProduct(p));
  }

  async findById(id: string): Promise<Product | undefined> {
    const product = await ProductModel.findByPk(id);
    return product ? this.mapToProduct(product as any) : undefined;
  }

  async create(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    const id = this.generateId();
    const created = await ProductModel.create({
      id,
      ...product,
    } as any);
    return this.mapToProduct(created as any);
  }

  async update(id: string, updates: Partial<Product>): Promise<Product | null> {
    const product = await ProductModel.findByPk(id);
    if (!product) return null;

    await (product as any).update(updates);
    return this.mapToProduct(product as any);
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await ProductModel.destroy({
      where: { id },
    });
    return deleted > 0;
  }

  private mapToProduct(model: any): Product {
    return {
      id: model.id,
      name: model.name,
      description: model.description,
      price: parseFloat(model.price.toString()),
      stock: model.stock,
      createdAt: model.createdAt || model.created_at,
      updatedAt: model.updatedAt || model.updated_at,
    };
  }

  private generateId(): string {
    return uuidv4();
  }
}

export const productRepository = new ProductRepository();
