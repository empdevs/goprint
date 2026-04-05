import { roleLabels } from "../../constants";
import { useGoPrint } from "../../hooks/useGoPrint";

export function ProfileSummary() {
  const { session, orders, users, logout } = useGoPrint();

  if (!session) {
    return null;
  }

  return (
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
  );
}
