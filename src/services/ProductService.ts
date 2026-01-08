import { Product } from '../models/Product.model';
import { productRepository } from '../repositories/ProductRepository';

export class ProductService {
  async getAllProducts(): Promise<Product[]> {
    return await productRepository.findAll();
  }

  async getProductById(id: string): Promise<Product | null> {
    const product = await productRepository.findById(id);
    return product || null;
  }

  async reduceStock(productId: string, quantity: number): Promise<boolean> {
    const product = await productRepository.findById(productId);
    if (!product) {
      throw new Error(`Product with id ${productId} not found`);
    }

    if (product.stock < quantity) {
      throw new Error(`Insufficient stock. Available: ${product.stock}, Requested: ${quantity}`);
    }

    await productRepository.update(productId, {
      stock: product.stock - quantity,
    });

    return true;
  }
}

export const productService = new ProductService();
