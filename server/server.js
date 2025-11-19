require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from parent folder (project root) so visiting / returns index.html
const staticRoot = path.join(__dirname, '..');
app.use(express.static(staticRoot));

const PORT = process.env.PORT || 3000;

let pool;
async function initDb(){
  pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'stevens_computer',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
  // Test connection
  await pool.query('SELECT 1');
}

app.post('/api/contact', async (req, res) => {
  const payload = req.body || {};
  console.log('Incoming /api/contact payload:', payload);

  const { name, email, phone, message } = payload;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  if (!pool) {
    console.error('DB pool not initialized');
    return res.status(500).json({ error: 'Database not available' });
  }

  try {
    const sql = `INSERT INTO contacts (name, email, phone, message) VALUES (?, ?, ?, ?)`;
    const [result] = await pool.execute(sql, [name, email, phone || '', message || '']);
    console.log('Inserted contact id=', result.insertId);
    return res.json({ success: true, id: result.insertId, message: 'Pesan berhasil dikirim. Terima kasih!' });
  } catch (err) {
    console.error('DB insert error', err && err.message ? err.message : err);
    return res.status(500).json({ error: 'Database error', details: err && err.message });
  }
});

// Debug: list recent contacts (safe for dev only)
app.get('/api/contacts', async (req, res) => {
  if (!pool) return res.status(500).json({ error: 'Database not available' });
  try {
    const [rows] = await pool.query('SELECT id, name, email, phone, message, created_at FROM contacts ORDER BY id DESC LIMIT 50');
    return res.json(rows);
  } catch (err) {
    console.error('DB select error', err && err.message ? err.message : err);
    return res.status(500).json({ error: 'Database error' });
  }
});

// Fallback: for any other GET request that isn't an API route, serve index.html
app.get('*', (req, res, next) => {
  if (req.method !== 'GET' || req.path.startsWith('/api/')) return next();
  res.sendFile(path.join(staticRoot, 'index.html'));
});

app.listen(PORT, async ()=>{
  try{
    await initDb();
    console.log(`Server listening on port ${PORT}`);
  }catch(err){
    console.error('Failed connecting to DB', err);
    process.exit(1);
  }
});
