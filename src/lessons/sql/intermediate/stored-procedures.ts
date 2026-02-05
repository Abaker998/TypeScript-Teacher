import { Lesson } from '@/types/lesson';

export const sqlStoredProcedures: Lesson = {
  slug: 'sql-stored-procedures',
  title: 'Stored Procedures',
  description: 'Learn to create reusable SQL code blocks with stored procedures.',
  difficulty: 'intermediate',
  order: 18,
  content: `
# Stored Procedures in SQL

A **stored procedure** is a saved collection of SQL statements that you can call by name. Think of it like a reusable function in programming.

## Why Use Stored Procedures?

| Benefit | Explanation |
|---------|-------------|
| **Reusability** | Write once, use many times |
| **Security** | Users can execute procedure without direct table access |
| **Performance** | Pre-compiled and optimized by the database |
| **Maintainability** | Change logic in one place, affects all callers |
| **Reduced Network Traffic** | One call instead of multiple statements |

## Creating a Basic Stored Procedure

### SQL Server Syntax
\`\`\`sql
CREATE PROCEDURE GetAllEmployees
AS
BEGIN
    SELECT * FROM employees;
END;
\`\`\`

### MySQL Syntax
\`\`\`sql
DELIMITER //
CREATE PROCEDURE GetAllEmployees()
BEGIN
    SELECT * FROM employees;
END //
DELIMITER ;
\`\`\`

## Executing a Stored Procedure

\`\`\`sql
-- SQL Server
EXEC GetAllEmployees;
-- or
EXECUTE GetAllEmployees;

-- MySQL
CALL GetAllEmployees();
\`\`\`

## Parameters

Procedures can accept input parameters to customize their behavior.

### Input Parameters

\`\`\`sql
-- SQL Server
CREATE PROCEDURE GetEmployeesByDepartment
    @DeptId INT
AS
BEGIN
    SELECT * FROM employees WHERE department_id = @DeptId;
END;

-- Execute
EXEC GetEmployeesByDepartment @DeptId = 5;
\`\`\`

\`\`\`sql
-- MySQL
DELIMITER //
CREATE PROCEDURE GetEmployeesByDepartment(IN dept_id INT)
BEGIN
    SELECT * FROM employees WHERE department_id = dept_id;
END //
DELIMITER ;

-- Execute
CALL GetEmployeesByDepartment(5);
\`\`\`

### Output Parameters

Output parameters return values back to the caller.

\`\`\`sql
-- SQL Server
CREATE PROCEDURE GetEmployeeCount
    @DeptId INT,
    @Count INT OUTPUT
AS
BEGIN
    SELECT @Count = COUNT(*)
    FROM employees
    WHERE department_id = @DeptId;
END;

-- Execute
DECLARE @Result INT;
EXEC GetEmployeeCount @DeptId = 5, @Count = @Result OUTPUT;
SELECT @Result AS EmployeeCount;
\`\`\`

\`\`\`sql
-- MySQL
DELIMITER //
CREATE PROCEDURE GetEmployeeCount(IN dept_id INT, OUT emp_count INT)
BEGIN
    SELECT COUNT(*) INTO emp_count
    FROM employees
    WHERE department_id = dept_id;
END //
DELIMITER ;

-- Execute
CALL GetEmployeeCount(5, @result);
SELECT @result AS EmployeeCount;
\`\`\`

### Default Parameter Values

\`\`\`sql
-- SQL Server
CREATE PROCEDURE GetEmployees
    @MinSalary DECIMAL(10,2) = 0,
    @MaxSalary DECIMAL(10,2) = 999999.99
AS
BEGIN
    SELECT * FROM employees
    WHERE salary BETWEEN @MinSalary AND @MaxSalary;
END;

-- Can call with or without parameters
EXEC GetEmployees;                           -- Uses defaults
EXEC GetEmployees @MinSalary = 50000;        -- Only minimum
EXEC GetEmployees @MinSalary = 50000, @MaxSalary = 100000;
\`\`\`

## Variables in Procedures

Declare and use local variables:

\`\`\`sql
-- SQL Server
CREATE PROCEDURE CalculateBonus
    @EmployeeId INT
AS
BEGIN
    DECLARE @Salary DECIMAL(10,2);
    DECLARE @Bonus DECIMAL(10,2);

    SELECT @Salary = salary FROM employees WHERE employee_id = @EmployeeId;
    SET @Bonus = @Salary * 0.10;

    UPDATE employees SET bonus = @Bonus WHERE employee_id = @EmployeeId;

    SELECT @Bonus AS BonusAwarded;
END;
\`\`\`

## Control Flow

### IF...ELSE

\`\`\`sql
CREATE PROCEDURE UpdateEmployeeStatus
    @EmployeeId INT,
    @NewStatus VARCHAR(20)
AS
BEGIN
    IF @NewStatus = 'TERMINATED'
    BEGIN
        UPDATE employees
        SET status = @NewStatus, termination_date = GETDATE()
        WHERE employee_id = @EmployeeId;
    END
    ELSE
    BEGIN
        UPDATE employees
        SET status = @NewStatus
        WHERE employee_id = @EmployeeId;
    END
END;
\`\`\`

### WHILE Loop

\`\`\`sql
CREATE PROCEDURE GenerateMonthlyReports
    @Year INT
AS
BEGIN
    DECLARE @Month INT = 1;

    WHILE @Month <= 12
    BEGIN
        INSERT INTO reports (report_month, report_year, created_date)
        VALUES (@Month, @Year, GETDATE());

        SET @Month = @Month + 1;
    END
END;
\`\`\`

## Error Handling

### SQL Server TRY...CATCH

\`\`\`sql
CREATE PROCEDURE TransferFunds
    @FromAccount INT,
    @ToAccount INT,
    @Amount DECIMAL(10,2)
AS
BEGIN
    BEGIN TRY
        BEGIN TRANSACTION;

        UPDATE accounts SET balance = balance - @Amount
        WHERE account_id = @FromAccount;

        UPDATE accounts SET balance = balance + @Amount
        WHERE account_id = @ToAccount;

        COMMIT;
    END TRY
    BEGIN CATCH
        ROLLBACK;
        THROW; -- Re-throw the error
    END CATCH
END;
\`\`\`

### MySQL Error Handling

\`\`\`sql
DELIMITER //
CREATE PROCEDURE TransferFunds(
    IN from_account INT,
    IN to_account INT,
    IN amount DECIMAL(10,2)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    UPDATE accounts SET balance = balance - amount
    WHERE account_id = from_account;

    UPDATE accounts SET balance = balance + amount
    WHERE account_id = to_account;

    COMMIT;
END //
DELIMITER ;
\`\`\`

## Modifying and Deleting Procedures

\`\`\`sql
-- Modify (SQL Server)
ALTER PROCEDURE GetAllEmployees
AS
BEGIN
    SELECT employee_id, name, salary FROM employees;
END;

-- Delete
DROP PROCEDURE GetAllEmployees;

-- Delete if exists (SQL Server 2016+)
DROP PROCEDURE IF EXISTS GetAllEmployees;
\`\`\`

## Best Practices

1. **Use meaningful names** - \`usp_GetEmployeeById\` is better than \`proc1\`
2. **Document parameters** - Add comments explaining what each parameter does
3. **Handle errors** - Always include error handling
4. **Use transactions** - For procedures that modify data
5. **Keep procedures focused** - One procedure, one task
6. **Validate inputs** - Check parameters before using them
`,
  exercises: [
    {
      id: 1,
      title: 'Exercise 1: Create a Simple Procedure',
      description: 'Create a stored procedure named GetActiveEmployees that returns all employees with status = "ACTIVE".',
      starterCode: `-- Create a procedure that returns all active employees
-- Table: employees (employee_id, name, status, salary)

`,
      solution: `-- Create a procedure that returns all active employees
CREATE PROCEDURE GetActiveEmployees
AS
BEGIN
    SELECT employee_id, name, status, salary
    FROM employees
    WHERE status = 'ACTIVE';
END;`,
      expectedOutput: ['CREATE PROCEDURE', 'SELECT', 'FROM employees', 'WHERE status'],
      hints: [
        'Use CREATE PROCEDURE followed by the procedure name',
        'The procedure body goes between BEGIN and END',
        'Filter using WHERE status = "ACTIVE"'
      ],
    },
    {
      id: 2,
      title: 'Exercise 2: Procedure with Input Parameter',
      description: 'Create a stored procedure named GetOrdersByCustomer that accepts a customer_id parameter and returns all orders for that customer.',
      starterCode: `-- Create a procedure with an input parameter
-- Table: orders (order_id, customer_id, order_date, total)

`,
      solution: `-- Create a procedure with an input parameter
CREATE PROCEDURE GetOrdersByCustomer
    @CustomerId INT
AS
BEGIN
    SELECT order_id, customer_id, order_date, total
    FROM orders
    WHERE customer_id = @CustomerId
    ORDER BY order_date DESC;
END;`,
      expectedOutput: ['CREATE PROCEDURE', '@CustomerId INT', 'SELECT', 'WHERE customer_id ='],
      hints: [
        'Declare the parameter after the procedure name',
        'In SQL Server, parameters start with @',
        'Use the parameter in the WHERE clause'
      ],
    },
    {
      id: 3,
      title: 'Exercise 3: Procedure with Output Parameter',
      description: 'Create a stored procedure named GetTotalSales that accepts a year parameter and returns the total sales amount via an output parameter.',
      starterCode: `-- Create a procedure with output parameter
-- Table: sales (sale_id, sale_date, amount)
-- Return total sales for the given year via OUTPUT parameter

`,
      solution: `-- Create a procedure with output parameter
CREATE PROCEDURE GetTotalSales
    @Year INT,
    @TotalAmount DECIMAL(15,2) OUTPUT
AS
BEGIN
    SELECT @TotalAmount = SUM(amount)
    FROM sales
    WHERE YEAR(sale_date) = @Year;

    -- Handle NULL if no sales found
    IF @TotalAmount IS NULL
        SET @TotalAmount = 0;
END;`,
      expectedOutput: ['CREATE PROCEDURE', '@Year INT', 'OUTPUT', 'SUM(amount)', 'WHERE YEAR'],
      hints: [
        'Mark the output parameter with OUTPUT keyword',
        'Assign the result to the output parameter using SELECT INTO or SET',
        'Consider handling NULL if no data is found'
      ],
    },
  ],
  quiz: [
    {
      question: 'What is a stored procedure?',
      options: [
        'A temporary table',
        'A saved collection of SQL statements that can be called by name',
        'A way to store data in memory',
        'A type of database index'
      ],
      correctIndex: 1,
    },
    {
      question: 'Which command executes a stored procedure in SQL Server?',
      options: [
        'RUN',
        'CALL',
        'EXEC or EXECUTE',
        'START'
      ],
      correctIndex: 2,
    },
    {
      question: 'What keyword marks a parameter as returning a value in SQL Server?',
      options: [
        'RETURN',
        'OUT',
        'OUTPUT',
        'OUTBOUND'
      ],
      correctIndex: 2,
    },
    {
      question: 'Why would you use a stored procedure instead of writing SQL directly in your application?',
      options: [
        'Stored procedures are always faster',
        'Direct SQL is not allowed in applications',
        'Better reusability, security, and maintainability',
        'Stored procedures never have bugs'
      ],
      correctIndex: 2,
    },
    {
      question: 'What happens if you call DROP PROCEDURE on a procedure that does not exist?',
      options: [
        'Nothing happens',
        'An error is thrown',
        'The database restarts',
        'All procedures are deleted'
      ],
      correctIndex: 1,
    },
  ],
  buildNote: {
    title: 'Stored Procedures in Real Applications',
    explanation: `Stored procedures are commonly used in enterprise applications to encapsulate business logic at the database level. They provide security by allowing users to execute specific operations without direct table access, and they're pre-compiled for better performance.`,
    relatedFiles: [
      'src/lib/db/procedures.ts',
      'src/app/api/reports/route.ts'
    ],
    inTheRealWorld: 'Many organizations use stored procedures for complex reporting queries, data migrations, and batch operations. Modern applications often prefer application-level code for flexibility, but stored procedures remain valuable for performance-critical operations.'
  }
};
