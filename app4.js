const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3003;

// Middleware to parse JSON
app.use(express.json());

// Endpoint to receive messages from app2 and store them in a JSON file
app.post('/store-messages', (req, res) => {
  const messages = req.body;
  const filePath = path.join(__dirname, 'messages.json');

  try {
    // Read existing messages from the JSON file, or create an empty array if the file doesn't exist
    const existingMessages = fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath)) : [];
    
    // Append new messages to the existing array
    const updatedMessages = [...existingMessages, ...messages];

    // Write the updated messages back to the JSON file
    fs.writeFileSync(filePath, JSON.stringify(updatedMessages, null, 2));
    
    res.sendStatus(200); // Send success response
  } catch (error) {
    console.error(error);
    res.status(500).send('Error storing messages');
  }
});

app.listen(port, () => {
  console.log(`Message storage server listening at http://localhost:${port}`);
});
