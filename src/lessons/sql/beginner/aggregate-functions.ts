import { Lesson } from '@/types/lesson';

export const aggregateFunctions: Lesson = {
  slug: 'sql-aggregate-functions',
  title: 'Aggregate Functions',
  description: 'Learn to summarize data using COUNT, SUM, AVG, MIN, MAX, and understand how NULLs affect aggregations.',
  difficulty: 'beginner',
  order: 4,
  content: `
# Aggregate Functions

Aggregate functions perform calculations across multiple rows and return a single summary value. They're essential for reporting, analytics, and understanding your data.

## The Five Core Aggregate Functions

| Function | Purpose | Example |
|----------|---------|---------|
| COUNT() | Count rows | COUNT(*) or COUNT(column) |
| SUM() | Add numeric values | SUM(salary) |
| AVG() | Calculate average | AVG(price) |
| MIN() | Find minimum value | MIN(order_date) |
| MAX() | Find maximum value | MAX(salary) |

## COUNT() - Counting Rows

COUNT() counts the number of rows:

\`\`\`sql
-- Count all rows in employees table
SELECT COUNT(*) FROM employees;

-- Count rows with non-NULL email values
SELECT COUNT(email) FROM employees;

-- Count unique departments
SELECT COUNT(DISTINCT department) FROM employees;
\`\`\`

Important distinction:
- \`COUNT(*)\` counts all rows, including those with NULL values
- \`COUNT(column)\` counts only non-NULL values in that column
- \`COUNT(DISTINCT column)\` counts unique non-NULL values

## SUM() - Adding Values

SUM() adds up numeric values:

\`\`\`sql
-- Total salary expense
SELECT SUM(salary) AS total_salaries
FROM employees;

-- Total revenue from orders
SELECT SUM(quantity * unit_price) AS total_revenue
FROM order_items;
\`\`\`

SUM() ignores NULL values and only works with numeric data.

## AVG() - Calculating Averages

AVG() calculates the arithmetic mean:

\`\`\`sql
-- Average salary
SELECT AVG(salary) AS average_salary
FROM employees;

-- Average order value
SELECT AVG(total_amount) AS avg_order_value
FROM orders;
\`\`\`

AVG() ignores NULL values. If you have salaries of 50000, 60000, and NULL, the average is 55000 (not 36667).

## MIN() and MAX() - Finding Extremes

MIN() and MAX() find the smallest and largest values:

\`\`\`sql
-- Salary range
SELECT
    MIN(salary) AS lowest_salary,
    MAX(salary) AS highest_salary
FROM employees;

-- Date range of orders
SELECT
    MIN(order_date) AS first_order,
    MAX(order_date) AS latest_order
FROM orders;

-- Alphabetically first and last
SELECT
    MIN(last_name) AS first_alphabetically,
    MAX(last_name) AS last_alphabetically
FROM employees;
\`\`\`

MIN() and MAX() work with numbers, dates, and text.

## Combining Aggregate Functions

Use multiple aggregates in one query:

\`\`\`sql
SELECT
    COUNT(*) AS employee_count,
    SUM(salary) AS total_payroll,
    AVG(salary) AS average_salary,
    MIN(salary) AS min_salary,
    MAX(salary) AS max_salary
FROM employees;
\`\`\`

## Aggregates with WHERE

Filter rows before aggregating:

\`\`\`sql
-- Average salary in Engineering
SELECT AVG(salary) AS avg_engineering_salary
FROM employees
WHERE department = 'Engineering';

-- Total orders in 2024
SELECT SUM(total_amount) AS revenue_2024
FROM orders
WHERE order_date >= '2024-01-01' AND order_date < '2025-01-01';

-- Count of high-value orders
SELECT COUNT(*) AS high_value_orders
FROM orders
WHERE total_amount > 1000;
\`\`\`

## How NULLs Affect Aggregates

Understanding NULL behavior is crucial:

\`\`\`sql
-- Table: bonuses
-- employee_id | bonus
-- 1           | 1000
-- 2           | NULL
-- 3           | 2000
-- 4           | NULL
-- 5           | 1500

SELECT
    COUNT(*) AS total_rows,           -- 5
    COUNT(bonus) AS non_null_bonuses, -- 3
    SUM(bonus) AS total_bonus,        -- 4500
    AVG(bonus) AS avg_bonus           -- 1500 (not 900!)
FROM bonuses;
\`\`\`

Key points:
- COUNT(*) includes NULL rows
- COUNT(column), SUM(), AVG(), MIN(), MAX() ignore NULL values
- AVG() divides by non-NULL count, not total rows

## COALESCE with Aggregates

Use COALESCE to treat NULL as zero (or another value):

\`\`\`sql
-- Treat NULL bonus as 0
SELECT AVG(COALESCE(bonus, 0)) AS avg_including_nulls
FROM bonuses;
-- Result: 900 (4500 / 5 rows)

-- Sum with NULL handling
SELECT SUM(COALESCE(bonus, 0)) AS total_bonus
FROM bonuses;
\`\`\`

## Aggregate Function Results

Aggregate queries return a single row (unless using GROUP BY):

\`\`\`sql
SELECT
    COUNT(*) AS count,
    AVG(salary) AS avg
FROM employees;
-- Returns ONE row with two columns
\`\`\`

## Common Patterns

Calculate various statistics:

\`\`\`sql
-- Order statistics
SELECT
    COUNT(*) AS total_orders,
    SUM(total_amount) AS revenue,
    AVG(total_amount) AS avg_order,
    MIN(total_amount) AS smallest_order,
    MAX(total_amount) AS largest_order
FROM orders
WHERE status = 'Completed';

-- Inventory analysis
SELECT
    COUNT(*) AS total_products,
    SUM(quantity_in_stock) AS total_inventory,
    SUM(quantity_in_stock * unit_price) AS inventory_value
FROM products;
\`\`\`

## Rounding Results

AVG often returns many decimal places:

\`\`\`sql
-- Round to 2 decimal places
SELECT ROUND(AVG(salary), 2) AS avg_salary
FROM employees;

-- Format as currency (PostgreSQL)
SELECT ROUND(AVG(price)::numeric, 2) AS avg_price
FROM products;
\`\`\`

## Quick Reference

| Function | NULL Behavior | Works With |
|----------|---------------|------------|
| COUNT(*) | Counts all rows | Any table |
| COUNT(col) | Ignores NULLs | Any column |
| SUM(col) | Ignores NULLs | Numbers only |
| AVG(col) | Ignores NULLs | Numbers only |
| MIN(col) | Ignores NULLs | Numbers, text, dates |
| MAX(col) | Ignores NULLs | Numbers, text, dates |

## Learning Objectives

By the end of this lesson, you'll be able to:
- Count rows using COUNT() with different approaches
- Calculate totals using SUM()
- Find averages using AVG()
- Find minimum and maximum values using MIN() and MAX()
- Understand how NULL values affect aggregate calculations
`,
  exercises: [
    {
      id: 1,
      title: 'Exercise 1: Counting Rows',
      description: `Count employees in different ways.

**Your task:**
Write a query that returns:
- Total number of employees (as total_employees)
- Number of employees with an email (as with_email)
- Number of unique departments (as department_count)

**Table: employees**
| employee_id | first_name | email | department |
|-------------|------------|-------|------------|
| 1 | John | john@co.com | Sales |
| 2 | Sarah | NULL | Engineering |
| 3 | Michael | mike@co.com | Sales |
| 4 | Emily | emily@co.com | Engineering |
| 5 | David | NULL | Marketing |`,
      starterCode: `-- Count: total employees, employees with email, unique departments

`,
      solution: `SELECT
    COUNT(*) AS total_employees,
    COUNT(email) AS with_email,
    COUNT(DISTINCT department) AS department_count
FROM employees;`,
      expectedOutput: [
        '5|3|3'
      ],
      hints: [
        'COUNT(*) counts all rows including NULLs',
        'COUNT(email) counts only non-NULL emails',
        'COUNT(DISTINCT department) counts unique departments',
        'Use AS to name each result column'
      ]
    },
    {
      id: 2,
      title: 'Exercise 2: SUM and AVG',
      description: `Calculate salary statistics.

**Your task:**
Write a query that returns:
- Total of all salaries (as total_payroll)
- Average salary (as avg_salary)

**Table: employees**
| employee_id | first_name | salary |
|-------------|------------|--------|
| 1 | John | 55000 |
| 2 | Sarah | 85000 |
| 3 | Michael | 62000 |
| 4 | Emily | 78000 |`,
      starterCode: `-- Calculate total payroll and average salary

`,
      solution: `SELECT
    SUM(salary) AS total_payroll,
    AVG(salary) AS avg_salary
FROM employees;`,
      expectedOutput: [
        '280000|70000'
      ],
      hints: [
        'SUM(salary) adds up all salary values',
        'AVG(salary) calculates the average',
        'Use AS to give columns meaningful names',
        'Both ignore NULL values (but there are none here)'
      ]
    },
    {
      id: 3,
      title: 'Exercise 3: MIN and MAX',
      description: `Find the range of product prices and order dates.

**Your task:**
1. Query products for cheapest_price and most_expensive
2. Query orders for first_order and latest_order dates

**Table: products**
| product_id | product_name | price |
|------------|--------------|-------|
| 1 | Laptop | 999.99 |
| 2 | Mouse | 29.99 |
| 3 | Monitor | 349.99 |

**Table: orders**
| order_id | order_date | total_amount |
|----------|------------|--------------|
| 1 | 2024-01-15 | 150.00 |
| 2 | 2024-03-22 | 299.99 |
| 3 | 2024-02-08 | 89.50 |`,
      starterCode: `-- Query 1: Find cheapest and most expensive product prices


-- Query 2: Find first and latest order dates

`,
      solution: `SELECT
    MIN(price) AS cheapest_price,
    MAX(price) AS most_expensive
FROM products;

SELECT
    MIN(order_date) AS first_order,
    MAX(order_date) AS latest_order
FROM orders;`,
      expectedOutput: [
        '29.99|999.99',
        '2024-01-15|2024-03-22'
      ],
      hints: [
        'MIN() finds the smallest value',
        'MAX() finds the largest value',
        'MIN/MAX work with numbers and dates',
        'You need two separate SELECT statements'
      ]
    },
    {
      id: 4,
      title: 'Exercise 4: Aggregates with WHERE',
      description: `Calculate statistics for a specific department.

**Your task:**
Write a query to calculate for the 'Sales' department only:
- Number of employees (as employee_count)
- Average salary (as avg_salary)
- Highest salary (as max_salary)

**Table: employees**
| employee_id | first_name | department | salary |
|-------------|------------|------------|--------|
| 1 | John | Sales | 55000 |
| 2 | Sarah | Engineering | 85000 |
| 3 | Michael | Sales | 62000 |
| 4 | Emily | Engineering | 78000 |
| 5 | David | Sales | 58000 |`,
      starterCode: `-- Statistics for Sales department only

`,
      solution: `SELECT
    COUNT(*) AS employee_count,
    AVG(salary) AS avg_salary,
    MAX(salary) AS max_salary
FROM employees
WHERE department = 'Sales';`,
      expectedOutput: [
        '3|58333.333333|62000'
      ],
      hints: [
        'Use WHERE to filter to Sales department',
        'WHERE comes before the aggregate functions are applied',
        'The aggregates only process filtered rows',
        'Syntax: SELECT aggregates FROM table WHERE condition'
      ]
    }
  ],
  quiz: [
    {
      question: 'What is the difference between COUNT(*) and COUNT(column_name)?',
      options: [
        'They are exactly the same',
        'COUNT(*) counts all rows; COUNT(column) counts non-NULL values only',
        'COUNT(*) is faster; COUNT(column) is slower',
        'COUNT(*) counts columns; COUNT(column) counts rows'
      ],
      correctIndex: 1,
      explanation: 'COUNT(*) counts all rows including those with NULL values. COUNT(column_name) only counts rows where that specific column is not NULL.'
    },
    {
      question: 'If a table has salaries: 50000, 60000, NULL, 70000, what is AVG(salary)?',
      options: [
        '45000 (180000 / 4)',
        '60000 (180000 / 3)',
        'NULL',
        '0'
      ],
      correctIndex: 1,
      explanation: 'AVG() ignores NULL values. It calculates 180000 / 3 = 60000, dividing only by the count of non-NULL values.'
    },
    {
      question: 'Which aggregate function works with text columns?',
      options: [
        'SUM()',
        'AVG()',
        'MIN() and MAX()',
        'None of them'
      ],
      correctIndex: 2,
      explanation: 'MIN() and MAX() work with text to find alphabetically first and last values. SUM() and AVG() only work with numeric data.'
    },
    {
      question: 'What does SELECT COUNT(DISTINCT department) FROM employees return?',
      options: [
        'The number of employees',
        'The number of unique department names',
        'All department names',
        'The most common department'
      ],
      correctIndex: 1,
      explanation: 'COUNT(DISTINCT column) counts the number of unique, non-NULL values in that column. It tells you how many different departments exist.'
    }
  ],
  buildNote: {
    title: 'Aggregate Functions in Real Applications',
    explanation: `The Code Tutor application uses aggregate functions for analytics and progress tracking. Dashboard statistics use queries like \`SELECT COUNT(*) AS total_users, COUNT(DISTINCT language) AS languages_taught FROM user_progress\`. Progress calculations use \`SELECT AVG(completion_percentage) AS avg_progress FROM user_lesson_progress WHERE user_id = ?\`. The admin panel shows lesson popularity: \`SELECT lesson_slug, COUNT(*) AS views FROM lesson_views GROUP BY lesson_slug ORDER BY views DESC\`. Performance metrics use \`SELECT AVG(load_time_ms) AS avg_load, MAX(load_time_ms) AS max_load FROM performance_logs\`. NULL handling is important for optional fields like quiz scores.`,
    relatedFiles: [
      'src/app/api/analytics/route.ts',
      'src/lib/db/stats.ts',
      'src/components/Dashboard.tsx'
    ],
    inTheRealWorld: `Aggregate functions power business intelligence everywhere. E-commerce dashboards show \`SELECT COUNT(*) AS orders, SUM(total) AS revenue, AVG(total) AS avg_order FROM orders WHERE date = TODAY\`. HR systems calculate \`SELECT department, AVG(salary), COUNT(*) FROM employees GROUP BY department\`. Financial apps need \`SELECT SUM(amount) AS balance FROM transactions WHERE account_id = ?\`. Analytics platforms aggregate billions of events: \`SELECT COUNT(*) AS page_views, COUNT(DISTINCT user_id) AS unique_visitors FROM events\`. Understanding NULL behavior is critical when aggregating optional survey responses or nullable fields.`
  }
};
