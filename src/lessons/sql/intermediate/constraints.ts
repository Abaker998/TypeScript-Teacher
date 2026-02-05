import { Lesson } from '@/types/lesson';

export const sqlConstraints: Lesson = {
  slug: 'sql-constraints',
  title: 'Constraints',
  description: 'Enforce data integrity with PRIMARY KEY, FOREIGN KEY, UNIQUE, CHECK, DEFAULT, and NOT NULL constraints.',
  difficulty: 'intermediate',
  order: 15,
  content: `
# SQL Constraints

Constraints are rules enforced on table columns to ensure data integrity. They prevent invalid data from being inserted and maintain relationships between tables. Constraints are essential for reliable database design.

## Why Constraints Matter

Without constraints:
\`\`\`sql
-- Bad data can slip in
INSERT INTO orders (customer_id, total) VALUES (99999, -500);
-- Customer 99999 doesn't exist, total is negative!

-- Duplicate records
INSERT INTO users (email) VALUES ('alice@example.com');
INSERT INTO users (email) VALUES ('alice@example.com');  -- Duplicate allowed!
\`\`\`

With constraints:
\`\`\`sql
-- Database rejects invalid data automatically
-- Enforces business rules at the database level
-- Data is always consistent
\`\`\`

## PRIMARY KEY

Uniquely identifies each row. Cannot be NULL and must be unique:

\`\`\`sql
-- Single column primary key
CREATE TABLE users (
    id INT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(255)
);

-- Auto-incrementing primary key
CREATE TABLE users (
    id SERIAL PRIMARY KEY,  -- PostgreSQL
    -- or: id INT AUTO_INCREMENT PRIMARY KEY (MySQL)
    name VARCHAR(100)
);

-- Composite primary key (multiple columns)
CREATE TABLE enrollments (
    student_id INT,
    course_id INT,
    enrollment_date DATE,
    PRIMARY KEY (student_id, course_id)
);

-- Named constraint
CREATE TABLE products (
    id INT,
    sku VARCHAR(50),
    CONSTRAINT pk_products PRIMARY KEY (id)
);
\`\`\`

**Key points:**
- One primary key per table
- Can span multiple columns (composite key)
- Automatically creates a unique index

## FOREIGN KEY

Links a column to a primary key in another table, enforcing referential integrity:

\`\`\`sql
-- Basic foreign key
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    customer_id INT,
    order_date DATE,
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);

-- Named foreign key
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    customer_id INT,
    CONSTRAINT fk_orders_customer
        FOREIGN KEY (customer_id)
        REFERENCES customers(id)
);

-- Foreign key with actions
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    customer_id INT,
    FOREIGN KEY (customer_id) REFERENCES customers(id)
        ON DELETE CASCADE      -- Delete orders when customer deleted
        ON UPDATE CASCADE      -- Update orders when customer id changes
);
\`\`\`

### ON DELETE and ON UPDATE Actions

| Action | Description |
|--------|-------------|
| CASCADE | Automatically delete/update related rows |
| SET NULL | Set foreign key to NULL |
| SET DEFAULT | Set foreign key to its default value |
| RESTRICT | Prevent delete/update if related rows exist |
| NO ACTION | Similar to RESTRICT (default) |

\`\`\`sql
-- Example: When a category is deleted
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    category_id INT,
    FOREIGN KEY (category_id) REFERENCES categories(id)
        ON DELETE SET NULL     -- Product remains, category becomes NULL
        ON UPDATE CASCADE      -- Update product's category_id if category id changes
);

-- Example: Prevent deleting customers with orders
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    customer_id INT NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES customers(id)
        ON DELETE RESTRICT     -- Cannot delete customer if orders exist
);
\`\`\`

## UNIQUE

Ensures all values in a column are different:

\`\`\`sql
-- Unique column
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE,
    username VARCHAR(50) UNIQUE
);

-- Unique constraint (explicit)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255),
    CONSTRAINT uk_users_email UNIQUE (email)
);

-- Composite unique (combination must be unique)
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INT,
    product_id INT,
    quantity INT,
    UNIQUE (order_id, product_id)  -- Can't add same product twice to one order
);
\`\`\`

**UNIQUE vs PRIMARY KEY:**
- UNIQUE allows NULL values (one NULL usually)
- A table can have multiple UNIQUE constraints
- A table can only have one PRIMARY KEY

## NOT NULL

Requires a column to have a value:

\`\`\`sql
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,        -- Must have a name
    description TEXT,                  -- Can be NULL
    price DECIMAL(10,2) NOT NULL,      -- Must have a price
    category_id INT NOT NULL           -- Must have a category
);

-- Adding NOT NULL to existing column
ALTER TABLE products ALTER COLUMN name SET NOT NULL;

-- Removing NOT NULL
ALTER TABLE products ALTER COLUMN description DROP NOT NULL;
\`\`\`

## DEFAULT

Provides a default value when none is specified:

\`\`\`sql
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    customer_id INT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    quantity INT DEFAULT 1,
    is_active BOOLEAN DEFAULT true
);

-- Insert uses defaults
INSERT INTO orders (customer_id) VALUES (123);
-- status='pending', created_at=now, quantity=1, is_active=true

-- Explicit NULL overrides default
INSERT INTO orders (customer_id, status) VALUES (123, NULL);
-- status=NULL (not 'pending')
\`\`\`

## CHECK

Validates that values meet a condition:

\`\`\`sql
-- Simple check
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) CHECK (price > 0),
    discount DECIMAL(3,2) CHECK (discount >= 0 AND discount <= 1)
);

-- Named check constraint
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    salary DECIMAL(10,2),
    CONSTRAINT chk_salary_positive CHECK (salary > 0)
);

-- Multiple conditions
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    start_date DATE,
    end_date DATE,
    CONSTRAINT chk_dates CHECK (end_date >= start_date)
);

-- Check with IN
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    status VARCHAR(20),
    CONSTRAINT chk_status CHECK (status IN ('pending', 'processing', 'shipped', 'delivered'))
);

-- Check with patterns (PostgreSQL)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255),
    CONSTRAINT chk_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$')
);
\`\`\`

## Adding Constraints to Existing Tables

\`\`\`sql
-- Add primary key
ALTER TABLE users ADD PRIMARY KEY (id);

-- Add foreign key
ALTER TABLE orders
ADD CONSTRAINT fk_orders_customer
FOREIGN KEY (customer_id) REFERENCES customers(id);

-- Add unique constraint
ALTER TABLE users ADD CONSTRAINT uk_email UNIQUE (email);

-- Add check constraint
ALTER TABLE products ADD CONSTRAINT chk_price CHECK (price > 0);

-- Add not null (PostgreSQL)
ALTER TABLE products ALTER COLUMN name SET NOT NULL;

-- Add default
ALTER TABLE orders ALTER COLUMN status SET DEFAULT 'pending';
\`\`\`

## Removing Constraints

\`\`\`sql
-- Drop named constraint
ALTER TABLE orders DROP CONSTRAINT fk_orders_customer;

-- Drop primary key
ALTER TABLE users DROP CONSTRAINT users_pkey;

-- Drop default
ALTER TABLE orders ALTER COLUMN status DROP DEFAULT;

-- Drop not null
ALTER TABLE products ALTER COLUMN name DROP NOT NULL;
\`\`\`

## Viewing Constraints

\`\`\`sql
-- PostgreSQL
SELECT constraint_name, constraint_type
FROM information_schema.table_constraints
WHERE table_name = 'orders';

-- MySQL
SHOW CREATE TABLE orders;

-- SQL Server
SELECT * FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
WHERE TABLE_NAME = 'orders';
\`\`\`

## Constraint Best Practices

### Name Your Constraints

\`\`\`sql
-- Good: Named constraints are easier to manage
CREATE TABLE orders (
    id SERIAL,
    customer_id INT,
    CONSTRAINT pk_orders PRIMARY KEY (id),
    CONSTRAINT fk_orders_customer FOREIGN KEY (customer_id) REFERENCES customers(id),
    CONSTRAINT chk_orders_amount CHECK (amount > 0)
);

-- Bad: Auto-generated names are hard to reference
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,  -- pk name is auto-generated
    customer_id INT REFERENCES customers(id)  -- fk name is auto-generated
);
\`\`\`

### Common Naming Conventions

| Constraint | Convention | Example |
|------------|------------|---------|
| Primary Key | pk_tablename | pk_orders |
| Foreign Key | fk_table_reference | fk_orders_customer |
| Unique | uk_table_column | uk_users_email |
| Check | chk_table_rule | chk_price_positive |

### Deferrable Constraints (PostgreSQL)

\`\`\`sql
-- Defer constraint check until transaction commits
CREATE TABLE nodes (
    id SERIAL PRIMARY KEY,
    parent_id INT,
    CONSTRAINT fk_parent
        FOREIGN KEY (parent_id) REFERENCES nodes(id)
        DEFERRABLE INITIALLY DEFERRED
);

-- Now you can insert parent and child in any order within a transaction
BEGIN;
INSERT INTO nodes (id, parent_id) VALUES (2, 1);  -- Child first (parent doesn't exist yet)
INSERT INTO nodes (id, parent_id) VALUES (1, NULL);  -- Parent after
COMMIT;  -- Constraint checked here, passes because parent exists
\`\`\`

## Complete Table Example

\`\`\`sql
CREATE TABLE orders (
    -- Primary key with auto-increment
    id SERIAL,

    -- Required fields
    customer_id INT NOT NULL,
    order_date DATE NOT NULL DEFAULT CURRENT_DATE,

    -- Optional fields with defaults
    status VARCHAR(20) DEFAULT 'pending',
    notes TEXT,

    -- Numeric fields with validation
    total DECIMAL(10,2) NOT NULL,
    discount DECIMAL(3,2) DEFAULT 0,

    -- Constraints
    CONSTRAINT pk_orders PRIMARY KEY (id),
    CONSTRAINT fk_orders_customer
        FOREIGN KEY (customer_id)
        REFERENCES customers(id)
        ON DELETE RESTRICT,
    CONSTRAINT chk_total_positive CHECK (total >= 0),
    CONSTRAINT chk_discount_range CHECK (discount >= 0 AND discount <= 1),
    CONSTRAINT chk_status_valid CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled'))
);
\`\`\`

## Quick Reference

| Constraint | Purpose | Allows NULL | Multiple per Table |
|------------|---------|-------------|-------------------|
| PRIMARY KEY | Unique identifier | No | No (one only) |
| FOREIGN KEY | Referential integrity | Yes | Yes |
| UNIQUE | No duplicates | Yes (usually one) | Yes |
| NOT NULL | Requires value | No | Yes |
| DEFAULT | Default value | N/A | Yes |
| CHECK | Custom validation | Yes | Yes |
`,
  exercises: [
    {
      id: 1,
      title: 'Exercise 1: Primary and Foreign Keys',
      description: `Create tables with proper primary and foreign key relationships.

**Your Task:**
Create two tables:
1. \`departments\` with id (primary key) and name
2. \`employees\` with id (primary key), name, and department_id (foreign key)

The foreign key should prevent deleting departments that have employees.`,
      starterCode: `-- Create the departments table with primary key


-- Create the employees table with primary key and foreign key

`,
      solution: `CREATE TABLE departments (
    id SERIAL,
    name VARCHAR(100) NOT NULL,
    CONSTRAINT pk_departments PRIMARY KEY (id)
);

CREATE TABLE employees (
    id SERIAL,
    name VARCHAR(100) NOT NULL,
    department_id INT NOT NULL,
    CONSTRAINT pk_employees PRIMARY KEY (id),
    CONSTRAINT fk_employees_department
        FOREIGN KEY (department_id)
        REFERENCES departments(id)
        ON DELETE RESTRICT
);`,
      expectedOutput: ['Table departments created', 'Table employees created'],
      hints: [
        'SERIAL creates an auto-incrementing integer in PostgreSQL',
        'Name your constraints using pk_ and fk_ prefixes',
        'ON DELETE RESTRICT prevents deleting referenced rows',
        'The foreign key references departments(id)'
      ]
    },
    {
      id: 2,
      title: 'Exercise 2: UNIQUE and NOT NULL',
      description: `Create a users table with proper uniqueness and required field constraints.

**Your Task:**
Create a \`users\` table with:
- id (primary key)
- email (unique, required)
- username (unique, required)
- name (required)
- bio (optional)`,
      starterCode: `-- Create users table with unique email and username

`,
      solution: `CREATE TABLE users (
    id SERIAL,
    email VARCHAR(255) NOT NULL,
    username VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    bio TEXT,
    CONSTRAINT pk_users PRIMARY KEY (id),
    CONSTRAINT uk_users_email UNIQUE (email),
    CONSTRAINT uk_users_username UNIQUE (username)
);`,
      expectedOutput: ['Table users created with constraints'],
      hints: [
        'Use NOT NULL for required fields',
        'Use UNIQUE constraint for email and username',
        'Fields without NOT NULL can be NULL (like bio)',
        'Name unique constraints with uk_ prefix'
      ]
    },
    {
      id: 3,
      title: 'Exercise 3: CHECK and DEFAULT Constraints',
      description: `Create a products table with validation and default values.

**Your Task:**
Create a \`products\` table with:
- id (primary key)
- name (required)
- price (required, must be greater than 0)
- discount (default 0, must be between 0 and 1)
- status (default 'active', must be one of: 'active', 'inactive', 'discontinued')`,
      starterCode: `-- Create products table with CHECK constraints and defaults

`,
      solution: `CREATE TABLE products (
    id SERIAL,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    discount DECIMAL(3,2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active',
    CONSTRAINT pk_products PRIMARY KEY (id),
    CONSTRAINT chk_price_positive CHECK (price > 0),
    CONSTRAINT chk_discount_range CHECK (discount >= 0 AND discount <= 1),
    CONSTRAINT chk_status_valid CHECK (status IN ('active', 'inactive', 'discontinued'))
);`,
      expectedOutput: ['Table products created with CHECK constraints'],
      hints: [
        'Use CHECK (price > 0) to validate price',
        'Use CHECK with AND for range: discount >= 0 AND discount <= 1',
        'Use CHECK with IN for allowed values',
        'DEFAULT sets the value when not provided'
      ]
    },
    {
      id: 4,
      title: 'Exercise 4: Add Constraints to Existing Table',
      description: `Add constraints to an existing table.

**Given:** An existing \`orders\` table with columns: id, customer_id, amount, status

**Your Task:**
Add the following constraints:
1. Primary key on id
2. Foreign key on customer_id referencing customers(id)
3. Check constraint ensuring amount > 0`,
      starterCode: `-- Add primary key


-- Add foreign key


-- Add check constraint

`,
      solution: `-- Add primary key
ALTER TABLE orders ADD CONSTRAINT pk_orders PRIMARY KEY (id);

-- Add foreign key
ALTER TABLE orders
ADD CONSTRAINT fk_orders_customer
FOREIGN KEY (customer_id) REFERENCES customers(id);

-- Add check constraint
ALTER TABLE orders
ADD CONSTRAINT chk_amount_positive CHECK (amount > 0);`,
      expectedOutput: ['Primary key added', 'Foreign key added', 'Check constraint added'],
      hints: [
        'Use ALTER TABLE to modify existing tables',
        'ADD CONSTRAINT adds a new constraint',
        'Syntax: ALTER TABLE table ADD CONSTRAINT name TYPE (details)',
        'Foreign key needs REFERENCES table(column)'
      ]
    }
  ],
  quiz: [
    {
      question: 'What is the main difference between PRIMARY KEY and UNIQUE constraints?',
      options: [
        'PRIMARY KEY allows NULL, UNIQUE does not',
        'PRIMARY KEY does not allow NULL, and only one per table',
        'There is no difference',
        'UNIQUE is faster than PRIMARY KEY'
      ],
      correctIndex: 1,
      explanation: 'PRIMARY KEY enforces uniqueness AND does not allow NULL values, and there can only be one per table. UNIQUE also enforces uniqueness but typically allows one NULL value, and you can have multiple UNIQUE constraints per table.'
    },
    {
      question: 'What does ON DELETE CASCADE do on a foreign key?',
      options: [
        'Prevents deletion of the referenced row',
        'Automatically deletes related rows when the referenced row is deleted',
        'Sets the foreign key to NULL when the referenced row is deleted',
        'Logs the deletion to a cascade table'
      ],
      correctIndex: 1,
      explanation: 'ON DELETE CASCADE automatically deletes all rows that reference the deleted row. If you delete a customer, all orders with that customer_id are also deleted.'
    },
    {
      question: 'Which constraint would you use to ensure a column only contains specific values?',
      options: [
        'UNIQUE',
        'NOT NULL',
        'CHECK',
        'DEFAULT'
      ],
      correctIndex: 2,
      explanation: 'CHECK constraints validate that values meet a condition. You can use CHECK with IN to restrict to specific values: CHECK (status IN (\'active\', \'inactive\')).'
    },
    {
      question: 'What happens when you insert a row without specifying a column that has a DEFAULT constraint?',
      options: [
        'The insert fails',
        'The column is set to NULL',
        'The column is set to the default value',
        'The entire row is duplicated'
      ],
      correctIndex: 2,
      explanation: 'When a column with a DEFAULT constraint is not specified in an INSERT, the default value is used. However, if you explicitly set the value to NULL, the default is not used.'
    }
  ],
  buildNote: {
    title: 'Constraints in Application Design',
    explanation: `Constraints are your last line of defense for data integrity. In this learning app, the progress table would have constraints like: FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE (delete progress when user deleted), FOREIGN KEY (lesson_id) REFERENCES lessons(id) (ensure valid lessons), and CHECK (completed_at IS NULL OR completed_at >= started_at) (completion can't be before start). Even if application code has bugs, constraints prevent impossible states from being stored.`,
    relatedFiles: [
      'src/types/lesson.ts',
      'src/lib/progress.ts'
    ],
    inTheRealWorld: `Production databases rely heavily on constraints. Banking systems use constraints to prevent negative balances. E-commerce platforms use foreign keys to ensure orders reference valid products and customers. Healthcare systems use CHECK constraints to validate data ranges. ORMs like Prisma generate constraints from schema definitions. Migration tools track constraint changes. Foreign key constraints with proper CASCADE actions simplify cleanup when deleting records. Named constraints make debugging and schema migrations much easier.`
  }
};
