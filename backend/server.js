const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database connection setup
const db = mysql.createConnection({
  host: 'bylprpeh7xvpuymy9sn6-mysql.services.clever-cloud.com',
  user: 'u48plpfchgkn7voe', // Your MySQL username
  password: '9mHgxC3xgjiESi2Elkvy', // Your MySQL password
  database: 'bylprpeh7xvpuymy9sn6', // Your MySQL database name
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database');
});

// Endpoint to handle employee addition
app.post('/api/employees/add', (req, res) => {
  const { name, employee_id, email, phone_number, department, date_of_joining, role } = req.body;

  // Validate request body
  if (!name || !employee_id || !email || !phone_number || !department || !date_of_joining || !role) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Check if the email or employee ID already exists
  const checkQuery = 'SELECT * FROM employees WHERE email = ? OR employee_id = ?';
  db.query(checkQuery, [email, employee_id], (err, result) => {
    if (err) {
      console.error('Error checking for duplicates:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }

    if (result.length > 0) {
      return res.status(400).json({ message: 'Email or Employee ID already exists' });
    }

    // Insert the new employee into the database
    const query = `
      INSERT INTO employees (name, employee_id, email, phone_number, department, date_of_joining, role)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(
      query,
      [name, employee_id, email, phone_number, department, date_of_joining, role],
      (err) => {
        if (err) {
          console.error('Error inserting data into the database:', err);
          return res.status(500).json({ message: 'Error adding employee' });
        }
        res.status(201).json({ message: 'Employee added successfully' });
      }
    );
  });
})
app.get('/api/employees/all', (req, res) => {
  const query = 'SELECT * FROM employees';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching employees:', err);
      return res.status(500).json({ message: 'Error fetching employees' });
    }
    res.status(200).json(results);
  });
});



app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
