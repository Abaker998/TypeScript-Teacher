import { Lesson } from '@/types/lesson';

export const sqlIndexes: Lesson = {
  slug: 'sql-indexes',
  title: 'Indexes',
  description: 'Optimize query performance with CREATE INDEX, understand different index types, composite indexes, and when to use indexes effectively.',
  difficulty: 'intermediate',
  order: 14,
  content: `
# SQL Indexes

Indexes are special data structures that speed up data retrieval. Like an index in a book, database indexes help find data without scanning every row. Proper indexing is crucial for database performance.

## How Indexes Work

Without an index, the database performs a **full table scan** - checking every row:

\`\`\`sql
-- Without index on email column
SELECT * FROM users WHERE email = 'alice@example.com';
-- Database scans ALL rows to find matches (slow for large tables)
\`\`\`

With an index, the database uses a data structure (usually a B-tree) to jump directly to matching rows:

\`\`\`sql
-- With index on email column
CREATE INDEX idx_users_email ON users(email);

SELECT * FROM users WHERE email = 'alice@example.com';
-- Database uses index to find row instantly (fast)
\`\`\`

## Creating Indexes

\`\`\`sql
-- Basic syntax
CREATE INDEX index_name ON table_name(column_name);

-- Create index on single column
CREATE INDEX idx_customers_email ON customers(email);

-- Create index on multiple columns (composite index)
CREATE INDEX idx_orders_customer_date ON orders(customer_id, order_date);

-- Create unique index (enforces uniqueness like a constraint)
CREATE UNIQUE INDEX idx_users_email ON users(email);
\`\`\`

## Index Naming Conventions

\`\`\`sql
-- Common convention: idx_tablename_columnname
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_orders_customer ON orders(customer_id);

-- For composite indexes: idx_tablename_col1_col2
CREATE INDEX idx_orders_customer_date ON orders(customer_id, order_date);

-- Indicate index type in name
CREATE INDEX idx_products_name_btree ON products(name);
CREATE INDEX idx_products_description_gin ON products USING gin(description);
\`\`\`

## Types of Indexes

### B-tree Index (Default)

The most common index type. Good for equality and range queries:

\`\`\`sql
-- Default B-tree index
CREATE INDEX idx_products_price ON products(price);

-- Efficient for:
SELECT * FROM products WHERE price = 29.99;      -- Equality
SELECT * FROM products WHERE price > 100;        -- Greater than
SELECT * FROM products WHERE price BETWEEN 10 AND 50;  -- Range
SELECT * FROM products ORDER BY price;           -- Sorting
\`\`\`

### Hash Index

Good for equality comparisons only (not ranges):

\`\`\`sql
-- PostgreSQL hash index
CREATE INDEX idx_users_email_hash ON users USING hash(email);

-- Efficient for:
SELECT * FROM users WHERE email = 'alice@example.com';

-- NOT efficient for:
SELECT * FROM users WHERE email LIKE 'alice%';  -- Won't use hash index
\`\`\`

### Full-Text Index

For searching text content:

\`\`\`sql
-- MySQL full-text index
CREATE FULLTEXT INDEX idx_articles_content ON articles(title, content);

SELECT * FROM articles
WHERE MATCH(title, content) AGAINST('database performance');

-- PostgreSQL GIN index for full-text
CREATE INDEX idx_articles_search ON articles USING gin(to_tsvector('english', content));
\`\`\`

### Partial Index (PostgreSQL)

Index only a subset of rows:

\`\`\`sql
-- Index only active users (smaller, faster index)
CREATE INDEX idx_active_users ON users(email) WHERE active = true;

-- Index only recent orders
CREATE INDEX idx_recent_orders ON orders(customer_id)
WHERE order_date > '2024-01-01';
\`\`\`

## Composite Indexes

Index on multiple columns. Column order matters!

\`\`\`sql
CREATE INDEX idx_orders_customer_date ON orders(customer_id, order_date);
\`\`\`

**How composite indexes work:**

\`\`\`sql
-- The index is sorted by customer_id FIRST, then by order_date within each customer

-- Uses the index efficiently (starts with first column):
SELECT * FROM orders WHERE customer_id = 123;
SELECT * FROM orders WHERE customer_id = 123 AND order_date > '2024-01-01';

-- Also uses index (can use first column):
SELECT * FROM orders WHERE customer_id = 123 ORDER BY order_date;

-- Does NOT use index well (skips first column):
SELECT * FROM orders WHERE order_date > '2024-01-01';
-- May need a separate index on order_date
\`\`\`

**Column order guidelines:**
1. Put equality columns first
2. Put range columns last
3. Consider the most common query patterns

\`\`\`sql
-- Query: WHERE status = 'active' AND created_at > '2024-01-01'
-- Best index: (status, created_at) - equality first, range last
CREATE INDEX idx_orders_status_created ON orders(status, created_at);
\`\`\`

## Unique Indexes

Enforce uniqueness while providing fast lookups:

\`\`\`sql
-- Unique index prevents duplicate values
CREATE UNIQUE INDEX idx_users_email ON users(email);

-- This fails if email already exists
INSERT INTO users (name, email) VALUES ('Bob', 'existing@email.com');
-- Error: duplicate key violates unique constraint

-- Composite unique index
CREATE UNIQUE INDEX idx_enrollment ON enrollments(student_id, course_id);
-- Same student can't enroll in same course twice
\`\`\`

## Managing Indexes

### View Existing Indexes

\`\`\`sql
-- PostgreSQL
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'orders';

-- MySQL
SHOW INDEX FROM orders;

-- SQL Server
SELECT * FROM sys.indexes WHERE object_id = OBJECT_ID('orders');
\`\`\`

### Drop Indexes

\`\`\`sql
-- Remove an index
DROP INDEX idx_orders_customer;

-- PostgreSQL syntax (must specify table)
DROP INDEX idx_orders_customer;

-- MySQL syntax
DROP INDEX idx_orders_customer ON orders;

-- Drop if exists
DROP INDEX IF EXISTS idx_orders_customer;
\`\`\`

### Rebuild/Reindex

\`\`\`sql
-- PostgreSQL: Rebuild index
REINDEX INDEX idx_orders_customer;

-- Rebuild all indexes on a table
REINDEX TABLE orders;

-- MySQL: Rebuild indexes
ALTER TABLE orders ENGINE=InnoDB;
-- or
OPTIMIZE TABLE orders;
\`\`\`

## When to Use Indexes

### Good Candidates for Indexes

\`\`\`sql
-- Primary keys (automatically indexed)
-- Foreign keys (frequent joins)
CREATE INDEX idx_orders_customer_id ON orders(customer_id);

-- Frequently searched columns
CREATE INDEX idx_products_sku ON products(sku);

-- Columns in WHERE clauses
CREATE INDEX idx_users_status ON users(status);

-- Columns in ORDER BY
CREATE INDEX idx_orders_date ON orders(order_date);

-- Columns in JOIN conditions
CREATE INDEX idx_order_items_product ON order_items(product_id);
\`\`\`

### When NOT to Index

\`\`\`sql
-- Small tables (full scan is fast enough)
-- Columns with few unique values (low cardinality)
CREATE INDEX idx_users_gender ON users(gender);  -- Only M/F/Other - not helpful

-- Frequently updated columns (index maintenance overhead)
-- Columns rarely used in queries
-- Tables with heavy write operations
\`\`\`

## Index Performance Analysis

### EXPLAIN

\`\`\`sql
-- PostgreSQL
EXPLAIN SELECT * FROM orders WHERE customer_id = 123;
-- Shows: "Index Scan using idx_orders_customer on orders"

EXPLAIN ANALYZE SELECT * FROM orders WHERE customer_id = 123;
-- Shows actual execution time

-- MySQL
EXPLAIN SELECT * FROM orders WHERE customer_id = 123;
-- Shows: type=ref, key=idx_orders_customer
\`\`\`

### Reading EXPLAIN Output

\`\`\`sql
-- Good (using index):
-- "Index Scan" or "Index Only Scan" (PostgreSQL)
-- type=ref or type=range (MySQL)

-- Bad (not using index):
-- "Seq Scan" (PostgreSQL) - sequential table scan
-- type=ALL (MySQL) - full table scan
\`\`\`

## Index Costs and Trade-offs

### Benefits
- Faster SELECT queries
- Faster ORDER BY
- Faster JOIN operations
- Enforce uniqueness

### Costs
- Slower INSERT, UPDATE, DELETE (index must be updated)
- Storage space for index data
- More indexes = more maintenance overhead

\`\`\`sql
-- Balance example: orders table
-- If 90% reads, 10% writes: more indexes are OK
-- If 10% reads, 90% writes: be selective with indexes
\`\`\`

## Common Index Patterns

### Covering Index

Index contains all columns needed for query (no table lookup):

\`\`\`sql
-- Query needs customer_id, order_date, total
CREATE INDEX idx_orders_covering
ON orders(customer_id, order_date, total);

-- This query uses ONLY the index (Index Only Scan)
SELECT customer_id, order_date, total
FROM orders
WHERE customer_id = 123;
\`\`\`

### Index for Sorting

\`\`\`sql
-- If you frequently sort by date:
CREATE INDEX idx_orders_date_desc ON orders(order_date DESC);

SELECT * FROM orders ORDER BY order_date DESC LIMIT 10;
-- Uses index, no sorting needed
\`\`\`

### Index for Foreign Keys

\`\`\`sql
-- Always index foreign key columns for JOIN performance
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);
\`\`\`

## Quick Reference

| Index Type | Best For | Not Good For |
|------------|----------|--------------|
| B-tree (default) | Equality, ranges, sorting | N/A (general purpose) |
| Hash | Equality only | Ranges, sorting |
| Full-text | Text search | Exact matches |
| Partial | Filtered subsets | Full table queries |
| Composite | Multi-column queries | Queries not using leftmost columns |

| Should Index | Should NOT Index |
|--------------|------------------|
| Primary/foreign keys | Low cardinality columns |
| Frequently queried columns | Rarely queried columns |
| JOIN columns | Heavily updated columns |
| ORDER BY columns | Very small tables |
`,
  exercises: [
    {
      id: 1,
      title: 'Exercise 1: Create Basic Indexes',
      description: `Create indexes to optimize common queries on an e-commerce database.

**Given Table:**
- \`products\`: id, name, category_id, price, sku, created_at

**Common Queries:**
1. Find product by SKU
2. Find products by category
3. Find products in a price range

**Your Task:**
Create appropriate indexes for these query patterns.`,
      starterCode: `-- Create index for SKU lookups (should be unique)


-- Create index for category filtering


-- Create index for price range queries

`,
      solution: `-- Unique index for SKU (fast lookup + enforces uniqueness)
CREATE UNIQUE INDEX idx_products_sku ON products(sku);

-- Index for category filtering
CREATE INDEX idx_products_category ON products(category_id);

-- Index for price range queries
CREATE INDEX idx_products_price ON products(price);`,
      expectedOutput: ['Index idx_products_sku created', 'Index idx_products_category created', 'Index idx_products_price created'],
      hints: [
        'SKU should be unique, so use CREATE UNIQUE INDEX',
        'Category searches use equality, B-tree index works well',
        'Price range queries also work with B-tree indexes',
        'Use naming convention: idx_tablename_columnname'
      ]
    },
    {
      id: 2,
      title: 'Exercise 2: Composite Index',
      description: `Create a composite index to optimize a query that filters by multiple columns.

**Given Table:**
- \`orders\`: id, customer_id, status, order_date, total

**Common Query:**
\`\`\`sql
SELECT * FROM orders
WHERE customer_id = ? AND status = 'completed'
ORDER BY order_date DESC;
\`\`\`

**Your Task:**
Create an optimal composite index for this query pattern.`,
      starterCode: `-- Create a composite index for the query pattern
-- Consider: which columns are used for filtering? ordering?

`,
      solution: `CREATE INDEX idx_orders_customer_status_date
ON orders(customer_id, status, order_date DESC);`,
      expectedOutput: ['Index idx_orders_customer_status_date created'],
      hints: [
        'Composite index should include all columns in WHERE and ORDER BY',
        'Put equality conditions first (customer_id, status)',
        'Put ORDER BY column last (order_date)',
        'Add DESC to match the query sorting direction'
      ]
    },
    {
      id: 3,
      title: 'Exercise 3: Analyze Index Usage',
      description: `Use EXPLAIN to verify that your indexes are being used.

**Given:**
- Table \`users\` with columns: id, email, name, created_at
- Index exists: idx_users_email

**Your Task:**
1. Write an EXPLAIN query to check if the email index is used
2. Write an EXPLAIN query for a query that probably won't use the index`,
      starterCode: `-- Check if this query uses the email index
-- EXPLAIN SELECT ... WHERE email = ...


-- This query probably won't use the email index
-- EXPLAIN SELECT ... (think about what queries don't use indexes)

`,
      solution: `-- This should use the index (equality on indexed column)
EXPLAIN SELECT * FROM users WHERE email = 'alice@example.com';

-- This probably won't use the index (LIKE with leading wildcard)
EXPLAIN SELECT * FROM users WHERE email LIKE '%@gmail.com';`,
      expectedOutput: ['Index Scan using idx_users_email', 'Seq Scan on users'],
      hints: [
        'Equality queries on indexed columns use the index',
        'LIKE with leading wildcard (%) cannot use B-tree index',
        'EXPLAIN shows whether an Index Scan or Seq Scan is used',
        'Functions on indexed columns also prevent index usage'
      ]
    },
    {
      id: 4,
      title: 'Exercise 4: Drop and Rebuild Index',
      description: `Practice managing indexes by dropping an old index and creating a better one.

**Scenario:**
You have an old index \`idx_orders_date\` that's not optimal.
You need to replace it with a better composite index.

**Your Task:**
1. Drop the existing index
2. Create a new composite index on (order_date, status)`,
      starterCode: `-- Drop the old index


-- Create a better composite index

`,
      solution: `-- Drop the old index (use IF EXISTS for safety)
DROP INDEX IF EXISTS idx_orders_date;

-- Create a better composite index
CREATE INDEX idx_orders_date_status ON orders(order_date, status);`,
      expectedOutput: ['Index dropped', 'Index idx_orders_date_status created'],
      hints: [
        'Use DROP INDEX to remove an index',
        'IF EXISTS prevents errors if index doesn\'t exist',
        'Create the new index with a descriptive name',
        'Include both columns in the composite index'
      ]
    }
  ],
  quiz: [
    {
      question: 'What is the primary benefit of a database index?',
      options: [
        'Reduces storage space',
        'Speeds up data retrieval',
        'Improves data security',
        'Automatically backs up data'
      ],
      correctIndex: 1,
      explanation: 'Indexes speed up data retrieval by creating a data structure that allows the database to find rows quickly without scanning the entire table. However, they use additional storage space and can slow down writes.'
    },
    {
      question: 'In a composite index on (customer_id, order_date), which query will use the index most efficiently?',
      options: [
        'WHERE order_date = "2024-01-01"',
        'WHERE customer_id = 123',
        'WHERE status = "completed"',
        'ORDER BY order_date'
      ],
      correctIndex: 1,
      explanation: 'A composite index is most efficient when queries use the leftmost column(s). The query on customer_id uses the first column of the index. A query only on order_date (the second column) may not use the index as effectively.'
    },
    {
      question: 'When should you NOT create an index?',
      options: [
        'On a frequently searched column',
        'On a foreign key column',
        'On a column with very few unique values',
        'On a column used in ORDER BY'
      ],
      correctIndex: 2,
      explanation: 'Columns with low cardinality (few unique values, like boolean or status columns with only a few options) don\'t benefit much from indexing because the index would still need to scan a large portion of the table.'
    },
    {
      question: 'What does EXPLAIN help you determine?',
      options: [
        'How to create an index',
        'Whether a query is using indexes and how it will execute',
        'How much storage an index uses',
        'How to drop an index'
      ],
      correctIndex: 1,
      explanation: 'EXPLAIN shows the query execution plan, including whether indexes are being used (Index Scan vs Seq Scan), the estimated cost, and how tables are being joined. It\'s essential for optimizing query performance.'
    }
  ],
  buildNote: {
    title: 'Indexes in Application Databases',
    explanation: `Every production application needs proper indexing. In this learning app, user lookups by email (for login) need an index: CREATE UNIQUE INDEX idx_users_email ON users(email). Progress queries that filter by user_id and lesson_id need a composite index. The lesson listing ordered by difficulty and order number benefits from an index too. Without indexes, queries that work fine with test data become painfully slow with real user data. A query taking 100ms with 1000 rows might take 10 seconds with 1 million rows without proper indexing.`,
    relatedFiles: [
      'src/lib/progress.ts',
      'src/lib/lessons.ts'
    ],
    inTheRealWorld: `Database indexing is one of the most impactful performance optimizations. Production DBAs spend significant time analyzing slow query logs and adding appropriate indexes. Tools like pg_stat_statements (PostgreSQL) and slow query log (MySQL) help identify queries needing indexes. ORMs like Prisma and TypeORM can auto-generate indexes from model definitions. Cloud database services provide index recommendation tools. However, over-indexing is a real problem - too many indexes slow down writes and consume storage. Regular index maintenance (rebuilding fragmented indexes) is part of database administration.`
  }
};
