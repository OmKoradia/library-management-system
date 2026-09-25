const express = require("express");
const cors = require("cors");

const app = express();


// ============================================================
// MIDDLEWARE
// ============================================================

app.use(cors());
app.use(express.json());


// ============================================================
// ROUTES
// ============================================================

const booksRoutes = require("./routes/books");
app.use("/api/books", booksRoutes);

const studentsRoutes = require("./routes/students");
app.use("/api/students", studentsRoutes);

const facultyRoutes = require("./routes/faculty");
app.use("/api/faculty", facultyRoutes);

const recordsRoutes = require("./routes/records");
app.use("/api/records", recordsRoutes);

const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

const ordersRoutes = require("./routes/orders");
app.use("/api/orders", ordersRoutes);


// ============================================================
// TEST ROUTE
// ============================================================

app.get("/", (req, res) => {
    res.send("Library Management System Backend is Running");
});


// ============================================================
// SERVER
// ============================================================

// Render provides the PORT through environment variables.
// For local testing, it will use port 3000.

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
