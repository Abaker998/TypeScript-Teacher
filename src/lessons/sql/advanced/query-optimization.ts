import { Lesson } from '@/types/lesson';

export const queryOptimization: Lesson = {
  slug: 'sql-query-optimization',
  title: 'Query Optimization',
  description: 'Master EXPLAIN plans, index optimization, query rewriting, and avoiding common performance pitfalls.',
  difficulty: 'advanced',
  order: 21,
  content: `
# Query Optimization

Query optimization is the art and science of making your SQL queries run faster. Understanding how the database executes your queries and how to guide it toward better execution plans is essential for building performant applications.

## Understanding EXPLAIN Plans

The EXPLAIN statement shows how the database will execute your query:

\`\`\`sql
-- Basic EXPLAIN
EXPLAIN SELECT * FROM orders WHERE customer_id = 100;

-- EXPLAIN with more details (PostgreSQL)
EXPLAIN ANALYZE SELECT * FROM orders WHERE customer_id = 100;

-- EXPLAIN with format options (PostgreSQL)
EXPLAIN (FORMAT JSON, ANALYZE, BUFFERS)
SELECT * FROM orders WHERE customer_id = 100;

-- MySQL EXPLAIN
EXPLAIN FORMAT=JSON SELECT * FROM orders WHERE customer_id = 100;

-- SQL Server execution plan
SET SHOWPLAN_TEXT ON;
GO
SELECT * FROM orders WHERE customer_id = 100;
GO
SET SHOWPLAN_TEXT OFF;
\`\`\`

### Reading Execution Plans

Key elements to look for:

\`\`\`sql
-- This query might use different scan types
EXPLAIN ANALYZE
SELECT o.order_id, c.name, o.total
FROM orders o
JOIN customers c ON o.customer_id = c.customer_id
WHERE o.order_date > '2024-01-01';

-- Common scan types:
-- Seq Scan: Full table scan (usually bad for large tables)
-- Index Scan: Uses an index (good)
-- Index Only Scan: Uses only index data (best)
-- Bitmap Index Scan: Combines multiple indexes
-- Nested Loop: Joins rows one at a time
-- Hash Join: Builds hash table for joining
-- Merge Join: Sorts both sides, then merges
\`\`\`

## Index Optimization

### Creating Effective Indexes

\`\`\`sql
-- Single column index
CREATE INDEX idx_orders_customer_id ON orders(customer_id);

-- Composite index (column order matters!)
CREATE INDEX idx_orders_customer_date ON orders(customer_id, order_date);

-- Covering index (includes all columns needed by query)
CREATE INDEX idx_orders_covering ON orders(customer_id, order_date)
INCLUDE (total, status);

-- Partial index (PostgreSQL) - index only relevant rows
CREATE INDEX idx_orders_pending ON orders(customer_id)
WHERE status = 'pending';

-- Expression index
CREATE INDEX idx_orders_year ON orders(EXTRACT(YEAR FROM order_date));

-- Unique index
CREATE UNIQUE INDEX idx_users_email ON users(email);
\`\`\`

### Index Selection Guidelines

\`\`\`sql
-- Index columns used in:
-- 1. WHERE clauses
SELECT * FROM orders WHERE status = 'shipped';
-- CREATE INDEX idx_orders_status ON orders(status);

-- 2. JOIN conditions
SELECT * FROM orders o JOIN customers c ON o.customer_id = c.customer_id;
-- CREATE INDEX idx_orders_customer_id ON orders(customer_id);

-- 3. ORDER BY clauses
SELECT * FROM orders ORDER BY order_date DESC;
-- CREATE INDEX idx_orders_date_desc ON orders(order_date DESC);

-- 4. GROUP BY clauses
SELECT customer_id, COUNT(*) FROM orders GROUP BY customer_id;
-- CREATE INDEX idx_orders_customer_id ON orders(customer_id);
\`\`\`

### Composite Index Column Order

\`\`\`sql
-- Index on (a, b, c) can be used for:
-- WHERE a = ?
-- WHERE a = ? AND b = ?
-- WHERE a = ? AND b = ? AND c = ?
-- WHERE a = ? ORDER BY b

-- But NOT efficiently for:
-- WHERE b = ?  (first column not used)
-- WHERE a = ? AND c = ?  (gap in columns)

-- Example: most selective column first
CREATE INDEX idx_orders_status_date ON orders(status, order_date);

-- Query using this index efficiently
SELECT * FROM orders
WHERE status = 'pending'
AND order_date > '2024-01-01';
\`\`\`

## Query Rewriting Techniques

### Avoiding SELECT *

\`\`\`sql
-- Bad: Fetches all columns
SELECT * FROM orders WHERE customer_id = 100;

-- Good: Only fetch needed columns
SELECT order_id, order_date, total
FROM orders
WHERE customer_id = 100;
\`\`\`

### Using EXISTS Instead of IN

\`\`\`sql
-- Slower for large subqueries
SELECT * FROM customers
WHERE customer_id IN (
  SELECT customer_id FROM orders WHERE total > 1000
);

-- Faster: EXISTS stops at first match
SELECT * FROM customers c
WHERE EXISTS (
  SELECT 1 FROM orders o
  WHERE o.customer_id = c.customer_id AND o.total > 1000
);
\`\`\`

### Avoiding Functions on Indexed Columns

\`\`\`sql
-- Bad: Index cannot be used
SELECT * FROM orders
WHERE YEAR(order_date) = 2024;

-- Good: Index can be used
SELECT * FROM orders
WHERE order_date >= '2024-01-01'
AND order_date < '2025-01-01';

-- Bad: Index cannot be used
SELECT * FROM users
WHERE LOWER(email) = 'john@example.com';

-- Good: Use expression index or store normalized
CREATE INDEX idx_users_email_lower ON users(LOWER(email));
-- Or normalize data on insert
\`\`\`

### Optimizing JOINs

\`\`\`sql
-- Ensure join columns are indexed
SELECT o.*, c.name
FROM orders o
JOIN customers c ON o.customer_id = c.customer_id
WHERE o.order_date > '2024-01-01';

-- Filter early in the query
SELECT o.*, c.name
FROM (
  SELECT * FROM orders WHERE order_date > '2024-01-01'
) o
JOIN customers c ON o.customer_id = c.customer_id;

-- Consider join order (optimizer usually handles this)
-- Smaller table first can help with certain join types
\`\`\`

## Common Performance Pitfalls

### N+1 Query Problem

\`\`\`sql
-- Bad: One query per customer (N+1 queries)
-- Application code loops through customers and runs:
SELECT * FROM orders WHERE customer_id = ?;

-- Good: Single query with JOIN
SELECT c.*, o.*
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
WHERE c.region = 'US';

-- Or batch the IDs
SELECT * FROM orders
WHERE customer_id IN (1, 2, 3, 4, 5);
\`\`\`

### Pagination Pitfalls

\`\`\`sql
-- Bad: OFFSET gets slower as pages increase
SELECT * FROM orders
ORDER BY order_date DESC
LIMIT 20 OFFSET 10000;  -- Must skip 10000 rows!

-- Better: Keyset pagination
SELECT * FROM orders
WHERE order_date < '2024-01-15 10:30:00'
ORDER BY order_date DESC
LIMIT 20;

-- Or use indexed column for seeking
SELECT * FROM orders
WHERE order_id < 50000
ORDER BY order_id DESC
LIMIT 20;
\`\`\`

### Implicit Type Conversions

\`\`\`sql
-- Bad: String compared to integer, prevents index use
SELECT * FROM orders WHERE order_id = '12345';

-- Good: Matching types
SELECT * FROM orders WHERE order_id = 12345;

-- Bad: Date string might cause conversion
SELECT * FROM orders WHERE order_date = '2024-01-15';

-- Good: Explicit type
SELECT * FROM orders WHERE order_date = DATE '2024-01-15';
\`\`\`

## Statistics and Query Planning

### Understanding Statistics

\`\`\`sql
-- PostgreSQL: Update statistics
ANALYZE orders;

-- PostgreSQL: View statistics
SELECT
  attname,
  n_distinct,
  most_common_vals,
  most_common_freqs
FROM pg_stats
WHERE tablename = 'orders';

-- SQL Server: Update statistics
UPDATE STATISTICS orders;

-- MySQL: Analyze table
ANALYZE TABLE orders;
\`\`\`

### Cardinality Estimation

\`\`\`sql
-- The optimizer estimates row counts to choose execution plans
-- Poor estimates lead to bad plans

-- Check estimated vs actual rows
EXPLAIN ANALYZE
SELECT * FROM orders
WHERE status = 'shipped'
AND customer_id = 100;

-- If estimates are way off, consider:
-- 1. Updating statistics
-- 2. Creating multi-column statistics
-- 3. Using query hints (as last resort)

-- PostgreSQL: Create extended statistics
CREATE STATISTICS orders_stats (dependencies)
ON status, customer_id FROM orders;
\`\`\`

## Advanced Optimization Techniques

### Materialized Views

\`\`\`sql
-- Create materialized view for complex aggregations
CREATE MATERIALIZED VIEW monthly_sales AS
SELECT
  DATE_TRUNC('month', order_date) AS month,
  SUM(total) AS total_sales,
  COUNT(*) AS order_count
FROM orders
GROUP BY DATE_TRUNC('month', order_date);

-- Refresh when needed
REFRESH MATERIALIZED VIEW monthly_sales;

-- Query the materialized view (very fast)
SELECT * FROM monthly_sales WHERE month >= '2024-01-01';
\`\`\`

### Query Hints

\`\`\`sql
-- PostgreSQL: Force index usage
SET enable_seqscan = OFF;
SELECT * FROM orders WHERE customer_id = 100;
SET enable_seqscan = ON;

-- SQL Server: Index hints
SELECT * FROM orders WITH (INDEX(idx_orders_customer))
WHERE customer_id = 100;

-- MySQL: Index hints
SELECT * FROM orders USE INDEX (idx_orders_customer)
WHERE customer_id = 100;

-- Note: Use hints sparingly - the optimizer is usually right
\`\`\`

### Partitioning for Performance

\`\`\`sql
-- Range partitioning by date
CREATE TABLE orders (
  order_id SERIAL,
  order_date DATE,
  customer_id INT,
  total DECIMAL(10,2)
) PARTITION BY RANGE (order_date);

-- Create partitions
CREATE TABLE orders_2023 PARTITION OF orders
FOR VALUES FROM ('2023-01-01') TO ('2024-01-01');

CREATE TABLE orders_2024 PARTITION OF orders
FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');

-- Queries on date ranges only scan relevant partitions
SELECT * FROM orders
WHERE order_date BETWEEN '2024-06-01' AND '2024-06-30';
\`\`\`

## Monitoring and Profiling

\`\`\`sql
-- PostgreSQL: Find slow queries
SELECT
  query,
  calls,
  total_time / 1000 AS total_seconds,
  mean_time / 1000 AS mean_seconds,
  rows
FROM pg_stat_statements
ORDER BY total_time DESC
LIMIT 10;

-- PostgreSQL: Find missing indexes
SELECT
  schemaname,
  relname,
  seq_scan,
  idx_scan,
  seq_tup_read
FROM pg_stat_user_tables
WHERE seq_scan > idx_scan
AND seq_tup_read > 10000
ORDER BY seq_tup_read DESC;

-- MySQL: Show slow query log
SHOW VARIABLES LIKE 'slow_query%';
\`\`\`

## Learning Objectives

By the end of this lesson, you'll be able to:
- Read and interpret EXPLAIN plans
- Create effective indexes for your queries
- Rewrite queries for better performance
- Avoid common performance pitfalls
- Use statistics to improve query planning
`,
  exercises: [
    {
      id: 1,
      title: 'Exercise 1: Index Analysis',
      description: `Analyze which indexes would help the following queries and explain why.

**Your task:**
Given these queries on an orders table:
1. \`SELECT * FROM orders WHERE customer_id = 100\`
2. \`SELECT * FROM orders WHERE order_date > '2024-01-01' ORDER BY total DESC\`
3. \`SELECT customer_id, SUM(total) FROM orders GROUP BY customer_id\`

Write the CREATE INDEX statements that would optimize each query.`,
      starterCode: `-- Table structure:
-- orders(order_id, customer_id, order_date, total, status)

-- Index for Query 1: Filter by customer_id


-- Index for Query 2: Filter by date, order by total


-- Index for Query 3: Group by customer_id with aggregation

`,
      solution: `-- Table structure:
-- orders(order_id, customer_id, order_date, total, status)

-- Index for Query 1: Filter by customer_id
CREATE INDEX idx_orders_customer_id ON orders(customer_id);

-- Index for Query 2: Filter by date, order by total
-- Composite index with order_date first (for filtering), then total (for sorting)
CREATE INDEX idx_orders_date_total ON orders(order_date, total DESC);

-- Index for Query 3: Group by customer_id with aggregation
-- Covering index that includes total to avoid table lookups
CREATE INDEX idx_orders_customer_total ON orders(customer_id) INCLUDE (total);`,
      expectedOutput: ['Index for customer_id lookup', 'Composite index for date filtering and total sorting', 'Covering index for aggregation'],
      hints: [
        'Single column index works well for simple equality conditions',
        'For ORDER BY optimization, the sort column should be in the index',
        'INCLUDE clause adds non-key columns to avoid table lookups'
      ],
    },
    {
      id: 2,
      title: 'Exercise 2: Query Rewriting',
      description: `Rewrite these inefficient queries for better performance.

**Your task:**
Optimize each query by rewriting it to use indexes effectively.`,
      starterCode: `-- Original Query 1: Function on indexed column
SELECT * FROM users
WHERE YEAR(created_at) = 2024;

-- Rewrite Query 1:


-- Original Query 2: Using IN with large subquery
SELECT * FROM products
WHERE category_id IN (
  SELECT category_id FROM categories WHERE active = true
);

-- Rewrite Query 2:


-- Original Query 3: SELECT * with pagination
SELECT * FROM orders
ORDER BY created_at DESC
LIMIT 20 OFFSET 50000;

-- Rewrite Query 3 (using keyset pagination):

`,
      solution: `-- Original Query 1: Function on indexed column
-- SELECT * FROM users WHERE YEAR(created_at) = 2024;

-- Rewrite Query 1: Use range condition instead of function
SELECT * FROM users
WHERE created_at >= '2024-01-01'
AND created_at < '2025-01-01';

-- Original Query 2: Using IN with large subquery
-- SELECT * FROM products WHERE category_id IN (SELECT category_id FROM categories WHERE active = true);

-- Rewrite Query 2: Use EXISTS for better performance
SELECT * FROM products p
WHERE EXISTS (
  SELECT 1 FROM categories c
  WHERE c.category_id = p.category_id
  AND c.active = true
);

-- Original Query 3: SELECT * with pagination
-- SELECT * FROM orders ORDER BY created_at DESC LIMIT 20 OFFSET 50000;

-- Rewrite Query 3: Use keyset pagination with a cursor
-- Assuming last seen created_at was '2024-01-15 10:30:00'
SELECT order_id, customer_id, created_at, total
FROM orders
WHERE created_at < '2024-01-15 10:30:00'
ORDER BY created_at DESC
LIMIT 20;`,
      expectedOutput: ['Range condition allows index usage', 'EXISTS stops at first match', 'Keyset pagination avoids offset scanning'],
      hints: [
        'Functions on columns prevent index usage - use range conditions',
        'EXISTS can short-circuit when a match is found',
        'Keyset pagination uses WHERE instead of OFFSET to skip rows'
      ],
    },
    {
      id: 3,
      title: 'Exercise 3: Reading EXPLAIN Output',
      description: `Interpret this EXPLAIN ANALYZE output and suggest improvements.

**Scenario:**
\`\`\`
Nested Loop (cost=0.00..1234567.89 rows=1000 width=100) (actual time=5000.123..5500.456 rows=50 loops=1)
  -> Seq Scan on orders o (cost=0.00..50000.00 rows=1000000 width=50) (actual time=0.050..2000.123 rows=1000000 loops=1)
       Filter: (status = 'pending')
       Rows Removed by Filter: 900000
  -> Index Scan on customers c (cost=0.00..1.23 rows=1 width=50) (actual time=0.003..0.003 rows=0 loops=1000000)
       Index Cond: (customer_id = o.customer_id)
\`\`\`

**Your task:**
1. Identify the performance problems
2. Write the missing index
3. Write an improved version of the likely query`,
      starterCode: `-- Problem 1: What's causing the poor performance?
-- Answer:


-- Problem 2: Create the missing index
-- CREATE INDEX ...


-- Problem 3: The original query was likely:
SELECT o.*, c.name
FROM orders o
JOIN customers c ON o.customer_id = c.customer_id
WHERE o.status = 'pending';

-- Write any additional optimizations:

`,
      solution: `-- Problem 1: What's causing the poor performance?
-- Answer: The orders table is doing a Sequential Scan (Seq Scan) instead of
-- using an index. It's scanning 1,000,000 rows and filtering down to 100,000
-- rows with status='pending'. The nested loop then performs 1,000,000 index
-- lookups on the customers table.

-- Problem 2: Create the missing index
CREATE INDEX idx_orders_status ON orders(status);
-- Or better, a partial index if 'pending' is a small subset:
CREATE INDEX idx_orders_pending ON orders(customer_id)
WHERE status = 'pending';

-- Problem 3: The original query was likely:
SELECT o.*, c.name
FROM orders o
JOIN customers c ON o.customer_id = c.customer_id
WHERE o.status = 'pending';

-- Optimizations:
-- 1. Add index on status column
-- 2. Select only needed columns instead of o.*
-- 3. Consider a covering index

SELECT o.order_id, o.order_date, o.total, c.name
FROM orders o
JOIN customers c ON o.customer_id = c.customer_id
WHERE o.status = 'pending';

-- With covering index:
CREATE INDEX idx_orders_pending_covering
ON orders(status, customer_id)
INCLUDE (order_id, order_date, total);`,
      expectedOutput: ['Seq Scan indicates missing index on status', 'Index on status column needed', 'Covering index can eliminate table lookups'],
      hints: [
        'Seq Scan on a large table is usually a red flag',
        'Look at Rows Removed by Filter - high numbers suggest index needed',
        'Consider what columns the query actually needs'
      ],
    },
    {
      id: 4,
      title: 'Exercise 4: Composite Index Design',
      description: `Design a composite index strategy for a multi-condition query.

**Scenario:**
Your application frequently runs this query:
\`\`\`sql
SELECT * FROM orders
WHERE customer_id = ?
AND status = ?
AND order_date BETWEEN ? AND ?
ORDER BY total DESC
LIMIT 10;
\`\`\`

Design the optimal index considering:
- customer_id has high cardinality (many unique values)
- status has low cardinality (5 possible values)
- order_date range varies widely
- Results need to be sorted by total`,
      starterCode: `-- Design the optimal composite index for this query:
-- SELECT * FROM orders
-- WHERE customer_id = ?
-- AND status = ?
-- AND order_date BETWEEN ? AND ?
-- ORDER BY total DESC
-- LIMIT 10;

-- Your index design:


-- Explain your column order choice:

`,
      solution: `-- Design the optimal composite index for this query:
-- SELECT * FROM orders
-- WHERE customer_id = ?
-- AND status = ?
-- AND order_date BETWEEN ? AND ?
-- ORDER BY total DESC
-- LIMIT 10;

-- Optimal index design:
CREATE INDEX idx_orders_customer_status_date_total
ON orders(customer_id, status, order_date, total DESC);

-- Explain your column order choice:
-- 1. customer_id FIRST: High cardinality column with equality condition
--    dramatically narrows the search space
-- 2. status SECOND: Another equality condition, further filters
-- 3. order_date THIRD: Range condition - must come after equality columns
--    because B-tree can only use range on the last condition
-- 4. total DESC LAST: For ORDER BY optimization after filtering

-- Alternative if order_date range is very selective:
CREATE INDEX idx_orders_customer_date_status
ON orders(customer_id, order_date, status)
INCLUDE (total);

-- Note: The query optimizer will choose the best index based on statistics.
-- You might create both and let it decide, or test with EXPLAIN ANALYZE.`,
      expectedOutput: ['Equality columns before range columns', 'High cardinality columns first', 'Sort column at the end for ORDER BY optimization'],
      hints: [
        'Equality conditions (=) should come before range conditions (BETWEEN)',
        'Higher cardinality columns first helps narrow results faster',
        'The sort column can be in the index to avoid a separate sort step'
      ],
    },
  ],
  quiz: [
    {
      question: 'What does a "Seq Scan" in an EXPLAIN plan typically indicate?',
      options: [
        'The query is using an index efficiently',
        'The database is scanning the entire table row by row',
        'The query is using a sequential index',
        'The results are being returned in sequence'
      ],
      correctIndex: 1,
      explanation: 'A Seq Scan (Sequential Scan) means the database is reading every row in the table. This is usually inefficient for large tables and often indicates a missing or unused index.'
    },
    {
      question: 'Why should you avoid using functions on indexed columns in WHERE clauses?',
      options: [
        'Functions make the query syntax invalid',
        'Functions are slower than direct comparisons',
        'The database cannot use the index when a function is applied to the column',
        'Functions require additional memory allocation'
      ],
      correctIndex: 2,
      explanation: 'When you apply a function to a column (e.g., YEAR(date_column) = 2024), the database cannot use an index on that column because it would need to compute the function for every row to compare. Rewrite using range conditions instead.'
    },
    {
      question: 'In a composite index on columns (A, B, C), which WHERE clause can efficiently use the index?',
      options: [
        'WHERE B = 1 AND C = 2',
        'WHERE A = 1 AND C = 2',
        'WHERE A = 1 AND B = 2',
        'WHERE C = 1'
      ],
      correctIndex: 2,
      explanation: 'A composite index can be used efficiently when the WHERE clause uses columns from left to right without gaps. (A, B) works because it follows the index order. (B, C) or (A, C) skip columns and cannot use the full index.'
    },
    {
      question: 'What is the main advantage of keyset pagination over OFFSET pagination?',
      options: [
        'Keyset pagination returns more rows per page',
        'Keyset pagination is simpler to implement',
        'Keyset pagination maintains consistent performance regardless of page number',
        'Keyset pagination works without indexes'
      ],
      correctIndex: 2,
      explanation: 'OFFSET pagination becomes slower as the offset increases because the database must skip over all previous rows. Keyset pagination uses a WHERE clause to start from a specific point, maintaining consistent performance regardless of how deep into the results you are.'
    }
  ],
  buildNote: {
    title: 'Query Optimization in Database Applications',
    explanation: `Query optimization is critical in any application that works with a database. In a teaching platform like this one, consider how lesson data is queried - fetching lessons by difficulty, retrieving user progress, or loading specific lessons by slug. Each query pattern suggests different indexing strategies. For example, if lessons are frequently filtered by \`difficulty\` and sorted by \`order\`, a composite index on \`(difficulty, order)\` would be optimal. Similarly, the progress tracking system would benefit from indexes on \`(user_id, lesson_slug)\` for quick lookups of individual lesson progress.`,
    relatedFiles: [
      'src/lessons/index.ts',
      'src/lib/lesson-utils.ts',
      'src/types/lesson.ts'
    ],
    inTheRealWorld: `Every production database-backed application deals with query optimization. E-commerce sites optimize product search queries that filter by category, price range, and availability. Social media platforms optimize feed queries that join posts with user relationships. Analytics dashboards optimize aggregation queries on time-series data. The key practices are: profile your slow queries, understand your access patterns, create appropriate indexes, and regularly review execution plans as data grows.`
  }
};
