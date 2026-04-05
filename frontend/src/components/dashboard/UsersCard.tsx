import { roleLabels } from "../../constants";
import { useGoPrint } from "../../hooks/useGoPrint";

export function UsersCard() {
  const { session, users } = useGoPrint();

  if (!session || session.user.role !== "admin") {
    return null;
  }

  return (
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
  );
}
