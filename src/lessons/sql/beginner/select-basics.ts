import { Lesson } from '@/types/lesson';

export const selectBasics: Lesson = {
  slug: 'sql-select-basics',
  title: 'SELECT Basics',
  description: 'Learn to retrieve data from tables using SELECT, FROM, column selection, aliases, and DISTINCT.',
  difficulty: 'beginner',
  order: 1,
  content: `
# SELECT Basics

The SELECT statement is the foundation of SQL. It allows you to retrieve data from one or more tables in your database. Almost every database interaction starts with SELECT.

## The Basic SELECT Statement

**What this example does:** Retrieves every column and every row from a table - the simplest possible database query.

**When you'd use this:** Quick data exploration, debugging, or when you genuinely need all data from a small table.

\`\`\`sql
SELECT * FROM employees;
\`\`\`

The \`*\` (asterisk) means "all columns." This returns every column and every row from the employees table.

**Real-world example:** Quickly checking what data exists in a new table:
\`\`\`sql
SELECT * FROM users;  -- See all user data during development
\`\`\`

## Selecting Specific Columns

**What this example does:** Retrieves only the columns you actually need instead of everything.

**When you'd use this:** Almost always in production code! You rarely need every column - just the data you're displaying or processing.

\`\`\`sql
SELECT first_name, last_name, email
FROM employees;
\`\`\`

This returns only the three specified columns. Benefits include:
- Faster query execution
- Less data transferred over the network
- Clearer code intent

**Real-world example:** Populating a user directory that only shows names and contact info:
\`\`\`sql
SELECT name, email, phone FROM contacts;
\`\`\`

## Column Aliases with AS

**What this example does:** Renames columns in your output to more readable or appropriate names.

**When you'd use this:** Creating reports, matching API/frontend naming conventions, making calculated columns understandable.

\`\`\`sql
SELECT
    first_name AS "First Name",
    last_name AS "Last Name",
    salary AS annual_salary
FROM employees;
\`\`\`

Aliases are useful when:
- Column names aren't user-friendly
- You're performing calculations
- You want to avoid naming conflicts in complex queries

**Real-world example:** Creating a financial report with clear labels:
\`\`\`sql
SELECT
    order_id AS "Order #",
    total_amount AS "Total ($)",
    shipping_cost AS "Shipping ($)"
FROM orders;
\`\`\`

## DISTINCT - Removing Duplicates

**What this example does:** Removes duplicate values from your results - each unique value appears only once.

**When you'd use this:** Building dropdown menus, finding unique categories, listing all distinct values in a column.

\`\`\`sql
-- Without DISTINCT: may show "Sales" multiple times
SELECT department FROM employees;

-- With DISTINCT: each department appears once
SELECT DISTINCT department FROM employees;
\`\`\`

**Real-world example:** Populating a filter dropdown with all available product categories:
\`\`\`sql
SELECT DISTINCT category FROM products;
-- Result: Electronics, Clothing, Home & Garden, etc.
\`\`\`

DISTINCT works across all selected columns:

\`\`\`sql
-- Unique combinations of department AND job_title
SELECT DISTINCT department, job_title
FROM employees;
\`\`\`

## Calculated Columns

**What this example does:** Creates new columns by performing calculations on existing data.

**When you'd use this:** Computing totals, percentages, price with tax, converting units, any derived values you need.

\`\`\`sql
SELECT
    first_name,
    salary,
    salary * 12 AS annual_salary,
    salary * 1.1 AS salary_with_raise
FROM employees;
\`\`\`

Common calculations include:
- Mathematical operations: +, -, *, /
- String concatenation: first_name || ' ' || last_name (in most databases)
- Date calculations

**Real-world example:** Showing product prices with tax:
\`\`\`sql
SELECT
    product_name,
    price,
    price * 1.08 AS price_with_tax,
    price * 0.10 AS discount_amount
FROM products;
\`\`\`

## Literal Values

You can include constant values in your output:

\`\`\`sql
SELECT
    first_name,
    'Active' AS status,
    2024 AS fiscal_year
FROM employees;
\`\`\`

## The FROM Clause

FROM specifies which table(s) to query:

\`\`\`sql
SELECT product_name, price FROM products;
SELECT order_id, order_date FROM orders;
SELECT customer_name, city FROM customers;
\`\`\`

## Query Execution Order

Although you write SELECT first, SQL processes FROM first:

1. **FROM** - Identify the table(s)
2. **SELECT** - Choose which columns to return

Understanding this order matters for more complex queries.

## Common Mistakes to Avoid

\`\`\`sql
-- WRONG: Column name misspelled
SELECT fist_name FROM employees;

-- WRONG: Missing FROM clause
SELECT first_name, last_name;

-- WRONG: Using column alias in same SELECT
SELECT salary, annual_salary * 12  -- Can't use alias here
FROM employees;

-- CORRECT: Repeat the expression
SELECT salary, salary * 12 AS annual_salary
FROM employees;
\`\`\`

## Style Best Practices

Write clear, readable SQL:

\`\`\`sql
-- Good: Each column on its own line for complex queries
SELECT
    employee_id,
    first_name,
    last_name,
    email,
    hire_date,
    salary
FROM employees;

-- Good: Meaningful aliases
SELECT
    p.product_name AS "Product",
    p.unit_price AS "Price ($)"
FROM products p;
\`\`\`

## Quick Reference

| Syntax | Purpose | Example |
|--------|---------|---------|
| SELECT * | All columns | SELECT * FROM employees |
| SELECT col1, col2 | Specific columns | SELECT name, email FROM users |
| AS alias | Rename column | SELECT name AS full_name |
| DISTINCT | Remove duplicates | SELECT DISTINCT city FROM customers |
| Calculations | Computed values | SELECT price * quantity AS total |

## Learning Objectives

By the end of this lesson, you'll be able to:
- Write basic SELECT statements to retrieve data
- Select specific columns instead of using SELECT *
- Use column aliases to rename output columns
- Remove duplicate rows with DISTINCT
- Create calculated columns in your queries
`,
  exercises: [
    {
      id: 1,
      title: 'Exercise 1: Select All Columns',
      description: `Write a query to retrieve all columns from the products table.

**Your task:**
Write a SELECT statement that returns all columns and all rows from the \`products\` table.

**Table: products**
| product_id | product_name | category | price |
|------------|--------------|----------|-------|
| 1 | Laptop | Electronics | 999.99 |
| 2 | Mouse | Electronics | 29.99 |
| 3 | Desk Chair | Furniture | 249.99 |`,
      starterCode: `-- Select all columns from the products table

`,
      solution: `SELECT * FROM products;`,
      expectedOutput: [
        '1|Laptop|Electronics|999.99',
        '2|Mouse|Electronics|29.99',
        '3|Desk Chair|Furniture|249.99'
      ],
      hints: [
        'Use the asterisk (*) to select all columns',
        'The basic syntax is: SELECT * FROM table_name;',
        'Make sure to include the semicolon at the end',
        'The table name is "products"'
      ]
    },
    {
      id: 2,
      title: 'Exercise 2: Select Specific Columns',
      description: `Select only the employee names and their salaries from the employees table.

**Your task:**
Write a SELECT statement that returns only the \`first_name\`, \`last_name\`, and \`salary\` columns from the \`employees\` table.

**Table: employees**
| employee_id | first_name | last_name | department | salary |
|-------------|------------|-----------|------------|--------|
| 1 | John | Smith | Sales | 55000 |
| 2 | Sarah | Johnson | Marketing | 62000 |
| 3 | Michael | Brown | Sales | 58000 |`,
      starterCode: `-- Select first_name, last_name, and salary from employees

`,
      solution: `SELECT first_name, last_name, salary FROM employees;`,
      expectedOutput: [
        'John|Smith|55000',
        'Sarah|Johnson|62000',
        'Michael|Brown|58000'
      ],
      hints: [
        'List the column names separated by commas',
        'Syntax: SELECT col1, col2, col3 FROM table_name;',
        'The columns are: first_name, last_name, salary',
        'Don\'t use * when you only need specific columns'
      ]
    },
    {
      id: 3,
      title: 'Exercise 3: Using Column Aliases',
      description: `Create a query that displays product information with user-friendly column names.

**Your task:**
Select from the \`products\` table:
- \`product_name\` aliased as "Product"
- \`price\` aliased as "Unit Price"
- \`category\` aliased as "Category"

**Table: products**
| product_id | product_name | category | price |
|------------|--------------|----------|-------|
| 1 | Laptop | Electronics | 999.99 |
| 2 | Mouse | Electronics | 29.99 |`,
      starterCode: `-- Select product_name, price, and category with aliases

`,
      solution: `SELECT
    product_name AS "Product",
    price AS "Unit Price",
    category AS "Category"
FROM products;`,
      expectedOutput: [
        'Laptop|999.99|Electronics',
        'Mouse|29.99|Electronics'
      ],
      hints: [
        'Use AS to create an alias: column_name AS "Alias"',
        'Use double quotes for aliases with spaces',
        'You can write it on one line or multiple lines',
        'Example: SELECT name AS "Full Name" FROM users;'
      ]
    },
    {
      id: 4,
      title: 'Exercise 4: DISTINCT and Calculated Columns',
      description: `Find all unique departments and calculate annual salaries.

**Your task:**
1. First, write a query to get all DISTINCT departments from the employees table.
2. Then, write a query to show first_name, salary, and a calculated column "annual_salary" (salary * 12).

**Table: employees**
| employee_id | first_name | department | salary |
|-------------|------------|------------|--------|
| 1 | John | Sales | 5000 |
| 2 | Sarah | Marketing | 6000 |
| 3 | Michael | Sales | 5500 |
| 4 | Emily | Marketing | 5800 |`,
      starterCode: `-- Query 1: Get all unique departments


-- Query 2: Show first_name, salary, and annual_salary (salary * 12)

`,
      solution: `SELECT DISTINCT department FROM employees;

SELECT
    first_name,
    salary,
    salary * 12 AS annual_salary
FROM employees;`,
      expectedOutput: [
        'Sales',
        'Marketing',
        'John|5000|60000',
        'Sarah|6000|72000',
        'Michael|5500|66000',
        'Emily|5800|69600'
      ],
      hints: [
        'Use DISTINCT before the column name to remove duplicates',
        'For calculations, multiply salary by 12: salary * 12',
        'Give the calculated column an alias with AS',
        'You need two separate SELECT statements'
      ]
    }
  ],
  quiz: [
    {
      question: 'What does SELECT * return?',
      options: [
        'Only the first row',
        'All columns from the specified table',
        'Only numeric columns',
        'A count of all rows'
      ],
      correctIndex: 1,
      explanation: 'The asterisk (*) is a wildcard that means "all columns." SELECT * FROM table returns every column for every row in the table.'
    },
    {
      question: 'What is the purpose of the AS keyword in a SELECT statement?',
      options: [
        'To filter rows',
        'To sort results',
        'To create a column alias',
        'To join tables'
      ],
      correctIndex: 2,
      explanation: 'AS creates an alias (alternate name) for a column in the output. For example: SELECT name AS full_name gives the name column the alias "full_name".'
    },
    {
      question: 'What does DISTINCT do in a SELECT statement?',
      options: [
        'Selects only the first row',
        'Removes duplicate rows from the result',
        'Sorts the results alphabetically',
        'Counts the number of unique values'
      ],
      correctIndex: 1,
      explanation: 'DISTINCT eliminates duplicate rows from your query results. If the same value appears multiple times, it shows only once.'
    },
    {
      question: 'Which query correctly calculates a 10% bonus on salary?',
      options: [
        'SELECT salary + 10% FROM employees;',
        'SELECT salary * 0.10 AS bonus FROM employees;',
        'SELECT salary BONUS 10 FROM employees;',
        'SELECT 10% OF salary FROM employees;'
      ],
      correctIndex: 1,
      explanation: 'To calculate 10% of salary, multiply by 0.10. The AS keyword gives this calculated column a meaningful name "bonus".'
    }
  ],
  buildNote: {
    title: 'SELECT Basics in Real Applications',
    explanation: `In the Code Tutor application, SELECT statements are the foundation of all data retrieval. When you view a lesson, the backend executes queries like \`SELECT slug, title, content, difficulty FROM lessons WHERE slug = ?\` to fetch the specific lesson data. The lesson list sidebar uses \`SELECT slug, title, description, difficulty, order FROM lessons ORDER BY difficulty, order\` to display lessons in the correct sequence. Column aliases are used when the database column names don't match the frontend expectations - for example, \`SELECT created_at AS createdAt\` to match JavaScript naming conventions. DISTINCT is commonly used for populating filter dropdowns, such as \`SELECT DISTINCT difficulty FROM lessons\` to show available difficulty levels. In analytics queries, calculated columns compute metrics like completion percentages: \`SELECT (completed_exercises * 100.0 / total_exercises) AS completion_rate\`.`,
    relatedFiles: [
      'src/lib/db/queries.ts',
      'src/app/api/lessons/route.ts',
      'src/components/Sidebar.tsx'
    ],
    inTheRealWorld: `Every web application with a database uses SELECT constantly. E-commerce sites query products: \`SELECT product_name, price, inventory FROM products WHERE category = 'Electronics'\`. Social media platforms fetch posts: \`SELECT content, author, created_at FROM posts ORDER BY created_at DESC LIMIT 20\`. Banking apps retrieve transactions: \`SELECT transaction_date, description, amount FROM transactions WHERE account_id = ?\`. The principle of selecting only needed columns (not SELECT *) is crucial for performance in production systems handling millions of requests.`
  }
};
