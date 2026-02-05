import { Lesson } from '@/types/lesson';

export const advancedTest: Lesson = {
  slug: 'sql-advanced-test',
  title: 'SQL Advanced Test',
  description: 'Test your mastery of window functions, CTEs, query optimization, database design, and advanced SQL patterns.',
  difficulty: 'advanced',
  order: 28,
  content: `
# SQL Advanced Test

Outstanding progress! You've completed the SQL Advanced section. This test will challenge your understanding of SQL's most powerful features for analytics and complex data operations.

## What This Test Covers

- **Window Functions** - ROW_NUMBER, RANK, DENSE_RANK, LAG, LEAD, SUM OVER
- **Common Table Expressions (CTEs)** - WITH clause and recursive queries
- **Query Optimization** - Execution plans, index strategies, query rewriting
- **Database Design** - Normalization, denormalization, schema patterns
- **Advanced Patterns** - Pivoting, hierarchical data, temporal queries

## Test Format

This test includes:
- **Multiple choice questions** testing conceptual understanding
- **Code output prediction** - reading complex SQL operations
- **Coding exercises** - implementing advanced analytical queries

These are the skills that distinguish expert SQL developers. Think carefully!
`,
  exercises: [
    {
      id: 1,
      title: 'Exercise 1: Window Functions for Ranking',
      description: `Use window functions to rank salespeople within their regions.

**Given table: sales**
| id | salesperson | region | amount |
|----|-------------|--------|--------|
| 1 | Alice | North | 15000 |
| 2 | Bob | North | 12000 |
| 3 | Carol | South | 18000 |
| 4 | Dave | South | 18000 |
| 5 | Eve | North | 15000 |
| 6 | Frank | South | 14000 |

**Your task:**
1. Use DENSE_RANK() to rank salespeople by amount within each region
2. Include: salesperson name, region, amount, and rank
3. Partition by region, order by amount descending
4. Order the final results by region, then by rank

**Expected: Show rank 1 for top performers in each region (ties share same rank)**`,
      starterCode: `-- Write your window function query
-- Rank salespeople within their region
-- Use DENSE_RANK for handling ties

`,
      solution: `SELECT salesperson,
       region,
       amount,
       DENSE_RANK() OVER (PARTITION BY region ORDER BY amount DESC) AS sales_rank
FROM sales
ORDER BY region, sales_rank;`,
      expectedOutput: [
        'Alice | North | 15000 | 1',
        'Eve | North | 15000 | 1',
        'Bob | North | 12000 | 2',
        'Carol | South | 18000 | 1',
        'Dave | South | 18000 | 1',
        'Frank | South | 14000 | 2'
      ],
      hints: [
        'Window function syntax: FUNCTION() OVER (PARTITION BY ... ORDER BY ...)',
        'PARTITION BY creates separate rankings for each region',
        'DENSE_RANK gives the same rank to ties and doesn\'t skip numbers',
        'The OVER clause defines the window for the calculation'
      ]
    },
    {
      id: 2,
      title: 'Exercise 2: CTE with Running Total',
      description: `Use a CTE to calculate running totals and identify threshold crossings.

**Given table: daily_revenue**
| date | revenue |
|------|---------|
| 2024-01-01 | 1000 |
| 2024-01-02 | 1500 |
| 2024-01-03 | 800 |
| 2024-01-04 | 2000 |
| 2024-01-05 | 1200 |

**Your task:**
1. Create a CTE that adds a running total column (cumulative sum of revenue)
2. In the main query, select all columns from the CTE
3. Add a column 'milestone' that shows 'Reached 5000' when running_total >= 5000, else 'Below 5000'
4. Order by date

**Expected: Show when the 5000 milestone is crossed**`,
      starterCode: `-- Create a CTE with running total
-- Then add milestone indicator

`,
      solution: `WITH revenue_running AS (
  SELECT date,
         revenue,
         SUM(revenue) OVER (ORDER BY date) AS running_total
  FROM daily_revenue
)
SELECT date,
       revenue,
       running_total,
       CASE
         WHEN running_total >= 5000 THEN 'Reached 5000'
         ELSE 'Below 5000'
       END AS milestone
FROM revenue_running
ORDER BY date;`,
      expectedOutput: [
        '2024-01-01 | 1000 | 1000 | Below 5000',
        '2024-01-02 | 1500 | 2500 | Below 5000',
        '2024-01-03 | 800 | 3300 | Below 5000',
        '2024-01-04 | 2000 | 5300 | Reached 5000',
        '2024-01-05 | 1200 | 6500 | Reached 5000'
      ],
      hints: [
        'CTE syntax: WITH cte_name AS (SELECT ...) SELECT ... FROM cte_name',
        'Running total: SUM(column) OVER (ORDER BY date)',
        'No PARTITION BY means the sum accumulates across all rows',
        'Use CASE WHEN for conditional column values'
      ]
    },
    {
      id: 3,
      title: 'Exercise 3: Recursive CTE for Hierarchy',
      description: `Use a recursive CTE to traverse an employee hierarchy.

**Given table: org_chart**
| id | name | manager_id | title |
|----|------|------------|-------|
| 1 | Alice | NULL | CEO |
| 2 | Bob | 1 | VP Engineering |
| 3 | Carol | 1 | VP Sales |
| 4 | Dave | 2 | Senior Dev |
| 5 | Eve | 2 | Dev |
| 6 | Frank | 3 | Sales Rep |

**Your task:**
1. Write a recursive CTE to show the organizational hierarchy
2. Start with the CEO (manager_id IS NULL)
3. Include: name, title, and level (1 for CEO, 2 for direct reports, etc.)
4. Build a path showing the chain of command (e.g., 'Alice > Bob > Dave')
5. Order by level, then name

**Expected: Full hierarchy with levels and paths**`,
      starterCode: `-- Write a recursive CTE
-- Traverse from CEO down through all levels
-- Build path string showing hierarchy

`,
      solution: `WITH RECURSIVE org_hierarchy AS (
  -- Base case: CEO (top of hierarchy)
  SELECT id, name, title, manager_id,
         1 AS level,
         name AS path
  FROM org_chart
  WHERE manager_id IS NULL

  UNION ALL

  -- Recursive case: employees with managers
  SELECT e.id, e.name, e.title, e.manager_id,
         h.level + 1,
         h.path || ' > ' || e.name
  FROM org_chart e
  INNER JOIN org_hierarchy h ON e.manager_id = h.id
)
SELECT name, title, level, path
FROM org_hierarchy
ORDER BY level, name;`,
      expectedOutput: [
        'Alice | CEO | 1 | Alice',
        'Bob | VP Engineering | 2 | Alice > Bob',
        'Carol | VP Sales | 2 | Alice > Carol',
        'Dave | Senior Dev | 3 | Alice > Bob > Dave',
        'Eve | Dev | 3 | Alice > Bob > Eve',
        'Frank | Sales Rep | 3 | Alice > Carol > Frank'
      ],
      hints: [
        'Recursive CTE: WITH RECURSIVE name AS (base UNION ALL recursive)',
        'Base case selects the root (CEO where manager_id IS NULL)',
        'Recursive part joins org_chart to the CTE itself',
        'Use || for string concatenation (or CONCAT in some databases)'
      ]
    }
  ],
  buildNote: {
    title: 'Advanced SQL in Analytics and Enterprise Systems',
    explanation: `These advanced SQL patterns power modern analytics and business intelligence. Window functions enable running totals, rankings, and moving averages without complex self-joins. CTEs make complex queries readable and enable recursive traversal of hierarchical data (org charts, bill of materials, category trees). Query optimization skills ensure analytics dashboards load quickly even with millions of rows. Database design knowledge helps you structure data for both transactional efficiency and analytical flexibility. These skills are essential for data engineering, analytics engineering, and senior backend development roles.`,
    relatedFiles: [
      'src/lessons/sql/advanced/window-functions.ts',
      'src/lessons/sql/advanced/ctes.ts',
      'src/lessons/sql/advanced/query-optimization.ts',
      'src/lessons/sql/advanced/database-design.ts'
    ],
    inTheRealWorld: `Senior database positions and data engineering roles require these advanced skills. Analytics platforms like Looker and Tableau generate complex SQL with window functions. Data warehouses (Snowflake, BigQuery, Redshift) are designed around these patterns. Companies like Netflix, Uber, and Airbnb use CTEs and window functions extensively for their analytics. Query optimization skills can turn a 10-minute query into a 10-second query, directly impacting user experience and infrastructure costs.`
  },
  quiz: [
    {
      question: 'What is the difference between ROW_NUMBER() and RANK()?',
      options: [
        'ROW_NUMBER is faster than RANK',
        'RANK assigns the same number to ties; ROW_NUMBER always assigns unique numbers',
        'ROW_NUMBER requires PARTITION BY; RANK does not',
        'There is no difference'
      ],
      correctIndex: 1,
      explanation: 'RANK() gives the same rank to ties and skips subsequent numbers (1,1,3). ROW_NUMBER() always assigns sequential unique numbers (1,2,3) even for ties, with arbitrary ordering among ties.'
    },
    {
      question: 'What does PARTITION BY do in a window function?',
      options: [
        'Filters rows from the result',
        'Divides rows into groups for separate window calculations',
        'Sorts the final output',
        'Creates a new table partition'
      ],
      correctIndex: 1,
      explanation: 'PARTITION BY divides the result set into partitions. The window function is applied separately within each partition, like having independent calculations for each group.'
    },
    {
      question: 'What is a Common Table Expression (CTE)?',
      options: [
        'A permanent table in the database',
        'A temporary named result set defined within a query',
        'A type of index',
        'A stored procedure'
      ],
      correctIndex: 1,
      explanation: 'A CTE (WITH clause) creates a temporary named result set that exists only for the duration of the query. It improves readability and can be referenced multiple times in the main query.'
    },
    {
      question: 'When should you use a recursive CTE?',
      options: [
        'When you need to join more than 3 tables',
        'When traversing hierarchical or tree-structured data',
        'When you need better query performance',
        'When using aggregate functions'
      ],
      correctIndex: 1,
      explanation: 'Recursive CTEs are ideal for hierarchical data: org charts, category trees, bill of materials, or any self-referential structure where you need to traverse parent-child relationships.'
    },
    {
      question: 'What does LAG() window function do?',
      options: [
        'Returns the last row in the partition',
        'Returns a value from a previous row in the partition',
        'Calculates the time lag between events',
        'Delays query execution'
      ],
      correctIndex: 1,
      explanation: 'LAG(column, n) accesses a column value from n rows before the current row within the partition. It\'s useful for comparing values to previous periods (e.g., this month vs last month).'
    },
    {
      question: 'What is database normalization?',
      options: [
        'Making all column names lowercase',
        'Organizing data to reduce redundancy and improve integrity',
        'Compressing the database to save space',
        'Converting all data types to strings'
      ],
      correctIndex: 1,
      explanation: 'Normalization organizes tables to minimize data redundancy and dependency issues. It involves splitting data into related tables and using foreign keys, following normal forms (1NF, 2NF, 3NF, etc.).'
    },
    {
      question: 'What does this window function calculate?\n\n```sql\nSUM(amount) OVER (ORDER BY date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)\n```',
      options: [
        'Total of all amounts',
        'Running total (cumulative sum) up to current row',
        'Moving average',
        'Sum of the current row only'
      ],
      correctIndex: 1,
      explanation: 'This calculates a running total - the sum of all amounts from the first row up to and including the current row. UNBOUNDED PRECEDING means start from the beginning.'
    },
    {
      question: 'What is an execution plan?',
      options: [
        'A schedule for running queries',
        'A description of how the database will execute a query',
        'A backup strategy',
        'A list of stored procedures'
      ],
      correctIndex: 1,
      explanation: 'An execution plan shows the steps the database will take to execute a query: which indexes it will use, join strategies, estimated row counts, and costs. It\'s essential for query optimization.'
    },
    {
      question: 'What does this query return?\n\n```sql\nSELECT department,\n       employee,\n       salary,\n       salary - LAG(salary) OVER (PARTITION BY department ORDER BY hire_date) AS raise\nFROM employees;\n```',
      options: [
        'Each employee\'s salary increase compared to the previous hire in their department',
        'The total salary by department',
        'The difference between max and min salary',
        'An error - LAG cannot be subtracted'
      ],
      correctIndex: 0,
      explanation: 'This calculates the difference between each employee\'s salary and the salary of the previous hire in their department. LAG returns the previous row\'s salary within each department partition.'
    },
    {
      question: 'When should you consider denormalization?',
      options: [
        'Always - it\'s better than normalization',
        'When read performance is critical and writes are infrequent',
        'When you have too many tables',
        'Never - normalization is always preferred'
      ],
      correctIndex: 1,
      explanation: 'Denormalization intentionally adds redundancy to improve read performance. It\'s appropriate for read-heavy workloads (analytics, reporting) where the cost of extra storage and write complexity is worth the query speed improvement.'
    },
    {
      question: 'What does DENSE_RANK() do differently than RANK()?',
      options: [
        'DENSE_RANK is faster',
        'DENSE_RANK doesn\'t skip numbers after ties',
        'DENSE_RANK only works with numeric columns',
        'There is no difference'
      ],
      correctIndex: 1,
      explanation: 'RANK() skips numbers after ties (1,1,3,4). DENSE_RANK() doesn\'t skip (1,1,2,3). Both give the same rank to ties, but DENSE_RANK produces consecutive rank numbers.'
    },
    {
      question: 'What is a covering index?',
      options: [
        'An index that covers all tables in a database',
        'An index containing all columns needed for a query, avoiding table access',
        'An index that covers NULL values',
        'The primary key index'
      ],
      correctIndex: 1,
      explanation: 'A covering index includes all columns a query needs, so the database can satisfy the query entirely from the index without accessing the actual table rows. This significantly improves performance.'
    },
    {
      question: 'What does the LEAD() function do?',
      options: [
        'Returns the first row in the result',
        'Returns a value from a subsequent row in the partition',
        'Leads the query to use a specific index',
        'Returns the primary key'
      ],
      correctIndex: 1,
      explanation: 'LEAD(column, n) accesses a column value from n rows after the current row. It\'s the opposite of LAG() - useful for looking ahead, like comparing today\'s value to tomorrow\'s.'
    },
    {
      question: 'What is the purpose of ROWS BETWEEN in window functions?',
      options: [
        'To filter rows from the result',
        'To define the window frame (which rows are included in the calculation)',
        'To limit the number of results',
        'To create row numbers'
      ],
      correctIndex: 1,
      explanation: 'ROWS BETWEEN defines the window frame - which rows relative to the current row are included in the calculation. For example, ROWS BETWEEN 2 PRECEDING AND CURRENT ROW includes the current row and 2 before it.'
    },
    {
      question: 'What is the benefit of using CTEs over subqueries?',
      options: [
        'CTEs are always faster',
        'CTEs improve readability and can be referenced multiple times',
        'CTEs can modify data, subqueries cannot',
        'CTEs don\'t need FROM clause'
      ],
      correctIndex: 1,
      explanation: 'CTEs improve query readability by giving names to complex subqueries. They can be referenced multiple times in the main query without repeating the logic. Performance is usually similar to subqueries.'
    }
  ]
};
