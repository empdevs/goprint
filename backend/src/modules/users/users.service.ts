import { RowDataPacket } from "mysql2";
import { db } from "../../config/database.js";
import { User } from "../../types/domain.js";

type UserRow = RowDataPacket & {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  nim: string | null;
  study_program: string | null;
  role: User["role"];
  campus_location: string;
  created_at: Date | string;
};

export async function listUsers() {
  const [rows] = await db.query<UserRow[]>(
    `SELECT id, full_name, email, phone, nim, study_program, role, campus_location, created_at
     FROM users
     ORDER BY created_at DESC`
  );

  return rows.map((row) => ({
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    phone: row.phone ?? "",
    nim: row.nim ?? "",
    studyProgram: row.study_program ?? "",
    role: row.role,
    campusLocation: row.campus_location ?? "",
    createdAt: new Date(row.created_at).toISOString()
  }));
}
