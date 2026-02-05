import { Lesson } from '@/types/lesson';

export const pivotUnpivot: Lesson = {
  slug: 'sql-pivot-unpivot',
  title: 'PIVOT and UNPIVOT Operations',
  description: 'Transform data between row and column formats using PIVOT, UNPIVOT, and cross-tab queries.',
  difficulty: 'advanced',
  order: 24,
  content: `
# PIVOT and UNPIVOT Operations

PIVOT and UNPIVOT are powerful operations that transform data between row-based and column-based formats. PIVOT converts rows to columns (creating a cross-tab report), while UNPIVOT converts columns to rows (normalizing denormalized data).

## Understanding PIVOT

PIVOT transforms unique values from one column into multiple columns in the output:

\`\`\`sql
-- Before PIVOT:
-- product  | quarter | sales
-- Widget   | Q1      | 100
-- Widget   | Q2      | 150
-- Widget   | Q3      | 200
-- Gadget   | Q1      | 80
-- Gadget   | Q2      | 120

-- After PIVOT:
-- product  | Q1  | Q2  | Q3
-- Widget   | 100 | 150 | 200
-- Gadget   | 80  | 120 | NULL
\`\`\`

## SQL Server PIVOT Syntax

\`\`\`sql
-- SQL Server native PIVOT
SELECT product, [Q1], [Q2], [Q3], [Q4]
FROM (
  SELECT product, quarter, sales
  FROM quarterly_sales
) AS source_table
PIVOT (
  SUM(sales)
  FOR quarter IN ([Q1], [Q2], [Q3], [Q4])
) AS pivot_table;

-- With multiple aggregations (requires subquery trick)
SELECT *
FROM (
  SELECT
    product,
    quarter + '_sales' AS metric,
    sales
  FROM quarterly_sales
  UNION ALL
  SELECT
    product,
    quarter + '_units' AS metric,
    units
  FROM quarterly_sales
) source
PIVOT (
  SUM(sales) FOR metric IN ([Q1_sales], [Q1_units], [Q2_sales], [Q2_units])
) pvt;
\`\`\`

## PostgreSQL PIVOT with CASE/FILTER

PostgreSQL doesn't have native PIVOT, so we use conditional aggregation:

\`\`\`sql
-- PostgreSQL cross-tab using CASE
SELECT
  product,
  SUM(CASE WHEN quarter = 'Q1' THEN sales ELSE 0 END) AS Q1,
  SUM(CASE WHEN quarter = 'Q2' THEN sales ELSE 0 END) AS Q2,
  SUM(CASE WHEN quarter = 'Q3' THEN sales ELSE 0 END) AS Q3,
  SUM(CASE WHEN quarter = 'Q4' THEN sales ELSE 0 END) AS Q4
FROM quarterly_sales
GROUP BY product;

-- Using FILTER clause (PostgreSQL 9.4+)
SELECT
  product,
  SUM(sales) FILTER (WHERE quarter = 'Q1') AS Q1,
  SUM(sales) FILTER (WHERE quarter = 'Q2') AS Q2,
  SUM(sales) FILTER (WHERE quarter = 'Q3') AS Q3,
  SUM(sales) FILTER (WHERE quarter = 'Q4') AS Q4
FROM quarterly_sales
GROUP BY product;

-- Using crosstab function (tablefunc extension)
CREATE EXTENSION IF NOT EXISTS tablefunc;

SELECT * FROM crosstab(
  'SELECT product, quarter, sales
   FROM quarterly_sales
   ORDER BY 1, 2',
  'SELECT DISTINCT quarter FROM quarterly_sales ORDER BY 1'
) AS ct(product TEXT, Q1 INT, Q2 INT, Q3 INT, Q4 INT);
\`\`\`

## MySQL PIVOT with CASE

\`\`\`sql
-- MySQL cross-tab using CASE
SELECT
  product,
  SUM(CASE WHEN quarter = 'Q1' THEN sales ELSE 0 END) AS Q1,
  SUM(CASE WHEN quarter = 'Q2' THEN sales ELSE 0 END) AS Q2,
  SUM(CASE WHEN quarter = 'Q3' THEN sales ELSE 0 END) AS Q3,
  SUM(CASE WHEN quarter = 'Q4' THEN sales ELSE 0 END) AS Q4
FROM quarterly_sales
GROUP BY product;

-- MySQL with IF function
SELECT
  product,
  SUM(IF(quarter = 'Q1', sales, 0)) AS Q1,
  SUM(IF(quarter = 'Q2', sales, 0)) AS Q2,
  SUM(IF(quarter = 'Q3', sales, 0)) AS Q3,
  SUM(IF(quarter = 'Q4', sales, 0)) AS Q4
FROM quarterly_sales
GROUP BY product;
\`\`\`

## Common PIVOT Patterns

### Sales by Month Report

\`\`\`sql
-- Monthly sales cross-tab
SELECT
  product_category,
  SUM(CASE WHEN EXTRACT(MONTH FROM sale_date) = 1 THEN amount END) AS Jan,
  SUM(CASE WHEN EXTRACT(MONTH FROM sale_date) = 2 THEN amount END) AS Feb,
  SUM(CASE WHEN EXTRACT(MONTH FROM sale_date) = 3 THEN amount END) AS Mar,
  SUM(CASE WHEN EXTRACT(MONTH FROM sale_date) = 4 THEN amount END) AS Apr,
  SUM(CASE WHEN EXTRACT(MONTH FROM sale_date) = 5 THEN amount END) AS May,
  SUM(CASE WHEN EXTRACT(MONTH FROM sale_date) = 6 THEN amount END) AS Jun,
  SUM(CASE WHEN EXTRACT(MONTH FROM sale_date) = 7 THEN amount END) AS Jul,
  SUM(CASE WHEN EXTRACT(MONTH FROM sale_date) = 8 THEN amount END) AS Aug,
  SUM(CASE WHEN EXTRACT(MONTH FROM sale_date) = 9 THEN amount END) AS Sep,
  SUM(CASE WHEN EXTRACT(MONTH FROM sale_date) = 10 THEN amount END) AS Oct,
  SUM(CASE WHEN EXTRACT(MONTH FROM sale_date) = 11 THEN amount END) AS Nov,
  SUM(CASE WHEN EXTRACT(MONTH FROM sale_date) = 12 THEN amount END) AS Dec
FROM sales
WHERE EXTRACT(YEAR FROM sale_date) = 2024
GROUP BY product_category;
\`\`\`

### Survey Results Matrix

\`\`\`sql
-- Survey responses by question
SELECT
  respondent_id,
  MAX(CASE WHEN question_id = 1 THEN answer END) AS q1_satisfaction,
  MAX(CASE WHEN question_id = 2 THEN answer END) AS q2_recommend,
  MAX(CASE WHEN question_id = 3 THEN answer END) AS q3_ease_of_use,
  MAX(CASE WHEN question_id = 4 THEN answer END) AS q4_value
FROM survey_responses
GROUP BY respondent_id;
\`\`\`

### Attendance Matrix

\`\`\`sql
-- Employee attendance by day
SELECT
  employee_name,
  MAX(CASE WHEN day_of_week = 'Monday' THEN status END) AS mon,
  MAX(CASE WHEN day_of_week = 'Tuesday' THEN status END) AS tue,
  MAX(CASE WHEN day_of_week = 'Wednesday' THEN status END) AS wed,
  MAX(CASE WHEN day_of_week = 'Thursday' THEN status END) AS thu,
  MAX(CASE WHEN day_of_week = 'Friday' THEN status END) AS fri
FROM attendance
WHERE week_start = '2024-01-08'
GROUP BY employee_name;
\`\`\`

## Understanding UNPIVOT

UNPIVOT converts columns back to rows - normalizing denormalized data:

\`\`\`sql
-- Before UNPIVOT:
-- product  | Q1  | Q2  | Q3  | Q4
-- Widget   | 100 | 150 | 200 | 180

-- After UNPIVOT:
-- product  | quarter | sales
-- Widget   | Q1      | 100
-- Widget   | Q2      | 150
-- Widget   | Q3      | 200
-- Widget   | Q4      | 180
\`\`\`

## SQL Server UNPIVOT Syntax

\`\`\`sql
-- SQL Server native UNPIVOT
SELECT product, quarter, sales
FROM quarterly_totals
UNPIVOT (
  sales FOR quarter IN ([Q1], [Q2], [Q3], [Q4])
) AS unpvt;

-- With column renaming
SELECT
  product,
  REPLACE(quarter, 'Q', 'Quarter ') AS quarter_name,
  sales
FROM quarterly_totals
UNPIVOT (
  sales FOR quarter IN ([Q1], [Q2], [Q3], [Q4])
) AS unpvt;
\`\`\`

## PostgreSQL UNPIVOT with UNION ALL

\`\`\`sql
-- PostgreSQL using UNION ALL
SELECT product, 'Q1' AS quarter, Q1 AS sales FROM quarterly_totals
UNION ALL
SELECT product, 'Q2' AS quarter, Q2 AS sales FROM quarterly_totals
UNION ALL
SELECT product, 'Q3' AS quarter, Q3 AS sales FROM quarterly_totals
UNION ALL
SELECT product, 'Q4' AS quarter, Q4 AS sales FROM quarterly_totals;

-- Using LATERAL and VALUES
SELECT
  qt.product,
  x.quarter,
  x.sales
FROM quarterly_totals qt
CROSS JOIN LATERAL (
  VALUES
    ('Q1', qt.Q1),
    ('Q2', qt.Q2),
    ('Q3', qt.Q3),
    ('Q4', qt.Q4)
) AS x(quarter, sales)
WHERE x.sales IS NOT NULL;

-- Using unnest with arrays (PostgreSQL)
SELECT
  product,
  unnest(ARRAY['Q1', 'Q2', 'Q3', 'Q4']) AS quarter,
  unnest(ARRAY[Q1, Q2, Q3, Q4]) AS sales
FROM quarterly_totals;
\`\`\`

## MySQL UNPIVOT

\`\`\`sql
-- MySQL using UNION ALL
SELECT product, 'Q1' AS quarter, Q1 AS sales FROM quarterly_totals
UNION ALL
SELECT product, 'Q2' AS quarter, Q2 AS sales FROM quarterly_totals
UNION ALL
SELECT product, 'Q3' AS quarter, Q3 AS sales FROM quarterly_totals
UNION ALL
SELECT product, 'Q4' AS quarter, Q4 AS sales FROM quarterly_totals
ORDER BY product, quarter;

-- MySQL 8.0+ with JSON
SELECT
  product,
  j.quarter,
  j.sales
FROM quarterly_totals,
JSON_TABLE(
  JSON_ARRAY(
    JSON_OBJECT('quarter', 'Q1', 'sales', Q1),
    JSON_OBJECT('quarter', 'Q2', 'sales', Q2),
    JSON_OBJECT('quarter', 'Q3', 'sales', Q3),
    JSON_OBJECT('quarter', 'Q4', 'sales', Q4)
  ),
  '$[*]' COLUMNS(
    quarter VARCHAR(2) PATH '$.quarter',
    sales INT PATH '$.sales'
  )
) AS j;
\`\`\`

## Dynamic PIVOT

When pivot columns are not known in advance:

\`\`\`sql
-- SQL Server dynamic pivot
DECLARE @columns NVARCHAR(MAX);
DECLARE @sql NVARCHAR(MAX);

-- Build column list dynamically
SELECT @columns = STRING_AGG(QUOTENAME(quarter), ',')
FROM (SELECT DISTINCT quarter FROM quarterly_sales) AS quarters;

-- Build and execute dynamic SQL
SET @sql = '
SELECT product, ' + @columns + '
FROM (
  SELECT product, quarter, sales
  FROM quarterly_sales
) AS source
PIVOT (
  SUM(sales) FOR quarter IN (' + @columns + ')
) AS pvt;';

EXEC sp_executesql @sql;
\`\`\`

\`\`\`sql
-- PostgreSQL dynamic crosstab
DO $$
DECLARE
  col_list TEXT;
  sql_query TEXT;
BEGIN
  -- Build column list
  SELECT string_agg(DISTINCT quote_ident(quarter) || ' INT', ', ')
  INTO col_list
  FROM quarterly_sales;

  -- Build crosstab query
  sql_query := format('
    SELECT * FROM crosstab(
      ''SELECT product, quarter, sales FROM quarterly_sales ORDER BY 1,2'',
      ''SELECT DISTINCT quarter FROM quarterly_sales ORDER BY 1''
    ) AS ct(product TEXT, %s)', col_list);

  EXECUTE sql_query;
END $$;
\`\`\`

## Practical Examples

### Feature Comparison Matrix

\`\`\`sql
-- Products vs features matrix
SELECT
  product_name,
  MAX(CASE WHEN feature = 'Waterproof' THEN 'Yes' ELSE 'No' END) AS waterproof,
  MAX(CASE WHEN feature = 'Wireless' THEN 'Yes' ELSE 'No' END) AS wireless,
  MAX(CASE WHEN feature = 'Rechargeable' THEN 'Yes' ELSE 'No' END) AS rechargeable,
  MAX(CASE WHEN feature = 'Bluetooth' THEN 'Yes' ELSE 'No' END) AS bluetooth
FROM product_features
GROUP BY product_name;
\`\`\`

### Time-Series to Wide Format

\`\`\`sql
-- Convert hourly readings to daily wide format
SELECT
  reading_date,
  MAX(CASE WHEN EXTRACT(HOUR FROM reading_time) = 0 THEN value END) AS h00,
  MAX(CASE WHEN EXTRACT(HOUR FROM reading_time) = 6 THEN value END) AS h06,
  MAX(CASE WHEN EXTRACT(HOUR FROM reading_time) = 12 THEN value END) AS h12,
  MAX(CASE WHEN EXTRACT(HOUR FROM reading_time) = 18 THEN value END) AS h18
FROM sensor_readings
GROUP BY reading_date
ORDER BY reading_date;
\`\`\`

### Normalizing Import Data

\`\`\`sql
-- Normalize wide import data to proper schema
-- Import table: contacts(name, phone1, phone2, phone3, email1, email2)

-- Unpivot phones
INSERT INTO contact_phones (contact_id, phone_number, phone_type)
SELECT c.id, x.phone, x.phone_type
FROM contacts_import ci
JOIN contacts c ON c.name = ci.name
CROSS JOIN LATERAL (
  VALUES
    (ci.phone1, 'Primary'),
    (ci.phone2, 'Secondary'),
    (ci.phone3, 'Other')
) AS x(phone, phone_type)
WHERE x.phone IS NOT NULL AND x.phone != '';
\`\`\`

## Learning Objectives

By the end of this lesson, you'll be able to:
- Transform row data to columns using PIVOT or CASE expressions
- Convert column data back to rows using UNPIVOT
- Handle dynamic pivot scenarios
- Choose the right technique for your database system
- Build cross-tab reports and matrices
`,
  exercises: [
    {
      id: 1,
      title: 'Exercise 1: Basic PIVOT with CASE',
      description: `Create a cross-tab report of sales by region and quarter.

**Your task:**
Given a sales table, create a report showing each region's sales for Q1, Q2, Q3, and Q4 as separate columns.`,
      starterCode: `-- Table: regional_sales(region, quarter, amount)
-- Quarters are: 'Q1', 'Q2', 'Q3', 'Q4'

SELECT
  region
  -- Add Q1 column

  -- Add Q2 column

  -- Add Q3 column

  -- Add Q4 column

FROM regional_sales
GROUP BY region;`,
      solution: `-- Table: regional_sales(region, quarter, amount)

SELECT
  region,
  SUM(CASE WHEN quarter = 'Q1' THEN amount ELSE 0 END) AS Q1,
  SUM(CASE WHEN quarter = 'Q2' THEN amount ELSE 0 END) AS Q2,
  SUM(CASE WHEN quarter = 'Q3' THEN amount ELSE 0 END) AS Q3,
  SUM(CASE WHEN quarter = 'Q4' THEN amount ELSE 0 END) AS Q4
FROM regional_sales
GROUP BY region
ORDER BY region;`,
      expectedOutput: ['CASE expressions create pivot columns', 'SUM aggregates amounts per quarter', 'GROUP BY region creates one row per region'],
      hints: [
        'Use SUM(CASE WHEN quarter = \'Q1\' THEN amount ELSE 0 END)',
        'Each quarter becomes a separate CASE expression',
        'GROUP BY region to get one row per region'
      ],
    },
    {
      id: 2,
      title: 'Exercise 2: UNPIVOT with UNION ALL',
      description: `Convert a wide table back to a normalized format.

**Your task:**
Transform a table with separate columns for each month into rows with month and value columns.`,
      starterCode: `-- Table: monthly_stats(metric_name, jan, feb, mar)
-- Convert to: (metric_name, month, value)

-- Write UNION ALL query

`,
      solution: `-- Table: monthly_stats(metric_name, jan, feb, mar)
-- Convert to: (metric_name, month, value)

SELECT metric_name, 'January' AS month, jan AS value FROM monthly_stats
UNION ALL
SELECT metric_name, 'February' AS month, feb AS value FROM monthly_stats
UNION ALL
SELECT metric_name, 'March' AS month, mar AS value FROM monthly_stats
ORDER BY metric_name, month;`,
      expectedOutput: ['UNION ALL combines all month columns', 'Each SELECT creates rows for one month', 'Literal strings provide month names'],
      hints: [
        'Each UNION ALL SELECT handles one column',
        'Use literal strings for the month names',
        'Column aliases must match across all SELECTs'
      ],
    },
    {
      id: 3,
      title: 'Exercise 3: Survey Results Matrix',
      description: `Transform survey responses into a matrix format.

**Your task:**
Given survey responses stored as rows (respondent_id, question_code, answer), create a matrix with one row per respondent and columns for each question.`,
      starterCode: `-- Table: survey_responses(respondent_id, question_code, answer)
-- question_codes are: 'Q1', 'Q2', 'Q3', 'Q4', 'Q5'

SELECT
  respondent_id
  -- Add columns for each question

FROM survey_responses
GROUP BY respondent_id
ORDER BY respondent_id;`,
      solution: `-- Table: survey_responses(respondent_id, question_code, answer)

SELECT
  respondent_id,
  MAX(CASE WHEN question_code = 'Q1' THEN answer END) AS satisfaction,
  MAX(CASE WHEN question_code = 'Q2' THEN answer END) AS recommend,
  MAX(CASE WHEN question_code = 'Q3' THEN answer END) AS ease_of_use,
  MAX(CASE WHEN question_code = 'Q4' THEN answer END) AS quality,
  MAX(CASE WHEN question_code = 'Q5' THEN answer END) AS value
FROM survey_responses
GROUP BY respondent_id
ORDER BY respondent_id;`,
      expectedOutput: ['MAX extracts single value per question per respondent', 'NULL returned if question not answered', 'One row per respondent'],
      hints: [
        'Use MAX (or MIN) instead of SUM for non-numeric values',
        'Each question becomes a CASE expression',
        'No ELSE needed - NULL is fine for missing answers'
      ],
    },
    {
      id: 4,
      title: 'Exercise 4: Multiple Measures PIVOT',
      description: `Create a pivot table with multiple measures (e.g., both sales amount and unit count).

**Your task:**
Show quarterly data with both revenue and units sold as separate columns.`,
      starterCode: `-- Table: sales_data(product, quarter, revenue, units_sold)
-- Output columns: product, Q1_revenue, Q1_units, Q2_revenue, Q2_units, etc.

SELECT
  product
  -- Add revenue and units for each quarter

FROM sales_data
GROUP BY product;`,
      solution: `-- Table: sales_data(product, quarter, revenue, units_sold)

SELECT
  product,
  SUM(CASE WHEN quarter = 'Q1' THEN revenue ELSE 0 END) AS Q1_revenue,
  SUM(CASE WHEN quarter = 'Q1' THEN units_sold ELSE 0 END) AS Q1_units,
  SUM(CASE WHEN quarter = 'Q2' THEN revenue ELSE 0 END) AS Q2_revenue,
  SUM(CASE WHEN quarter = 'Q2' THEN units_sold ELSE 0 END) AS Q2_units,
  SUM(CASE WHEN quarter = 'Q3' THEN revenue ELSE 0 END) AS Q3_revenue,
  SUM(CASE WHEN quarter = 'Q3' THEN units_sold ELSE 0 END) AS Q3_units,
  SUM(CASE WHEN quarter = 'Q4' THEN revenue ELSE 0 END) AS Q4_revenue,
  SUM(CASE WHEN quarter = 'Q4' THEN units_sold ELSE 0 END) AS Q4_units
FROM sales_data
GROUP BY product
ORDER BY product;`,
      expectedOutput: ['Multiple CASE expressions per quarter', 'One for revenue, one for units', 'Clear column naming convention'],
      hints: [
        'Create separate CASE for each measure',
        'Use clear naming: Q1_revenue, Q1_units',
        'Same quarter condition, different column selected'
      ],
    },
  ],
  quiz: [
    {
      question: 'What is the main difference between PIVOT and UNPIVOT operations?',
      options: [
        'PIVOT is faster than UNPIVOT',
        'PIVOT converts rows to columns, UNPIVOT converts columns to rows',
        'PIVOT works with numbers, UNPIVOT works with text',
        'PIVOT requires an index, UNPIVOT does not'
      ],
      correctIndex: 1,
      explanation: 'PIVOT transforms unique values from rows into columns (row-to-column transformation), while UNPIVOT does the reverse, converting columns back into rows (column-to-row transformation).'
    },
    {
      question: 'Why do we use MAX() instead of SUM() when pivoting non-numeric values?',
      options: [
        'MAX is faster than SUM',
        'SUM cannot be used in PIVOT operations',
        'MAX extracts the single value from the group, while SUM would fail on non-numeric data',
        'There is no difference between MAX and SUM for pivoting'
      ],
      correctIndex: 2,
      explanation: 'When pivoting non-numeric values (like strings or status codes), we need an aggregate function but not actual aggregation. MAX (or MIN) effectively extracts the single value from each group, while SUM would cause an error on non-numeric data.'
    },
    {
      question: 'What is the purpose of ELSE 0 in SUM(CASE WHEN ... THEN value ELSE 0 END)?',
      options: [
        'It makes the query run faster',
        'It prevents NULL values which would make the entire SUM NULL',
        'It is required syntax for CASE expressions',
        'It converts negative numbers to zero'
      ],
      correctIndex: 1,
      explanation: 'Without ELSE 0, non-matching rows return NULL. While SUM typically ignores NULLs, using ELSE 0 makes it explicit and ensures consistent behavior. Some prefer leaving it as NULL to distinguish between "no data" and "zero".'
    },
    {
      question: 'Which SQL databases have native PIVOT/UNPIVOT syntax?',
      options: [
        'PostgreSQL and MySQL only',
        'SQL Server and Oracle only',
        'All SQL databases since SQL-92',
        'None - PIVOT is not part of SQL standard'
      ],
      correctIndex: 1,
      explanation: 'SQL Server and Oracle have native PIVOT/UNPIVOT syntax. PostgreSQL and MySQL require workarounds using CASE expressions, UNION ALL, or extensions like tablefunc. PIVOT is not part of the SQL standard.'
    }
  ],
  buildNote: {
    title: 'PIVOT for Reporting',
    explanation: `PIVOT operations are essential for creating reports and dashboards. In a learning platform, you might pivot learner progress data to show completion rates by lesson and week, creating a matrix view. For example, transforming rows of (user_id, week, lessons_completed) into columns showing each week's completions. This is common when exporting data to spreadsheets or displaying in tabular UI components that expect denormalized data.`,
    relatedFiles: [
      'src/lib/lesson-utils.ts'
    ],
    inTheRealWorld: `PIVOT is heavily used in business intelligence and reporting. Financial reports show revenue by month in columns. HR dashboards show attendance by day. Sales reports show product performance across regions. The key is knowing when to pivot (for human-readable reports) vs when to keep data normalized (for application processing). Most BI tools can handle pivoting automatically, but understanding the SQL helps with custom reports and data exports.`
  }
};
