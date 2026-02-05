import { Lesson } from '@/types/lesson';

export const intermediateTest: Lesson = {
  slug: 'sql-intermediate-test',
  title: 'SQL Intermediate Test',
  description: 'Test your understanding of advanced JOINs, subqueries, views, indexes, constraints, transactions, and stored procedures.',
  difficulty: 'intermediate',
  order: 20,
  content: `
# SQL Intermediate Test

Excellent work completing the SQL Intermediate section! This test will assess your understanding of the core SQL patterns that database professionals use daily.

## What This Test Covers

- **Advanced JOINs** - LEFT, RIGHT, FULL OUTER, CROSS, self-joins
- **Subqueries** - Nested queries in SELECT, FROM, and WHERE
- **Views** - Virtual tables for simplified access
- **Indexes** - Performance optimization structures
- **Constraints** - Data integrity rules (PRIMARY KEY, FOREIGN KEY, UNIQUE, CHECK)
- **Transactions** - ACID properties and transaction control
- **Stored Procedures** - Reusable SQL programs

## Test Format

This test includes:
- **Multiple choice questions** testing conceptual understanding
- **Code output prediction** - reading SQL and predicting results
- **Coding exercises** - writing queries to solve complex problems

These concepts form the backbone of professional database development. Take your time!
`,
  exercises: [
    {
      id: 1,
      title: 'Exercise 1: Subquery for Comparison',
      description: `Use subqueries to find employees earning above average.

**Given table: employees**
| id | name | department | salary |
|----|------|------------|--------|
| 1 | Alice | Engineering | 85000 |
| 2 | Bob | Sales | 55000 |
| 3 | Carol | Engineering | 92000 |
| 4 | Dave | Marketing | 62000 |
| 5 | Eve | Engineering | 78000 |
| 6 | Frank | Sales | 58000 |

Average salary: 71,666.67

**Your task:**
1. Write a query that finds all employees whose salary is above the company average
2. Use a subquery to calculate the average salary
3. Select the employee name, department, and salary
4. Order by salary descending

**Expected: Carol, Alice, Eve (in that order)**`,
      starterCode: `-- Write your query with a subquery
-- Find employees earning above average
-- Order by salary descending

`,
      solution: `SELECT name, department, salary
FROM employees
WHERE salary > (SELECT AVG(salary) FROM employees)
ORDER BY salary DESC;`,
      expectedOutput: [
        'Carol | Engineering | 92000',
        'Alice | Engineering | 85000',
        'Eve | Engineering | 78000'
      ],
      hints: [
        'The subquery calculates: (SELECT AVG(salary) FROM employees)',
        'Place the subquery in the WHERE clause for comparison',
        'The outer query uses the subquery result as a value',
        'Subqueries in WHERE must return a single value for comparison with >'
      ]
    },
    {
      id: 2,
      title: 'Exercise 2: Create a View with JOIN',
      description: `Create a view that combines order information with customer details.

**Given tables:**

**customers**
| id | name | city |
|----|------|------|
| 1 | Alice | NYC |
| 2 | Bob | LA |

**orders**
| id | customer_id | total | status |
|----|-------------|-------|--------|
| 101 | 1 | 250.00 | completed |
| 102 | 1 | 175.00 | pending |
| 103 | 2 | 320.00 | completed |

**Your task:**
1. Create a VIEW named 'order_summary'
2. Join customers and orders tables
3. Include: customer name, city, order total, and status
4. Then SELECT from the view to show all completed orders

**Note:** Creating a view encapsulates the JOIN for reuse**`,
      starterCode: `-- Create the view that joins customers and orders


-- Query the view for completed orders

`,
      solution: `CREATE VIEW order_summary AS
SELECT c.name AS customer_name,
       c.city,
       o.total AS order_total,
       o.status
FROM customers c
INNER JOIN orders o ON c.id = o.customer_id;

SELECT * FROM order_summary
WHERE status = 'completed';`,
      expectedOutput: [
        'Alice | NYC | 250.00 | completed',
        'Bob | LA | 320.00 | completed'
      ],
      hints: [
        'CREATE VIEW view_name AS SELECT ...',
        'The view definition is a regular SELECT statement',
        'Use column aliases to give meaningful names',
        'Query the view like any other table with SELECT'
      ]
    },
    {
      id: 3,
      title: 'Exercise 3: Transaction with Rollback Logic',
      description: `Write a transaction that transfers funds between accounts safely.

**Given table: accounts**
| id | holder | balance |
|----|--------|---------|
| 1 | Alice | 1000.00 |
| 2 | Bob | 500.00 |

**Your task:**
1. Start a transaction
2. Subtract 200 from Alice's account (id = 1)
3. Add 200 to Bob's account (id = 2)
4. Check if Alice would go negative - if so, rollback
5. Otherwise, commit the transaction
6. Select final balances to verify

**The pattern should ensure both updates succeed or neither does**`,
      starterCode: `-- Start transaction


-- Subtract from Alice's account


-- Add to Bob's account


-- Commit the transaction


-- Show final balances

`,
      solution: `BEGIN TRANSACTION;

UPDATE accounts
SET balance = balance - 200
WHERE id = 1;

UPDATE accounts
SET balance = balance + 200
WHERE id = 2;

-- In real scenarios, you'd check constraints here
-- If balance < 0, ROLLBACK; else COMMIT

COMMIT;

SELECT holder, balance FROM accounts ORDER BY id;`,
      expectedOutput: [
        'Alice | 800.00',
        'Bob | 700.00'
      ],
      hints: [
        'BEGIN TRANSACTION starts an atomic unit of work',
        'All statements between BEGIN and COMMIT/ROLLBACK are grouped',
        'COMMIT makes all changes permanent',
        'ROLLBACK undoes all changes since BEGIN'
      ]
    }
  ],
  buildNote: {
    title: 'Intermediate SQL in Production Systems',
    explanation: `These intermediate SQL patterns are essential in production applications. Subqueries power complex filtering and data comparison operations. Views simplify access to frequently-joined data and provide security by exposing only certain columns. Indexes dramatically improve query performance on large tables - every production database uses them. Constraints enforce business rules at the database level, preventing invalid data. Transactions ensure financial operations, inventory updates, and multi-step processes either complete fully or not at all. Stored procedures encapsulate business logic in the database for reuse and performance.`,
    relatedFiles: [
      'src/lessons/sql/intermediate/subqueries.ts',
      'src/lessons/sql/intermediate/views.ts',
      'src/lessons/sql/intermediate/indexes.ts',
      'src/lessons/sql/intermediate/transactions.ts'
    ],
    inTheRealWorld: `Database administrator and backend developer roles require mastery of these concepts. Financial systems rely heavily on transactions for data integrity. E-commerce platforms use views to simplify reporting queries. Performance tuning with indexes is a core skill for any SQL developer. Companies like banks, healthcare providers, and e-commerce sites demand expertise in constraints and transactions.`
  },
  quiz: [
    {
      question: 'What is a correlated subquery?',
      options: [
        'A subquery that runs once before the main query',
        'A subquery that references columns from the outer query',
        'A subquery that returns multiple columns',
        'A subquery used in the FROM clause'
      ],
      correctIndex: 1,
      explanation: 'A correlated subquery references columns from the outer query, causing it to execute once for each row processed by the outer query. This differs from a regular subquery which executes once.'
    },
    {
      question: 'What does LEFT JOIN return that INNER JOIN does not?',
      options: [
        'Duplicate rows',
        'Rows from the left table with no match in the right table',
        'Rows from both tables with no match',
        'Only matched rows'
      ],
      correctIndex: 1,
      explanation: 'LEFT JOIN returns all rows from the left table, including those with no matching row in the right table (with NULL values for right table columns). INNER JOIN only returns rows with matches in both tables.'
    },
    {
      question: 'What is the purpose of a database index?',
      options: [
        'To store backup copies of data',
        'To speed up data retrieval operations',
        'To encrypt sensitive data',
        'To compress table storage'
      ],
      correctIndex: 1,
      explanation: 'Indexes are data structures that speed up SELECT queries by providing quick lookup paths to rows. They work similarly to a book index - letting you find content without scanning every page.'
    },
    {
      question: 'What does the UNIQUE constraint ensure?',
      options: [
        'Values must not be NULL',
        'Values must be positive numbers',
        'All values in the column must be different',
        'The column must be the primary key'
      ],
      correctIndex: 2,
      explanation: 'UNIQUE constraint ensures no duplicate values exist in the column(s). Unlike PRIMARY KEY, UNIQUE allows NULL values (usually one NULL, depending on the database).'
    },
    {
      question: 'What does ROLLBACK do in a transaction?',
      options: [
        'Saves all changes permanently',
        'Undoes all changes since the transaction began',
        'Creates a savepoint',
        'Commits half of the changes'
      ],
      correctIndex: 1,
      explanation: 'ROLLBACK undoes all changes made within the current transaction, returning the database to its state before the transaction began. No changes are persisted.'
    },
    {
      question: 'What is the advantage of using a VIEW?',
      options: [
        'Views always run faster than regular queries',
        'Views simplify complex queries and can provide security',
        'Views automatically update when underlying data changes',
        'Views store data separately from tables'
      ],
      correctIndex: 1,
      explanation: 'Views simplify access by encapsulating complex queries, can limit which columns users see (security), and provide a stable interface even if underlying tables change. They don\'t store data - they\'re virtual tables.'
    },
    {
      question: 'What does this query return?\n\n```sql\nSELECT * FROM employees e1\nWHERE salary > (SELECT AVG(salary) FROM employees e2 WHERE e2.department = e1.department);\n```',
      options: [
        'Employees earning above company average',
        'Employees earning above their department average',
        'The highest paid employee',
        'All department averages'
      ],
      correctIndex: 1,
      explanation: 'This correlated subquery calculates the average salary for each employee\'s specific department, returning employees who earn more than their department\'s average (not the company-wide average).'
    },
    {
      question: 'What is a FOREIGN KEY constraint?',
      options: [
        'A key imported from another database',
        'A constraint that links a column to a primary key in another table',
        'An encrypted primary key',
        'A temporary key for joining tables'
      ],
      correctIndex: 1,
      explanation: 'A FOREIGN KEY creates a link between tables by referencing the PRIMARY KEY of another table. It enforces referential integrity - you cannot insert a foreign key value that doesn\'t exist in the referenced table.'
    },
    {
      question: 'What does this index creation do?\n\n```sql\nCREATE INDEX idx_orders_date ON orders(order_date);\n```',
      options: [
        'Creates a new table called idx_orders_date',
        'Creates an index to speed up queries filtering by order_date',
        'Sorts the orders table by date permanently',
        'Creates a backup of the order_date column'
      ],
      correctIndex: 1,
      explanation: 'This creates an index on the order_date column. Queries that filter or sort by order_date will be faster because the database can use the index instead of scanning all rows.'
    },
    {
      question: 'What is the difference between WHERE and HAVING?',
      options: [
        'WHERE is for SELECT, HAVING is for UPDATE',
        'WHERE filters rows before grouping, HAVING filters groups after aggregation',
        'HAVING is faster than WHERE',
        'There is no difference'
      ],
      correctIndex: 1,
      explanation: 'WHERE filters individual rows before GROUP BY aggregation. HAVING filters the aggregated groups after GROUP BY. You cannot use aggregate functions in WHERE, but you can in HAVING.'
    },
    {
      question: 'What happens if you INSERT a row that violates a FOREIGN KEY constraint?',
      options: [
        'The row is inserted with a NULL foreign key',
        'The database automatically creates the missing parent row',
        'The INSERT fails with an error',
        'The foreign key value is set to 0'
      ],
      correctIndex: 2,
      explanation: 'Inserting a row with a foreign key value that doesn\'t exist in the referenced table violates referential integrity. The database rejects the INSERT and returns an error.'
    },
    {
      question: 'What does ACID stand for in database transactions?',
      options: [
        'Add, Create, Insert, Delete',
        'Atomicity, Consistency, Isolation, Durability',
        'Automatic, Concurrent, Indexed, Distributed',
        'Asynchronous, Cached, Immutable, Dynamic'
      ],
      correctIndex: 1,
      explanation: 'ACID properties ensure reliable transactions: Atomicity (all or nothing), Consistency (valid states only), Isolation (concurrent transactions don\'t interfere), Durability (committed data persists).'
    },
    {
      question: 'What is a stored procedure?',
      options: [
        'A query saved in a text file',
        'A precompiled collection of SQL statements stored in the database',
        'A temporary table',
        'An index on a procedure column'
      ],
      correctIndex: 1,
      explanation: 'Stored procedures are named, precompiled SQL programs stored in the database. They can accept parameters, contain logic (IF, LOOP), and be reused. They often improve performance and encapsulate business logic.'
    },
    {
      question: 'What does this query return?\n\n```sql\nSELECT a.name, b.name\nFROM employees a\nJOIN employees b ON a.manager_id = b.id;\n```',
      options: [
        'All employees twice',
        'Employees and their managers (self-join)',
        'Duplicate employee records',
        'An error - cannot join table to itself'
      ],
      correctIndex: 1,
      explanation: 'This is a self-join - joining a table to itself. It pairs each employee (a) with their manager (b) by matching the employee\'s manager_id to another employee\'s id.'
    },
    {
      question: 'When should you NOT add an index to a column?',
      options: [
        'When the column is frequently used in WHERE clauses',
        'When the table has very few rows or the column has low cardinality',
        'When the column is a primary key',
        'When queries on the column are slow'
      ],
      correctIndex: 1,
      explanation: 'Indexes have overhead for INSERT/UPDATE/DELETE operations. They\'re not helpful on small tables (full scan is fast anyway) or low-cardinality columns (few unique values, like boolean or status fields).'
    }
  ]
};
