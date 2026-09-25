const express = require("express");
const router = express.Router();

const db = require("../database/db");
const bcrypt = require("bcrypt");


// ==========================================
// LOGIN
// ==========================================
router.post("/login", (req, res) => {

    const { username, password } = req.body;

    // Check username
    const sql = `
        SELECT *
        FROM users
        WHERE username = ?
    `;

    db.query(sql, [username], async (err, results) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                message: "Database error"
            });
        }


        // Username not found
        if (results.length === 0) {

            return res.status(401).json({
                message: "Invalid username or password"
            });
        }


        const user = results[0];


        // Check password
        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );


        if (!passwordMatch) {

            return res.status(401).json({
                message: "Invalid username or password"
            });
        }


        // Login successful
        res.json({
            message: "Login successful",
            user: {
                id: user.id,
                username: user.username,
                role: user.role
            }
        });

    });

});


module.exports = router;
