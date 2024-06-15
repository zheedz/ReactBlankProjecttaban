const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Server is running');
});

app.post('/api/updateAccounts', async (req, res) => {
  try {
    // Read accounts data from file
    const accountsFilePath = path.join(__dirname, 'accounts.json');
    const accountsData = await fs.readFile(accountsFilePath, 'utf8');
    const accounts = JSON.parse(accountsData);

    const { username, newUsername, newPassword } = req.body;

    // Update account
    let accountUpdated = false;
    const updatedAccounts = accounts.map(account => {
      if (account.username === username) {
        accountUpdated = true;
        return { ...account, username: newUsername || account.username, password: newPassword || account.password };
      }
      return account;
    });

    if (!accountUpdated) {
      return res.status(404).json({ error: 'Account not found' });
    }

    // Write updated accounts back to file
    await fs.writeFile(accountsFilePath, JSON.stringify(updatedAccounts, null, 2), 'utf8');

    res.status(200).json({ message: 'Account updated successfully' });
  } catch (err) {
    console.error('Error updating account:', err);
    res.status(500).json({ error: 'Failed to update account', details: err.message });
  }
});

app.get('/api/checkUsername', async (req, res) => {
  console.log('Received GET request to /api/checkUsername with query:', req.query);
  const { username } = req.query;
  const accountsFilePath = path.join(__dirname, 'accounts.json');

  try {
    // Read accounts data from file
    const accountsData = await fs.readFile(accountsFilePath, 'utf8');
    const accounts = JSON.parse(accountsData);

    // Check if username exists
    const usernameExists = accounts.some(account => account.username === username);

    // Respond based on username availability
    if (usernameExists) {
      res.status(200).json({ exists: true, message: 'Username already taken' });
    } else {
      res.status(404).json({ exists: false, message: 'Username available' });
    }
  } catch (error) {
    

    // Handle specific errors
    if (error.code === 'ENOENT') {
      return res.status(404).json({ error: 'Accounts file not found' });
    }

    // Handle generic error
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});


// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
