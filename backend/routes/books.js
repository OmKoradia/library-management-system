const express = require("express");
const router = express.Router();

const db = require("../database/db");


// ==========================================
// GET ALL BOOKS
// ==========================================

router.get("/", (req, res) => {

    const sql = "SELECT * FROM books";

    db.query(sql, (err, results) => {

        if (err) {
            console.log(err);
            return res.status(500).json({
                message: "Error fetching books"
            });
        }

        res.json(results);
    });
});


// ==========================================
// ADD NEW BOOK
// ==========================================

router.post("/", (req, res) => {

    const {
        name,
        author,
        category,
        isbn,
        quantity
    } = req.body;

    const sql = `
        INSERT INTO books
        (name, author, category, isbn, quantity, available)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [name, author, category, isbn, quantity, quantity],
        (err, result) => {

            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: "Error adding book"
                });
            }

            res.json({
                message: "Book added successfully",
                id: result.insertId
            });
        }
    );
});


// ==========================================
// UPDATE BOOK
// ==========================================

router.put("/:id", (req, res) => {

    const id = req.params.id;

    const {
        name,
        author,
        category,
        isbn,
        quantity
    } = req.body;

    const sql = `
        UPDATE books
        SET name = ?,
            author = ?,
            category = ?,
            isbn = ?,
            quantity = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [name, author, category, isbn, quantity, id],
        (err, result) => {

            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: "Error updating book"
                });
            }

            res.json({
                message: "Book updated successfully"
            });
        }
    );
});


// ==========================================
// DELETE BOOK
// ==========================================

router.delete("/:id", (req, res) => {

    const id = req.params.id;

    const sql = "DELETE FROM books WHERE id = ?";

    db.query(sql, [id], (err, result) => {

        if (err) {
            console.log(err);
            return res.status(500).json({
                message: "Error deleting book"
            });
        }

        res.json({
            message: "Book deleted successfully"
        });
    });
});


module.exports = router;
