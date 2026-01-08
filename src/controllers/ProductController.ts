import { Request, Response } from 'express';
import { productService } from '../services/ProductService';

export class ProductController {
  async getAllProducts(req: Request, res: Response): Promise<void> {
    try {
      const products = await productService.getAllProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  }
}

export const productController = new ProductController();
