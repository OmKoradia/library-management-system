const express = require("express");
const router = express.Router();
const db = require("../database/db");

// GET all faculty
router.get("/", (req, res) => {
    const sql = `
        SELECT id, name, email, department, phone
        FROM faculty
        ORDER BY id ASC
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching faculty:", err);
            return res.status(500).json({
                message: "Error fetching faculty",
                error: err.message
            });
        }

        res.json(results);
    });
});

// GET one faculty member
router.get("/:id", (req, res) => {
    const sql = `
        SELECT id, name, email, department, phone
        FROM faculty
        WHERE id = ?
    `;

    db.query(sql, [req.params.id], (err, results) => {
        if (err) {
            console.error("Error fetching faculty:", err);
            return res.status(500).json({
                message: "Error fetching faculty",
                error: err.message
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: "Faculty member not found"
            });
        }

        res.json(results[0]);
    });
});

// ADD faculty
router.post("/", (req, res) => {
    const { name, email, department, phone } = req.body;

    if (!name || !name.trim()) {
        return res.status(400).json({
            message: "Faculty name is required"
        });
    }

    const sql = `
        INSERT INTO faculty
        (name, email, department, phone)
        VALUES (?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            name.trim(),
            email || null,
            department || null,
            phone || null
        ],
        (err, result) => {
            if (err) {
                console.error("Error adding faculty:", err);
                return res.status(500).json({
                    message: "Error adding faculty",
                    error: err.message
                });
            }

            res.status(201).json({
                message: "Faculty added successfully",
                id: result.insertId
            });
        }
    );
});

// UPDATE faculty
router.put("/:id", (req, res) => {
    const { name, email, department, phone } = req.body;

    if (!name || !name.trim()) {
        return res.status(400).json({
            message: "Faculty name is required"
        });
    }

    const sql = `
        UPDATE faculty
        SET
            name = ?,
            email = ?,
            department = ?,
            phone = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [
            name.trim(),
            email || null,
            department || null,
            phone || null,
            req.params.id
        ],
        (err, result) => {
            if (err) {
                console.error("Error updating faculty:", err);
                return res.status(500).json({
                    message: "Error updating faculty",
                    error: err.message
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Faculty member not found"
                });
            }

            res.json({
                message: "Faculty updated successfully"
            });
        }
    );
});

// DELETE faculty
router.delete("/:id", (req, res) => {
    const sql = "DELETE FROM faculty WHERE id = ?";

    db.query(sql, [req.params.id], (err, result) => {
        if (err) {
            console.error("Error deleting faculty:", err);
            return res.status(500).json({
                message: "Error deleting faculty",
                error: err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Faculty member not found"
            });
        }

        res.json({
            message: "Faculty deleted successfully"
        });
    });
});

module.exports = router;