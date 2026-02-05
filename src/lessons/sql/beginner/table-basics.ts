import { Lesson } from '@/types/lesson';

export const tableBasics: Lesson = {
  slug: 'sql-table-basics',
  title: 'Table Basics',
  description: 'Learn to create and modify database tables using CREATE TABLE, data types, DROP TABLE, and ALTER TABLE.',
  difficulty: 'beginner',
  order: 8,
  content: `
# Table Basics

Before you can store data, you need tables. This lesson covers creating tables with appropriate data types, and modifying table structure.

## CREATE TABLE

Create a new table with columns and their data types:

\`\`\`sql
CREATE TABLE employees (
    employee_id INT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE,
    hire_date DATE,
    salary DECIMAL(10, 2),
    is_active BOOLEAN DEFAULT true
);
\`\`\`

Each column definition includes:
- **Column name** - identifier for the column
- **Data type** - what kind of data it stores
- **Constraints** - rules the data must follow (optional)

## Common Data Types

### Numeric Types

| Type | Description | Example |
|------|-------------|---------|
| INT / INTEGER | Whole numbers | 42, -100, 0 |
| BIGINT | Large whole numbers | 9223372036854775807 |
| SMALLINT | Small whole numbers (-32768 to 32767) | 100 |
| DECIMAL(p, s) | Exact decimals (p digits, s after decimal) | DECIMAL(10,2) for money |
| NUMERIC(p, s) | Same as DECIMAL | NUMERIC(8,4) |
| FLOAT / REAL | Approximate decimals | 3.14159 |
| DOUBLE PRECISION | Higher precision float | Scientific calculations |

\`\`\`sql
CREATE TABLE products (
    product_id INT,
    quantity INT,
    price DECIMAL(10, 2),      -- Up to 99999999.99
    weight FLOAT,
    rating DECIMAL(2, 1)       -- 0.0 to 9.9
);
\`\`\`

### String Types

| Type | Description | Example |
|------|-------------|---------|
| CHAR(n) | Fixed-length string | CHAR(2) for state codes |
| VARCHAR(n) | Variable-length string (max n) | VARCHAR(100) for names |
| TEXT | Unlimited length text | Long descriptions |

\`\`\`sql
CREATE TABLE articles (
    id INT,
    title VARCHAR(200),        -- Up to 200 characters
    slug CHAR(50),             -- Always 50 characters (padded)
    content TEXT,              -- Unlimited
    summary VARCHAR(500)
);
\`\`\`

### Date and Time Types

| Type | Description | Example |
|------|-------------|---------|
| DATE | Date only | '2024-03-15' |
| TIME | Time only | '14:30:00' |
| TIMESTAMP | Date and time | '2024-03-15 14:30:00' |
| DATETIME | Same as TIMESTAMP (MySQL) | '2024-03-15 14:30:00' |

\`\`\`sql
CREATE TABLE events (
    event_id INT,
    event_name VARCHAR(100),
    event_date DATE,           -- '2024-12-25'
    start_time TIME,           -- '09:00:00'
    created_at TIMESTAMP       -- '2024-03-15 14:30:45'
);
\`\`\`

### Boolean Type

| Type | Description | Example |
|------|-------------|---------|
| BOOLEAN / BOOL | True or false | true, false |

\`\`\`sql
CREATE TABLE users (
    user_id INT,
    username VARCHAR(50),
    is_verified BOOLEAN DEFAULT false,
    is_admin BOOLEAN DEFAULT false
);
\`\`\`

## Column Constraints

Constraints enforce rules on column values:

### PRIMARY KEY

Uniquely identifies each row:

\`\`\`sql
CREATE TABLE customers (
    customer_id INT PRIMARY KEY,    -- Each row has unique ID
    name VARCHAR(100)
);

-- Or for composite primary key:
CREATE TABLE order_items (
    order_id INT,
    product_id INT,
    quantity INT,
    PRIMARY KEY (order_id, product_id)
);
\`\`\`

### NOT NULL

Column cannot contain NULL:

\`\`\`sql
CREATE TABLE products (
    product_id INT PRIMARY KEY,
    product_name VARCHAR(100) NOT NULL,  -- Required
    description TEXT                      -- Optional (can be NULL)
);
\`\`\`

### UNIQUE

Values must be unique across all rows:

\`\`\`sql
CREATE TABLE users (
    user_id INT PRIMARY KEY,
    email VARCHAR(100) UNIQUE,      -- No duplicate emails
    username VARCHAR(50) UNIQUE     -- No duplicate usernames
);
\`\`\`

### DEFAULT

Provides a default value if none specified:

\`\`\`sql
CREATE TABLE orders (
    order_id INT PRIMARY KEY,
    status VARCHAR(20) DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

### CHECK

Validates values against a condition:

\`\`\`sql
CREATE TABLE products (
    product_id INT PRIMARY KEY,
    price DECIMAL(10, 2) CHECK (price > 0),
    quantity INT CHECK (quantity >= 0)
);
\`\`\`

## AUTO_INCREMENT / SERIAL

Automatically generate unique IDs:

\`\`\`sql
-- MySQL
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50)
);

-- PostgreSQL
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50)
);
\`\`\`

## DROP TABLE

Remove a table entirely:

\`\`\`sql
-- Delete the table and all its data
DROP TABLE old_logs;

-- Delete only if the table exists (avoids error)
DROP TABLE IF EXISTS temp_data;
\`\`\`

**WARNING:** DROP TABLE permanently deletes the table and all its data!

## ALTER TABLE

Modify an existing table's structure:

### Add a Column

\`\`\`sql
ALTER TABLE employees
ADD COLUMN phone VARCHAR(20);

ALTER TABLE products
ADD COLUMN category VARCHAR(50) DEFAULT 'Uncategorized';
\`\`\`

### Drop a Column

\`\`\`sql
ALTER TABLE employees
DROP COLUMN middle_name;
\`\`\`

### Modify a Column

\`\`\`sql
-- Change data type (syntax varies by database)
-- PostgreSQL
ALTER TABLE products
ALTER COLUMN price TYPE DECIMAL(12, 2);

-- MySQL
ALTER TABLE products
MODIFY COLUMN price DECIMAL(12, 2);
\`\`\`

### Rename a Column

\`\`\`sql
-- PostgreSQL
ALTER TABLE employees
RENAME COLUMN phone TO phone_number;

-- MySQL
ALTER TABLE employees
CHANGE phone phone_number VARCHAR(20);
\`\`\`

### Add a Constraint

\`\`\`sql
ALTER TABLE users
ADD CONSTRAINT unique_email UNIQUE (email);

ALTER TABLE orders
ADD CONSTRAINT valid_total CHECK (total_amount >= 0);
\`\`\`

## Complete Example

\`\`\`sql
-- Create a full e-commerce schema
CREATE TABLE customers (
    customer_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
    product_id SERIAL PRIMARY KEY,
    product_name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL CHECK (price > 0),
    stock_quantity INT DEFAULT 0 CHECK (stock_quantity >= 0),
    category VARCHAR(50),
    is_active BOOLEAN DEFAULT true
);

CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    customer_id INT NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'Pending',
    total_amount DECIMAL(10, 2) CHECK (total_amount >= 0)
);
\`\`\`

## Quick Reference

| Operation | Syntax |
|-----------|--------|
| Create table | CREATE TABLE name (columns) |
| Delete table | DROP TABLE name |
| Add column | ALTER TABLE t ADD COLUMN col type |
| Drop column | ALTER TABLE t DROP COLUMN col |
| Rename column | ALTER TABLE t RENAME COLUMN old TO new |

## Learning Objectives

By the end of this lesson, you'll be able to:
- Create tables with appropriate data types
- Use common data types: INT, VARCHAR, DATE, DECIMAL, BOOLEAN
- Apply constraints: PRIMARY KEY, NOT NULL, UNIQUE, DEFAULT, CHECK
- Delete tables with DROP TABLE
- Modify table structure with ALTER TABLE
`,
  exercises: [
    {
      id: 1,
      title: 'Exercise 1: Create a Basic Table',
      description: `Create a table to store product information.

**Your task:**
Create a table called \`products\` with the following columns:
- product_id: INT, PRIMARY KEY
- product_name: VARCHAR(100), NOT NULL
- price: DECIMAL(10, 2)
- category: VARCHAR(50)`,
      starterCode: `-- Create the products table

`,
      solution: `CREATE TABLE products (
    product_id INT PRIMARY KEY,
    product_name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2),
    category VARCHAR(50)
);`,
      expectedOutput: [
        'Table created successfully'
      ],
      hints: [
        'Use CREATE TABLE products (...)',
        'Each column needs a name and data type',
        'Separate columns with commas',
        'PRIMARY KEY goes after the data type'
      ]
    },
    {
      id: 2,
      title: 'Exercise 2: Table with Multiple Constraints',
      description: `Create a users table with various constraints.

**Your task:**
Create a table called \`users\` with:
- user_id: INT, PRIMARY KEY
- username: VARCHAR(50), NOT NULL, UNIQUE
- email: VARCHAR(100), UNIQUE
- is_active: BOOLEAN, DEFAULT true
- created_at: TIMESTAMP, DEFAULT CURRENT_TIMESTAMP`,
      starterCode: `-- Create the users table with constraints

`,
      solution: `CREATE TABLE users (
    user_id INT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) UNIQUE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`,
      expectedOutput: [
        'Table created successfully'
      ],
      hints: [
        'Constraints follow the data type',
        'You can combine NOT NULL and UNIQUE',
        'DEFAULT specifies a default value',
        'CURRENT_TIMESTAMP gives the current date/time'
      ]
    },
    {
      id: 3,
      title: 'Exercise 3: ALTER TABLE - Add Columns',
      description: `Add new columns to an existing table.

**Your task:**
Given an existing \`employees\` table, add two new columns:
1. phone: VARCHAR(20)
2. department: VARCHAR(50) with DEFAULT 'General'`,
      starterCode: `-- Add phone and department columns to employees

`,
      solution: `ALTER TABLE employees
ADD COLUMN phone VARCHAR(20);

ALTER TABLE employees
ADD COLUMN department VARCHAR(50) DEFAULT 'General';`,
      expectedOutput: [
        'Column added successfully',
        'Column added successfully'
      ],
      hints: [
        'Use ALTER TABLE to modify existing tables',
        'ADD COLUMN adds a new column',
        'Include the column name and data type',
        'DEFAULT can be added to the column definition'
      ]
    },
    {
      id: 4,
      title: 'Exercise 4: DROP TABLE',
      description: `Safely remove tables that are no longer needed.

**Your task:**
1. Drop a table called \`temp_logs\` (assume it exists)
2. Drop a table called \`old_data\` only if it exists (to avoid errors)`,
      starterCode: `-- Drop temp_logs table


-- Drop old_data table safely (only if exists)

`,
      solution: `DROP TABLE temp_logs;

DROP TABLE IF EXISTS old_data;`,
      expectedOutput: [
        'Table dropped successfully',
        'Table dropped (or did not exist)'
      ],
      hints: [
        'DROP TABLE removes the table completely',
        'IF EXISTS prevents errors if table doesn\'t exist',
        'Use IF EXISTS for safer scripts',
        'This operation cannot be undone!'
      ]
    }
  ],
  quiz: [
    {
      question: 'Which data type is best for storing monetary values like prices?',
      options: [
        'FLOAT',
        'INT',
        'DECIMAL(10, 2)',
        'VARCHAR(20)'
      ],
      correctIndex: 2,
      explanation: 'DECIMAL (or NUMERIC) stores exact decimal values, which is crucial for money. FLOAT can have rounding errors. DECIMAL(10, 2) stores up to 8 digits before the decimal and 2 after.'
    },
    {
      question: 'What does the NOT NULL constraint do?',
      options: [
        'Sets the column value to zero',
        'Prevents the column from being deleted',
        'Requires a value to be provided for the column',
        'Makes the column unique'
      ],
      correctIndex: 2,
      explanation: 'NOT NULL means the column cannot contain NULL values. Every row must have a value in that column, either provided explicitly or through a DEFAULT.'
    },
    {
      question: 'Which statement safely removes a table only if it exists?',
      options: [
        'DELETE TABLE IF EXISTS users;',
        'DROP TABLE IF EXISTS users;',
        'REMOVE TABLE users IF EXISTS;',
        'DROP users IF TABLE EXISTS;'
      ],
      correctIndex: 1,
      explanation: 'DROP TABLE IF EXISTS will remove the table if it exists, and do nothing (no error) if it doesn\'t. This is safer in scripts that might run multiple times.'
    },
    {
      question: 'What is the difference between CHAR(10) and VARCHAR(10)?',
      options: [
        'CHAR stores numbers, VARCHAR stores text',
        'CHAR is fixed-length (always 10 chars), VARCHAR is variable-length (up to 10)',
        'CHAR is faster, VARCHAR is slower',
        'There is no difference'
      ],
      correctIndex: 1,
      explanation: 'CHAR(10) always stores exactly 10 characters, padding shorter strings with spaces. VARCHAR(10) stores up to 10 characters without padding. VARCHAR is more space-efficient for variable-length data.'
    }
  ],
  buildNote: {
    title: 'Table Design in Real Applications',
    explanation: `The Code Tutor application's database schema is defined using CREATE TABLE statements. The lessons table uses \`CREATE TABLE lessons (id SERIAL PRIMARY KEY, slug VARCHAR(100) UNIQUE NOT NULL, title VARCHAR(200) NOT NULL, content TEXT, difficulty VARCHAR(20), order_num INT)\`. User progress tracking uses \`CREATE TABLE progress (user_id INT REFERENCES users(id), lesson_id INT REFERENCES lessons(id), completed BOOLEAN DEFAULT false, completed_at TIMESTAMP, PRIMARY KEY (user_id, lesson_id))\`. The schema evolves over time using ALTER TABLE: adding new features like \`ALTER TABLE lessons ADD COLUMN language VARCHAR(20) DEFAULT 'typescript'\`. Migration files track all schema changes in order.`,
    relatedFiles: [
      'src/lib/db/schema.sql',
      'src/lib/db/migrations/',
      'src/types/database.ts'
    ],
    inTheRealWorld: `Database schema design is fundamental to application architecture. E-commerce platforms carefully choose types: \`price DECIMAL(10,2)\` for exact currency, \`quantity INT CHECK (quantity >= 0)\` for inventory. Social platforms design for scale: \`user_id BIGINT\` for billions of users. Content management uses \`TEXT\` for articles, \`VARCHAR\` for titles. Enterprise systems use comprehensive constraints to enforce business rules at the database level. Schema migrations (versioned ALTER TABLE statements) are standard practice for evolving production databases without data loss. ORMs like Prisma, TypeORM, and Sequelize generate these statements from code.`
  }
};
