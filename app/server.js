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

// Login verification - both paths
app.post('/login', loginHandler);
app.post('/app/login', loginHandler);

async function loginHandler(req, res) {
  const { email, password } = req.body;
  
  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND password = $2',
      [email, password]
    );
    
    if (result.rows.length > 0) {
      res.send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Welcome</title>
          <style>
            body { font-family: Arial; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-align: center; }
            .box { background: rgba(255,255,255,0.1); padding: 40px; border-radius: 15px; }
            a { color: white; }
          </style>
        </head>
        <body>
          <div class="box">
            <h1>Welcome ${result.rows[0].name}!</h1>
            <p>Login successful!</p>
            <a href="/">Back to Home</a>
          </div>
        </body>
        </html>
      `);
    } else {
      res.send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Error</title>
          <style>
            body { font-family: Arial; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: linear-gradient(135deg, #ee7752 0%, #e73c7e 100%); color: white; text-align: center; }
            .box { background: rgba(255,255,255,0.1); padding: 40px; border-radius: 15px; }
            a { color: white; }
          </style>
        </head>
        <body>
          <div class="box">
            <h1>Error!</h1>
            <p>Wrong email or password</p>
            <a href="/app/">Try again</a>
          </div>
        </body>
        </html>
      `);
    }
  } catch (err) {
    res.send('<h1>Server Error</h1><p>' + err.message + '</p>');
  }
}

// Start server
app.listen(3000, () => {
  console.log('Server running on port 3000');
});
