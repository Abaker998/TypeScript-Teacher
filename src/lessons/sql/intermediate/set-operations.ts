import { Lesson } from '@/types/lesson';

export const sqlSetOperations: Lesson = {
  slug: 'sql-set-operations',
  title: 'Set Operations',
  description: 'Combine query results using UNION, UNION ALL, INTERSECT, and EXCEPT to merge, find common elements, or exclude data.',
  difficulty: 'intermediate',
  order: 12,
  content: `
# Set Operations

Set operations combine the results of two or more SELECT queries. Unlike JOINs (which combine columns), set operations combine rows from different queries. They're based on mathematical set theory concepts.

## The Four Set Operations

| Operation | Description |
|-----------|-------------|
| UNION | Combines results, removes duplicates |
| UNION ALL | Combines results, keeps all rows |
| INTERSECT | Returns rows that appear in both queries |
| EXCEPT | Returns rows from first query not in second |

## Requirements for Set Operations

All set operations require:
1. **Same number of columns** in each SELECT
2. **Compatible data types** in corresponding columns
3. Column names come from the **first query**

\`\`\`sql
-- Valid: Both have 2 columns with compatible types
SELECT name, email FROM customers
UNION
SELECT name, email FROM suppliers;

-- Invalid: Different number of columns
SELECT name, email FROM customers
UNION
SELECT name FROM suppliers;  -- Error!

-- Invalid: Incompatible types
SELECT name, age FROM customers
UNION
SELECT name, email FROM suppliers;  -- Error: age vs email
\`\`\`

## UNION

Combines results from multiple queries and removes duplicates:

\`\`\`sql
-- Get all unique cities from both customers and suppliers
SELECT city FROM customers
UNION
SELECT city FROM suppliers;

-- Combine different record types
SELECT 'Customer' as type, name, email FROM customers
UNION
SELECT 'Supplier' as type, name, email FROM suppliers;
\`\`\`

**How duplicates are determined:** Two rows are duplicates if ALL column values match. UNION compares entire rows.

\`\`\`sql
-- customers: (Alice, NY), (Bob, LA), (Alice, NY)
-- suppliers: (Alice, NY), (Charlie, Chicago)

SELECT name, city FROM customers
UNION
SELECT name, city FROM suppliers;

-- Result (duplicates removed):
-- Alice, NY     (appears once, not twice)
-- Bob, LA
-- Charlie, Chicago
\`\`\`

## UNION ALL

Combines results and keeps ALL rows, including duplicates:

\`\`\`sql
SELECT city FROM customers
UNION ALL
SELECT city FROM suppliers;

-- Faster than UNION (no duplicate checking)
-- Use when duplicates are OK or impossible
\`\`\`

**When to use UNION ALL:**
- When you know there can't be duplicates
- When you want to count total occurrences
- When performance matters (UNION ALL is faster)

\`\`\`sql
-- Count all contacts (customers + suppliers)
SELECT COUNT(*) as total_contacts FROM (
    SELECT email FROM customers
    UNION ALL
    SELECT email FROM suppliers
) as all_contacts;

-- UNION ALL is much faster for large datasets
-- because it skips the deduplication step
\`\`\`

## INTERSECT

Returns only rows that appear in BOTH queries:

\`\`\`sql
-- Find cities that have both customers AND suppliers
SELECT city FROM customers
INTERSECT
SELECT city FROM suppliers;

-- Find products that are in both wishlists AND carts
SELECT product_id FROM wishlists
INTERSECT
SELECT product_id FROM shopping_carts;
\`\`\`

**Note:** INTERSECT also removes duplicates from the result.

\`\`\`sql
-- customers cities: NY, LA, NY, Chicago
-- suppliers cities: NY, Boston, NY

SELECT city FROM customers
INTERSECT
SELECT city FROM suppliers;

-- Result: NY (only once, even though it appears multiple times)
\`\`\`

## EXCEPT (MINUS in Oracle)

Returns rows from the first query that are NOT in the second query:

\`\`\`sql
-- Find cities with customers but no suppliers
SELECT city FROM customers
EXCEPT
SELECT city FROM suppliers;

-- Find products never ordered
SELECT id FROM products
EXCEPT
SELECT product_id FROM order_items;
\`\`\`

**Order matters with EXCEPT:**

\`\`\`sql
-- A EXCEPT B is different from B EXCEPT A

SELECT city FROM customers  -- NY, LA, Chicago
EXCEPT
SELECT city FROM suppliers;  -- NY, Boston
-- Result: LA, Chicago

SELECT city FROM suppliers   -- NY, Boston
EXCEPT
SELECT city FROM customers;  -- NY, LA, Chicago
-- Result: Boston
\`\`\`

## Combining Multiple Set Operations

You can chain multiple set operations:

\`\`\`sql
-- Get all contacts except those who are both customers AND suppliers
SELECT email FROM customers
UNION
SELECT email FROM suppliers
EXCEPT
(
    SELECT email FROM customers
    INTERSECT
    SELECT email FROM suppliers
);
\`\`\`

**Evaluation order:** Set operations are evaluated left to right, but INTERSECT has higher precedence than UNION/EXCEPT in standard SQL.

\`\`\`sql
-- Use parentheses to control order
(SELECT a FROM t1 UNION SELECT a FROM t2)
EXCEPT
SELECT a FROM t3;
\`\`\`

## ORDER BY with Set Operations

ORDER BY applies to the entire result and goes at the end:

\`\`\`sql
-- Correct: ORDER BY at the very end
SELECT name, city FROM customers
UNION
SELECT name, city FROM suppliers
ORDER BY name;  -- Sorts the combined result

-- Wrong: ORDER BY in individual queries
SELECT name FROM customers ORDER BY name  -- Error!
UNION
SELECT name FROM suppliers;
\`\`\`

**Column references in ORDER BY:**

\`\`\`sql
-- Use column names from the FIRST query
SELECT name as contact_name, city FROM customers
UNION
SELECT company_name, location FROM suppliers
ORDER BY contact_name;  -- Uses alias from first query

-- Or use column position
SELECT name, city FROM customers
UNION
SELECT company_name, location FROM suppliers
ORDER BY 1, 2;  -- Order by first column, then second
\`\`\`

## LIMIT with Set Operations

Apply LIMIT to the final result:

\`\`\`sql
-- Get top 10 from combined results
SELECT name, 'Customer' as type FROM customers
UNION
SELECT name, 'Supplier' as type FROM suppliers
ORDER BY name
LIMIT 10;

-- To limit individual queries, use subqueries
(SELECT name FROM customers ORDER BY name LIMIT 5)
UNION
(SELECT name FROM suppliers ORDER BY name LIMIT 5);
\`\`\`

## Practical Use Cases

### Creating Unified Contact Lists

\`\`\`sql
SELECT
    'Customer' as source,
    name,
    email,
    phone
FROM customers
UNION
SELECT
    'Supplier' as source,
    contact_name,
    contact_email,
    contact_phone
FROM suppliers
UNION
SELECT
    'Partner' as source,
    name,
    email,
    phone
FROM partners
ORDER BY name;
\`\`\`

### Finding Data Discrepancies

\`\`\`sql
-- Products in inventory but not in catalog
SELECT product_id FROM inventory
EXCEPT
SELECT id FROM products;

-- Products in catalog but not in inventory
SELECT id FROM products
EXCEPT
SELECT product_id FROM inventory;
\`\`\`

### Comparing Tables During Migration

\`\`\`sql
-- Find records in old table not in new table
SELECT id, name, email FROM old_customers
EXCEPT
SELECT id, name, email FROM new_customers;

-- Find records only in new table
SELECT id, name, email FROM new_customers
EXCEPT
SELECT id, name, email FROM old_customers;
\`\`\`

### Building Reports with Totals

\`\`\`sql
-- Sales by category with grand total
SELECT category, SUM(amount) as total
FROM sales
GROUP BY category

UNION ALL

SELECT 'GRAND TOTAL', SUM(amount)
FROM sales

ORDER BY
    CASE WHEN category = 'GRAND TOTAL' THEN 1 ELSE 0 END,
    category;
\`\`\`

## Performance Considerations

\`\`\`sql
-- UNION removes duplicates (slower)
-- Requires sorting/hashing to find duplicates
SELECT email FROM customers
UNION
SELECT email FROM suppliers;

-- UNION ALL keeps everything (faster)
-- No duplicate checking needed
SELECT email FROM customers
UNION ALL
SELECT email FROM suppliers;

-- INTERSECT and EXCEPT also check duplicates (similar to UNION)
\`\`\`

**Tips:**
1. Use UNION ALL when duplicates don't matter
2. Add WHERE clauses to reduce rows before set operations
3. Index columns used in set operations

## Set Operations vs Alternatives

\`\`\`sql
-- INTERSECT vs INNER JOIN
SELECT city FROM customers
INTERSECT
SELECT city FROM suppliers;

-- Equivalent JOIN (when tables have unique cities)
SELECT DISTINCT c.city
FROM customers c
INNER JOIN suppliers s ON c.city = s.city;

-- EXCEPT vs NOT EXISTS
SELECT city FROM customers
EXCEPT
SELECT city FROM suppliers;

-- Equivalent NOT EXISTS
SELECT DISTINCT city FROM customers c
WHERE NOT EXISTS (
    SELECT 1 FROM suppliers s WHERE s.city = c.city
);
\`\`\`

## Quick Reference

| Operation | Duplicates | Performance | Use When |
|-----------|------------|-------------|----------|
| UNION | Removed | Slower | Need unique combined results |
| UNION ALL | Kept | Faster | Counting or duplicates OK |
| INTERSECT | Removed | Medium | Finding common elements |
| EXCEPT | Removed | Medium | Finding differences |
`,
  exercises: [
    {
      id: 1,
      title: 'Exercise 1: UNION to Combine Lists',
      description: `Use UNION to create a combined contact list from customers and suppliers.

**Given Tables:**
- \`customers\`: id, name, email
- \`suppliers\`: id, company_name, contact_email

**Your Task:**
Create a query that returns all unique email addresses from both tables.

**Expected columns:** email
**Order by:** email`,
      starterCode: `-- Combine email addresses from customers and suppliers
-- Use UNION to remove duplicates

`,
      solution: `SELECT email FROM customers
UNION
SELECT contact_email FROM suppliers
ORDER BY email;`,
      expectedOutput: ['email', 'alice@email.com', 'bob@email.com', 'contact@supplier1.com', 'info@supplier2.com'],
      hints: [
        'UNION combines results from two SELECT statements',
        'The column names come from the first query',
        'Both queries must have the same number of columns',
        'ORDER BY goes at the very end, after the UNION'
      ]
    },
    {
      id: 2,
      title: 'Exercise 2: UNION ALL for Counting',
      description: `Use UNION ALL to count total transactions from multiple sources.

**Given Tables:**
- \`online_orders\`: id, amount, order_date
- \`store_orders\`: id, amount, order_date

**Your Task:**
Write a query that returns the total count and sum of all orders from both sources.

**Expected output:** Single row with total_orders and total_amount`,
      starterCode: `-- Count all orders from both online and store
-- Use UNION ALL since we want to count duplicates too

`,
      solution: `SELECT
    COUNT(*) as total_orders,
    SUM(amount) as total_amount
FROM (
    SELECT amount FROM online_orders
    UNION ALL
    SELECT amount FROM store_orders
) as all_orders;`,
      expectedOutput: ['total_orders | total_amount', '150 | 45000.00'],
      hints: [
        'Use UNION ALL because we want to count all orders, not unique ones',
        'Wrap the UNION ALL in a subquery (derived table)',
        'The outer query performs the COUNT and SUM',
        'Give the subquery an alias like "all_orders"'
      ]
    },
    {
      id: 3,
      title: 'Exercise 3: INTERSECT to Find Common Elements',
      description: `Use INTERSECT to find products that appear in both the wishlist and shopping cart.

**Given Tables:**
- \`wishlists\`: user_id, product_id
- \`shopping_carts\`: user_id, product_id

**Your Task:**
Find product IDs that appear in BOTH tables (for any user).

**Expected columns:** product_id
**Order by:** product_id`,
      starterCode: `-- Find products in both wishlists AND shopping carts
-- INTERSECT returns only matching rows

`,
      solution: `SELECT product_id FROM wishlists
INTERSECT
SELECT product_id FROM shopping_carts
ORDER BY product_id;`,
      expectedOutput: ['product_id', '101', '105', '112'],
      hints: [
        'INTERSECT returns rows that appear in both query results',
        'Select product_id from both tables',
        'INTERSECT automatically removes duplicates',
        'ORDER BY goes after the INTERSECT'
      ]
    },
    {
      id: 4,
      title: 'Exercise 4: EXCEPT to Find Missing Data',
      description: `Use EXCEPT to find products in the catalog that have never been ordered.

**Given Tables:**
- \`products\`: id, product_name, price
- \`order_items\`: id, order_id, product_id, quantity

**Your Task:**
Find product IDs from the products table that don't appear in any order.

**Expected columns:** id (as product_id)
**Order by:** product_id`,
      starterCode: `-- Find products that have never been ordered
-- EXCEPT removes rows that exist in the second query

`,
      solution: `SELECT id as product_id FROM products
EXCEPT
SELECT product_id FROM order_items
ORDER BY product_id;`,
      expectedOutput: ['product_id', '108', '115', '122'],
      hints: [
        'EXCEPT returns rows from the first query NOT in the second',
        'First query: product IDs from products table',
        'Second query: product IDs that have been ordered',
        'The difference is products never ordered'
      ]
    }
  ],
  quiz: [
    {
      question: 'What is the difference between UNION and UNION ALL?',
      options: [
        'UNION is faster than UNION ALL',
        'UNION removes duplicates, UNION ALL keeps all rows',
        'UNION ALL removes duplicates, UNION keeps all rows',
        'There is no difference'
      ],
      correctIndex: 1,
      explanation: 'UNION removes duplicate rows from the combined result (like a mathematical set union), while UNION ALL keeps all rows including duplicates. UNION ALL is faster because it skips the deduplication step.'
    },
    {
      question: 'What does INTERSECT return?',
      options: [
        'All rows from both queries',
        'Rows that appear in the first query but not the second',
        'Rows that appear in both queries',
        'The difference between two queries'
      ],
      correctIndex: 2,
      explanation: 'INTERSECT returns only the rows that appear in both query results. It\'s like finding the common elements between two sets.'
    },
    {
      question: 'Where does ORDER BY go when using set operations?',
      options: [
        'At the end of each individual SELECT',
        'At the very end, after all set operations',
        'Before the set operation keyword',
        'ORDER BY cannot be used with set operations'
      ],
      correctIndex: 1,
      explanation: 'ORDER BY must be placed at the very end of the query, after all set operations. It applies to the entire combined result, not individual queries.'
    },
    {
      question: 'What requirement must SELECT statements meet to use set operations?',
      options: [
        'They must query the same table',
        'They must have the same WHERE clause',
        'They must have the same number of columns with compatible types',
        'They must return the same number of rows'
      ],
      correctIndex: 2,
      explanation: 'For set operations, each SELECT must have the same number of columns, and the corresponding columns must have compatible data types. The column names come from the first SELECT.'
    }
  ],
  buildNote: {
    title: 'Set Operations in Applications',
    explanation: `Set operations are valuable for combining data from different sources. In this app, you might use UNION to create a unified search across lessons and exercises: SELECT title, 'lesson' as type FROM lessons UNION SELECT title, 'exercise' as type FROM exercises. EXCEPT is useful for finding gaps in data - like lessons without exercises or users who haven't completed certain requirements. INTERSECT helps find overlapping data, such as users who are both contributors and students.`,
    relatedFiles: [
      'src/lib/lessons.ts',
      'src/types/lesson.ts'
    ],
    inTheRealWorld: `Production systems use set operations extensively. Data migration tools use EXCEPT to find records missing in the target database. Analytics platforms use UNION ALL to combine data from multiple time periods or regions. CRM systems use INTERSECT to find customers who meet multiple criteria. ETL (Extract, Transform, Load) processes use set operations to merge data from different sources while handling duplicates appropriately. Report generators use UNION to add summary rows to detail results.`
  }
};
