import { Lesson } from '@/types/lesson';

export const sortingData: Lesson = {
  slug: 'sql-sorting-data',
  title: 'Sorting Data',
  description: 'Learn to sort query results using ORDER BY, ASC/DESC, multiple columns, and NULLS FIRST/LAST.',
  difficulty: 'beginner',
  order: 3,
  content: `
# Sorting Data with ORDER BY

By default, SQL doesn't guarantee any particular order for query results. The ORDER BY clause lets you sort results in a predictable, meaningful way.

## Basic ORDER BY

Sort results by a column:

\`\`\`sql
SELECT first_name, last_name, salary
FROM employees
ORDER BY salary;
\`\`\`

By default, ORDER BY sorts in ascending order (smallest to largest, A to Z).

## ASC and DESC

Specify the sort direction explicitly:

\`\`\`sql
-- Ascending (default): lowest to highest
SELECT first_name, salary
FROM employees
ORDER BY salary ASC;

-- Descending: highest to lowest
SELECT first_name, salary
FROM employees
ORDER BY salary DESC;
\`\`\`

Common uses:
- **ASC**: Alphabetical order, oldest to newest, lowest price first
- **DESC**: Reverse alphabetical, newest to oldest, highest salary first

## Sorting Text

Text sorts alphabetically (based on character encoding):

\`\`\`sql
-- A to Z
SELECT first_name, last_name
FROM employees
ORDER BY last_name ASC;

-- Z to A
SELECT first_name, last_name
FROM employees
ORDER BY last_name DESC;
\`\`\`

## Sorting Dates

Dates sort chronologically:

\`\`\`sql
-- Oldest first
SELECT order_id, order_date
FROM orders
ORDER BY order_date ASC;

-- Most recent first
SELECT order_id, order_date
FROM orders
ORDER BY order_date DESC;
\`\`\`

## Sorting by Multiple Columns

Sort by one column, then by another for ties:

\`\`\`sql
SELECT first_name, last_name, department, salary
FROM employees
ORDER BY department ASC, salary DESC;
\`\`\`

This sorts by department alphabetically first, then within each department, by salary highest to lowest.

More examples:

\`\`\`sql
-- Sort by last name, then first name for same last names
SELECT first_name, last_name
FROM employees
ORDER BY last_name ASC, first_name ASC;

-- Sort by category, then by price within category
SELECT product_name, category, price
FROM products
ORDER BY category ASC, price DESC;
\`\`\`

## Sorting by Column Position

You can reference columns by their position in the SELECT list:

\`\`\`sql
SELECT first_name, last_name, salary
FROM employees
ORDER BY 3 DESC;  -- Sort by the 3rd column (salary)
\`\`\`

This is useful but less readable. Column names are preferred for clarity.

## Sorting by Expressions

Sort by calculated values:

\`\`\`sql
-- Sort by annual salary (calculated)
SELECT first_name, salary, salary * 12 AS annual_salary
FROM employees
ORDER BY salary * 12 DESC;

-- Or use the alias
SELECT first_name, salary, salary * 12 AS annual_salary
FROM employees
ORDER BY annual_salary DESC;
\`\`\`

## Handling NULL Values

NULLs have special sorting behavior. By default:
- In PostgreSQL, NULLs sort last with ASC, first with DESC
- In MySQL, NULLs sort first with ASC, last with DESC

Use NULLS FIRST or NULLS LAST to control this:

\`\`\`sql
-- Put NULL values at the end
SELECT first_name, manager_id
FROM employees
ORDER BY manager_id ASC NULLS LAST;

-- Put NULL values at the beginning
SELECT first_name, manager_id
FROM employees
ORDER BY manager_id ASC NULLS FIRST;
\`\`\`

Note: NULLS FIRST/LAST syntax is supported in PostgreSQL, Oracle, and SQLite. MySQL uses different approaches.

## Combining ORDER BY with WHERE

ORDER BY comes after WHERE:

\`\`\`sql
SELECT first_name, salary
FROM employees
WHERE department = 'Engineering'
ORDER BY salary DESC;
\`\`\`

The query execution order:
1. FROM - identify the table
2. WHERE - filter rows
3. SELECT - choose columns
4. ORDER BY - sort results

## Limiting Results

Often combined with LIMIT to get "top N" results:

\`\`\`sql
-- Top 5 highest paid employees
SELECT first_name, salary
FROM employees
ORDER BY salary DESC
LIMIT 5;

-- Most recent 10 orders
SELECT order_id, order_date, total_amount
FROM orders
ORDER BY order_date DESC
LIMIT 10;
\`\`\`

## Case-Insensitive Sorting

For case-insensitive alphabetical sorting:

\`\`\`sql
-- PostgreSQL
SELECT name FROM products
ORDER BY LOWER(name) ASC;

-- Or using COLLATE (database-specific)
SELECT name FROM products
ORDER BY name COLLATE NOCASE;  -- SQLite
\`\`\`

## Quick Reference

| Syntax | Purpose | Example |
|--------|---------|---------|
| ORDER BY col | Sort ascending | ORDER BY name |
| ORDER BY col ASC | Sort ascending (explicit) | ORDER BY price ASC |
| ORDER BY col DESC | Sort descending | ORDER BY salary DESC |
| ORDER BY a, b | Multi-column sort | ORDER BY dept, name |
| NULLS FIRST | NULLs appear first | ORDER BY col NULLS FIRST |
| NULLS LAST | NULLs appear last | ORDER BY col NULLS LAST |

## Learning Objectives

By the end of this lesson, you'll be able to:
- Sort query results using ORDER BY
- Use ASC and DESC to control sort direction
- Sort by multiple columns
- Handle NULL values in sorting
- Combine sorting with filtering
`,
  exercises: [
    {
      id: 1,
      title: 'Exercise 1: Basic Sorting',
      description: `Sort employees by their salary.

**Your task:**
Write a query to list all employees sorted by salary from highest to lowest. Select first_name, last_name, and salary.

**Table: employees**
| employee_id | first_name | last_name | salary |
|-------------|------------|-----------|--------|
| 1 | John | Smith | 55000 |
| 2 | Sarah | Johnson | 85000 |
| 3 | Michael | Brown | 62000 |
| 4 | Emily | Davis | 78000 |`,
      starterCode: `-- List employees sorted by salary (highest first)

`,
      solution: `SELECT first_name, last_name, salary
FROM employees
ORDER BY salary DESC;`,
      expectedOutput: [
        'Sarah|Johnson|85000',
        'Emily|Davis|78000',
        'Michael|Brown|62000',
        'John|Smith|55000'
      ],
      hints: [
        'Use ORDER BY to sort results',
        'DESC means descending (highest to lowest)',
        'The column to sort by is salary',
        'Syntax: ORDER BY column_name DESC'
      ]
    },
    {
      id: 2,
      title: 'Exercise 2: Alphabetical Sorting',
      description: `Sort products alphabetically by name.

**Your task:**
Write a query to list all products sorted alphabetically by product_name (A to Z). Select product_name and price.

**Table: products**
| product_id | product_name | price |
|------------|--------------|-------|
| 1 | Zebra Print Rug | 89.99 |
| 2 | Apple Watch | 399.99 |
| 3 | Monitor Stand | 49.99 |
| 4 | Desk Lamp | 34.99 |`,
      starterCode: `-- List products sorted alphabetically by name

`,
      solution: `SELECT product_name, price
FROM products
ORDER BY product_name ASC;`,
      expectedOutput: [
        'Apple Watch|399.99',
        'Desk Lamp|34.99',
        'Monitor Stand|49.99',
        'Zebra Print Rug|89.99'
      ],
      hints: [
        'ASC sorts A to Z (ascending)',
        'You can also omit ASC since it\'s the default',
        'Sort by the product_name column',
        'Syntax: ORDER BY product_name ASC'
      ]
    },
    {
      id: 3,
      title: 'Exercise 3: Multi-Column Sorting',
      description: `Sort employees by department, then by salary within each department.

**Your task:**
Write a query to list employees sorted by department (A to Z), and within each department, sorted by salary (highest first). Select first_name, department, and salary.

**Table: employees**
| employee_id | first_name | department | salary |
|-------------|------------|------------|--------|
| 1 | John | Sales | 55000 |
| 2 | Sarah | Engineering | 85000 |
| 3 | Michael | Sales | 62000 |
| 4 | Emily | Engineering | 78000 |`,
      starterCode: `-- Sort by department (A-Z), then by salary (highest first)

`,
      solution: `SELECT first_name, department, salary
FROM employees
ORDER BY department ASC, salary DESC;`,
      expectedOutput: [
        'Sarah|Engineering|85000',
        'Emily|Engineering|78000',
        'Michael|Sales|62000',
        'John|Sales|55000'
      ],
      hints: [
        'List multiple columns in ORDER BY separated by commas',
        'First sort by department ASC',
        'Then sort by salary DESC',
        'Syntax: ORDER BY col1 ASC, col2 DESC'
      ]
    },
    {
      id: 4,
      title: 'Exercise 4: Sorting with LIMIT',
      description: `Find the top 3 most expensive products.

**Your task:**
Write a query to find the 3 most expensive products. Select product_name and price, sorted by price from highest to lowest.

**Table: products**
| product_id | product_name | price |
|------------|--------------|-------|
| 1 | Laptop | 999.99 |
| 2 | Mouse | 29.99 |
| 3 | Monitor | 349.99 |
| 4 | Keyboard | 79.99 |
| 5 | Webcam | 89.99 |`,
      starterCode: `-- Find the 3 most expensive products

`,
      solution: `SELECT product_name, price
FROM products
ORDER BY price DESC
LIMIT 3;`,
      expectedOutput: [
        'Laptop|999.99',
        'Monitor|349.99',
        'Webcam|89.99'
      ],
      hints: [
        'Sort by price in descending order',
        'Use LIMIT to restrict the number of rows',
        'LIMIT comes after ORDER BY',
        'Syntax: ORDER BY price DESC LIMIT 3'
      ]
    }
  ],
  quiz: [
    {
      question: 'What is the default sort order for ORDER BY?',
      options: [
        'Descending (DESC)',
        'Ascending (ASC)',
        'Random',
        'No default, must be specified'
      ],
      correctIndex: 1,
      explanation: 'When you don\'t specify ASC or DESC, ORDER BY defaults to ascending order. Numbers go low to high, letters go A to Z, dates go oldest to newest.'
    },
    {
      question: 'What does ORDER BY last_name, first_name do?',
      options: [
        'Sorts randomly by both columns',
        'Sorts by last_name only',
        'Sorts by last_name first, then by first_name for ties',
        'Sorts by whichever column has more unique values'
      ],
      correctIndex: 2,
      explanation: 'Multi-column sorting works left to right. First it sorts by last_name, then for rows with the same last_name, it sorts by first_name.'
    },
    {
      question: 'Where does ORDER BY appear in a SQL query?',
      options: [
        'Before FROM',
        'Before WHERE',
        'After FROM but before WHERE',
        'After WHERE (and after GROUP BY/HAVING if present)'
      ],
      correctIndex: 3,
      explanation: 'ORDER BY is typically the last clause (before LIMIT if present). The order is: SELECT, FROM, WHERE, GROUP BY, HAVING, ORDER BY, LIMIT.'
    },
    {
      question: 'How do you sort NULL values to appear last when sorting in ascending order?',
      options: [
        'ORDER BY column ASC NULLS LAST',
        'ORDER BY column ASC EXCLUDE NULL',
        'ORDER BY column ASC WHERE NOT NULL',
        'ORDER BY COALESCE(column, 999999)'
      ],
      correctIndex: 0,
      explanation: 'NULLS LAST explicitly places NULL values at the end of the result set. This works in PostgreSQL, Oracle, and SQLite. MySQL requires different approaches.'
    }
  ],
  buildNote: {
    title: 'Sorting Data in Real Applications',
    explanation: `The Code Tutor application uses ORDER BY throughout. The lesson sidebar orders lessons with \`ORDER BY difficulty, order\` to show beginner lessons first, then intermediate, then advanced, with each difficulty level sorted by lesson number. The search results use \`ORDER BY relevance_score DESC, title ASC\` to show best matches first. Progress tracking might use \`ORDER BY completed_at DESC\` to show recently completed lessons. User lists often default to \`ORDER BY created_at DESC\` so the newest items appear first. Multi-column sorting is essential for consistent, predictable displays: \`ORDER BY is_featured DESC, popularity DESC, name ASC\` shows featured items first, then popular items, with alphabetical fallback.`,
    relatedFiles: [
      'src/lib/db/queries.ts',
      'src/components/Sidebar.tsx',
      'src/app/api/lessons/route.ts'
    ],
    inTheRealWorld: `Sorting is critical for user experience. E-commerce sites offer sorting options: "Price: Low to High" uses \`ORDER BY price ASC\`, "Newest First" uses \`ORDER BY created_at DESC\`. Social media feeds use complex sorting: \`ORDER BY engagement_score DESC, created_at DESC\`. Leaderboards use \`ORDER BY score DESC LIMIT 100\`. Customer support systems prioritize tickets: \`ORDER BY priority DESC, created_at ASC\` (high priority first, oldest within priority). Pagination requires consistent sorting: without ORDER BY, the same query might return different results on different pages.`
  }
};
