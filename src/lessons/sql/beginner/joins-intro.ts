import { Lesson } from '@/types/lesson';

export const joinsIntro: Lesson = {
  slug: 'sql-joins-intro',
  title: 'Introduction to JOINs',
  description: 'Learn the basics of combining data from multiple tables using INNER JOIN.',
  difficulty: 'beginner',
  order: 6,
  content: `
# Introduction to JOINs

Real databases store data across multiple related tables. JOINs let you combine rows from different tables based on related columns.

## Why Multiple Tables?

Consider an e-commerce database. Instead of one giant table with duplicated data:

**Bad design (one table with duplication):**
| order_id | product_name | customer_name | customer_email |
|----------|--------------|---------------|----------------|
| 1 | Laptop | John Smith | john@email.com |
| 2 | Mouse | John Smith | john@email.com |
| 3 | Monitor | Jane Doe | jane@email.com |

**Good design (separate tables):**

**customers:**
| customer_id | name | email |
|-------------|------|-------|
| 1 | John Smith | john@email.com |
| 2 | Jane Doe | jane@email.com |

**orders:**
| order_id | customer_id | product_name |
|----------|-------------|--------------|
| 1 | 1 | Laptop |
| 2 | 1 | Mouse |
| 3 | 2 | Monitor |

The \`customer_id\` column links the tables together.

## Basic INNER JOIN

INNER JOIN returns rows where there's a match in both tables:

\`\`\`sql
SELECT orders.order_id, customers.name, orders.product_name
FROM orders
INNER JOIN customers ON orders.customer_id = customers.customer_id;
\`\`\`

Breaking it down:
- **FROM orders** - Start with the orders table
- **INNER JOIN customers** - Join with the customers table
- **ON orders.customer_id = customers.customer_id** - Match on this condition

Result:
| order_id | name | product_name |
|----------|------|--------------|
| 1 | John Smith | Laptop |
| 2 | John Smith | Mouse |
| 3 | Jane Doe | Monitor |

## The ON Clause

The ON clause specifies how tables are related:

\`\`\`sql
-- Match where the IDs are equal
ON orders.customer_id = customers.customer_id

-- You can also use other conditions
ON employees.department_id = departments.id

-- Multiple conditions with AND
ON a.id = b.id AND a.type = b.type
\`\`\`

## Table Aliases

Use aliases to shorten table names:

\`\`\`sql
SELECT o.order_id, c.name, o.product_name
FROM orders o
INNER JOIN customers c ON o.customer_id = c.customer_id;
\`\`\`

Aliases are especially helpful when:
- Table names are long
- You're joining many tables
- You're joining a table to itself

## Selecting Columns from Both Tables

You can select any columns from either table:

\`\`\`sql
SELECT
    c.customer_id,
    c.name,
    c.email,
    o.order_id,
    o.product_name,
    o.order_date
FROM customers c
INNER JOIN orders o ON c.customer_id = o.customer_id;
\`\`\`

## Qualifying Column Names

When column names exist in both tables, qualify them with the table name:

\`\`\`sql
-- Both tables have 'id' column - must qualify
SELECT
    customers.id AS customer_id,
    orders.id AS order_id,
    customers.name
FROM customers
INNER JOIN orders ON customers.id = orders.customer_id;

-- With aliases (cleaner)
SELECT
    c.id AS customer_id,
    o.id AS order_id,
    c.name
FROM customers c
INNER JOIN orders o ON c.id = o.customer_id;
\`\`\`

## Joining Three or More Tables

Chain multiple JOINs:

\`\`\`sql
SELECT
    c.name AS customer,
    o.order_date,
    p.product_name,
    p.price
FROM customers c
INNER JOIN orders o ON c.customer_id = o.customer_id
INNER JOIN products p ON o.product_id = p.product_id;
\`\`\`

## Adding WHERE, ORDER BY

Use other clauses with JOINs:

\`\`\`sql
SELECT c.name, o.order_date, o.total_amount
FROM customers c
INNER JOIN orders o ON c.customer_id = o.customer_id
WHERE o.total_amount > 100
ORDER BY o.order_date DESC;
\`\`\`

Query order remains:
1. FROM (and JOINs)
2. WHERE
3. GROUP BY
4. HAVING
5. SELECT
6. ORDER BY

## INNER JOIN Behavior

INNER JOIN only returns rows with matches in BOTH tables:

\`\`\`sql
-- If a customer has no orders, they won't appear
-- If an order has an invalid customer_id, it won't appear

SELECT c.name, o.order_id
FROM customers c
INNER JOIN orders o ON c.customer_id = o.customer_id;
\`\`\`

Customers without orders are excluded. This is often what you want, but sometimes you need LEFT JOIN (covered in intermediate lessons).

## Common Patterns

\`\`\`sql
-- Order details with customer info
SELECT
    o.order_id,
    o.order_date,
    c.name AS customer_name,
    c.email
FROM orders o
INNER JOIN customers c ON o.customer_id = c.customer_id
WHERE o.order_date >= '2024-01-01';

-- Employee with their department name
SELECT
    e.first_name,
    e.last_name,
    d.department_name
FROM employees e
INNER JOIN departments d ON e.department_id = d.department_id;

-- Products with their category names
SELECT
    p.product_name,
    p.price,
    c.category_name
FROM products p
INNER JOIN categories c ON p.category_id = c.category_id
ORDER BY c.category_name, p.product_name;
\`\`\`

## Common Mistakes

\`\`\`sql
-- WRONG: Forgetting the ON clause
SELECT * FROM orders INNER JOIN customers;  -- Error!

-- WRONG: Using = instead of ON
SELECT * FROM orders INNER JOIN customers = customer_id;  -- Error!

-- WRONG: Ambiguous column name
SELECT customer_id, name  -- Which table is customer_id from?
FROM orders
INNER JOIN customers ON orders.customer_id = customers.customer_id;

-- CORRECT: Qualify ambiguous columns
SELECT customers.customer_id, customers.name
FROM orders
INNER JOIN customers ON orders.customer_id = customers.customer_id;
\`\`\`

## Quick Reference

| Syntax | Purpose |
|--------|---------|
| FROM a INNER JOIN b ON condition | Join two tables |
| ON a.col = b.col | Specify match condition |
| FROM a alias | Create table alias |
| a.column | Qualify column with table |

## Learning Objectives

By the end of this lesson, you'll be able to:
- Understand why databases use multiple related tables
- Write INNER JOIN queries to combine data
- Use the ON clause to specify join conditions
- Use table aliases for cleaner code
- Select columns from multiple tables
- Chain multiple JOINs together
`,
  exercises: [
    {
      id: 1,
      title: 'Exercise 1: Basic INNER JOIN',
      description: `Join orders with customers to see who placed each order.

**Your task:**
Write a query to show order_id, customer name, and order total_amount by joining orders with customers.

**Table: customers**
| customer_id | name | email |
|-------------|------|-------|
| 1 | John Smith | john@email.com |
| 2 | Jane Doe | jane@email.com |

**Table: orders**
| order_id | customer_id | total_amount |
|----------|-------------|--------------|
| 101 | 1 | 150.00 |
| 102 | 2 | 89.99 |
| 103 | 1 | 245.00 |`,
      starterCode: `-- Join orders with customers to show order_id, name, total_amount

`,
      solution: `SELECT o.order_id, c.name, o.total_amount
FROM orders o
INNER JOIN customers c ON o.customer_id = c.customer_id;`,
      expectedOutput: [
        '101|John Smith|150.00',
        '102|Jane Doe|89.99',
        '103|John Smith|245.00'
      ],
      hints: [
        'Start with FROM orders',
        'Use INNER JOIN customers',
        'The ON clause matches customer_id in both tables',
        'Use aliases like "orders o" for shorter code'
      ]
    },
    {
      id: 2,
      title: 'Exercise 2: Join with Table Aliases',
      description: `Use table aliases to write a cleaner query.

**Your task:**
Join employees with departments to show employee first_name, last_name, and department_name. Use aliases 'e' for employees and 'd' for departments.

**Table: employees**
| employee_id | first_name | last_name | department_id |
|-------------|------------|-----------|---------------|
| 1 | John | Smith | 10 |
| 2 | Sarah | Johnson | 20 |
| 3 | Michael | Brown | 10 |

**Table: departments**
| department_id | department_name |
|---------------|-----------------|
| 10 | Engineering |
| 20 | Marketing |`,
      starterCode: `-- Join employees (e) with departments (d)

`,
      solution: `SELECT e.first_name, e.last_name, d.department_name
FROM employees e
INNER JOIN departments d ON e.department_id = d.department_id;`,
      expectedOutput: [
        'John|Smith|Engineering',
        'Sarah|Johnson|Marketing',
        'Michael|Brown|Engineering'
      ],
      hints: [
        'Create alias: FROM employees e',
        'Create alias: INNER JOIN departments d',
        'Use aliases in SELECT: e.first_name, d.department_name',
        'ON matches department_id from both tables'
      ]
    },
    {
      id: 3,
      title: 'Exercise 3: Join with WHERE and ORDER BY',
      description: `Filter and sort joined data.

**Your task:**
Join orders with customers, but only show orders over $100, sorted by total_amount descending. Show customer name and total_amount.

**Table: customers**
| customer_id | name |
|-------------|------|
| 1 | John Smith |
| 2 | Jane Doe |

**Table: orders**
| order_id | customer_id | total_amount |
|----------|-------------|--------------|
| 101 | 1 | 75.00 |
| 102 | 2 | 189.99 |
| 103 | 1 | 245.00 |
| 104 | 2 | 50.00 |`,
      starterCode: `-- Join and filter for orders over $100, sorted by amount

`,
      solution: `SELECT c.name, o.total_amount
FROM orders o
INNER JOIN customers c ON o.customer_id = c.customer_id
WHERE o.total_amount > 100
ORDER BY o.total_amount DESC;`,
      expectedOutput: [
        'John Smith|245.00',
        'Jane Doe|189.99'
      ],
      hints: [
        'First do the INNER JOIN',
        'Add WHERE to filter after the join',
        'WHERE comes after ON',
        'ORDER BY comes last'
      ]
    },
    {
      id: 4,
      title: 'Exercise 4: Three-Table Join',
      description: `Join three tables to get complete order information.

**Your task:**
Join orders, customers, and products to show:
- Customer name
- Product product_name
- Order quantity

**Table: customers**
| customer_id | name |
|-------------|------|
| 1 | John Smith |
| 2 | Jane Doe |

**Table: orders**
| order_id | customer_id | product_id | quantity |
|----------|-------------|------------|----------|
| 101 | 1 | 501 | 2 |
| 102 | 2 | 502 | 1 |

**Table: products**
| product_id | product_name |
|------------|--------------|
| 501 | Laptop |
| 502 | Monitor |`,
      starterCode: `-- Join all three tables to show customer name, product name, quantity

`,
      solution: `SELECT c.name, p.product_name, o.quantity
FROM orders o
INNER JOIN customers c ON o.customer_id = c.customer_id
INNER JOIN products p ON o.product_id = p.product_id;`,
      expectedOutput: [
        'John Smith|Laptop|2',
        'Jane Doe|Monitor|1'
      ],
      hints: [
        'Start with orders as the main table',
        'Join customers on customer_id',
        'Then join products on product_id',
        'Chain the INNER JOINs one after another'
      ]
    }
  ],
  quiz: [
    {
      question: 'What does INNER JOIN return?',
      options: [
        'All rows from both tables',
        'Only rows that have matching values in both tables',
        'All rows from the first table',
        'All rows from the second table'
      ],
      correctIndex: 1,
      explanation: 'INNER JOIN returns only the rows where there is a match in both tables based on the ON condition. Unmatched rows from either table are excluded.'
    },
    {
      question: 'What is the purpose of the ON clause in a JOIN?',
      options: [
        'To specify which columns to select',
        'To filter the results',
        'To specify how the tables are related',
        'To order the results'
      ],
      correctIndex: 2,
      explanation: 'The ON clause specifies the join condition - how rows from one table should be matched to rows in another table, typically by comparing related columns.'
    },
    {
      question: 'Why use table aliases in JOIN queries?',
      options: [
        'They make queries run faster',
        'They are required for JOINs to work',
        'They make queries shorter and easier to read',
        'They change the data in the tables'
      ],
      correctIndex: 2,
      explanation: 'Table aliases (like FROM employees e) make queries shorter and more readable, especially when joining multiple tables or when table names are long.'
    },
    {
      question: 'What happens if you SELECT a column name that exists in both joined tables without qualifying it?',
      options: [
        'SQL automatically picks the correct one',
        'It returns values from both tables',
        'You get an ambiguous column error',
        'It returns NULL'
      ],
      correctIndex: 2,
      explanation: 'When a column name exists in multiple tables, you must qualify it with the table name or alias (e.g., customers.id or c.id) to avoid an ambiguous column error.'
    }
  ],
  buildNote: {
    title: 'JOINs in Real Applications',
    explanation: `The Code Tutor application uses JOINs throughout its data access layer. Fetching a lesson with its exercises requires \`SELECT l.*, e.* FROM lessons l INNER JOIN exercises e ON l.id = e.lesson_id WHERE l.slug = ?\`. User progress combines multiple tables: \`SELECT u.username, l.title, p.completed_at FROM users u INNER JOIN progress p ON u.id = p.user_id INNER JOIN lessons l ON p.lesson_id = l.id\`. The quiz system joins questions with options: \`SELECT q.question_text, o.option_text FROM quiz_questions q INNER JOIN quiz_options o ON q.id = o.question_id\`. Understanding JOINs is essential because real applications rarely store everything in one table.`,
    relatedFiles: [
      'src/lib/db/queries.ts',
      'src/app/api/lessons/[slug]/route.ts',
      'src/lib/db/progress.ts'
    ],
    inTheRealWorld: `JOINs are fundamental to relational databases. E-commerce systems join orders, customers, products, and shipping: \`SELECT o.*, c.name, p.name, s.tracking FROM orders o JOIN customers c ON ... JOIN products p ON ... JOIN shipments s ON ...\`. Social platforms join users, posts, comments, and likes. Banking systems join accounts, transactions, and customers. CRM systems join contacts, companies, deals, and activities. The ability to efficiently join tables and query across relationships is what makes relational databases powerful for complex business applications.`
  }
};
