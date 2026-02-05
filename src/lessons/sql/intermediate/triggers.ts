import { Lesson } from '@/types/lesson';

export const sqlTriggers: Lesson = {
  slug: 'sql-triggers',
  title: 'Triggers',
  description: 'Learn to create automatic actions that execute in response to database events.',
  difficulty: 'intermediate',
  order: 20,
  content: `
# Triggers in SQL

A **trigger** is a special type of stored procedure that automatically executes when a specific event occurs in the database. Unlike stored procedures that you call manually, triggers "fire" automatically.

## Why Use Triggers?

| Use Case | Example |
|----------|---------|
| **Audit logging** | Record who changed what and when |
| **Data validation** | Enforce business rules beyond CHECK constraints |
| **Automatic updates** | Update related tables when data changes |
| **Maintaining history** | Archive old values before updates |
| **Enforcing referential integrity** | Custom cascade behaviors |

## Trigger Events

Triggers can fire on these events:

- **INSERT** - When a new row is added
- **UPDATE** - When an existing row is modified
- **DELETE** - When a row is removed

## Trigger Timing

| Timing | When It Fires | Common Use |
|--------|---------------|------------|
| **BEFORE** | Before the operation | Validation, modification of values |
| **AFTER** | After the operation | Logging, updating related tables |
| **INSTEAD OF** | Replaces the operation | Custom behavior for views |

## The INSERTED and DELETED Tables

SQL Server provides special tables in triggers:

| Table | Contains | Available In |
|-------|----------|--------------|
| **INSERTED** | New row values | INSERT, UPDATE |
| **DELETED** | Old row values | DELETE, UPDATE |

For UPDATE, both tables are available:
- DELETED has the old values
- INSERTED has the new values

## Creating Triggers (SQL Server)

### AFTER INSERT Trigger

\`\`\`sql
CREATE TRIGGER trg_Employee_Insert
ON employees
AFTER INSERT
AS
BEGIN
    -- Log the new employee
    INSERT INTO audit_log (table_name, action, record_id, changed_date, changed_by)
    SELECT
        'employees',
        'INSERT',
        employee_id,
        GETDATE(),
        SYSTEM_USER
    FROM INSERTED;
END;
\`\`\`

### AFTER UPDATE Trigger

\`\`\`sql
CREATE TRIGGER trg_Employee_Update
ON employees
AFTER UPDATE
AS
BEGIN
    -- Log salary changes
    IF UPDATE(salary)
    BEGIN
        INSERT INTO salary_history (employee_id, old_salary, new_salary, change_date)
        SELECT
            i.employee_id,
            d.salary AS old_salary,
            i.salary AS new_salary,
            GETDATE()
        FROM INSERTED i
        JOIN DELETED d ON i.employee_id = d.employee_id
        WHERE i.salary <> d.salary;
    END
END;
\`\`\`

### AFTER DELETE Trigger

\`\`\`sql
CREATE TRIGGER trg_Employee_Delete
ON employees
AFTER DELETE
AS
BEGIN
    -- Archive deleted employees
    INSERT INTO employees_archive
        (employee_id, name, department_id, salary, deleted_date)
    SELECT
        employee_id,
        name,
        department_id,
        salary,
        GETDATE()
    FROM DELETED;
END;
\`\`\`

## Creating Triggers (MySQL)

MySQL uses BEFORE and AFTER with NEW and OLD keywords:

### BEFORE INSERT

\`\`\`sql
DELIMITER //
CREATE TRIGGER trg_Employee_BeforeInsert
BEFORE INSERT ON employees
FOR EACH ROW
BEGIN
    -- Auto-set created_date if not provided
    IF NEW.created_date IS NULL THEN
        SET NEW.created_date = NOW();
    END IF;

    -- Ensure salary is positive
    IF NEW.salary < 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Salary cannot be negative';
    END IF;
END //
DELIMITER ;
\`\`\`

### AFTER UPDATE

\`\`\`sql
DELIMITER //
CREATE TRIGGER trg_Employee_AfterUpdate
AFTER UPDATE ON employees
FOR EACH ROW
BEGIN
    -- Log salary changes
    IF OLD.salary <> NEW.salary THEN
        INSERT INTO salary_history
            (employee_id, old_salary, new_salary, change_date)
        VALUES
            (NEW.employee_id, OLD.salary, NEW.salary, NOW());
    END IF;
END //
DELIMITER ;
\`\`\`

## INSTEAD OF Triggers (Views)

INSTEAD OF triggers let you make views updateable:

\`\`\`sql
CREATE VIEW employee_summary AS
SELECT
    e.employee_id,
    e.name,
    d.department_name
FROM employees e
JOIN departments d ON e.department_id = d.department_id;

-- Make the view "updateable"
CREATE TRIGGER trg_EmployeeSummary_Insert
ON employee_summary
INSTEAD OF INSERT
AS
BEGIN
    -- Get or create department
    DECLARE @DeptId INT;
    SELECT @DeptId = department_id
    FROM departments
    WHERE department_name = (SELECT department_name FROM INSERTED);

    IF @DeptId IS NULL
    BEGIN
        INSERT INTO departments (department_name)
        SELECT department_name FROM INSERTED;
        SET @DeptId = SCOPE_IDENTITY();
    END

    -- Insert employee
    INSERT INTO employees (name, department_id)
    SELECT name, @DeptId FROM INSERTED;
END;
\`\`\`

## Practical Examples

### Maintain Running Balance

\`\`\`sql
CREATE TRIGGER trg_Transaction_UpdateBalance
ON transactions
AFTER INSERT
AS
BEGIN
    UPDATE accounts
    SET balance = balance + i.amount
    FROM accounts a
    JOIN INSERTED i ON a.account_id = i.account_id;
END;
\`\`\`

### Prevent Deletion of Important Records

\`\`\`sql
CREATE TRIGGER trg_PreventAdminDelete
ON employees
INSTEAD OF DELETE
AS
BEGIN
    IF EXISTS (SELECT 1 FROM DELETED WHERE role = 'ADMIN')
    BEGIN
        RAISERROR('Cannot delete admin users', 16, 1);
        RETURN;
    END

    DELETE FROM employees
    WHERE employee_id IN (SELECT employee_id FROM DELETED);
END;
\`\`\`

### Auto-Update Timestamp

\`\`\`sql
-- SQL Server
CREATE TRIGGER trg_UpdateTimestamp
ON products
AFTER UPDATE
AS
BEGIN
    UPDATE products
    SET modified_date = GETDATE()
    FROM products p
    JOIN INSERTED i ON p.product_id = i.product_id;
END;
\`\`\`

## Disabling and Enabling Triggers

\`\`\`sql
-- Disable a specific trigger
DISABLE TRIGGER trg_Employee_Insert ON employees;

-- Enable it again
ENABLE TRIGGER trg_Employee_Insert ON employees;

-- Disable all triggers on a table
ALTER TABLE employees DISABLE TRIGGER ALL;

-- Enable all triggers on a table
ALTER TABLE employees ENABLE TRIGGER ALL;
\`\`\`

## Deleting Triggers

\`\`\`sql
-- SQL Server
DROP TRIGGER trg_Employee_Insert;

-- MySQL
DROP TRIGGER IF EXISTS trg_Employee_BeforeInsert;
\`\`\`

## Best Practices

1. **Keep triggers simple** - Complex logic belongs in stored procedures
2. **Avoid cascading triggers** - Triggers that fire other triggers are hard to debug
3. **Don't use for application logic** - Triggers are invisible to applications
4. **Document thoroughly** - Triggers are often forgotten
5. **Test performance** - Triggers add overhead to every operation
6. **Use SET NOCOUNT ON** - Prevents extra result sets in SQL Server

## Common Pitfalls

| Problem | Solution |
|---------|----------|
| Recursive triggers | Disable recursion or add check conditions |
| Performance issues | Keep trigger logic minimal |
| Hidden behavior | Document and communicate trigger existence |
| Transaction issues | Remember triggers run in the same transaction |
| Multiple row operations | Always handle multiple rows (use INSERTED/DELETED) |
`,
  exercises: [
    {
      id: 1,
      title: 'Exercise 1: Create an Audit Trigger',
      description: 'Create an AFTER INSERT trigger on the orders table that logs new orders to an audit_log table.',
      starterCode: `-- Create a trigger that logs new orders
-- Table: orders (order_id, customer_id, total, order_date)
-- Audit table: audit_log (log_id, table_name, action, record_id, log_date)

`,
      solution: `-- Create a trigger that logs new orders
CREATE TRIGGER trg_Orders_Insert
ON orders
AFTER INSERT
AS
BEGIN
    INSERT INTO audit_log (table_name, action, record_id, log_date)
    SELECT
        'orders',
        'INSERT',
        order_id,
        GETDATE()
    FROM INSERTED;
END;`,
      expectedOutput: ['CREATE TRIGGER', 'ON orders', 'AFTER INSERT', 'INSERTED', 'audit_log'],
      hints: [
        'Use AFTER INSERT to fire after the row is added',
        'Access the new row data from the INSERTED table',
        'SELECT from INSERTED to handle multiple rows at once'
      ],
    },
    {
      id: 2,
      title: 'Exercise 2: Track Price Changes',
      description: 'Create an AFTER UPDATE trigger that records product price changes to a price_history table.',
      starterCode: `-- Create a trigger to track price changes
-- Table: products (product_id, name, price)
-- History table: price_history (history_id, product_id, old_price, new_price, change_date)
-- Only log when price actually changes

`,
      solution: `-- Create a trigger to track price changes
CREATE TRIGGER trg_Products_PriceChange
ON products
AFTER UPDATE
AS
BEGIN
    -- Only insert if price changed
    INSERT INTO price_history (product_id, old_price, new_price, change_date)
    SELECT
        i.product_id,
        d.price AS old_price,
        i.price AS new_price,
        GETDATE()
    FROM INSERTED i
    JOIN DELETED d ON i.product_id = d.product_id
    WHERE i.price <> d.price;
END;`,
      expectedOutput: ['CREATE TRIGGER', 'AFTER UPDATE', 'INSERTED', 'DELETED', 'WHERE', 'price <>'],
      hints: [
        'DELETED contains old values, INSERTED contains new values',
        'JOIN INSERTED and DELETED on the primary key',
        'Use WHERE clause to only log when price actually changed'
      ],
    },
    {
      id: 3,
      title: 'Exercise 3: Prevent Invalid Data',
      description: 'Create a BEFORE INSERT trigger (MySQL syntax) that prevents inserting employees with negative salaries.',
      starterCode: `-- MySQL: Create a BEFORE INSERT trigger
-- Table: employees (employee_id, name, salary)
-- Prevent negative salaries by raising an error

`,
      solution: `-- MySQL: Create a BEFORE INSERT trigger
DELIMITER //
CREATE TRIGGER trg_Employees_ValidateSalary
BEFORE INSERT ON employees
FOR EACH ROW
BEGIN
    IF NEW.salary < 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Salary cannot be negative';
    END IF;
END //
DELIMITER ;`,
      expectedOutput: ['CREATE TRIGGER', 'BEFORE INSERT', 'FOR EACH ROW', 'NEW.salary', 'SIGNAL'],
      hints: [
        'MySQL uses BEFORE INSERT for validation',
        'Access the new values using NEW.column_name',
        'Use SIGNAL to raise an error that prevents the insert'
      ],
    },
  ],
  quiz: [
    {
      question: 'What is a trigger?',
      options: [
        'A manual procedure you call',
        'An automatic action that fires in response to database events',
        'A type of index',
        'A way to schedule queries'
      ],
      correctIndex: 1,
    },
    {
      question: 'In SQL Server, which special table contains the old values during an UPDATE trigger?',
      options: [
        'OLD',
        'PREVIOUS',
        'DELETED',
        'BEFORE'
      ],
      correctIndex: 2,
    },
    {
      question: 'What timing would you use to validate data before it is inserted?',
      options: [
        'AFTER',
        'BEFORE',
        'INSTEAD OF',
        'DURING'
      ],
      correctIndex: 1,
    },
    {
      question: 'What is a potential problem with triggers?',
      options: [
        'They make the database faster',
        'They are visible in application code',
        'They can hide behavior and be forgotten',
        'They cannot access the changed data'
      ],
      correctIndex: 2,
    },
    {
      question: 'When does an INSTEAD OF trigger fire?',
      options: [
        'After the operation completes',
        'Before the operation starts',
        'It replaces the operation entirely',
        'Only on weekends'
      ],
      correctIndex: 2,
    },
  ],
  buildNote: {
    title: 'Triggers in Real Applications',
    explanation: `Triggers are powerful for maintaining data integrity and creating audit trails. They're commonly used for automatically updating timestamps, maintaining denormalized data, enforcing complex business rules, and logging changes for compliance purposes.`,
    relatedFiles: [
      'src/lib/db/triggers.ts',
      'src/app/api/audit/route.ts'
    ],
    inTheRealWorld: 'Enterprise applications use triggers extensively for audit logging and maintaining historical records. However, modern architectures often prefer event-driven approaches using message queues, as triggers can make debugging difficult and impact performance.'
  }
};
