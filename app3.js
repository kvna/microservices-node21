const express = require('express');
const app = express();
const port = 3002;

const axios = require('axios');

// Serve HTML page
app.get('/', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:3001/get-messages');
    const messages = response.data.reverse(); // Reverse the order to have most recent messages at the top
    const formattedMessages = messages.map(message => {
      const { textInput, datetime } = message;
      const formattedDatetime = new Date(datetime).toLocaleString('en-IE', {
        dateStyle: 'short',
        timeStyle: 'medium'
      });
      return `
        <div class="message-container">
          <div class="message-text">${textInput}</div>
          <div class="message-datetime">${formattedDatetime}</div>
        </div>
      `;
    }).join('\n');
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Message Display</title>
        <style>
          .message-container {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
          }
          .message-text {
            flex: 1;
            background-color: #a6e3e9;
            border-radius: 20px;
            padding: 10px;
            margin-right: 10px;
          }
          .message-datetime {
            flex: 0 0 200px;
            background-color: #f7f09f;
            border-radius: 20px;
            padding: 10px;
          }
        </style>
        <script>
          function refreshMessages() {
            fetch('/').then(response => response.text()).then(html => {
              document.getElementById('messages-container').innerHTML = html;
            });
          }
          setInterval(refreshMessages, 5000); // Refresh every 5 seconds
        </script>
      </head>
      <body>
        <div id="messages-container">
          ${formattedMessages}
        </div>
      </body>
      </html>
    `;
    res.send(html);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching messages');
  }
});

app.listen(port, () => {
  console.log(`App3 listening at http://localhost:${port}`);
});
