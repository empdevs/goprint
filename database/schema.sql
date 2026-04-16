CREATE DATABASE IF NOT EXISTS goprint_db;
USE goprint_db;

CREATE TABLE users (
  id CHAR(36) PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  phone VARCHAR(30),
  nim VARCHAR(30),
  study_program VARCHAR(120),
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin', 'copy_shop', 'user') NOT NULL,
  campus_location VARCHAR(120),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE copy_shops (
  id CHAR(36) PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  shop_name VARCHAR(120) NOT NULL,
  location_note VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_copy_shops_user
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE orders (
  id CHAR(36) PRIMARY KEY,
  order_code VARCHAR(30) NOT NULL UNIQUE,
  user_id CHAR(36) NOT NULL,
  copy_shop_user_id CHAR(36),
  pickup_method ENUM('pickup', 'delivery') NOT NULL,
  payment_method ENUM('cash', 'bank_transfer') NOT NULL,
  status ENUM(
    'pending',
    'confirmed',
    'processing',
    'ready_for_pickup',
    'out_for_delivery',
    'completed',
    'cancelled'
  ) NOT NULL DEFAULT 'pending',
  notes TEXT,
  delivery_address TEXT,
  subtotal DECIMAL(10, 2) NOT NULL DEFAULT 0,
  delivery_fee DECIMAL(10, 2) NOT NULL DEFAULT 0,
  total_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_orders_user
    FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT fk_orders_copy_shop_user
    FOREIGN KEY (copy_shop_user_id) REFERENCES users(id)
);

CREATE TABLE order_items (
  id CHAR(36) PRIMARY KEY,
  order_id CHAR(36) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  file_type VARCHAR(50) NOT NULL,
  print_qty INT NOT NULL DEFAULT 0,
  copy_qty INT NOT NULL DEFAULT 0,
  binding_qty INT NOT NULL DEFAULT 0,
  source_print_qty INT NOT NULL DEFAULT 0,
  total_printed_sheets INT NOT NULL DEFAULT 0,
  description TEXT,
  notes TEXT,
  unit_print_price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  unit_copy_price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  unit_binding_price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  total_price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_order_items_order
    FOREIGN KEY (order_id) REFERENCES orders(id)
);

CREATE TABLE history (
  id CHAR(36) PRIMARY KEY,
  order_id CHAR(36) NOT NULL UNIQUE,
  completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  archived_payload JSON NOT NULL,
  CONSTRAINT fk_history_order
    FOREIGN KEY (order_id) REFERENCES orders(id)
);

CREATE TABLE feedbacks (
  id CHAR(36) PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  nim VARCHAR(30),
  study_program VARCHAR(120),
  comment TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
