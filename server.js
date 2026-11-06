
const express = require("express");
const mysql = require("mysql2");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "sri usha",
    database: "vehicle_rental"
});

db.connect((err) => {
    if (err) {
        console.log("Database connection error:", err.message);
        return;
    }
    console.log("MySQL connected successfully!");
});

app.get("/api/vehicles", (req, res) => {
    db.query("SELECT * FROM vehicles", (err, rows) => {
        if (err) return res.status(500).json({ message: err.message });
        res.json(rows);
    });
});

app.post("/api/vehicles", (req, res) => {
    const { vehicle_num, vehicle_time, model, rent_per_day, status } = req.body;

    const sql = `INSERT INTO vehicles
        (vehicle_num, vehicle_time, model, rent_per_day, status)
        VALUES (?, ?, ?, ?, ?)`;

    db.query(sql, [vehicle_num, vehicle_time, model, rent_per_day, status],
        (err, result) => {
            if (err) return res.status(400).json({ message: err.message });
            res.status(201).json({
                message: "Vehicle added successfully",
                vehicle_id: result.insertId
            });
        });
});

app.get("/api/vehicles/:id", (req, res) => {
    db.query(
        "SELECT * FROM vehicles WHERE vehicle_id = ?",
        [req.params.id],
        (err, rows) => {
            if (err) return res.status(500).json({ message: err.message });
            if (rows.length === 0) {
                return res.status(404).json({ message: "Vehicle not found" });
            }
            res.json(rows[0]);
        }
    );
});

app.put("/api/vehicles/:id", (req, res) => {
    const { vehicle_num, vehicle_time, model, rent_per_day, status } = req.body;

    const sql = `UPDATE vehicles
        SET vehicle_num = ?, vehicle_time = ?, model = ?,
            rent_per_day = ?, status = ?
        WHERE vehicle_id = ?`;

    db.query(sql, [
        vehicle_num, vehicle_time, model,
        rent_per_day, status, req.params.id
    ], (err, result) => {
        if (err) return res.status(400).json({ message: err.message });
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Vehicle not found" });
        }
        res.json({ message: "Vehicle updated successfully" });
    });
});

app.delete("/api/vehicles/:id", (req, res) => {
    db.query(
        "DELETE FROM vehicles WHERE vehicle_id = ?",
        [req.params.id],
        (err, result) => {
            if (err) return res.status(500).json({ message: err.message });
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Vehicle not found" });
            }
            res.json({ message: "Vehicle deleted successfully" });
        }
    );
});

app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});
