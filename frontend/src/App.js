import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000/api";
const SESSION_KEY = "goprint-session";
const demoAccounts = [
    "Admin: admin@goprint.local / admin123",
    "Copy shop: copyshop@goprint.local / copy123",
    "Student: student@goprint.local / student123"
];
const roleLabels = {
    admin: "Admin",
    copy_shop: "Tukang Fotokopi",
    student: "Mahasiswa",
    lecturer: "Dosen"
};
const statusTone = {
    pending: "tone-yellow",
    confirmed: "tone-blue",
    processing: "tone-blue",
    ready_for_pickup: "tone-green",
    out_for_delivery: "tone-blue",
    completed: "tone-green",
    cancelled: "tone-red"
};
const initialRegisterForm = {
    fullName: "",
    email: "",
    phone: "",
    nim: "",
    studyProgram: "",
    password: "",
    role: "student",
    campusLocation: ""
};
const initialOrderForm = {
    fileName: "",
    fileType: "pdf",
    printQty: 1,
    copyQty: 0,
    bindingQty: 0,
    description: "",
    notes: "",
    pickupMethod: "pickup",
    paymentMethod: "cash",
    deliveryAddress: "",
    orderNotes: ""
};
async function apiRequest(path, options = {}, token) {
    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(options.headers ?? {})
        }
    });
    const payload = (await response.json());
    if (!response.ok || !payload.success) {
        throw new Error(payload.message ?? "Request gagal");
    }
    return payload;
}
function readFileAsBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result;
            if (typeof result !== "string") {
                reject(new Error("File tidak dapat dibaca"));
                return;
            }
            const [, base64] = result.split(",");
            if (!base64) {
                reject(new Error("Format file tidak valid"));
                return;
            }
            resolve(base64);
        };
        reader.onerror = () => reject(new Error("Gagal membaca file"));
        reader.readAsDataURL(file);
    });
}
export default function App() {
    const [session, setSession] = useState(null);
    const [authMode, setAuthMode] = useState("login");
    const [loginEmail, setLoginEmail] = useState("student@goprint.local");
    const [loginPassword, setLoginPassword] = useState("student123");
    const [registerForm, setRegisterForm] = useState(initialRegisterForm);
    const [orderForm, setOrderForm] = useState(initialOrderForm);
    const [selectedFile, setSelectedFile] = useState(null);
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState("Silakan login untuk mulai menggunakan GoPrint.");
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        const rawSession = window.localStorage.getItem(SESSION_KEY);
        if (!rawSession)
            return;
        setSession(JSON.parse(rawSession));
    }, []);
    useEffect(() => {
        if (!session)
            return;
        window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
        void loadDashboardData(session);
    }, [session]);
    async function loadDashboardData(activeSession) {
        setIsLoading(true);
        try {
            const [ordersResponse, usersResponse] = await Promise.all([
                apiRequest("/orders", {}, activeSession.token),
                apiRequest("/users", {}, activeSession.token)
            ]);
            setOrders(ordersResponse.data);
            setUsers(usersResponse.data);
            setMessage(`Halo ${activeSession.user.fullName}, dashboard GoPrint siap digunakan.`);
        }
        catch (error) {
            setMessage(error instanceof Error ? error.message : "Gagal memuat dashboard");
        }
        finally {
            setIsLoading(false);
        }
    }
    async function handleLogin(event) {
        event.preventDefault();
        setIsLoading(true);
        try {
            const response = await apiRequest("/auth/login", {
                method: "POST",
                body: JSON.stringify({ email: loginEmail, password: loginPassword })
            });
            setSession(response.data);
        }
        catch (error) {
            setMessage(error instanceof Error ? error.message : "Login gagal");
        }
        finally {
            setIsLoading(false);
        }
    }
    async function handleRegister(event) {
        event.preventDefault();
        setIsLoading(true);
        try {
            const response = await apiRequest("/auth/register", {
                method: "POST",
                body: JSON.stringify(registerForm)
            });
            setSession(response.data);
            setRegisterForm(initialRegisterForm);
        }
        catch (error) {
            setMessage(error instanceof Error ? error.message : "Register gagal");
        }
        finally {
            setIsLoading(false);
        }
    }
    async function handleCreateOrder(event) {
        event.preventDefault();
        if (!session)
            return;
        setIsLoading(true);
        try {
            if (!selectedFile) {
                throw new Error("Silakan pilih file dokumen terlebih dahulu");
            }
            const base64Content = await readFileAsBase64(selectedFile);
            const uploadResponse = await apiRequest("/uploads", {
                method: "POST",
                body: JSON.stringify({
                    fileName: selectedFile.name,
                    contentType: selectedFile.type || "application/octet-stream",
                    base64Content
                })
            }, session.token);
            const response = await apiRequest("/orders", {
                method: "POST",
                body: JSON.stringify({
                    pickupMethod: orderForm.pickupMethod,
                    paymentMethod: orderForm.paymentMethod,
                    deliveryAddress: orderForm.deliveryAddress,
                    notes: orderForm.orderNotes,
                    items: [
                        {
                            fileName: orderForm.fileName || selectedFile.name,
                            fileUrl: uploadResponse.data.url,
                            fileType: orderForm.fileType || selectedFile.type || "document",
                            printQty: Number(orderForm.printQty),
                            copyQty: Number(orderForm.copyQty),
                            bindingQty: Number(orderForm.bindingQty),
                            description: orderForm.description,
                            notes: orderForm.notes
                        }
                    ]
                })
            }, session.token);
            setOrders((currentOrders) => [response.data, ...currentOrders]);
            setOrderForm(initialOrderForm);
            setSelectedFile(null);
            setMessage(`Pesanan ${response.data.orderCode} berhasil dibuat.`);
        }
        catch (error) {
            setMessage(error instanceof Error ? error.message : "Gagal membuat pesanan");
        }
        finally {
            setIsLoading(false);
        }
    }
    async function handleStatusChange(order, status) {
        if (!session)
            return;
        setIsLoading(true);
        try {
            const response = await apiRequest(`/orders/${order.id}`, { method: "PATCH", body: JSON.stringify({ status }) }, session.token);
            setOrders((currentOrders) => currentOrders.map((currentOrder) => (currentOrder.id === order.id ? response.data : currentOrder)));
            setMessage(`Status ${order.orderCode} diperbarui menjadi ${status}.`);
        }
        catch (error) {
            setMessage(error instanceof Error ? error.message : "Gagal update status");
        }
        finally {
            setIsLoading(false);
        }
    }
    async function handleDeleteOrder(orderId) {
        if (!session)
            return;
        setIsLoading(true);
        try {
            await apiRequest(`/orders/${orderId}`, { method: "DELETE" }, session.token);
            setOrders((currentOrders) => currentOrders.filter((order) => order.id !== orderId));
            setMessage("Pesanan berhasil dihapus.");
        }
        catch (error) {
            setMessage(error instanceof Error ? error.message : "Gagal menghapus pesanan");
        }
        finally {
            setIsLoading(false);
        }
    }
    function logout() {
        setSession(null);
        setOrders([]);
        setUsers([]);
        window.localStorage.removeItem(SESSION_KEY);
        setMessage("Anda telah logout dari GoPrint.");
    }
    return (_jsxs("main", { className: "app-shell", children: [_jsxs("section", { className: "hero", children: [_jsxs("div", { children: [_jsx("p", { className: "eyebrow", children: "GoPrint Campus Printing Hub" }), _jsx("h1", { children: "Pesan print dan fotokopi tanpa turun ke basement." }), _jsx("p", { className: "lead", children: "MVP ini sudah memuat login/register, pembuatan order, pelacakan status, dan dashboard berbeda untuk admin, tukang fotokopi, serta mahasiswa/dosen." })] }), _jsxs("div", { className: "hero-side", children: [_jsx("span", { className: "badge", children: "Akun demo" }), _jsx("ul", { className: "demo-list", children: demoAccounts.map((item) => (_jsx("li", { children: item }, item))) })] })] }), _jsxs("section", { className: "status-bar", children: [_jsx("span", { children: message }), isLoading ? _jsx("strong", { children: "Memproses..." }) : _jsx("strong", { children: "Siap" })] }), !session ? (_jsxs("section", { className: "auth-layout", children: [_jsxs("article", { className: "card", children: [_jsxs("div", { className: "tab-row", children: [_jsx("button", { className: authMode === "login" ? "tab active" : "tab", onClick: () => setAuthMode("login"), type: "button", children: "Login" }), _jsx("button", { className: authMode === "register" ? "tab active" : "tab", onClick: () => setAuthMode("register"), type: "button", children: "Register" })] }), authMode === "login" ? (_jsxs("form", { className: "stack", onSubmit: handleLogin, children: [_jsxs("label", { children: ["Email", _jsx("input", { value: loginEmail, onChange: (event) => setLoginEmail(event.target.value) })] }), _jsxs("label", { children: ["Password", _jsx("input", { type: "password", value: loginPassword, onChange: (event) => setLoginPassword(event.target.value) })] }), _jsx("button", { className: "primary-btn", type: "submit", children: "Masuk ke Dashboard" })] })) : (_jsxs("form", { className: "stack", onSubmit: handleRegister, children: [_jsxs("label", { children: ["Nama Lengkap", _jsx("input", { value: registerForm.fullName, onChange: (event) => setRegisterForm((current) => ({ ...current, fullName: event.target.value })) })] }), _jsxs("label", { children: ["Email", _jsx("input", { value: registerForm.email, onChange: (event) => setRegisterForm((current) => ({ ...current, email: event.target.value })) })] }), _jsxs("label", { children: ["Nomor HP", _jsx("input", { value: registerForm.phone, onChange: (event) => setRegisterForm((current) => ({ ...current, phone: event.target.value })) })] }), _jsxs("label", { children: ["NIM", _jsx("input", { value: registerForm.nim, onChange: (event) => setRegisterForm((current) => ({ ...current, nim: event.target.value })), placeholder: "Opsional untuk dosen/copy shop" })] }), _jsxs("label", { children: ["Program Studi", _jsx("input", { value: registerForm.studyProgram, onChange: (event) => setRegisterForm((current) => ({ ...current, studyProgram: event.target.value })), placeholder: "Contoh: Teknik Informatika" })] }), _jsxs("label", { children: ["Password", _jsx("input", { type: "password", value: registerForm.password, onChange: (event) => setRegisterForm((current) => ({ ...current, password: event.target.value })) })] }), _jsxs("label", { children: ["Role", _jsxs("select", { value: registerForm.role, onChange: (event) => setRegisterForm((current) => ({ ...current, role: event.target.value })), children: [_jsx("option", { value: "student", children: "Mahasiswa" }), _jsx("option", { value: "lecturer", children: "Dosen" }), _jsx("option", { value: "copy_shop", children: "Tukang Fotokopi" })] })] }), _jsxs("label", { children: ["Lokasi Kampus", _jsx("input", { value: registerForm.campusLocation, onChange: (event) => setRegisterForm((current) => ({ ...current, campusLocation: event.target.value })) })] }), _jsx("button", { className: "primary-btn", type: "submit", children: "Buat Akun" })] }))] }), _jsxs("article", { className: "card", children: [_jsx("h2", { children: "Yang sudah siap di MVP ini" }), _jsxs("ul", { className: "check-list", children: [_jsx("li", { children: "Autentikasi login dan register ke backend Express" }), _jsx("li", { children: "CRUD pesanan dengan hitung print, copy, dan ongkir" }), _jsx("li", { children: "Dashboard berbeda untuk 3 tipe pengguna" }), _jsx("li", { children: "Data demo awal untuk admin, copy shop, dan mahasiswa" })] })] })] })) : (_jsxs("section", { className: "dashboard-layout", children: [_jsxs("article", { className: "card", children: [_jsxs("div", { className: "profile-head", children: [_jsxs("div", { children: [_jsx("p", { className: "eyebrow", children: "Role Aktif" }), _jsx("h2", { children: roleLabels[session.user.role] }), _jsx("p", { children: session.user.fullName })] }), _jsx("button", { className: "ghost-btn", onClick: logout, type: "button", children: "Logout" })] }), _jsxs("div", { className: "stats-grid", children: [_jsxs("div", { className: "stat-box", children: [_jsx("span", { children: "Total Order" }), _jsx("strong", { children: orders.length })] }), _jsxs("div", { className: "stat-box", children: [_jsx("span", { children: "Pengguna Terdaftar" }), _jsx("strong", { children: users.length })] }), _jsxs("div", { className: "stat-box", children: [_jsx("span", { children: "Pesanan Selesai" }), _jsx("strong", { children: orders.filter((order) => order.status === "completed").length })] })] })] }), (session.user.role === "student" || session.user.role === "lecturer" || session.user.role === "admin") && (_jsxs("article", { className: "card", children: [_jsx("h2", { children: "Buat Pesanan Baru" }), _jsxs("form", { className: "order-form", onSubmit: handleCreateOrder, children: [_jsxs("label", { className: "full-span", children: ["Upload Dokumen", _jsx("input", { type: "file", accept: ".pdf,.doc,.docx,.ppt,.pptx", onChange: (event) => {
                                                    const file = event.target.files?.[0] ?? null;
                                                    setSelectedFile(file);
                                                    setOrderForm((current) => ({
                                                        ...current,
                                                        fileName: file ? file.name : current.fileName,
                                                        fileType: file?.name.split(".").pop()?.toLowerCase() ?? current.fileType
                                                    }));
                                                } })] }), _jsxs("label", { children: ["Nama File", _jsx("input", { value: orderForm.fileName, onChange: (event) => setOrderForm((current) => ({ ...current, fileName: event.target.value })), placeholder: "contoh: tugas-akhir.pdf" })] }), _jsxs("label", { children: ["Tipe File", _jsxs("select", { value: orderForm.fileType, onChange: (event) => setOrderForm((current) => ({ ...current, fileType: event.target.value })), children: [_jsx("option", { value: "pdf", children: "PDF" }), _jsx("option", { value: "doc", children: "DOC" }), _jsx("option", { value: "ppt", children: "PPT" })] })] }), _jsxs("label", { children: ["Jumlah Print", _jsx("input", { type: "number", min: "0", value: orderForm.printQty, onChange: (event) => setOrderForm((current) => ({ ...current, printQty: Number(event.target.value) })) })] }), _jsxs("label", { children: ["Jumlah Fotokopi", _jsx("input", { type: "number", min: "0", value: orderForm.copyQty, onChange: (event) => setOrderForm((current) => ({ ...current, copyQty: Number(event.target.value) })) })] }), _jsxs("label", { children: ["Jumlah Jilid", _jsx("input", { type: "number", min: "0", value: orderForm.bindingQty, onChange: (event) => setOrderForm((current) => ({ ...current, bindingQty: Number(event.target.value) })) })] }), _jsxs("label", { children: ["Metode Pengambilan", _jsxs("select", { value: orderForm.pickupMethod, onChange: (event) => setOrderForm((current) => ({ ...current, pickupMethod: event.target.value })), children: [_jsx("option", { value: "pickup", children: "Ambil Sendiri" }), _jsx("option", { value: "delivery", children: "Diantar" })] })] }), _jsxs("label", { children: ["Pembayaran", _jsxs("select", { value: orderForm.paymentMethod, onChange: (event) => setOrderForm((current) => ({ ...current, paymentMethod: event.target.value })), children: [_jsx("option", { value: "cash", children: "Cash" }), _jsx("option", { value: "bank_transfer", children: "Transfer Bank" })] })] }), _jsxs("label", { className: "full-span", children: ["Deskripsi Tambahan", _jsx("textarea", { value: orderForm.description, onChange: (event) => setOrderForm((current) => ({ ...current, description: event.target.value })), placeholder: "Contoh: jilid warna hitam, cover bening, kertas A4" })] }), _jsxs("label", { className: "full-span", children: ["Catatan File", _jsx("textarea", { value: orderForm.notes, onChange: (event) => setOrderForm((current) => ({ ...current, notes: event.target.value })) })] }), _jsxs("label", { className: "full-span", children: ["Alamat Pengantaran", _jsx("textarea", { value: orderForm.deliveryAddress, onChange: (event) => setOrderForm((current) => ({ ...current, deliveryAddress: event.target.value })), placeholder: "Isi jika memilih delivery" })] }), _jsxs("label", { className: "full-span", children: ["Catatan Pesanan", _jsx("textarea", { value: orderForm.orderNotes, onChange: (event) => setOrderForm((current) => ({ ...current, orderNotes: event.target.value })) })] }), _jsx("button", { className: "primary-btn full-span", type: "submit", children: "Kirim Pesanan" })] })] })), _jsxs("article", { className: "card", children: [_jsxs("h2", { children: ["Dashboard ", roleLabels[session.user.role]] }), _jsx("div", { className: "order-list", children: orders.map((order) => (_jsxs("article", { className: "order-card", children: [_jsxs("div", { className: "order-head", children: [_jsxs("div", { children: [_jsx("strong", { children: order.orderCode }), _jsx("p", { children: new Date(order.createdAt).toLocaleString("id-ID") })] }), _jsx("span", { className: `status-pill ${statusTone[order.status]}`, children: order.status })] }), _jsxs("p", { className: "order-meta", children: [order.pickupMethod === "delivery" ? "Diantar" : "Ambil sendiri", " | ", order.paymentMethod === "cash" ? "Cash" : "Transfer", " | Rp", order.totalAmount.toLocaleString("id-ID")] }), _jsx("ul", { className: "item-list", children: order.items.map((item) => (_jsxs("li", { children: [_jsx("a", { href: item.fileUrl, rel: "noreferrer", target: "_blank", children: item.fileName }), " ", "| print ", item.printQty, " | copy ", item.copyQty, " | jilid ", item.bindingQty, " | source ", item.sourcePrintQty, item.description ? ` | ${item.description}` : ""] }, item.id))) }), _jsx("p", { className: "order-note", children: order.notes || "Tanpa catatan tambahan." }), (session.user.role === "admin" || session.user.role === "copy_shop") && (_jsxs("div", { className: "action-row", children: [_jsx("button", { onClick: () => handleStatusChange(order, "confirmed"), type: "button", children: "Confirm" }), _jsx("button", { onClick: () => handleStatusChange(order, "processing"), type: "button", children: "Process" }), _jsx("button", { onClick: () => handleStatusChange(order, "completed"), type: "button", children: "Complete" })] })), session.user.role === "admin" && (_jsx("div", { className: "action-row", children: _jsx("button", { className: "danger-btn", onClick: () => handleDeleteOrder(order.id), type: "button", children: "Hapus Pesanan" }) }))] }, order.id))) })] }), session.user.role === "admin" && (_jsxs("article", { className: "card", children: [_jsx("h2", { children: "Daftar Pengguna" }), _jsx("div", { className: "user-grid", children: users.map((user) => (_jsxs("div", { className: "user-card", children: [_jsx("strong", { children: user.fullName }), _jsx("span", { children: roleLabels[user.role] }), _jsx("p", { children: user.email }), _jsx("p", { children: user.nim || "-" }), _jsx("p", { children: user.studyProgram || "-" }), _jsx("p", { children: user.campusLocation })] }, user.id))) })] }))] }))] }));
}
