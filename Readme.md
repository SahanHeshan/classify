# Starting Backend

1. Install **Node.js** on your device https://nodejs.org/en/download.
2. Open the project in an IDE (e.g., **Visual Studio Code**).
3. Run the following commands:

```bash
cd backend
npm i
npm start
```

# Start Database

Install XAMPP.

Start Apache and MySQL services.

Open http://localhost/phpmyadmin/.

In the SQL section, paste and run the following script:

```bash
-- Create database if not exists
CREATE DATABASE IF NOT EXISTS classify_db
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_general_ci;

USE classify_db;

-- ---------------------------
-- Table: students
-- ---------------------------
CREATE TABLE IF NOT EXISTS students (
  id INT(11) NOT NULL AUTO_INCREMENT,
  indexNo VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  password VARCHAR(255) NOT NULL,
  program VARCHAR(100) DEFAULT 'BSc Geomatics',
  batch VARCHAR(20) DEFAULT '2024',
  created_at TIMESTAMP NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO students (id, indexNo, name, password, program, batch, created_at) VALUES
(1, '21GES1440', 'John Doe', '$2a$10$RVta7kXrTJ2qafVZu05AKuZWeLwz9IQLnSP7ad93VScK0HAMNNRLm', 'BSc Geomatics', '2022', '2025-09-28 11:50:25'),
(2, '21GES1441', 'Jane Smith', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'BSc Geomatics', '2022', '2025-09-28 11:50:25');

-- ---------------------------
-- Table: applications
-- ---------------------------
CREATE TABLE IF NOT EXISTS applications (
  id INT(11) NOT NULL AUTO_INCREMENT,
  indexNo VARCHAR(50) NOT NULL,
  choice1 VARCHAR(100) NOT NULL,
  choice2 VARCHAR(100) NOT NULL,
  choice3 VARCHAR(100) NOT NULL,
  status ENUM('Pending','Approved','Rejected') DEFAULT 'Pending',
  applied_date TIMESTAMP NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (id),
  KEY indexNo (indexNo),
  CONSTRAINT applications_ibfk_1 FOREIGN KEY (indexNo) REFERENCES students(indexNo) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO applications (id, indexNo, choice1, choice2, choice3, status, applied_date) VALUES
(1, '21GES1440', 'GIS and Remote Sensing', 'Land Survey and Geoinformatics', 'Hydrography', 'Pending', '2025-09-28 14:20:52');

-- ---------------------------
-- Table: results
-- ---------------------------
CREATE TABLE IF NOT EXISTS results (
  id INT(11) NOT NULL AUTO_INCREMENT,
  indexNo VARCHAR(50) NOT NULL,
  semester VARCHAR(20) NOT NULL,
  subject_name VARCHAR(100) NOT NULL,
  grade VARCHAR(5) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (id),
  KEY indexNo (indexNo),
  CONSTRAINT results_ibfk_1 FOREIGN KEY (indexNo) REFERENCES students(indexNo) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO results (id, indexNo, semester, subject_name, grade, created_at) VALUES
(1, '21GES1440', 'Year 1 Semester 1', 'Introduction to Geomatics', 'A', '2025-09-28 11:50:25'),
(2, '21GES1440', 'Year 1 Semester 1', 'Cartography and Map Design', 'A-', '2025-09-28 11:50:25'),
(3, '21GES1440', 'Year 1 Semester 1', 'FC11221', 'B+', '2025-09-28 11:50:25'),
(4, '21GES1440', 'Year 1 Semester 2', 'GIS Fundamentals', 'A', '2025-09-28 11:50:25'),
(5, '21GES1440', 'Year 1 Semester 2', 'Remote Sensing Basics', 'B+', '2025-09-28 11:50:25');

-- ---------------------------
-- Table: semester_gpa
-- ---------------------------
CREATE TABLE IF NOT EXISTS semester_gpa (
  id INT(11) NOT NULL AUTO_INCREMENT,
  indexNo VARCHAR(50) NOT NULL,
  semester VARCHAR(20) NOT NULL,
  gpa DECIMAL(3,2) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (id),
  UNIQUE KEY unique_semester (indexNo, semester),
  CONSTRAINT semester_gpa_ibfk_1 FOREIGN KEY (indexNo) REFERENCES students(indexNo) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO semester_gpa (id, indexNo, semester, gpa, created_at) VALUES
(1, '21GES1440', 'Year 1 Semester 1', 3.67, '2025-09-28 11:50:25'),
(2, '21GES1440', 'Year 1 Semester 2', 3.65, '2025-09-28 11:50:25');

```

# create password hash

node test-password.js
