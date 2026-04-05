import { demoAccounts } from "../constants";

export function HeroSection() {
  return (
    <section className="hero">
      <div>
        <p className="eyebrow">GoPrint Campus Printing Hub</p>
        <h1>Pesan print dan fotokopi tanpa turun ke basement.</h1>
        <p className="lead">
          MVP GoPrint ini mendukung alur nyata dari pemesanan mahasiswa atau dosen, diterima tukang
          fotokopi, diproses, sampai pesanan selesai diterima.
        </p>
      </div>

      <div className="hero-side">
        <span className="badge">Akun demo</span>
        <ul className="demo-list">
          {demoAccounts.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
