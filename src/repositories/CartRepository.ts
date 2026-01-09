import { v4 as uuidv4 } from 'uuid';
import CartItemModel, { CartItem } from '../models/CartItem.model';
import { SequelizeModelInstance } from '../types/sequelize';

class CartRepository {
  async findAll(): Promise<CartItem[]> {
    const cartItems = await CartItemModel.findAll({
      order: [['created_at', 'DESC']],
    });
    return cartItems.map((item) => this.mapToCartItem(item as SequelizeModelInstance<CartItem>));
  }

  async findById(id: string): Promise<CartItem | undefined> {
    const cartItem = await CartItemModel.findByPk(id);
    return cartItem ? this.mapToCartItem(cartItem as SequelizeModelInstance<CartItem>) : undefined;
  }

  async findByProductId(productId: string): Promise<CartItem | undefined> {
    const cartItem = await CartItemModel.findOne({
      where: { productId },
    });
    return cartItem ? this.mapToCartItem(cartItem as SequelizeModelInstance<CartItem>) : undefined;
  }

  async create(cartItem: Omit<CartItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<CartItem> {
    const id = this.generateId();
    const created = await CartItemModel.create({
      id,
      ...cartItem,
    });
    return this.mapToCartItem(created as SequelizeModelInstance<CartItem>);
  }

  async update(id: string, updates: Partial<CartItem>): Promise<CartItem | null> {
    const cartItem = await CartItemModel.findByPk(id);
    if (!cartItem) return null;

    await (cartItem as SequelizeModelInstance<CartItem>).update(updates);
    return this.mapToCartItem(cartItem as SequelizeModelInstance<CartItem>);
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await CartItemModel.destroy({
      where: { id },
    });
    return deleted > 0;
  }

  async clear(): Promise<void> {
    await CartItemModel.destroy({
      where: {},
      truncate: true,
    });
  }

  private mapToCartItem(model: SequelizeModelInstance<CartItem>): CartItem {
    return {
      id: model.id,
      productId: model.productId,
      quantity: model.quantity,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    };
  }

  private generateId(): string {
    return uuidv4();
  }
}

export const cartRepository = new CartRepository();
