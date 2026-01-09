import { v4 as uuidv4 } from 'uuid';
import OrderModel, { Order } from '../models/Order.model';
import OrderItemModel, { OrderItem } from '../models/OrderItem.model';
import { PaginatedResult, PaginationParams } from '../utils/response';
import { SequelizeModelWithIncludes } from '../types/sequelize';

class OrderRepository {
  async findAll(
    query?: { id?: string; orderNumber?: string; status?: Order['status'] },
    pagination?: PaginationParams
  ): Promise<Order[] | PaginatedResult<Order>> {
    const where: any = {};
    
    if (query?.id) {
      where.id = query.id;
    }
    
    if (query?.orderNumber) {
      where.orderNumber = query.orderNumber;
    }
    
    if (query?.status) {
      where.status = query.status;
    }
    
    if (!pagination) {
      const orders = await OrderModel.findAll({
        where: Object.keys(where).length > 0 ? where : undefined,
        include: [
          {
            model: OrderItemModel,
            as: 'items',
          },
        ],
        order: [['created_at', 'DESC']],
      });
      return orders.map((order) => this.mapToOrder(order as SequelizeModelWithIncludes<Order, { items?: OrderItem[] }>));
    }

    const { page, limit } = pagination;
    const offset = (page - 1) * limit;

    const { count, rows } = await OrderModel.findAndCountAll({
      where: Object.keys(where).length > 0 ? where : undefined,
      include: [
        {
          model: OrderItemModel,
          as: 'items',
        },
      ],
      limit,
      offset,
      order: [['created_at', 'DESC']],
    });

    const totalPages = Math.ceil(count / limit);

    return {
      data: rows.map((order) => this.mapToOrder(order as SequelizeModelWithIncludes<Order, { items?: OrderItem[] }>)),
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

  async findById(id: string): Promise<Order | undefined> {
    const order = await OrderModel.findByPk(id, {
      include: [
        {
          model: OrderItemModel,
          as: 'items',
        },
      ],
    });
    return order ? this.mapToOrder(order as SequelizeModelWithIncludes<Order, { items?: OrderItem[] }>) : undefined;
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
    return order ? this.mapToOrder(order as SequelizeModelWithIncludes<Order, { items?: OrderItem[] }>) : undefined;
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
    });

    const orderItems = await OrderItemModel.bulkCreate(
      order.items.map((item) => ({
        id: item.id,
        orderId: id,
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.subtotal,
      }))
    );

    // Reload the order with items to get the full relationship
    const orderWithItems = await OrderModel.findByPk(id, {
      include: [
        {
          model: OrderItemModel,
          as: 'items',
        },
      ],
    });

    return this.mapToOrder(orderWithItems! as SequelizeModelWithIncludes<Order, { items?: OrderItem[] }>);
  }

  async update(id: string, updates: Partial<Order>): Promise<Order | null> {
    const order = await OrderModel.findByPk(id);
    if (!order) return null;

    await (order as SequelizeModelWithIncludes<Order>).update({
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
    
    return updatedOrder ? this.mapToOrder(updatedOrder as SequelizeModelWithIncludes<Order, { items?: OrderItem[] }>) : null;
  }

  private mapToOrder(model: SequelizeModelWithIncludes<Order, { items?: OrderItem[] }>): Order {
    return {
      id: model.id,
      orderNumber: model.orderNumber,
      status: model.status,
      items: (model.items || []).map((item) => this.mapToOrderItem(item as SequelizeModelWithIncludes<OrderItem>)),
      total: parseFloat(model.total.toString()),
      customerEmail: model.customerEmail,
      customerName: model.customerName,
      shippingAddress: model.shippingAddress,
      notes: model.notes,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    };
  }

  private mapToOrderItem(model: SequelizeModelWithIncludes<OrderItem>): OrderItem {
    return {
      id: model.id,
      productId: model.productId,
      productName: model.productName,
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
