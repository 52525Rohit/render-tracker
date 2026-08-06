-- Proper primary keys: DB-generated AUTO_INCREMENT instead of app-computed ids.
-- Run once to (re)create the database and schema.

CREATE DATABASE IF NOT EXISTS render_time_calculator;
USE render_time_calculator;

CREATE TABLE IF NOT EXISTS project (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_name VARCHAR(255) NOT NULL UNIQUE,
  date_create DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  date_modify DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS camera (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  camera_name VARCHAR(255) NOT NULL UNIQUE,
  total_frame INT NOT NULL,
  rander_frame INT NOT NULL,
  frame_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  image_url VARCHAR(255),
  image_name VARCHAR(255),
  FOREIGN KEY (project_id) REFERENCES project(id) ON DELETE CASCADE
);
