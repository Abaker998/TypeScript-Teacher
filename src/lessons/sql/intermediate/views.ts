import { Lesson } from '@/types/lesson';

export const sqlViews: Lesson = {
  slug: 'sql-views',
  title: 'Views',
  description: 'Create virtual tables with CREATE VIEW, learn about updatable views, materialized views, and when to use views for security and simplification.',
  difficulty: 'intermediate',
  order: 13,
  content: `
# SQL Views

A view is a virtual table based on the result of a SELECT query. Views don't store data themselves - they store the query definition and execute it each time the view is accessed. They're powerful tools for simplifying complex queries, providing security, and creating logical data abstractions.

## Creating Views

\`\`\`sql
-- Basic syntax
CREATE VIEW view_name AS
SELECT columns
FROM tables
WHERE conditions;

-- Example: View of active customers
CREATE VIEW active_customers AS
SELECT id, name, email, last_order_date
FROM customers
WHERE status = 'active';

-- Use the view like a table
SELECT * FROM active_customers;
SELECT name FROM active_customers WHERE last_order_date > '2024-01-01';
\`\`\`

## Why Use Views?

### 1. Simplify Complex Queries

\`\`\`sql
-- Complex query with multiple joins
SELECT
    o.id as order_id,
    c.name as customer_name,
    c.email,
    p.product_name,
    oi.quantity,
    oi.unit_price,
    (oi.quantity * oi.unit_price) as line_total
FROM orders o
JOIN customers c ON o.customer_id = c.id
JOIN order_items oi ON o.id = oi.order_id
JOIN products p ON oi.product_id = p.id;

-- Create a view to hide complexity
CREATE VIEW order_details AS
SELECT
    o.id as order_id,
    c.name as customer_name,
    c.email,
    p.product_name,
    oi.quantity,
    oi.unit_price,
    (oi.quantity * oi.unit_price) as line_total
FROM orders o
JOIN customers c ON o.customer_id = c.id
JOIN order_items oi ON o.id = oi.order_id
JOIN products p ON oi.product_id = p.id;

-- Now use simply
SELECT * FROM order_details WHERE customer_name = 'Alice';
\`\`\`

### 2. Security and Access Control

\`\`\`sql
-- Full employees table has sensitive data
-- employees: id, name, email, salary, ssn, address

-- Create a view that hides sensitive columns
CREATE VIEW employee_directory AS
SELECT id, name, email
FROM employees;

-- Grant access to view, not the table
GRANT SELECT ON employee_directory TO public_users;
-- Users can query employee_directory but not see salary or ssn
\`\`\`

### 3. Logical Data Independence

\`\`\`sql
-- If underlying table structure changes, update the view
-- Applications using the view don't need to change

-- Original table: customers (id, full_name, email)
-- Table changed to: customers (id, first_name, last_name, email)

-- Update view to maintain the same interface
CREATE OR REPLACE VIEW customer_view AS
SELECT
    id,
    CONCAT(first_name, ' ', last_name) as full_name,
    email
FROM customers;

-- Applications using customer_view still work unchanged
\`\`\`

## View Options

### CREATE OR REPLACE

Update an existing view without dropping it first:

\`\`\`sql
-- Creates if doesn't exist, replaces if it does
CREATE OR REPLACE VIEW sales_summary AS
SELECT
    DATE_TRUNC('month', order_date) as month,
    COUNT(*) as order_count,
    SUM(total) as revenue
FROM orders
GROUP BY DATE_TRUNC('month', order_date);
\`\`\`

### WITH CHECK OPTION

Ensures INSERT/UPDATE through the view satisfy the view's WHERE clause:

\`\`\`sql
CREATE VIEW active_products AS
SELECT * FROM products
WHERE active = true
WITH CHECK OPTION;

-- This works
INSERT INTO active_products (name, price, active)
VALUES ('Widget', 29.99, true);

-- This FAILS - violates the WHERE clause
INSERT INTO active_products (name, price, active)
VALUES ('Old Widget', 19.99, false);
-- Error: new row violates check option
\`\`\`

## Updatable Views

Some views can be modified (INSERT, UPDATE, DELETE), and changes affect the underlying table:

\`\`\`sql
-- Simple updatable view
CREATE VIEW california_customers AS
SELECT * FROM customers WHERE state = 'CA';

-- Update through the view
UPDATE california_customers
SET email = 'newemail@example.com'
WHERE id = 123;
-- Actually updates the customers table

-- Delete through the view
DELETE FROM california_customers WHERE id = 456;
-- Actually deletes from customers table
\`\`\`

**Requirements for updatable views:**
- Based on a single table
- Includes the primary key
- No aggregate functions (SUM, COUNT, etc.)
- No DISTINCT, GROUP BY, HAVING
- No subqueries in SELECT
- No UNION, INTERSECT, EXCEPT

\`\`\`sql
-- NOT updatable (has JOIN)
CREATE VIEW order_summary AS
SELECT o.id, c.name
FROM orders o JOIN customers c ON o.customer_id = c.id;

-- NOT updatable (has aggregation)
CREATE VIEW category_totals AS
SELECT category, COUNT(*)
FROM products
GROUP BY category;
\`\`\`

## Dropping Views

\`\`\`sql
-- Remove a view
DROP VIEW view_name;

-- Only drop if exists (no error if missing)
DROP VIEW IF EXISTS view_name;

-- Drop multiple views
DROP VIEW view1, view2, view3;

-- CASCADE drops dependent objects too
DROP VIEW parent_view CASCADE;
\`\`\`

## Materialized Views

Regular views execute their query every time. Materialized views store the query result physically, like a cached snapshot:

\`\`\`sql
-- PostgreSQL syntax
CREATE MATERIALIZED VIEW monthly_sales AS
SELECT
    DATE_TRUNC('month', order_date) as month,
    SUM(total) as revenue,
    COUNT(*) as orders
FROM orders
GROUP BY DATE_TRUNC('month', order_date);

-- Query is instant - reads stored data
SELECT * FROM monthly_sales;

-- Refresh to update the cached data
REFRESH MATERIALIZED VIEW monthly_sales;

-- Refresh concurrently (allows reads during refresh)
REFRESH MATERIALIZED VIEW CONCURRENTLY monthly_sales;
\`\`\`

**When to use materialized views:**
- Complex aggregations that are slow to compute
- Data that doesn't change frequently
- Reports that don't need real-time data
- Data warehouse summary tables

\`\`\`sql
-- Example: Product statistics (expensive to compute)
CREATE MATERIALIZED VIEW product_stats AS
SELECT
    p.id,
    p.name,
    COUNT(r.id) as review_count,
    AVG(r.rating) as avg_rating,
    SUM(oi.quantity) as total_sold
FROM products p
LEFT JOIN reviews r ON p.id = r.product_id
LEFT JOIN order_items oi ON p.id = oi.product_id
GROUP BY p.id, p.name;

-- Create index on materialized view for fast queries
CREATE INDEX idx_product_stats_rating ON product_stats(avg_rating);

-- Schedule refresh (typically via cron or scheduler)
-- REFRESH MATERIALIZED VIEW product_stats;
\`\`\`

**Note:** MySQL doesn't have built-in materialized views. Use regular tables with scheduled refresh queries instead.

## View Metadata

\`\`\`sql
-- PostgreSQL: View definition
SELECT definition FROM pg_views WHERE viewname = 'my_view';

-- MySQL: View information
SHOW CREATE VIEW my_view;

-- List all views
SELECT table_name
FROM information_schema.views
WHERE table_schema = 'public';
\`\`\`

## Common View Patterns

### Row-Level Security View

\`\`\`sql
-- Users see only their own data
CREATE VIEW my_orders AS
SELECT * FROM orders
WHERE customer_id = current_user_id();
-- current_user_id() is a custom function returning logged-in user
\`\`\`

### Calculated Columns View

\`\`\`sql
CREATE VIEW order_totals AS
SELECT
    id,
    order_date,
    subtotal,
    tax_rate,
    (subtotal * tax_rate) as tax_amount,
    (subtotal * (1 + tax_rate)) as total,
    CASE
        WHEN subtotal > 100 THEN 'Large'
        WHEN subtotal > 50 THEN 'Medium'
        ELSE 'Small'
    END as order_size
FROM orders;
\`\`\`

### Denormalized View

\`\`\`sql
-- Combine normalized tables for easy querying
CREATE VIEW product_catalog AS
SELECT
    p.id,
    p.name,
    p.description,
    p.price,
    c.name as category,
    b.name as brand,
    s.quantity as stock_count,
    COALESCE(AVG(r.rating), 0) as avg_rating
FROM products p
JOIN categories c ON p.category_id = c.id
JOIN brands b ON p.brand_id = b.id
LEFT JOIN inventory s ON p.id = s.product_id
LEFT JOIN reviews r ON p.id = r.product_id
GROUP BY p.id, p.name, p.description, p.price, c.name, b.name, s.quantity;
\`\`\`

### Versioned/Historical View

\`\`\`sql
-- Show only current versions from a versioned table
CREATE VIEW current_products AS
SELECT * FROM products
WHERE version_end_date IS NULL;
\`\`\`

## Views vs Subqueries

\`\`\`sql
-- Subquery (inline, one-time use)
SELECT * FROM (
    SELECT customer_id, SUM(total) as total_spent
    FROM orders
    GROUP BY customer_id
) as customer_totals
WHERE total_spent > 1000;

-- View (reusable, named)
CREATE VIEW customer_totals AS
SELECT customer_id, SUM(total) as total_spent
FROM orders
GROUP BY customer_id;

SELECT * FROM customer_totals WHERE total_spent > 1000;
\`\`\`

**Use views when:**
- Query is used in multiple places
- You want to hide complexity from users
- You need access control on the virtual table

**Use subqueries when:**
- Query is used only once
- Logic is specific to that one query
- You don't want to create database objects

## Quick Reference

| Feature | Regular View | Materialized View |
|---------|--------------|-------------------|
| Data Storage | No (query stored) | Yes (result stored) |
| Query Speed | Depends on complexity | Fast (reads cached data) |
| Data Freshness | Always current | Snapshot (needs refresh) |
| Updates | Some are updatable | Not updatable |
| Use Case | Simplification, security | Performance, reporting |
`,
  exercises: [
    {
      id: 1,
      title: 'Exercise 1: Create a Basic View',
      description: `Create a view that simplifies access to customer order information.

**Given Tables:**
- \`customers\`: id, name, email
- \`orders\`: id, customer_id, order_date, total

**Your Task:**
Create a view called \`customer_orders\` that shows customer name, email, order_id, order_date, and total.

**Then:** Query the view to show all orders.`,
      starterCode: `-- Create the customer_orders view
-- Join customers and orders tables


-- Query the view to verify it works
`,
      solution: `CREATE VIEW customer_orders AS
SELECT
    c.name as customer_name,
    c.email,
    o.id as order_id,
    o.order_date,
    o.total
FROM customers c
JOIN orders o ON c.id = o.customer_id;

SELECT * FROM customer_orders ORDER BY order_date DESC;`,
      expectedOutput: ['View created successfully', 'customer_name | email | order_id | order_date | total'],
      hints: [
        'Use CREATE VIEW view_name AS followed by your SELECT',
        'Join customers and orders on customer_id',
        'Select columns from both tables with clear aliases',
        'After creating, query with SELECT * FROM customer_orders'
      ]
    },
    {
      id: 2,
      title: 'Exercise 2: Security View',
      description: `Create a view that hides sensitive employee information.

**Given Table:**
- \`employees\`: id, name, email, department, salary, ssn

**Your Task:**
Create a view called \`employee_public\` that shows only id, name, email, and department (hiding salary and ssn).

**Then:** Query the view.`,
      starterCode: `-- Create a view that hides sensitive columns
-- Only expose: id, name, email, department


-- Query the public view
`,
      solution: `CREATE VIEW employee_public AS
SELECT id, name, email, department
FROM employees;

SELECT * FROM employee_public ORDER BY name;`,
      expectedOutput: ['View created successfully', 'id | name | email | department'],
      hints: [
        'Simply SELECT only the columns you want to expose',
        'Omit salary and ssn from the SELECT list',
        'The view acts as a filter for sensitive data',
        'Users granted access to this view cannot see hidden columns'
      ]
    },
    {
      id: 3,
      title: 'Exercise 3: Calculated View',
      description: `Create a view that adds calculated columns to order data.

**Given Table:**
- \`orders\`: id, customer_id, subtotal, tax_rate, order_date

**Your Task:**
Create a view called \`order_totals\` that includes:
- All original columns
- tax_amount (subtotal * tax_rate)
- total (subtotal + tax_amount)

**Then:** Query orders with total > 100.`,
      starterCode: `-- Create a view with calculated columns
-- Add tax_amount and total calculations


-- Query orders with total > 100
`,
      solution: `CREATE VIEW order_totals AS
SELECT
    id,
    customer_id,
    subtotal,
    tax_rate,
    (subtotal * tax_rate) as tax_amount,
    (subtotal * (1 + tax_rate)) as total,
    order_date
FROM orders;

SELECT * FROM order_totals WHERE total > 100 ORDER BY total DESC;`,
      expectedOutput: ['View created successfully', 'id | customer_id | subtotal | tax_rate | tax_amount | total | order_date'],
      hints: [
        'Include all original columns in your SELECT',
        'Add calculated columns with expressions and aliases',
        'tax_amount = subtotal * tax_rate',
        'total = subtotal * (1 + tax_rate) or subtotal + tax_amount'
      ]
    },
    {
      id: 4,
      title: 'Exercise 4: Replace and Drop View',
      description: `Modify an existing view and then clean up.

**Given:** A view \`product_summary\` already exists showing product name and price.

**Your Task:**
1. Use CREATE OR REPLACE to update the view to also include the category
2. Query the updated view
3. Drop the view`,
      starterCode: `-- Existing view shows: name, price
-- Update it to also show category

-- CREATE OR REPLACE VIEW product_summary AS ...


-- Query the updated view


-- Drop the view when done
`,
      solution: `CREATE OR REPLACE VIEW product_summary AS
SELECT
    p.name,
    p.price,
    c.name as category
FROM products p
JOIN categories c ON p.category_id = c.id;

SELECT * FROM product_summary ORDER BY category, name;

DROP VIEW IF EXISTS product_summary;`,
      expectedOutput: ['View replaced successfully', 'name | price | category', 'View dropped successfully'],
      hints: [
        'CREATE OR REPLACE updates existing views without dropping first',
        'Add a JOIN to categories to get the category name',
        'Use DROP VIEW IF EXISTS to safely remove the view',
        'IF EXISTS prevents errors if the view was already dropped'
      ]
    }
  ],
  quiz: [
    {
      question: 'What is a SQL view?',
      options: [
        'A physical copy of table data',
        'A virtual table based on a stored query',
        'A backup of a database',
        'A type of index'
      ],
      correctIndex: 1,
      explanation: 'A view is a virtual table that stores a query definition, not data. Each time you query a view, it executes the underlying query and returns the results.'
    },
    {
      question: 'What is the main benefit of a materialized view over a regular view?',
      options: [
        'It can join more tables',
        'It stores query results for faster access',
        'It uses less disk space',
        'It automatically updates in real-time'
      ],
      correctIndex: 1,
      explanation: 'Materialized views store the query results physically, making subsequent queries very fast. However, the data is a snapshot and needs to be refreshed to stay current.'
    },
    {
      question: 'Which view feature ensures that modifications through the view satisfy the view\'s WHERE clause?',
      options: [
        'WITH SECURITY',
        'WITH CHECK OPTION',
        'WITH VALIDATION',
        'WITH CONSTRAINT'
      ],
      correctIndex: 1,
      explanation: 'WITH CHECK OPTION ensures that any INSERT or UPDATE through the view must satisfy the view\'s WHERE clause. This prevents inserting rows that wouldn\'t be visible through the view.'
    },
    {
      question: 'Which type of view is NOT updatable?',
      options: [
        'A view on a single table with all columns',
        'A view with a simple WHERE clause',
        'A view with GROUP BY and aggregate functions',
        'A view with a column alias'
      ],
      correctIndex: 2,
      explanation: 'Views with GROUP BY, aggregate functions (SUM, COUNT, etc.), DISTINCT, joins, or subqueries are not updatable. Updatable views must be simple queries on a single table.'
    }
  ],
  buildNote: {
    title: 'Views in Application Architecture',
    explanation: `Views provide a clean abstraction layer between your application and the database schema. In this learning app, a view like \`lesson_progress_summary\` could combine lessons, exercises, and user progress into a single queryable entity: SELECT l.title, COUNT(DISTINCT e.id) as exercises, COUNT(p.exercise_id) as completed FROM lessons l LEFT JOIN exercises e ON l.id = e.lesson_id LEFT JOIN progress p ON e.id = p.exercise_id GROUP BY l.id. This simplifies application code - instead of complex joins in every query, the app just selects from the view.`,
    relatedFiles: [
      'src/lib/lessons.ts',
      'src/lib/progress.ts'
    ],
    inTheRealWorld: `Enterprise applications rely heavily on views. Banking systems use views to present account data without exposing internal account structures. Healthcare systems use views to control access to patient records based on user roles. Data warehouses use materialized views for pre-computed aggregations that would take too long to calculate on the fly. API backends often query views rather than tables, allowing DBAs to change the underlying schema without breaking the API. Multi-tenant SaaS platforms use views with row-level security to automatically filter data by tenant.`
  }
};
