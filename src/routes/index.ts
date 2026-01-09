import { Router } from 'express';
import { productController } from '../controllers/ProductController';
import { cartController } from '../controllers/CartController';
import { orderController } from '../controllers/OrderController';
import { validate } from '../middleware/validation';
import { addToCartSchema, updateCartItemSchema, checkoutSchema } from '../validators/schemas';

const router = Router();

// Product routes
router.get('/products', (req, res) => productController.getAllProducts(req, res));

// Cart routes
router.get('/cart', (req, res) => cartController.getCartItems(req, res));
router.post('/cart', validate(addToCartSchema), (req, res) => cartController.addItemToCart(req, res));
router.put('/cart/:id', validate(updateCartItemSchema), (req, res) => cartController.updateCartItemQuantity(req, res));
router.delete('/cart/:id', (req, res) => cartController.removeItemFromCart(req, res));

// Order routes
router.get('/orders', (req, res) => orderController.getAllOrders(req, res));
router.post('/checkout', validate(checkoutSchema), (req, res) => orderController.checkout(req, res));

export default router;

