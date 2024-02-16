const express = require('express');
const axios = require('axios');
const { CosmosClient } = require('@azure/cosmos');

const app = express();
const port = 3004;

// Azure Cosmos DB configuration
const cosmosClient = new CosmosClient({
  endpoint: '<your-cosmosdb-endpoint>',
  key: '<your-cosmosdb-key>',
});

const databaseId = '<your-database-id>';
const containerId = '<your-container-id>';

// Middleware to parse JSON
app.use(express.json());

// Initialize Cosmos DB database and container
async function initializeDatabaseAndContainer() {
  const { database } = await cosmosClient.databases.createIfNotExists({ id: databaseId });
  const { container } = await database.containers.createIfNotExists({ id: containerId });
  return container;
}

// Store messages in Azure Cosmos DB
async function storeMessages(messages) {
  const container = await initializeDatabaseAndContainer();
  const { resources } = await container.items.create(messages);
  console.log(`${resources.length} messages stored in Cosmos DB`);
}

// Endpoint to receive messages from app2 and store them in Azure Cosmos DB
app.post('/store-messages', (req, res) => {
  const messages = req.body;
  storeMessages(messages)
    .then(() => res.sendStatus(200))
    .catch(error => {
      console.error('Error storing messages in Cosmos DB:', error);
      res.status(500).send('Error storing messages in Cosmos DB');
    });
});

app.listen(port, () => {
  console.log(`Message storage server listening at http://localhost:${port}`);
});
