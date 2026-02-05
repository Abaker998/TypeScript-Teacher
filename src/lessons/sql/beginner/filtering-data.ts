import { Lesson } from '@/types/lesson';

export const filteringData: Lesson = {
  slug: 'sql-filtering-data',
  title: 'Filtering Data',
  description: 'Learn to filter query results using WHERE, comparison operators, AND/OR, IN, BETWEEN, LIKE, and NULL checks.',
  difficulty: 'beginner',
  order: 2,
  content: `
# Filtering Data with WHERE

The WHERE clause filters rows based on conditions. Without filtering, SELECT returns every row in a table. WHERE lets you retrieve only the rows you need.

## Basic WHERE Clause

**What this example does:** Returns only rows that match a specific condition - like filtering a spreadsheet.

**When you'd use this:** Finding specific records - customers in a city, orders from today, products in a category, users with a certain status.

\`\`\`sql
SELECT first_name, last_name, department
FROM employees
WHERE department = 'Sales';
\`\`\`

This returns only employees in the Sales department.

**Real-world example:** Finding all active subscriptions:
\`\`\`sql
SELECT user_id, plan_name, start_date
FROM subscriptions
WHERE status = 'active';
\`\`\`

## Comparison Operators

SQL provides standard comparison operators:

| Operator | Meaning | Example |
|----------|---------|---------|
| = | Equal to | WHERE status = 'Active' |
| <> or != | Not equal to | WHERE status <> 'Deleted' |
| > | Greater than | WHERE salary > 50000 |
| < | Less than | WHERE age < 30 |
| >= | Greater than or equal | WHERE quantity >= 10 |
| <= | Less than or equal | WHERE price <= 100 |

\`\`\`sql
-- Find high earners
SELECT first_name, salary
FROM employees
WHERE salary > 75000;

-- Find products under $50
SELECT product_name, price
FROM products
WHERE price < 50;
\`\`\`

## Combining Conditions with AND/OR

**What this example does:** Combines multiple conditions to create more precise filters.

**When you'd use this:** Searching with multiple criteria - find products that are Electronics AND under $50, or find users who are Premium OR have been active this month.

Use AND when ALL conditions must be true:

\`\`\`sql
SELECT first_name, department, salary
FROM employees
WHERE department = 'Engineering' AND salary > 80000;
\`\`\`

Use OR when ANY condition can be true:

\`\`\`sql
SELECT first_name, department
FROM employees
WHERE department = 'Sales' OR department = 'Marketing';
\`\`\`

**Real-world example:** Finding high-value customers for a promotion:
\`\`\`sql
SELECT customer_name, email
FROM customers
WHERE total_purchases > 1000 AND last_order_date > '2024-01-01';
\`\`\`

## Operator Precedence

AND has higher precedence than OR. Use parentheses to clarify:

\`\`\`sql
-- Without parentheses: AND executes first
SELECT * FROM employees
WHERE department = 'Sales' OR department = 'Marketing' AND salary > 60000;
-- This means: Sales (any salary) OR (Marketing AND salary > 60000)

-- With parentheses: Clear intent
SELECT * FROM employees
WHERE (department = 'Sales' OR department = 'Marketing') AND salary > 60000;
-- This means: (Sales OR Marketing) AND salary must be > 60000
\`\`\`

## The IN Operator

**What this example does:** Checks if a value matches any item in a list - cleaner than writing multiple OR conditions.

**When you'd use this:** Filtering by category, status codes, selected IDs, or any set of specific values.

\`\`\`sql
-- Instead of this:
SELECT * FROM employees
WHERE department = 'Sales' OR department = 'Marketing' OR department = 'HR';

-- Use IN:
SELECT * FROM employees
WHERE department IN ('Sales', 'Marketing', 'HR');
\`\`\`

**Real-world example:** Loading multiple products by their IDs (from a shopping cart):
\`\`\`sql
SELECT product_id, name, price
FROM products
WHERE product_id IN (101, 205, 308, 412);
\`\`\`

NOT IN excludes values:

\`\`\`sql
SELECT * FROM products
WHERE category NOT IN ('Discontinued', 'Out of Stock');
\`\`\`

## The BETWEEN Operator

**What this example does:** Checks if a value falls within a range (includes both endpoints).

**When you'd use this:** Price ranges, date ranges, age brackets, quantity limits - any time you need values "from X to Y."

\`\`\`sql
-- Salaries from 50000 to 80000 (inclusive)
SELECT first_name, salary
FROM employees
WHERE salary BETWEEN 50000 AND 80000;

-- Same as:
SELECT first_name, salary
FROM employees
WHERE salary >= 50000 AND salary <= 80000;
\`\`\`

**Real-world example:** Finding products in a price range for a filter:
\`\`\`sql
SELECT product_name, price
FROM products
WHERE price BETWEEN 25 AND 100;
\`\`\`

BETWEEN works with dates too:

\`\`\`sql
SELECT order_id, order_date
FROM orders
WHERE order_date BETWEEN '2024-01-01' AND '2024-03-31';
\`\`\`

## Pattern Matching with LIKE

**What this example does:** Searches for text that matches a pattern using wildcards.

**When you'd use this:** Search features, autocomplete, finding emails by domain, matching product codes, any "contains" or "starts with" search.

LIKE searches for patterns in text:

| Wildcard | Meaning | Example |
|----------|---------|---------|
| % | Zero or more characters | 'J%' matches John, Jane, J |
| _ | Exactly one character | 'J_n' matches Jon, Jan, Jin |

**Real-world example:** Building a search feature:
\`\`\`sql
-- User types "lap" in search box
SELECT product_name, price
FROM products
WHERE product_name LIKE '%lap%';
-- Matches: Laptop, Laptop Stand, Gaming Laptop, etc.
\`\`\`

\`\`\`sql
-- Names starting with 'J'
SELECT first_name FROM employees
WHERE first_name LIKE 'J%';

-- Names ending with 'son'
SELECT last_name FROM employees
WHERE last_name LIKE '%son';

-- Names containing 'an'
SELECT first_name FROM employees
WHERE first_name LIKE '%an%';

-- Exactly 4 characters
SELECT product_code FROM products
WHERE product_code LIKE '____';
\`\`\`

## Handling NULL Values

**What this example does:** Finds rows where a column has no value (NULL) or confirms a value exists.

**When you'd use this:** Finding incomplete profiles, unassigned tasks, missing phone numbers, orders without shipping info.

NULL represents missing or unknown data. Use IS NULL or IS NOT NULL:

\`\`\`sql
-- Find employees without a manager
SELECT first_name, last_name
FROM employees
WHERE manager_id IS NULL;

-- Find employees with a phone number
SELECT first_name, phone
FROM employees
WHERE phone IS NOT NULL;
\`\`\`

**Real-world example:** Finding users who haven't verified their email:
\`\`\`sql
SELECT user_id, email
FROM users
WHERE email_verified_at IS NULL;
\`\`\`

**Important:** NULL is not equal to anything, not even itself:

\`\`\`sql
-- WRONG: This never returns rows!
SELECT * FROM employees WHERE manager_id = NULL;

-- CORRECT: Use IS NULL
SELECT * FROM employees WHERE manager_id IS NULL;
\`\`\`

## NOT Operator

NOT negates conditions:

\`\`\`sql
SELECT * FROM products WHERE NOT category = 'Discontinued';
SELECT * FROM employees WHERE department NOT IN ('HR', 'Finance');
SELECT * FROM customers WHERE email NOT LIKE '%@gmail.com';
\`\`\`

## Multiple Conditions Example

Combine everything for complex filters:

\`\`\`sql
SELECT
    first_name,
    last_name,
    department,
    salary
FROM employees
WHERE
    department IN ('Sales', 'Marketing')
    AND salary BETWEEN 50000 AND 80000
    AND hire_date >= '2020-01-01'
    AND manager_id IS NOT NULL;
\`\`\`

## Quick Reference

| Clause | Purpose | Example |
|--------|---------|---------|
| WHERE col = value | Exact match | WHERE status = 'Active' |
| AND / OR | Combine conditions | WHERE a = 1 AND b = 2 |
| IN (list) | Match any in list | WHERE id IN (1, 2, 3) |
| BETWEEN a AND b | Range (inclusive) | WHERE age BETWEEN 18 AND 65 |
| LIKE pattern | Pattern match | WHERE name LIKE 'J%' |
| IS NULL | Check for NULL | WHERE phone IS NULL |
| IS NOT NULL | Check for non-NULL | WHERE email IS NOT NULL |

## Learning Objectives

By the end of this lesson, you'll be able to:
- Filter rows using the WHERE clause
- Use comparison operators to match values
- Combine conditions with AND and OR
- Use IN for multiple value matching
- Use BETWEEN for range queries
- Use LIKE for pattern matching
- Properly handle NULL values
`,
  exercises: [
    {
      id: 1,
      title: 'Exercise 1: Basic WHERE Clause',
      description: `Filter employees by department.

**Your task:**
Write a query to find all employees in the 'Engineering' department. Select their first_name, last_name, and department.

**Table: employees**
| employee_id | first_name | last_name | department | salary |
|-------------|------------|-----------|------------|--------|
| 1 | John | Smith | Sales | 55000 |
| 2 | Sarah | Johnson | Engineering | 85000 |
| 3 | Michael | Brown | Engineering | 78000 |
| 4 | Emily | Davis | Marketing | 62000 |`,
      starterCode: `-- Find all employees in the Engineering department

`,
      solution: `SELECT first_name, last_name, department
FROM employees
WHERE department = 'Engineering';`,
      expectedOutput: [
        'Sarah|Johnson|Engineering',
        'Michael|Brown|Engineering'
      ],
      hints: [
        'Use WHERE to filter rows',
        'String values need single quotes: \'Engineering\'',
        'Syntax: SELECT cols FROM table WHERE condition;',
        'The condition is: department = \'Engineering\''
      ]
    },
    {
      id: 2,
      title: 'Exercise 2: Multiple Conditions',
      description: `Find products that meet multiple criteria.

**Your task:**
Find all products in the 'Electronics' category with a price greater than 100. Select product_name, category, and price.

**Table: products**
| product_id | product_name | category | price |
|------------|--------------|----------|-------|
| 1 | Laptop | Electronics | 999.99 |
| 2 | Mouse | Electronics | 29.99 |
| 3 | Monitor | Electronics | 349.99 |
| 4 | Desk | Furniture | 199.99 |`,
      starterCode: `-- Find Electronics products with price > 100

`,
      solution: `SELECT product_name, category, price
FROM products
WHERE category = 'Electronics' AND price > 100;`,
      expectedOutput: [
        'Laptop|Electronics|999.99',
        'Monitor|Electronics|349.99'
      ],
      hints: [
        'Use AND to combine two conditions',
        'First condition: category = \'Electronics\'',
        'Second condition: price > 100',
        'Both conditions must be true for a row to be included'
      ]
    },
    {
      id: 3,
      title: 'Exercise 3: IN and BETWEEN',
      description: `Use IN and BETWEEN to filter orders.

**Your task:**
1. Find orders with status 'Pending' or 'Processing' using IN
2. Find orders with total_amount between 100 and 500 using BETWEEN

**Table: orders**
| order_id | customer_id | status | total_amount |
|----------|-------------|--------|--------------|
| 1 | 101 | Pending | 150.00 |
| 2 | 102 | Shipped | 75.00 |
| 3 | 103 | Processing | 320.00 |
| 4 | 104 | Delivered | 450.00 |
| 5 | 105 | Pending | 600.00 |`,
      starterCode: `-- Query 1: Find orders with status 'Pending' or 'Processing'


-- Query 2: Find orders with total_amount between 100 and 500

`,
      solution: `SELECT order_id, customer_id, status
FROM orders
WHERE status IN ('Pending', 'Processing');

SELECT order_id, total_amount
FROM orders
WHERE total_amount BETWEEN 100 AND 500;`,
      expectedOutput: [
        '1|101|Pending',
        '3|103|Processing',
        '5|105|Pending',
        '1|150.00',
        '3|320.00',
        '4|450.00'
      ],
      hints: [
        'IN syntax: WHERE column IN (\'value1\', \'value2\')',
        'BETWEEN is inclusive of both endpoints',
        'BETWEEN syntax: WHERE column BETWEEN low AND high',
        'You need two separate SELECT statements'
      ]
    },
    {
      id: 4,
      title: 'Exercise 4: LIKE and NULL Checks',
      description: `Use pattern matching and NULL handling.

**Your task:**
1. Find customers whose email ends with '@gmail.com' using LIKE
2. Find customers who have no phone number (phone IS NULL)

**Table: customers**
| customer_id | name | email | phone |
|-------------|------|-------|-------|
| 1 | John Doe | john@gmail.com | 555-1234 |
| 2 | Jane Smith | jane@yahoo.com | NULL |
| 3 | Bob Wilson | bob@gmail.com | 555-5678 |
| 4 | Alice Brown | alice@outlook.com | NULL |`,
      starterCode: `-- Query 1: Find customers with gmail.com emails


-- Query 2: Find customers without a phone number

`,
      solution: `SELECT customer_id, name, email
FROM customers
WHERE email LIKE '%@gmail.com';

SELECT customer_id, name, phone
FROM customers
WHERE phone IS NULL;`,
      expectedOutput: [
        '1|John Doe|john@gmail.com',
        '3|Bob Wilson|bob@gmail.com',
        '2|Jane Smith|NULL',
        '4|Alice Brown|NULL'
      ],
      hints: [
        'Use % to match any characters before @gmail.com',
        'LIKE pattern: \'%@gmail.com\'',
        'To find NULL values, use IS NULL not = NULL',
        'Syntax: WHERE phone IS NULL'
      ]
    }
  ],
  quiz: [
    {
      question: 'Which operator should you use to check if a value is NULL?',
      options: [
        '= NULL',
        '== NULL',
        'IS NULL',
        'EQUALS NULL'
      ],
      correctIndex: 2,
      explanation: 'NULL represents unknown data and cannot be compared using =. Use IS NULL to check for NULL values and IS NOT NULL to check for non-NULL values.'
    },
    {
      question: 'What does the LIKE pattern \'%son\' match?',
      options: [
        'Names that start with "son"',
        'Names that contain "son"',
        'Names that end with "son"',
        'Names that are exactly "son"'
      ],
      correctIndex: 2,
      explanation: 'The % wildcard matches zero or more characters. \'%son\' matches any string ending with "son" like Johnson, Wilson, or Anderson.'
    },
    {
      question: 'What is the result of: WHERE salary BETWEEN 50000 AND 60000?',
      options: [
        'Salaries from 50001 to 59999',
        'Salaries from 50000 to 60000 (inclusive)',
        'Salaries from 50000 to 59999',
        'Salaries greater than 50000 and less than 60000'
      ],
      correctIndex: 1,
      explanation: 'BETWEEN is inclusive on both ends. It includes 50000 and 60000, equivalent to salary >= 50000 AND salary <= 60000.'
    },
    {
      question: 'In the expression WHERE A OR B AND C, which operation executes first?',
      options: [
        'OR executes first',
        'AND executes first',
        'They execute left to right',
        'It depends on the database'
      ],
      correctIndex: 1,
      explanation: 'AND has higher precedence than OR. So B AND C is evaluated first, then the result is ORed with A. Use parentheses to make your intent clear: (A OR B) AND C.'
    }
  ],
  buildNote: {
    title: 'Filtering Data in Real Applications',
    explanation: `The Code Tutor application uses WHERE clauses extensively for data retrieval. When loading a lesson by slug, the query \`SELECT * FROM lessons WHERE slug = ? AND language = ?\` ensures you get exactly one lesson. The search functionality uses LIKE: \`SELECT title, description FROM lessons WHERE title LIKE ? OR description LIKE ?\` with '%search_term%' patterns. Progress tracking filters by user: \`SELECT lesson_slug, completed FROM progress WHERE user_id = ?\`. The IN operator is used for batch operations: \`SELECT * FROM lessons WHERE slug IN (?, ?, ?)\` when loading multiple lessons at once. NULL checks validate data: \`SELECT * FROM users WHERE email_verified_at IS NOT NULL\` ensures only verified users can access certain features.`,
    relatedFiles: [
      'src/lib/db/queries.ts',
      'src/app/api/lessons/[slug]/route.ts',
      'src/app/api/search/route.ts'
    ],
    inTheRealWorld: `Filtering is fundamental to every database application. E-commerce sites filter products: \`WHERE category = ? AND price BETWEEN ? AND ? AND in_stock = true\`. Authentication systems check credentials: \`WHERE email = ? AND password_hash = ?\`. Analytics dashboards filter by date: \`WHERE created_at BETWEEN ? AND ?\`. Social feeds filter content: \`WHERE author_id IN (SELECT followed_id FROM follows WHERE follower_id = ?)\`. Proper indexing on filtered columns is crucial for performance at scale.`
  }
};
