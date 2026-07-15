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

// ====== POST: Menambah Data Baru ======
app.post('/biodata', async (req, res) => {
    // Menangkap data dari Postman
    const { id, namaLengkap, nim, kelas } = req.body;

    try {
        // Menggunakan tanda kutip dua karena PostgreSQL sensitif terhadap huruf kapital (Case Sensitive)
        const queryText = 'INSERT INTO biodata("id", "namalengkap", "nim", "kelas") VALUES($1, $2, $3, $4) RETURNING *';
        const values = [id, namaLengkap, nim, kelas];
        
        const result = await pool.query(queryText, values);

        res.status(201).json({
            message: 'Berhasil menambahkan data biodata',
            data: result.rows[0]
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: err.message
        });
    }
});

// ====== PUT: Mengubah Data Berdasarkan ID ======
app.put('/biodata/:id', async (req, res) => {
    const { id } = req.params; // Mengambil ID dari URL parameter
    const { namaLengkap, nim, kelas } = req.body;

    try {
        const queryText = 'UPDATE biodata SET "namalengkap" = $1, "nim" = $2, "kelas" = $3 WHERE "id" = $4 RETURNING *';
        const values = [namaLengkap, nim, kelas, id];

        const result = await pool.query(queryText, values);

        // Validasi jika ID yang ingin diubah tidak ditemukan
        if (result.rows.length === 0) {
            return res.status(404).json({
                message: `Data dengan ID ${id} tidak ditemukan`
            });
        }

        res.status(200).json({
            message: 'Berhasil memperbarui data biodata',
            data: result.rows[0]
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: err.message
        });
    }
});

// ====== DELETE: Menghapus Data Berdasarkan ID ======
app.delete('/biodata/:id', async (req, res) => {
    const { id } = req.params; // Mengambil ID dari URL parameter

    try {
        const queryText = 'DELETE FROM biodata WHERE "id" = $1 RETURNING *';
        const result = await pool.query(queryText, [id]);

        // Validasi jika ID yang ingin dihapus tidak ditemukan
        if (result.rows.length === 0) {
            return res.status(404).json({
                message: `Data dengan ID ${id} tidak ditemukan`
            });
        }

        res.status(200).json({
            message: 'Berhasil menghapus data biodata',
            data: result.rows[0]
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: err.message
        });
    }
});

// Jalankan server Express
app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});