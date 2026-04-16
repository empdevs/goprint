import { ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "../../config/database.js";
import { User } from "../../types/domain.js";
import { createId } from "../../utils/id.js";
import { hashPassword, verifyPassword } from "../../utils/password.js";
import { signAuthToken, verifyAuthToken } from "../../utils/token.js";
import { LoginPayload, RegisterPayload } from "./auth.types.js";

function toSafeUser(user: User) {
  const { password: _password, ...safeUser } = user;
  return safeUser;
}

type UserRow = RowDataPacket & {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  nim: string | null;
  study_program: string | null;
  password_hash: string;
  role: User["role"];
  campus_location: string;
  created_at: Date | string;
};

function mapUserRow(row: UserRow): User {
  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    phone: row.phone ?? "",
    nim: row.nim ?? "",
    studyProgram: row.study_program ?? "",
    password: row.password_hash,
    role: row.role,
    campusLocation: row.campus_location ?? "",
    createdAt: new Date(row.created_at).toISOString()
  };
}

async function findUserByEmail(email: string) {
  const [rows] = await db.query<UserRow[]>(
    `SELECT id, full_name, email, phone, nim, study_program, password_hash, role, campus_location, created_at
     FROM users
     WHERE email = ?
     LIMIT 1`,
    [email.toLowerCase()]
  );

  return rows[0] ? mapUserRow(rows[0]) : null;
}

async function findUserById(id: string) {
  const [rows] = await db.query<UserRow[]>(
    `SELECT id, full_name, email, phone, nim, study_program, password_hash, role, campus_location, created_at
     FROM users
     WHERE id = ?
     LIMIT 1`,
    [id]
  );

  return rows[0] ? mapUserRow(rows[0]) : null;
}

export async function registerUser(payload: RegisterPayload) {
  const existingUser = await findUserByEmail(payload.email);

  if (existingUser) {
    throw new Error("Email sudah terdaftar");
  }

  const userId = createId("user");
  const passwordHash = hashPassword(payload.password);

  await db.query<ResultSetHeader>(
    `INSERT INTO users (id, full_name, email, phone, nim, study_program, password_hash, role, campus_location)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      userId,
      payload.fullName,
      payload.email.toLowerCase(),
      "",
      payload.nim ?? "",
      payload.studyProgram ?? "",
      passwordHash,
      "user",
      ""
    ]
  );

  const user = await findUserById(userId);

  if (!user) {
    throw new Error("Gagal membuat user");
  }

  const token = signAuthToken({
    userId: user.id,
    role: user.role,
    email: user.email
  });

  return {
    token,
    user: toSafeUser(user)
  };
}

export async function loginUser(payload: LoginPayload) {
  const user = await findUserByEmail(payload.email);

  if (!user || !verifyPassword(payload.password, user.password)) {
    throw new Error("Email atau password tidak valid");
  }

  const token = signAuthToken({
    userId: user.id,
    role: user.role,
    email: user.email
  });

  return {
    token,
    user: toSafeUser(user)
  };
}

export async function getCurrentUser(token: string) {
  const decoded = verifyAuthToken(token);

  if (!decoded) {
    return null;
  }

  const user = await findUserById(decoded.userId);

  if (!user) {
    return null;
  }

  return toSafeUser(user);
}
