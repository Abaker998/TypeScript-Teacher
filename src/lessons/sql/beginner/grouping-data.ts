import { Lesson } from '@/types/lesson';

export const groupingData: Lesson = {
  slug: 'sql-grouping-data',
  title: 'Grouping Data',
  description: 'Learn to group rows and calculate summaries per group using GROUP BY and HAVING clauses.',
  difficulty: 'beginner',
  order: 5,
  content: `
# Grouping Data with GROUP BY

GROUP BY divides rows into groups and lets you calculate aggregate values for each group. Instead of one total, you get subtotals per category.

## Basic GROUP BY

Group rows by a column and calculate aggregates per group:

\`\`\`sql
-- Count employees per department
SELECT department, COUNT(*) AS employee_count
FROM employees
GROUP BY department;
\`\`\`

Result:
| department | employee_count |
|------------|----------------|
| Sales | 5 |
| Engineering | 8 |
| Marketing | 3 |

## How GROUP BY Works

1. SQL divides rows into groups based on column values
2. Rows with the same value go into the same group
3. Aggregate functions calculate one result per group

\`\`\`sql
-- Average salary per department
SELECT department, AVG(salary) AS avg_salary
FROM employees
GROUP BY department;

-- Total sales per product
SELECT product_id, SUM(quantity) AS total_sold
FROM order_items
GROUP BY product_id;
\`\`\`

## Multiple Aggregates per Group

Calculate several summaries at once:

\`\`\`sql
SELECT
    department,
    COUNT(*) AS employee_count,
    SUM(salary) AS total_salary,
    AVG(salary) AS avg_salary,
    MIN(salary) AS min_salary,
    MAX(salary) AS max_salary
FROM employees
GROUP BY department;
\`\`\`

## Grouping by Multiple Columns

Group by combinations of column values:

\`\`\`sql
-- Count employees per department AND job title
SELECT department, job_title, COUNT(*) AS count
FROM employees
GROUP BY department, job_title;
\`\`\`

Result:
| department | job_title | count |
|------------|-----------|-------|
| Sales | Manager | 2 |
| Sales | Associate | 3 |
| Engineering | Senior Dev | 4 |
| Engineering | Junior Dev | 4 |

## The SELECT and GROUP BY Rule

**Important:** When using GROUP BY, every column in SELECT must either:
1. Be in the GROUP BY clause, OR
2. Be inside an aggregate function

\`\`\`sql
-- CORRECT: department is in GROUP BY, salary is aggregated
SELECT department, AVG(salary)
FROM employees
GROUP BY department;

-- WRONG: first_name is neither grouped nor aggregated
SELECT department, first_name, AVG(salary)  -- Error!
FROM employees
GROUP BY department;
\`\`\`

## Filtering Groups with HAVING

WHERE filters rows before grouping. HAVING filters groups after grouping:

\`\`\`sql
-- Find departments with more than 5 employees
SELECT department, COUNT(*) AS employee_count
FROM employees
GROUP BY department
HAVING COUNT(*) > 5;

-- Find products with total sales over $10,000
SELECT product_id, SUM(quantity * unit_price) AS total_sales
FROM order_items
GROUP BY product_id
HAVING SUM(quantity * unit_price) > 10000;
\`\`\`

## WHERE vs HAVING

| Clause | When It Runs | Filters What |
|--------|--------------|--------------|
| WHERE | Before grouping | Individual rows |
| HAVING | After grouping | Groups/aggregates |

\`\`\`sql
-- WHERE filters rows, HAVING filters groups
SELECT department, AVG(salary) AS avg_salary
FROM employees
WHERE hire_date >= '2020-01-01'   -- Only recent hires
GROUP BY department
HAVING AVG(salary) > 60000;       -- Only high-paying depts
\`\`\`

## Combining WHERE and HAVING

Use both to filter at different stages:

\`\`\`sql
-- Find departments where:
-- 1. Only count active employees (WHERE)
-- 2. Department has at least 3 active employees (HAVING)
SELECT department, COUNT(*) AS active_count
FROM employees
WHERE status = 'Active'
GROUP BY department
HAVING COUNT(*) >= 3;
\`\`\`

## ORDER BY with GROUP BY

Sort your grouped results:

\`\`\`sql
-- Departments ordered by employee count (descending)
SELECT department, COUNT(*) AS employee_count
FROM employees
GROUP BY department
ORDER BY employee_count DESC;

-- Or use the aggregate directly
SELECT department, COUNT(*) AS employee_count
FROM employees
GROUP BY department
ORDER BY COUNT(*) DESC;
\`\`\`

## Query Execution Order

Understanding the order helps write correct queries:

1. **FROM** - Identify tables
2. **WHERE** - Filter individual rows
3. **GROUP BY** - Form groups
4. **HAVING** - Filter groups
5. **SELECT** - Choose columns and calculate aggregates
6. **ORDER BY** - Sort results

## Common GROUP BY Patterns

\`\`\`sql
-- Sales by month
SELECT
    EXTRACT(YEAR FROM order_date) AS year,
    EXTRACT(MONTH FROM order_date) AS month,
    SUM(total_amount) AS monthly_sales
FROM orders
GROUP BY EXTRACT(YEAR FROM order_date), EXTRACT(MONTH FROM order_date)
ORDER BY year, month;

-- Customer order summary
SELECT
    customer_id,
    COUNT(*) AS order_count,
    SUM(total_amount) AS total_spent,
    AVG(total_amount) AS avg_order
FROM orders
GROUP BY customer_id
HAVING COUNT(*) >= 5;  -- Customers with 5+ orders

-- Category performance
SELECT
    category,
    COUNT(*) AS product_count,
    AVG(price) AS avg_price,
    SUM(units_sold) AS total_units
FROM products
GROUP BY category
ORDER BY total_units DESC;
\`\`\`

## Quick Reference

| Clause | Purpose | Example |
|--------|---------|---------|
| GROUP BY col | Group rows by column | GROUP BY department |
| GROUP BY a, b | Group by multiple columns | GROUP BY year, month |
| HAVING condition | Filter groups | HAVING COUNT(*) > 10 |
| WHERE + GROUP BY | Filter rows, then group | WHERE status = 'Active' GROUP BY dept |

## Learning Objectives

By the end of this lesson, you'll be able to:
- Group rows using GROUP BY
- Calculate aggregates for each group
- Group by multiple columns
- Filter groups using HAVING
- Understand the difference between WHERE and HAVING
- Order grouped results
`,
  exercises: [
    {
      id: 1,
      title: 'Exercise 1: Basic GROUP BY',
      description: `Count employees in each department.

**Your task:**
Write a query to count the number of employees in each department. Show department and employee_count.

**Table: employees**
| employee_id | first_name | department |
|-------------|------------|------------|
| 1 | John | Sales |
| 2 | Sarah | Engineering |
| 3 | Michael | Sales |
| 4 | Emily | Engineering |
| 5 | David | Marketing |
| 6 | Lisa | Engineering |`,
      starterCode: `-- Count employees per department

`,
      solution: `SELECT department, COUNT(*) AS employee_count
FROM employees
GROUP BY department;`,
      expectedOutput: [
        'Sales|2',
        'Engineering|3',
        'Marketing|1'
      ],
      hints: [
        'Use GROUP BY to group by department',
        'Use COUNT(*) to count rows in each group',
        'Give the count a name with AS employee_count',
        'Syntax: SELECT col, COUNT(*) FROM table GROUP BY col'
      ]
    },
    {
      id: 2,
      title: 'Exercise 2: Multiple Aggregates per Group',
      description: `Calculate salary statistics for each department.

**Your task:**
For each department, show:
- department name
- avg_salary (average salary)
- max_salary (highest salary)

**Table: employees**
| employee_id | first_name | department | salary |
|-------------|------------|------------|--------|
| 1 | John | Sales | 55000 |
| 2 | Sarah | Engineering | 85000 |
| 3 | Michael | Sales | 62000 |
| 4 | Emily | Engineering | 78000 |
| 5 | David | Marketing | 58000 |`,
      starterCode: `-- Calculate avg and max salary per department

`,
      solution: `SELECT
    department,
    AVG(salary) AS avg_salary,
    MAX(salary) AS max_salary
FROM employees
GROUP BY department;`,
      expectedOutput: [
        'Sales|58500|62000',
        'Engineering|81500|85000',
        'Marketing|58000|58000'
      ],
      hints: [
        'Use AVG(salary) for average',
        'Use MAX(salary) for maximum',
        'Both aggregates go in the same SELECT',
        'GROUP BY department to get per-department results'
      ]
    },
    {
      id: 3,
      title: 'Exercise 3: Using HAVING',
      description: `Find product categories with more than 2 products.

**Your task:**
Write a query to find categories that have more than 2 products. Show category and product_count.

**Table: products**
| product_id | product_name | category |
|------------|--------------|----------|
| 1 | Laptop | Electronics |
| 2 | Mouse | Electronics |
| 3 | Monitor | Electronics |
| 4 | Desk | Furniture |
| 5 | Chair | Furniture |
| 6 | Notebook | Office |`,
      starterCode: `-- Find categories with more than 2 products

`,
      solution: `SELECT category, COUNT(*) AS product_count
FROM products
GROUP BY category
HAVING COUNT(*) > 2;`,
      expectedOutput: [
        'Electronics|3'
      ],
      hints: [
        'First GROUP BY category',
        'COUNT(*) gives the product count per category',
        'HAVING filters groups (not rows)',
        'HAVING COUNT(*) > 2 keeps only large categories'
      ]
    },
    {
      id: 4,
      title: 'Exercise 4: WHERE and HAVING Together',
      description: `Find high-volume customers who placed multiple orders.

**Your task:**
Find customers who have:
1. Only orders with status 'Completed' (use WHERE)
2. At least 2 completed orders (use HAVING)

Show customer_id, order_count, and total_spent.

**Table: orders**
| order_id | customer_id | status | total_amount |
|----------|-------------|--------|--------------|
| 1 | 101 | Completed | 150.00 |
| 2 | 102 | Pending | 75.00 |
| 3 | 101 | Completed | 200.00 |
| 4 | 103 | Completed | 320.00 |
| 5 | 101 | Completed | 180.00 |
| 6 | 102 | Completed | 95.00 |`,
      starterCode: `-- Find customers with 2+ completed orders

`,
      solution: `SELECT
    customer_id,
    COUNT(*) AS order_count,
    SUM(total_amount) AS total_spent
FROM orders
WHERE status = 'Completed'
GROUP BY customer_id
HAVING COUNT(*) >= 2;`,
      expectedOutput: [
        '101|3|530.00'
      ],
      hints: [
        'WHERE status = \'Completed\' filters before grouping',
        'GROUP BY customer_id groups orders by customer',
        'HAVING COUNT(*) >= 2 filters groups',
        'WHERE comes before GROUP BY, HAVING comes after'
      ]
    }
  ],
  quiz: [
    {
      question: 'What is the difference between WHERE and HAVING?',
      options: [
        'There is no difference, they do the same thing',
        'WHERE filters rows before grouping; HAVING filters groups after grouping',
        'WHERE is faster than HAVING',
        'HAVING can only be used with COUNT()'
      ],
      correctIndex: 1,
      explanation: 'WHERE filters individual rows before groups are formed. HAVING filters the groups themselves after GROUP BY has been applied. Use HAVING when you need to filter based on aggregate values.'
    },
    {
      question: 'Which query is INCORRECT when using GROUP BY department?',
      options: [
        'SELECT department, COUNT(*) FROM employees GROUP BY department',
        'SELECT department, AVG(salary) FROM employees GROUP BY department',
        'SELECT department, first_name FROM employees GROUP BY department',
        'SELECT department, MAX(salary), MIN(salary) FROM employees GROUP BY department'
      ],
      correctIndex: 2,
      explanation: 'When using GROUP BY, all columns in SELECT must either be in the GROUP BY clause or inside an aggregate function. first_name is neither, so it causes an error.'
    },
    {
      question: 'What does GROUP BY category, status produce?',
      options: [
        'Groups first by category, ignoring status',
        'Groups first by status, ignoring category',
        'One group for each unique combination of category and status',
        'An error because you can only group by one column'
      ],
      correctIndex: 2,
      explanation: 'GROUP BY with multiple columns creates groups for each unique combination. If you have categories A, B and statuses 1, 2, you could have groups: (A,1), (A,2), (B,1), (B,2).'
    },
    {
      question: 'Which clause correctly filters for departments with average salary over 70000?',
      options: [
        'WHERE AVG(salary) > 70000',
        'HAVING AVG(salary) > 70000',
        'GROUP BY AVG(salary) > 70000',
        'ORDER BY AVG(salary) > 70000'
      ],
      correctIndex: 1,
      explanation: 'You cannot use aggregate functions in WHERE because it runs before groups exist. HAVING runs after GROUP BY, so it can filter based on aggregate values like AVG(salary).'
    }
  ],
  buildNote: {
    title: 'Grouping Data in Real Applications',
    explanation: `The Code Tutor application uses GROUP BY extensively for analytics and reporting. The dashboard shows lesson completion by difficulty: \`SELECT difficulty, COUNT(*) AS completed FROM user_progress WHERE status = 'completed' GROUP BY difficulty\`. User statistics group by time periods: \`SELECT DATE(created_at) AS date, COUNT(DISTINCT user_id) AS daily_users FROM sessions GROUP BY DATE(created_at)\`. The leaderboard uses \`SELECT user_id, COUNT(*) AS lessons_completed FROM progress WHERE completed = true GROUP BY user_id HAVING COUNT(*) >= 5 ORDER BY lessons_completed DESC\`. Progress reports combine WHERE and HAVING: filter by language, then show only users who completed multiple lessons.`,
    relatedFiles: [
      'src/app/api/analytics/route.ts',
      'src/lib/db/reports.ts',
      'src/components/Dashboard.tsx'
    ],
    inTheRealWorld: `GROUP BY powers business analytics everywhere. E-commerce reports: \`SELECT category, SUM(revenue), COUNT(*) AS orders FROM sales GROUP BY category ORDER BY revenue DESC\`. Financial systems: \`SELECT account_type, SUM(balance) FROM accounts GROUP BY account_type\`. HR analytics: \`SELECT department, AVG(salary), COUNT(*) FROM employees GROUP BY department HAVING AVG(salary) > company_avg\`. Web analytics: \`SELECT page_url, COUNT(*) AS views, COUNT(DISTINCT user_id) AS unique_visitors FROM page_views GROUP BY page_url\`. The combination of GROUP BY, HAVING, and ORDER BY forms the foundation of SQL-based reporting.`
  }
};
