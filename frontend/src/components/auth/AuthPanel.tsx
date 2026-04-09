import { roleLabels } from "../../constants";
import { useAuthForm } from "../../hooks/useAuthForm";

export function AuthPanel() {
  const {
    authMode,
    setAuthMode,
    loginEmail,
    setLoginEmail,
    loginPassword,
    setLoginPassword,
    registerForm,
    setRegisterForm,
    handleLogin,
    handleRegister
  } = useAuthForm();

  return (
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
              <select value={registerForm.role} onChange={(event) => setRegisterForm((current) => ({ ...current, role: event.target.value as typeof current.role }))}>
                <option value="student">{roleLabels.student}</option>
                <option value="lecturer">{roleLabels.lecturer}</option>
                <option value="copy_shop">{roleLabels.copy_shop}</option>
              </select>
            </label>
            <label>Lokasi Kampus<input value={registerForm.campusLocation} onChange={(event) => setRegisterForm((current) => ({ ...current, campusLocation: event.target.value }))} /></label>
            <button className="primary-btn" type="submit">Buat Akun</button>
          </form>
        )}
      </article>

      <article className="card">
        <h2>Flow MVP GoPrint</h2>
        <ul className="check-list">
          <li>User membuat order dan status masuk ke `Pending`.</li>
          <li>Tukang fotokopi menerima pesanan lalu status menjadi `Confirmed`.</li>
          <li>Saat dikerjakan status berubah menjadi `Processing`.</li>
          <li>Jika pickup maka `Ready for Pickup`, jika delivery maka `Out for Delivery`.</li>
          <li>Pesanan ditutup di `Completed` setelah user menerima hasil.</li>
        </ul>
      </article>
    </section>
  );
}
