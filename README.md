# Commerce API

A simple e-commerce backend service built with Node.js, TypeScript, and Express. This API demonstrates clean architecture, proper business logic implementation, and attention to detail.

## Features

- **Product Management**: View all available products
- **Shopping Cart**: Add, update, and remove items from cart
- **Order Processing**: Checkout functionality with stock management
- **Database**: PostgreSQL database with Sequelize ORM for persistent data storage
- **Input Validation**: Joi validation for all API inputs
- **Migrations & Seeders**: Database seeding for initial product data
- **Business Rules Enforcement**:
  - Users cannot add more items than available stock
  - Product stock reduces automatically on checkout
  - Cart clears automatically after checkout

## Architecture

The project follows a clean architecture pattern with clear separation of concerns:

```
src/
├── models/          # Data models/interfaces and Sequelize models
├── database/        # Database configuration and seeders
│   ├── config.ts    # Sequelize configuration
│   └── seeders/     # Database seeders
├── repositories/    # Data access layer (Sequelize)
├── services/        # Business logic layer
├── controllers/     # Request/response handling
├── validators/      # Joi validation schemas
├── middleware/      # Express middleware (validation)
├── routes/          # API route definitions
└── index.ts         # Application entry point
```

## Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)
- PostgreSQL (v12 or higher)

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd commerce-api
   ```

2. **Set up PostgreSQL database**
   
   Create a PostgreSQL database:
   ```bash
   createdb commerce_db
   ```
   
   Or using psql:
   ```sql
   CREATE DATABASE commerce_db;
   ```

3. **Configure environment variables** (required)
   
   Create a `.env` file in the root directory:
   ```env
   DB_NAME=commerce_db
   DB_USER=postgres
   DB_PASSWORD=postgres
   DB_HOST=localhost
   DB_PORT=5432
   PORT=3000
   NODE_ENV=development
   ```
   
   **Required variables:**
   - `DB_NAME` - PostgreSQL database name
   - `DB_USER` - PostgreSQL username
   - `DB_PASSWORD` - PostgreSQL password
   - `DB_HOST` - PostgreSQL host
   - `DB_PORT` - PostgreSQL port
   
   **Optional variables:**
   - `PORT` - Server port (defaults to 3000)
   - `NODE_ENV` - Environment (defaults to development)
   
   The application will exit if required database variables are not set.

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Build the project**
   ```bash
   npm run build
   ```

6. **Seed the database** (optional - runs automatically on server start)
   ```bash
   npm run db:seed
   ```

7. **Start the server**
   ```bash
   npm start
   ```

   The server will start on `http://localhost:3000`
   
   **Note**: The database tables will be automatically created on first run. Sample products will be seeded automatically.

## Development Mode

For development with auto-reload:

```bash
npm run dev
```

## API Endpoints

### Products

#### Get All Products
- **GET** `/api/products`
- **Description**: Retrieve all available products with pagination
- **Query Parameters** (optional):
  - `page` - Page number (default: 1)
  - `limit` - Items per page (default: 10, max: 100)
- **Response**: Paginated response with products and pagination metadata
  ```json
  {
    "success": true,
    "message": "Products retrieved successfully",
    "data": [
      {
        "id": "prod_...",
        "name": "Laptop",
        "description": "High-performance laptop",
        "price": 999.99,
        "stock": 10,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "totalPages": 5,
      "hasNextPage": true,
      "hasPreviousPage": false
    }
  }
  ```
- **Examples**:
  - Get first page: `GET /api/products`
  - Get page 2 with 20 items: `GET /api/products?page=2&limit=20`

### Cart

#### Get Cart Items
- **GET** `/api/cart`
- **Description**: Retrieve all items in the cart
- **Response**: Standardized response with cart items
  ```json
  {
    "success": true,
    "message": "Cart items retrieved successfully",
    "data": [
      {
        "id": "cart_...",
        "productId": "prod_...",
        "quantity": 2,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ]
  }
  ```

#### Add Item to Cart
- **POST** `/api/cart`
- **Description**: Add a product to the cart
- **Request Body**:
  ```json
  {
    "productId": "prod_...",
    "quantity": 2
  }
  ```
- **Validation**: 
  - `productId` (required, string)
  - `quantity` (required, positive integer)
- **Response**: Standardized response with created cart item
  ```json
  {
    "success": true,
    "message": "Item added to cart successfully",
    "data": {
      "id": "cart_...",
      "productId": "prod_...",
      "quantity": 2,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
  ```
- **Error**: Returns 400 with error message if validation fails or quantity exceeds available stock

#### Update Cart Item Quantity
- **PUT** `/api/cart/:id`
- **Description**: Update the quantity of a cart item
- **URL Parameters**: `id` - Cart item ID
- **Request Body**:
  ```json
  {
    "quantity": 3
  }
  ```
- **Validation**: 
  - `quantity` (required, positive integer)
- **Response**: Standardized response with updated cart item
  ```json
  {
    "success": true,
    "message": "Cart item updated successfully",
    "data": {
      "id": "cart_...",
      "productId": "prod_...",
      "quantity": 3,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
  ```
- **Error**: Returns 400 with error message if validation fails or quantity exceeds available stock

#### Remove Item from Cart
- **DELETE** `/api/cart/:id`
- **Description**: Remove an item from the cart
- **URL Parameters**: `id` - Cart item ID
- **Response**: Standardized success response
  ```json
  {
    "success": true,
    "message": "Cart item removed successfully",
    "data": null
  }
  ```
- **Error**: Returns 404 with error message if cart item not found

### Orders

#### Get All Orders
- **GET** `/api/orders`
- **Description**: Retrieve all orders with pagination, or filter by ID, order number, or status
- **Query Parameters** (optional):
  - `id` - Filter by order ID (returns single order in array, no pagination)
  - `orderNumber` - Filter by order number (returns single order in array, no pagination)
  - `status` - Filter by order status (works with pagination). Valid values: `pending`, `processing`, `shipped`, `delivered`, `cancelled`
  - `page` - Page number (default: 1, only used when not filtering by id/orderNumber)
  - `limit` - Items per page (default: 10, max: 100, only used when not filtering by id/orderNumber)
- **Response**: Paginated response with orders and pagination metadata (or array if filtered by id/orderNumber)
  ```json
  {
    "success": true,
    "message": "Orders retrieved successfully",
    "data": [
      {
        "id": "order_...",
        "orderNumber": "ORD-...",
        "status": "pending",
        "items": [
          {
            "id": "oi_...",
            "productId": "prod_...",
            "productName": "Laptop",
            "quantity": 1,
            "price": 999.99,
            "subtotal": 999.99
          }
        ],
        "total": 999.99,
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3,
      "hasNextPage": true,
      "hasPreviousPage": false
    }
  }
  ```
- **Examples**:
  - Get all orders: `GET /api/orders`
  - Get orders with pagination: `GET /api/orders?page=2&limit=20`
  - Filter by status: `GET /api/orders?status=pending`
  - Filter by ID: `GET /api/orders?id=550e8400-e29b-41d4-a716-446655440000`
  - Filter by order number: `GET /api/orders?orderNumber=ORD-1234567890-ABC123`

#### Checkout
- **POST** `/api/checkout`
- **Description**: Process checkout and create an order
- **Request Body** (optional):
  ```json
  {
    "email": "customer@example.com",
    "name": "John Doe",
    "shippingAddress": "123 Main St, City, Country",
    "notes": "Please leave at front door"
  }
  ```
- **Response**: Standardized response with created order
  ```json
  {
    "success": true,
    "message": "Order created successfully",
    "data": {
      "id": "order_...",
      "orderNumber": "ORD-...",
      "status": "pending",
      "items": [...],
      "total": 999.99,
      "customerEmail": "customer@example.com",
      "customerName": "John Doe",
      "shippingAddress": "123 Main St, City, Country",
      "notes": "Please leave at front door",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
  ```
- **Business Logic**:
  - Validates all cart items have sufficient stock
  - Reduces product stock for each item
  - Creates order with calculated totals
  - Clears the cart automatically
- **Error**: Returns 400 with error message if cart is empty or stock is insufficient

## Business Rules

1. **Stock Validation**: Users cannot add or update cart items to exceed available product stock
2. **Stock Reduction**: Product stock is automatically reduced when an order is placed
3. **Cart Clearing**: The cart is automatically cleared after a successful checkout

## Example Usage

### 1. Get all products (paginated)
```bash
# Get first page (default: 10 items per page)
curl http://localhost:3000/api/products

# Get page 2 with 20 items per page
curl http://localhost:3000/api/products?page=2&limit=20
```

### 2. Add item to cart
```bash
curl -X POST http://localhost:3000/api/cart \
  -H "Content-Type: application/json" \
  -d '{"productId": "prod_...", "quantity": 2}'
```

### 3. Update cart item quantity
```bash
curl -X PUT http://localhost:3000/api/cart/cart_... \
  -H "Content-Type: application/json" \
  -d '{"quantity": 3}'
```

### 4. Remove item from cart
```bash
curl -X DELETE http://localhost:3000/api/cart/cart_...
```

### 5. Checkout
```bash
curl -X POST http://localhost:3000/api/checkout
```

### 6. Get orders
```bash
# Get all orders (paginated)
curl http://localhost:3000/api/orders

# Get orders with pagination
curl http://localhost:3000/api/orders?page=2&limit=20

# Filter by status
curl http://localhost:3000/api/orders?status=pending

# Filter by ID
curl http://localhost:3000/api/orders?id=550e8400-e29b-41d4-a716-446655440000

# Filter by order number
curl http://localhost:3000/api/orders?orderNumber=ORD-1234567890-ABC123
```

## Project Structure

```
commerce-api/
├── src/
│   ├── models/               # Data models/interfaces and Sequelize models
│   │   ├── Product.model.ts
│   │   ├── CartItem.model.ts
│   │   ├── Order.model.ts
│   │   ├── OrderItem.model.ts
│   │   └── index.ts          # Model initialization and associations
│   ├── types/                # TypeScript type helpers
│   │   └── sequelize.ts      # Sequelize type helpers
│   ├── database/
│   │   ├── config.ts         # Sequelize configuration
│   │   └── seeders/          # Database seeders
│   │       └── seed.ts
│   ├── utils/                # Utility functions
│   │   ├── env.ts            # Environment variable validation
│   │   └── response.ts       # Standardized response handlers
│   ├── repositories/
│   │   ├── ProductRepository.ts
│   │   ├── CartRepository.ts
│   │   └── OrderRepository.ts
│   ├── services/
│   │   ├── ProductService.ts
│   │   ├── CartService.ts
│   │   └── OrderService.ts
│   ├── controllers/
│   │   ├── ProductController.ts
│   │   ├── CartController.ts
│   │   └── OrderController.ts
│   ├── validators/
│   │   └── schemas.ts       # Joi validation schemas
│   ├── middleware/
│   │   └── validation.ts    # Validation middleware
│   ├── routes/
│   │   └── index.ts
│   └── index.ts
├── dist/                    # Compiled JavaScript (generated)
├── package.json
├── tsconfig.json
└── README.md
```

## Technologies Used

- **Node.js**: Runtime environment
- **TypeScript**: Type-safe JavaScript
- **Express**: Web framework
- **PostgreSQL**: Relational database
- **Sequelize**: ORM for database operations
- **Joi**: Input validation library
- **CORS**: Cross-origin resource sharing

## License

MIT
