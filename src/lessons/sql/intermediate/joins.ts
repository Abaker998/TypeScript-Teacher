import { Lesson } from '@/types/lesson';

export const sqlJoins: Lesson = {
  slug: 'sql-joins',
  title: 'SQL Joins',
  description: 'Master the art of combining data from multiple tables using INNER JOIN, LEFT JOIN, RIGHT JOIN, FULL OUTER JOIN, CROSS JOIN, and self joins.',
  difficulty: 'intermediate',
  order: 10,
  content: `
# SQL Joins

Joins are one of the most powerful features in SQL. They allow you to combine rows from two or more tables based on a related column between them. Understanding joins is essential for working with relational databases.

## Why Joins Matter

In a normalized database, data is spread across multiple tables to reduce redundancy. Joins let you reconstruct meaningful information by connecting these tables:

\`\`\`sql
-- Without joins, you'd need multiple queries
-- With joins, you get complete information in one query
SELECT
    orders.order_id,
    customers.name,
    products.product_name
FROM orders
JOIN customers ON orders.customer_id = customers.id
JOIN products ON orders.product_id = products.id;
\`\`\`

## INNER JOIN

The most common type of join. Returns only rows where there's a match in BOTH tables:

\`\`\`sql
-- Basic INNER JOIN syntax
SELECT columns
FROM table1
INNER JOIN table2 ON table1.column = table2.column;

-- Example: Get orders with customer names
SELECT
    orders.order_id,
    orders.order_date,
    customers.name,
    customers.email
FROM orders
INNER JOIN customers ON orders.customer_id = customers.id;
\`\`\`

**Key Point:** If a customer has no orders, or an order has no matching customer, those rows are NOT included.

\`\`\`sql
-- Customers table:
-- | id | name    |
-- | 1  | Alice   |
-- | 2  | Bob     |
-- | 3  | Charlie |

-- Orders table:
-- | order_id | customer_id | amount |
-- | 101      | 1           | 50.00  |
-- | 102      | 1           | 75.00  |
-- | 103      | 2           | 30.00  |

-- INNER JOIN result (Charlie has no orders, so not included):
-- | order_id | name  | amount |
-- | 101      | Alice | 50.00  |
-- | 102      | Alice | 75.00  |
-- | 103      | Bob   | 30.00  |
\`\`\`

## LEFT JOIN (LEFT OUTER JOIN)

Returns ALL rows from the left table, plus matching rows from the right table. Non-matching rows get NULL values:

\`\`\`sql
SELECT
    customers.name,
    orders.order_id,
    orders.amount
FROM customers
LEFT JOIN orders ON customers.id = orders.customer_id;

-- Result (ALL customers shown, even Charlie with no orders):
-- | name    | order_id | amount |
-- | Alice   | 101      | 50.00  |
-- | Alice   | 102      | 75.00  |
-- | Bob     | 103      | 30.00  |
-- | Charlie | NULL     | NULL   |
\`\`\`

**Use Case:** Find customers who haven't placed orders:

\`\`\`sql
SELECT customers.name
FROM customers
LEFT JOIN orders ON customers.id = orders.customer_id
WHERE orders.order_id IS NULL;
-- Returns: Charlie
\`\`\`

## RIGHT JOIN (RIGHT OUTER JOIN)

Returns ALL rows from the right table, plus matching rows from the left table:

\`\`\`sql
SELECT
    orders.order_id,
    customers.name
FROM orders
RIGHT JOIN customers ON orders.customer_id = customers.id;

-- Equivalent to LEFT JOIN with tables swapped
\`\`\`

**Note:** RIGHT JOIN is less commonly used. Most developers prefer LEFT JOIN and just swap the table order.

## FULL OUTER JOIN

Returns ALL rows from BOTH tables. Matches where possible, NULL where not:

\`\`\`sql
SELECT
    customers.name,
    orders.order_id
FROM customers
FULL OUTER JOIN orders ON customers.id = orders.customer_id;

-- Returns ALL customers AND all orders
-- Unmatched rows from either side get NULLs
\`\`\`

**Use Case:** Find orphaned records on both sides:

\`\`\`sql
SELECT
    customers.id as customer_id,
    orders.order_id
FROM customers
FULL OUTER JOIN orders ON customers.id = orders.customer_id
WHERE customers.id IS NULL OR orders.order_id IS NULL;
\`\`\`

**Note:** MySQL doesn't support FULL OUTER JOIN directly. Use UNION of LEFT and RIGHT joins.

## CROSS JOIN

Returns the Cartesian product - every row from table1 paired with every row from table2:

\`\`\`sql
SELECT
    colors.name as color,
    sizes.name as size
FROM colors
CROSS JOIN sizes;

-- If colors has 3 rows and sizes has 4 rows
-- Result has 3 × 4 = 12 rows (all combinations)
\`\`\`

**Use Case:** Generate all possible combinations (like product variants):

\`\`\`sql
-- Generate all size/color combinations for a product
SELECT
    'T-Shirt' as product,
    colors.name as color,
    sizes.name as size
FROM colors
CROSS JOIN sizes;
\`\`\`

**Warning:** CROSS JOIN can produce huge result sets. A 1000-row table crossed with a 1000-row table = 1,000,000 rows!

## Self Join

A table joined to itself. Useful for hierarchical data or comparing rows within the same table:

\`\`\`sql
-- Employees table with manager_id pointing to another employee
-- | id | name    | manager_id |
-- | 1  | Alice   | NULL       |
-- | 2  | Bob     | 1          |
-- | 3  | Charlie | 1          |
-- | 4  | Diana   | 2          |

-- Find employees and their managers
SELECT
    e.name as employee,
    m.name as manager
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.id;

-- Result:
-- | employee | manager |
-- | Alice    | NULL    |
-- | Bob      | Alice   |
-- | Charlie  | Alice   |
-- | Diana    | Bob     |
\`\`\`

**Use Case:** Find pairs of customers from the same city:

\`\`\`sql
SELECT
    c1.name as customer1,
    c2.name as customer2,
    c1.city
FROM customers c1
JOIN customers c2 ON c1.city = c2.city
WHERE c1.id < c2.id;  -- Avoid duplicates and self-pairs
\`\`\`

## Multiple Joins

You can chain multiple joins together:

\`\`\`sql
SELECT
    o.order_id,
    c.name as customer,
    p.product_name,
    p.price,
    o.quantity,
    (p.price * o.quantity) as total
FROM orders o
JOIN customers c ON o.customer_id = c.id
JOIN products p ON o.product_id = p.id
JOIN categories cat ON p.category_id = cat.id
WHERE cat.name = 'Electronics'
ORDER BY o.order_date DESC;
\`\`\`

## Join Conditions

Join conditions can be complex:

\`\`\`sql
-- Multiple conditions
SELECT *
FROM orders o
JOIN shipments s ON o.order_id = s.order_id
                AND o.warehouse_id = s.warehouse_id;

-- Non-equality joins
SELECT
    e.name,
    s.level
FROM employees e
JOIN salary_grades s ON e.salary BETWEEN s.min_salary AND s.max_salary;

-- Joins with OR (use carefully - can be slow)
SELECT *
FROM products p
JOIN tags t ON p.id = t.product_id OR p.category_id = t.category_id;
\`\`\`

## Table Aliases

Aliases make queries more readable and are required for self-joins:

\`\`\`sql
-- Without aliases (verbose)
SELECT orders.order_id, customers.name
FROM orders
JOIN customers ON orders.customer_id = customers.id;

-- With aliases (clean)
SELECT o.order_id, c.name
FROM orders o
JOIN customers c ON o.customer_id = c.id;
\`\`\`

## Join Performance Tips

\`\`\`sql
-- 1. Always join on indexed columns
CREATE INDEX idx_orders_customer ON orders(customer_id);

-- 2. Filter early with WHERE
SELECT o.*, c.name
FROM orders o
JOIN customers c ON o.customer_id = c.id
WHERE o.order_date > '2024-01-01';  -- Filter reduces rows before join

-- 3. Select only needed columns
SELECT o.order_id, c.name  -- Better than SELECT *
FROM orders o
JOIN customers c ON o.customer_id = c.id;

-- 4. Use EXPLAIN to analyze join performance
EXPLAIN SELECT ...
\`\`\`

## Common Join Patterns

\`\`\`sql
-- Pattern 1: Get aggregates with details
SELECT
    c.name,
    COUNT(o.order_id) as order_count,
    SUM(o.amount) as total_spent
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
GROUP BY c.id, c.name;

-- Pattern 2: Find latest record per group
SELECT c.*, o.*
FROM customers c
JOIN orders o ON c.id = o.customer_id
WHERE o.order_date = (
    SELECT MAX(o2.order_date)
    FROM orders o2
    WHERE o2.customer_id = c.id
);

-- Pattern 3: Many-to-many through junction table
SELECT
    s.name as student,
    c.name as course
FROM students s
JOIN enrollments e ON s.id = e.student_id
JOIN courses c ON e.course_id = c.id;
\`\`\`

## Visual Summary

\`\`\`
INNER JOIN:       Only matching rows
                  [  A ∩ B  ]

LEFT JOIN:        All from left + matches from right
                  [A (A ∩ B)]

RIGHT JOIN:       All from right + matches from left
                  [(A ∩ B) B]

FULL OUTER JOIN:  All from both tables
                  [A (A ∩ B) B]

CROSS JOIN:       Every combination
                  A × B
\`\`\`

## Quick Reference

| Join Type | Returns | NULL Handling |
|-----------|---------|---------------|
| INNER JOIN | Only matching rows | No NULLs (non-matches excluded) |
| LEFT JOIN | All left + matching right | NULL for non-matching right |
| RIGHT JOIN | All right + matching left | NULL for non-matching left |
| FULL OUTER JOIN | All from both | NULL for non-matching on either side |
| CROSS JOIN | Cartesian product | No NULLs (all combinations) |
| Self Join | Table with itself | Depends on join type used |
`,
  exercises: [
    {
      id: 1,
      title: 'Exercise 1: Basic INNER JOIN',
      description: `Practice combining data from two related tables using INNER JOIN.

**Given Tables:**
- \`employees\`: id, name, department_id
- \`departments\`: id, department_name

**Your Task:**
Write a query that returns employee names alongside their department names.

**Expected columns:** employee_name, department_name
**Order by:** employee_name`,
      starterCode: `-- Write your INNER JOIN query here
-- Select name (as employee_name) from employees
-- and department_name from departments

`,
      solution: `SELECT
    e.name AS employee_name,
    d.department_name
FROM employees e
INNER JOIN departments d ON e.department_id = d.id
ORDER BY e.name;`,
      expectedOutput: ['employee_name | department_name', 'Alice | Engineering', 'Bob | Marketing', 'Charlie | Engineering'],
      hints: [
        'Start with SELECT and list the columns you need from both tables',
        'Use FROM employees to specify the first table',
        'Add INNER JOIN departments ON to connect the tables',
        'The join condition links employees.department_id to departments.id'
      ]
    },
    {
      id: 2,
      title: 'Exercise 2: LEFT JOIN to Find Missing Data',
      description: `Use LEFT JOIN to find customers who have never placed an order.

**Given Tables:**
- \`customers\`: id, name, email
- \`orders\`: id, customer_id, order_date, amount

**Your Task:**
Write a query that returns customers who have NO orders.

**Expected columns:** customer_name, email
**Hint:** After a LEFT JOIN, non-matching rows have NULL values`,
      starterCode: `-- Find customers with no orders
-- Use LEFT JOIN and check for NULL order values

`,
      solution: `SELECT
    c.name AS customer_name,
    c.email
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
WHERE o.id IS NULL;`,
      expectedOutput: ['customer_name | email', 'David | david@email.com', 'Eve | eve@email.com'],
      hints: [
        'LEFT JOIN keeps all customers even if they have no orders',
        'Non-matching rows will have NULL in the orders columns',
        'Use WHERE o.id IS NULL to filter only non-matching rows',
        'Select customer name and email from the customers table'
      ]
    },
    {
      id: 3,
      title: 'Exercise 3: Self Join for Hierarchical Data',
      description: `Use a self join to display employees and their managers.

**Given Table:**
- \`employees\`: id, name, manager_id (references employees.id)

**Your Task:**
Write a query that shows each employee's name and their manager's name.
Include employees without managers (show NULL for manager).

**Expected columns:** employee_name, manager_name
**Order by:** employee_name`,
      starterCode: `-- Self join to find employee-manager pairs
-- Some employees have no manager (CEO, etc.)

`,
      solution: `SELECT
    e.name AS employee_name,
    m.name AS manager_name
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.id
ORDER BY e.name;`,
      expectedOutput: ['employee_name | manager_name', 'Alice | NULL', 'Bob | Alice', 'Charlie | Alice', 'Diana | Bob'],
      hints: [
        'Join the employees table to itself using different aliases (e and m)',
        'Use LEFT JOIN since some employees (like CEO) have no manager',
        'Link e.manager_id to m.id to find the manager record',
        'Select e.name as employee and m.name as manager'
      ]
    },
    {
      id: 4,
      title: 'Exercise 4: Multiple Table Join',
      description: `Practice joining three tables together to get a complete order summary.

**Given Tables:**
- \`orders\`: id, customer_id, product_id, quantity, order_date
- \`customers\`: id, name
- \`products\`: id, product_name, price

**Your Task:**
Write a query that returns order details with customer name, product name, and total price (price * quantity).

**Expected columns:** order_id, customer_name, product_name, total_price
**Order by:** order_id`,
      starterCode: `-- Join three tables to get complete order information
-- Calculate total_price as price * quantity

`,
      solution: `SELECT
    o.id AS order_id,
    c.name AS customer_name,
    p.product_name,
    (p.price * o.quantity) AS total_price
FROM orders o
JOIN customers c ON o.customer_id = c.id
JOIN products p ON o.product_id = p.id
ORDER BY o.id;`,
      expectedOutput: ['order_id | customer_name | product_name | total_price', '1 | Alice | Laptop | 999.99', '2 | Bob | Mouse | 49.98', '3 | Alice | Keyboard | 79.99'],
      hints: [
        'Start by joining orders to customers on customer_id',
        'Then join the result to products on product_id',
        'Calculate total_price using (p.price * o.quantity)',
        'Use table aliases to keep the query clean'
      ]
    }
  ],
  quiz: [
    {
      question: 'What does an INNER JOIN return?',
      options: [
        'All rows from both tables',
        'Only rows where there is a match in both tables',
        'All rows from the left table only',
        'The Cartesian product of both tables'
      ],
      correctIndex: 1,
      explanation: 'INNER JOIN returns only the rows where the join condition is satisfied in both tables. Rows without matches are excluded from the result.'
    },
    {
      question: 'When would you use a LEFT JOIN instead of an INNER JOIN?',
      options: [
        'When you want faster query performance',
        'When you want to include all rows from the left table, even without matches',
        'When both tables have the same number of rows',
        'When you want to exclude NULL values'
      ],
      correctIndex: 1,
      explanation: 'LEFT JOIN preserves all rows from the left table and fills in NULL values for columns from the right table when there\'s no match. This is useful for finding records without related data.'
    },
    {
      question: 'What is a self join?',
      options: [
        'A join that automatically matches all columns',
        'A join between two identical copies of a table',
        'A table joined to itself using aliases',
        'A join that only returns duplicate rows'
      ],
      correctIndex: 2,
      explanation: 'A self join joins a table to itself, using aliases to distinguish between the two instances. It\'s commonly used for hierarchical data like employee-manager relationships.'
    },
    {
      question: 'What does a CROSS JOIN produce?',
      options: [
        'Only rows that match in both tables',
        'The Cartesian product (all possible row combinations)',
        'Rows where values cross a threshold',
        'A union of both tables'
      ],
      correctIndex: 1,
      explanation: 'CROSS JOIN produces the Cartesian product - every row from the first table paired with every row from the second table. If tables have M and N rows, the result has M × N rows.'
    }
  ],
  buildNote: {
    title: 'Joins in the Real World',
    explanation: `Joins are fundamental to any application with a relational database. In this teaching app, user progress data might be stored in separate tables - a \`users\` table and a \`lesson_progress\` table. To display a user's complete learning history, you'd join these tables on the user ID. E-commerce sites join orders, customers, products, and shipping tables to display order history. Social media apps join users, posts, comments, and likes tables to render a news feed. The key is proper database design with clear foreign key relationships, then using the right join type: INNER JOIN for required relationships, LEFT JOIN when the related data is optional, and avoiding CROSS JOIN unless you truly need all combinations.`,
    relatedFiles: [
      'src/types/lesson.ts',
      'src/lib/progress.ts'
    ],
    inTheRealWorld: `In production databases, joins are executed millions of times per day. Performance optimization is critical - join conditions should use indexed columns, and query planners analyze join order for efficiency. ORMs like Prisma, TypeORM, and Sequelize generate join queries from model relationships. Analytics platforms like Looker and Tableau build complex multi-table joins through visual interfaces. Data warehouses use star schemas optimized for join performance. Understanding joins deeply helps you write efficient queries and design databases that perform well at scale.`
  }
};
