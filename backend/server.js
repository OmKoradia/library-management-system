const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Books
const booksRoutes = require("./routes/books");
app.use("/api/books", booksRoutes);

// Students
const studentsRoutes = require("./routes/students");
app.use("/api/students", studentsRoutes);

// Faculty
const facultyRoutes = require("./routes/faculty");
app.use("/api/faculty", facultyRoutes);

// Records
const recordsRoutes = require("./routes/records");
app.use("/api/records", recordsRoutes);

// Authentication
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

// Book Orders
const ordersRoutes = require("./routes/orders");
app.use("/api/orders", ordersRoutes);

// Home
app.get("/", (req, res) => {
    res.send("Library Management System Backend is Running");
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});