const express = require("express");
const router = express.Router();
const db = require("../database/db");


// =========================
// GET ALL ORDERS
// =========================

router.get("/", (req, res) => {

    const sql = `
        SELECT
            bo.id,
            bo.book_id,
            b.name AS book_name,
            bo.student_id,
            s.name AS student_name,
            bo.faculty_id,
            f.name AS faculty_name,
            bo.quantity,
            bo.order_date,
            bo.status
        FROM book_orders bo
        JOIN books b
            ON bo.book_id = b.id
        LEFT JOIN students s
            ON bo.student_id = s.id
        LEFT JOIN faculty f
            ON bo.faculty_id = f.id
        ORDER BY bo.id DESC
    `;

    db.query(sql, (err, results) => {

        if (err) {
            console.log(err);
            return res.status(500).json({
                message: "Error fetching book orders"
            });
        }

        res.json(results);
    });
});


// =========================
// CREATE BOOK ORDER
// =========================

router.post("/", (req, res) => {

    const {
        book_id,
        student_id,
        faculty_id,
        quantity
    } = req.body;

    const bookSQL = `
        SELECT *
        FROM books
        WHERE id = ?
    `;

    db.query(bookSQL, [book_id], (err, books) => {

        if (err) {
            console.log(err);
            return res.status(500).json({
                message: "Database error"
            });
        }

        if (books.length === 0) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        const orderSQL = `
            INSERT INTO book_orders
            (
                book_id,
                student_id,
                faculty_id,
                quantity,
                order_date,
                status
            )
            VALUES
            (?, ?, ?, ?, CURDATE(), 'Pending')
        `;

        db.query(
            orderSQL,
            [
                book_id,
                student_id || null,
                faculty_id || null,
                quantity || 1
            ],
            (err, result) => {

                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        message: "Error creating book order"
                    });
                }

                res.json({
                    message: "Book order created successfully",
                    orderId: result.insertId
                });
            }
        );
    });
});


module.exports = router;