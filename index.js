const express = require('express');
const cors = require('cors');
const { default: fetch } = require('node-fetch');
const parse = require('csv-parse/lib/sync');
const path = require('path');

const app = express();
const port = 3000;

app.use(cors());

// Serve static files from the 'public' directory.
app.use(express.static(path.join(__dirname, 'public')));

// Define a route for the root path that sends the 'index.html' file.
app.get('/', (res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/search-csv', async (req, res) => {
  const inputValue = req.query.inputValue;
  const csvUrl =
    'https://stone-nomads-web.s3.us-west-1.amazonaws.com/allowlist-test-2.csv';

  try {
    // Fetch CSV data.
    const response = await fetch(csvUrl);
    const csvData = await response.text();

    // Parse CSV data.
    const records = parse(csvData, { columns: true });

    // Check if inputValue is present in the CSV data.
    const isValuePresent = records.some((record) =>
      Object.values(record).some((value) => value.includes(inputValue))
    );

    // Send the result back to the client.
    res.json({ isValuePresent });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
