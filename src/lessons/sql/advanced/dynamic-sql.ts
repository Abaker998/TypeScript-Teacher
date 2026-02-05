import { Lesson } from '@/types/lesson';

export const dynamicSql: Lesson = {
  slug: 'sql-dynamic-sql',
  title: 'Dynamic SQL',
  description: 'Build and execute dynamic queries safely using EXEC, sp_executesql, and prepared statements.',
  difficulty: 'advanced',
  order: 25,
  content: `
# Dynamic SQL

Dynamic SQL allows you to build and execute SQL statements at runtime. It's powerful for creating flexible queries, but requires careful handling to avoid SQL injection vulnerabilities.

## Why Dynamic SQL?

Dynamic SQL is useful when:
- Table or column names are determined at runtime
- WHERE clauses vary based on user input
- Building search forms with optional filters
- Creating PIVOT queries with unknown columns
- Generating reports with configurable grouping

## SQL Server Dynamic SQL

### Basic EXEC

\`\`\`sql
-- Simple EXEC - concatenates and executes string
DECLARE @tableName NVARCHAR(128) = 'orders';
DECLARE @sql NVARCHAR(MAX);

SET @sql = 'SELECT * FROM ' + QUOTENAME(@tableName);
EXEC(@sql);

-- WARNING: EXEC with concatenation is vulnerable to SQL injection!
-- Never use with untrusted input directly
\`\`\`

### sp_executesql with Parameters

\`\`\`sql
-- SAFE: Using sp_executesql with parameters
DECLARE @customerId INT = 100;
DECLARE @minAmount DECIMAL(10,2) = 50.00;
DECLARE @sql NVARCHAR(MAX);
DECLARE @params NVARCHAR(MAX);

SET @sql = N'SELECT * FROM orders
             WHERE customer_id = @custId
             AND amount >= @minAmt';

SET @params = N'@custId INT, @minAmt DECIMAL(10,2)';

EXEC sp_executesql @sql, @params,
     @custId = @customerId,
     @minAmt = @minAmount;
\`\`\`

### Dynamic Table/Column Names

\`\`\`sql
-- Table names cannot be parameterized - must validate!
DECLARE @tableName NVARCHAR(128) = 'orders';
DECLARE @sql NVARCHAR(MAX);

-- Validate table exists
IF NOT EXISTS (
  SELECT 1 FROM INFORMATION_SCHEMA.TABLES
  WHERE TABLE_NAME = @tableName
)
BEGIN
  RAISERROR('Invalid table name', 16, 1);
  RETURN;
END

-- Use QUOTENAME to prevent injection
SET @sql = N'SELECT TOP 10 * FROM ' + QUOTENAME(@tableName);
EXEC(@sql);

-- Dynamic column selection
DECLARE @columnList NVARCHAR(MAX) = 'order_id, customer_id, total';

-- Validate columns exist
-- Build and execute
SET @sql = N'SELECT ' + @columnList + ' FROM orders';
EXEC(@sql);
\`\`\`

### Building Dynamic WHERE Clauses

\`\`\`sql
-- Search with optional parameters
CREATE PROCEDURE SearchOrders
  @customerId INT = NULL,
  @startDate DATE = NULL,
  @endDate DATE = NULL,
  @minAmount DECIMAL(10,2) = NULL,
  @status NVARCHAR(50) = NULL
AS
BEGIN
  DECLARE @sql NVARCHAR(MAX);
  DECLARE @params NVARCHAR(MAX);

  SET @sql = N'SELECT * FROM orders WHERE 1=1';
  SET @params = N'@custId INT, @start DATE, @end DATE, @min DECIMAL(10,2), @stat NVARCHAR(50)';

  -- Conditionally add filters
  IF @customerId IS NOT NULL
    SET @sql = @sql + N' AND customer_id = @custId';

  IF @startDate IS NOT NULL
    SET @sql = @sql + N' AND order_date >= @start';

  IF @endDate IS NOT NULL
    SET @sql = @sql + N' AND order_date <= @end';

  IF @minAmount IS NOT NULL
    SET @sql = @sql + N' AND amount >= @min';

  IF @status IS NOT NULL
    SET @sql = @sql + N' AND status = @stat';

  EXEC sp_executesql @sql, @params,
       @custId = @customerId,
       @start = @startDate,
       @end = @endDate,
       @min = @minAmount,
       @stat = @status;
END;

-- Usage
EXEC SearchOrders @customerId = 100, @minAmount = 50.00;
EXEC SearchOrders @startDate = '2024-01-01', @status = 'shipped';
\`\`\`

## PostgreSQL Dynamic SQL

### EXECUTE with Parameters

\`\`\`sql
-- PostgreSQL uses EXECUTE in PL/pgSQL
DO $$
DECLARE
  customer_id INTEGER := 100;
  min_amount NUMERIC := 50.00;
  query TEXT;
BEGIN
  -- Using format() for safe query building
  query := format(
    'SELECT * FROM orders WHERE customer_id = %L AND amount >= %L',
    customer_id, min_amount
  );

  EXECUTE query;
END $$;

-- In a function
CREATE OR REPLACE FUNCTION get_orders(
  p_customer_id INTEGER,
  p_min_amount NUMERIC
)
RETURNS SETOF orders AS $$
BEGIN
  RETURN QUERY EXECUTE format(
    'SELECT * FROM orders WHERE customer_id = %s AND amount >= %s',
    p_customer_id, p_min_amount
  );
END;
$$ LANGUAGE plpgsql;

-- Using USING clause (preferred for values)
CREATE OR REPLACE FUNCTION search_orders(
  p_customer_id INTEGER DEFAULT NULL,
  p_status TEXT DEFAULT NULL
)
RETURNS SETOF orders AS $$
DECLARE
  query TEXT := 'SELECT * FROM orders WHERE true';
BEGIN
  IF p_customer_id IS NOT NULL THEN
    query := query || ' AND customer_id = $1';
  END IF;

  IF p_status IS NOT NULL THEN
    query := query || ' AND status = $2';
  END IF;

  RETURN QUERY EXECUTE query
  USING p_customer_id, p_status;
END;
$$ LANGUAGE plpgsql;
\`\`\`

### Format Function Specifiers

\`\`\`sql
-- %s - simple substitution (use for identifiers after validation)
-- %L - literal value (quoted and escaped - safe for values)
-- %I - identifier (quoted - safe for table/column names)

DO $$
DECLARE
  table_name TEXT := 'orders';
  column_name TEXT := 'order_date';
  search_value TEXT := 'pending';
  query TEXT;
BEGIN
  -- Safe dynamic SQL
  query := format(
    'SELECT * FROM %I WHERE %I > %L',
    table_name, column_name, search_value
  );

  -- Equivalent to:
  -- SELECT * FROM "orders" WHERE "order_date" > 'pending'

  RAISE NOTICE '%', query;
END $$;
\`\`\`

## MySQL Dynamic SQL

### Prepared Statements

\`\`\`sql
-- MySQL uses PREPARE and EXECUTE
SET @customer_id = 100;
SET @min_amount = 50.00;

-- Prepare the statement
PREPARE stmt FROM
  'SELECT * FROM orders WHERE customer_id = ? AND amount >= ?';

-- Execute with parameters
EXECUTE stmt USING @customer_id, @min_amount;

-- Deallocate when done
DEALLOCATE PREPARE stmt;

-- In a stored procedure
DELIMITER //

CREATE PROCEDURE SearchOrders(
  IN p_customer_id INT,
  IN p_status VARCHAR(50)
)
BEGIN
  SET @sql = 'SELECT * FROM orders WHERE 1=1';

  IF p_customer_id IS NOT NULL THEN
    SET @sql = CONCAT(@sql, ' AND customer_id = ', p_customer_id);
  END IF;

  IF p_status IS NOT NULL THEN
    SET @sql = CONCAT(@sql, ' AND status = ''', p_status, '''');
  END IF;

  PREPARE stmt FROM @sql;
  EXECUTE stmt;
  DEALLOCATE PREPARE stmt;
END //

DELIMITER ;
\`\`\`

## Preventing SQL Injection

### The Vulnerability

\`\`\`sql
-- DANGEROUS: Direct concatenation
DECLARE @input NVARCHAR(100) = '100; DROP TABLE orders; --';
DECLARE @sql NVARCHAR(MAX);

SET @sql = 'SELECT * FROM orders WHERE customer_id = ' + @input;
-- Executes: SELECT * FROM orders WHERE customer_id = 100; DROP TABLE orders; --

EXEC(@sql);  -- CATASTROPHIC!
\`\`\`

### Protection Strategies

\`\`\`sql
-- 1. Use parameterized queries (BEST)
DECLARE @customerId INT = 100;
DECLARE @sql NVARCHAR(MAX) = N'SELECT * FROM orders WHERE customer_id = @id';

EXEC sp_executesql @sql, N'@id INT', @id = @customerId;

-- 2. Whitelist validation for identifiers
DECLARE @sortColumn NVARCHAR(50) = 'order_date';
DECLARE @allowedColumns TABLE (name NVARCHAR(50));
INSERT INTO @allowedColumns VALUES ('order_id'), ('order_date'), ('amount'), ('status');

IF NOT EXISTS (SELECT 1 FROM @allowedColumns WHERE name = @sortColumn)
BEGIN
  RAISERROR('Invalid column name', 16, 1);
  RETURN;
END

-- 3. Use QUOTENAME for identifiers
DECLARE @tableName NVARCHAR(128) = 'orders';
SET @sql = N'SELECT * FROM ' + QUOTENAME(@tableName);

-- 4. Type checking
DECLARE @inputValue NVARCHAR(100) = '100; DROP TABLE';
DECLARE @numericValue INT;

-- Try to convert - fails if not numeric
BEGIN TRY
  SET @numericValue = CAST(@inputValue AS INT);
END TRY
BEGIN CATCH
  RAISERROR('Invalid numeric input', 16, 1);
  RETURN;
END CATCH
\`\`\`

## Use Cases

### Dynamic Pivot

\`\`\`sql
-- Build PIVOT with dynamic columns
DECLARE @columns NVARCHAR(MAX);
DECLARE @sql NVARCHAR(MAX);

-- Get distinct values for pivot columns
SELECT @columns = STRING_AGG(QUOTENAME(quarter), ',')
FROM (SELECT DISTINCT quarter FROM sales ORDER BY quarter) q;

-- Build dynamic pivot
SET @sql = N'
SELECT product, ' + @columns + '
FROM (
  SELECT product, quarter, amount
  FROM sales
) src
PIVOT (
  SUM(amount) FOR quarter IN (' + @columns + ')
) pvt';

EXEC sp_executesql @sql;
\`\`\`

### Generic Audit Logging

\`\`\`sql
-- Log changes to any table dynamically
CREATE PROCEDURE LogChanges
  @tableName NVARCHAR(128),
  @primaryKey NVARCHAR(128),
  @pkValue INT,
  @operation NVARCHAR(10)
AS
BEGIN
  DECLARE @sql NVARCHAR(MAX);
  DECLARE @params NVARCHAR(MAX);
  DECLARE @columns NVARCHAR(MAX);

  -- Get column list for the table
  SELECT @columns = STRING_AGG(QUOTENAME(COLUMN_NAME), ',')
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_NAME = @tableName;

  -- Build insert into audit table
  SET @sql = N'
  INSERT INTO audit_log (table_name, pk_value, operation, old_values, change_date)
  SELECT @tbl, @pk, @op,
         (SELECT ' + @columns + ' FROM ' + QUOTENAME(@tableName) +
         ' WHERE ' + QUOTENAME(@primaryKey) + ' = @pk FOR JSON PATH),
         GETDATE()';

  SET @params = N'@tbl NVARCHAR(128), @pk INT, @op NVARCHAR(10)';

  EXEC sp_executesql @sql, @params,
       @tbl = @tableName,
       @pk = @pkValue,
       @op = @operation;
END;
\`\`\`

### Configurable Reports

\`\`\`sql
-- Report generator with configurable grouping
CREATE PROCEDURE GenerateSalesReport
  @groupBy NVARCHAR(50),  -- 'region', 'product', 'month'
  @metric NVARCHAR(50)    -- 'sum', 'avg', 'count'
AS
BEGIN
  DECLARE @sql NVARCHAR(MAX);
  DECLARE @groupColumn NVARCHAR(128);
  DECLARE @aggregateFunc NVARCHAR(50);

  -- Validate and map groupBy
  SET @groupColumn = CASE @groupBy
    WHEN 'region' THEN 'region'
    WHEN 'product' THEN 'product_category'
    WHEN 'month' THEN 'FORMAT(order_date, ''yyyy-MM'')'
    ELSE NULL
  END;

  IF @groupColumn IS NULL
  BEGIN
    RAISERROR('Invalid group by option', 16, 1);
    RETURN;
  END

  -- Validate and map metric
  SET @aggregateFunc = CASE @metric
    WHEN 'sum' THEN 'SUM(amount)'
    WHEN 'avg' THEN 'AVG(amount)'
    WHEN 'count' THEN 'COUNT(*)'
    ELSE NULL
  END;

  IF @aggregateFunc IS NULL
  BEGIN
    RAISERROR('Invalid metric', 16, 1);
    RETURN;
  END

  -- Build and execute
  SET @sql = N'
  SELECT ' + @groupColumn + ' AS group_key,
         ' + @aggregateFunc + ' AS value
  FROM orders
  GROUP BY ' + @groupColumn + '
  ORDER BY value DESC';

  EXEC sp_executesql @sql;
END;
\`\`\`

## Best Practices

\`\`\`sql
-- 1. Always parameterize values
-- Bad
SET @sql = 'WHERE name = ''' + @name + '''';
-- Good
SET @sql = 'WHERE name = @name';

-- 2. Validate all identifiers
-- Check against system tables or whitelist

-- 3. Use least privilege
-- The executing user should have minimal permissions

-- 4. Log dynamic SQL for debugging
PRINT @sql;  -- Or log to a table

-- 5. Consider performance
-- sp_executesql can reuse execution plans
-- EXEC(@sql) creates new plan each time

-- 6. Handle errors appropriately
BEGIN TRY
  EXEC sp_executesql @sql, @params, ...;
END TRY
BEGIN CATCH
  -- Log error details
  INSERT INTO error_log (query, error_message, error_time)
  VALUES (@sql, ERROR_MESSAGE(), GETDATE());
  THROW;
END CATCH
\`\`\`

## Learning Objectives

By the end of this lesson, you'll be able to:
- Build dynamic SQL queries safely
- Use sp_executesql with parameters
- Prevent SQL injection attacks
- Create flexible search procedures
- Build dynamic reports and pivot queries
`,
  exercises: [
    {
      id: 1,
      title: 'Exercise 1: Parameterized Dynamic Query',
      description: `Convert an unsafe dynamic query to use parameterized execution.

**Your task:**
Rewrite this vulnerable query to use sp_executesql with parameters.`,
      starterCode: `-- UNSAFE version to fix:
DECLARE @customerId NVARCHAR(50) = '100';
DECLARE @status NVARCHAR(50) = 'active';
DECLARE @sql NVARCHAR(MAX);

SET @sql = 'SELECT * FROM customers
            WHERE customer_id = ' + @customerId + '
            AND status = ''' + @status + '''';
EXEC(@sql);

-- Rewrite using sp_executesql with parameters:

`,
      solution: `-- SAFE version using sp_executesql
DECLARE @customerId INT = 100;
DECLARE @status NVARCHAR(50) = 'active';
DECLARE @sql NVARCHAR(MAX);
DECLARE @params NVARCHAR(MAX);

SET @sql = N'SELECT * FROM customers
             WHERE customer_id = @custId
             AND status = @stat';

SET @params = N'@custId INT, @stat NVARCHAR(50)';

EXEC sp_executesql @sql, @params,
     @custId = @customerId,
     @stat = @status;`,
      expectedOutput: ['Use sp_executesql instead of EXEC', 'Define parameter list', 'Pass values as parameters'],
      hints: [
        'Replace concatenation with @parameter placeholders',
        'Define parameters in a separate @params string',
        'Pass actual values in the EXEC call'
      ],
    },
    {
      id: 2,
      title: 'Exercise 2: Optional Search Filters',
      description: `Build a search procedure with optional filters.

**Your task:**
Create a stored procedure that searches products with optional filters for category, min_price, max_price, and in_stock status.`,
      starterCode: `CREATE PROCEDURE SearchProducts
  @category NVARCHAR(50) = NULL,
  @minPrice DECIMAL(10,2) = NULL,
  @maxPrice DECIMAL(10,2) = NULL,
  @inStock BIT = NULL
AS
BEGIN
  DECLARE @sql NVARCHAR(MAX);
  DECLARE @params NVARCHAR(MAX);

  -- Start building the query
  SET @sql = N'SELECT * FROM products WHERE 1=1';
  SET @params = N'@cat NVARCHAR(50), @min DECIMAL(10,2), @max DECIMAL(10,2), @stock BIT';

  -- Add conditional filters


  -- Execute

END;`,
      solution: `CREATE PROCEDURE SearchProducts
  @category NVARCHAR(50) = NULL,
  @minPrice DECIMAL(10,2) = NULL,
  @maxPrice DECIMAL(10,2) = NULL,
  @inStock BIT = NULL
AS
BEGIN
  DECLARE @sql NVARCHAR(MAX);
  DECLARE @params NVARCHAR(MAX);

  SET @sql = N'SELECT * FROM products WHERE 1=1';
  SET @params = N'@cat NVARCHAR(50), @min DECIMAL(10,2), @max DECIMAL(10,2), @stock BIT';

  IF @category IS NOT NULL
    SET @sql = @sql + N' AND category = @cat';

  IF @minPrice IS NOT NULL
    SET @sql = @sql + N' AND price >= @min';

  IF @maxPrice IS NOT NULL
    SET @sql = @sql + N' AND price <= @max';

  IF @inStock IS NOT NULL
    SET @sql = @sql + N' AND in_stock = @stock';

  EXEC sp_executesql @sql, @params,
       @cat = @category,
       @min = @minPrice,
       @max = @maxPrice,
       @stock = @inStock;
END;`,
      expectedOutput: ['WHERE 1=1 allows easy AND appending', 'IF statements add filters conditionally', 'All parameters passed even if NULL'],
      hints: [
        'WHERE 1=1 makes adding AND clauses easy',
        'Check each parameter with IF ... IS NOT NULL',
        'Always use parameters for values, never concatenate'
      ],
    },
    {
      id: 3,
      title: 'Exercise 3: Dynamic Sorting',
      description: `Implement safe dynamic column sorting.

**Your task:**
Create a procedure that sorts results by a user-specified column and direction, but validates the input to prevent injection.`,
      starterCode: `CREATE PROCEDURE GetOrdersSorted
  @sortColumn NVARCHAR(50),
  @sortDirection NVARCHAR(4)  -- 'ASC' or 'DESC'
AS
BEGIN
  DECLARE @sql NVARCHAR(MAX);

  -- Validate sortColumn against allowed list


  -- Validate sortDirection


  -- Build and execute query

END;`,
      solution: `CREATE PROCEDURE GetOrdersSorted
  @sortColumn NVARCHAR(50),
  @sortDirection NVARCHAR(4)
AS
BEGIN
  DECLARE @sql NVARCHAR(MAX);
  DECLARE @validColumns TABLE (col_name NVARCHAR(50));

  -- Define allowed columns
  INSERT INTO @validColumns VALUES
    ('order_id'), ('order_date'), ('customer_id'), ('amount'), ('status');

  -- Validate column
  IF NOT EXISTS (SELECT 1 FROM @validColumns WHERE col_name = @sortColumn)
  BEGIN
    RAISERROR('Invalid sort column', 16, 1);
    RETURN;
  END

  -- Validate direction
  IF @sortDirection NOT IN ('ASC', 'DESC')
  BEGIN
    SET @sortDirection = 'ASC';  -- Default to ASC
  END

  -- Build safe query (column validated, direction validated)
  SET @sql = N'SELECT order_id, order_date, customer_id, amount, status
               FROM orders
               ORDER BY ' + QUOTENAME(@sortColumn) + ' ' + @sortDirection;

  EXEC sp_executesql @sql;
END;`,
      expectedOutput: ['Whitelist validation for column names', 'Strict validation for sort direction', 'QUOTENAME adds safety for identifier'],
      hints: [
        'Create a table variable with allowed column names',
        'Check if input column exists in the allowed list',
        'Limit sort direction to exactly ASC or DESC'
      ],
    },
    {
      id: 4,
      title: 'Exercise 4: Dynamic PIVOT',
      description: `Create a dynamic pivot query that handles unknown categories.

**Your task:**
Build a sales pivot that dynamically creates columns for each product category found in the data.`,
      starterCode: `-- Build dynamic PIVOT for sales by category
DECLARE @categories NVARCHAR(MAX);
DECLARE @sql NVARCHAR(MAX);

-- Step 1: Get distinct categories as column list


-- Step 2: Build PIVOT query


-- Step 3: Execute

`,
      solution: `-- Build dynamic PIVOT for sales by category
DECLARE @categories NVARCHAR(MAX);
DECLARE @sql NVARCHAR(MAX);

-- Step 1: Get distinct categories as quoted column list
SELECT @categories = STRING_AGG(QUOTENAME(category), ',')
FROM (SELECT DISTINCT category FROM products WHERE category IS NOT NULL) cats;

-- Handle empty case
IF @categories IS NULL
BEGIN
  PRINT 'No categories found';
  RETURN;
END

-- Step 2: Build PIVOT query
SET @sql = N'
SELECT region, ' + @categories + '
FROM (
  SELECT
    o.region,
    p.category,
    oi.quantity * oi.unit_price AS sale_amount
  FROM orders o
  JOIN order_items oi ON o.order_id = oi.order_id
  JOIN products p ON oi.product_id = p.product_id
) AS sales_data
PIVOT (
  SUM(sale_amount)
  FOR category IN (' + @categories + ')
) AS pivot_table
ORDER BY region';

-- Debug: Print the generated SQL
PRINT @sql;

-- Step 3: Execute
EXEC sp_executesql @sql;`,
      expectedOutput: ['STRING_AGG builds comma-separated list', 'QUOTENAME ensures safe identifiers', 'Dynamic columns in both SELECT and IN clause'],
      hints: [
        'Use STRING_AGG to build the column list',
        'QUOTENAME protects category names with special characters',
        'The same column list appears in SELECT and IN ()'
      ],
    },
  ],
  quiz: [
    {
      question: 'What is the main advantage of sp_executesql over EXEC() in SQL Server?',
      options: [
        'sp_executesql is faster for all queries',
        'sp_executesql supports parameters, preventing SQL injection and enabling plan reuse',
        'sp_executesql can execute more complex queries',
        'EXEC() is deprecated and should never be used'
      ],
      correctIndex: 1,
      explanation: 'sp_executesql supports parameterized queries, which prevents SQL injection attacks and allows SQL Server to cache and reuse execution plans. EXEC() requires string concatenation which is both unsafe and prevents plan reuse.'
    },
    {
      question: 'Why can\'t table or column names be passed as parameters?',
      options: [
        'They can be - this is a common misconception',
        'Parameters are evaluated after query compilation, but identifiers are needed during compilation',
        'There is a security restriction preventing it',
        'Only numeric values can be parameters'
      ],
      correctIndex: 1,
      explanation: 'SQL parameters are substituted after the query plan is compiled. Table and column names are needed during compilation to determine the query plan. This is why dynamic SQL with string concatenation is needed for dynamic identifiers, but they must be validated.'
    },
    {
      question: 'What does QUOTENAME() do in SQL Server?',
      options: [
        'Adds single quotes around a string value',
        'Wraps an identifier in square brackets and escapes special characters',
        'Converts a number to a quoted string',
        'Removes quotes from a string'
      ],
      correctIndex: 1,
      explanation: 'QUOTENAME() wraps an identifier (table name, column name) in square brackets [like_this] and escapes any special characters. This helps prevent SQL injection when building dynamic SQL with identifiers.'
    },
    {
      question: 'What is the safest way to handle user-provided sort column names?',
      options: [
        'Use QUOTENAME() and trust the input',
        'Use sp_executesql with the column name as a parameter',
        'Validate against a whitelist of allowed column names',
        'Convert to lowercase before using'
      ],
      correctIndex: 2,
      explanation: 'Column names cannot be parameterized, and QUOTENAME alone doesn\'t prevent all attacks. The safest approach is to validate the input against a whitelist of allowed column names and reject anything not on the list.'
    }
  ],
  buildNote: {
    title: 'Dynamic SQL in Applications',
    explanation: `Dynamic SQL is typically handled at the application level rather than in the database itself. In a TypeScript application, libraries like Prisma or TypeORM build queries dynamically but use parameterized queries under the hood. However, understanding database-level dynamic SQL helps when writing stored procedures for complex reporting, building admin tools, or working with legacy systems that rely on stored procedures for business logic.`,
    relatedFiles: [
      'src/lib/lesson-utils.ts'
    ],
    inTheRealWorld: `Dynamic SQL is used extensively in enterprise applications. ERP systems use it for configurable reports. Multi-tenant applications use it to switch between customer databases. Search applications build complex WHERE clauses based on user filters. The key is always: parameterize values, validate identifiers, and use least-privilege database accounts. Many security breaches have occurred from improper dynamic SQL handling.`
  }
};
