import { Request, Response } from 'express';
import { orderService } from '../services/OrderService';
import { ResponseHandler, PaginationParams } from '../utils/response';
import { Order } from '../models/Order.model';

export class OrderController {
  async getAllOrders(req: Request, res: Response): Promise<void> {
    try {
      const { id, orderNumber, status, page, limit } = req.query;
      
      const query: { id?: string; orderNumber?: string; status?: Order['status'] } = {};
      if (id) query.id = id as string;
      if (orderNumber) query.orderNumber = orderNumber as string;
      if (status) {
        const validStatuses: Order['status'][] = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
        if (validStatuses.includes(status as Order['status'])) {
          query.status = status as Order['status'];
        }
      }

      // If filtering by id or orderNumber, don't paginate (return single result)
      const shouldPaginate = !id && !orderNumber;
      
      const pagination: PaginationParams | undefined = shouldPaginate
        ? {
            page: Math.max(1, parseInt(page as string) || 1),
            limit: Math.min(100, Math.max(1, parseInt(limit as string) || 10)),
          }
        : undefined;
      
      const result = await orderService.getAllOrders(query, pagination);

      if (result instanceof Array) {
        ResponseHandler.success(res, result, 'Orders retrieved successfully');
      } else {
        ResponseHandler.successWithPagination(
          res,
          result.data,
          result.pagination,
          'Orders retrieved successfully'
        );
      }
    } catch (error: any) {
      ResponseHandler.internalServerError(res, error.message || 'Failed to fetch orders');
    }
  }

  async checkout(req: Request, res: Response): Promise<void> {
    try {
      const { email, name, shippingAddress, notes } = req.body;
      const order = await orderService.checkout({
        email,
        name,
        shippingAddress,
        notes,
      });
      ResponseHandler.success(res, order, 'Order created successfully', 201);
    } catch (error: any) {
      ResponseHandler.badRequest(res, error.message || 'Failed to checkout');
    }
  }
}

export const orderController = new OrderController();
