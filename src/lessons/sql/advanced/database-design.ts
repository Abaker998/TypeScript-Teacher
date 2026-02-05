import { Lesson } from '@/types/lesson';

export const databaseDesign: Lesson = {
  slug: 'sql-database-design',
  title: 'Database Design',
  description: 'Master normalization, denormalization, entity relationships, and schema design patterns.',
  difficulty: 'advanced',
  order: 26,
  content: `
# Database Design

Good database design is the foundation of performant, maintainable applications. Understanding normalization, relationships, and design patterns helps you create schemas that balance data integrity, query performance, and scalability.

## Normalization Fundamentals

Normalization is the process of organizing data to reduce redundancy and improve data integrity. Each "normal form" builds on the previous one.

### First Normal Form (1NF)

Requirements:
- Each column contains atomic (indivisible) values
- No repeating groups or arrays
- Each row is unique (has a primary key)

\`\`\`sql
-- VIOLATES 1NF: Multiple values in one column
CREATE TABLE orders_bad (
  order_id INT PRIMARY KEY,
  customer_name VARCHAR(100),
  products VARCHAR(500)  -- "Widget, Gadget, Tool"
);

-- 1NF: Atomic values, separate rows
CREATE TABLE orders_1nf (
  order_id INT,
  customer_name VARCHAR(100),
  product VARCHAR(100),
  PRIMARY KEY (order_id, product)
);

-- VIOLATES 1NF: Repeating groups
CREATE TABLE orders_bad2 (
  order_id INT PRIMARY KEY,
  product1 VARCHAR(100),
  qty1 INT,
  product2 VARCHAR(100),
  qty2 INT,
  product3 VARCHAR(100),
  qty3 INT
);

-- 1NF: No repeating groups
CREATE TABLE order_items_1nf (
  order_id INT,
  line_number INT,
  product VARCHAR(100),
  quantity INT,
  PRIMARY KEY (order_id, line_number)
);
\`\`\`

### Second Normal Form (2NF)

Requirements:
- Must be in 1NF
- No partial dependencies (non-key columns depend on the ENTIRE primary key)

\`\`\`sql
-- VIOLATES 2NF: product_name depends only on product_id, not full key
CREATE TABLE order_items_bad (
  order_id INT,
  product_id INT,
  product_name VARCHAR(100),  -- Depends only on product_id
  quantity INT,
  PRIMARY KEY (order_id, product_id)
);

-- 2NF: Separate tables for separate entities
CREATE TABLE products_2nf (
  product_id INT PRIMARY KEY,
  product_name VARCHAR(100)
);

CREATE TABLE order_items_2nf (
  order_id INT,
  product_id INT,
  quantity INT,
  PRIMARY KEY (order_id, product_id),
  FOREIGN KEY (product_id) REFERENCES products_2nf(product_id)
);
\`\`\`

### Third Normal Form (3NF)

Requirements:
- Must be in 2NF
- No transitive dependencies (non-key columns don't depend on other non-key columns)

\`\`\`sql
-- VIOLATES 3NF: city and state depend on zip_code, not customer_id
CREATE TABLE customers_bad (
  customer_id INT PRIMARY KEY,
  name VARCHAR(100),
  zip_code VARCHAR(10),
  city VARCHAR(100),      -- Depends on zip_code
  state VARCHAR(2)        -- Depends on zip_code
);

-- 3NF: Separate table for zip code details
CREATE TABLE zip_codes_3nf (
  zip_code VARCHAR(10) PRIMARY KEY,
  city VARCHAR(100),
  state VARCHAR(2)
);

CREATE TABLE customers_3nf (
  customer_id INT PRIMARY KEY,
  name VARCHAR(100),
  zip_code VARCHAR(10),
  FOREIGN KEY (zip_code) REFERENCES zip_codes_3nf(zip_code)
);
\`\`\`

### Beyond 3NF: BCNF and Higher

\`\`\`sql
-- Boyce-Codd Normal Form (BCNF)
-- Every determinant must be a candidate key

-- 4NF eliminates multi-valued dependencies
-- 5NF eliminates join dependencies

-- In practice, 3NF is sufficient for most applications
-- Higher normal forms are used in specific scenarios
\`\`\`

## When to Denormalize

Denormalization intentionally introduces redundancy for performance:

\`\`\`sql
-- Normalized (3NF): Requires JOIN for every order display
SELECT o.order_id, c.name, c.email
FROM orders o
JOIN customers c ON o.customer_id = c.customer_id;

-- Denormalized: Customer name copied to orders for fast retrieval
CREATE TABLE orders_denorm (
  order_id INT PRIMARY KEY,
  customer_id INT,
  customer_name VARCHAR(100),  -- Denormalized!
  order_date DATE,
  total DECIMAL(10,2)
);

-- Trade-off:
-- PRO: Faster reads (no JOIN needed)
-- CON: Update anomaly (if customer name changes, must update all orders)
-- CON: Storage redundancy
\`\`\`

### Common Denormalization Patterns

\`\`\`sql
-- 1. Calculated/Aggregated columns
CREATE TABLE orders (
  order_id INT PRIMARY KEY,
  item_count INT,        -- Could be calculated from order_items
  total_amount DECIMAL   -- Could be calculated from order_items
);

-- 2. Copied reference data
CREATE TABLE invoices (
  invoice_id INT PRIMARY KEY,
  customer_id INT,
  customer_name VARCHAR(100),      -- Copied from customers
  customer_address VARCHAR(500),   -- Copied from customers
  -- Address at time of invoice matters for legal/historical reasons
  FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

-- 3. Materialized aggregates
CREATE TABLE product_stats (
  product_id INT PRIMARY KEY,
  total_sold INT,
  avg_rating DECIMAL(3,2),
  review_count INT,
  last_sold_date DATE
);

-- Updated by trigger or scheduled job
\`\`\`

## Entity Relationships

### One-to-Many (1:N)

The most common relationship type:

\`\`\`sql
-- One customer has many orders
CREATE TABLE customers (
  customer_id INT PRIMARY KEY,
  name VARCHAR(100)
);

CREATE TABLE orders (
  order_id INT PRIMARY KEY,
  customer_id INT NOT NULL,
  order_date DATE,
  FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

-- The "many" side holds the foreign key
\`\`\`

### Many-to-Many (M:N)

Requires a junction (bridge/linking) table:

\`\`\`sql
-- Students can enroll in many courses
-- Courses can have many students

CREATE TABLE students (
  student_id INT PRIMARY KEY,
  name VARCHAR(100)
);

CREATE TABLE courses (
  course_id INT PRIMARY KEY,
  title VARCHAR(200)
);

-- Junction table
CREATE TABLE enrollments (
  student_id INT,
  course_id INT,
  enrollment_date DATE,
  grade CHAR(1),
  PRIMARY KEY (student_id, course_id),
  FOREIGN KEY (student_id) REFERENCES students(student_id),
  FOREIGN KEY (course_id) REFERENCES courses(course_id)
);

-- Junction table can have its own attributes (grade, enrollment_date)
\`\`\`

### One-to-One (1:1)

Less common, used for:
- Optional/rarely accessed data
- Security/access control separation
- Schema inheritance patterns

\`\`\`sql
-- User account and profile (profile is optional)
CREATE TABLE users (
  user_id INT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL
);

CREATE TABLE user_profiles (
  user_id INT PRIMARY KEY,  -- PK is also FK
  bio TEXT,
  avatar_url VARCHAR(500),
  date_of_birth DATE,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Or with inline optional fields (simpler)
CREATE TABLE users_combined (
  user_id INT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  -- Optional profile fields
  bio TEXT,
  avatar_url VARCHAR(500),
  date_of_birth DATE
);
\`\`\`

### Self-Referencing Relationships

\`\`\`sql
-- Employees with managers (also employees)
CREATE TABLE employees (
  employee_id INT PRIMARY KEY,
  name VARCHAR(100),
  manager_id INT,
  FOREIGN KEY (manager_id) REFERENCES employees(employee_id)
);

-- Categories with parent categories
CREATE TABLE categories (
  category_id INT PRIMARY KEY,
  name VARCHAR(100),
  parent_category_id INT,
  FOREIGN KEY (parent_category_id) REFERENCES categories(category_id)
);
\`\`\`

## Schema Design Patterns

### Single Table Inheritance

Store different entity types in one table:

\`\`\`sql
-- All content types in one table
CREATE TABLE content (
  content_id INT PRIMARY KEY,
  content_type VARCHAR(20) NOT NULL,  -- 'article', 'video', 'podcast'
  title VARCHAR(200) NOT NULL,
  created_at TIMESTAMP,

  -- Article-specific
  body TEXT,
  word_count INT,

  -- Video-specific
  video_url VARCHAR(500),
  duration_seconds INT,

  -- Podcast-specific
  audio_url VARCHAR(500),
  transcript TEXT,

  CHECK (content_type IN ('article', 'video', 'podcast'))
);

-- PRO: Simple queries, no JOINs
-- CON: Many NULL columns, no type-specific constraints
\`\`\`

### Class Table Inheritance

Separate tables for each type with shared base:

\`\`\`sql
-- Base table
CREATE TABLE content (
  content_id INT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  created_at TIMESTAMP
);

-- Type-specific tables
CREATE TABLE articles (
  content_id INT PRIMARY KEY,
  body TEXT,
  word_count INT,
  FOREIGN KEY (content_id) REFERENCES content(content_id)
);

CREATE TABLE videos (
  content_id INT PRIMARY KEY,
  video_url VARCHAR(500),
  duration_seconds INT,
  FOREIGN KEY (content_id) REFERENCES content(content_id)
);

-- PRO: Type-specific constraints, no NULLs
-- CON: Requires JOINs, more complex inserts
\`\`\`

### Polymorphic Associations

One table references multiple parent tables:

\`\`\`sql
-- Comments can be on articles, videos, or products
CREATE TABLE comments (
  comment_id INT PRIMARY KEY,
  commentable_type VARCHAR(50),  -- 'article', 'video', 'product'
  commentable_id INT,            -- FK to that table
  content TEXT,
  created_at TIMESTAMP
);

-- No foreign key constraint possible!
-- Application must enforce referential integrity

-- Alternative: Separate comment tables
CREATE TABLE article_comments (
  comment_id INT PRIMARY KEY,
  article_id INT NOT NULL,
  content TEXT,
  FOREIGN KEY (article_id) REFERENCES articles(article_id)
);
\`\`\`

### Temporal/Versioning Patterns

\`\`\`sql
-- Current + History pattern
CREATE TABLE products (
  product_id INT PRIMARY KEY,
  name VARCHAR(100),
  price DECIMAL(10,2),
  updated_at TIMESTAMP
);

CREATE TABLE products_history (
  history_id INT PRIMARY KEY,
  product_id INT,
  name VARCHAR(100),
  price DECIMAL(10,2),
  valid_from TIMESTAMP,
  valid_to TIMESTAMP
);

-- Slowly Changing Dimension Type 2
CREATE TABLE products_scd2 (
  surrogate_id INT PRIMARY KEY,
  product_id INT,  -- Business key
  name VARCHAR(100),
  price DECIMAL(10,2),
  valid_from DATE,
  valid_to DATE,
  is_current BOOLEAN
);
\`\`\`

### EAV (Entity-Attribute-Value)

Flexible but complex pattern:

\`\`\`sql
-- Store arbitrary attributes
CREATE TABLE entities (
  entity_id INT PRIMARY KEY,
  entity_type VARCHAR(50)
);

CREATE TABLE attributes (
  attribute_id INT PRIMARY KEY,
  name VARCHAR(100),
  data_type VARCHAR(20)
);

CREATE TABLE entity_values (
  entity_id INT,
  attribute_id INT,
  value_text VARCHAR(500),
  value_number DECIMAL,
  value_date DATE,
  PRIMARY KEY (entity_id, attribute_id),
  FOREIGN KEY (entity_id) REFERENCES entities(entity_id),
  FOREIGN KEY (attribute_id) REFERENCES attributes(attribute_id)
);

-- PRO: Extremely flexible schema
-- CON: Complex queries, no type safety, hard to index
-- Consider: JSON columns in modern databases instead
\`\`\`

## Design Best Practices

\`\`\`sql
-- 1. Use meaningful names
-- Bad: tbl1, col_a, fk1
-- Good: customers, email_address, customer_id

-- 2. Consistent naming conventions
-- Choose and stick with: snake_case, camelCase, or PascalCase
-- Singular or plural table names (be consistent)

-- 3. Always have a primary key
CREATE TABLE orders (
  order_id INT PRIMARY KEY,  -- Surrogate key
  -- or
  order_number VARCHAR(20) PRIMARY KEY  -- Natural key
);

-- 4. Define foreign keys
-- Enforces referential integrity
-- Documents relationships
-- Enables CASCADE options

-- 5. Use appropriate data types
-- Don't store dates as strings
-- Use DECIMAL for money, not FLOAT
-- Use appropriate string lengths

-- 6. Add NOT NULL where appropriate
-- Columns that must have values should be NOT NULL
-- Default to NOT NULL, add NULL only when needed

-- 7. Consider future queries
-- Design for your access patterns
-- Index columns used in WHERE, JOIN, ORDER BY
\`\`\`

## Learning Objectives

By the end of this lesson, you'll be able to:
- Apply normalization rules (1NF, 2NF, 3NF)
- Decide when denormalization is appropriate
- Model different relationship types
- Choose appropriate schema design patterns
- Follow database design best practices
`,
  exercises: [
    {
      id: 1,
      title: 'Exercise 1: Identify Normalization Issues',
      description: `Analyze this table and identify normalization violations.

**Your task:**
Identify what normal form violations exist and propose a normalized design.`,
      starterCode: `-- Analyze this table:
CREATE TABLE orders (
  order_id INT PRIMARY KEY,
  customer_name VARCHAR(100),
  customer_email VARCHAR(100),
  customer_city VARCHAR(100),
  customer_state VARCHAR(2),
  product1_name VARCHAR(100),
  product1_price DECIMAL(10,2),
  product1_qty INT,
  product2_name VARCHAR(100),
  product2_price DECIMAL(10,2),
  product2_qty INT,
  order_date DATE
);

-- List violations:
-- 1NF violations:

-- 2NF violations:

-- 3NF violations:

-- Proposed normalized design:

`,
      solution: `-- Original table violations:

-- 1NF violations:
-- - Repeating groups (product1, product2 columns)

-- 2NF violations:
-- - product_name and product_price depend on product, not order
-- - (Would be clear with a composite key)

-- 3NF violations:
-- - customer_city and customer_state might depend on zip code (if we had one)
-- - customer_email depends on customer_name (transitive)

-- Proposed normalized design (3NF):

CREATE TABLE customers (
  customer_id INT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE,
  city VARCHAR(100),
  state VARCHAR(2)
);

CREATE TABLE products (
  product_id INT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL
);

CREATE TABLE orders (
  order_id INT PRIMARY KEY,
  customer_id INT NOT NULL,
  order_date DATE NOT NULL,
  FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

CREATE TABLE order_items (
  order_id INT,
  product_id INT,
  quantity INT NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,  -- Price at time of order
  PRIMARY KEY (order_id, product_id),
  FOREIGN KEY (order_id) REFERENCES orders(order_id),
  FOREIGN KEY (product_id) REFERENCES products(product_id)
);`,
      expectedOutput: ['1NF: No repeating groups', '2NF: Full key dependency', '3NF: No transitive dependencies'],
      hints: [
        '1NF: Look for multiple similar columns (product1, product2)',
        '2NF: Would product data change if order changed?',
        '3NF: Does any non-key column determine another non-key column?'
      ],
    },
    {
      id: 2,
      title: 'Exercise 2: Design Many-to-Many',
      description: `Design a schema for a book-author relationship where books can have multiple authors and authors can write multiple books.

**Your task:**
Create the necessary tables with appropriate constraints.`,
      starterCode: `-- Design tables for:
-- - Books (with title, isbn, publication_year)
-- - Authors (with name, bio)
-- - The relationship between them (including author_order for multi-author books)

`,
      solution: `-- Books table
CREATE TABLE books (
  book_id INT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  isbn VARCHAR(13) UNIQUE,
  publication_year INT,
  CHECK (publication_year >= 1000 AND publication_year <= 9999)
);

-- Authors table
CREATE TABLE authors (
  author_id INT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  bio TEXT
);

-- Junction table for many-to-many relationship
CREATE TABLE book_authors (
  book_id INT,
  author_id INT,
  author_order INT NOT NULL DEFAULT 1,  -- 1 = primary author, 2 = second, etc.
  role VARCHAR(50) DEFAULT 'Author',     -- 'Author', 'Editor', 'Translator'
  PRIMARY KEY (book_id, author_id),
  FOREIGN KEY (book_id) REFERENCES books(book_id) ON DELETE CASCADE,
  FOREIGN KEY (author_id) REFERENCES authors(author_id) ON DELETE RESTRICT,
  UNIQUE (book_id, author_order)  -- No two authors can have same order for one book
);

-- Example query: Get books with all authors
SELECT
  b.title,
  STRING_AGG(a.name, ', ' ORDER BY ba.author_order) AS authors
FROM books b
JOIN book_authors ba ON b.book_id = ba.book_id
JOIN authors a ON ba.author_id = a.author_id
GROUP BY b.book_id, b.title;`,
      expectedOutput: ['Books and Authors as separate entities', 'Junction table with composite primary key', 'Additional attributes on the relationship'],
      hints: [
        'Each entity needs its own table',
        'Junction table has foreign keys to both',
        'author_order can be stored in the junction table'
      ],
    },
    {
      id: 3,
      title: 'Exercise 3: Inheritance Pattern',
      description: `Design a schema for different types of media content (articles, videos, podcasts) that share common attributes but also have type-specific fields.

**Your task:**
Choose and implement an inheritance pattern.`,
      starterCode: `-- Common attributes: id, title, author_id, created_at, published_at, view_count
-- Article-specific: body, word_count
-- Video-specific: video_url, duration_seconds, thumbnail_url
-- Podcast-specific: audio_url, duration_seconds, transcript

-- Choose: Single Table, Class Table, or Concrete Table inheritance

`,
      solution: `-- Using Class Table Inheritance (best balance of integrity and flexibility)

-- Base table with common attributes
CREATE TABLE content (
  content_id INT PRIMARY KEY,
  content_type VARCHAR(20) NOT NULL,
  title VARCHAR(200) NOT NULL,
  author_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  published_at TIMESTAMP,
  view_count INT DEFAULT 0,
  FOREIGN KEY (author_id) REFERENCES authors(author_id),
  CHECK (content_type IN ('article', 'video', 'podcast'))
);

CREATE INDEX idx_content_type ON content(content_type);
CREATE INDEX idx_content_author ON content(author_id);

-- Article-specific table
CREATE TABLE articles (
  content_id INT PRIMARY KEY,
  body TEXT NOT NULL,
  word_count INT,
  FOREIGN KEY (content_id) REFERENCES content(content_id) ON DELETE CASCADE
);

-- Video-specific table
CREATE TABLE videos (
  content_id INT PRIMARY KEY,
  video_url VARCHAR(500) NOT NULL,
  duration_seconds INT NOT NULL,
  thumbnail_url VARCHAR(500),
  FOREIGN KEY (content_id) REFERENCES content(content_id) ON DELETE CASCADE
);

-- Podcast-specific table
CREATE TABLE podcasts (
  content_id INT PRIMARY KEY,
  audio_url VARCHAR(500) NOT NULL,
  duration_seconds INT NOT NULL,
  transcript TEXT,
  FOREIGN KEY (content_id) REFERENCES content(content_id) ON DELETE CASCADE
);

-- View to get all content with type-specific fields
CREATE VIEW all_content AS
SELECT
  c.*,
  a.body, a.word_count,
  v.video_url, v.duration_seconds AS video_duration, v.thumbnail_url,
  p.audio_url, p.duration_seconds AS podcast_duration, p.transcript
FROM content c
LEFT JOIN articles a ON c.content_id = a.content_id AND c.content_type = 'article'
LEFT JOIN videos v ON c.content_id = v.content_id AND c.content_type = 'video'
LEFT JOIN podcasts p ON c.content_id = p.content_id AND c.content_type = 'podcast';`,
      expectedOutput: ['Base table for common attributes', 'Type-specific tables with FK to base', 'content_type discriminator column'],
      hints: [
        'Base table holds common fields',
        'Each type-specific table uses same PK as FK',
        'content_type helps identify which child table to join'
      ],
    },
    {
      id: 4,
      title: 'Exercise 4: Temporal Design',
      description: `Design a price history system where you need to track product prices over time and query the price at any point in history.

**Your task:**
Create tables that support querying current and historical prices.`,
      starterCode: `-- Requirements:
-- - Track current product price
-- - Keep full history of price changes
-- - Query: "What was the price on date X?"
-- - Query: "Show all price changes for product Y"

`,
      solution: `-- Products table with current price
CREATE TABLE products (
  product_id INT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  current_price DECIMAL(10,2) NOT NULL,
  price_updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Price history with valid time ranges
CREATE TABLE price_history (
  history_id SERIAL PRIMARY KEY,
  product_id INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  valid_from TIMESTAMP NOT NULL,
  valid_to TIMESTAMP,  -- NULL means current
  changed_by VARCHAR(100),
  change_reason VARCHAR(200),
  FOREIGN KEY (product_id) REFERENCES products(product_id),
  -- Ensure no overlapping periods
  EXCLUDE USING gist (
    product_id WITH =,
    tsrange(valid_from, COALESCE(valid_to, 'infinity')) WITH &&
  )
);

CREATE INDEX idx_price_history_product ON price_history(product_id, valid_from);

-- Trigger to maintain history on price change
CREATE OR REPLACE FUNCTION track_price_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.current_price != NEW.current_price THEN
    -- Close the previous period
    UPDATE price_history
    SET valid_to = CURRENT_TIMESTAMP
    WHERE product_id = NEW.product_id AND valid_to IS NULL;

    -- Insert new period
    INSERT INTO price_history (product_id, price, valid_from)
    VALUES (NEW.product_id, NEW.current_price, CURRENT_TIMESTAMP);

    NEW.price_updated_at = CURRENT_TIMESTAMP;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER price_change_trigger
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION track_price_change();

-- Query: Price at specific date
SELECT ph.price
FROM price_history ph
WHERE ph.product_id = 123
  AND ph.valid_from <= '2024-06-15'
  AND (ph.valid_to IS NULL OR ph.valid_to > '2024-06-15');

-- Query: All price changes for a product
SELECT price, valid_from, valid_to
FROM price_history
WHERE product_id = 123
ORDER BY valid_from;`,
      expectedOutput: ['Current price in products table', 'History with valid_from and valid_to', 'Queries using time ranges'],
      hints: [
        'valid_to = NULL indicates current record',
        'Use triggers to automate history tracking',
        'Query with valid_from <= date AND (valid_to IS NULL OR valid_to > date)'
      ],
    },
  ],
  quiz: [
    {
      question: 'What does Third Normal Form (3NF) require that 2NF does not?',
      options: [
        'Atomic values in all columns',
        'A primary key',
        'No transitive dependencies between non-key columns',
        'No repeating groups'
      ],
      correctIndex: 2,
      explanation: '3NF adds the requirement that no non-key column should depend on another non-key column (transitive dependency). For example, if city depends on zip_code and zip_code is not a key, that violates 3NF.'
    },
    {
      question: 'When is denormalization a good choice?',
      options: [
        'Always, because normalized databases are slow',
        'When read performance is critical and data rarely changes',
        'When you want to eliminate foreign keys',
        'When you have a small dataset'
      ],
      correctIndex: 1,
      explanation: 'Denormalization trades write complexity for read performance. It makes sense when you have heavy read loads, the denormalized data rarely changes, and the JOIN operations are a proven bottleneck.'
    },
    {
      question: 'In a many-to-many relationship, where is the junction table\'s foreign key placed?',
      options: [
        'In both parent tables',
        'Only in the junction table, referencing both parent tables',
        'In one parent table only',
        'Many-to-many relationships don\'t use foreign keys'
      ],
      correctIndex: 1,
      explanation: 'The junction table contains foreign keys to both parent tables. Each row in the junction table represents one relationship between entities in the two parent tables.'
    },
    {
      question: 'What is a key difference between Single Table Inheritance and Class Table Inheritance?',
      options: [
        'Single Table uses one table with NULLs for type-specific columns; Class Table uses separate tables',
        'Class Table is faster for queries',
        'Single Table doesn\'t support polymorphism',
        'They are the same pattern with different names'
      ],
      correctIndex: 0,
      explanation: 'Single Table Inheritance stores all types in one table with type-specific columns that are NULL for other types. Class Table Inheritance uses a base table for shared attributes and separate tables for type-specific attributes, joined by the same primary key.'
    }
  ],
  buildNote: {
    title: 'Database Design in Applications',
    explanation: `The lesson structure in this learning platform demonstrates good database design principles. The \`Lesson\` interface represents an entity with specific attributes. If this were in a database, you'd normalize it: lessons table, exercises table (1:N with lessons), quiz_questions table (1:N with lessons). The \`difficulty\` would be an enum or lookup table. The \`buildNote\` could be a separate table for optional content. Understanding these patterns helps you design schemas that map cleanly to application data models.`,
    relatedFiles: [
      'src/types/lesson.ts',
      'src/lessons/index.ts'
    ],
    inTheRealWorld: `Every application needs thoughtful database design. E-commerce systems must handle products with variants, orders with items, and customer addresses. Healthcare systems deal with patient records, appointments, and complex hierarchies. The key is starting with a normalized design, then denormalizing deliberately where performance requires it, with clear documentation of why each denormalization exists.`
  }
};
