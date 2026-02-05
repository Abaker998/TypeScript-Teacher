import { Lesson } from '@/types/lesson';

export const advancedPatterns: Lesson = {
  slug: 'sql-advanced-patterns',
  title: 'Advanced SQL Patterns',
  description: 'Master temporal tables, soft deletes, audit trails, hierarchical data, and JSON in SQL.',
  difficulty: 'advanced',
  order: 27,
  content: `
# Advanced SQL Patterns

This lesson covers sophisticated patterns for handling common enterprise requirements: temporal data, soft deletes, audit logging, hierarchical structures, and semi-structured JSON data.

## Temporal Tables

Temporal tables automatically track the history of data changes. SQL Server 2016+ has built-in support, and other databases can implement similar patterns.

### SQL Server System-Versioned Tables

\`\`\`sql
-- Create temporal table
CREATE TABLE employees (
  employee_id INT PRIMARY KEY,
  name NVARCHAR(100),
  department NVARCHAR(50),
  salary DECIMAL(10,2),

  -- System versioning columns
  valid_from DATETIME2 GENERATED ALWAYS AS ROW START,
  valid_to DATETIME2 GENERATED ALWAYS AS ROW END,

  PERIOD FOR SYSTEM_TIME (valid_from, valid_to)
)
WITH (SYSTEM_VERSIONING = ON (HISTORY_TABLE = dbo.employees_history));

-- Updates automatically tracked
UPDATE employees SET salary = 75000 WHERE employee_id = 1;

-- Query current data
SELECT * FROM employees;

-- Query data at a specific point in time
SELECT * FROM employees
FOR SYSTEM_TIME AS OF '2024-01-15 10:00:00';

-- Query all historical versions
SELECT * FROM employees
FOR SYSTEM_TIME ALL
WHERE employee_id = 1
ORDER BY valid_from;

-- Query changes in a time range
SELECT * FROM employees
FOR SYSTEM_TIME BETWEEN '2024-01-01' AND '2024-06-30'
WHERE employee_id = 1;
\`\`\`

### Manual Temporal Pattern (Any Database)

\`\`\`sql
-- Current state table
CREATE TABLE products (
  product_id INT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- History table
CREATE TABLE products_history (
  history_id SERIAL PRIMARY KEY,
  product_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  valid_from TIMESTAMP NOT NULL,
  valid_to TIMESTAMP NOT NULL,
  operation CHAR(1) NOT NULL  -- 'I', 'U', 'D'
);

-- Trigger to capture changes (PostgreSQL)
CREATE OR REPLACE FUNCTION log_product_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    INSERT INTO products_history (product_id, name, price, valid_from, valid_to, operation)
    VALUES (OLD.product_id, OLD.name, OLD.price, OLD.updated_at, CURRENT_TIMESTAMP, 'U');
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO products_history (product_id, name, price, valid_from, valid_to, operation)
    VALUES (OLD.product_id, OLD.name, OLD.price, OLD.updated_at, CURRENT_TIMESTAMP, 'D');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER product_history_trigger
AFTER UPDATE OR DELETE ON products
FOR EACH ROW EXECUTE FUNCTION log_product_changes();
\`\`\`

## Soft Deletes

Soft delete marks records as deleted without physically removing them:

\`\`\`sql
-- Basic soft delete
CREATE TABLE customers (
  customer_id INT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE,
  is_deleted BOOLEAN DEFAULT FALSE,
  deleted_at TIMESTAMP NULL,
  deleted_by INT NULL
);

-- "Delete" a customer
UPDATE customers
SET is_deleted = TRUE,
    deleted_at = CURRENT_TIMESTAMP,
    deleted_by = @current_user_id
WHERE customer_id = 123;

-- View to hide deleted records
CREATE VIEW active_customers AS
SELECT customer_id, name, email
FROM customers
WHERE is_deleted = FALSE;

-- All queries use the view
SELECT * FROM active_customers;
\`\`\`

### Soft Delete with Unique Constraints

\`\`\`sql
-- Problem: Unique constraint on email prevents reuse after soft delete
-- Solution 1: Include is_deleted in unique constraint
CREATE UNIQUE INDEX idx_customers_email_active
ON customers(email)
WHERE is_deleted = FALSE;

-- Solution 2: Set email to NULL on soft delete
UPDATE customers
SET is_deleted = TRUE,
    email = NULL,  -- Or append _deleted_123
    deleted_at = CURRENT_TIMESTAMP
WHERE customer_id = 123;

-- Solution 3: Use deleted_at in unique (PostgreSQL partial index)
CREATE UNIQUE INDEX idx_customers_email_unique
ON customers(email)
WHERE deleted_at IS NULL;
\`\`\`

### Cascading Soft Deletes

\`\`\`sql
-- Soft delete parent and children
CREATE OR REPLACE FUNCTION soft_delete_customer(p_customer_id INT, p_user_id INT)
RETURNS VOID AS $$
BEGIN
  -- Soft delete orders
  UPDATE orders
  SET is_deleted = TRUE,
      deleted_at = CURRENT_TIMESTAMP,
      deleted_by = p_user_id
  WHERE customer_id = p_customer_id
    AND is_deleted = FALSE;

  -- Soft delete customer
  UPDATE customers
  SET is_deleted = TRUE,
      deleted_at = CURRENT_TIMESTAMP,
      deleted_by = p_user_id
  WHERE customer_id = p_customer_id;
END;
$$ LANGUAGE plpgsql;

-- Restore with cascade
CREATE OR REPLACE FUNCTION restore_customer(p_customer_id INT)
RETURNS VOID AS $$
BEGIN
  UPDATE customers
  SET is_deleted = FALSE, deleted_at = NULL, deleted_by = NULL
  WHERE customer_id = p_customer_id;

  -- Optionally restore orders deleted at same time
  UPDATE orders
  SET is_deleted = FALSE, deleted_at = NULL, deleted_by = NULL
  WHERE customer_id = p_customer_id
    AND deleted_at = (SELECT deleted_at FROM customers WHERE customer_id = p_customer_id);
END;
$$ LANGUAGE plpgsql;
\`\`\`

## Audit Trails

Comprehensive change tracking for compliance and debugging:

\`\`\`sql
-- Audit log table
CREATE TABLE audit_log (
  audit_id BIGSERIAL PRIMARY KEY,
  table_name VARCHAR(100) NOT NULL,
  record_id VARCHAR(100) NOT NULL,  -- String to handle any PK type
  operation VARCHAR(10) NOT NULL,   -- INSERT, UPDATE, DELETE
  old_values JSONB,
  new_values JSONB,
  changed_fields TEXT[],
  user_id INT,
  user_ip VARCHAR(45),
  user_agent TEXT,
  session_id VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_table_record ON audit_log(table_name, record_id);
CREATE INDEX idx_audit_created ON audit_log(created_at);
CREATE INDEX idx_audit_user ON audit_log(user_id);

-- Generic audit trigger (PostgreSQL)
CREATE OR REPLACE FUNCTION audit_trigger_func()
RETURNS TRIGGER AS $$
DECLARE
  old_data JSONB;
  new_data JSONB;
  changed TEXT[];
  key TEXT;
BEGIN
  IF TG_OP = 'INSERT' THEN
    new_data = to_jsonb(NEW);
    INSERT INTO audit_log (table_name, record_id, operation, new_values)
    VALUES (TG_TABLE_NAME, NEW.id::TEXT, 'INSERT', new_data);

  ELSIF TG_OP = 'UPDATE' THEN
    old_data = to_jsonb(OLD);
    new_data = to_jsonb(NEW);

    -- Find changed fields
    FOR key IN SELECT jsonb_object_keys(old_data)
    LOOP
      IF old_data->key IS DISTINCT FROM new_data->key THEN
        changed = array_append(changed, key);
      END IF;
    END LOOP;

    IF array_length(changed, 1) > 0 THEN
      INSERT INTO audit_log (table_name, record_id, operation, old_values, new_values, changed_fields)
      VALUES (TG_TABLE_NAME, NEW.id::TEXT, 'UPDATE', old_data, new_data, changed);
    END IF;

  ELSIF TG_OP = 'DELETE' THEN
    old_data = to_jsonb(OLD);
    INSERT INTO audit_log (table_name, record_id, operation, old_values)
    VALUES (TG_TABLE_NAME, OLD.id::TEXT, 'DELETE', old_data);
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Apply to tables
CREATE TRIGGER audit_customers
AFTER INSERT OR UPDATE OR DELETE ON customers
FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();

-- Query audit trail
SELECT * FROM audit_log
WHERE table_name = 'customers' AND record_id = '123'
ORDER BY created_at DESC;
\`\`\`

## Hierarchical Data

Several patterns for tree structures in relational databases:

### Adjacency List (Simple Parent Reference)

\`\`\`sql
CREATE TABLE categories (
  category_id INT PRIMARY KEY,
  name VARCHAR(100),
  parent_id INT REFERENCES categories(category_id)
);

-- Get immediate children
SELECT * FROM categories WHERE parent_id = 5;

-- Get all descendants with recursive CTE
WITH RECURSIVE category_tree AS (
  SELECT category_id, name, parent_id, 0 AS level
  FROM categories
  WHERE category_id = 1  -- Root

  UNION ALL

  SELECT c.category_id, c.name, c.parent_id, ct.level + 1
  FROM categories c
  JOIN category_tree ct ON c.parent_id = ct.category_id
)
SELECT * FROM category_tree;
\`\`\`

### Materialized Path

\`\`\`sql
CREATE TABLE categories_path (
  category_id INT PRIMARY KEY,
  name VARCHAR(100),
  path VARCHAR(500)  -- '/1/5/12/45'
);

-- Get all descendants
SELECT * FROM categories_path
WHERE path LIKE '/1/5/%';

-- Get ancestors
SELECT * FROM categories_path
WHERE '/1/5/12/45' LIKE path || '%';

-- Get depth
SELECT *, (LENGTH(path) - LENGTH(REPLACE(path, '/', ''))) AS depth
FROM categories_path;
\`\`\`

### Nested Sets

\`\`\`sql
CREATE TABLE categories_nested (
  category_id INT PRIMARY KEY,
  name VARCHAR(100),
  lft INT NOT NULL,
  rgt INT NOT NULL
);

CREATE INDEX idx_categories_lft ON categories_nested(lft);
CREATE INDEX idx_categories_rgt ON categories_nested(rgt);

-- Get all descendants (very fast!)
SELECT * FROM categories_nested
WHERE lft > 5 AND rgt < 20;

-- Get ancestors
SELECT * FROM categories_nested
WHERE lft < 5 AND rgt > 5
ORDER BY lft;

-- Get immediate children
SELECT c.*
FROM categories_nested c
WHERE NOT EXISTS (
  SELECT 1 FROM categories_nested c2
  WHERE c2.lft > c.lft AND c2.rgt < c.rgt
  AND c2.lft < @parent_lft AND c2.rgt > @parent_rgt
);

-- Count descendants
SELECT (rgt - lft - 1) / 2 AS descendant_count
FROM categories_nested
WHERE category_id = 5;
\`\`\`

### Closure Table

\`\`\`sql
CREATE TABLE categories (
  category_id INT PRIMARY KEY,
  name VARCHAR(100)
);

CREATE TABLE category_paths (
  ancestor_id INT,
  descendant_id INT,
  depth INT,
  PRIMARY KEY (ancestor_id, descendant_id),
  FOREIGN KEY (ancestor_id) REFERENCES categories(category_id),
  FOREIGN KEY (descendant_id) REFERENCES categories(category_id)
);

-- Every node is its own ancestor at depth 0
-- Parent-child relationship has depth 1
-- Grandparent-grandchild has depth 2, etc.

-- Get all descendants
SELECT c.* FROM categories c
JOIN category_paths cp ON c.category_id = cp.descendant_id
WHERE cp.ancestor_id = 5 AND cp.depth > 0;

-- Get all ancestors
SELECT c.* FROM categories c
JOIN category_paths cp ON c.category_id = cp.ancestor_id
WHERE cp.descendant_id = 45 AND cp.depth > 0
ORDER BY cp.depth DESC;

-- Get immediate children
SELECT c.* FROM categories c
JOIN category_paths cp ON c.category_id = cp.descendant_id
WHERE cp.ancestor_id = 5 AND cp.depth = 1;
\`\`\`

## JSON in SQL

Modern databases support JSON as a data type:

### PostgreSQL JSON/JSONB

\`\`\`sql
CREATE TABLE products (
  product_id INT PRIMARY KEY,
  name VARCHAR(100),
  attributes JSONB  -- Binary JSON, faster queries
);

-- Insert JSON data
INSERT INTO products (product_id, name, attributes)
VALUES (1, 'Laptop', '{
  "brand": "TechCorp",
  "specs": {
    "cpu": "Intel i7",
    "ram": 16,
    "storage": "512GB SSD"
  },
  "colors": ["silver", "black"],
  "features": ["backlit keyboard", "fingerprint reader"]
}');

-- Query JSON fields
SELECT
  name,
  attributes->>'brand' AS brand,
  attributes->'specs'->>'cpu' AS cpu,
  (attributes->'specs'->>'ram')::INT AS ram_gb
FROM products;

-- Filter by JSON values
SELECT * FROM products
WHERE attributes->>'brand' = 'TechCorp';

SELECT * FROM products
WHERE (attributes->'specs'->>'ram')::INT >= 16;

-- Check if array contains value
SELECT * FROM products
WHERE attributes->'colors' ? 'silver';

-- Update JSON field
UPDATE products
SET attributes = jsonb_set(attributes, '{specs,ram}', '32')
WHERE product_id = 1;

-- Add to JSON array
UPDATE products
SET attributes = jsonb_insert(
  attributes,
  '{features, -1}',  -- -1 means append
  '"touchscreen"'
)
WHERE product_id = 1;

-- Index JSON fields
CREATE INDEX idx_products_brand ON products ((attributes->>'brand'));
CREATE INDEX idx_products_attrs ON products USING GIN (attributes);
\`\`\`

### SQL Server JSON

\`\`\`sql
CREATE TABLE products (
  product_id INT PRIMARY KEY,
  name NVARCHAR(100),
  attributes NVARCHAR(MAX)  -- JSON stored as string
);

-- Query JSON with JSON_VALUE (scalar) and JSON_QUERY (object/array)
SELECT
  name,
  JSON_VALUE(attributes, '$.brand') AS brand,
  JSON_VALUE(attributes, '$.specs.cpu') AS cpu,
  JSON_QUERY(attributes, '$.colors') AS colors
FROM products;

-- Filter
SELECT * FROM products
WHERE JSON_VALUE(attributes, '$.brand') = 'TechCorp';

-- Modify JSON
UPDATE products
SET attributes = JSON_MODIFY(attributes, '$.specs.ram', 32)
WHERE product_id = 1;

-- Parse JSON array
SELECT
  p.name,
  c.value AS color
FROM products p
CROSS APPLY OPENJSON(p.attributes, '$.colors') c;
\`\`\`

### MySQL JSON

\`\`\`sql
CREATE TABLE products (
  product_id INT PRIMARY KEY,
  name VARCHAR(100),
  attributes JSON
);

-- Query JSON
SELECT
  name,
  JSON_EXTRACT(attributes, '$.brand') AS brand,
  attributes->>'$.specs.cpu' AS cpu,
  JSON_EXTRACT(attributes, '$.colors') AS colors
FROM products;

-- Filter
SELECT * FROM products
WHERE JSON_EXTRACT(attributes, '$.brand') = 'TechCorp';

-- Check array contains
SELECT * FROM products
WHERE JSON_CONTAINS(attributes, '"silver"', '$.colors');

-- Update
UPDATE products
SET attributes = JSON_SET(attributes, '$.specs.ram', 32)
WHERE product_id = 1;

-- Index virtual column
ALTER TABLE products
ADD COLUMN brand VARCHAR(100)
  GENERATED ALWAYS AS (attributes->>'$.brand') VIRTUAL;
CREATE INDEX idx_brand ON products(brand);
\`\`\`

## Learning Objectives

By the end of this lesson, you'll be able to:
- Implement temporal tables for historical tracking
- Design soft delete patterns with proper constraints
- Create comprehensive audit logging systems
- Choose and implement hierarchical data patterns
- Work with JSON data in SQL databases
`,
  exercises: [
    {
      id: 1,
      title: 'Exercise 1: Soft Delete Implementation',
      description: `Implement a complete soft delete system for a users table.

**Your task:**
Create the table, view, and soft delete procedure with proper handling of unique constraints.`,
      starterCode: `-- Create users table with soft delete support


-- Create view for active users


-- Create soft delete procedure


-- Create restore procedure

`,
      solution: `-- Create users table with soft delete support
CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  username VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT FALSE,
  deleted_at TIMESTAMP,
  deleted_by INT
);

-- Partial unique indexes for active records only
CREATE UNIQUE INDEX idx_users_email_active ON users(email) WHERE is_deleted = FALSE;
CREATE UNIQUE INDEX idx_users_username_active ON users(username) WHERE is_deleted = FALSE;

-- Create view for active users
CREATE VIEW active_users AS
SELECT user_id, email, username, created_at
FROM users
WHERE is_deleted = FALSE;

-- Create soft delete procedure
CREATE OR REPLACE FUNCTION soft_delete_user(
  p_user_id INT,
  p_deleted_by INT
) RETURNS BOOLEAN AS $$
BEGIN
  UPDATE users
  SET is_deleted = TRUE,
      deleted_at = CURRENT_TIMESTAMP,
      deleted_by = p_deleted_by
  WHERE user_id = p_user_id
    AND is_deleted = FALSE;

  RETURN FOUND;  -- Returns true if row was updated
END;
$$ LANGUAGE plpgsql;

-- Create restore procedure
CREATE OR REPLACE FUNCTION restore_user(p_user_id INT) RETURNS BOOLEAN AS $$
DECLARE
  v_email VARCHAR(255);
  v_username VARCHAR(100);
BEGIN
  -- Get user info
  SELECT email, username INTO v_email, v_username
  FROM users WHERE user_id = p_user_id;

  -- Check if email/username are in use by active user
  IF EXISTS (SELECT 1 FROM users WHERE email = v_email AND is_deleted = FALSE) THEN
    RAISE EXCEPTION 'Email % is in use', v_email;
  END IF;

  IF EXISTS (SELECT 1 FROM users WHERE username = v_username AND is_deleted = FALSE) THEN
    RAISE EXCEPTION 'Username % is in use', v_username;
  END IF;

  -- Restore
  UPDATE users
  SET is_deleted = FALSE, deleted_at = NULL, deleted_by = NULL
  WHERE user_id = p_user_id;

  RETURN FOUND;
END;
$$ LANGUAGE plpgsql;`,
      expectedOutput: ['Partial unique indexes for active records', 'View hides deleted records', 'Restore checks for conflicts'],
      hints: [
        'Use partial index: WHERE is_deleted = FALSE',
        'The view filters by is_deleted = FALSE',
        'Restore must check unique constraints before restoring'
      ],
    },
    {
      id: 2,
      title: 'Exercise 2: Audit Trigger',
      description: `Create a generic audit trigger that logs all changes to any table.

**Your task:**
Create the audit_log table and a reusable trigger function.`,
      starterCode: `-- Create audit_log table


-- Create generic audit trigger function


-- Example: Apply to orders table

`,
      solution: `-- Create audit_log table
CREATE TABLE audit_log (
  audit_id BIGSERIAL PRIMARY KEY,
  table_name VARCHAR(100) NOT NULL,
  record_id TEXT NOT NULL,
  operation VARCHAR(10) NOT NULL,
  old_values JSONB,
  new_values JSONB,
  changed_by INT,
  changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  client_ip INET
);

CREATE INDEX idx_audit_table_record ON audit_log(table_name, record_id);
CREATE INDEX idx_audit_changed_at ON audit_log(changed_at);

-- Create generic audit trigger function
CREATE OR REPLACE FUNCTION generic_audit_trigger()
RETURNS TRIGGER AS $$
DECLARE
  record_pk TEXT;
  old_json JSONB := NULL;
  new_json JSONB := NULL;
BEGIN
  -- Try to get ID from common column names
  IF TG_OP = 'DELETE' THEN
    record_pk := COALESCE(
      OLD.id::TEXT,
      (to_jsonb(OLD)->TG_ARGV[0])::TEXT,
      'unknown'
    );
    old_json := to_jsonb(OLD);
  ELSE
    record_pk := COALESCE(
      NEW.id::TEXT,
      (to_jsonb(NEW)->TG_ARGV[0])::TEXT,
      'unknown'
    );
    IF TG_OP = 'UPDATE' THEN
      old_json := to_jsonb(OLD);
    END IF;
    new_json := to_jsonb(NEW);
  END IF;

  INSERT INTO audit_log (table_name, record_id, operation, old_values, new_values)
  VALUES (TG_TABLE_NAME, record_pk, TG_OP, old_json, new_json);

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Apply to orders table
CREATE TRIGGER audit_orders
AFTER INSERT OR UPDATE OR DELETE ON orders
FOR EACH ROW
EXECUTE FUNCTION generic_audit_trigger('order_id');

-- Query audit history for a record
-- SELECT * FROM audit_log
-- WHERE table_name = 'orders' AND record_id = '123'
-- ORDER BY changed_at DESC;`,
      expectedOutput: ['Generic trigger works on any table', 'Stores old and new values as JSON', 'Passes PK column name as argument'],
      hints: [
        'Use TG_TABLE_NAME for the table being modified',
        'TG_OP contains INSERT, UPDATE, or DELETE',
        'to_jsonb() converts a row to JSON'
      ],
    },
    {
      id: 3,
      title: 'Exercise 3: Hierarchical Query',
      description: `Query a category tree using the adjacency list model with recursive CTE.

**Your task:**
Write queries to find all descendants, ancestors, and tree depth.`,
      starterCode: `-- Table: categories(category_id, name, parent_id)
-- parent_id references category_id, NULL for root

-- Query 1: Get all descendants of category 5 with their level


-- Query 2: Get all ancestors of category 45 (path to root)


-- Query 3: Get the full tree with indented names

`,
      solution: `-- Table: categories(category_id, name, parent_id)

-- Query 1: Get all descendants of category 5 with their level
WITH RECURSIVE descendants AS (
  -- Anchor: Start with the category itself
  SELECT category_id, name, parent_id, 0 AS level
  FROM categories
  WHERE category_id = 5

  UNION ALL

  -- Recursive: Find children
  SELECT c.category_id, c.name, c.parent_id, d.level + 1
  FROM categories c
  JOIN descendants d ON c.parent_id = d.category_id
)
SELECT * FROM descendants
WHERE level > 0  -- Exclude starting node
ORDER BY level, name;

-- Query 2: Get all ancestors of category 45 (path to root)
WITH RECURSIVE ancestors AS (
  -- Anchor: Start with the category
  SELECT category_id, name, parent_id, 0 AS level
  FROM categories
  WHERE category_id = 45

  UNION ALL

  -- Recursive: Find parent
  SELECT c.category_id, c.name, c.parent_id, a.level + 1
  FROM categories c
  JOIN ancestors a ON c.category_id = a.parent_id
)
SELECT * FROM ancestors
ORDER BY level DESC;  -- Root first

-- Query 3: Get the full tree with indented names
WITH RECURSIVE tree AS (
  SELECT
    category_id,
    name,
    parent_id,
    0 AS level,
    name AS path
  FROM categories
  WHERE parent_id IS NULL  -- Start from root(s)

  UNION ALL

  SELECT
    c.category_id,
    c.name,
    c.parent_id,
    t.level + 1,
    t.path || ' > ' || c.name
  FROM categories c
  JOIN tree t ON c.parent_id = t.category_id
)
SELECT
  REPEAT('  ', level) || name AS indented_name,
  level,
  path
FROM tree
ORDER BY path;`,
      expectedOutput: ['Descendants: recursive from parent to children', 'Ancestors: recursive from child to parent', 'Full tree: start from NULL parent_id'],
      hints: [
        'Anchor query selects the starting point',
        'For descendants: c.parent_id = cte.category_id',
        'For ancestors: c.category_id = cte.parent_id'
      ],
    },
    {
      id: 4,
      title: 'Exercise 4: JSON Operations',
      description: `Work with JSON data to store and query product specifications.

**Your task:**
Write queries to extract, filter, and update JSON data.`,
      starterCode: `-- Table: products(product_id, name, specs JSONB)
-- specs contains: {"brand": "...", "features": [...], "dimensions": {"width": N, "height": N}}

-- Query 1: Extract brand and first feature


-- Query 2: Find products with width > 100


-- Query 3: Add a new feature "wireless" to product 1


-- Query 4: Find products that have "bluetooth" in features array

`,
      solution: `-- Table: products(product_id, name, specs JSONB)

-- Query 1: Extract brand and first feature
SELECT
  product_id,
  name,
  specs->>'brand' AS brand,
  specs->'features'->>0 AS first_feature,
  specs->'dimensions'->>'width' AS width
FROM products;

-- Query 2: Find products with width > 100
SELECT *
FROM products
WHERE (specs->'dimensions'->>'width')::INT > 100;

-- Or using jsonb path operators (PostgreSQL 12+)
SELECT *
FROM products
WHERE (specs #>> '{dimensions,width}')::INT > 100;

-- Query 3: Add a new feature "wireless" to product 1
UPDATE products
SET specs = jsonb_set(
  specs,
  '{features}',
  (specs->'features') || '"wireless"'
)
WHERE product_id = 1;

-- Alternative: Insert at specific position
UPDATE products
SET specs = jsonb_insert(
  specs,
  '{features, 0}',  -- Insert at beginning
  '"wireless"',
  false  -- Insert before, not after
)
WHERE product_id = 1;

-- Query 4: Find products that have "bluetooth" in features array
SELECT *
FROM products
WHERE specs->'features' ? 'bluetooth';

-- Or using @> containment operator
SELECT *
FROM products
WHERE specs @> '{"features": ["bluetooth"]}';`,
      expectedOutput: ['"->>" extracts as text', '"->" extracts as JSON', 'jsonb_set updates nested values', '"?" checks array containment'],
      hints: [
        '"->>" returns text, "->" returns JSON',
        'Cast to INT for numeric comparisons',
        'The ? operator checks if key/value exists in array or object'
      ],
    },
  ],
  quiz: [
    {
      question: 'What is the main advantage of using JSONB over JSON in PostgreSQL?',
      options: [
        'JSONB supports more JSON features',
        'JSONB stores data in binary format, enabling indexing and faster queries',
        'JSONB is more compatible with JavaScript',
        'JSON is deprecated in favor of JSONB'
      ],
      correctIndex: 1,
      explanation: 'JSONB stores JSON in a decomposed binary format, which is slightly slower to input but significantly faster for processing. It also supports indexing (GIN indexes) and removes duplicate keys.'
    },
    {
      question: 'In the Nested Sets hierarchical model, how do you count descendants of a node?',
      options: [
        'COUNT all records in the table',
        'Use a recursive CTE',
        'Calculate (rgt - lft - 1) / 2',
        'Count records where parent_id equals the node id'
      ],
      correctIndex: 2,
      explanation: 'In Nested Sets, the difference between right (rgt) and left (lft) values encodes the number of descendants. The formula (rgt - lft - 1) / 2 gives the exact count without any additional queries.'
    },
    {
      question: 'What is the main challenge with soft deletes and unique constraints?',
      options: [
        'Soft deletes cannot have unique constraints',
        'Deleted records still occupy unique values, preventing reuse',
        'Unique constraints slow down soft deletes',
        'There is no challenge - they work together perfectly'
      ],
      correctIndex: 1,
      explanation: 'When a record is soft-deleted, it still exists in the table. A standard unique constraint on email would prevent creating a new user with a deleted user\'s email. Solutions include partial indexes that only apply to non-deleted records.'
    },
    {
      question: 'What is the purpose of the Closure Table pattern for hierarchical data?',
      options: [
        'To store data more efficiently than adjacency list',
        'To store all ancestor-descendant paths explicitly for fast hierarchy queries',
        'To prevent circular references in the hierarchy',
        'To automatically delete child nodes when parents are deleted'
      ],
      correctIndex: 1,
      explanation: 'Closure Table stores every ancestor-descendant relationship explicitly with the depth. This makes all hierarchy queries (descendants, ancestors, subtrees) simple JOINs without recursion, at the cost of more storage and insert complexity.'
    }
  ],
  buildNote: {
    title: 'Advanced Patterns in Real Applications',
    explanation: `These advanced patterns appear throughout production applications. A learning platform might use soft deletes for user accounts (to comply with data retention laws while allowing reactivation), audit trails for tracking content changes, hierarchical patterns for lesson prerequisites or skill trees, and JSON for flexible lesson metadata that varies by type. Understanding these patterns helps you build robust, compliant, and maintainable systems.`,
    relatedFiles: [
      'src/types/lesson.ts',
      'src/lessons/index.ts'
    ],
    inTheRealWorld: `Enterprise applications heavily rely on these patterns. Financial systems require audit trails for regulatory compliance. E-commerce platforms use soft deletes for order preservation. Content management systems use hierarchical data for categories and pages. IoT and analytics systems use JSON for flexible schemas that evolve rapidly. Temporal tables are essential in finance, healthcare, and any domain where historical data matters.`
  }
};
