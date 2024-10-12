const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config(); // Load environment variables

const app = express();

// Connect to MongoDB Atlas
console.log('MONGODB_URI:', process.env.MONGODB_URI);

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => {
    console.error('Error connecting to MongoDB Atlas:', err);
  });

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
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle form submission
app.post('/details', async (req, res, next) => {
  const { Name, email, message } = req.body;

  // Create a new message instance
  const newMessage = new Message({ Name, email, message });

  try {
    // Save the message to the database
    await newMessage.save();
    console.log('Data saved to the database:', newMessage);

    // Redirect to details.html upon successful submission
    res.redirect('/details');
  } catch (err) {
    console.error('Error saving data to the database:', err);
    next(err); // Call the error handling middleware
  }
});

// Serve the details page
app.get('/details', (req, res) => {
  res.sendFile(path.join(__dirname, 'details.html'));
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

//https://personal-portfolio-ygwo.onrender.com