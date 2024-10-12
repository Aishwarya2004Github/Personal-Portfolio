const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config(); // Load environment variables

const app = express();

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('Error connecting to MongoDB Atlas:', err));

// Define the message schema
const messageSchema = new mongoose.Schema({
  Name: String,
  email: String,
  message: String
});

// Create a model for the messages
const Message = mongoose.model('Message', messageSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'));
});

// Handle form submission
app.post('/details', (req, res, next) => {
  const { Name, email, message } = req.body;

  // Create a new message instance
  const newMessage = new Message({ Name, email, message });

  // Save the message to the database
  newMessage.save((err) => {
    if (err) {
      console.error('Error saving data to the database:', err);
      next(err);
      return;
    }

    console.log('Data saved to the database:', newMessage);
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
              background-color: black;
              text-align: center;
              margin: 20% auto;
              max-width: 600px;
              padding: 20px;
              border-radius: 10px;
              box-shadow: 0 0 10px #04fc43;
            }
            h1 {
              color: #d13639;
            }
            p {
              color: #ff04f;
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
          <p>Your form has been submitted successfully.</p>
          <p><a href="/">Go back to the form</a></p>
      </body>
      </html>
    `);
  });
});

// Serve static files
app.use(express.static('public'));
app.use('/images', express.static(path.join(__dirname, 'images')));

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
