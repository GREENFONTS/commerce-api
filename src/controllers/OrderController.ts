import { Request, Response } from 'express';
import { orderService } from '../services/OrderService';

export class OrderController {
  async getAllOrders(req: Request, res: Response): Promise<void> {
    try {
      const orders = await orderService.getAllOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch orders' });
    }
  }

  async getOrderById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const order = await orderService.getOrderById(id);
      if (!order) {
        res.status(404).json({ error: 'Order not found' });
        return;
      }
      res.json(order);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to fetch order' });
    }
  }

  async getOrderByOrderNumber(req: Request, res: Response): Promise<void> {
    try {
      const { orderNumber } = req.params;
      const order = await orderService.getOrderByOrderNumber(orderNumber);
      if (!order) {
        res.status(404).json({ error: 'Order not found' });
        return;
      }
      res.json(order);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to fetch order' });
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
      res.status(201).json(order);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to checkout' });
    }
  }

  async updateOrderStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const order = await orderService.updateOrderStatus(id, status);
      if (!order) {
        res.status(404).json({ error: 'Order not found' });
        return;
      }
      res.json(order);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to update order status' });
    }
  }
}

export const orderController = new OrderController();
