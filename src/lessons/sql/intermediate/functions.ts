import { Lesson } from '@/types/lesson';

export const sqlFunctions: Lesson = {
  slug: 'sql-functions',
  title: 'User-Defined Functions',
  description: 'Learn to create custom functions that return values for use in SQL queries.',
  difficulty: 'intermediate',
  order: 19,
  content: `
# User-Defined Functions in SQL

A **user-defined function (UDF)** is a custom function you create to perform calculations or transformations. Unlike stored procedures, functions return a value and can be used directly in SQL statements.

## Functions vs Stored Procedures

| Feature | Function | Stored Procedure |
|---------|----------|------------------|
| Returns | Must return a value | Optional (can use OUTPUT params) |
| Use in SELECT | Yes | No |
| Use in WHERE | Yes | No |
| Modify data | No (usually read-only) | Yes |
| Transaction control | No | Yes |
| Call syntax | Like built-in functions | EXEC/CALL |

## Types of Functions

1. **Scalar Functions** - Return a single value (number, string, date, etc.)
2. **Table-Valued Functions** - Return a table that can be queried

## Creating Scalar Functions

### SQL Server Syntax

\`\`\`sql
CREATE FUNCTION CalculateTax(@Price DECIMAL(10,2))
RETURNS DECIMAL(10,2)
AS
BEGIN
    RETURN @Price * 0.08;
END;
\`\`\`

### MySQL Syntax

\`\`\`sql
DELIMITER //
CREATE FUNCTION CalculateTax(price DECIMAL(10,2))
RETURNS DECIMAL(10,2)
DETERMINISTIC
BEGIN
    RETURN price * 0.08;
END //
DELIMITER ;
\`\`\`

## Using Scalar Functions

Once created, use functions just like built-in functions:

\`\`\`sql
-- In SELECT
SELECT
    product_name,
    price,
    dbo.CalculateTax(price) AS tax,
    price + dbo.CalculateTax(price) AS total
FROM products;

-- In WHERE
SELECT * FROM products
WHERE price + dbo.CalculateTax(price) > 100;

-- In UPDATE
UPDATE products
SET tax_amount = dbo.CalculateTax(price);
\`\`\`

## Practical Scalar Function Examples

### Format Phone Number

\`\`\`sql
CREATE FUNCTION FormatPhone(@Phone VARCHAR(20))
RETURNS VARCHAR(20)
AS
BEGIN
    DECLARE @Clean VARCHAR(20);
    -- Remove non-digits
    SET @Clean = REPLACE(REPLACE(REPLACE(@Phone, '-', ''), '(', ''), ')', '');
    SET @Clean = REPLACE(REPLACE(@Clean, ' ', ''), '.', '');

    -- Format as (XXX) XXX-XXXX
    IF LEN(@Clean) = 10
        RETURN '(' + LEFT(@Clean, 3) + ') ' +
               SUBSTRING(@Clean, 4, 3) + '-' +
               RIGHT(@Clean, 4);
    RETURN @Phone; -- Return original if not 10 digits
END;
\`\`\`

### Calculate Age

\`\`\`sql
CREATE FUNCTION CalculateAge(@BirthDate DATE)
RETURNS INT
AS
BEGIN
    RETURN DATEDIFF(YEAR, @BirthDate, GETDATE()) -
           CASE
               WHEN DATEADD(YEAR, DATEDIFF(YEAR, @BirthDate, GETDATE()), @BirthDate) > GETDATE()
               THEN 1
               ELSE 0
           END;
END;

-- Usage
SELECT name, birth_date, dbo.CalculateAge(birth_date) AS age
FROM employees;
\`\`\`

### Get Fiscal Quarter

\`\`\`sql
CREATE FUNCTION GetFiscalQuarter(@Date DATE)
RETURNS VARCHAR(10)
AS
BEGIN
    DECLARE @Month INT = MONTH(@Date);
    DECLARE @Year INT = YEAR(@Date);

    -- Assuming fiscal year starts in October
    IF @Month >= 10
        RETURN 'Q1-' + CAST(@Year + 1 AS VARCHAR);
    ELSE IF @Month >= 7
        RETURN 'Q4-' + CAST(@Year AS VARCHAR);
    ELSE IF @Month >= 4
        RETURN 'Q3-' + CAST(@Year AS VARCHAR);
    ELSE
        RETURN 'Q2-' + CAST(@Year AS VARCHAR);
END;
\`\`\`

## Table-Valued Functions

Table-valued functions return a result set (table) instead of a single value.

### Inline Table-Valued Function

Defined with a single SELECT statement:

\`\`\`sql
CREATE FUNCTION GetEmployeesByDepartment(@DeptId INT)
RETURNS TABLE
AS
RETURN (
    SELECT employee_id, name, salary
    FROM employees
    WHERE department_id = @DeptId
);

-- Usage (treat like a table)
SELECT * FROM dbo.GetEmployeesByDepartment(5);

-- Join with other tables
SELECT e.*, d.department_name
FROM dbo.GetEmployeesByDepartment(5) e
JOIN departments d ON e.department_id = d.department_id;
\`\`\`

### Multi-Statement Table-Valued Function

For more complex logic with multiple statements:

\`\`\`sql
CREATE FUNCTION GetTopSellersByYear(@Year INT, @TopN INT)
RETURNS @Results TABLE (
    salesperson_id INT,
    salesperson_name VARCHAR(100),
    total_sales DECIMAL(15,2),
    rank_position INT
)
AS
BEGIN
    INSERT INTO @Results
    SELECT TOP(@TopN)
        s.salesperson_id,
        s.name,
        SUM(o.total) AS total_sales,
        ROW_NUMBER() OVER (ORDER BY SUM(o.total) DESC) AS rank_position
    FROM salespeople s
    JOIN orders o ON s.salesperson_id = o.salesperson_id
    WHERE YEAR(o.order_date) = @Year
    GROUP BY s.salesperson_id, s.name
    ORDER BY total_sales DESC;

    RETURN;
END;

-- Usage
SELECT * FROM dbo.GetTopSellersByYear(2024, 10);
\`\`\`

## Function Determinism

In MySQL, you must specify if a function is deterministic:

- **DETERMINISTIC** - Same input always produces same output
- **NOT DETERMINISTIC** - Output may vary (e.g., uses current time)

\`\`\`sql
-- MySQL
CREATE FUNCTION IsWeekend(check_date DATE)
RETURNS BOOLEAN
DETERMINISTIC
BEGIN
    RETURN DAYOFWEEK(check_date) IN (1, 7);
END;

CREATE FUNCTION GetCurrentFiscalYear()
RETURNS INT
NOT DETERMINISTIC
BEGIN
    RETURN YEAR(CURDATE());
END;
\`\`\`

## Modifying and Deleting Functions

\`\`\`sql
-- Modify (SQL Server)
ALTER FUNCTION CalculateTax(@Price DECIMAL(10,2))
RETURNS DECIMAL(10,2)
AS
BEGIN
    RETURN @Price * 0.0825; -- Updated rate
END;

-- Delete
DROP FUNCTION CalculateTax;

-- Delete if exists
DROP FUNCTION IF EXISTS CalculateTax;
\`\`\`

## Best Practices

1. **Keep functions simple** - Complex logic belongs in procedures
2. **Avoid side effects** - Functions should be pure (no data modification)
3. **Consider performance** - Functions in WHERE clauses prevent index usage
4. **Use inline TVFs when possible** - Better performance than multi-statement
5. **Name clearly** - Prefix with fn_ or similar convention
6. **Document behavior** - Explain edge cases and expected inputs

## Performance Considerations

\`\`\`sql
-- This prevents index usage (slow on large tables)
SELECT * FROM employees
WHERE dbo.GetDepartmentName(department_id) = 'Sales';

-- Better: Use JOIN instead
SELECT e.* FROM employees e
JOIN departments d ON e.department_id = d.department_id
WHERE d.name = 'Sales';
\`\`\`
`,
  exercises: [
    {
      id: 1,
      title: 'Exercise 1: Create a Scalar Function',
      description: 'Create a function named CalculateDiscount that takes a price and discount percentage, returning the discounted price.',
      starterCode: `-- Create a function that calculates discounted price
-- Parameters: price (DECIMAL), discount_percent (INT)
-- Returns: discounted price (DECIMAL)
-- Example: CalculateDiscount(100.00, 20) returns 80.00

`,
      solution: `-- Create a function that calculates discounted price
CREATE FUNCTION CalculateDiscount(
    @Price DECIMAL(10,2),
    @DiscountPercent INT
)
RETURNS DECIMAL(10,2)
AS
BEGIN
    RETURN @Price * (100 - @DiscountPercent) / 100;
END;`,
      expectedOutput: ['CREATE FUNCTION', '@Price', '@DiscountPercent', 'RETURNS DECIMAL', 'RETURN'],
      hints: [
        'Declare two parameters for price and discount percentage',
        'The formula is: price * (100 - discount) / 100',
        'Use RETURNS to specify the return type'
      ],
    },
    {
      id: 2,
      title: 'Exercise 2: Create a Date Function',
      description: 'Create a function named GetDayOfWeekName that takes a date and returns the day name (Monday, Tuesday, etc.).',
      starterCode: `-- Create a function that returns the day name for a date
-- Parameter: input_date (DATE)
-- Returns: day name (VARCHAR)
-- Example: GetDayOfWeekName('2024-01-15') returns 'Monday'

`,
      solution: `-- Create a function that returns the day name for a date
CREATE FUNCTION GetDayOfWeekName(@InputDate DATE)
RETURNS VARCHAR(20)
AS
BEGIN
    RETURN DATENAME(WEEKDAY, @InputDate);
END;

-- Alternative with CASE for MySQL compatibility:
/*
CREATE FUNCTION GetDayOfWeekName(@InputDate DATE)
RETURNS VARCHAR(20)
AS
BEGIN
    DECLARE @DayNum INT = DATEPART(WEEKDAY, @InputDate);
    RETURN CASE @DayNum
        WHEN 1 THEN 'Sunday'
        WHEN 2 THEN 'Monday'
        WHEN 3 THEN 'Tuesday'
        WHEN 4 THEN 'Wednesday'
        WHEN 5 THEN 'Thursday'
        WHEN 6 THEN 'Friday'
        WHEN 7 THEN 'Saturday'
    END;
END;
*/`,
      expectedOutput: ['CREATE FUNCTION', 'DATE', 'RETURNS VARCHAR', 'DATENAME', 'WEEKDAY'],
      hints: [
        'SQL Server has a DATENAME function that can extract day names',
        'The WEEKDAY argument gets the day of week',
        'You could also use DATEPART with a CASE statement'
      ],
    },
    {
      id: 3,
      title: 'Exercise 3: Create a Table-Valued Function',
      description: 'Create an inline table-valued function named GetRecentOrders that returns orders from the last N days for a specific customer.',
      starterCode: `-- Create a table-valued function
-- Parameters: customer_id (INT), days_back (INT)
-- Returns: orders from the last N days for that customer
-- Table: orders (order_id, customer_id, order_date, total)

`,
      solution: `-- Create a table-valued function
CREATE FUNCTION GetRecentOrders(
    @CustomerId INT,
    @DaysBack INT
)
RETURNS TABLE
AS
RETURN (
    SELECT
        order_id,
        customer_id,
        order_date,
        total
    FROM orders
    WHERE customer_id = @CustomerId
      AND order_date >= DATEADD(DAY, -@DaysBack, GETDATE())
    ORDER BY order_date DESC
);`,
      expectedOutput: ['CREATE FUNCTION', 'RETURNS TABLE', 'AS RETURN', 'SELECT', 'DATEADD'],
      hints: [
        'Use RETURNS TABLE for inline table-valued functions',
        'The body is a single RETURN with a SELECT in parentheses',
        'Use DATEADD to calculate the date N days ago'
      ],
    },
  ],
  quiz: [
    {
      question: 'What is the main difference between a function and a stored procedure?',
      options: [
        'Functions are faster',
        'Functions must return a value and can be used in SELECT statements',
        'Procedures cannot have parameters',
        'Functions can only use one table'
      ],
      correctIndex: 1,
    },
    {
      question: 'Which type of function returns a single value?',
      options: [
        'Table-valued function',
        'Inline function',
        'Scalar function',
        'Aggregate function'
      ],
      correctIndex: 2,
    },
    {
      question: 'Can a function modify data (INSERT, UPDATE, DELETE)?',
      options: [
        'Yes, always',
        'Only scalar functions can',
        'Generally no, functions should be read-only',
        'Only in MySQL'
      ],
      correctIndex: 2,
    },
    {
      question: 'What does DETERMINISTIC mean for a MySQL function?',
      options: [
        'The function runs faster',
        'The function always returns the same output for the same input',
        'The function can modify data',
        'The function uses transactions'
      ],
      correctIndex: 1,
    },
    {
      question: 'Why might using a function in a WHERE clause be slow?',
      options: [
        'Functions are always slow',
        'WHERE clauses do not support functions',
        'The function must run for every row, preventing index usage',
        'Functions use more memory'
      ],
      correctIndex: 2,
    },
  ],
  buildNote: {
    title: 'User-Defined Functions in Real Applications',
    explanation: `Functions are useful for calculations and transformations that need to be reused across queries. In web applications, you might create functions for formatting data, calculating derived values, or encapsulating complex business logic that appears in multiple queries.`,
    relatedFiles: [
      'src/lib/db/functions.ts',
      'src/app/api/analytics/route.ts'
    ],
    inTheRealWorld: 'Production databases often include utility functions for common transformations like date formatting, currency conversion, or distance calculations. However, performance-critical applications may prefer application-level code to avoid per-row function calls.'
  }
};
