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
  console.log('Received POST request to /api/updateAccounts with body:', req.body);

  try {
    const accountsFilePath = path.join(__dirname, 'accounts.json');
    const accountsData = await fs.readFile(accountsFilePath, 'utf8');
    const accounts = JSON.parse(accountsData);

    const { username, newUsername, newPassword } = req.body;

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
    const accountsData = await fs.readFile(accountsFilePath, 'utf8');
    const accounts = JSON.parse(accountsData);

    const usernameExists = accounts.some(account => account.username === username);

    res.status(200).json({ exists: usernameExists });
  } catch (error) {
    console.error('Error checking username:', error);

    if (error.code === 'ENOENT') {
      return res.status(404).json({ error: 'Accounts file not found' });
    }

    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
