const express = require("express");
const router = express.Router();

const db = require("../database/db");


// ==========================================
// GET ALL STUDENTS
// ==========================================

router.get("/", (req, res) => {

    const sql = "SELECT * FROM students";

    db.query(sql, (err, results) => {

        if (err) {
            console.log(err);
            return res.status(500).json({
                message: "Error fetching students"
            });
        }

        res.json(results);
    });
});


// ==========================================
// ADD NEW STUDENT
// ==========================================

router.post("/", (req, res) => {

    const {
        name,
        email,
        phone
    } = req.body;

    const sql = `
        INSERT INTO students
        (name, email, phone)
        VALUES (?, ?, ?)
    `;

    db.query(
        sql,
        [name, email, phone],
        (err, result) => {

            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: "Error adding student"
                });
            }

            res.json({
                message: "Student added successfully",
                id: result.insertId
            });
        }
    );
});


// ==========================================
// UPDATE STUDENT
// ==========================================

router.put("/:id", (req, res) => {

    const id = req.params.id;

    const {
        name,
        email,
        phone
    } = req.body;

    const sql = `
        UPDATE students
        SET name = ?,
            email = ?,
            phone = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [name, email, phone, id],
        (err, result) => {

            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: "Error updating student"
                });
            }

            res.json({
                message: "Student updated successfully"
            });
        }
    );
});


// ==========================================
// DELETE STUDENT
// ==========================================

router.delete("/:id", (req, res) => {

    const id = req.params.id;

    const sql = "DELETE FROM students WHERE id = ?";

    db.query(sql, [id], (err, result) => {

        if (err) {
            console.log(err);
            return res.status(500).json({
                message: "Error deleting student"
            });
        }

        res.json({
            message: "Student deleted successfully"
        });
    });
});


module.exports = router;
