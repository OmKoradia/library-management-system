-- ============================================================
-- LIBRARY MANAGEMENT SYSTEM
-- COMPLETE DATABASE
-- 8 ENTITIES
-- ============================================================

-- ------------------------------------------------------------
-- 1. CREATE DATABASE
-- ------------------------------------------------------------

DROP DATABASE IF EXISTS library_management;

CREATE DATABASE library_management;

USE library_management;


-- ============================================================
-- 1. USERS
-- ============================================================

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'admin'
);


-- ============================================================
-- 2. BOOK CATEGORIES
-- ============================================================

CREATE TABLE book_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE
);


-- ============================================================
-- 3. BOOKS
-- ============================================================

CREATE TABLE books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    author VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL,
    isbn VARCHAR(30) UNIQUE,
    quantity INT NOT NULL DEFAULT 1,
    available INT NOT NULL DEFAULT 1
);


-- ============================================================
-- 4. STUDENTS
-- ============================================================

CREATE TABLE students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL
);


-- ============================================================
-- 5. FACULTY
-- ============================================================

CREATE TABLE faculty (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    department VARCHAR(100),
    phone VARCHAR(20)
);


-- ============================================================
-- 6. LIBRARY RECORDS
-- ============================================================
-- Student:
--   Due date required
--   Return date when returned
--   Fine can be charged
--
-- Faculty:
--   No due date
--   No return date initially
--   No fine
-- ============================================================

CREATE TABLE library_records (
    id INT AUTO_INCREMENT PRIMARY KEY,

    student_id INT DEFAULT NULL,

    faculty_id INT DEFAULT NULL,

    book_id INT NOT NULL,

    borrower_type ENUM('Student', 'Faculty') NOT NULL,

    issue_date DATE NOT NULL,

    due_date DATE DEFAULT NULL,

    return_date DATE DEFAULT NULL,

    status ENUM('Issued', 'Returned') DEFAULT 'Issued',

    fine DECIMAL(10,2) DEFAULT 0.00,

    FOREIGN KEY (student_id)
        REFERENCES students(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    FOREIGN KEY (faculty_id)
        REFERENCES faculty(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    FOREIGN KEY (book_id)
        REFERENCES books(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);


-- ============================================================
-- 7. FINES
-- ============================================================

CREATE TABLE fines (
    id INT AUTO_INCREMENT PRIMARY KEY,

    record_id INT NOT NULL,

    late_days INT DEFAULT 0,

    amount DECIMAL(10,2) DEFAULT 0.00,

    paid_status ENUM('Pending', 'Paid') DEFAULT 'Pending',

    FOREIGN KEY (record_id)
        REFERENCES library_records(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);


-- ============================================================
-- 8. BOOK ORDERS
-- ============================================================

CREATE TABLE book_orders (
    id INT AUTO_INCREMENT PRIMARY KEY,

    book_id INT NOT NULL,

    student_id INT DEFAULT NULL,

    faculty_id INT DEFAULT NULL,

    quantity INT NOT NULL DEFAULT 1,

    order_date DATE NOT NULL,

    status ENUM(
        'Pending',
        'Ordered',
        'Received',
        'Cancelled'
    ) DEFAULT 'Pending',

    FOREIGN KEY (book_id)
        REFERENCES books(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    FOREIGN KEY (student_id)
        REFERENCES students(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    FOREIGN KEY (faculty_id)
        REFERENCES faculty(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);


-- ============================================================
-- BOOK CATEGORIES
-- ============================================================

INSERT INTO book_categories (category_name) VALUES
('Programming'),
('Database'),
('Networking'),
('Artificial Intelligence'),
('Machine Learning'),
('Web Development'),
('Operating System'),
('Software Engineering'),
('Computer Architecture'),
('Data Science');


-- ============================================================
-- 35 BOOKS
-- ============================================================

INSERT INTO books
(id, name, author, category, isbn, quantity, available)
VALUES
(101, 'Java Programming', 'James Gosling', 'Programming', '9780134685991', 5, 5),
(102, 'Database System', 'Korth', 'Database', '9780073523323', 3, 3),
(103, 'Computer Networks', 'Andrew Tanenbaum', 'Networking', '9780132126953', 4, 4),
(104, 'Python Programming', 'Mark Lutz', 'Programming', '9781449355739', 5, 5),
(105, 'C Programming', 'Dennis Ritchie', 'Programming', '9780131103627', 4, 4),
(106, 'C++ Programming', 'Bjarne Stroustrup', 'Programming', '9780321563842', 3, 3),
(107, 'Operating System Concepts', 'Silberschatz', 'Operating System', '9781118063330', 4, 4),
(108, 'Computer Architecture', 'Morris Mano', 'Computer Architecture', '9780131983769', 3, 3),
(109, 'Data Structures', 'Seymour Lipschutz', 'Programming', '9780070381256', 5, 5),
(110, 'Algorithms', 'Thomas Cormen', 'Programming', '9780262046305', 4, 4),
(111, 'Web Development', 'Jon Duckett', 'Web Development', '9781118871652', 3, 3),
(112, 'HTML and CSS', 'Jon Duckett', 'Web Development', '9781118008188', 4, 4),
(113, 'JavaScript', 'David Flanagan', 'Web Development', '9781491952023', 3, 3),
(114, 'Artificial Intelligence', 'Stuart Russell', 'Artificial Intelligence', '9780134610993', 4, 4),
(115, 'Machine Learning', 'Tom Mitchell', 'Machine Learning', '9780070428072', 3, 3),
(116, 'Deep Learning', 'Ian Goodfellow', 'Machine Learning', '9780262035613', 4, 4),
(117, 'Data Science Handbook', 'Field Cady', 'Data Science', '9781119092913', 3, 3),
(118, 'Python for Data Analysis', 'Wes McKinney', 'Data Science', '9781098104030', 4, 4),
(119, 'SQL Fundamentals', 'John J. Patrick', 'Database', '9780764541561', 3, 3),
(120, 'MySQL Cookbook', 'Paul DuBois', 'Database', '9781449374020', 4, 4),
(121, 'Software Engineering', 'Ian Sommerville', 'Software Engineering', '9780133943030', 3, 3),
(122, 'Computer Security', 'William Stallings', 'Networking', '9780134794106', 4, 4),
(123, 'Network Security', 'Charlie Kaufman', 'Networking', '9780130460196', 3, 3),
(124, 'Cloud Computing', 'Rajkumar Buyya', 'Software Engineering', '9780470887998', 4, 4),
(125, 'Compiler Design', 'Alfred Aho', 'Programming', '9780321486813', 3, 3),
(126, 'System Software', 'Leland Beck', 'Programming', '9780321443628', 4, 4),
(127, 'Microprocessor', 'Ramesh Gaonkar', 'Computer Architecture', '9780130671204', 3, 3),
(128, 'Computer Graphics', 'Donald Hearn', 'Computer Architecture', '9780130153906', 4, 4),
(129, 'Digital Logic', 'Morris Mano', 'Computer Architecture', '9780131989269', 3, 3),
(130, 'Internet Programming', 'Deitel', 'Web Development', '9780132151009', 4, 4),
(131, 'Data Mining', 'Jiawei Han', 'Data Science', '9780123814791', 3, 3),
(132, 'Natural Language Processing', 'Daniel Jurafsky', 'Artificial Intelligence', '9780131873216', 4, 4),
(133, 'Computer Vision', 'Richard Szeliski', 'Artificial Intelligence', '9781848829343', 3, 3),
(134, 'Artificial Neural Networks', 'Simon Haykin', 'Machine Learning', '9780131471399', 4, 4),
(135, 'Blockchain Technology', 'Imran Bashir', 'Software Engineering', '9781526424387', 3, 3);


-- ============================================================
-- 20 STUDENTS
-- ============================================================

INSERT INTO students
(id, name, email, phone)
VALUES
(1, 'Rahul Patel', 'rahul@gmail.com', '9876543210'),
(2, 'Jay Shah', 'jay@gmail.com', '9876501234'),
(3, 'Amit Patel', 'amit@gmail.com', '9876501235'),
(4, 'Rohan Shah', 'rohan@gmail.com', '9876501236'),
(5, 'Karan Patel', 'karan@gmail.com', '9876501237'),
(6, 'Dhruv Shah', 'dhruv@gmail.com', '9876501238'),
(7, 'Yash Patel', 'yash@gmail.com', '9876501239'),
(8, 'Harsh Shah', 'harsh@gmail.com', '9876501240'),
(9, 'Meet Patel', 'meet@gmail.com', '9876501241'),
(10, 'Dev Shah', 'dev@gmail.com', '9876501242'),
(11, 'Akash Patel', 'akash@gmail.com', '9876501243'),
(12, 'Parth Shah', 'parth@gmail.com', '9876501244'),
(13, 'Nirav Patel', 'nirav@gmail.com', '9876501245'),
(14, 'Mihir Shah', 'mihir@gmail.com', '9876501246'),
(15, 'Krish Patel', 'krish@gmail.com', '9876501247'),
(16, 'Tirth Shah', 'tirth@gmail.com', '9876501248'),
(17, 'Om Patel', 'om@gmail.com', '9876501249'),
(18, 'Vivek Shah', 'vivek@gmail.com', '9876501250'),
(19, 'Darsh Patel', 'darsh@gmail.com', '9876501251'),
(20, 'Sahil Shah', 'sahil@gmail.com', '9876501252');


-- ============================================================
-- 15 FACULTY
-- ============================================================

INSERT INTO faculty
(id, name, email, department, phone)
VALUES
(1, 'Dr. Saurabh Tandel', 'saurabh.tandel@college.edu', 'Computer Engineering', '9876501001'),
(2, 'Prof. Pooja Pariyani', 'pooja.pariyani@college.edu', 'Computer Engineering', '9876501002'),
(3, 'Prof. Chaitali Patel', 'chaitali.patel@college.edu', 'Computer Engineering', '9876501003'),
(4, 'Prof. Rakesh Shah', 'rakesh.shah@college.edu', 'Computer Engineering', '9876501004'),
(5, 'Prof. Neha Desai', 'neha.desai@college.edu', 'Computer Engineering', '9876501005'),
(6, 'Prof. Amit Patel', 'amit.patel@college.edu', 'Computer Engineering', '9876501006'),
(7, 'Prof. Kiran Mehta', 'kiran.mehta@college.edu', 'Computer Engineering', '9876501007'),
(8, 'Prof. Nisha Shah', 'nisha.shah@college.edu', 'Computer Engineering', '9876501008'),
(9, 'Prof. Jayesh Patel', 'jayesh.patel@college.edu', 'Computer Engineering', '9876501009'),
(10, 'Prof. Rina Desai', 'rina.desai@college.edu', 'Computer Engineering', '9876501010'),
(11, 'Prof. Hardik Shah', 'hardik.shah@college.edu', 'Computer Engineering', '9876501011'),
(12, 'Prof. Hetal Joshi', 'hetal.joshi@college.edu', 'Computer Engineering', '9876501012'),
(13, 'Prof. Manish Patel', 'manish.patel@college.edu', 'Computer Engineering', '9876501013'),
(14, 'Prof. Bhavna Shah', 'bhavna.shah@college.edu', 'Computer Engineering', '9876501014'),
(15, 'Prof. Dhruv Mehta', 'dhruv.mehta@college.edu', 'Computer Engineering', '9876501015');


-- ============================================================
-- SAMPLE LIBRARY RECORD
-- ============================================================
-- Student 1 borrowed Book 101.
-- This is an example of a normal student issue.
-- ============================================================

INSERT INTO library_records
(student_id, faculty_id, book_id, borrower_type,
 issue_date, due_date, return_date, status, fine)
VALUES
(1, NULL, 101, 'Student',
 '2026-08-15', '2026-08-22', NULL, 'Issued', 0.00);


-- ============================================================
-- REDUCE AVAILABLE BOOK COUNT FOR THE SAMPLE ISSUE
-- ============================================================

UPDATE books
SET available = available - 1
WHERE id = 101;


-- ============================================================
-- SAMPLE FACULTY ISSUE
-- ============================================================
-- Faculty has:
-- No due date
-- No return date initially
-- No fine
--
-- Faculty 1 takes Book 102.
-- ============================================================

INSERT INTO library_records
(student_id, faculty_id, book_id, borrower_type,
 issue_date, due_date, return_date, status, fine)
VALUES
(NULL, 1, 102, 'Faculty',
 '2026-09-24', NULL, NULL, 'Issued', 0.00);


-- Reduce available quantity
UPDATE books
SET available = available - 1
WHERE id = 102;


-- ============================================================
-- CHECK DATABASE
-- ============================================================

SELECT * FROM users;

SELECT * FROM book_categories;

SELECT * FROM books;

SELECT * FROM students;

SELECT * FROM faculty;

SELECT * FROM library_records;

SELECT * FROM fines;

SELECT * FROM book_orders;


-- ============================================================
-- END
-- ============================================================