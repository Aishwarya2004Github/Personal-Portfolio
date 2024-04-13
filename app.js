const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path'); // Import the 'path' module

const app = express();

// Create a connection to the MySQL database
const db = mysql.createConnection({
  host: '',
  user: '',
  password: '',
  database: 'details',
});

// Connect to the MySQL database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'));
});

// Handle form submission
app.post('/details', (req, res, next) => {
  const { Name, email, message } = req.body;

  const sql = `INSERT INTO messages (Name, email, message) VALUES (?, ?, ?)`;

  const values = [Name, email, message];

  // Execute the SQL query
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error inserting data into the database:', err);
      next(err);
      return;
    }

    console.log('Data inserted into the database:', result);
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Form Submission Success</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: black; /* Changed background color to black */
              text-align: center;
              margin: 20% auto;
              max-width: 600px;
              padding: 20px;
              border-radius: 10px;
              box-shadow: 0 0 10px #04fc43; /* Changed box shadow color to #41aefa */
            }
            
            h1 {
              color: #d13639;
            }
            
            p {
              color: #ff04f; /* Changed color to pink */
            }
            
            a {
              color: #3498db;
              text-decoration: none;
            }
            
            a:hover {
              text-decoration: underline;
            }
          </style>
      </head>
      <body>
          <h1>Form Submitted Successfully</h1>
          <p>Your form has been submitted successfully </p>
          <p>
              <a href="/">Go back to the form</a>
          </p>
      </body>
      </html>
    `);
  });
});

// Serve static files
app.use(express.static('public')); // Serve static files from the 'public' directory
app.use('/images', express.static(path.join(__dirname, 'images'))); // Serve static files from the 'images' directory

// Error-handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Internal Server Error');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
