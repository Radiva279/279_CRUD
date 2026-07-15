const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = 3000;

// Konfigurasi koneksi database PostgreSQL
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'mahasiswa',
    password: 'Radiva1211',
    port: 5432,
});

// Cek koneksi database
pool.connect()
    .then(() => console.log('Database terkoneksi'))
    .catch(err => console.log(err));

// Middleware untuk membaca request body berbentuk JSON
app.use(express.json());

// ====== GET: Cek API Berjalan ======
app.get('/', (req, res) => {
    res.send('API Berjalan');
});

// ====== GET: Mengambil Semua Data Biodata ======
app.get('/biodata', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM biodata');

        res.status(200).json({
            message: 'Berhasil mengambil data biodata',
            data: result.rows
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: err.message
        });
    }
});

