import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { demoAccounts } from "../constants";
export function HeroSection() {
    return (_jsxs("section", { className: "hero", children: [_jsxs("div", { children: [_jsx("p", { className: "eyebrow", children: "GoPrint Campus Printing Hub" }), _jsx("h1", { children: "Pesan print dan fotokopi tanpa turun ke basement." }), _jsx("p", { className: "lead", children: "MVP GoPrint ini mendukung alur nyata dari pemesanan mahasiswa atau dosen, diterima tukang fotokopi, diproses, sampai pesanan selesai diterima." })] }), _jsxs("div", { className: "hero-side", children: [_jsx("span", { className: "badge", children: "Akun demo" }), _jsx("ul", { className: "demo-list", children: demoAccounts.map((item) => (_jsx("li", { children: item }, item))) })] })] }));
}
