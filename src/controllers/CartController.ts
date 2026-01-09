import { Request, Response } from 'express';
import { cartService } from '../services/CartService';
import { ResponseHandler } from '../utils/response';

export class CartController {
  async getCartItems(req: Request, res: Response): Promise<void> {
    try {
      const cartItems = await cartService.getAllCartItems();
      ResponseHandler.success(res, cartItems, 'Cart items retrieved successfully');
    } catch (error: any) {
      ResponseHandler.internalServerError(res, error.message || 'Failed to fetch cart items');
    }
  }

  async addItemToCart(req: Request, res: Response): Promise<void> {
    try {
      const { productId, quantity } = req.body;
      const cartItem = await cartService.addItemToCart(productId, quantity);
      ResponseHandler.success(res, cartItem, 'Item added to cart successfully', 201);
    } catch (error: any) {
      ResponseHandler.badRequest(res, error.message || 'Failed to add item to cart');
    }
  }

  async updateCartItemQuantity(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { quantity } = req.body;
      const cartItem = await cartService.updateCartItemQuantity(id, quantity);
      ResponseHandler.success(res, cartItem, 'Cart item updated successfully');
    } catch (error: any) {
      ResponseHandler.badRequest(res, error.message || 'Failed to update cart item');
    }
  }

  async removeItemFromCart(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await cartService.removeItemFromCart(id);
      ResponseHandler.success(res, null, 'Cart item removed successfully');
    } catch (error: any) {
      ResponseHandler.notFound(res, error.message || 'Cart item not found');
    }
  }
}

export const cartController = new CartController();
