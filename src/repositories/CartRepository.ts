import { v4 as uuidv4 } from 'uuid';
import CartItemModel, { CartItem } from '../models/CartItem.model';

class CartRepository {
  async findAll(): Promise<CartItem[]> {
    const cartItems = await CartItemModel.findAll({
      order: [['created_at', 'DESC']],
    });
    return cartItems.map((item: any) => this.mapToCartItem(item));
  }

  async findById(id: string): Promise<CartItem | undefined> {
    const cartItem = await CartItemModel.findByPk(id);
    return cartItem ? this.mapToCartItem(cartItem as any) : undefined;
  }

  async findByProductId(productId: string): Promise<CartItem | undefined> {
    const cartItem = await CartItemModel.findOne({
      where: { productId },
    });
    return cartItem ? this.mapToCartItem(cartItem as any) : undefined;
  }

  async create(cartItem: Omit<CartItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<CartItem> {
    const id = this.generateId();
    const created = await CartItemModel.create({
      id,
      ...cartItem,
    } as any);
    return this.mapToCartItem(created as any);
  }

  async update(id: string, updates: Partial<CartItem>): Promise<CartItem | null> {
    const cartItem = await CartItemModel.findByPk(id);
    if (!cartItem) return null;

    await (cartItem as any).update(updates);
    return this.mapToCartItem(cartItem as any);
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

  private mapToCartItem(model: any): CartItem {
    return {
      id: model.id,
      productId: model.productId || model.product_id,
      quantity: model.quantity,
      createdAt: model.createdAt || model.created_at,
      updatedAt: model.updatedAt || model.updated_at,
    };
  }

  private generateId(): string {
    return uuidv4();
  }
}

export const cartRepository = new CartRepository();
