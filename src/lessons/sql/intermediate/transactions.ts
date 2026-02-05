import { Lesson } from '@/types/lesson';

export const sqlTransactions: Lesson = {
  slug: 'sql-transactions',
  title: 'Transactions',
  description: 'Learn to group SQL statements into atomic units with transactions for data integrity.',
  difficulty: 'intermediate',
  order: 17,
  content: `
# Transactions in SQL

A **transaction** is a sequence of SQL statements that are executed as a single unit of work. Either all statements succeed (commit), or all fail (rollback) - there's no partial execution.

## Why Use Transactions?

Imagine transferring money between bank accounts. You need to:
1. Subtract from Account A
2. Add to Account B

If step 1 succeeds but step 2 fails (maybe the server crashes), the money "disappears"! Transactions prevent this.

## The ACID Properties

Transactions guarantee four important properties:

| Property | Meaning | Example |
|----------|---------|---------|
| **Atomicity** | All or nothing | If any statement fails, all are rolled back |
| **Consistency** | Valid state only | Database constraints are always satisfied |
| **Isolation** | No interference | Concurrent transactions don't see each other's uncommitted changes |
| **Durability** | Permanent after commit | Committed data survives crashes |

## Basic Transaction Syntax

\`\`\`sql
-- Start a transaction
BEGIN TRANSACTION;

-- Execute your statements
UPDATE accounts SET balance = balance - 100 WHERE account_id = 1;
UPDATE accounts SET balance = balance + 100 WHERE account_id = 2;

-- If everything is OK, save the changes
COMMIT;

-- If something went wrong, undo everything
-- ROLLBACK;
\`\`\`

## Transaction Control Statements

| Statement | Purpose |
|-----------|---------|
| \`BEGIN TRANSACTION\` | Starts a new transaction |
| \`COMMIT\` | Saves all changes permanently |
| \`ROLLBACK\` | Undoes all changes since BEGIN |
| \`SAVEPOINT name\` | Creates a restore point |
| \`ROLLBACK TO name\` | Returns to a savepoint |

## Using Savepoints

Savepoints let you partially rollback a transaction:

\`\`\`sql
BEGIN TRANSACTION;

INSERT INTO orders (customer_id, total) VALUES (1, 100.00);
SAVEPOINT order_created;

INSERT INTO order_items (order_id, product_id, qty) VALUES (LAST_INSERT_ID(), 5, 2);
INSERT INTO order_items (order_id, product_id, qty) VALUES (LAST_INSERT_ID(), 99, 1);
-- Oops, product 99 doesn't exist - let's rollback just the items

ROLLBACK TO order_created;
-- The order is still there, just no items

INSERT INTO order_items (order_id, product_id, qty) VALUES (LAST_INSERT_ID(), 5, 2);
COMMIT;
\`\`\`

## Error Handling with Transactions

Different databases handle errors differently. Here's a SQL Server example with TRY...CATCH:

\`\`\`sql
BEGIN TRY
    BEGIN TRANSACTION;

    UPDATE accounts SET balance = balance - 100 WHERE account_id = 1;
    UPDATE accounts SET balance = balance + 100 WHERE account_id = 2;

    COMMIT;
    PRINT 'Transaction successful';
END TRY
BEGIN CATCH
    ROLLBACK;
    PRINT 'Error: ' + ERROR_MESSAGE();
END CATCH;
\`\`\`

## Transaction Isolation Levels

Isolation levels control how much transactions can "see" of each other's uncommitted work:

| Level | Dirty Reads | Non-Repeatable Reads | Phantom Reads |
|-------|-------------|---------------------|---------------|
| READ UNCOMMITTED | Yes | Yes | Yes |
| READ COMMITTED | No | Yes | Yes |
| REPEATABLE READ | No | No | Yes |
| SERIALIZABLE | No | No | No |

**Set isolation level:**
\`\`\`sql
SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
BEGIN TRANSACTION;
-- Your statements here
COMMIT;
\`\`\`

## Common Problems

### Dirty Read
Reading uncommitted data from another transaction that might be rolled back.

### Non-Repeatable Read
Reading the same row twice and getting different values because another transaction modified it.

### Phantom Read
Running the same query twice and getting different rows because another transaction inserted/deleted rows.

## Deadlocks

A deadlock occurs when two transactions are each waiting for the other to release a lock:

- Transaction A locks Row 1, wants Row 2
- Transaction B locks Row 2, wants Row 1
- Both wait forever!

**Prevention strategies:**
1. Always lock tables/rows in the same order
2. Keep transactions short
3. Use appropriate isolation levels
4. Set lock timeouts

## Best Practices

1. **Keep transactions short** - Lock resources for minimal time
2. **Don't include user input waits** - Never wait for user input inside a transaction
3. **Handle errors** - Always include rollback logic for failures
4. **Test with concurrency** - Verify behavior under load
5. **Choose appropriate isolation** - Higher isolation = more blocking
`,
  exercises: [
    {
      id: 1,
      title: 'Exercise 1: Basic Transaction',
      description: 'Write a transaction that transfers $500 from account 1 to account 2.',
      starterCode: `-- Table: accounts (account_id, balance)
-- Transfer $500 from account 1 to account 2 using a transaction

`,
      solution: `-- Table: accounts (account_id, balance)
-- Transfer $500 from account 1 to account 2 using a transaction

BEGIN TRANSACTION;

UPDATE accounts SET balance = balance - 500 WHERE account_id = 1;
UPDATE accounts SET balance = balance + 500 WHERE account_id = 2;

COMMIT;`,
      expectedOutput: ['BEGIN TRANSACTION', 'UPDATE', 'UPDATE', 'COMMIT'],
      hints: [
        'Start with BEGIN TRANSACTION',
        'Subtract from one account, add to another',
        'End with COMMIT to save changes'
      ],
    },
    {
      id: 2,
      title: 'Exercise 2: Transaction with Savepoint',
      description: 'Create a transaction that inserts an order, creates a savepoint, adds items, and handles potential rollback to the savepoint.',
      starterCode: `-- Create an order and add items with a savepoint for safety
-- 1. Begin transaction
-- 2. Insert order
-- 3. Create savepoint called 'items_start'
-- 4. Insert order items
-- 5. Commit

`,
      solution: `-- Create an order and add items with a savepoint for safety
BEGIN TRANSACTION;

-- Insert the order
INSERT INTO orders (customer_id, order_date, total)
VALUES (1, CURRENT_DATE, 150.00);

-- Create savepoint after order is created
SAVEPOINT items_start;

-- Insert order items
INSERT INTO order_items (order_id, product_id, quantity, price)
VALUES (LAST_INSERT_ID(), 101, 2, 50.00);

INSERT INTO order_items (order_id, product_id, quantity, price)
VALUES (LAST_INSERT_ID(), 102, 1, 50.00);

-- Everything worked, commit
COMMIT;`,
      expectedOutput: ['BEGIN TRANSACTION', 'INSERT', 'SAVEPOINT', 'INSERT', 'COMMIT'],
      hints: [
        'Use SAVEPOINT to create a restore point',
        'You could ROLLBACK TO items_start if items fail',
        'LAST_INSERT_ID() gets the auto-generated order ID'
      ],
    },
    {
      id: 3,
      title: 'Exercise 3: Transaction with Error Handling',
      description: 'Write a SQL Server transaction with TRY...CATCH that handles errors gracefully.',
      starterCode: `-- Write a transaction that:
-- 1. Inserts a new employee
-- 2. Updates department headcount
-- 3. Handles errors with TRY...CATCH

`,
      solution: `-- Write a transaction that handles errors
BEGIN TRY
    BEGIN TRANSACTION;

    -- Insert new employee
    INSERT INTO employees (name, department_id, salary)
    VALUES ('John Smith', 5, 55000);

    -- Update department headcount
    UPDATE departments
    SET employee_count = employee_count + 1
    WHERE department_id = 5;

    -- If we get here, everything worked
    COMMIT;
    PRINT 'Employee added successfully';
END TRY
BEGIN CATCH
    -- Something went wrong, rollback
    ROLLBACK;
    PRINT 'Error: ' + ERROR_MESSAGE();
END CATCH;`,
      expectedOutput: ['BEGIN TRY', 'BEGIN TRANSACTION', 'INSERT', 'UPDATE', 'COMMIT', 'END TRY', 'BEGIN CATCH', 'ROLLBACK', 'END CATCH'],
      hints: [
        'Wrap everything in BEGIN TRY...END TRY',
        'Put error handling in BEGIN CATCH...END CATCH',
        'Always ROLLBACK in the CATCH block'
      ],
    },
  ],
  quiz: [
    {
      question: 'What does the "A" in ACID stand for?',
      options: [
        'Availability - the database is always accessible',
        'Atomicity - all statements succeed or all fail',
        'Authentication - only authorized users can execute',
        'Automation - statements run automatically'
      ],
      correctIndex: 1,
    },
    {
      question: 'What happens to changes if you close a connection without calling COMMIT?',
      options: [
        'Changes are automatically committed',
        'Changes are saved but marked as pending',
        'Changes are rolled back (lost)',
        'The database crashes'
      ],
      correctIndex: 2,
    },
    {
      question: 'Which isolation level provides the highest level of isolation?',
      options: [
        'READ UNCOMMITTED',
        'READ COMMITTED',
        'REPEATABLE READ',
        'SERIALIZABLE'
      ],
      correctIndex: 3,
    },
    {
      question: 'What is a "dirty read"?',
      options: [
        'Reading from a table that needs cleaning',
        'Reading uncommitted data from another transaction',
        'Reading data that has been deleted',
        'Reading data too quickly'
      ],
      correctIndex: 1,
    },
    {
      question: 'What command creates a restore point within a transaction?',
      options: [
        'RESTORE POINT',
        'CHECKPOINT',
        'SAVEPOINT',
        'MARK'
      ],
      correctIndex: 2,
    },
  ],
  buildNote: {
    title: 'Transactions in Real Applications',
    explanation: `Transactions are essential in any application that modifies data. Web applications use transactions to ensure database consistency - for example, when creating a user account with profile data across multiple tables, or when processing an order that updates inventory and creates order records.`,
    relatedFiles: [
      'src/lib/db/transactions.ts',
      'src/app/api/orders/route.ts'
    ],
    inTheRealWorld: 'Production applications always wrap multi-step database operations in transactions. ORMs like Prisma, Sequelize, and Entity Framework provide transaction APIs that handle the BEGIN/COMMIT/ROLLBACK automatically.'
  }
};
