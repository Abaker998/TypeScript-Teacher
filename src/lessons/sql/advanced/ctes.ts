import { Lesson } from '@/types/lesson';

export const ctes: Lesson = {
  slug: 'sql-ctes',
  title: 'Common Table Expressions',
  description: 'Master CTEs (WITH clause), recursive CTEs, and learn when to use them over subqueries.',
  difficulty: 'advanced',
  order: 23,
  content: `
# Common Table Expressions (CTEs)

Common Table Expressions (CTEs) are named temporary result sets that exist only within the scope of a single query. They make complex queries more readable and maintainable by breaking them into logical building blocks.

## Basic CTE Syntax

The WITH clause defines one or more CTEs:

\`\`\`sql
-- Basic CTE syntax
WITH cte_name AS (
  SELECT column1, column2
  FROM table_name
  WHERE condition
)
SELECT * FROM cte_name;

-- CTE with column aliases
WITH sales_summary (year, total_sales, order_count) AS (
  SELECT
    EXTRACT(YEAR FROM order_date),
    SUM(amount),
    COUNT(*)
  FROM orders
  GROUP BY EXTRACT(YEAR FROM order_date)
)
SELECT * FROM sales_summary WHERE total_sales > 1000000;
\`\`\`

## Why Use CTEs?

### 1. Improved Readability

\`\`\`sql
-- Without CTE - nested and hard to follow
SELECT d.department_name, e.avg_salary
FROM departments d
JOIN (
  SELECT department_id, AVG(salary) AS avg_salary
  FROM employees
  GROUP BY department_id
) e ON d.department_id = e.department_id
WHERE e.avg_salary > (
  SELECT AVG(salary) FROM employees
);

-- With CTE - clear and logical
WITH dept_salaries AS (
  SELECT
    department_id,
    AVG(salary) AS avg_salary
  FROM employees
  GROUP BY department_id
),
company_avg AS (
  SELECT AVG(salary) AS avg_salary
  FROM employees
)
SELECT
  d.department_name,
  ds.avg_salary
FROM departments d
JOIN dept_salaries ds ON d.department_id = ds.department_id
CROSS JOIN company_avg ca
WHERE ds.avg_salary > ca.avg_salary;
\`\`\`

### 2. Reusability Within a Query

\`\`\`sql
-- CTE used multiple times
WITH monthly_sales AS (
  SELECT
    DATE_TRUNC('month', order_date) AS month,
    SUM(amount) AS total
  FROM orders
  GROUP BY DATE_TRUNC('month', order_date)
)
SELECT
  curr.month,
  curr.total AS current_month,
  prev.total AS previous_month,
  curr.total - prev.total AS growth
FROM monthly_sales curr
LEFT JOIN monthly_sales prev
  ON curr.month = prev.month + INTERVAL '1 month';
\`\`\`

### 3. Step-by-Step Data Transformation

\`\`\`sql
WITH
-- Step 1: Get raw order data with customer info
order_details AS (
  SELECT
    o.order_id,
    o.customer_id,
    c.customer_name,
    o.order_date,
    o.amount
  FROM orders o
  JOIN customers c ON o.customer_id = c.customer_id
),
-- Step 2: Calculate customer metrics
customer_metrics AS (
  SELECT
    customer_id,
    customer_name,
    COUNT(*) AS order_count,
    SUM(amount) AS total_spent,
    AVG(amount) AS avg_order_value
  FROM order_details
  GROUP BY customer_id, customer_name
),
-- Step 3: Classify customers
customer_segments AS (
  SELECT
    *,
    CASE
      WHEN total_spent >= 10000 THEN 'VIP'
      WHEN total_spent >= 5000 THEN 'Regular'
      ELSE 'Occasional'
    END AS segment
  FROM customer_metrics
)
-- Final query
SELECT * FROM customer_segments ORDER BY total_spent DESC;
\`\`\`

## Multiple CTEs

You can define multiple CTEs in a single WITH clause:

\`\`\`sql
WITH
active_customers AS (
  SELECT customer_id, name
  FROM customers
  WHERE status = 'active'
),
recent_orders AS (
  SELECT customer_id, COUNT(*) AS order_count
  FROM orders
  WHERE order_date > CURRENT_DATE - INTERVAL '30 days'
  GROUP BY customer_id
),
customer_products AS (
  SELECT DISTINCT o.customer_id, p.category
  FROM orders o
  JOIN order_items oi ON o.order_id = oi.order_id
  JOIN products p ON oi.product_id = p.product_id
)
SELECT
  ac.name,
  COALESCE(ro.order_count, 0) AS recent_orders,
  STRING_AGG(DISTINCT cp.category, ', ') AS categories
FROM active_customers ac
LEFT JOIN recent_orders ro ON ac.customer_id = ro.customer_id
LEFT JOIN customer_products cp ON ac.customer_id = cp.customer_id
GROUP BY ac.customer_id, ac.name, ro.order_count;
\`\`\`

## Recursive CTEs

Recursive CTEs reference themselves to process hierarchical or graph data:

### Basic Recursive Structure

\`\`\`sql
WITH RECURSIVE cte_name AS (
  -- Anchor member (base case)
  SELECT initial_columns
  FROM table
  WHERE starting_condition

  UNION ALL

  -- Recursive member (references itself)
  SELECT next_columns
  FROM table t
  JOIN cte_name c ON t.parent = c.id
)
SELECT * FROM cte_name;
\`\`\`

### Organizational Hierarchy

\`\`\`sql
-- Table: employees(employee_id, name, manager_id)

WITH RECURSIVE org_chart AS (
  -- Anchor: Start with CEO (no manager)
  SELECT
    employee_id,
    name,
    manager_id,
    1 AS level,
    name AS path
  FROM employees
  WHERE manager_id IS NULL

  UNION ALL

  -- Recursive: Find direct reports
  SELECT
    e.employee_id,
    e.name,
    e.manager_id,
    oc.level + 1,
    oc.path || ' > ' || e.name
  FROM employees e
  JOIN org_chart oc ON e.manager_id = oc.employee_id
)
SELECT * FROM org_chart ORDER BY path;

-- Result:
-- employee_id | name    | level | path
-- 1           | CEO     | 1     | CEO
-- 2           | VP Sales| 2     | CEO > VP Sales
-- 5           | Manager | 3     | CEO > VP Sales > Manager
\`\`\`

### Bill of Materials (Parts Explosion)

\`\`\`sql
-- Table: parts(part_id, name, parent_part_id, quantity)

WITH RECURSIVE parts_tree AS (
  -- Anchor: Top-level product
  SELECT
    part_id,
    name,
    parent_part_id,
    quantity,
    1 AS level,
    ARRAY[part_id] AS path
  FROM parts
  WHERE parent_part_id IS NULL AND part_id = 100

  UNION ALL

  -- Recursive: Component parts
  SELECT
    p.part_id,
    p.name,
    p.parent_part_id,
    p.quantity * pt.quantity AS total_quantity,
    pt.level + 1,
    pt.path || p.part_id
  FROM parts p
  JOIN parts_tree pt ON p.parent_part_id = pt.part_id
  WHERE NOT p.part_id = ANY(pt.path)  -- Prevent cycles
)
SELECT * FROM parts_tree ORDER BY path;
\`\`\`

### Generating Series

\`\`\`sql
-- Generate numbers 1 to 10
WITH RECURSIVE numbers AS (
  SELECT 1 AS n
  UNION ALL
  SELECT n + 1 FROM numbers WHERE n < 10
)
SELECT * FROM numbers;

-- Generate dates for a range
WITH RECURSIVE dates AS (
  SELECT DATE '2024-01-01' AS date
  UNION ALL
  SELECT date + 1 FROM dates WHERE date < '2024-01-31'
)
SELECT * FROM dates;

-- Fill in missing dates in sales data
WITH RECURSIVE date_range AS (
  SELECT MIN(sale_date) AS date FROM sales
  UNION ALL
  SELECT date + 1 FROM date_range
  WHERE date < (SELECT MAX(sale_date) FROM sales)
)
SELECT
  dr.date,
  COALESCE(s.amount, 0) AS amount
FROM date_range dr
LEFT JOIN sales s ON dr.date = s.sale_date;
\`\`\`

### Graph Traversal

\`\`\`sql
-- Find all paths between two nodes
-- Table: edges(from_node, to_node, weight)

WITH RECURSIVE paths AS (
  -- Start from source node
  SELECT
    from_node,
    to_node,
    weight,
    ARRAY[from_node, to_node] AS path,
    weight AS total_weight
  FROM edges
  WHERE from_node = 'A'

  UNION ALL

  -- Extend paths
  SELECT
    p.from_node,
    e.to_node,
    e.weight,
    p.path || e.to_node,
    p.total_weight + e.weight
  FROM paths p
  JOIN edges e ON p.to_node = e.from_node
  WHERE NOT e.to_node = ANY(p.path)  -- No cycles
    AND array_length(p.path, 1) < 10  -- Max depth
)
SELECT * FROM paths WHERE to_node = 'Z';
\`\`\`

## CTEs vs Subqueries

### When to Use CTEs

\`\`\`sql
-- CTE: When you reference the same subquery multiple times
WITH sales_by_region AS (
  SELECT region, SUM(amount) AS total
  FROM orders
  GROUP BY region
)
SELECT
  region,
  total,
  total / (SELECT SUM(total) FROM sales_by_region) * 100 AS percentage
FROM sales_by_region;

-- CTE: When building complex logic step by step
WITH step1 AS (...),
     step2 AS (SELECT ... FROM step1 ...),
     step3 AS (SELECT ... FROM step2 ...)
SELECT * FROM step3;

-- CTE: For recursive queries (subqueries can't do this)
WITH RECURSIVE ...
\`\`\`

### When Subqueries May Be Better

\`\`\`sql
-- Simple one-time subquery
SELECT * FROM orders
WHERE customer_id IN (SELECT customer_id FROM vip_customers);

-- Correlated subquery (references outer query)
SELECT
  o.*,
  (SELECT COUNT(*) FROM order_items oi WHERE oi.order_id = o.order_id) AS item_count
FROM orders o;
\`\`\`

## Performance Considerations

\`\`\`sql
-- CTEs may be materialized (computed once) or inlined
-- PostgreSQL 12+ allows optimization hints:

-- Force materialization
WITH sales AS MATERIALIZED (
  SELECT * FROM orders WHERE amount > 1000
)
SELECT * FROM sales;

-- Prevent materialization (inline like subquery)
WITH sales AS NOT MATERIALIZED (
  SELECT * FROM orders WHERE amount > 1000
)
SELECT * FROM sales WHERE region = 'US';

-- Recursive CTEs have termination conditions
-- Always include a WHERE clause that will eventually be false
WITH RECURSIVE nums AS (
  SELECT 1 AS n
  UNION ALL
  SELECT n + 1 FROM nums WHERE n < 1000  -- Termination!
)
SELECT * FROM nums;
\`\`\`

## Learning Objectives

By the end of this lesson, you'll be able to:
- Write CTEs to improve query readability
- Chain multiple CTEs for step-by-step transformations
- Use recursive CTEs for hierarchical data
- Choose between CTEs and subqueries appropriately
- Understand CTE performance implications
`,
  exercises: [
    {
      id: 1,
      title: 'Exercise 1: Basic CTE',
      description: `Rewrite a complex subquery using a CTE.

**Your task:**
Find all departments where the average salary is above the company average.`,
      starterCode: `-- Rewrite this using CTEs:
-- SELECT d.department_name, e.avg_salary
-- FROM departments d
-- JOIN (
--   SELECT department_id, AVG(salary) AS avg_salary
--   FROM employees GROUP BY department_id
-- ) e ON d.department_id = e.department_id
-- WHERE e.avg_salary > (SELECT AVG(salary) FROM employees);

-- Your CTE version:

`,
      solution: `WITH dept_salaries AS (
  SELECT
    department_id,
    AVG(salary) AS avg_salary
  FROM employees
  GROUP BY department_id
),
company_avg AS (
  SELECT AVG(salary) AS avg_salary
  FROM employees
)
SELECT
  d.department_name,
  ds.avg_salary
FROM departments d
JOIN dept_salaries ds ON d.department_id = ds.department_id
CROSS JOIN company_avg ca
WHERE ds.avg_salary > ca.avg_salary;`,
      expectedOutput: ['Two CTEs: dept_salaries and company_avg', 'Main query joins departments with CTEs', 'WHERE clause compares dept avg to company avg'],
      hints: [
        'Create one CTE for department averages',
        'Create another CTE for the company-wide average',
        'Join them in the main query and filter'
      ],
    },
    {
      id: 2,
      title: 'Exercise 2: Multiple CTEs',
      description: `Chain multiple CTEs to transform data step by step.

**Your task:**
Calculate customer segments based on their total purchases:
1. First, sum up each customer's purchases
2. Then, assign segments (VIP: $10000+, Regular: $1000+, Basic: under $1000)
3. Finally, count customers in each segment`,
      starterCode: `-- Table: orders(order_id, customer_id, amount)

-- Step 1: Calculate total per customer


-- Step 2: Assign segments


-- Step 3: Count per segment

`,
      solution: `WITH customer_totals AS (
  SELECT
    customer_id,
    SUM(amount) AS total_purchases
  FROM orders
  GROUP BY customer_id
),
customer_segments AS (
  SELECT
    customer_id,
    total_purchases,
    CASE
      WHEN total_purchases >= 10000 THEN 'VIP'
      WHEN total_purchases >= 1000 THEN 'Regular'
      ELSE 'Basic'
    END AS segment
  FROM customer_totals
)
SELECT
  segment,
  COUNT(*) AS customer_count,
  ROUND(AVG(total_purchases), 2) AS avg_purchases
FROM customer_segments
GROUP BY segment
ORDER BY avg_purchases DESC;`,
      expectedOutput: ['Three CTEs building on each other', 'CASE statement for segmentation', 'Final aggregation by segment'],
      hints: [
        'First CTE groups by customer_id and sums amount',
        'Second CTE references first CTE and adds CASE',
        'Final query groups by segment'
      ],
    },
    {
      id: 3,
      title: 'Exercise 3: Recursive CTE - Hierarchy',
      description: `Use a recursive CTE to traverse an organizational hierarchy.

**Your task:**
Given an employees table with manager_id, show the full reporting chain for each employee, including their level in the organization.`,
      starterCode: `-- Table: employees(employee_id, name, manager_id)
-- manager_id IS NULL for the CEO

WITH RECURSIVE org_hierarchy AS (
  -- Anchor: Start with top-level (CEO)


  UNION ALL

  -- Recursive: Join to find reports

)
SELECT * FROM org_hierarchy ORDER BY level, name;`,
      solution: `-- Table: employees(employee_id, name, manager_id)

WITH RECURSIVE org_hierarchy AS (
  -- Anchor: Start with CEO (no manager)
  SELECT
    employee_id,
    name,
    manager_id,
    1 AS level,
    name AS reporting_path
  FROM employees
  WHERE manager_id IS NULL

  UNION ALL

  -- Recursive: Find direct reports
  SELECT
    e.employee_id,
    e.name,
    e.manager_id,
    oh.level + 1,
    oh.reporting_path || ' -> ' || e.name
  FROM employees e
  JOIN org_hierarchy oh ON e.manager_id = oh.employee_id
)
SELECT
  employee_id,
  name,
  level,
  reporting_path
FROM org_hierarchy
ORDER BY level, name;`,
      expectedOutput: ['Anchor selects employees with NULL manager_id', 'Recursive part joins on manager_id = employee_id', 'Level increments and path concatenates'],
      hints: [
        'Anchor: WHERE manager_id IS NULL selects the CEO',
        'Recursive: JOIN employees ON manager_id = employee_id',
        'Track level with level + 1 in recursive part'
      ],
    },
    {
      id: 4,
      title: 'Exercise 4: Recursive CTE - Number Generation',
      description: `Use a recursive CTE to generate a sequence and fill gaps.

**Your task:**
Generate all dates in January 2024 and show sales for each date (0 if no sales).`,
      starterCode: `-- Table: daily_sales(sale_date, amount)

WITH RECURSIVE date_series AS (
  -- Generate dates from Jan 1 to Jan 31, 2024

)
-- Join with sales data

`,
      solution: `-- Table: daily_sales(sale_date, amount)

WITH RECURSIVE date_series AS (
  -- Start date
  SELECT DATE '2024-01-01' AS date

  UNION ALL

  -- Generate next date
  SELECT date + 1
  FROM date_series
  WHERE date < '2024-01-31'
)
SELECT
  ds.date,
  COALESCE(s.amount, 0) AS amount
FROM date_series ds
LEFT JOIN daily_sales s ON ds.date = s.sale_date
ORDER BY ds.date;`,
      expectedOutput: ['Recursive CTE generates all dates in range', 'LEFT JOIN preserves all dates', 'COALESCE fills NULL with 0'],
      hints: [
        'Anchor is the start date: SELECT DATE \'2024-01-01\'',
        'Recursive adds one day: date + 1',
        'Termination: WHERE date < \'2024-01-31\''
      ],
    },
  ],
  quiz: [
    {
      question: 'What is the main advantage of using a CTE over a subquery?',
      options: [
        'CTEs are always faster than subqueries',
        'CTEs can be referenced multiple times in the same query and improve readability',
        'CTEs can use indexes that subqueries cannot',
        'CTEs work with more database systems'
      ],
      correctIndex: 1,
      explanation: 'CTEs improve code organization by allowing you to name intermediate results and reference them multiple times. They make complex queries more readable by breaking them into logical steps.'
    },
    {
      question: 'What are the two parts of a recursive CTE?',
      options: [
        'UNION and INTERSECT',
        'Base case and recursive case (anchor and recursive member)',
        'SELECT and INSERT',
        'WITH and FROM'
      ],
      correctIndex: 1,
      explanation: 'A recursive CTE has an anchor member (base case that doesn\'t reference the CTE) and a recursive member (references the CTE itself). They are combined with UNION ALL.'
    },
    {
      question: 'How do you prevent infinite loops in recursive CTEs?',
      options: [
        'Use LIMIT in the final SELECT',
        'The database automatically prevents infinite loops',
        'Include a WHERE condition in the recursive member that eventually becomes false',
        'Use DISTINCT in the UNION'
      ],
      correctIndex: 2,
      explanation: 'Recursive CTEs need a termination condition in the WHERE clause of the recursive member. This condition should eventually be false to stop the recursion. Some databases also have max recursion depth settings.'
    },
    {
      question: 'Can one CTE reference another CTE defined earlier in the same WITH clause?',
      options: [
        'No, CTEs are independent and cannot reference each other',
        'Yes, CTEs can reference any CTE defined earlier in the same WITH clause',
        'Only if they use the same table',
        'Only in recursive CTEs'
      ],
      correctIndex: 1,
      explanation: 'In a WITH clause with multiple CTEs, each CTE can reference any CTE defined before it (but not after). This allows you to build up complex transformations step by step.'
    }
  ],
  buildNote: {
    title: 'CTEs for Data Transformation',
    explanation: `CTEs are valuable when building complex queries step by step. In a learning platform, you might use CTEs to calculate user progress metrics: first CTE calculates lessons completed, second CTE calculates quiz scores, third CTE combines them into an overall progress score. Recursive CTEs could traverse a prerequisite chain to determine which lessons a user has unlocked. The key benefit is maintainability - when requirements change, you can modify one CTE without rewriting the entire query.`,
    relatedFiles: [
      'src/lib/lesson-utils.ts',
      'src/lessons/index.ts'
    ],
    inTheRealWorld: `CTEs are used extensively in data warehousing and reporting. ETL pipelines use CTEs to transform data through multiple stages. Analytics queries use them to calculate metrics at different granularities. Recursive CTEs are essential for hierarchical data like org charts, category trees, and bill of materials. Many ORMs now support CTEs, making them accessible from application code.`
  }
};
