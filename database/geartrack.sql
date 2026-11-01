-- CST-391 GearTrack Milestone 3: run in MAMP/phpMyAdmin SQL tab.
-- IMPORTANT: this script creates geartrack and tables if missing. It does NOT drop existing data.
CREATE DATABASE IF NOT EXISTS geartrack CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE geartrack;

CREATE TABLE IF NOT EXISTS gear_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(60) NOT NULL UNIQUE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS gear_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    category_id INT NOT NULL,
    name VARCHAR(120) NOT NULL,
    brand VARCHAR(80) NOT NULL,
    purchase_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    purchase_date DATE NULL,
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    notes TEXT NULL,
    CONSTRAINT fk_gear_category FOREIGN KEY (category_id)
      REFERENCES gear_categories(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT chk_gear_price CHECK (purchase_price >= 0)
) ENGINE=InnoDB;

INSERT IGNORE INTO gear_categories (id, name) VALUES
(1, 'Camera'), (2, 'Lens'), (3, 'Lighting'), (4, 'Audio'), (5, 'Drone'), (6, 'Accessories');

