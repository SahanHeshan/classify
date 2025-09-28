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
CREATE DATABASE IF NOT EXISTS classify_db;
USE classify_db;

CREATE TABLE IF NOT EXISTS students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  program VARCHAR(100) DEFAULT 'BSc Geomatics',
  batch VARCHAR(20) DEFAULT '2024',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS results (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  subject_code VARCHAR(20) NOT NULL,
  subject_name VARCHAR(100) NOT NULL,
  grade VARCHAR(5) NOT NULL,
  gpa DECIMAL(3,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS applications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  choice1 VARCHAR(100) NOT NULL,
  choice2 VARCHAR(100) NOT NULL,
  choice3 VARCHAR(100) NOT NULL,
  status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
  applied_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);
```

# create password hash

node test-password.js
