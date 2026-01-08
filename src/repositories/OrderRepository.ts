import { v4 as uuidv4 } from 'uuid';
import OrderModel, { Order } from '../models/Order.model';
import OrderItemModel, { OrderItem } from '../models/OrderItem.model';

class OrderRepository {
  async findAll(): Promise<Order[]> {
    const orders = await OrderModel.findAll({
      include: [
        {
          model: OrderItemModel,
          as: 'items',
        },
      ],
      order: [['created_at', 'DESC']],
    });
    return orders.map((order: any) => this.mapToOrder(order));
  }

  async findById(id: string): Promise<Order | undefined> {
    const order = await OrderModel.findByPk(id, {
      include: [
        {
          model: OrderItemModel,
          as: 'items',
        },
      ],
    });
    return order ? this.mapToOrder(order as any) : undefined;
  }

  async findByOrderNumber(orderNumber: string): Promise<Order | undefined> {
    const order = await OrderModel.findOne({
      where: { orderNumber },
      include: [
        {
          model: OrderItemModel,
          as: 'items',
        },
      ],
    });
    return order ? this.mapToOrder(order as any) : undefined;
  }

  async create(order: Omit<Order, 'id' | 'createdAt' | 'orderNumber'> & { orderNumber?: string }): Promise<Order> {
    const id = this.generateId();
    const orderNumber = order.orderNumber || this.generateOrderNumber();
    
    const createdOrder = await OrderModel.create({
      id,
      orderNumber,
      status: order.status || 'pending',
      total: order.total,
      customerEmail: order.customerEmail,
      customerName: order.customerName,
      shippingAddress: order.shippingAddress,
      notes: order.notes,
    } as any);

    const orderItems = await OrderItemModel.bulkCreate(
      order.items.map((item: any) => ({
        id: item.id,
        orderId: id,
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.subtotal,
      })) as any[]
    );

    return {
      id: (createdOrder as any).id,
      orderNumber: (createdOrder as any).orderNumber || (createdOrder as any).order_number,
      status: (createdOrder as any).status,
      items: orderItems.map((item: any) => this.mapToOrderItem(item)),
      total: parseFloat((createdOrder as any).total.toString()),
      customerEmail: (createdOrder as any).customerEmail || (createdOrder as any).customer_email,
      customerName: (createdOrder as any).customerName || (createdOrder as any).customer_name,
      shippingAddress: (createdOrder as any).shippingAddress || (createdOrder as any).shipping_address,
      notes: (createdOrder as any).notes,
      createdAt: (createdOrder as any).createdAt || (createdOrder as any).created_at,
      updatedAt: (createdOrder as any).updatedAt || (createdOrder as any).updated_at,
    };
  }

  async update(id: string, updates: Partial<Order>): Promise<Order | null> {
    const order = await OrderModel.findByPk(id);
    if (!order) return null;

    await (order as any).update({
      ...updates,
      updatedAt: new Date(),
    });
    
    const updatedOrder = await OrderModel.findByPk(id, {
      include: [
        {
          model: OrderItemModel,
          as: 'items',
        },
      ],
    });
    
    return updatedOrder ? this.mapToOrder(updatedOrder as any) : null;
  }

  private mapToOrder(model: any): Order {
    return {
      id: model.id,
      orderNumber: model.orderNumber || model.order_number,
      status: model.status,
      items: (model.items || []).map((item: any) => this.mapToOrderItem(item)),
      total: parseFloat(model.total.toString()),
      customerEmail: model.customerEmail || model.customer_email,
      customerName: model.customerName || model.customer_name,
      shippingAddress: model.shippingAddress || model.shipping_address,
      notes: model.notes,
      createdAt: model.createdAt || model.created_at,
      updatedAt: model.updatedAt || model.updated_at,
    };
  }

  private mapToOrderItem(model: any): OrderItem {
    return {
      id: model.id,
      productId: model.productId || model.product_id,
      productName: model.productName || model.product_name,
      quantity: model.quantity,
      price: parseFloat(model.price.toString()),
      subtotal: parseFloat(model.subtotal.toString()),
    };
  }

  private generateId(): string {
    return uuidv4();
  }

  private generateOrderNumber(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `ORD-${timestamp}-${random}`;
  }
}

export const orderRepository = new OrderRepository();
