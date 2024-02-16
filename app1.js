const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;

// Middleware to parse JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve HTML page with form
app.get('/', (req, res) => {
  res.send(`
    <form id="messageForm" action="/send-message" method="POST">
      <input type="text" id="messageInput" name="message" placeholder="Enter your message">
      <button type="submit">Send</button>
    </form>
    <script>
      document.addEventListener('DOMContentLoaded', function() {
        const messageInput = document.getElementById('messageInput');
        messageInput.focus(); // Focus on the input field when the page is loaded
      });
    </script>
  `);
});

// Endpoint to send a message to app2
app.post('/send-message', async (req, res) => {
  const message = req.body.message;
  const datetime = new Date().toISOString(); // Get current datetime

  try {
    await axios.post('http://localhost:3001/receive-message', {
      textInput: message, // Sending 'textInput' instead of 'message'
      datetime // Sending 'datetime'
    });
    res.redirect('/'); // Redirect back to the form after submission
  } catch (error) {
    console.error(error);
    res.status(500).send('Error sending message');
  }
});

app.listen(port, () => {
  console.log(`App1 listening at http://localhost:${port}`);
});
