import { RowDataPacket } from "mysql2";
import { db } from "../../config/database.js";
import { CopyShop } from "../../types/domain.js";

type CopyShopRow = RowDataPacket & {
  id: string;
  user_id: string;
  shop_name: string;
  location_note: string | null;
  is_active: number | boolean;
  created_at: Date | string;
  updated_at: Date | string;
};

function mapCopyShopRow(row: CopyShopRow): CopyShop {
  return {
    id: row.id,
    userId: row.user_id,
    shopName: row.shop_name,
    locationNote: row.location_note ?? "",
    isActive: Boolean(row.is_active),
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString()
  };
}

export async function listActiveCopyShops() {
  const [rows] = await db.query<CopyShopRow[]>(
    `SELECT id, user_id, shop_name, location_note, is_active, created_at, updated_at
     FROM copy_shops
     WHERE is_active = TRUE
     ORDER BY shop_name ASC`
  );

  return rows.map(mapCopyShopRow);
}

export async function getCopyShopById(id: string) {
  const [rows] = await db.query<CopyShopRow[]>(
    `SELECT id, user_id, shop_name, location_note, is_active, created_at, updated_at
     FROM copy_shops
     WHERE id = ?
     LIMIT 1`,
    [id]
  );

  return rows[0] ? mapCopyShopRow(rows[0]) : null;
}

export async function getCopyShopByUserId(userId: string) {
  const [rows] = await db.query<CopyShopRow[]>(
    `SELECT id, user_id, shop_name, location_note, is_active, created_at, updated_at
     FROM copy_shops
     WHERE user_id = ?
     LIMIT 1`,
    [userId]
  );

  return rows[0] ? mapCopyShopRow(rows[0]) : null;
}
