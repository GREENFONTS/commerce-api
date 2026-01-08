import { CartItem } from '../models/CartItem.model';
import { cartRepository } from '../repositories/CartRepository';
import { productRepository } from '../repositories/ProductRepository';

export class CartService {
  async getAllCartItems(): Promise<CartItem[]> {
    return await cartRepository.findAll();
  }

  async addItemToCart(productId: string, quantity: number): Promise<CartItem> {
    // Validate product exists
    const product = await productRepository.findById(productId);
    if (!product) {
      throw new Error(`Product with id ${productId} not found`);
    }

    // Business rule: Users cannot add more items than available stock
    if (quantity > product.stock) {
      throw new Error(
        `Cannot add ${quantity} items. Only ${product.stock} items available in stock.`
      );
    }

    // Check if item already exists in cart
    const existingCartItem = await cartRepository.findByProductId(productId);
    
    if (existingCartItem) {
      const newQuantity = existingCartItem.quantity + quantity;
      
      // Business rule: Total quantity cannot exceed stock
      if (newQuantity > product.stock) {
        throw new Error(
          `Cannot add ${quantity} items. Cart already has ${existingCartItem.quantity} items, and only ${product.stock} items available in stock.`
        );
      }

      const updated = await cartRepository.update(existingCartItem.id, {
        quantity: newQuantity,
      });
      if (!updated) {
        throw new Error('Failed to update cart item');
      }
      return updated;
    }

    // Create new cart item
    return await cartRepository.create({
      productId,
      quantity,
    });
  }

  async updateCartItemQuantity(cartItemId: string, quantity: number): Promise<CartItem> {
    if (quantity <= 0) {
      throw new Error('Quantity must be greater than 0');
    }

    const cartItem = await cartRepository.findById(cartItemId);
    if (!cartItem) {
      throw new Error(`Cart item with id ${cartItemId} not found`);
    }

    // Business rule: Users cannot add more items than available stock
    const product = await productRepository.findById(cartItem.productId);
    if (!product) {
      throw new Error(`Product with id ${cartItem.productId} not found`);
    }

    if (quantity > product.stock) {
      throw new Error(
        `Cannot update to ${quantity} items. Only ${product.stock} items available in stock.`
      );
    }

    const updatedCartItem = await cartRepository.update(cartItemId, { quantity });
    if (!updatedCartItem) {
      throw new Error(`Failed to update cart item with id ${cartItemId}`);
    }

    return updatedCartItem;
  }

  async removeItemFromCart(cartItemId: string): Promise<void> {
    const deleted = await cartRepository.delete(cartItemId);
    if (!deleted) {
      throw new Error(`Cart item with id ${cartItemId} not found`);
    }
  }

  async clearCart(): Promise<void> {
    await cartRepository.clear();
  }
}

export const cartService = new CartService();
