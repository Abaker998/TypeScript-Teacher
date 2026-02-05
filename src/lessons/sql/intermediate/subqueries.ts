import { Lesson } from '@/types/lesson';

export const sqlSubqueries: Lesson = {
  slug: 'sql-subqueries',
  title: 'Subqueries',
  description: 'Learn to write queries within queries using scalar subqueries, column subqueries, table subqueries, correlated subqueries, and EXISTS.',
  difficulty: 'intermediate',
  order: 11,
  content: `
# Subqueries

A subquery is a query nested inside another query. Subqueries let you build complex queries step by step, using the result of one query as input to another. They're powerful tools for filtering, comparing, and transforming data.

## Types of Subqueries

Subqueries are classified by what they return:
- **Scalar subquery**: Returns a single value (one row, one column)
- **Column subquery**: Returns a single column (multiple rows)
- **Table subquery**: Returns multiple rows and columns
- **Correlated subquery**: References the outer query

## Scalar Subqueries

Return exactly one value. Can be used anywhere a single value is expected:

\`\`\`sql
-- Find employees earning more than average
SELECT name, salary
FROM employees
WHERE salary > (SELECT AVG(salary) FROM employees);

-- Use in SELECT to add computed values
SELECT
    name,
    salary,
    salary - (SELECT AVG(salary) FROM employees) as diff_from_avg
FROM employees;

-- Use in ORDER BY
SELECT name, hire_date
FROM employees
ORDER BY (SELECT COUNT(*) FROM orders WHERE orders.employee_id = employees.id) DESC;
\`\`\`

**Important:** Scalar subqueries MUST return exactly one value. Multiple rows or columns cause an error.

\`\`\`sql
-- This works (single value)
SELECT * FROM products
WHERE price = (SELECT MAX(price) FROM products);

-- This FAILS if subquery returns multiple rows
SELECT * FROM products
WHERE price = (SELECT price FROM products WHERE category = 'Electronics');
-- Error: Subquery returns more than 1 row
\`\`\`

## Column Subqueries (IN, NOT IN, ANY, ALL)

Return a single column with multiple rows. Use with IN, NOT IN, ANY, or ALL:

### IN and NOT IN

\`\`\`sql
-- Find customers who have placed orders
SELECT name
FROM customers
WHERE id IN (SELECT customer_id FROM orders);

-- Find products not in any order
SELECT product_name
FROM products
WHERE id NOT IN (SELECT product_id FROM orders WHERE product_id IS NOT NULL);
\`\`\`

**Warning:** NOT IN behaves unexpectedly with NULL values:

\`\`\`sql
-- If any customer_id in orders is NULL, this returns NO rows!
SELECT * FROM products
WHERE id NOT IN (SELECT customer_id FROM orders);

-- Fix: Filter out NULLs
SELECT * FROM products
WHERE id NOT IN (SELECT customer_id FROM orders WHERE customer_id IS NOT NULL);

-- Or use NOT EXISTS instead (safer)
\`\`\`

### ANY and ALL

\`\`\`sql
-- ANY: True if comparison is true for at least one value
SELECT name, salary
FROM employees
WHERE salary > ANY (SELECT salary FROM employees WHERE department = 'Sales');
-- Returns employees earning more than the LOWEST sales salary

-- ALL: True if comparison is true for every value
SELECT name, salary
FROM employees
WHERE salary > ALL (SELECT salary FROM employees WHERE department = 'Sales');
-- Returns employees earning more than the HIGHEST sales salary
\`\`\`

## Table Subqueries (Derived Tables)

Return multiple rows and columns. Used in the FROM clause:

\`\`\`sql
-- Subquery as a derived table (must have an alias)
SELECT dept_stats.department, dept_stats.avg_salary
FROM (
    SELECT department, AVG(salary) as avg_salary
    FROM employees
    GROUP BY department
) AS dept_stats
WHERE dept_stats.avg_salary > 60000;

-- Join with a derived table
SELECT e.name, e.salary, dept_avg.avg_salary
FROM employees e
JOIN (
    SELECT department, AVG(salary) as avg_salary
    FROM employees
    GROUP BY department
) AS dept_avg ON e.department = dept_avg.department
WHERE e.salary > dept_avg.avg_salary;
\`\`\`

## Correlated Subqueries

Reference columns from the outer query. Executed once per row of the outer query:

\`\`\`sql
-- Find employees earning more than their department average
SELECT e.name, e.salary, e.department
FROM employees e
WHERE e.salary > (
    SELECT AVG(e2.salary)
    FROM employees e2
    WHERE e2.department = e.department  -- References outer query's e.department
);

-- Get each customer's most recent order
SELECT c.name, o.order_date, o.amount
FROM customers c
JOIN orders o ON c.id = o.customer_id
WHERE o.order_date = (
    SELECT MAX(o2.order_date)
    FROM orders o2
    WHERE o2.customer_id = c.id  -- Correlated to outer query
);
\`\`\`

**Performance Note:** Correlated subqueries can be slow because they execute for each row. Consider rewriting with JOINs when possible.

## EXISTS and NOT EXISTS

Test whether a subquery returns any rows. More efficient than IN for large datasets:

\`\`\`sql
-- Find customers who have placed orders (EXISTS)
SELECT c.name
FROM customers c
WHERE EXISTS (
    SELECT 1
    FROM orders o
    WHERE o.customer_id = c.id
);

-- Find customers who have never ordered (NOT EXISTS)
SELECT c.name
FROM customers c
WHERE NOT EXISTS (
    SELECT 1
    FROM orders o
    WHERE o.customer_id = c.id
);
\`\`\`

**Why EXISTS is preferred:**
1. Stops searching as soon as one match is found
2. Handles NULLs correctly (unlike NOT IN)
3. Often faster with proper indexes

\`\`\`sql
-- EXISTS only checks IF rows exist, not what they contain
-- So SELECT 1, SELECT *, SELECT 'anything' all work the same
WHERE EXISTS (SELECT 1 FROM ...)
WHERE EXISTS (SELECT * FROM ...)  -- Same result, but SELECT 1 is cleaner
\`\`\`

## Subqueries in Different Clauses

### In SELECT (Scalar)

\`\`\`sql
SELECT
    name,
    salary,
    (SELECT AVG(salary) FROM employees) as company_avg,
    (SELECT COUNT(*) FROM orders WHERE orders.employee_id = employees.id) as order_count
FROM employees;
\`\`\`

### In FROM (Derived Table)

\`\`\`sql
SELECT * FROM (
    SELECT category, COUNT(*) as product_count
    FROM products
    GROUP BY category
) AS category_counts
WHERE product_count > 10;
\`\`\`

### In WHERE (Most Common)

\`\`\`sql
SELECT * FROM products
WHERE price > (SELECT AVG(price) FROM products)
  AND category_id IN (SELECT id FROM categories WHERE active = true);
\`\`\`

### In HAVING

\`\`\`sql
SELECT department, AVG(salary) as avg_salary
FROM employees
GROUP BY department
HAVING AVG(salary) > (SELECT AVG(salary) FROM employees);
\`\`\`

## Common Subquery Patterns

### Find Top N Per Group

\`\`\`sql
-- Top 3 highest paid employees per department
SELECT e.name, e.department, e.salary
FROM employees e
WHERE (
    SELECT COUNT(*)
    FROM employees e2
    WHERE e2.department = e.department AND e2.salary > e.salary
) < 3
ORDER BY department, salary DESC;
\`\`\`

### Find Duplicates

\`\`\`sql
SELECT *
FROM products p1
WHERE EXISTS (
    SELECT 1 FROM products p2
    WHERE p2.product_name = p1.product_name
      AND p2.id != p1.id
);
\`\`\`

### Conditional Aggregation

\`\`\`sql
SELECT
    department,
    (SELECT COUNT(*) FROM employees e WHERE e.department = d.name) as emp_count,
    (SELECT AVG(salary) FROM employees e WHERE e.department = d.name) as avg_salary
FROM departments d;
\`\`\`

## Subquery vs JOIN

Many subqueries can be rewritten as JOINs:

\`\`\`sql
-- Subquery version
SELECT name FROM customers
WHERE id IN (SELECT customer_id FROM orders WHERE amount > 100);

-- JOIN version (often more efficient)
SELECT DISTINCT c.name
FROM customers c
JOIN orders o ON c.id = o.customer_id
WHERE o.amount > 100;

-- NOT EXISTS version
SELECT name FROM customers c
WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id);

-- LEFT JOIN version
SELECT c.name
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
WHERE o.id IS NULL;
\`\`\`

**When to use subqueries:**
- When the logic is clearer as nested queries
- When you need to reference the same aggregation multiple times
- With EXISTS for existence checks

**When to use JOINs:**
- When you need columns from multiple tables in the result
- When performance is critical (JOINs are often faster)
- When the query optimizer can better optimize the execution plan

## Quick Reference

| Subquery Type | Returns | Used With |
|---------------|---------|-----------|
| Scalar | Single value | =, >, <, comparisons |
| Column | Single column, multiple rows | IN, NOT IN, ANY, ALL |
| Table | Multiple rows and columns | FROM clause (derived table) |
| Correlated | References outer query | WHERE, SELECT, HAVING |
| EXISTS | Boolean (rows exist?) | WHERE EXISTS/NOT EXISTS |
`,
  exercises: [
    {
      id: 1,
      title: 'Exercise 1: Scalar Subquery',
      description: `Use a scalar subquery to find products priced above average.

**Given Table:**
- \`products\`: id, product_name, price, category

**Your Task:**
Write a query that returns products with a price higher than the average price of all products.

**Expected columns:** product_name, price
**Order by:** price DESC`,
      starterCode: `-- Find products priced above the average
-- Use a subquery to calculate the average price

`,
      solution: `SELECT product_name, price
FROM products
WHERE price > (SELECT AVG(price) FROM products)
ORDER BY price DESC;`,
      expectedOutput: ['product_name | price', 'Laptop | 999.99', 'Tablet | 499.99', 'Monitor | 299.99'],
      hints: [
        'The subquery calculates AVG(price) from all products',
        'Use this subquery in the WHERE clause with > comparison',
        'Wrap the subquery in parentheses',
        'The subquery goes after the comparison operator: WHERE price > (subquery)'
      ]
    },
    {
      id: 2,
      title: 'Exercise 2: Column Subquery with IN',
      description: `Use IN with a subquery to find customers who have placed orders.

**Given Tables:**
- \`customers\`: id, name, email
- \`orders\`: id, customer_id, order_date

**Your Task:**
Write a query that returns names of customers who have at least one order.

**Expected columns:** name
**Order by:** name`,
      starterCode: `-- Find customers who have placed orders
-- Use IN with a subquery on the orders table

`,
      solution: `SELECT name
FROM customers
WHERE id IN (SELECT customer_id FROM orders)
ORDER BY name;`,
      expectedOutput: ['name', 'Alice', 'Bob', 'Charlie'],
      hints: [
        'First, think about what the subquery should return: customer_id values from orders',
        'The subquery is: SELECT customer_id FROM orders',
        'Use this subquery with IN to filter customers',
        'WHERE id IN (subquery) checks if the customer id is in the result'
      ]
    },
    {
      id: 3,
      title: 'Exercise 3: EXISTS Subquery',
      description: `Use EXISTS to find departments that have at least one employee.

**Given Tables:**
- \`departments\`: id, department_name
- \`employees\`: id, name, department_id

**Your Task:**
Write a query using EXISTS that returns department names that have employees.

**Expected columns:** department_name
**Order by:** department_name`,
      starterCode: `-- Find departments with at least one employee
-- Use EXISTS with a correlated subquery

`,
      solution: `SELECT department_name
FROM departments d
WHERE EXISTS (
    SELECT 1
    FROM employees e
    WHERE e.department_id = d.id
)
ORDER BY department_name;`,
      expectedOutput: ['department_name', 'Engineering', 'Marketing', 'Sales'],
      hints: [
        'EXISTS checks if the subquery returns any rows',
        'The subquery must be correlated - reference the outer query',
        'Link employees.department_id to the outer departments.id',
        'SELECT 1 in the subquery is a common convention with EXISTS'
      ]
    },
    {
      id: 4,
      title: 'Exercise 4: Correlated Subquery',
      description: `Use a correlated subquery to find each employee's salary compared to their department average.

**Given Table:**
- \`employees\`: id, name, department, salary

**Your Task:**
Write a query that returns employees earning more than their department's average salary.

**Expected columns:** name, department, salary
**Order by:** department, salary DESC`,
      starterCode: `-- Find employees earning above their department average
-- The subquery must reference the outer query's department

`,
      solution: `SELECT name, department, salary
FROM employees e
WHERE salary > (
    SELECT AVG(salary)
    FROM employees e2
    WHERE e2.department = e.department
)
ORDER BY department, salary DESC;`,
      expectedOutput: ['name | department | salary', 'Alice | Engineering | 95000', 'Charlie | Marketing | 72000', 'Eve | Sales | 68000'],
      hints: [
        'The subquery calculates AVG(salary) for a specific department',
        'Correlate it by matching e2.department = e.department',
        'The subquery runs for each row in the outer query',
        'Use aliases (e and e2) to distinguish outer and inner employees tables'
      ]
    }
  ],
  quiz: [
    {
      question: 'What is a scalar subquery?',
      options: [
        'A subquery that returns multiple columns',
        'A subquery that returns exactly one value',
        'A subquery that references the outer query',
        'A subquery used only in the FROM clause'
      ],
      correctIndex: 1,
      explanation: 'A scalar subquery returns exactly one value (one row, one column). It can be used anywhere a single value is expected, such as in comparisons or calculations.'
    },
    {
      question: 'What does EXISTS return?',
      options: [
        'The actual rows from the subquery',
        'A count of matching rows',
        'TRUE if the subquery returns any rows, FALSE otherwise',
        'The first row of the subquery'
      ],
      correctIndex: 2,
      explanation: 'EXISTS returns a boolean: TRUE if the subquery returns at least one row, FALSE if it returns no rows. It doesn\'t care about the actual values, just whether rows exist.'
    },
    {
      question: 'What is a correlated subquery?',
      options: [
        'A subquery that runs only once',
        'A subquery that references columns from the outer query',
        'A subquery that returns correlated data',
        'A subquery used with JOIN'
      ],
      correctIndex: 1,
      explanation: 'A correlated subquery references columns from the outer query, meaning it must be re-executed for each row of the outer query. This creates a dependency between the inner and outer queries.'
    },
    {
      question: 'Why might NOT EXISTS be preferred over NOT IN?',
      options: [
        'NOT EXISTS is always faster',
        'NOT IN cannot be used with subqueries',
        'NOT EXISTS handles NULL values correctly',
        'NOT EXISTS returns more columns'
      ],
      correctIndex: 2,
      explanation: 'NOT IN can produce unexpected results when the subquery contains NULL values (it returns no rows). NOT EXISTS handles NULLs correctly and is often more efficient with proper indexes.'
    }
  ],
  buildNote: {
    title: 'Subqueries in Application Development',
    explanation: `Subqueries are essential for complex data retrieval. In this learning app, a subquery might be used to find users who have completed more lessons than average: SELECT * FROM users WHERE (SELECT COUNT(*) FROM progress WHERE progress.user_id = users.id) > (SELECT AVG(lesson_count) FROM user_stats). Subqueries shine when you need to filter based on aggregated data or check for the existence of related records. They're also used in reporting dashboards to calculate metrics like "products with above-average sales" or "customers who haven't ordered in 30 days."`,
    relatedFiles: [
      'src/lib/progress.ts',
      'src/types/lesson.ts'
    ],
    inTheRealWorld: `Production systems use subqueries extensively for business logic. E-commerce platforms use EXISTS to check inventory before processing orders. Analytics systems use correlated subqueries to calculate running totals and rankings. CRM systems use NOT EXISTS to find leads without follow-up activities. However, correlated subqueries can be performance bottlenecks - experienced developers often rewrite them as JOINs or use window functions for better performance. Query analyzers like EXPLAIN help identify when subqueries are causing slow queries.`
  }
};
