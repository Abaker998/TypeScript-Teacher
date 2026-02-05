import { Lesson } from '@/types/lesson';

export const windowFunctions: Lesson = {
  slug: 'sql-window-functions',
  title: 'Window Functions',
  description: 'Master window functions including ROW_NUMBER, RANK, LAG, LEAD, and the OVER clause with PARTITION BY.',
  difficulty: 'advanced',
  order: 22,
  content: `
# Window Functions

Window functions perform calculations across a set of rows that are related to the current row. Unlike aggregate functions that collapse rows into a single result, window functions return a value for every row while still allowing access to other rows in the "window."

## The OVER Clause

The OVER clause defines the window - the set of rows the function operates on:

\`\`\`sql
-- Basic window function syntax
SELECT
  employee_id,
  department,
  salary,
  AVG(salary) OVER () AS company_avg,  -- Window is all rows
  AVG(salary) OVER (PARTITION BY department) AS dept_avg  -- Window is per department
FROM employees;
\`\`\`

### PARTITION BY

PARTITION BY divides the result set into partitions (groups) for the window function:

\`\`\`sql
SELECT
  employee_id,
  department,
  salary,
  -- Average within each department
  AVG(salary) OVER (PARTITION BY department) AS dept_avg,
  -- Running total within each department
  SUM(salary) OVER (PARTITION BY department ORDER BY employee_id) AS dept_running_total
FROM employees;
\`\`\`

### ORDER BY in Windows

ORDER BY within OVER defines the logical order for the window:

\`\`\`sql
SELECT
  order_id,
  order_date,
  amount,
  -- Cumulative sum ordered by date
  SUM(amount) OVER (ORDER BY order_date) AS running_total,
  -- Count of orders up to this point
  COUNT(*) OVER (ORDER BY order_date) AS order_count
FROM orders;
\`\`\`

## Ranking Functions

### ROW_NUMBER()

Assigns a unique sequential number to each row:

\`\`\`sql
-- Number rows within each department by salary
SELECT
  employee_id,
  department,
  salary,
  ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) AS salary_rank
FROM employees;

-- Get top 3 earners per department
SELECT * FROM (
  SELECT
    employee_id,
    department,
    salary,
    ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) AS rn
  FROM employees
) ranked
WHERE rn <= 3;
\`\`\`

### RANK() and DENSE_RANK()

Handle ties differently than ROW_NUMBER:

\`\`\`sql
-- RANK() leaves gaps after ties
-- DENSE_RANK() doesn't leave gaps
SELECT
  employee_id,
  department,
  salary,
  ROW_NUMBER() OVER (ORDER BY salary DESC) AS row_num,    -- 1, 2, 3, 4, 5
  RANK() OVER (ORDER BY salary DESC) AS rank_with_gaps,   -- 1, 2, 2, 4, 5 (skips 3)
  DENSE_RANK() OVER (ORDER BY salary DESC) AS dense_rank  -- 1, 2, 2, 3, 4 (no gaps)
FROM employees;

-- Example with actual ties
-- salary: 100000, 90000, 90000, 80000
-- ROW_NUMBER:  1, 2, 3, 4
-- RANK:        1, 2, 2, 4
-- DENSE_RANK:  1, 2, 2, 3
\`\`\`

### NTILE()

Divides rows into a specified number of roughly equal groups:

\`\`\`sql
-- Divide employees into 4 salary quartiles
SELECT
  employee_id,
  salary,
  NTILE(4) OVER (ORDER BY salary) AS quartile
FROM employees;

-- Percentile analysis
SELECT
  product_id,
  sales,
  NTILE(100) OVER (ORDER BY sales) AS percentile
FROM products;

-- Find top 25% of products by sales
SELECT * FROM (
  SELECT
    product_id,
    sales,
    NTILE(4) OVER (ORDER BY sales DESC) AS quartile
  FROM products
) q
WHERE quartile = 1;
\`\`\`

## Offset Functions

### LAG() and LEAD()

Access values from previous or subsequent rows:

\`\`\`sql
-- LAG: Access previous row
-- LEAD: Access next row
SELECT
  order_date,
  amount,
  LAG(amount) OVER (ORDER BY order_date) AS prev_amount,
  LEAD(amount) OVER (ORDER BY order_date) AS next_amount
FROM orders;

-- Calculate day-over-day change
SELECT
  order_date,
  amount,
  amount - LAG(amount) OVER (ORDER BY order_date) AS daily_change,
  ROUND(100.0 * (amount - LAG(amount) OVER (ORDER BY order_date)) /
        LAG(amount) OVER (ORDER BY order_date), 2) AS pct_change
FROM orders;

-- With default value for first row
SELECT
  order_date,
  amount,
  LAG(amount, 1, 0) OVER (ORDER BY order_date) AS prev_amount  -- Default to 0
FROM orders;

-- Look back multiple rows
SELECT
  order_date,
  amount,
  LAG(amount, 1) OVER (ORDER BY order_date) AS prev_1_day,
  LAG(amount, 7) OVER (ORDER BY order_date) AS prev_7_days,
  LAG(amount, 30) OVER (ORDER BY order_date) AS prev_30_days
FROM daily_sales;
\`\`\`

### FIRST_VALUE() and LAST_VALUE()

Get the first or last value in the window:

\`\`\`sql
-- First and last values in the window
SELECT
  employee_id,
  department,
  salary,
  FIRST_VALUE(salary) OVER (
    PARTITION BY department
    ORDER BY salary DESC
  ) AS highest_in_dept,
  LAST_VALUE(salary) OVER (
    PARTITION BY department
    ORDER BY salary DESC
    ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
  ) AS lowest_in_dept
FROM employees;

-- Note: LAST_VALUE needs frame specification to include all rows
-- Default frame is ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
\`\`\`

### NTH_VALUE()

Get the Nth value in the window:

\`\`\`sql
-- Get the 2nd highest salary in each department
SELECT
  employee_id,
  department,
  salary,
  NTH_VALUE(salary, 2) OVER (
    PARTITION BY department
    ORDER BY salary DESC
    ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
  ) AS second_highest
FROM employees;
\`\`\`

## Window Frame Specification

Control exactly which rows are in the window:

\`\`\`sql
-- Frame syntax
-- ROWS BETWEEN start AND end
-- start/end can be:
--   UNBOUNDED PRECEDING (first row of partition)
--   N PRECEDING (N rows before current)
--   CURRENT ROW
--   N FOLLOWING (N rows after current)
--   UNBOUNDED FOLLOWING (last row of partition)

-- Running total (default frame)
SELECT
  order_date,
  amount,
  SUM(amount) OVER (
    ORDER BY order_date
    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
  ) AS running_total
FROM orders;

-- 3-day moving average
SELECT
  order_date,
  amount,
  AVG(amount) OVER (
    ORDER BY order_date
    ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
  ) AS moving_avg_3day
FROM orders;

-- Centered moving average (current row +/- 1)
SELECT
  order_date,
  amount,
  AVG(amount) OVER (
    ORDER BY order_date
    ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING
  ) AS centered_avg
FROM orders;

-- Total for entire partition
SELECT
  department,
  employee_id,
  salary,
  SUM(salary) OVER (
    PARTITION BY department
    ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
  ) AS dept_total
FROM employees;
\`\`\`

## Aggregate Functions as Window Functions

All standard aggregates work with OVER:

\`\`\`sql
SELECT
  order_date,
  amount,
  -- Running aggregates
  SUM(amount) OVER (ORDER BY order_date) AS running_sum,
  AVG(amount) OVER (ORDER BY order_date) AS running_avg,
  MIN(amount) OVER (ORDER BY order_date) AS running_min,
  MAX(amount) OVER (ORDER BY order_date) AS running_max,
  COUNT(*) OVER (ORDER BY order_date) AS running_count,
  -- Partition aggregates
  SUM(amount) OVER (PARTITION BY EXTRACT(MONTH FROM order_date)) AS monthly_total
FROM orders;
\`\`\`

## Practical Examples

### Year-over-Year Comparison

\`\`\`sql
SELECT
  year,
  month,
  revenue,
  LAG(revenue, 12) OVER (ORDER BY year, month) AS prev_year_revenue,
  revenue - LAG(revenue, 12) OVER (ORDER BY year, month) AS yoy_change,
  ROUND(100.0 * (revenue - LAG(revenue, 12) OVER (ORDER BY year, month)) /
        LAG(revenue, 12) OVER (ORDER BY year, month), 2) AS yoy_pct_change
FROM monthly_revenue;
\`\`\`

### Running Percentage of Total

\`\`\`sql
SELECT
  product_id,
  category,
  sales,
  SUM(sales) OVER (PARTITION BY category) AS category_total,
  ROUND(100.0 * sales / SUM(sales) OVER (PARTITION BY category), 2) AS pct_of_category,
  SUM(sales) OVER (
    PARTITION BY category
    ORDER BY sales DESC
  ) AS running_sum,
  ROUND(100.0 * SUM(sales) OVER (
    PARTITION BY category
    ORDER BY sales DESC
  ) / SUM(sales) OVER (PARTITION BY category), 2) AS cumulative_pct
FROM products;
\`\`\`

### Finding Gaps in Sequences

\`\`\`sql
SELECT
  current_id,
  next_id,
  next_id - current_id - 1 AS gap_size
FROM (
  SELECT
    order_id AS current_id,
    LEAD(order_id) OVER (ORDER BY order_id) AS next_id
  FROM orders
) gaps
WHERE next_id - current_id > 1;
\`\`\`

### Session Analysis

\`\`\`sql
-- Identify sessions (gaps > 30 minutes = new session)
SELECT
  user_id,
  event_time,
  CASE
    WHEN event_time - LAG(event_time) OVER (
      PARTITION BY user_id ORDER BY event_time
    ) > INTERVAL '30 minutes'
    OR LAG(event_time) OVER (PARTITION BY user_id ORDER BY event_time) IS NULL
    THEN 1
    ELSE 0
  END AS is_session_start,
  SUM(CASE
    WHEN event_time - LAG(event_time) OVER (
      PARTITION BY user_id ORDER BY event_time
    ) > INTERVAL '30 minutes'
    OR LAG(event_time) OVER (PARTITION BY user_id ORDER BY event_time) IS NULL
    THEN 1
    ELSE 0
  END) OVER (PARTITION BY user_id ORDER BY event_time) AS session_id
FROM user_events;
\`\`\`

## Learning Objectives

By the end of this lesson, you'll be able to:
- Use the OVER clause with PARTITION BY and ORDER BY
- Apply ranking functions (ROW_NUMBER, RANK, DENSE_RANK, NTILE)
- Use offset functions (LAG, LEAD, FIRST_VALUE, LAST_VALUE)
- Define custom window frames
- Solve complex analytical problems with window functions
`,
  exercises: [
    {
      id: 1,
      title: 'Exercise 1: Basic Window Functions',
      description: `Use window functions to analyze employee salaries.

**Your task:**
Write a query that shows each employee with:
1. Their salary
2. The average salary of their department
3. The difference between their salary and their department average`,
      starterCode: `-- Table: employees(employee_id, name, department, salary)

SELECT
  employee_id,
  name,
  department,
  salary
  -- Add department average using window function

  -- Add difference from department average

FROM employees
ORDER BY department, salary DESC;`,
      solution: `-- Table: employees(employee_id, name, department, salary)

SELECT
  employee_id,
  name,
  department,
  salary,
  ROUND(AVG(salary) OVER (PARTITION BY department), 2) AS dept_avg,
  salary - ROUND(AVG(salary) OVER (PARTITION BY department), 2) AS diff_from_avg
FROM employees
ORDER BY department, salary DESC;`,
      expectedOutput: ['Each employee row shows salary, department average, and difference', 'PARTITION BY department creates separate averages per department'],
      hints: [
        'Use AVG(salary) OVER (PARTITION BY department) for department average',
        'The same window function can be used in calculations',
        'PARTITION BY creates separate windows for each department'
      ],
    },
    {
      id: 2,
      title: 'Exercise 2: Ranking Functions',
      description: `Use ranking functions to find top performers.

**Your task:**
Write a query that ranks products by sales within each category, then filter to show only the top 3 products per category.`,
      starterCode: `-- Table: products(product_id, name, category, sales)

-- First, write the ranking query

-- Then wrap it to filter top 3

`,
      solution: `-- Table: products(product_id, name, category, sales)

SELECT *
FROM (
  SELECT
    product_id,
    name,
    category,
    sales,
    ROW_NUMBER() OVER (
      PARTITION BY category
      ORDER BY sales DESC
    ) AS rank_in_category
  FROM products
) ranked
WHERE rank_in_category <= 3
ORDER BY category, rank_in_category;`,
      expectedOutput: ['Top 3 products per category by sales', 'ROW_NUMBER assigns unique ranks', 'Subquery needed to filter on window function result'],
      hints: [
        'Use ROW_NUMBER() OVER (PARTITION BY category ORDER BY sales DESC)',
        'Window functions cannot be used in WHERE directly - use a subquery',
        'ORDER BY sales DESC ranks highest sales first'
      ],
    },
    {
      id: 3,
      title: 'Exercise 3: LAG for Comparison',
      description: `Use LAG to compare values with previous periods.

**Your task:**
Write a query showing monthly revenue with:
1. Previous month's revenue
2. Month-over-month change (absolute)
3. Month-over-month change (percentage)`,
      starterCode: `-- Table: monthly_revenue(year, month, revenue)

SELECT
  year,
  month,
  revenue
  -- Add previous month revenue

  -- Add absolute change

  -- Add percentage change

FROM monthly_revenue
ORDER BY year, month;`,
      solution: `-- Table: monthly_revenue(year, month, revenue)

SELECT
  year,
  month,
  revenue,
  LAG(revenue) OVER (ORDER BY year, month) AS prev_month_revenue,
  revenue - LAG(revenue) OVER (ORDER BY year, month) AS mom_change,
  ROUND(
    100.0 * (revenue - LAG(revenue) OVER (ORDER BY year, month)) /
    NULLIF(LAG(revenue) OVER (ORDER BY year, month), 0),
    2
  ) AS mom_pct_change
FROM monthly_revenue
ORDER BY year, month;`,
      expectedOutput: ['Previous month revenue via LAG', 'Month-over-month absolute change', 'Percentage change with NULL handling'],
      hints: [
        'LAG(revenue) OVER (ORDER BY year, month) gets previous value',
        'ORDER BY year, month ensures correct temporal ordering',
        'Use NULLIF to avoid division by zero for first row'
      ],
    },
    {
      id: 4,
      title: 'Exercise 4: Moving Average',
      description: `Calculate a 3-day moving average of sales.

**Your task:**
Write a query that calculates:
1. Daily sales
2. 3-day moving average (current day and 2 previous days)
3. Running total of sales`,
      starterCode: `-- Table: daily_sales(sale_date, amount)

SELECT
  sale_date,
  amount
  -- Add 3-day moving average

  -- Add running total

FROM daily_sales
ORDER BY sale_date;`,
      solution: `-- Table: daily_sales(sale_date, amount)

SELECT
  sale_date,
  amount,
  ROUND(
    AVG(amount) OVER (
      ORDER BY sale_date
      ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
    ), 2
  ) AS moving_avg_3day,
  SUM(amount) OVER (
    ORDER BY sale_date
    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
  ) AS running_total
FROM daily_sales
ORDER BY sale_date;`,
      expectedOutput: ['3-day moving average using window frame', 'Running total from start to current row', 'ROWS BETWEEN defines the window frame'],
      hints: [
        'Use ROWS BETWEEN 2 PRECEDING AND CURRENT ROW for 3-day window',
        'UNBOUNDED PRECEDING starts from the first row',
        'Window frames require ORDER BY in the OVER clause'
      ],
    },
  ],
  quiz: [
    {
      question: 'What is the difference between RANK() and DENSE_RANK() when there are ties?',
      options: [
        'RANK() is faster than DENSE_RANK()',
        'DENSE_RANK() handles NULL values differently',
        'RANK() leaves gaps in the ranking after ties, DENSE_RANK() does not',
        'DENSE_RANK() only works with numeric columns'
      ],
      correctIndex: 2,
      explanation: 'When there are ties, RANK() assigns the same rank but then skips numbers (e.g., 1, 2, 2, 4). DENSE_RANK() also assigns the same rank but continues sequentially (e.g., 1, 2, 2, 3).'
    },
    {
      question: 'What does LAG(amount, 2, 0) return?',
      options: [
        'The amount from 2 rows ahead, or 0 if not available',
        'The amount from 2 rows behind, or 0 if not available',
        'The 2nd highest amount, or 0',
        'The average of the last 2 amounts'
      ],
      correctIndex: 1,
      explanation: 'LAG(column, offset, default) returns the value from offset rows before the current row. The third argument is the default value when there is no row that far back. LAG(amount, 2, 0) gets the amount from 2 rows back, defaulting to 0.'
    },
    {
      question: 'What is the default window frame when ORDER BY is specified in the OVER clause?',
      options: [
        'ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING',
        'ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW',
        'ROWS BETWEEN CURRENT ROW AND UNBOUNDED FOLLOWING',
        'ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING'
      ],
      correctIndex: 1,
      explanation: 'When ORDER BY is specified, the default frame is ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW. This is why running totals work as expected. To include all rows, you must explicitly specify UNBOUNDED FOLLOWING.'
    },
    {
      question: 'Why can\'t you use a window function result directly in a WHERE clause?',
      options: [
        'Window functions are too slow for WHERE clauses',
        'Window functions are computed after WHERE is evaluated',
        'WHERE clauses only accept scalar values',
        'It\'s a syntax limitation that will be fixed in future SQL versions'
      ],
      correctIndex: 1,
      explanation: 'Window functions are computed in the SELECT phase, which happens after WHERE filtering. To filter on a window function result, you must wrap the query in a subquery or CTE and filter on the outer query.'
    }
  ],
  buildNote: {
    title: 'Window Functions for Analytics',
    explanation: `Window functions are essential for analytics features. In a learning platform, you might use them to rank learners by progress, calculate running completion percentages, or compare a user's performance to their peer group average. For example, to show a user how they rank among all learners: \`ROW_NUMBER() OVER (ORDER BY lessons_completed DESC)\`. Or to show progress trends: \`LAG(completion_rate) OVER (PARTITION BY user_id ORDER BY week)\` to compare this week's progress to last week's.`,
    relatedFiles: [
      'src/lib/lesson-utils.ts',
      'src/types/lesson.ts'
    ],
    inTheRealWorld: `Window functions are heavily used in business intelligence and data analysis. E-commerce platforms use them for sales rankings and market basket analysis. Financial applications use them for moving averages and cumulative returns. SaaS applications use them for cohort analysis and user retention metrics. They're also essential for ETL pipelines that need to deduplicate data (using ROW_NUMBER to identify duplicates) or fill in missing values.`
  }
};
