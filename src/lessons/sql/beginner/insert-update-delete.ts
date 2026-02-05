import { Lesson } from '@/types/lesson';

export const insertUpdateDelete: Lesson = {
  slug: 'sql-insert-update-delete',
  title: 'INSERT, UPDATE, DELETE',
  description: 'Learn to modify data using INSERT to add rows, UPDATE to change existing data, and DELETE to remove rows.',
  difficulty: 'beginner',
  order: 7,
  content: `
# INSERT, UPDATE, DELETE

While SELECT retrieves data, these three statements modify it. Together they form the "CRUD" operations: Create (INSERT), Read (SELECT), Update (UPDATE), Delete (DELETE).

## INSERT - Adding New Rows

### Basic INSERT Syntax

Insert a single row with specified values:

\`\`\`sql
INSERT INTO employees (first_name, last_name, email, department, salary)
VALUES ('John', 'Smith', 'john@company.com', 'Engineering', 75000);
\`\`\`

The structure is:
- **INSERT INTO table_name** - specify the table
- **(column1, column2, ...)** - list columns to populate
- **VALUES (value1, value2, ...)** - provide corresponding values

### Inserting Multiple Rows

Add several rows in one statement:

\`\`\`sql
INSERT INTO products (product_name, category, price)
VALUES
    ('Laptop', 'Electronics', 999.99),
    ('Mouse', 'Electronics', 29.99),
    ('Desk Chair', 'Furniture', 249.99);
\`\`\`

### Column Order Matters

Values must match the column order you specified:

\`\`\`sql
-- Columns: first_name, email (in that order)
INSERT INTO users (first_name, email)
VALUES ('Alice', 'alice@email.com');  -- Correct order

-- WRONG: Values don't match column order
INSERT INTO users (first_name, email)
VALUES ('bob@email.com', 'Bob');  -- Email in first_name!
\`\`\`

### Omitting Columns

You can skip columns that have default values or allow NULL:

\`\`\`sql
-- If hire_date has a default of CURRENT_DATE
INSERT INTO employees (first_name, last_name, email)
VALUES ('Jane', 'Doe', 'jane@company.com');
-- hire_date will be set automatically
\`\`\`

### INSERT with SELECT

Copy data from another table or query:

\`\`\`sql
-- Copy active customers to a new table
INSERT INTO vip_customers (customer_id, name, email)
SELECT customer_id, name, email
FROM customers
WHERE total_purchases > 10000;
\`\`\`

## UPDATE - Modifying Existing Rows

### Basic UPDATE Syntax

Change values in existing rows:

\`\`\`sql
UPDATE employees
SET salary = 80000
WHERE employee_id = 123;
\`\`\`

The structure is:
- **UPDATE table_name** - specify the table
- **SET column = value** - specify what to change
- **WHERE condition** - specify which rows to change

### The Critical WHERE Clause

**WARNING:** Without WHERE, UPDATE affects ALL rows:

\`\`\`sql
-- DANGEROUS: Updates EVERY employee's salary!
UPDATE employees
SET salary = 80000;

-- SAFE: Updates only one employee
UPDATE employees
SET salary = 80000
WHERE employee_id = 123;
\`\`\`

Always double-check your WHERE clause before running UPDATE.

### Updating Multiple Columns

Change several columns at once:

\`\`\`sql
UPDATE employees
SET
    salary = 85000,
    department = 'Senior Engineering',
    title = 'Senior Developer'
WHERE employee_id = 123;
\`\`\`

### Calculations in UPDATE

Use expressions to calculate new values:

\`\`\`sql
-- Give everyone a 10% raise
UPDATE employees
SET salary = salary * 1.10
WHERE department = 'Sales';

-- Increment a counter
UPDATE products
SET view_count = view_count + 1
WHERE product_id = 456;
\`\`\`

### UPDATE with Subquery

Use a subquery to determine the value:

\`\`\`sql
-- Set price to average of similar products
UPDATE products
SET price = (SELECT AVG(price) FROM products WHERE category = 'Electronics')
WHERE product_id = 789;
\`\`\`

## DELETE - Removing Rows

### Basic DELETE Syntax

Remove rows from a table:

\`\`\`sql
DELETE FROM employees
WHERE employee_id = 123;
\`\`\`

The structure is:
- **DELETE FROM table_name** - specify the table
- **WHERE condition** - specify which rows to delete

### The Critical WHERE Clause

**WARNING:** Without WHERE, DELETE removes ALL rows:

\`\`\`sql
-- DANGEROUS: Deletes EVERY row in the table!
DELETE FROM employees;

-- SAFE: Deletes only matching rows
DELETE FROM employees
WHERE status = 'Terminated';
\`\`\`

### Deleting with Conditions

Use any valid WHERE conditions:

\`\`\`sql
-- Delete old orders
DELETE FROM orders
WHERE order_date < '2020-01-01';

-- Delete based on multiple conditions
DELETE FROM products
WHERE category = 'Discontinued' AND inventory = 0;

-- Delete using IN
DELETE FROM users
WHERE user_id IN (101, 102, 103);
\`\`\`

## Safe Practices

### 1. Always Use Transactions

Wrap modifications in transactions when possible:

\`\`\`sql
BEGIN TRANSACTION;

DELETE FROM orders WHERE status = 'Cancelled';

-- If something went wrong:
ROLLBACK;

-- If everything is correct:
COMMIT;
\`\`\`

### 2. Test with SELECT First

Before UPDATE or DELETE, run a SELECT with the same WHERE:

\`\`\`sql
-- First, see what will be affected
SELECT * FROM employees WHERE department = 'Sales';

-- Then run the UPDATE
UPDATE employees SET bonus = 1000 WHERE department = 'Sales';
\`\`\`

### 3. Use LIMIT (When Supported)

Some databases allow LIMIT to restrict affected rows:

\`\`\`sql
-- Delete only 10 old records at a time
DELETE FROM logs
WHERE created_at < '2023-01-01'
LIMIT 10;
\`\`\`

### 4. Check Row Counts

Most databases tell you how many rows were affected. Verify this matches your expectations.

## Common Patterns

\`\`\`sql
-- Soft delete (mark as deleted instead of removing)
UPDATE users
SET deleted_at = CURRENT_TIMESTAMP, status = 'deleted'
WHERE user_id = 123;

-- Update only if condition is met
UPDATE inventory
SET quantity = quantity - 1
WHERE product_id = 456 AND quantity > 0;

-- Archive before delete
INSERT INTO orders_archive SELECT * FROM orders WHERE year = 2020;
DELETE FROM orders WHERE year = 2020;
\`\`\`

## Quick Reference

| Operation | Syntax |
|-----------|--------|
| Insert one row | INSERT INTO table (cols) VALUES (vals) |
| Insert multiple | INSERT INTO table (cols) VALUES (v1), (v2) |
| Update rows | UPDATE table SET col = val WHERE condition |
| Delete rows | DELETE FROM table WHERE condition |

## Learning Objectives

By the end of this lesson, you'll be able to:
- Insert new rows using INSERT
- Insert multiple rows in one statement
- Update existing data using UPDATE
- Understand the importance of WHERE in UPDATE and DELETE
- Delete rows using DELETE
- Follow safe practices to avoid data loss
`,
  exercises: [
    {
      id: 1,
      title: 'Exercise 1: INSERT Single Row',
      description: `Add a new employee to the employees table.

**Your task:**
Insert a new employee with:
- first_name: 'Alice'
- last_name: 'Wong'
- email: 'alice@company.com'
- department: 'Marketing'
- salary: 65000

**Table: employees**
| employee_id | first_name | last_name | email | department | salary |
|-------------|------------|-----------|-------|------------|--------|
| 1 | John | Smith | john@company.com | Sales | 55000 |`,
      starterCode: `-- Insert a new employee

`,
      solution: `INSERT INTO employees (first_name, last_name, email, department, salary)
VALUES ('Alice', 'Wong', 'alice@company.com', 'Marketing', 65000);`,
      expectedOutput: [
        '1 row inserted'
      ],
      hints: [
        'Use INSERT INTO table_name (columns) VALUES (values)',
        'List columns in parentheses after table name',
        'String values need single quotes',
        'Numbers don\'t need quotes'
      ]
    },
    {
      id: 2,
      title: 'Exercise 2: INSERT Multiple Rows',
      description: `Add multiple products at once.

**Your task:**
Insert three products in a single statement:
1. 'Keyboard', 'Electronics', 79.99
2. 'Monitor Stand', 'Furniture', 45.99
3. 'USB Cable', 'Electronics', 12.99

**Table: products**
| product_id | product_name | category | price |
|------------|--------------|----------|-------|`,
      starterCode: `-- Insert three products in one statement

`,
      solution: `INSERT INTO products (product_name, category, price)
VALUES
    ('Keyboard', 'Electronics', 79.99),
    ('Monitor Stand', 'Furniture', 45.99),
    ('USB Cable', 'Electronics', 12.99);`,
      expectedOutput: [
        '3 rows inserted'
      ],
      hints: [
        'Use one INSERT statement with multiple VALUES sets',
        'Separate each VALUES set with a comma',
        'Each set is enclosed in parentheses',
        'Order values to match your column list'
      ]
    },
    {
      id: 3,
      title: 'Exercise 3: UPDATE with WHERE',
      description: `Give an employee a raise.

**Your task:**
Update employee_id 2 (Sarah Johnson) to have a salary of 90000 and department of 'Senior Engineering'.

**Table: employees**
| employee_id | first_name | last_name | department | salary |
|-------------|------------|-----------|------------|--------|
| 1 | John | Smith | Sales | 55000 |
| 2 | Sarah | Johnson | Engineering | 85000 |
| 3 | Michael | Brown | Engineering | 78000 |`,
      starterCode: `-- Update employee 2's salary and department

`,
      solution: `UPDATE employees
SET salary = 90000, department = 'Senior Engineering'
WHERE employee_id = 2;`,
      expectedOutput: [
        '1 row updated'
      ],
      hints: [
        'Use UPDATE table SET column = value',
        'Separate multiple columns with commas',
        'Always include WHERE to target specific rows',
        'WHERE employee_id = 2 targets only Sarah'
      ]
    },
    {
      id: 4,
      title: 'Exercise 4: DELETE with WHERE',
      description: `Remove cancelled orders from the system.

**Your task:**
Delete all orders with status 'Cancelled'.

**Table: orders**
| order_id | customer_id | status | total_amount |
|----------|-------------|--------|--------------|
| 101 | 1 | Completed | 150.00 |
| 102 | 2 | Cancelled | 75.00 |
| 103 | 1 | Completed | 200.00 |
| 104 | 3 | Cancelled | 45.00 |`,
      starterCode: `-- Delete all cancelled orders

`,
      solution: `DELETE FROM orders
WHERE status = 'Cancelled';`,
      expectedOutput: [
        '2 rows deleted'
      ],
      hints: [
        'Use DELETE FROM table_name',
        'Always include WHERE clause',
        'WHERE status = \'Cancelled\' targets cancelled orders',
        'String values need single quotes'
      ]
    }
  ],
  quiz: [
    {
      question: 'What happens if you run UPDATE without a WHERE clause?',
      options: [
        'Only the first row is updated',
        'Nothing happens - WHERE is required',
        'ALL rows in the table are updated',
        'You get a syntax error'
      ],
      correctIndex: 2,
      explanation: 'Without WHERE, UPDATE affects every row in the table. This is extremely dangerous and can cause data loss. Always verify your WHERE clause before running UPDATE.'
    },
    {
      question: 'Which statement correctly inserts multiple rows?',
      options: [
        'INSERT INTO t VALUES (1), VALUES (2), VALUES (3);',
        'INSERT INTO t VALUES (1), (2), (3);',
        'INSERT INTO t VALUES (1) AND (2) AND (3);',
        'INSERT INTO t (1), (2), (3);'
      ],
      correctIndex: 1,
      explanation: 'To insert multiple rows, use comma-separated value sets: INSERT INTO table (columns) VALUES (row1), (row2), (row3);'
    },
    {
      question: 'What is the safest practice before running DELETE?',
      options: [
        'Run the DELETE command twice',
        'First run SELECT with the same WHERE clause',
        'Always delete all rows first',
        'Skip the WHERE clause to be safe'
      ],
      correctIndex: 1,
      explanation: 'Before DELETE (or UPDATE), run a SELECT with the same WHERE clause to see exactly which rows will be affected. This helps catch mistakes before they happen.'
    },
    {
      question: 'How do you give all employees a 5% raise?',
      options: [
        'UPDATE employees SET salary = salary + 5%;',
        'UPDATE employees SET salary = salary * 1.05;',
        'UPDATE employees ADD salary 5%;',
        'INSERT INTO employees salary = salary + 5%;'
      ],
      correctIndex: 1,
      explanation: 'To increase salary by 5%, multiply by 1.05. You can use calculations in SET: salary = salary * 1.05. Note: no WHERE means all employees get the raise.'
    }
  ],
  buildNote: {
    title: 'Data Modification in Real Applications',
    explanation: `The Code Tutor application uses INSERT, UPDATE, and DELETE throughout its data layer. User registration uses \`INSERT INTO users (email, password_hash, created_at) VALUES (?, ?, NOW())\`. Progress tracking updates: \`UPDATE user_progress SET completed = true, completed_at = NOW() WHERE user_id = ? AND lesson_id = ?\`. Soft deletes preserve data: \`UPDATE users SET deleted_at = NOW() WHERE user_id = ?\` instead of DELETE. Quiz submissions insert answers: \`INSERT INTO quiz_responses (user_id, question_id, selected_option, is_correct) VALUES (?, ?, ?, ?)\`. All modifications use parameterized queries to prevent SQL injection attacks.`,
    relatedFiles: [
      'src/lib/db/mutations.ts',
      'src/app/api/users/route.ts',
      'src/app/api/progress/route.ts'
    ],
    inTheRealWorld: `Data modification is core to every application. E-commerce processes orders: \`INSERT INTO orders (...) VALUES (...)\` then \`UPDATE inventory SET quantity = quantity - ? WHERE product_id = ?\`. User profiles update: \`UPDATE users SET email = ?, name = ? WHERE id = ?\`. Content management creates posts: \`INSERT INTO posts (title, content, author_id) VALUES (?, ?, ?)\`. Most production systems use soft deletes (\`deleted_at\` timestamp) instead of hard deletes to allow recovery and maintain referential integrity. Transactions ensure data consistency when multiple related tables need updating together.`
  }
};
