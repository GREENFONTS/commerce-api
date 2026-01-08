import { v4 as uuidv4 } from 'uuid';
import { Order } from '../models/Order.model';
import { OrderItem } from '../models/OrderItem.model';
import { orderRepository } from '../repositories/OrderRepository';
import { cartRepository } from '../repositories/CartRepository';
import { productRepository } from '../repositories/ProductRepository';
import { productService } from './ProductService';
import { cartService } from './CartService';

export class OrderService {
  async getAllOrders(): Promise<Order[]> {
    return await orderRepository.findAll();
  }

  async getOrderById(id: string): Promise<Order | null> {
    const order = await orderRepository.findById(id);
    return order || null;
  }

  async getOrderByOrderNumber(orderNumber: string): Promise<Order | null> {
    const order = await orderRepository.findByOrderNumber(orderNumber);
    return order || null;
  }

  async checkout(customerInfo?: {
    email?: string;
    name?: string;
    shippingAddress?: string;
    notes?: string;
  }): Promise<Order> {
    const cartItems = await cartRepository.findAll();
    
    if (cartItems.length === 0) {
      throw new Error('Cannot checkout with an empty cart');
    }

    // Validate all items have sufficient stock
    for (const cartItem of cartItems) {
      const product = await productRepository.findById(cartItem.productId);
      if (!product) {
        throw new Error(`Product with id ${cartItem.productId} not found`);
      }
      if (product.stock < cartItem.quantity) {
        throw new Error(
          `Insufficient stock for product ${product.name}. Available: ${product.stock}, Requested: ${cartItem.quantity}`
        );
      }
    }

    // Create order items and calculate total
    const orderItems: OrderItem[] = [];
    let total = 0;

    for (const cartItem of cartItems) {
      const product = await productRepository.findById(cartItem.productId);
      if (!product) {
        throw new Error(`Product with id ${cartItem.productId} not found`);
      }
      
      await productService.reduceStock(product.id, cartItem.quantity);

      const subtotal = product.price * cartItem.quantity;
      total += subtotal;

      orderItems.push({
        id: uuidv4(),
        productId: product.id,
        productName: product.name,
        quantity: cartItem.quantity,
        price: product.price,
        subtotal,
      });
    }

    const order = await orderRepository.create({
      status: 'pending',
      items: orderItems,
      total,
      customerEmail: customerInfo?.email,
      customerName: customerInfo?.name,
      shippingAddress: customerInfo?.shippingAddress,
      notes: customerInfo?.notes,
    });

    await cartService.clearCart();

    return order;
  }

  async updateOrderStatus(id: string, status: Order['status']): Promise<Order | null> {
    return await orderRepository.update(id, { status });
  }

  async updateOrder(id: string, updates: Partial<Order>): Promise<Order | null> {
    return await orderRepository.update(id, updates);
  }
}

export const orderService = new OrderService();
