import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
    return (_jsxs("main", { className: "page-shell", children: [_jsxs("section", { className: "hero-card", children: [_jsxs("div", { className: "hero-copy", children: [_jsx("p", { className: "eyebrow", children: "GoPrint Monorepo Starter" }), _jsx("h1", { children: "Cetak dokumen kampus jadi lebih cepat, rapi, dan tanpa antre." }), _jsx("p", { className: "lead", children: "Fondasi aplikasi GoPrint ini disiapkan untuk kebutuhan pemesanan print dan fotokopi di Unpam Viktor, lengkap dengan frontend React dan backend Express yang siap dikembangkan." }), _jsxs("div", { className: "hero-actions", children: [_jsx("a", { className: "primary-btn", href: "#flow", children: "Lihat Alur" }), _jsx("a", { className: "secondary-btn", href: "#roles", children: "Peran Pengguna" })] })] }), _jsxs("div", { className: "hero-panel", children: [_jsx("span", { className: "panel-badge", children: "Siap untuk Vercel" }), _jsx("ul", { children: features.map((feature) => (_jsx("li", { children: feature }, feature))) })] })] }), _jsxs("section", { className: "content-grid", id: "flow", children: [_jsxs("article", { className: "info-card", children: [_jsx("h2", { children: "Alur Pemesanan" }), _jsx("ol", { children: orderFlow.map((step) => (_jsx("li", { children: step }, step))) })] }), _jsxs("article", { className: "info-card accent-card", children: [_jsx("h2", { children: "Catatan Operasional" }), _jsx("p", { children: "Jika user hanya memilih fotokopi, backend tetap bisa menambahkan satu print awal sebagai sumber dokumen. Konsep ini sudah dipertimbangkan di struktur database." })] })] }), _jsx("section", { className: "roles-section", id: "roles", children: roles.map((role) => (_jsxs("article", { className: "role-card", children: [_jsx("h3", { children: role.title }), _jsx("p", { children: role.description })] }, role.title))) })] }));
}
