import { Request, Response } from 'express';
import { cartService } from '../services/CartService';

export class CartController {
  async getCartItems(req: Request, res: Response): Promise<void> {
    try {
      const cartItems = await cartService.getAllCartItems();
      res.json(cartItems);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch cart items' });
    }
  }

  async addItemToCart(req: Request, res: Response): Promise<void> {
    try {
      const { productId, quantity } = req.body;
      const cartItem = await cartService.addItemToCart(productId, quantity);
      res.status(201).json(cartItem);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to add item to cart' });
    }
  }

  async updateCartItemQuantity(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { quantity } = req.body;
      const cartItem = await cartService.updateCartItemQuantity(id, quantity);
      res.json(cartItem);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to update cart item' });
    }
  }

  async removeItemFromCart(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await cartService.removeItemFromCart(id);
      res.status(204).send();
    } catch (error: any) {
      res.status(404).json({ error: error.message || 'Cart item not found' });
    }
  }
}

export const cartController = new CartController();
