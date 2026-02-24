const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Database connection
const pool = new Pool({
  host: '10.208.192.3',
  user: 'postgres',
  password: 'renad1234',
  database: 'postgres',
  port: 5432
});

// Login page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

// Login verification
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND password = $2',
      [email, password]
    );
    
    if (result.rows.length > 0) {
      res.send('<h1>Welcome ' + result.rows[0].name + '!</h1><p>Login successful!</p><a href="/">Go back</a>');
    } else {
      res.send('<h1>Error!</h1><p>Wrong email or password</p><a href="/">Try again</a>');
    }
  } catch (err) {
    res.send('<h1>Server Error</h1><p>' + err.message + '</p>');
  }
});

// Start server
app.listen(3000, () => {
  console.log('Server running on port 3000');
});
