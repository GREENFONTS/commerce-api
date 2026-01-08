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
- **Description**: Retrieve all available products
- **Response**: Array of product objects
  ```json
  [
    {
      "id": "prod_...",
      "name": "Laptop",
      "description": "High-performance laptop",
      "price": 999.99,
      "stock": 10,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
  ```

### Cart

#### Get Cart Items
- **GET** `/api/cart`
- **Description**: Retrieve all items in the cart
- **Response**: Array of cart item objects
  ```json
  [
    {
      "id": "cart_...",
      "productId": "prod_...",
      "quantity": 2,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
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
- **Response**: Created cart item object
- **Error**: Returns 400 if validation fails or quantity exceeds available stock

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
- **Response**: Updated cart item object
- **Error**: Returns 400 if validation fails or quantity exceeds available stock

#### Remove Item from Cart
- **DELETE** `/api/cart/:id`
- **Description**: Remove an item from the cart
- **URL Parameters**: `id` - Cart item ID
- **Response**: 204 No Content

### Orders

#### Get All Orders
- **GET** `/api/orders`
- **Description**: Retrieve all orders
- **Response**: Array of order objects
  ```json
  [
    {
      "id": "order_...",
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
  ]
  ```

#### Checkout
- **POST** `/api/checkout`
- **Description**: Process checkout and create an order
- **Response**: Created order object
- **Business Logic**:
  - Validates all cart items have sufficient stock
  - Reduces product stock for each item
  - Creates order with calculated totals
  - Clears the cart automatically
- **Error**: Returns 400 if cart is empty or stock is insufficient

## Business Rules

1. **Stock Validation**: Users cannot add or update cart items to exceed available product stock
2. **Stock Reduction**: Product stock is automatically reduced when an order is placed
3. **Cart Clearing**: The cart is automatically cleared after a successful checkout

## Example Usage

### 1. Get all products
```bash
curl http://localhost:3000/api/products
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

### 6. Get all orders
```bash
curl http://localhost:3000/api/orders
```

## Project Structure

```
commerce-api/
├── src/
│   ├── models/
│   │   ├── Product.ts
│   │   ├── CartItem.ts
│   │   ├── Order.ts
│   │   └── OrderItem.ts
│   ├── database/
│   │   ├── config.ts         # Sequelize configuration
│   │   └── seeders/          # Database seeders
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
