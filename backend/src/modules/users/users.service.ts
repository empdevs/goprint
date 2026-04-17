import { ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "../../config/database.js";
import { createId } from "../../utils/id.js";
import { hashPassword } from "../../utils/password.js";
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

export async function getUserById(id: string) {
  const [rows] = await db.query<UserRow[]>(
    `SELECT id, full_name, email, phone, nim, study_program, role, campus_location, created_at
     FROM users
     WHERE id = ?
     LIMIT 1`,
    [id]
  );

  if (!rows[0]) {
    return null;
  }

  const row = rows[0];

  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    phone: row.phone ?? "",
    nim: row.nim ?? "",
    studyProgram: row.study_program ?? "",
    role: row.role,
    campusLocation: row.campus_location ?? "",
    createdAt: new Date(row.created_at).toISOString()
  };
}

export async function updateUserProfile(
  userId: string,
  payload: {
    fullName: string;
    phone: string;
    nim: string;
    studyProgram: string;
    campusLocation: string;
  }
) {
  await db.query<ResultSetHeader>(
    `UPDATE users
     SET full_name = ?, phone = ?, nim = ?, study_program = ?, campus_location = ?
     WHERE id = ?`,
    [
      payload.fullName,
      payload.phone,
      payload.nim || null,
      payload.studyProgram || null,
      payload.campusLocation,
      userId
    ]
  );

  return getUserById(userId);
}

export async function createCopyShopAccount(payload: {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  campusLocation: string;
  shopName: string;
  locationNote: string;
}) {
  const normalizedEmail = payload.email.trim().toLowerCase();
  const [existingUsers] = await db.query<RowDataPacket[]>(
    `SELECT id
     FROM users
     WHERE email = ?
     LIMIT 1`,
    [normalizedEmail]
  );

  if (existingUsers.length > 0) {
    throw new Error("Email copy shop sudah terdaftar");
  }

  const userId = createId("user");
  const copyShopId = createId("copyshop");
  const passwordHash = hashPassword(payload.password);
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    await connection.query<ResultSetHeader>(
      `INSERT INTO users (id, full_name, email, phone, nim, study_program, password_hash, role, campus_location)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        payload.fullName.trim(),
        normalizedEmail,
        payload.phone.trim(),
        null,
        null,
        passwordHash,
        "copy_shop",
        payload.campusLocation.trim()
      ]
    );

    await connection.query<ResultSetHeader>(
      `INSERT INTO copy_shops (id, user_id, shop_name, location_note, is_active)
       VALUES (?, ?, ?, ?, ?)`,
      [
        copyShopId,
        userId,
        payload.shopName.trim(),
        payload.locationNote.trim(),
        true
      ]
    );

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }

  const user = await getUserById(userId);

  if (!user) {
    throw new Error("Gagal membuat akun copy shop");
  }

  return user;
}
