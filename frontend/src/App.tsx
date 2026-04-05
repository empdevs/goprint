const features = [
  "Upload dokumen print dan fotokopi dari mana saja",
  "Pantau status pesanan secara real-time",
  "Pilih ambil sendiri atau diantar",
  "Kelola pesanan untuk admin dan tukang fotokopi"
];

const orderFlow = [
  "Unggah file dokumen",
  "Atur jumlah print dan fotokopi",
  "Pilih metode pengambilan dan pembayaran",
  "Pantau status sampai pesanan selesai"
];

const roles = [
  {
    title: "Mahasiswa / Dosen",
    description: "Membuat pesanan, upload file, memilih metode pengambilan, dan memantau progres."
  },
  {
    title: "Tukang Fotokopi",
    description: "Menerima order, memproses file, dan memperbarui status pesanan."
  },
  {
    title: "Admin",
    description: "Memantau pengguna, pesanan, dan penyedia jasa dalam satu dashboard."
  }
];

export default function App() {
  return (
    <main className="page-shell">
      <section className="hero-card">
        <div className="hero-copy">
          <p className="eyebrow">GoPrint Monorepo Starter</p>
          <h1>Cetak dokumen kampus jadi lebih cepat, rapi, dan tanpa antre.</h1>
          <p className="lead">
            Fondasi aplikasi GoPrint ini disiapkan untuk kebutuhan pemesanan print dan fotokopi di
            Unpam Viktor, lengkap dengan frontend React dan backend Express yang siap dikembangkan.
          </p>

          <div className="hero-actions">
            <a className="primary-btn" href="#flow">
              Lihat Alur
            </a>
            <a className="secondary-btn" href="#roles">
              Peran Pengguna
            </a>
          </div>
        </div>

        <div className="hero-panel">
          <span className="panel-badge">Siap untuk Vercel</span>
          <ul>
            {features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="content-grid" id="flow">
        <article className="info-card">
          <h2>Alur Pemesanan</h2>
          <ol>
            {orderFlow.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </article>

        <article className="info-card accent-card">
          <h2>Catatan Operasional</h2>
          <p>
            Jika user hanya memilih fotokopi, backend tetap bisa menambahkan satu print awal sebagai
            sumber dokumen. Konsep ini sudah dipertimbangkan di struktur database.
          </p>
        </article>
      </section>

      <section className="roles-section" id="roles">
        {roles.map((role) => (
          <article className="role-card" key={role.title}>
            <h3>{role.title}</h3>
            <p>{role.description}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
