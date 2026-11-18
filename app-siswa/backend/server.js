const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
app.use(cors());
app.use(express.json());

// Koneksi database (sesuaikan user & password MySQL Anda)
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'db_siswa',
});

// GET: ambil semua data siswa
app.get('/api/siswa', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM siswa ORDER BY id DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST: tambah siswa baru
app.post('/api/siswa', async (req, res) => {
  const { kode_siswa, nama_siswa, alamat, jurusan } = req.body;

  if (!kode_siswa || !nama_siswa || !alamat || !jurusan) {
    return res.status(400).json({ message: 'Semua field wajib diisi' });
  }

  try {
    await db.query(
      'INSERT INTO siswa (kode_siswa, nama_siswa, alamat, jurusan) VALUES (?, ?, ?, ?)',
      [kode_siswa, nama_siswa, alamat, jurusan]
    );
    res.status(201).json({ message: 'Data siswa berhasil disimpan' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Kode siswa sudah terdaftar' });
    }
    res.status(500).json({ message: err.message });
  }
});

// DELETE: hapus siswa
app.delete('/api/siswa/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM siswa WHERE id = ?', [req.params.id]);
    res.json({ message: 'Data siswa berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(5000, async () => {
  console.log('Server berjalan di http://localhost:5000');
  try {
    const conn = await db.getConnection();
    console.log('✅ Koneksi database berhasil!');

    // Hapus tabel siswas jika masih ada
    await conn.query('DROP TABLE IF EXISTS siswas');
    console.log('🗑️ Tabel siswas dihapus (jika ada)');

    // Auto-buat tabel jika belum ada
    await conn.query(`
      CREATE TABLE IF NOT EXISTS siswa (
        id INT AUTO_INCREMENT PRIMARY KEY,
        kode_siswa VARCHAR(20) UNIQUE NOT NULL,
        nama_siswa VARCHAR(100) NOT NULL,
        alamat TEXT NOT NULL,
        jurusan VARCHAR(50) NOT NULL
      )
    `);
    console.log('✅ Tabel siswa siap!');
    conn.release();
  } catch (err) {
    console.error('❌ Gagal koneksi ke database:', err.message);
  }
});