import { FormEvent, useEffect, useState } from "react";

type UserRole = "admin" | "copy_shop" | "student" | "lecturer";
type PickupMethod = "pickup" | "delivery";
type PaymentMethod = "cash" | "bank_transfer";
type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "ready_for_pickup"
  | "out_for_delivery"
  | "completed"
  | "cancelled";

type AuthUser = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  nim: string;
  studyProgram: string;
  role: UserRole;
  campusLocation: string;
  createdAt: string;
};

type OrderItem = {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  printQty: number;
  copyQty: number;
  bindingQty: number;
  sourcePrintQty: number;
  totalPrintedSheets: number;
  description: string;
  notes: string;
};

type Order = {
  id: string;
  orderCode: string;
  userId: string;
  assignedCopyShopId?: string;
  pickupMethod: PickupMethod;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  notes: string;
  deliveryAddress: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
};

type AppSession = {
  token: string;
  user: AuthUser;
};

type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

type UploadResponse = {
  url: string;
  pathname: string;
  contentType: string;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000/api";
const SESSION_KEY = "goprint-session";

const demoAccounts = [
  "Admin: admin@goprint.local / admin123",
  "Copy shop: copyshop@goprint.local / copy123",
  "Student: student@goprint.local / student123"
];

const roleLabels: Record<UserRole, string> = {
  admin: "Admin",
  copy_shop: "Tukang Fotokopi",
  student: "Mahasiswa",
  lecturer: "Dosen"
};

const statusTone: Record<OrderStatus, string> = {
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
  role: "student" as UserRole,
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
  pickupMethod: "pickup" as PickupMethod,
  paymentMethod: "cash" as PaymentMethod,
  deliveryAddress: "",
  orderNotes: ""
};

async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
  token?: string
): Promise<ApiResponse<T>> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {})
    }
  });

  const payload = (await response.json()) as ApiResponse<T>;

  if (!response.ok || !payload.success) {
    throw new Error(payload.message ?? "Request gagal");
  }

  return payload;
}

function readFileAsBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
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
  const [session, setSession] = useState<AppSession | null>(null);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [loginEmail, setLoginEmail] = useState("student@goprint.local");
  const [loginPassword, setLoginPassword] = useState("student123");
  const [registerForm, setRegisterForm] = useState(initialRegisterForm);
  const [orderForm, setOrderForm] = useState(initialOrderForm);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [message, setMessage] = useState("Silakan login untuk mulai menggunakan GoPrint.");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const rawSession = window.localStorage.getItem(SESSION_KEY);
    if (!rawSession) return;
    setSession(JSON.parse(rawSession) as AppSession);
  }, []);

  useEffect(() => {
    if (!session) return;
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    void loadDashboardData(session);
  }, [session]);

  async function loadDashboardData(activeSession: AppSession) {
    setIsLoading(true);

    try {
      const [ordersResponse, usersResponse] = await Promise.all([
        apiRequest<Order[]>("/orders", {}, activeSession.token),
        apiRequest<AuthUser[]>("/users", {}, activeSession.token)
      ]);

      setOrders(ordersResponse.data);
      setUsers(usersResponse.data);
      setMessage(`Halo ${activeSession.user.fullName}, dashboard GoPrint siap digunakan.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Gagal memuat dashboard");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await apiRequest<AppSession>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });

      setSession(response.data);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Login gagal");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await apiRequest<AppSession>("/auth/register", {
        method: "POST",
        body: JSON.stringify(registerForm)
      });

      setSession(response.data);
      setRegisterForm(initialRegisterForm);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Register gagal");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCreateOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!session) return;
    setIsLoading(true);

    try {
      if (!selectedFile) {
        throw new Error("Silakan pilih file dokumen terlebih dahulu");
      }

      const base64Content = await readFileAsBase64(selectedFile);
      const uploadResponse = await apiRequest<UploadResponse>(
        "/uploads",
        {
          method: "POST",
          body: JSON.stringify({
            fileName: selectedFile.name,
            contentType: selectedFile.type || "application/octet-stream",
            base64Content
          })
        },
        session.token
      );

      const response = await apiRequest<Order>(
        "/orders",
        {
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
        },
        session.token
      );

      setOrders((currentOrders) => [response.data, ...currentOrders]);
      setOrderForm(initialOrderForm);
      setSelectedFile(null);
      setMessage(`Pesanan ${response.data.orderCode} berhasil dibuat.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Gagal membuat pesanan");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleStatusChange(order: Order, status: OrderStatus) {
    if (!session) return;
    setIsLoading(true);

    try {
      const response = await apiRequest<Order>(
        `/orders/${order.id}`,
        { method: "PATCH", body: JSON.stringify({ status }) },
        session.token
      );

      setOrders((currentOrders) =>
        currentOrders.map((currentOrder) => (currentOrder.id === order.id ? response.data : currentOrder))
      );
      setMessage(`Status ${order.orderCode} diperbarui menjadi ${status}.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Gagal update status");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDeleteOrder(orderId: string) {
    if (!session) return;
    setIsLoading(true);

    try {
      await apiRequest<Order>(`/orders/${orderId}`, { method: "DELETE" }, session.token);
      setOrders((currentOrders) => currentOrders.filter((order) => order.id !== orderId));
      setMessage("Pesanan berhasil dihapus.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Gagal menghapus pesanan");
    } finally {
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

  return (
    <main className="app-shell">
      <section className="hero">
        <div>
          <p className="eyebrow">GoPrint Campus Printing Hub</p>
          <h1>Pesan print dan fotokopi tanpa turun ke basement.</h1>
          <p className="lead">
            MVP ini sudah memuat login/register, pembuatan order, pelacakan status, dan dashboard
            berbeda untuk admin, tukang fotokopi, serta mahasiswa/dosen.
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

      <section className="status-bar">
        <span>{message}</span>
        {isLoading ? <strong>Memproses...</strong> : <strong>Siap</strong>}
      </section>

      {!session ? (
        <section className="auth-layout">
          <article className="card">
            <div className="tab-row">
              <button className={authMode === "login" ? "tab active" : "tab"} onClick={() => setAuthMode("login")} type="button">
                Login
              </button>
              <button className={authMode === "register" ? "tab active" : "tab"} onClick={() => setAuthMode("register")} type="button">
                Register
              </button>
            </div>

            {authMode === "login" ? (
              <form className="stack" onSubmit={handleLogin}>
                <label>Email<input value={loginEmail} onChange={(event) => setLoginEmail(event.target.value)} /></label>
                <label>Password<input type="password" value={loginPassword} onChange={(event) => setLoginPassword(event.target.value)} /></label>
                <button className="primary-btn" type="submit">Masuk ke Dashboard</button>
              </form>
            ) : (
              <form className="stack" onSubmit={handleRegister}>
                <label>Nama Lengkap<input value={registerForm.fullName} onChange={(event) => setRegisterForm((current) => ({ ...current, fullName: event.target.value }))} /></label>
                <label>Email<input value={registerForm.email} onChange={(event) => setRegisterForm((current) => ({ ...current, email: event.target.value }))} /></label>
                <label>Nomor HP<input value={registerForm.phone} onChange={(event) => setRegisterForm((current) => ({ ...current, phone: event.target.value }))} /></label>
                <label>NIM<input value={registerForm.nim} onChange={(event) => setRegisterForm((current) => ({ ...current, nim: event.target.value }))} placeholder="Opsional untuk dosen/copy shop" /></label>
                <label>Program Studi<input value={registerForm.studyProgram} onChange={(event) => setRegisterForm((current) => ({ ...current, studyProgram: event.target.value }))} placeholder="Contoh: Teknik Informatika" /></label>
                <label>Password<input type="password" value={registerForm.password} onChange={(event) => setRegisterForm((current) => ({ ...current, password: event.target.value }))} /></label>
                <label>Role
                  <select value={registerForm.role} onChange={(event) => setRegisterForm((current) => ({ ...current, role: event.target.value as UserRole }))}>
                    <option value="student">Mahasiswa</option>
                    <option value="lecturer">Dosen</option>
                    <option value="copy_shop">Tukang Fotokopi</option>
                  </select>
                </label>
                <label>Lokasi Kampus<input value={registerForm.campusLocation} onChange={(event) => setRegisterForm((current) => ({ ...current, campusLocation: event.target.value }))} /></label>
                <button className="primary-btn" type="submit">Buat Akun</button>
              </form>
            )}
          </article>

          <article className="card">
            <h2>Yang sudah siap di MVP ini</h2>
            <ul className="check-list">
              <li>Autentikasi login dan register ke backend Express</li>
              <li>CRUD pesanan dengan hitung print, copy, dan ongkir</li>
              <li>Dashboard berbeda untuk 3 tipe pengguna</li>
              <li>Data demo awal untuk admin, copy shop, dan mahasiswa</li>
            </ul>
          </article>
        </section>
      ) : (
        <section className="dashboard-layout">
          <article className="card">
            <div className="profile-head">
              <div>
                <p className="eyebrow">Role Aktif</p>
                <h2>{roleLabels[session.user.role]}</h2>
                <p>{session.user.fullName}</p>
              </div>
              <button className="ghost-btn" onClick={logout} type="button">Logout</button>
            </div>

            <div className="stats-grid">
              <div className="stat-box"><span>Total Order</span><strong>{orders.length}</strong></div>
              <div className="stat-box"><span>Pengguna Terdaftar</span><strong>{users.length}</strong></div>
              <div className="stat-box"><span>Pesanan Selesai</span><strong>{orders.filter((order) => order.status === "completed").length}</strong></div>
            </div>
          </article>

          {(session.user.role === "student" || session.user.role === "lecturer" || session.user.role === "admin") && (
            <article className="card">
              <h2>Buat Pesanan Baru</h2>
              <form className="order-form" onSubmit={handleCreateOrder}>
                <label className="full-span">
                  Upload Dokumen
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.ppt,.pptx"
                    onChange={(event) => {
                      const file = event.target.files?.[0] ?? null;
                      setSelectedFile(file);
                      setOrderForm((current) => ({
                        ...current,
                        fileName: file ? file.name : current.fileName,
                        fileType: file?.name.split(".").pop()?.toLowerCase() ?? current.fileType
                      }));
                    }}
                  />
                </label>
                <label>Nama File<input value={orderForm.fileName} onChange={(event) => setOrderForm((current) => ({ ...current, fileName: event.target.value }))} placeholder="contoh: tugas-akhir.pdf" /></label>
                <label>Tipe File
                  <select value={orderForm.fileType} onChange={(event) => setOrderForm((current) => ({ ...current, fileType: event.target.value }))}>
                    <option value="pdf">PDF</option>
                    <option value="doc">DOC</option>
                    <option value="ppt">PPT</option>
                  </select>
                </label>
                <label>Jumlah Print<input type="number" min="0" value={orderForm.printQty} onChange={(event) => setOrderForm((current) => ({ ...current, printQty: Number(event.target.value) }))} /></label>
                <label>Jumlah Fotokopi<input type="number" min="0" value={orderForm.copyQty} onChange={(event) => setOrderForm((current) => ({ ...current, copyQty: Number(event.target.value) }))} /></label>
                <label>Jumlah Jilid<input type="number" min="0" value={orderForm.bindingQty} onChange={(event) => setOrderForm((current) => ({ ...current, bindingQty: Number(event.target.value) }))} /></label>
                <label>Metode Pengambilan
                  <select value={orderForm.pickupMethod} onChange={(event) => setOrderForm((current) => ({ ...current, pickupMethod: event.target.value as PickupMethod }))}>
                    <option value="pickup">Ambil Sendiri</option>
                    <option value="delivery">Diantar</option>
                  </select>
                </label>
                <label>Pembayaran
                  <select value={orderForm.paymentMethod} onChange={(event) => setOrderForm((current) => ({ ...current, paymentMethod: event.target.value as PaymentMethod }))}>
                    <option value="cash">Cash</option>
                    <option value="bank_transfer">Transfer Bank</option>
                  </select>
                </label>
                <label className="full-span">Deskripsi Tambahan<textarea value={orderForm.description} onChange={(event) => setOrderForm((current) => ({ ...current, description: event.target.value }))} placeholder="Contoh: jilid warna hitam, cover bening, kertas A4" /></label>
                <label className="full-span">Catatan File<textarea value={orderForm.notes} onChange={(event) => setOrderForm((current) => ({ ...current, notes: event.target.value }))} /></label>
                <label className="full-span">Alamat Pengantaran<textarea value={orderForm.deliveryAddress} onChange={(event) => setOrderForm((current) => ({ ...current, deliveryAddress: event.target.value }))} placeholder="Isi jika memilih delivery" /></label>
                <label className="full-span">Catatan Pesanan<textarea value={orderForm.orderNotes} onChange={(event) => setOrderForm((current) => ({ ...current, orderNotes: event.target.value }))} /></label>
                <button className="primary-btn full-span" type="submit">Kirim Pesanan</button>
              </form>
            </article>
          )}

          <article className="card">
            <h2>Dashboard {roleLabels[session.user.role]}</h2>
            <div className="order-list">
              {orders.map((order) => (
                <article className="order-card" key={order.id}>
                  <div className="order-head">
                    <div>
                      <strong>{order.orderCode}</strong>
                      <p>{new Date(order.createdAt).toLocaleString("id-ID")}</p>
                    </div>
                    <span className={`status-pill ${statusTone[order.status]}`}>{order.status}</span>
                  </div>

                  <p className="order-meta">
                    {order.pickupMethod === "delivery" ? "Diantar" : "Ambil sendiri"} | {order.paymentMethod === "cash" ? "Cash" : "Transfer"} | Rp{order.totalAmount.toLocaleString("id-ID")}
                  </p>

                  <ul className="item-list">
                    {order.items.map((item) => (
                      <li key={item.id}>
                        <a href={item.fileUrl} rel="noreferrer" target="_blank">
                          {item.fileName}
                        </a>{" "}
                        | print {item.printQty} | copy {item.copyQty} | jilid {item.bindingQty} | source {item.sourcePrintQty}
                        {item.description ? ` | ${item.description}` : ""}
                      </li>
                    ))}
                  </ul>

                  <p className="order-note">{order.notes || "Tanpa catatan tambahan."}</p>

                  {(session.user.role === "admin" || session.user.role === "copy_shop") && (
                    <div className="action-row">
                      <button onClick={() => handleStatusChange(order, "confirmed")} type="button">Confirm</button>
                      <button onClick={() => handleStatusChange(order, "processing")} type="button">Process</button>
                      <button onClick={() => handleStatusChange(order, "completed")} type="button">Complete</button>
                    </div>
                  )}

                  {session.user.role === "admin" && (
                    <div className="action-row">
                      <button className="danger-btn" onClick={() => handleDeleteOrder(order.id)} type="button">Hapus Pesanan</button>
                    </div>
                  )}
                </article>
              ))}
            </div>
          </article>

          {session.user.role === "admin" && (
            <article className="card">
              <h2>Daftar Pengguna</h2>
              <div className="user-grid">
                {users.map((user) => (
                  <div className="user-card" key={user.id}>
                    <strong>{user.fullName}</strong>
                    <span>{roleLabels[user.role]}</span>
                    <p>{user.email}</p>
                    <p>{user.nim || "-"}</p>
                    <p>{user.studyProgram || "-"}</p>
                    <p>{user.campusLocation}</p>
                  </div>
                ))}
              </div>
            </article>
          )}
        </section>
      )}
    </main>
  );
}
