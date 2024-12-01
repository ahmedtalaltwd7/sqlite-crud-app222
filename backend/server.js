const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Database connection
const db = new sqlite3.Database(path.join(__dirname, '../database.sqlite'), (err) => {
    if (err) {
        console.error('Error opening database', err);
    } else {
        console.log('Connected to SQLite database');
        // Create table after successful connection
        createTable();
    }


});

// Create table function
function createTable() {
    const createTableQuery = `CREATE TABLE IF NOT EXISTS entries1 (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        field1 TEXT,
        field2 TEXT,
        field3 TEXT,
        field4 TEXT,
        field5 TEXT,
        field6 TEXT,
        field7 TEXT,
        field8 TEXT,
        field9 TEXT,
        field10 TEXT,
        field11 TEXT
    )`;
    
    db.run(createTableQuery, (err) => {
        if (err) {
            console.error('Error creating table:', err);
        } else {
            console.log('Table created or already exists');
        }
    });
}

// Routes
app.post('/add-entry', (req, res) => {
    console.log('Received POST request with data:', req.body);
    const { 
        field1, field2, field3, field4, field5, 
        field6, field7, field8, field9, field10, field11 
    } = req.body;

    const query = `INSERT INTO entries1 
    (field1, field2, field3, field4, field5, 
     field6, field7, field8, field9, field10, field11) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.run(query, [
        field1, field2, field3, field4, field5, 
        field6, field7, field8, field9, field10, field11
    ], function(err) {
        if (err) {
            console.error('Error inserting entry:', err);
            return res.status(500).json({ error: err.message });
        }
        console.log('Entry added successfully, ID:', this.lastID);
        res.json({ id: this.lastID });
    });
});

app.get('/get-entries', (req, res) => {
    console.log('Received GET request for entries');
    db.all('SELECT * FROM entries1', [], (err, rows) => {
        if (err) {
            console.error('Error fetching entries1:', err);
            return res.status(500).json({ error: err.message });
        }
        console.log('Sending entries:', rows);
        res.json(rows);
    });
});

app.put('/update-entry/:id', (req, res) => {
    console.log('Received PUT request for ID:', req.params.id);
    const { id } = req.params;
    const { 
        field1, field2, field3, field4, field5, 
        field6, field7, field8, field9, field10, field11 
    } = req.body;

    const query = `UPDATE entries1 SET 
    field1=?, field2=?, field3=?, field4=?, field5=?, 
    field6=?, field7=?, field8=?, field9=?, field10=?, field11=? 
    WHERE id=?`;

    db.run(query, [
        field1, field2, field3, field4, field5, 
        field6, field7, field8, field9, field10, field11, id
    ], function(err) {
        if (err) {
            console.error('Error updating entry:', err);
            return res.status(500).json({ error: err.message });
        }
        console.log('Entry updated successfully');
        res.json({ changes: this.changes });
    });
});

app.delete('/delete-entry/:id', (req, res) => {
    console.log('Received DELETE request for ID:', req.params.id);
    const { id } = req.params;
    db.run('DELETE FROM entries1 WHERE id=?', id, function(err) {
        if (err) {
            console.error('Error deleting entry:', err);
            return res.status(500).json({ error: err.message });
        }
        console.log('Entry deleted successfully');
        res.json({ deleted: this.changes });
    });
});

// Serve frontend files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.get('/view.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/view.html'));
});

// Use a higher port and bind to localhost
const PORT = process.env.PORT || 8080;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
