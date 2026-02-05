import { Lesson } from '@/types/lesson';

export const beginnerTest: Lesson = {
  slug: 'sql-beginner-test',
  title: 'SQL Beginner Test',
  description: 'Test your understanding of SQL fundamentals: SELECT, WHERE, ORDER BY, aggregates, GROUP BY, basic JOINs, and data manipulation.',
  difficulty: 'beginner',
  order: 9,
  content: `
# SQL Beginner Test

Congratulations on completing the SQL Beginner section! This test will assess your understanding of the fundamental SQL concepts you've learned.

## What This Test Covers

- **SELECT Statements** - Retrieving data from tables
- **WHERE Clauses** - Filtering data with conditions
- **ORDER BY** - Sorting query results
- **Aggregate Functions** - COUNT, SUM, AVG, MIN, MAX
- **GROUP BY** - Grouping data for aggregation
- **Basic JOINs** - Combining data from multiple tables
- **INSERT, UPDATE, DELETE** - Modifying data in tables

## Test Format

This test includes:
- **Multiple choice questions** testing conceptual understanding
- **Code output prediction** - reading SQL and predicting results
- **Coding exercises** - writing SQL queries to solve problems

Take your time and think through each question carefully. You can use the hints if you get stuck on coding exercises.

## Ready?

Complete the quiz and exercises below to demonstrate your SQL fundamentals knowledge!
`,
  exercises: [
    {
      id: 1,
      title: 'Exercise 1: Filtering and Sorting Products',
      description: `Write a query to find products matching specific criteria.

**Given table: products**
| id | name | category | price | in_stock |
|----|------|----------|-------|----------|
| 1 | Laptop | Electronics | 999.99 | 50 |
| 2 | Mouse | Electronics | 29.99 | 200 |
| 3 | Desk | Furniture | 249.99 | 30 |
| 4 | Chair | Furniture | 199.99 | 45 |
| 5 | Monitor | Electronics | 349.99 | 75 |

**Your task:**
1. Write a SELECT query to find all products in the 'Electronics' category
2. Only include products with a price less than 500
3. Order the results by price in descending order
4. Select only the name and price columns

**Expected output should show Monitor, Mouse (in that order)**`,
      starterCode: `-- Write your SELECT query here
-- Find Electronics products under $500
-- Order by price descending
-- Select name and price only

`,
      solution: `SELECT name, price
FROM products
WHERE category = 'Electronics'
  AND price < 500
ORDER BY price DESC;`,
      expectedOutput: [
        'Monitor | 349.99',
        'Mouse | 29.99'
      ],
      hints: [
        'Start with SELECT followed by the column names you want',
        'Use WHERE to filter by category and price with AND',
        'String values need single quotes: \'Electronics\'',
        'ORDER BY column DESC sorts from highest to lowest'
      ]
    },
    {
      id: 2,
      title: 'Exercise 2: Aggregation with GROUP BY',
      description: `Calculate statistics about orders grouped by status.

**Given table: orders**
| id | customer_id | status | total_amount | order_date |
|----|-------------|--------|--------------|------------|
| 1 | 101 | completed | 150.00 | 2024-01-15 |
| 2 | 102 | pending | 75.50 | 2024-01-16 |
| 3 | 101 | completed | 200.00 | 2024-01-17 |
| 4 | 103 | cancelled | 50.00 | 2024-01-18 |
| 5 | 102 | completed | 125.00 | 2024-01-19 |
| 6 | 104 | pending | 300.00 | 2024-01-20 |

**Your task:**
1. Group orders by their status
2. For each status, calculate:
   - The count of orders
   - The total sum of all order amounts
3. Order the results by order_count descending

**Expected: completed (3, 475.00), pending (2, 375.50), cancelled (1, 50.00)**`,
      starterCode: `-- Write your GROUP BY query here
-- Count orders and sum amounts per status
-- Order by count descending

`,
      solution: `SELECT status,
       COUNT(*) AS order_count,
       SUM(total_amount) AS total_sum
FROM orders
GROUP BY status
ORDER BY order_count DESC;`,
      expectedOutput: [
        'completed | 3 | 475.00',
        'pending | 2 | 375.50',
        'cancelled | 1 | 50.00'
      ],
      hints: [
        'Use COUNT(*) to count rows in each group',
        'Use SUM(column) to add up values in a column',
        'GROUP BY groups rows with the same status together',
        'Use AS to give meaningful names to calculated columns'
      ]
    },
    {
      id: 3,
      title: 'Exercise 3: Basic JOIN Query',
      description: `Combine data from customers and orders tables.

**Given tables:**

**customers**
| id | name | email |
|----|------|-------|
| 101 | Alice | alice@email.com |
| 102 | Bob | bob@email.com |
| 103 | Carol | carol@email.com |

**orders**
| id | customer_id | total_amount | order_date |
|----|-------------|--------------|------------|
| 1 | 101 | 150.00 | 2024-01-15 |
| 2 | 102 | 75.50 | 2024-01-16 |
| 3 | 101 | 200.00 | 2024-01-17 |

**Your task:**
1. Join the customers and orders tables
2. Select the customer name, order total_amount, and order_date
3. Only include orders with total_amount greater than 100
4. Order by order_date ascending

**Expected: Alice's orders of 150.00 and 200.00**`,
      starterCode: `-- Write your JOIN query here
-- Connect customers with their orders
-- Filter for orders over $100
-- Order by date

`,
      solution: `SELECT c.name, o.total_amount, o.order_date
FROM customers c
INNER JOIN orders o ON c.id = o.customer_id
WHERE o.total_amount > 100
ORDER BY o.order_date ASC;`,
      expectedOutput: [
        'Alice | 150.00 | 2024-01-15',
        'Alice | 200.00 | 2024-01-17'
      ],
      hints: [
        'Use INNER JOIN to combine tables where there are matches',
        'The ON clause specifies how tables relate: c.id = o.customer_id',
        'Table aliases (c, o) make the query shorter and clearer',
        'Use table.column notation to avoid ambiguity'
      ]
    }
  ],
  buildNote: {
    title: 'SQL Fundamentals in Real Applications',
    explanation: `These foundational SQL concepts appear in virtually every database-driven application. E-commerce sites use SELECT with WHERE to filter products by category and price. ORDER BY powers product listings sorted by popularity or price. Aggregate functions generate dashboard statistics like total sales and average order value. GROUP BY creates reports showing sales by region or category. JOINs connect related data across tables - customers with their orders, products with their categories. Every web application, mobile app, or business system relies on these fundamental operations.`,
    relatedFiles: [
      'src/lessons/sql/beginner/select-basics.ts',
      'src/lessons/sql/beginner/filtering-sorting.ts',
      'src/lessons/sql/beginner/aggregate-functions.ts',
      'src/lessons/sql/beginner/joins-intro.ts'
    ],
    inTheRealWorld: `Entry-level data analyst and backend developer positions require mastery of these SQL fundamentals. Companies like Amazon, Google, and Microsoft expect candidates to write basic queries in technical interviews. Business analysts use these skills daily to generate reports and answer questions about data. Data engineering roles build on this foundation to create data pipelines and ETL processes.`
  },
  quiz: [
    // Definition questions
    {
      question: 'What is the purpose of the SELECT statement in SQL?',
      options: [
        'To create new tables in the database',
        'To retrieve data from one or more tables',
        'To delete rows from a table',
        'To modify existing data'
      ],
      correctIndex: 1,
      explanation: 'SELECT is used to query and retrieve data from tables. It specifies which columns to return and can include filtering, sorting, and aggregation.'
    },
    {
      question: 'What does the WHERE clause do in a SQL query?',
      options: [
        'Specifies which columns to display',
        'Orders the result set',
        'Filters rows based on specified conditions',
        'Groups rows for aggregation'
      ],
      correctIndex: 2,
      explanation: 'WHERE filters rows before they are included in the result set. Only rows that satisfy the condition(s) are returned.'
    },
    {
      question: 'What is the difference between INNER JOIN and LEFT JOIN?',
      options: [
        'INNER JOIN is faster than LEFT JOIN',
        'INNER JOIN returns only matching rows; LEFT JOIN returns all rows from the left table',
        'LEFT JOIN can only be used with two tables',
        'There is no difference'
      ],
      correctIndex: 1,
      explanation: 'INNER JOIN returns only rows that have matches in both tables. LEFT JOIN returns all rows from the left table, with NULL values for non-matching rows from the right table.'
    },
    {
      question: 'When must you use GROUP BY in a query?',
      options: [
        'Whenever you use ORDER BY',
        'When using aggregate functions with non-aggregated columns',
        'Only with COUNT function',
        'When joining more than two tables'
      ],
      correctIndex: 1,
      explanation: 'When you use aggregate functions (COUNT, SUM, AVG, etc.) along with non-aggregated columns, you must GROUP BY those non-aggregated columns to tell SQL how to group the data.'
    },
    {
      question: 'What is the purpose of ORDER BY DESC?',
      options: [
        'Sorts results in ascending order',
        'Sorts results in descending order (highest to lowest)',
        'Describes the data structure',
        'Filters out duplicate rows'
      ],
      correctIndex: 1,
      explanation: 'ORDER BY DESC sorts the result set in descending order - from highest to lowest for numbers, Z to A for text, or newest to oldest for dates.'
    },
    // Concept questions
    {
      question: 'Which aggregate function would you use to find the average price of products?',
      options: ['COUNT(price)', 'SUM(price)', 'AVG(price)', 'MAX(price)'],
      correctIndex: 2,
      explanation: 'AVG() calculates the average (mean) of numeric values. COUNT counts rows, SUM adds values, and MAX finds the highest value.'
    },
    {
      question: 'What is the correct order of SQL clauses in a SELECT statement?',
      options: [
        'SELECT, WHERE, FROM, ORDER BY',
        'SELECT, FROM, WHERE, ORDER BY',
        'FROM, SELECT, WHERE, ORDER BY',
        'SELECT, FROM, ORDER BY, WHERE'
      ],
      correctIndex: 1,
      explanation: 'The correct order is: SELECT (columns) FROM (table) WHERE (conditions) GROUP BY (grouping) HAVING (group filter) ORDER BY (sorting).'
    },
    {
      question: 'What does COUNT(*) count?',
      options: [
        'Only non-NULL values',
        'All rows including those with NULL values',
        'Only numeric columns',
        'Distinct values only'
      ],
      correctIndex: 1,
      explanation: 'COUNT(*) counts all rows regardless of NULL values. COUNT(column) counts only non-NULL values in that specific column.'
    },
    // Code output questions
    {
      question: 'What does this query return?\n\n```sql\nSELECT * FROM products WHERE price > 100 AND category = \'Electronics\';\n```',
      options: [
        'All products',
        'Products over $100 OR in Electronics',
        'Products over $100 AND in Electronics category',
        'Syntax error'
      ],
      correctIndex: 2,
      explanation: 'The AND operator requires both conditions to be true. Only products that are BOTH over $100 AND in the Electronics category are returned.'
    },
    {
      question: 'What does this query return?\n\n```sql\nSELECT category, COUNT(*) FROM products GROUP BY category;\n```',
      options: [
        'A list of all products',
        'The total count of all products',
        'Each unique category with its product count',
        'An error because category is not aggregated'
      ],
      correctIndex: 2,
      explanation: 'GROUP BY category groups all products by their category. COUNT(*) then counts how many products are in each group, giving you the count per category.'
    },
    {
      question: 'What is the result of this UPDATE?\n\n```sql\nUPDATE products SET price = price * 1.1 WHERE category = \'Electronics\';\n```',
      options: [
        'Deletes all Electronics products',
        'Sets all prices to 1.1',
        'Increases Electronics prices by 10%',
        'Error: cannot multiply in UPDATE'
      ],
      correctIndex: 2,
      explanation: 'This multiplies the existing price by 1.1 (adding 10%) for all products in the Electronics category. Other categories are unchanged.'
    },
    {
      question: 'What does this query return?\n\n```sql\nSELECT name FROM employees ORDER BY salary DESC LIMIT 3;\n```',
      options: [
        'The 3 lowest paid employees',
        'The 3 highest paid employees',
        'All employees sorted by salary',
        'Only employees with salary of 3'
      ],
      correctIndex: 1,
      explanation: 'ORDER BY salary DESC sorts from highest to lowest salary. LIMIT 3 then takes only the first 3 rows, giving you the top 3 highest paid employees.'
    },
    {
      question: 'What is the difference between DELETE and TRUNCATE?',
      options: [
        'DELETE is faster than TRUNCATE',
        'TRUNCATE can use WHERE clause',
        'DELETE removes specific rows; TRUNCATE removes all rows',
        'There is no difference'
      ],
      correctIndex: 2,
      explanation: 'DELETE can remove specific rows using WHERE and is logged for rollback. TRUNCATE removes all rows quickly without logging individual deletions and cannot use WHERE.'
    },
    {
      question: 'What does this INSERT statement do?\n\n```sql\nINSERT INTO users (name, email) VALUES (\'John\', \'john@email.com\');\n```',
      options: [
        'Updates an existing user named John',
        'Creates a new row with the specified name and email',
        'Deletes the user John',
        'Returns all users named John'
      ],
      correctIndex: 1,
      explanation: 'INSERT INTO adds a new row to the table. The column list specifies which columns receive values, and VALUES provides the data for those columns.'
    },
    {
      question: 'What happens with NULL in this comparison?\n\n```sql\nSELECT * FROM orders WHERE discount = NULL;\n```',
      options: [
        'Returns rows where discount is NULL',
        'Returns all rows',
        'Returns no rows (incorrect NULL comparison)',
        'Causes a syntax error'
      ],
      correctIndex: 2,
      explanation: 'NULL cannot be compared with = operator. Use IS NULL or IS NOT NULL instead. The comparison NULL = NULL is not true in SQL - it evaluates to unknown.'
    },
    {
      question: 'What does DISTINCT do in a SELECT statement?',
      options: [
        'Sorts the results',
        'Removes duplicate rows from the result',
        'Counts unique values',
        'Joins tables distinctly'
      ],
      correctIndex: 1,
      explanation: 'DISTINCT eliminates duplicate rows from the result set. SELECT DISTINCT category returns each unique category only once.'
    }
  ]
};
