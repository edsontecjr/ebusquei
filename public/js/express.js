import express from 'express';
import pool from './db'; // ou seu ORM
import cors from 'cors';
app.use(cors());  // libera todas as origens



const app = express();

app.get('/check-username', async (req, res) => {
  const name = req.query.name?.toString().trim().toLowerCase();
  const [rows] = await pool.query(
    'SELECT id FROM users WHERE LOWER(name) = ? LIMIT 1',
    [name]
  );
  res.json({ exists: rows.length > 0 });
});

app.get('/check-email', async (req, res) => {
  const email = req.query.email?.toString().trim().toLowerCase();
  const [rows] = await pool.query(
    'SELECT id FROM users WHERE LOWER(email) = ? LIMIT 1',
    [email]
  );
  res.json({ exists: rows.length > 0 });
});

function debounce(fn, wait) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn(...args), wait);
    };
  }
  