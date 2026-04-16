import { ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "../../config/database.js";
import { Feedback } from "../../types/domain.js";
import { createId } from "../../utils/id.js";

type FeedbackRow = RowDataPacket & {
  id: string;
  name: string;
  nim: string | null;
  study_program: string | null;
  comment: string;
  created_at: Date | string;
};

function mapFeedbackRow(row: FeedbackRow): Feedback {
  return {
    id: row.id,
    name: row.name,
    nim: row.nim ?? "",
    studyProgram: row.study_program ?? "",
    comment: row.comment,
    createdAt: new Date(row.created_at).toISOString()
  };
}

export async function listFeedbacks() {
  const [rows] = await db.query<FeedbackRow[]>(
    `SELECT id, name, nim, study_program, comment, created_at
     FROM feedbacks
     ORDER BY created_at DESC`
  );

  return rows.map(mapFeedbackRow);
}

export async function createFeedback(payload: {
  name: string;
  nim?: string;
  studyProgram?: string;
  comment: string;
}) {
  const feedbackId = createId("feedback");

  await db.query<ResultSetHeader>(
    `INSERT INTO feedbacks (id, name, nim, study_program, comment)
     VALUES (?, ?, ?, ?, ?)`,
    [feedbackId, payload.name, payload.nim ?? "", payload.studyProgram ?? "", payload.comment]
  );

  const [rows] = await db.query<FeedbackRow[]>(
    `SELECT id, name, nim, study_program, comment, created_at
     FROM feedbacks
     WHERE id = ?
     LIMIT 1`,
    [feedbackId]
  );

  if (!rows[0]) {
    throw new Error("Gagal menyimpan feedback");
  }

  return mapFeedbackRow(rows[0]);
}
