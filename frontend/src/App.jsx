import { useEffect, useState } from 'react';
import './App.css';

const API_URL = 'http://localhost:5000/api/siswa';

const DAFTAR_JURUSAN = ['TKJ', 'RPL', 'Multimedia', 'Akuntansi', 'Perkantoran'];

function App() {
  const [form, setForm] = useState({
    kode_siswa: '',
    nama_siswa: '',
    alamat: '',
    jurusan: '',
  });
  const [dataSiswa, setDataSiswa] = useState([]);
  const [pesan, setPesan] = useState('');

  const ambilData = async () => {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    setDataSiswa(Array.isArray(data) ? data : []);
  } catch (err) {
    setPesan('Gagal terhubung ke server');
  }
};

  useEffect(() => {
    ambilData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const hasil = await res.json();
      setPesan(hasil.message);

      if (res.ok) {
        setForm({ kode_siswa: '', nama_siswa: '', alamat: '', jurusan: '' });
        ambilData();
      }
    } catch (err) {
      setPesan('❌ Gagal terhubung ke server. Pastikan backend sudah berjalan.');
    }
  };

  const handleHapus = async (id) => {
    if (!window.confirm('Yakin ingin menghapus data ini?')) return;
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    ambilData();
  };

  return (
    <div className="container">
      <h1>Input Data Siswa</h1>

      <form onSubmit={handleSubmit}>
        <label>Kode Siswa</label>
        <input
          type="text"
          name="kode_siswa"
          value={form.kode_siswa}
          onChange={handleChange}
          placeholder="Contoh: S001"
        />

        <label>Nama Siswa</label>
        <input
          type="text"
          name="nama_siswa"
          value={form.nama_siswa}
          onChange={handleChange}
          placeholder="Nama lengkap"
        />

        <label>Alamat</label>
        <textarea
          name="alamat"
          value={form.alamat}
          onChange={handleChange}
          placeholder="Alamat lengkap"
        />

        <label>Jurusan</label>
        <select name="jurusan" value={form.jurusan} onChange={handleChange}>
          <option value="">-- Pilih Jurusan --</option>
          {DAFTAR_JURUSAN.map((j) => (
            <option key={j} value={j}>{j}</option>
          ))}
        </select>

        <button type="submit">Simpan</button>
        {pesan && <p className="pesan">{pesan}</p>}
      </form>

      <h2>Daftar Siswa</h2>
      <table>
        <thead>
          <tr>
            <th>No</th>
            <th>Kode</th>
            <th>Nama</th>
            <th>Alamat</th>
            <th>Jurusan</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {dataSiswa.map((s, i) => (
            <tr key={s.id}>
              <td>{i + 1}</td>
              <td>{s.kode_siswa}</td>
              <td>{s.nama_siswa}</td>
              <td>{s.alamat}</td>
              <td>{s.jurusan}</td>
              <td>
                <button onClick={() => handleHapus(s.id)}>Hapus</button>
              </td>
            </tr>
          ))}
          {dataSiswa.length === 0 && (
            <tr><td colSpan="6">Belum ada data</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;