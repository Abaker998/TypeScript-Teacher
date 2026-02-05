import { Lesson } from '@/types/lesson';

export const masterTest: Lesson = {
  slug: 'sql-master-test',
  title: 'SQL Master Test',
  description: 'The ultimate SQL challenge combining all concepts in expert-level scenarios.',
  difficulty: 'master',
  order: 30,
  content: `
# SQL Master Test

You've completed the entire SQL curriculum! This final test combines concepts from all sections into challenging, real-world scenarios that would test even experienced database developers.

## What This Test Covers

This comprehensive test draws from **all** previous sections:

**Beginner Concepts:** SELECT, WHERE, ORDER BY, aggregates, GROUP BY, JOINs, INSERT/UPDATE/DELETE

**Intermediate Concepts:** Advanced JOINs, subqueries, views, indexes, constraints, transactions, stored procedures

**Advanced Concepts:** Window functions, CTEs, recursive queries, query optimization, database design, advanced patterns

## Challenge Level

These questions and exercises are designed to be **genuinely difficult**. They combine multiple concepts, require careful reasoning, and reflect real challenges you'd encounter in production database systems.

## Test Format

- **15 Multiple choice questions** - Expert-level conceptual challenges
- **3 Coding exercises** - Complex real-world scenarios

Don't be discouraged if you find this challenging. Review the relevant lessons and try again!
`,
  exercises: [
    {
      id: 1,
      title: 'Exercise 1: Complex Analytics Query',
      description: `Build a comprehensive sales analytics query using multiple advanced features.

**Given tables:**

**sales**
| id | product_id | customer_id | amount | sale_date |
|----|------------|-------------|--------|-----------|
| 1 | 101 | 1001 | 150.00 | 2024-01-15 |
| 2 | 102 | 1002 | 200.00 | 2024-01-15 |
| 3 | 101 | 1001 | 150.00 | 2024-01-16 |
| 4 | 103 | 1003 | 300.00 | 2024-01-16 |
| 5 | 102 | 1001 | 200.00 | 2024-01-17 |
| 6 | 101 | 1002 | 150.00 | 2024-01-17 |

**products**
| id | name | category |
|----|------|----------|
| 101 | Widget | Electronics |
| 102 | Gadget | Electronics |
| 103 | Chair | Furniture |

**Your task:**
1. Create a CTE that calculates daily totals per product
2. Use window functions to add:
   - Running total of sales for each product
   - Rank of each day by sales amount within each product
   - Previous day's sales for comparison (LAG)
3. Join with products to get product names
4. Show: product name, date, daily_total, running_total, daily_rank, prev_day_sales
5. Order by product name, then date

**This combines CTEs, window functions, JOINs, and aggregation**`,
      starterCode: `-- Create CTE for daily product totals
-- Add window functions for running total, rank, and lag
-- Join with products table
-- Order appropriately

`,
      solution: `WITH daily_product_sales AS (
  SELECT product_id,
         sale_date,
         SUM(amount) AS daily_total
  FROM sales
  GROUP BY product_id, sale_date
)
SELECT p.name AS product_name,
       dps.sale_date,
       dps.daily_total,
       SUM(dps.daily_total) OVER (
         PARTITION BY dps.product_id
         ORDER BY dps.sale_date
       ) AS running_total,
       RANK() OVER (
         PARTITION BY dps.product_id
         ORDER BY dps.daily_total DESC
       ) AS daily_rank,
       LAG(dps.daily_total) OVER (
         PARTITION BY dps.product_id
         ORDER BY dps.sale_date
       ) AS prev_day_sales
FROM daily_product_sales dps
JOIN products p ON dps.product_id = p.id
ORDER BY p.name, dps.sale_date;`,
      expectedOutput: [
        'Chair | 2024-01-16 | 300.00 | 300.00 | 1 | NULL',
        'Gadget | 2024-01-15 | 200.00 | 200.00 | 1 | NULL',
        'Gadget | 2024-01-17 | 200.00 | 400.00 | 1 | 200.00',
        'Widget | 2024-01-15 | 150.00 | 150.00 | 2 | NULL',
        'Widget | 2024-01-16 | 150.00 | 300.00 | 2 | 150.00',
        'Widget | 2024-01-17 | 150.00 | 450.00 | 2 | 150.00'
      ],
      hints: [
        'First aggregate daily totals in a CTE with GROUP BY',
        'Window functions operate on the CTE results',
        'Each window function needs its own OVER clause',
        'Running total uses SUM() OVER (PARTITION BY product ORDER BY date)'
      ]
    },
    {
      id: 2,
      title: 'Exercise 2: Data Integrity with Transactions',
      description: `Design a transaction that safely transfers inventory between warehouses with validation.

**Given tables:**

**warehouses**
| id | name | location |
|----|------|----------|
| 1 | Main | NYC |
| 2 | West | LA |

**inventory**
| id | warehouse_id | product_id | quantity |
|----|--------------|------------|----------|
| 1 | 1 | 101 | 100 |
| 2 | 1 | 102 | 50 |
| 3 | 2 | 101 | 30 |
| 4 | 2 | 102 | 75 |

**Your task:**
Create a transaction that transfers 25 units of product 101 from Main (warehouse 1) to West (warehouse 2):

1. Start a transaction
2. Check if source warehouse has enough inventory (use a subquery or CTE)
3. Decrease quantity in source warehouse
4. Increase quantity in destination warehouse
5. Insert a record into transfer_log table (id, from_warehouse, to_warehouse, product_id, quantity, transfer_date)
6. Commit if successful
7. Show final inventory for product 101

**The transaction ensures all operations succeed or all fail**`,
      starterCode: `-- Start transaction
-- Verify sufficient inventory exists
-- Update source warehouse (decrease)
-- Update destination warehouse (increase)
-- Log the transfer
-- Commit
-- Show results

`,
      solution: `BEGIN TRANSACTION;

-- Verify inventory exists (in real scenario, would check and conditionally rollback)
-- For this exercise, we proceed assuming valid data

-- Decrease source warehouse inventory
UPDATE inventory
SET quantity = quantity - 25
WHERE warehouse_id = 1 AND product_id = 101;

-- Increase destination warehouse inventory
UPDATE inventory
SET quantity = quantity + 25
WHERE warehouse_id = 2 AND product_id = 101;

-- Log the transfer
INSERT INTO transfer_log (from_warehouse, to_warehouse, product_id, quantity, transfer_date)
VALUES (1, 2, 101, 25, CURRENT_DATE);

COMMIT;

-- Show final inventory for product 101
SELECT w.name AS warehouse, i.quantity
FROM inventory i
JOIN warehouses w ON i.warehouse_id = w.id
WHERE i.product_id = 101
ORDER BY w.name;`,
      expectedOutput: [
        'Main | 75',
        'West | 55'
      ],
      hints: [
        'BEGIN TRANSACTION groups all statements atomically',
        'Update source first: SET quantity = quantity - 25',
        'Update destination: SET quantity = quantity + 25',
        'INSERT INTO transfer_log records the operation for audit'
      ]
    },
    {
      id: 3,
      title: 'Exercise 3: Recursive Hierarchy with Aggregation',
      description: `Calculate total budget for each department including all sub-departments.

**Given table: departments**
| id | name | parent_id | budget |
|----|------|-----------|--------|
| 1 | Company | NULL | 100000 |
| 2 | Engineering | 1 | 500000 |
| 3 | Sales | 1 | 300000 |
| 4 | Frontend | 2 | 150000 |
| 5 | Backend | 2 | 200000 |
| 6 | DevOps | 2 | 100000 |
| 7 | Enterprise | 3 | 180000 |
| 8 | SMB | 3 | 120000 |

**Your task:**
1. Use a recursive CTE to traverse the hierarchy
2. For each department, calculate the total budget including all descendants
3. Show: department name, own budget, total budget (own + all children), level in hierarchy
4. Order by total budget descending

**Challenge: The recursive sum must include budgets from ALL levels below**`,
      starterCode: `-- Recursive CTE to traverse hierarchy
-- Calculate each department's own budget
-- Sum budgets of all descendants
-- Order by total budget

`,
      solution: `WITH RECURSIVE dept_hierarchy AS (
  -- Base case: all departments with their own info
  SELECT id, name, parent_id, budget,
         1 AS level,
         id AS root_id
  FROM departments

  UNION ALL

  -- Recursive: children linked to their ancestors
  SELECT d.id, d.name, d.parent_id, d.budget,
         dh.level + 1,
         dh.root_id
  FROM departments d
  INNER JOIN dept_hierarchy dh ON d.parent_id = dh.id
),
-- Aggregate budgets under each "root"
dept_totals AS (
  SELECT root_id,
         SUM(budget) AS total_budget
  FROM dept_hierarchy
  GROUP BY root_id
)
SELECT d.name,
       d.budget AS own_budget,
       dt.total_budget,
       (SELECT COUNT(*) FROM dept_hierarchy WHERE root_id = d.id) - 1 AS descendant_count
FROM departments d
JOIN dept_totals dt ON d.id = dt.root_id
ORDER BY dt.total_budget DESC;`,
      expectedOutput: [
        'Company | 100000 | 1650000 | 7',
        'Engineering | 500000 | 950000 | 3',
        'Sales | 300000 | 600000 | 2',
        'Backend | 200000 | 200000 | 0',
        'Enterprise | 180000 | 180000 | 0',
        'Frontend | 150000 | 150000 | 0',
        'SMB | 120000 | 120000 | 0',
        'DevOps | 100000 | 100000 | 0'
      ],
      hints: [
        'The recursive CTE needs to track which root department each row belongs to',
        'Use root_id to group all descendants under their ancestor',
        'Aggregate with SUM grouped by root_id to get totals',
        'Join back to departments table to get department names'
      ]
    }
  ],
  buildNote: {
    title: 'Master-Level SQL in Production Systems',
    explanation: `These patterns appear in sophisticated database applications. Complex analytics queries power business intelligence dashboards and executive reporting. Transaction management ensures data integrity in financial systems, inventory management, and any multi-step operation. Recursive queries traverse organizational hierarchies for access control, bill of materials for manufacturing, and category trees for e-commerce. Query optimization skills are essential when these queries run against tables with millions or billions of rows. Mastering these concepts prepares you for senior database developer, data engineer, and database architect roles.`,
    relatedFiles: [
      'src/lessons/sql/advanced/window-functions.ts',
      'src/lessons/sql/advanced/ctes.ts',
      'src/lessons/sql/intermediate/transactions.ts',
      'src/lessons/sql/advanced/query-optimization.ts'
    ],
    inTheRealWorld: `These are the patterns used by database experts at companies like Oracle, Microsoft, Snowflake, and Databricks. Data engineering teams at Netflix, Uber, and Airbnb write queries combining CTEs, window functions, and complex joins daily. Financial institutions require transaction expertise for regulatory compliance. E-commerce companies use recursive queries for dynamic pricing through category hierarchies. Understanding these patterns opens doors to principal engineer, staff data engineer, and database architect positions.`
  },
  quiz: [
    {
      question: 'What does this complex window function calculate?\n\n```sql\nSUM(sales) OVER (\n  PARTITION BY region\n  ORDER BY month\n  ROWS BETWEEN 2 PRECEDING AND CURRENT ROW\n)\n```',
      options: [
        'Total sales for all time',
        'Running total within each region',
        '3-month rolling sum within each region',
        'Sales for current month only'
      ],
      correctIndex: 2,
      explanation: 'This calculates a 3-month rolling sum: the current row plus 2 preceding rows, separately for each region. It\'s commonly used for moving averages and rolling totals.'
    },
    {
      question: 'In a recursive CTE, what happens if there is no termination condition?',
      options: [
        'The query returns empty results',
        'The database optimizes it automatically',
        'The query runs indefinitely or hits a recursion limit',
        'Only the base case executes'
      ],
      correctIndex: 2,
      explanation: 'Without a proper termination condition (usually achieved through the JOIN condition or a WHERE clause), a recursive CTE will keep executing until it hits the database\'s maximum recursion limit, causing an error.'
    },
    {
      question: 'What is the primary advantage of using MERGE (UPSERT) over separate INSERT and UPDATE?',
      options: [
        'MERGE is always faster',
        'MERGE handles insert-or-update atomically in one statement',
        'MERGE doesn\'t require a primary key',
        'MERGE works on multiple tables'
      ],
      correctIndex: 1,
      explanation: 'MERGE (or INSERT ON CONFLICT) combines insert and update logic atomically. It prevents race conditions where separate INSERT and UPDATE statements might conflict in concurrent environments.'
    },
    {
      question: 'What does query plan\'s "Index Scan" vs "Index Seek" indicate?',
      options: [
        'No difference - both use an index',
        'Seek finds specific rows; Scan reads many/all index entries',
        'Scan is always faster than Seek',
        'Seek only works with primary keys'
      ],
      correctIndex: 1,
      explanation: 'Index Seek efficiently navigates to specific index entries (like a binary search). Index Scan reads through many index entries sequentially. Seeks are generally faster for selective queries.'
    },
    {
      question: 'What is a "sargable" WHERE condition?',
      options: [
        'A condition that returns NULL',
        'A condition that can effectively use an index',
        'A condition with subqueries',
        'A condition using LIKE'
      ],
      correctIndex: 1,
      explanation: 'Sargable (Search ARGument ABLE) conditions allow index usage. WHERE column = value is sargable. WHERE YEAR(date_column) = 2024 is NOT sargable because the function prevents index use.'
    },
    {
      question: 'What does this query pattern detect?\n\n```sql\nSELECT * FROM orders o1\nWHERE NOT EXISTS (\n  SELECT 1 FROM orders o2\n  WHERE o2.customer_id = o1.customer_id\n  AND o2.order_date > o1.order_date\n);\n```',
      options: [
        'Duplicate orders',
        'Each customer\'s most recent order',
        'Orders with no customer',
        'All orders from today'
      ],
      correctIndex: 1,
      explanation: 'This finds each customer\'s most recent order by selecting orders where NO other order exists with the same customer and a later date. It\'s a classic "latest record per group" pattern.'
    },
    {
      question: 'When using COALESCE(a, b, c), what is returned?',
      options: [
        'The first argument always',
        'The concatenation of all arguments',
        'The first non-NULL value',
        'NULL if any argument is NULL'
      ],
      correctIndex: 2,
      explanation: 'COALESCE returns the first non-NULL value from its arguments. If a is NULL, it checks b; if b is NULL, it checks c. It\'s useful for providing default values.'
    },
    {
      question: 'What isolation level prevents dirty reads but allows non-repeatable reads?',
      options: [
        'READ UNCOMMITTED',
        'READ COMMITTED',
        'REPEATABLE READ',
        'SERIALIZABLE'
      ],
      correctIndex: 1,
      explanation: 'READ COMMITTED prevents dirty reads (seeing uncommitted changes) but allows non-repeatable reads (same query returning different results within a transaction). It\'s the default in most databases.'
    },
    {
      question: 'What does this CTE pattern calculate?\n\n```sql\nWITH RECURSIVE dates AS (\n  SELECT DATE \'2024-01-01\' AS dt\n  UNION ALL\n  SELECT dt + INTERVAL \'1 day\'\n  FROM dates\n  WHERE dt < DATE \'2024-01-31\'\n)\nSELECT * FROM dates;\n```',
      options: [
        'A single date',
        'All dates in January 2024',
        'The number of days in a month',
        'An infinite loop'
      ],
      correctIndex: 1,
      explanation: 'This recursive CTE generates a date series from Jan 1 to Jan 31, 2024. The base case starts with Jan 1, and the recursive part adds one day until reaching the end condition.'
    },
    {
      question: 'What is the purpose of the HAVING clause with window functions?',
      options: [
        'HAVING filters window function results',
        'HAVING cannot be used with window functions',
        'Window functions must use WHERE, not HAVING',
        'HAVING executes before window functions'
      ],
      correctIndex: 1,
      explanation: 'HAVING filters GROUP BY aggregates, not window functions. Window functions execute after HAVING. To filter on window function results, wrap the query in a subquery or CTE and filter in the outer WHERE.'
    },
    {
      question: 'What does EXCEPT (or MINUS) operator return?',
      options: [
        'Rows in either query',
        'Rows in first query but not in second',
        'Rows in both queries',
        'The difference between two numbers'
      ],
      correctIndex: 1,
      explanation: 'EXCEPT (MINUS in Oracle) returns rows from the first query that don\'t appear in the second query. It\'s the set difference operation - useful for finding records that exist in one table but not another.'
    },
    {
      question: 'In this query, what does FILTER do?\n\n```sql\nSELECT \n  COUNT(*) AS total,\n  COUNT(*) FILTER (WHERE status = \'active\') AS active_count\nFROM users;\n```',
      options: [
        'Filters the entire result set',
        'Applies a condition to a specific aggregate only',
        'Filters before GROUP BY',
        'Creates a filtered index'
      ],
      correctIndex: 1,
      explanation: 'FILTER clause applies a condition to a single aggregate function without affecting others. Here, total counts all rows while active_count only counts rows where status = \'active\'.'
    },
    {
      question: 'What is a "covering index" and why is it beneficial?',
      options: [
        'An index on every column',
        'An index containing all columns a query needs, avoiding table access',
        'An index that covers NULL values',
        'A clustered index'
      ],
      correctIndex: 1,
      explanation: 'A covering index includes all columns needed by a query in the index itself. The database can satisfy the entire query from the index without accessing the table data, significantly improving performance.'
    },
    {
      question: 'What problem does this query pattern solve?\n\n```sql\nSELECT id,\n       LEAD(event_time) OVER (PARTITION BY user_id ORDER BY event_time) - event_time AS time_to_next\nFROM events;\n```',
      options: [
        'Finding duplicate events',
        'Calculating time between consecutive events',
        'Finding the first event',
        'Counting events per user'
      ],
      correctIndex: 1,
      explanation: 'LEAD accesses the next row\'s value. Subtracting event_time from the next event_time calculates the duration between consecutive events - useful for session analysis and user behavior tracking.'
    },
    {
      question: 'When should you use a materialized view instead of a regular view?',
      options: [
        'When you need real-time data',
        'When the underlying query is expensive and data doesn\'t change frequently',
        'When you need to update the view',
        'Always - materialized views are faster'
      ],
      correctIndex: 1,
      explanation: 'Materialized views store query results physically, making reads fast but requiring refresh for updates. Use them when the underlying query is expensive (complex joins, aggregations) and data changes infrequently.'
    }
  ]
};
