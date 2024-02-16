const express = require('express');
const axios = require('axios');

const app = express();
const port = 3001;

const receivedMessages = [];

// Middleware to parse JSON
app.use(express.json());

// Handle root route
app.get('/', (req, res) => {
  res.send('App2 is running!');
});

// Endpoint to receive a message from app1
app.post('/receive-message', (req, res) => {
  const { textInput, datetime } = req.body; // Destructure the incoming object
  receivedMessages.push({ textInput, datetime }); // Push the message and datetime as an object to the array
  console.log(`Received message: ${textInput}`);
  console.log(`Received datetime: ${datetime}`);
  axios.post('http://localhost:3003/store-messages', [{ textInput, datetime }]); // Send the message to app4
  res.send('Message received successfully');
});

// Endpoint to get all received messages
app.get('/get-messages', (req, res) => {
  res.json(receivedMessages);
});

app.listen(port, () => {
  console.log(`App2 listening at http://localhost:${port}`);
});
