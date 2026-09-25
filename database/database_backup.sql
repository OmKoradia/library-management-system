-- ==========================================
-- LIBRARY MANAGEMENT SYSTEM DATABASE
-- ==========================================

CREATE DATABASE IF NOT EXISTS library_management;

USE library_management;


-- ==========================================
-- USERS TABLE
-- ==========================================

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'admin'
);


-- ==========================================
-- BOOKS TABLE
-- ==========================================

CREATE TABLE IF NOT EXISTS books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    author VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL,
    isbn VARCHAR(30) UNIQUE,
    quantity INT NOT NULL DEFAULT 1,
    available INT NOT NULL DEFAULT 1
);


-- ==========================================
-- STUDENTS TABLE
-- ==========================================

CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL
);


-- ==========================================
-- LIBRARY RECORDS TABLE
-- ==========================================

CREATE TABLE IF NOT EXISTS library_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    book_id INT NOT NULL,
    issue_date DATE NOT NULL,
    due_date DATE NOT NULL,
    return_date DATE DEFAULT NULL,
    status VARCHAR(20) DEFAULT 'Issued',
    fine DECIMAL(10,2) DEFAULT 0.00,

    FOREIGN KEY (student_id)
        REFERENCES students(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    FOREIGN KEY (book_id)
        REFERENCES books(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);


-- ==========================================
-- BOOK DATA
-- TOTAL = 35 BOOKS
-- ==========================================

INSERT INTO books
(id, name, author, category, isbn, quantity, available)
VALUES

(101, 'Java Programming', 'James Gosling', 'Programming',
 '9780134685991', 5, 5),

(102, 'Database System', 'Korth', 'Database',
 '9780073523323', 3, 2),

(103, 'Computer Networks', 'Andrew Tanenbaum', 'Networking',
 '9780132126953', 4, 4),

(104, 'Python Programming', 'Mark Lutz', 'Programming',
 '9781449355739', 5, 5),

(105, 'C Programming', 'Dennis Ritchie', 'Programming',
 '9780131103627', 4, 4),

(106, 'Data Structures', 'Seymour Lipschutz', 'Programming',
 '9780070701985', 6, 6),

(107, 'Operating System Concepts', 'Abraham Silberschatz',
 'Operating System', '9781119456339', 5, 5),

(108, 'Computer Organization', 'Carl Hamacher',
 'Computer Architecture', '9780071247445', 4, 4),

(109, 'Software Engineering', 'Ian Sommerville',
 'Software Engineering', '9780133943030', 5, 5),

(110, 'Database Management Systems', 'Raghu Ramakrishnan',
 'Database', '9780072465631', 4, 4),

(111, 'Artificial Intelligence', 'Stuart Russell',
 'AI', '9780134610993', 3, 3),

(112, 'Machine Learning', 'Tom Mitchell',
 'Machine Learning', '9780070428072', 4, 4),

(113, 'Web Development', 'Jon Duckett',
 'Web Development', '9781118871652', 5, 5),

(114, 'JavaScript Programming', 'David Flanagan',
 'Programming', '9780596805524', 4, 4),

(115, 'Computer Networks and Security', 'William Stallings',
 'Networking', '9780133850591', 3, 3),

(116, 'Cloud Computing', 'Rajkumar Buyya',
 'Cloud Computing', '9781118869238', 4, 4),

(117, 'Cyber Security', 'Charles J. Brooks',
 'Cyber Security', '9781119362399', 5, 5),

(118, 'Mobile Application Development', 'Barry Burd',
 'Mobile Development', '9781119615738', 3, 3),

(119, 'Algorithms', 'Robert Sedgewick',
 'Algorithms', '9780321573513', 5, 5),

(120, 'Computer Graphics', 'Donald Hearn',
 'Graphics', '9780130153906', 4, 4),

(121, 'Artificial Neural Networks', 'Simon Haykin',
 'AI', '9780131471399', 3, 3),

(122, 'Deep Learning', 'Ian Goodfellow',
 'Machine Learning', '9780262035613', 4, 4),

(123, 'Natural Language Processing', 'Daniel Jurafsky',
 'AI', '9780131873216', 3, 3),

(124, 'Internet of Things', 'Arshdeep Bahga',
 'IoT', '9788126554035', 5, 5),

(125, 'Data Science', 'Joel Grus',
 'Data Science', '9781492041139', 4, 4),

(126, 'Statistics for Data Science', 'Peter Bruce',
 'Data Science', '9781491952962', 3, 3),

(127, 'Linear Algebra', 'Gilbert Strang',
 'Mathematics', '9780980232776', 5, 5),

(128, 'Discrete Mathematics', 'Kenneth Rosen',
 'Mathematics', '9780073383095', 4, 4),

(129, 'Computer Architecture', 'John Hennessy',
 'Computer Architecture', '9780123838728', 3, 3),

(130, 'Distributed Systems', 'George Coulouris',
 'Systems', '9780321299171', 4, 4),

(131, 'Compiler Design', 'Alfred Aho',
 'Compiler', '9780321486813', 3, 3),

(132, 'System Software', 'Leland Beck',
 'System Software', '9780201423005', 4, 4),

(133, 'Computer Security', 'William Stallings',
 'Cyber Security', '9780133375896', 5, 5),

(134, 'Human Computer Interaction', 'Alan Dix',
 'HCI', '9780130461094', 3, 3),

(135, 'Project Management', 'Kathy Schwalbe',
 'Management', '9780357445140', 4, 4);


-- ==========================================
-- STUDENT DATA
-- TOTAL = 20 STUDENTS
-- ==========================================

INSERT INTO students
(id, name, email, phone)
VALUES

(1, 'Rahul Patel', 'rahul@gmail.com', '9876543210'),

(2, 'Jay Shah', 'jay@gmail.com', '9876501234'),

(3, 'Amit Patel', 'amit@gmail.com', '9876500001'),

(4, 'Neha Shah', 'neha@gmail.com', '9876500002'),

(5, 'Riya Mehta', 'riya@gmail.com', '9876500003'),

(6, 'Harsh Desai', 'harsh@gmail.com', '9876500004'),

(7, 'Priya Joshi', 'priya@gmail.com', '9876500005'),

(8, 'Yash Patel', 'yash@gmail.com', '9876500006'),

(9, 'Dhruv Shah', 'dhruv@gmail.com', '9876500007'),

(10, 'Karan Modi', 'karan@gmail.com', '9876500008'),

(11, 'Anjali Patel', 'anjali@gmail.com', '9876500009'),

(12, 'Meet Shah', 'meet@gmail.com', '9876500010'),

(13, 'Vivek Desai', 'vivek@gmail.com', '9876500011'),

(14, 'Pooja Mehta', 'pooja@gmail.com', '9876500012'),

(15, 'Rahul Desai', 'rahul.desai@gmail.com', '9876500013'),

(16, 'Sneha Patel', 'sneha@gmail.com', '9876500014'),

(17, 'Nikhil Shah', 'nikhil@gmail.com', '9876500015'),

(18, 'Kavya Joshi', 'kavya@gmail.com', '9876500016'),

(19, 'Rohan Mehta', 'rohan@gmail.com', '9876500017'),

(20, 'Mihir Patel', 'mihir@gmail.com', '9876500018');


-- ==========================================
-- SAMPLE LIBRARY RECORD
-- ==========================================

INSERT INTO library_records
(id, student_id, book_id, issue_date, due_date,
 return_date, status, fine)
VALUES

(1, 1, 101, '2026-08-15', '2026-08-22',
 NULL, 'Issued', 0.00);