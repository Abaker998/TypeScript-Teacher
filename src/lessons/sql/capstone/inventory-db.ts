import { Lesson } from '@/types/lesson';

export const inventoryDbCapstone: Lesson = {
  slug: 'sql-inventory-db-capstone',
  title: 'Capstone: Inventory Management Database',
  description: 'Apply everything you\'ve learned by designing and building a complete inventory management database system.',
  difficulty: 'master',
  order: 29,
  content: `
# Capstone Project: Inventory Management Database

Congratulations on making it this far! In this capstone project, you'll apply everything you've learned to design and implement a comprehensive inventory management database system from scratch.

## What You'll Build

A complete inventory management system that demonstrates:
- **Database Design** - Normalized schema with proper relationships
- **Constraints** - Primary keys, foreign keys, unique constraints, check constraints
- **Complex Queries** - JOINs, subqueries, aggregations for business operations
- **Views** - Simplified interfaces for common data access patterns
- **Stored Procedures** - Encapsulated business logic for inventory operations

## System Requirements

Your inventory system will manage:
- **Products** - Items available for sale with pricing and descriptions
- **Categories** - Hierarchical product categorization
- **Suppliers** - Vendor information for procurement
- **Inventory Levels** - Stock quantities at different warehouses
- **Transactions** - Purchase orders, sales, and inventory adjustments

## Project Overview

You'll build your inventory database in 6 steps:

| Step | Focus | Concepts Used |
|------|-------|---------------|
| 1 | Design Schema | Tables, columns, data types |
| 2 | Add Constraints | PK, FK, UNIQUE, CHECK, NOT NULL |
| 3 | Create Relationships | Foreign keys, junction tables |
| 4 | Write Core Queries | JOINs, aggregations, subqueries |
| 5 | Build Views | Simplified data access |
| 6 | Create Procedures | Business logic encapsulation |

## Tips for Success

- **Think about relationships** - How do entities connect?
- **Plan for queries** - What questions will users need to answer?
- **Consider constraints** - What rules keep data valid?
- **Test incrementally** - Verify each step before moving on

Let's start building!
`,
  exercises: [
    {
      id: 1,
      title: 'Step 1: Create Core Tables',
      description: `Design and create the core tables for the inventory system.

**Your task:**
Create the following tables with appropriate data types:

1. **categories** table:
   - id (primary key, auto-increment)
   - name (unique, not null, max 100 chars)
   - description (text, nullable)
   - parent_id (self-reference for hierarchy, nullable)

2. **suppliers** table:
   - id (primary key, auto-increment)
   - name (not null, max 200 chars)
   - contact_email (unique, not null)
   - phone (max 20 chars)
   - address (text)

3. **products** table:
   - id (primary key, auto-increment)
   - sku (unique, not null, max 50 chars)
   - name (not null, max 200 chars)
   - description (text)
   - category_id (foreign key to categories)
   - supplier_id (foreign key to suppliers)
   - unit_price (decimal 10,2, not null, must be >= 0)
   - created_at (timestamp, default current)

**Print a confirmation message when done.**`,
      starterCode: `-- Create categories table with self-referencing hierarchy


-- Create suppliers table


-- Create products table with foreign keys


-- Confirm creation
SELECT 'Tables created successfully' AS status;`,
      solution: `-- Categories with self-referencing hierarchy
CREATE TABLE categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  parent_id INT,
  FOREIGN KEY (parent_id) REFERENCES categories(id)
);

-- Suppliers
CREATE TABLE suppliers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(200) NOT NULL,
  contact_email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(20),
  address TEXT
);

-- Products with foreign keys
CREATE TABLE products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  sku VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  category_id INT,
  supplier_id INT,
  unit_price DECIMAL(10,2) NOT NULL CHECK (unit_price >= 0),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id),
  FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
);

SELECT 'Tables created successfully' AS status;`,
      expectedOutput: ['Tables created successfully'],
      hints: [
        'Use INT PRIMARY KEY AUTO_INCREMENT for auto-generated IDs',
        'VARCHAR(n) for strings with maximum length, TEXT for unlimited',
        'DECIMAL(10,2) stores numbers with 2 decimal places',
        'FOREIGN KEY (col) REFERENCES table(col) creates the relationship'
      ]
    },
    {
      id: 2,
      title: 'Step 2: Create Inventory and Transaction Tables',
      description: `Add tables for tracking inventory levels and recording transactions.

**Your task:**
Create these additional tables:

1. **warehouses** table:
   - id (primary key)
   - name (unique, not null)
   - location (not null)

2. **inventory** table (tracks stock at each warehouse):
   - id (primary key)
   - product_id (foreign key)
   - warehouse_id (foreign key)
   - quantity (integer, not null, must be >= 0)
   - last_updated (timestamp)
   - UNIQUE constraint on (product_id, warehouse_id) combination

3. **transactions** table (purchase orders, sales, adjustments):
   - id (primary key)
   - transaction_type ENUM('purchase', 'sale', 'adjustment')
   - product_id (foreign key)
   - warehouse_id (foreign key)
   - quantity (integer, not null) - positive for in, negative for out
   - unit_price (decimal, for sales/purchases)
   - transaction_date (timestamp, default current)
   - notes (text, nullable)

**Insert sample warehouses for testing.**`,
      starterCode: `-- Create warehouses table


-- Create inventory table with unique constraint


-- Create transactions table with ENUM


-- Insert sample warehouses


-- Confirm creation
SELECT 'Inventory tables created' AS status;`,
      solution: `-- Warehouses
CREATE TABLE warehouses (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL UNIQUE,
  location VARCHAR(200) NOT NULL
);

-- Inventory levels per warehouse
CREATE TABLE inventory (
  id INT PRIMARY KEY AUTO_INCREMENT,
  product_id INT NOT NULL,
  warehouse_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 0 CHECK (quantity >= 0),
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id),
  FOREIGN KEY (warehouse_id) REFERENCES warehouses(id),
  UNIQUE KEY unique_product_warehouse (product_id, warehouse_id)
);

-- Transaction log
CREATE TABLE transactions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  transaction_type ENUM('purchase', 'sale', 'adjustment') NOT NULL,
  product_id INT NOT NULL,
  warehouse_id INT NOT NULL,
  quantity INT NOT NULL,
  unit_price DECIMAL(10,2),
  transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  notes TEXT,
  FOREIGN KEY (product_id) REFERENCES products(id),
  FOREIGN KEY (warehouse_id) REFERENCES warehouses(id)
);

-- Sample warehouses
INSERT INTO warehouses (name, location) VALUES
  ('Main Warehouse', 'New York, NY'),
  ('West Coast DC', 'Los Angeles, CA'),
  ('Central Hub', 'Chicago, IL');

SELECT 'Inventory tables created' AS status;`,
      expectedOutput: ['Inventory tables created'],
      hints: [
        'Use UNIQUE KEY name (col1, col2) for composite unique constraint',
        'ENUM(\'val1\', \'val2\') restricts to specific values',
        'CHECK (quantity >= 0) prevents negative stock',
        'ON UPDATE CURRENT_TIMESTAMP auto-updates the timestamp'
      ]
    },
    {
      id: 3,
      title: 'Step 3: Populate with Sample Data',
      description: `Insert sample data to test your schema with realistic scenarios.

**Your task:**
Insert the following sample data:

1. **Categories** (with hierarchy):
   - Electronics (parent: NULL)
     - Computers (parent: Electronics)
     - Phones (parent: Electronics)
   - Office Supplies (parent: NULL)

2. **Suppliers**:
   - TechCorp (tech@techcorp.com)
   - OfficeMax (sales@officemax.com)

3. **Products**:
   - Laptop (SKU: ELEC-001, Electronics/Computers, TechCorp, $999.99)
   - Smartphone (SKU: ELEC-002, Electronics/Phones, TechCorp, $699.99)
   - Desk Chair (SKU: OFF-001, Office Supplies, OfficeMax, $249.99)

4. **Initial Inventory** (at Main Warehouse):
   - Laptop: 50 units
   - Smartphone: 100 units
   - Desk Chair: 30 units

**Verify with a SELECT that shows product names with their categories.**`,
      starterCode: `-- Insert categories with hierarchy


-- Insert suppliers


-- Insert products (need category and supplier IDs)


-- Insert initial inventory


-- Verify: Show products with categories
SELECT p.name, c.name AS category, p.unit_price
FROM products p
JOIN categories c ON p.category_id = c.id
ORDER BY p.name;`,
      solution: `-- Categories with hierarchy
INSERT INTO categories (name, description, parent_id) VALUES
  ('Electronics', 'Electronic devices and accessories', NULL),
  ('Office Supplies', 'Office furniture and supplies', NULL);

INSERT INTO categories (name, description, parent_id) VALUES
  ('Computers', 'Desktop and laptop computers', 1),
  ('Phones', 'Smartphones and accessories', 1);

-- Suppliers
INSERT INTO suppliers (name, contact_email, phone, address) VALUES
  ('TechCorp', 'tech@techcorp.com', '555-0100', '123 Tech Blvd, San Jose, CA'),
  ('OfficeMax', 'sales@officemax.com', '555-0200', '456 Office Park, Dallas, TX');

-- Products
INSERT INTO products (sku, name, description, category_id, supplier_id, unit_price) VALUES
  ('ELEC-001', 'Laptop', 'High-performance business laptop', 3, 1, 999.99),
  ('ELEC-002', 'Smartphone', 'Latest model smartphone', 4, 1, 699.99),
  ('OFF-001', 'Desk Chair', 'Ergonomic office chair', 2, 2, 249.99);

-- Initial inventory at Main Warehouse (id=1)
INSERT INTO inventory (product_id, warehouse_id, quantity) VALUES
  (1, 1, 50),  -- Laptop
  (2, 1, 100), -- Smartphone
  (3, 1, 30);  -- Desk Chair

-- Verify
SELECT p.name, c.name AS category, p.unit_price
FROM products p
JOIN categories c ON p.category_id = c.id
ORDER BY p.name;`,
      expectedOutput: [
        'Desk Chair | Office Supplies | 249.99',
        'Laptop | Computers | 999.99',
        'Smartphone | Phones | 699.99'
      ],
      hints: [
        'Insert parent categories first to get their IDs',
        'Reference the parent IDs when inserting child categories',
        'Use the same approach for products - categories and suppliers first',
        'Verify IDs match when inserting inventory records'
      ]
    },
    {
      id: 4,
      title: 'Step 4: Write Business Queries',
      description: `Write essential queries for inventory management operations.

**Your task:**
Create queries for common business operations:

1. **Low Stock Alert** - Find products with quantity below 40 at any warehouse
   - Show: product name, warehouse name, current quantity
   - Order by quantity ascending

2. **Inventory Valuation** - Calculate total value at each warehouse
   - Total value = SUM(quantity * unit_price)
   - Show: warehouse name, total units, total value
   - Group by warehouse

3. **Category Sales Potential** - Products by category with total available stock
   - Show: category name, product count, total units across all warehouses
   - Include categories with no products (use LEFT JOIN)
   - Order by total units descending

**Run all three queries and show results.**`,
      starterCode: `-- Query 1: Low Stock Alert (quantity < 40)


-- Query 2: Inventory Valuation per Warehouse


-- Query 3: Category Summary with Stock Levels

`,
      solution: `-- Query 1: Low Stock Alert
SELECT p.name AS product,
       w.name AS warehouse,
       i.quantity
FROM inventory i
JOIN products p ON i.product_id = p.id
JOIN warehouses w ON i.warehouse_id = w.id
WHERE i.quantity < 40
ORDER BY i.quantity ASC;

-- Query 2: Inventory Valuation per Warehouse
SELECT w.name AS warehouse,
       SUM(i.quantity) AS total_units,
       SUM(i.quantity * p.unit_price) AS total_value
FROM warehouses w
LEFT JOIN inventory i ON w.id = i.warehouse_id
LEFT JOIN products p ON i.product_id = p.id
GROUP BY w.id, w.name
ORDER BY total_value DESC;

-- Query 3: Category Summary
SELECT c.name AS category,
       COUNT(DISTINCT p.id) AS product_count,
       COALESCE(SUM(i.quantity), 0) AS total_stock
FROM categories c
LEFT JOIN products p ON c.id = p.category_id
LEFT JOIN inventory i ON p.id = i.product_id
GROUP BY c.id, c.name
ORDER BY total_stock DESC;`,
      expectedOutput: [
        'Desk Chair | Main Warehouse | 30',
        '---',
        'Main Warehouse | 180 | 124997.00',
        '---',
        'Phones | 1 | 100',
        'Computers | 1 | 50',
        'Office Supplies | 1 | 30',
        'Electronics | 0 | 0'
      ],
      hints: [
        'Low stock uses WHERE i.quantity < threshold',
        'Valuation needs JOINs to get both quantity and price',
        'Use LEFT JOIN to include warehouses/categories with no inventory',
        'COALESCE handles NULL values in aggregations'
      ]
    },
    {
      id: 5,
      title: 'Step 5: Create Views for Common Access',
      description: `Create views to simplify access to frequently-needed data.

**Your task:**
Create these views:

1. **v_product_details** - Complete product information:
   - Product: id, sku, name, unit_price
   - Category name, Supplier name
   - Total quantity across all warehouses

2. **v_inventory_status** - Current inventory snapshot:
   - Product name, SKU
   - Warehouse name
   - Quantity
   - Stock value (quantity * unit_price)
   - Stock level ('Low' if < 25, 'Medium' if < 75, 'High' otherwise)

3. **v_warehouse_summary** - Dashboard view per warehouse:
   - Warehouse name, location
   - Product count
   - Total units
   - Total value
   - Last activity (most recent inventory update)

**Query each view to demonstrate they work correctly.**`,
      starterCode: `-- View 1: Product Details with Category and Supplier


-- View 2: Inventory Status with Stock Level indicator


-- View 3: Warehouse Summary Dashboard


-- Test the views
SELECT * FROM v_product_details;`,
      solution: `-- View 1: Product Details
CREATE VIEW v_product_details AS
SELECT p.id,
       p.sku,
       p.name,
       p.unit_price,
       c.name AS category,
       s.name AS supplier,
       COALESCE(SUM(i.quantity), 0) AS total_stock
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN suppliers s ON p.supplier_id = s.id
LEFT JOIN inventory i ON p.id = i.product_id
GROUP BY p.id, p.sku, p.name, p.unit_price, c.name, s.name;

-- View 2: Inventory Status
CREATE VIEW v_inventory_status AS
SELECT p.name AS product,
       p.sku,
       w.name AS warehouse,
       i.quantity,
       (i.quantity * p.unit_price) AS stock_value,
       CASE
         WHEN i.quantity < 25 THEN 'Low'
         WHEN i.quantity < 75 THEN 'Medium'
         ELSE 'High'
       END AS stock_level
FROM inventory i
JOIN products p ON i.product_id = p.id
JOIN warehouses w ON i.warehouse_id = w.id;

-- View 3: Warehouse Summary
CREATE VIEW v_warehouse_summary AS
SELECT w.name AS warehouse,
       w.location,
       COUNT(DISTINCT i.product_id) AS product_count,
       COALESCE(SUM(i.quantity), 0) AS total_units,
       COALESCE(SUM(i.quantity * p.unit_price), 0) AS total_value,
       MAX(i.last_updated) AS last_activity
FROM warehouses w
LEFT JOIN inventory i ON w.id = i.warehouse_id
LEFT JOIN products p ON i.product_id = p.id
GROUP BY w.id, w.name, w.location;

-- Test views
SELECT * FROM v_product_details;`,
      expectedOutput: [
        '1 | ELEC-001 | Laptop | 999.99 | Computers | TechCorp | 50',
        '2 | ELEC-002 | Smartphone | 699.99 | Phones | TechCorp | 100',
        '3 | OFF-001 | Desk Chair | 249.99 | Office Supplies | OfficeMax | 30'
      ],
      hints: [
        'CREATE VIEW view_name AS SELECT ...',
        'Use CASE WHEN for conditional columns like stock_level',
        'LEFT JOINs ensure rows appear even without inventory',
        'GROUP BY in views for aggregated data'
      ]
    },
    {
      id: 6,
      title: 'Step 6: Create Stored Procedures',
      description: `Create stored procedures to encapsulate critical business operations.

**Your task:**
Create these stored procedures:

1. **sp_record_purchase** (product_id, warehouse_id, quantity, unit_cost):
   - Insert a 'purchase' transaction
   - Update inventory (increase quantity)
   - If product doesn't exist in warehouse, create inventory record
   - Use transaction for atomicity

2. **sp_record_sale** (product_id, warehouse_id, quantity, sale_price):
   - Verify sufficient inventory exists
   - Insert a 'sale' transaction (quantity as negative)
   - Update inventory (decrease quantity)
   - Return error if insufficient stock

3. **sp_transfer_inventory** (product_id, from_warehouse, to_warehouse, quantity):
   - Verify source has sufficient stock
   - Record adjustment transaction at source (negative)
   - Record adjustment transaction at destination (positive)
   - Update both inventory records
   - All in a single transaction

**Test sp_record_purchase to add 20 laptops.**`,
      starterCode: `-- Procedure 1: Record Purchase
DELIMITER //
CREATE PROCEDURE sp_record_purchase(
  IN p_product_id INT,
  IN p_warehouse_id INT,
  IN p_quantity INT,
  IN p_unit_cost DECIMAL(10,2)
)
BEGIN
  -- Your implementation here
END //
DELIMITER ;

-- Procedure 2: Record Sale


-- Procedure 3: Transfer Inventory


-- Test: Add 20 laptops to Main Warehouse
CALL sp_record_purchase(1, 1, 20, 750.00);

-- Verify
SELECT * FROM v_inventory_status WHERE product = 'Laptop';`,
      solution: `-- Procedure 1: Record Purchase
DELIMITER //
CREATE PROCEDURE sp_record_purchase(
  IN p_product_id INT,
  IN p_warehouse_id INT,
  IN p_quantity INT,
  IN p_unit_cost DECIMAL(10,2)
)
BEGIN
  START TRANSACTION;

  -- Record the transaction
  INSERT INTO transactions (transaction_type, product_id, warehouse_id, quantity, unit_price, notes)
  VALUES ('purchase', p_product_id, p_warehouse_id, p_quantity, p_unit_cost, 'Purchase order');

  -- Update or insert inventory
  INSERT INTO inventory (product_id, warehouse_id, quantity)
  VALUES (p_product_id, p_warehouse_id, p_quantity)
  ON DUPLICATE KEY UPDATE quantity = quantity + p_quantity;

  COMMIT;
END //
DELIMITER ;

-- Procedure 2: Record Sale
DELIMITER //
CREATE PROCEDURE sp_record_sale(
  IN p_product_id INT,
  IN p_warehouse_id INT,
  IN p_quantity INT,
  IN p_sale_price DECIMAL(10,2)
)
BEGIN
  DECLARE current_qty INT;

  -- Check current inventory
  SELECT quantity INTO current_qty
  FROM inventory
  WHERE product_id = p_product_id AND warehouse_id = p_warehouse_id;

  IF current_qty IS NULL OR current_qty < p_quantity THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Insufficient inventory';
  ELSE
    START TRANSACTION;

    -- Record sale transaction
    INSERT INTO transactions (transaction_type, product_id, warehouse_id, quantity, unit_price, notes)
    VALUES ('sale', p_product_id, p_warehouse_id, -p_quantity, p_sale_price, 'Sales order');

    -- Update inventory
    UPDATE inventory
    SET quantity = quantity - p_quantity
    WHERE product_id = p_product_id AND warehouse_id = p_warehouse_id;

    COMMIT;
  END IF;
END //
DELIMITER ;

-- Procedure 3: Transfer Inventory
DELIMITER //
CREATE PROCEDURE sp_transfer_inventory(
  IN p_product_id INT,
  IN p_from_warehouse INT,
  IN p_to_warehouse INT,
  IN p_quantity INT
)
BEGIN
  DECLARE source_qty INT;

  SELECT quantity INTO source_qty
  FROM inventory
  WHERE product_id = p_product_id AND warehouse_id = p_from_warehouse;

  IF source_qty IS NULL OR source_qty < p_quantity THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Insufficient inventory at source';
  ELSE
    START TRANSACTION;

    -- Decrease source
    UPDATE inventory SET quantity = quantity - p_quantity
    WHERE product_id = p_product_id AND warehouse_id = p_from_warehouse;

    -- Increase destination (or create if not exists)
    INSERT INTO inventory (product_id, warehouse_id, quantity)
    VALUES (p_product_id, p_to_warehouse, p_quantity)
    ON DUPLICATE KEY UPDATE quantity = quantity + p_quantity;

    -- Log both adjustments
    INSERT INTO transactions (transaction_type, product_id, warehouse_id, quantity, notes)
    VALUES ('adjustment', p_product_id, p_from_warehouse, -p_quantity, 'Transfer out');

    INSERT INTO transactions (transaction_type, product_id, warehouse_id, quantity, notes)
    VALUES ('adjustment', p_product_id, p_to_warehouse, p_quantity, 'Transfer in');

    COMMIT;
  END IF;
END //
DELIMITER ;

-- Test: Add 20 laptops
CALL sp_record_purchase(1, 1, 20, 750.00);

SELECT * FROM v_inventory_status WHERE product = 'Laptop';`,
      expectedOutput: [
        'Laptop | ELEC-001 | Main Warehouse | 70 | 69999.30 | Medium'
      ],
      hints: [
        'DELIMITER changes statement terminator for multi-statement procedures',
        'DECLARE for local variables inside procedures',
        'SIGNAL SQLSTATE raises custom errors',
        'ON DUPLICATE KEY UPDATE handles upsert logic'
      ]
    }
  ],
  buildNote: {
    title: 'Real-World Inventory Systems',
    explanation: `This capstone project mirrors how real inventory management systems are built. Companies like Amazon, Walmart, and Target use similar database designs to track millions of products across thousands of warehouses. The hierarchical categories support complex product taxonomies. Foreign keys ensure referential integrity - you can't have inventory for non-existent products. Views simplify reporting and dashboards. Stored procedures encapsulate critical operations like sales and transfers, ensuring business rules are enforced consistently. The transaction patterns prevent partial updates that could corrupt inventory counts.`,
    relatedFiles: [
      'src/lessons/sql/capstone/inventory-db.ts',
      'src/lessons/sql/intermediate/constraints.ts',
      'src/lessons/sql/intermediate/stored-procedures.ts',
      'src/lessons/sql/advanced/database-design.ts'
    ],
    inTheRealWorld: `Inventory management is one of the most common database applications. ERP systems like SAP, Oracle, and Microsoft Dynamics are built around similar schemas. E-commerce platforms require real-time inventory tracking to prevent overselling. Warehouse management systems (WMS) use these patterns for pick/pack/ship operations. Financial auditing requires transaction logs for accountability. Understanding these patterns prepares you for roles in retail technology, supply chain systems, and enterprise software development.`
  },
  quiz: [
    {
      question: 'Why use a self-referencing foreign key for category hierarchy?',
      options: [
        'It\'s faster than separate tables',
        'It allows unlimited nesting depth with a single table',
        'It prevents duplicate categories',
        'It\'s required by SQL standards'
      ],
      correctIndex: 1,
      explanation: 'Self-referencing (parent_id referencing the same table\'s id) allows any depth of hierarchy in one table. A category can be a child of another category, which can be a child of another, without requiring multiple tables.'
    },
    {
      question: 'Why have a unique constraint on (product_id, warehouse_id) in the inventory table?',
      options: [
        'To make queries faster',
        'To ensure each product appears only once per warehouse',
        'To allow NULL values',
        'To create an index'
      ],
      correctIndex: 1,
      explanation: 'The composite unique constraint ensures there\'s only one inventory record per product-warehouse combination. Without it, you could have multiple records for the same product in the same warehouse, causing confusion.'
    },
    {
      question: 'Why use CHECK (quantity >= 0) on inventory?',
      options: [
        'To improve query performance',
        'To prevent negative inventory counts (overselling)',
        'To allow zero values',
        'To enable auto-increment'
      ],
      correctIndex: 1,
      explanation: 'Negative inventory doesn\'t make sense in most systems - you can\'t have -10 laptops. The CHECK constraint enforces this at the database level, catching errors that application code might miss.'
    },
    {
      question: 'Why record transactions instead of just updating inventory?',
      options: [
        'Transactions are faster',
        'For audit trail, history, and reconciliation',
        'To save storage space',
        'SQL requires transaction records'
      ],
      correctIndex: 1,
      explanation: 'Transaction records provide audit trail (who changed what, when), enable historical analysis (what sold last month), and allow reconciliation (inventory count vs. sum of transactions). This is essential for accounting and compliance.'
    }
  ]
};
