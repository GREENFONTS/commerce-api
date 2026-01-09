import { Request, Response } from 'express';
import { productService } from '../services/ProductService';
import { ResponseHandler, PaginationParams } from '../utils/response';

export class ProductController {
  async getAllProducts(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const pagination: PaginationParams = {
        page: Math.max(1, page),
        limit: Math.min(100, Math.max(1, limit)), // Limit between 1 and 100
      };

      const result = await productService.getAllProducts(pagination);

      if (result instanceof Array) {
        ResponseHandler.success(res, result, 'Products retrieved successfully');
      } else {
        ResponseHandler.successWithPagination(
          res,
          result.data,
          result.pagination,
          'Products retrieved successfully'
        );
      }
    } catch (error: any) {
      ResponseHandler.internalServerError(res, error.message || 'Failed to fetch products');
    }
  }
}

export const productController = new ProductController();
