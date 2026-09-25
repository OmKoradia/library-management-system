const express = require("express");
const router = express.Router();
const db = require("../database/db");

// =====================================================
// GET ALL LIBRARY RECORDS
// =====================================================
router.get("/", (req, res) => {
    const sql = `
        SELECT
            lr.id,
            lr.borrower_type,
            lr.student_id,
            lr.faculty_id,
            s.name AS student_name,
            f.name AS faculty_name,
            b.name AS book_name,
            lr.issue_date,
            lr.due_date,
            lr.return_date,
            lr.status,
            lr.fine
        FROM library_records lr
        LEFT JOIN students s ON lr.student_id = s.id
        LEFT JOIN faculty f ON lr.faculty_id = f.id
        JOIN books b ON lr.book_id = b.id
        ORDER BY lr.id DESC
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                message: "Error fetching library records"
            });
        }

        res.json(results);
    });
});


// =====================================================
// ISSUE BOOK
// =====================================================
router.post("/issue", (req, res) => {

    const {
        borrower_type,
        student_id,
        faculty_id,
        book_id
    } = req.body;

    // Basic validation
    if (!borrower_type || !book_id) {
        return res.status(400).json({
            message: "Borrower type and book ID are required"
        });
    }

    if (!["Student", "Faculty"].includes(borrower_type)) {
        return res.status(400).json({
            message: "Borrower type must be Student or Faculty"
        });
    }

    // Student validation
    if (borrower_type === "Student") {

        if (!student_id) {
            return res.status(400).json({
                message: "Student ID is required"
            });
        }

        if (faculty_id) {
            return res.status(400).json({
                message: "Faculty ID should not be provided for a Student"
            });
        }
    }

    // Faculty validation
    if (borrower_type === "Faculty") {

        if (!faculty_id) {
            return res.status(400).json({
                message: "Faculty ID is required"
            });
        }

        if (student_id) {
            return res.status(400).json({
                message: "Student ID should not be provided for Faculty"
            });
        }
    }


    // =================================================
    // START TRANSACTION
    // =================================================

    db.beginTransaction((err) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                message: "Could not start database transaction"
            });
        }


        // =================================================
        // CHECK BOOK AND LOCK ITS ROW
        // =================================================

        const bookSQL = `
            SELECT *
            FROM books
            WHERE id = ?
            FOR UPDATE
        `;

        db.query(bookSQL, [book_id], (err, books) => {

            if (err) {
                return db.rollback(() => {
                    console.log(err);

                    res.status(500).json({
                        message: "Database error while checking book"
                    });
                });
            }


            // Book does not exist
            if (books.length === 0) {

                return db.rollback(() => {

                    res.status(404).json({
                        message: "Book not found"
                    });

                });
            }


            const book = books[0];


            // Book unavailable
            if (book.available <= 0) {

                return db.rollback(() => {

                    res.status(400).json({
                        message: "Book is not available. You can order this book."
                    });

                });
            }


            // =================================================
            // STUDENT ISSUE
            // =================================================

            if (borrower_type === "Student") {

                // Check student exists
                const studentSQL = `
                    SELECT *
                    FROM students
                    WHERE id = ?
                `;

                db.query(studentSQL, [student_id], (err, students) => {

                    if (err) {

                        return db.rollback(() => {

                            console.log(err);

                            res.status(500).json({
                                message: "Database error while checking student"
                            });

                        });

                    }


                    if (students.length === 0) {

                        return db.rollback(() => {

                            res.status(404).json({
                                message: "Student not found"
                            });

                        });

                    }


                    // =============================================
                    // CHECK MAXIMUM 3 ACTIVE BOOKS
                    // =============================================

                    const countSQL = `
                        SELECT COUNT(*) AS count
                        FROM library_records
                        WHERE student_id = ?
                        AND status = 'Issued'
                    `;

                    db.query(countSQL, [student_id], (err, countResult) => {

                        if (err) {

                            return db.rollback(() => {

                                console.log(err);

                                res.status(500).json({
                                    message: "Error checking student's issued books"
                                });

                            });

                        }


                        const issuedCount = countResult[0].count;


                        if (issuedCount >= 3) {

                            return db.rollback(() => {

                                res.status(400).json({
                                    message: "Student cannot issue more than 3 books"
                                });

                            });

                        }


                        // =============================================
                        // CHECK DUPLICATE ACTIVE BOOK
                        // =============================================

                        const duplicateSQL = `
                            SELECT id
                            FROM library_records
                            WHERE student_id = ?
                            AND book_id = ?
                            AND status = 'Issued'
                            LIMIT 1
                        `;

                        db.query(
                            duplicateSQL,
                            [student_id, book_id],
                            (err, duplicateResult) => {

                                if (err) {

                                    return db.rollback(() => {

                                        console.log(err);

                                        res.status(500).json({
                                            message: "Error checking existing issue"
                                        });

                                    });

                                }


                                if (duplicateResult.length > 0) {

                                    return db.rollback(() => {

                                        res.status(400).json({
                                            message: "This student already has this book issued"
                                        });

                                    });

                                }


                                // =============================================
                                // INSERT STUDENT ISSUE
                                // =============================================

                                const insertSQL = `
                                    INSERT INTO library_records
                                    (
                                        student_id,
                                        faculty_id,
                                        book_id,
                                        borrower_type,
                                        issue_date,
                                        due_date,
                                        return_date,
                                        status,
                                        fine
                                    )
                                    VALUES
                                    (
                                        ?,
                                        NULL,
                                        ?,
                                        'Student',
                                        CURDATE(),
                                        DATE_ADD(CURDATE(), INTERVAL 7 DAY),
                                        NULL,
                                        'Issued',
                                        0.00
                                    )
                                `;

                                db.query(
                                    insertSQL,
                                    [student_id, book_id],
                                    (err, result) => {

                                        if (err) {

                                            return db.rollback(() => {

                                                console.log(err);

                                                res.status(500).json({
                                                    message: "Error issuing book to student"
                                                });

                                            });

                                        }


                                        // =============================================
                                        // DECREASE AVAILABLE BOOK COUNT
                                        // =============================================

                                        const updateBookSQL = `
                                            UPDATE books
                                            SET available = available - 1
                                            WHERE id = ?
                                            AND available > 0
                                        `;

                                        db.query(
                                            updateBookSQL,
                                            [book_id],
                                            (err, updateResult) => {

                                                if (err) {

                                                    return db.rollback(() => {

                                                        console.log(err);

                                                        res.status(500).json({
                                                            message: "Error updating book availability"
                                                        });

                                                    });

                                                }


                                                if (updateResult.affectedRows !== 1) {

                                                    return db.rollback(() => {

                                                        res.status(400).json({
                                                            message: "Book is no longer available"
                                                        });

                                                    });

                                                }


                                                // =============================================
                                                // COMMIT
                                                // =============================================

                                                db.commit((err) => {

                                                    if (err) {

                                                        return db.rollback(() => {

                                                            console.log(err);

                                                            res.status(500).json({
                                                                message: "Error completing book issue"
                                                            });

                                                        });

                                                    }


                                                    res.json({
                                                        message: "Book issued successfully",
                                                        recordId: result.insertId
                                                    });

                                                });

                                            }
                                        );

                                    }
                                );

                            }
                        );

                    });

                });

            }


            // =================================================
            // FACULTY ISSUE
            // =================================================

            else if (borrower_type === "Faculty") {

                // Check faculty exists
                const facultySQL = `
                    SELECT *
                    FROM faculty
                    WHERE id = ?
                `;

                db.query(facultySQL, [faculty_id], (err, faculty) => {

                    if (err) {

                        return db.rollback(() => {

                            console.log(err);

                            res.status(500).json({
                                message: "Database error while checking faculty"
                            });

                        });

                    }


                    if (faculty.length === 0) {

                        return db.rollback(() => {

                            res.status(404).json({
                                message: "Faculty member not found"
                            });

                        });

                    }


                    // =============================================
                    // CHECK DUPLICATE ACTIVE BOOK
                    // =============================================

                    const duplicateSQL = `
                        SELECT id
                        FROM library_records
                        WHERE faculty_id = ?
                        AND book_id = ?
                        AND status = 'Issued'
                        LIMIT 1
                    `;

                    db.query(
                        duplicateSQL,
                        [faculty_id, book_id],
                        (err, duplicateResult) => {

                            if (err) {

                                return db.rollback(() => {

                                    console.log(err);

                                    res.status(500).json({
                                        message: "Error checking existing issue"
                                    });

                                });

                            }


                            if (duplicateResult.length > 0) {

                                return db.rollback(() => {

                                    res.status(400).json({
                                        message: "This faculty member already has this book issued"
                                    });

                                });

                            }


                            // =============================================
                            // INSERT FACULTY ISSUE
                            // =============================================

                            const insertSQL = `
                                INSERT INTO library_records
                                (
                                    student_id,
                                    faculty_id,
                                    book_id,
                                    borrower_type,
                                    issue_date,
                                    due_date,
                                    return_date,
                                    status,
                                    fine
                                )
                                VALUES
                                (
                                    NULL,
                                    ?,
                                    ?,
                                    'Faculty',
                                    CURDATE(),
                                    NULL,
                                    NULL,
                                    'Issued',
                                    0.00
                                )
                            `;

                            db.query(
                                insertSQL,
                                [faculty_id, book_id],
                                (err, result) => {

                                    if (err) {

                                        return db.rollback(() => {

                                            console.log(err);

                                            res.status(500).json({
                                                message: "Error issuing book to faculty"
                                            });

                                        });

                                    }


                                    // =============================================
                                    // DECREASE AVAILABLE COUNT
                                    // =============================================

                                    const updateBookSQL = `
                                        UPDATE books
                                        SET available = available - 1
                                        WHERE id = ?
                                        AND available > 0
                                    `;

                                    db.query(
                                        updateBookSQL,
                                        [book_id],
                                        (err, updateResult) => {

                                            if (err) {

                                                return db.rollback(() => {

                                                    console.log(err);

                                                    res.status(500).json({
                                                        message: "Error updating book availability"
                                                    });

                                                });

                                            }


                                            if (updateResult.affectedRows !== 1) {

                                                return db.rollback(() => {

                                                    res.status(400).json({
                                                        message: "Book is no longer available"
                                                    });

                                                });

                                            }


                                            // =============================================
                                            // COMMIT
                                            // =============================================

                                            db.commit((err) => {

                                                if (err) {

                                                    return db.rollback(() => {

                                                        console.log(err);

                                                        res.status(500).json({
                                                            message: "Error completing book issue"
                                                        });

                                                    });

                                                }


                                                res.json({
                                                    message: "Book issued successfully",
                                                    recordId: result.insertId
                                                });

                                            });

                                        }
                                    );

                                }
                            );

                        }
                    );

                });

            }

        });

    });

});


// =====================================================
// RETURN BOOK
// =====================================================
router.post("/return", (req, res) => {

    const { record_id } = req.body;

    if (!record_id) {
        return res.status(400).json({
            message: "Record ID is required"
        });
    }


    // =================================================
    // START TRANSACTION
    // =================================================

    db.beginTransaction((err) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                message: "Could not start database transaction"
            });

        }


        // =================================================
        // GET RECORD AND LOCK IT
        // =================================================

        const recordSQL = `
            SELECT *
            FROM library_records
            WHERE id = ?
            FOR UPDATE
        `;

        db.query(recordSQL, [record_id], (err, records) => {

            if (err) {

                return db.rollback(() => {

                    console.log(err);

                    res.status(500).json({
                        message: "Database error while checking record"
                    });

                });

            }


            if (records.length === 0) {

                return db.rollback(() => {

                    res.status(404).json({
                        message: "Library record not found"
                    });

                });

            }


            const record = records[0];


            // Already returned
            if (record.status === "Returned") {

                return db.rollback(() => {

                    res.status(400).json({
                        message: "This book has already been returned"
                    });

                });

            }


            // =================================================
            // FACULTY RETURN
            // =================================================

            if (record.borrower_type === "Faculty") {

                const updateRecordSQL = `
                    UPDATE library_records
                    SET
                        return_date = CURDATE(),
                        status = 'Returned',
                        fine = 0.00
                    WHERE id = ?
                `;

                db.query(
                    updateRecordSQL,
                    [record_id],
                    (err) => {

                        if (err) {

                            return db.rollback(() => {

                                console.log(err);

                                res.status(500).json({
                                    message: "Error returning faculty book"
                                });

                            });

                        }


                        // Increase available count
                        const updateBookSQL = `
                            UPDATE books
                            SET available = LEAST(available + 1, quantity)
                            WHERE id = ?
                        `;

                        db.query(
                            updateBookSQL,
                            [record.book_id],
                            (err) => {

                                if (err) {

                                    return db.rollback(() => {

                                        console.log(err);

                                        res.status(500).json({
                                            message: "Error updating book availability"
                                        });

                                    });

                                }


                                db.commit((err) => {

                                    if (err) {

                                        return db.rollback(() => {

                                            console.log(err);

                                            res.status(500).json({
                                                message: "Error completing book return"
                                            });

                                        });

                                    }


                                    res.json({
                                        message: "Book returned successfully",
                                        fine: 0
                                    });

                                });

                            }
                        );

                    }
                );

            }


            // =================================================
            // STUDENT RETURN
            // =================================================

            else if (record.borrower_type === "Student") {

                // Calculate late days
                const today = new Date();
                const dueDate = new Date(record.due_date);

                today.setHours(0, 0, 0, 0);
                dueDate.setHours(0, 0, 0, 0);

                const difference = today - dueDate;

                let lateDays = Math.ceil(
                    difference / (1000 * 60 * 60 * 24)
                );

                if (lateDays < 0) {
                    lateDays = 0;
                }

                const fine = lateDays * 10;


                // =============================================
                // UPDATE RECORD
                // =============================================

                const updateRecordSQL = `
                    UPDATE library_records
                    SET
                        return_date = CURDATE(),
                        status = 'Returned',
                        fine = ?
                    WHERE id = ?
                `;

                db.query(
                    updateRecordSQL,
                    [fine, record_id],
                    (err) => {

                        if (err) {

                            return db.rollback(() => {

                                console.log(err);

                                res.status(500).json({
                                    message: "Error returning student book"
                                });

                            });

                        }


                        // =============================================
                        // INCREASE AVAILABLE COUNT
                        // =============================================

                        const updateBookSQL = `
                            UPDATE books
                            SET available = LEAST(available + 1, quantity)
                            WHERE id = ?
                        `;

                        db.query(
                            updateBookSQL,
                            [record.book_id],
                            (err) => {

                                if (err) {

                                    return db.rollback(() => {

                                        console.log(err);

                                        res.status(500).json({
                                            message: "Error updating book availability"
                                        });

                                    });

                                }


                                // =============================================
                                // COMMIT
                                // =============================================

                                db.commit((err) => {

                                    if (err) {

                                        return db.rollback(() => {

                                            console.log(err);

                                            res.status(500).json({
                                                message: "Error completing book return"
                                            });

                                        });

                                    }


                                    res.json({
                                        message: "Book returned successfully",
                                        fine: fine
                                    });

                                });

                            }
                        );

                    }
                );

            }


            // =================================================
            // INVALID BORROWER TYPE
            // =================================================

            else {

                return db.rollback(() => {

                    res.status(400).json({
                        message: "Invalid borrower type"
                    });

                });

            }

        });

    });

});


module.exports = router;