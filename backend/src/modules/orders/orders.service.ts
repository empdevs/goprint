import { ResultSetHeader, RowDataPacket } from "mysql2";
import { PoolConnection } from "mysql2/promise";
import { db } from "../../config/database.js";
import { Order, OrderItem, OrderStatus, PaymentMethod, PickupMethod, User } from "../../types/domain.js";
import { createId, createOrderCode } from "../../utils/id.js";

type OrderItemInput = {
  fileName: string;
  fileUrl?: string;
  fileType?: string;
  printQty?: number;
  copyQty?: number;
  bindingQty?: number;
  description?: string;
  notes?: string;
};

type PreviewOrderInput = {
  items?: OrderItemInput[];
  pickupMethod?: PickupMethod;
};

type CreateOrderInput = {
  pickupMethod: PickupMethod;
  paymentMethod: PaymentMethod;
  notes?: string;
  deliveryAddress?: string;
  assignedCopyShopId?: string;
  items: OrderItemInput[];
};

type UpdateOrderInput = Partial<{
  pickupMethod: PickupMethod;
  paymentMethod: PaymentMethod;
  notes: string;
  deliveryAddress: string;
  assignedCopyShopId: string;
  status: OrderStatus;
  items: OrderItemInput[];
}>;

type OrderRow = RowDataPacket & {
  id: string;
  order_code: string;
  user_id: string;
  copy_shop_user_id: string | null;
  pickup_method: PickupMethod;
  payment_method: PaymentMethod;
  status: OrderStatus;
  notes: string | null;
  delivery_address: string | null;
  subtotal: number;
  delivery_fee: number;
  total_amount: number;
  created_at: Date | string;
  updated_at: Date | string;
};

type OrderItemRow = RowDataPacket & {
  id: string;
  order_id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  print_qty: number;
  copy_qty: number;
  binding_qty: number;
  source_print_qty: number;
  total_printed_sheets: number;
  description: string | null;
  notes: string | null;
};

type NormalizedOrderItem = OrderItem & {
  unitPrintPrice: number;
  unitCopyPrice: number;
  unitBindingPrice: number;
  totalPrice: number;
};

const UNIT_PRINT_PRICE = 500;
const UNIT_COPY_PRICE = 250;
const UNIT_BINDING_PRICE = 3000;

function isValidStatusTransition(currentStatus: OrderStatus, nextStatus: OrderStatus, pickupMethod: PickupMethod) {
  const nextMap: Record<OrderStatus, OrderStatus[]> = {
    pending: ["confirmed", "cancelled"],
    confirmed: ["processing", "cancelled"],
    processing: [pickupMethod === "delivery" ? "out_for_delivery" : "ready_for_pickup"],
    ready_for_pickup: ["completed"],
    out_for_delivery: ["completed"],
    completed: [],
    cancelled: []
  };

  return nextMap[currentStatus].includes(nextStatus);
}

export function buildOrderSummary(payload: PreviewOrderInput) {
  const normalizedItems = normalizeOrderItems(payload.items ?? []);

  return {
    pickupMethod: payload.pickupMethod ?? "pickup",
    totalFiles: normalizedItems.length,
    items: normalizedItems.map((item) => ({
      fileName: item.fileName,
      fileUrl: item.fileUrl,
      fileType: item.fileType,
      printQty: item.printQty,
      copyQty: item.copyQty,
      bindingQty: item.bindingQty,
      sourcePrintQty: item.sourcePrintQty,
      totalPrintedSheets: item.totalPrintedSheets,
      description: item.description,
      notes: item.notes
    }))
  };
}

function normalizeOrderItems(items: OrderItemInput[]): NormalizedOrderItem[] {
  return items.map((item) => {
    const fileName = item.fileName?.trim();
    const printQty = Number(item.printQty ?? 0);
    const copyQty = Number(item.copyQty ?? 0);
    const bindingQty = Number(item.bindingQty ?? 0);

    if (!fileName) {
      throw new Error("Nama file wajib diisi untuk setiap item pesanan");
    }

    if (printQty < 1 && copyQty < 1 && bindingQty < 1) {
      throw new Error(`Minimal pilih satu layanan untuk file ${fileName}`);
    }

    const sourcePrintQty = copyQty > 0 && printQty === 0 ? 1 : 0;
    const totalPrintedSheets = printQty + sourcePrintQty;
    const totalPrice =
      totalPrintedSheets * UNIT_PRINT_PRICE +
      copyQty * UNIT_COPY_PRICE +
      bindingQty * UNIT_BINDING_PRICE;

    return {
      id: createId("item"),
      fileName,
      fileUrl: item.fileUrl ?? "",
      fileType: item.fileType ?? "document",
      printQty,
      copyQty,
      bindingQty,
      sourcePrintQty,
      totalPrintedSheets,
      description: item.description ?? "",
      notes: item.notes ?? "",
      unitPrintPrice: UNIT_PRINT_PRICE,
      unitCopyPrice: UNIT_COPY_PRICE,
      unitBindingPrice: UNIT_BINDING_PRICE,
      totalPrice
    };
  });
}

function calculatePricing(items: NormalizedOrderItem[], pickupMethod: PickupMethod) {
  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const deliveryFee = pickupMethod === "delivery" ? 3000 : 0;

  return {
    subtotal,
    deliveryFee,
    totalAmount: subtotal + deliveryFee
  };
}

function mapOrders(rows: OrderRow[], itemRows: OrderItemRow[]) {
  return rows.map((row) => {
    const items = itemRows
      .filter((itemRow) => itemRow.order_id === row.id)
      .map<OrderItem>((itemRow) => ({
        id: itemRow.id,
        fileName: itemRow.file_name,
        fileUrl: itemRow.file_url,
        fileType: itemRow.file_type,
        printQty: Number(itemRow.print_qty),
        copyQty: Number(itemRow.copy_qty),
        bindingQty: Number(itemRow.binding_qty),
        sourcePrintQty: Number(itemRow.source_print_qty),
        totalPrintedSheets: Number(itemRow.total_printed_sheets),
        description: itemRow.description ?? "",
        notes: itemRow.notes ?? ""
      }));

    return {
      id: row.id,
      orderCode: row.order_code,
      userId: row.user_id,
      assignedCopyShopId: row.copy_shop_user_id ?? undefined,
      pickupMethod: row.pickup_method,
      paymentMethod: row.payment_method,
      status: row.status,
      notes: row.notes ?? "",
      deliveryAddress: row.delivery_address ?? "",
      items,
      subtotal: Number(row.subtotal),
      deliveryFee: Number(row.delivery_fee),
      totalAmount: Number(row.total_amount),
      createdAt: new Date(row.created_at).toISOString(),
      updatedAt: new Date(row.updated_at).toISOString()
    } satisfies Order;
  });
}

async function findOrders(whereClause = "", params: unknown[] = []) {
  const [orderRows] = await db.query<OrderRow[]>(
    `SELECT id, order_code, user_id, copy_shop_user_id, pickup_method, payment_method, status,
            notes, delivery_address, subtotal, delivery_fee, total_amount, created_at, updated_at
     FROM orders
     ${whereClause}
     ORDER BY created_at DESC`,
    params
  );

  if (orderRows.length === 0) {
    return [];
  }

  const orderIds = orderRows.map((row) => row.id);
  const placeholders = orderIds.map(() => "?").join(", ");

  const [itemRows] = await db.query<OrderItemRow[]>(
    `SELECT id, order_id, file_name, file_url, file_type, print_qty, copy_qty,
            binding_qty, source_print_qty, total_printed_sheets, description, notes
     FROM order_items
     WHERE order_id IN (${placeholders})
     ORDER BY created_at ASC`,
    orderIds
  );

  return mapOrders(orderRows, itemRows);
}

export async function listOrders(currentUser?: Pick<User, "id" | "role">) {
  if (!currentUser || currentUser.role === "admin") {
    return findOrders();
  }

  if (currentUser.role === "copy_shop") {
    return findOrders("WHERE copy_shop_user_id = ? OR copy_shop_user_id IS NULL", [currentUser.id]);
  }

  return findOrders("WHERE user_id = ?", [currentUser.id]);
}

export async function getOrderById(id: string) {
  const orders = await findOrders("WHERE id = ?", [id]);
  return orders[0] ?? null;
}

async function insertOrderItems(connection: PoolConnection, orderId: string, items: NormalizedOrderItem[]) {
  for (const item of items) {
    await connection.query<ResultSetHeader>(
      `INSERT INTO order_items (
        id, order_id, file_name, file_url, file_type, print_qty, copy_qty,
        binding_qty, source_print_qty, total_printed_sheets, description, notes,
        unit_print_price, unit_copy_price, unit_binding_price, total_price
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        item.id,
        orderId,
        item.fileName,
        item.fileUrl,
        item.fileType,
        item.printQty,
        item.copyQty,
        item.bindingQty,
        item.sourcePrintQty,
        item.totalPrintedSheets,
        item.description,
        item.notes,
        item.unitPrintPrice,
        item.unitCopyPrice,
        item.unitBindingPrice,
        item.totalPrice
      ]
    );
  }
}

export async function createOrder(currentUser: Pick<User, "id">, payload: CreateOrderInput) {
  const items = normalizeOrderItems(payload.items);

  if (items.length === 0) {
    throw new Error("Pesanan harus memiliki minimal satu file");
  }

  const pricing = calculatePricing(items, payload.pickupMethod);
  const orderId = createId("order");
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();
    await connection.query<ResultSetHeader>(
      `INSERT INTO orders (
        id, order_code, user_id, copy_shop_user_id, pickup_method, payment_method, status,
        notes, delivery_address, subtotal, delivery_fee, total_amount
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        orderId,
        createOrderCode(),
        currentUser.id,
        payload.assignedCopyShopId ?? null,
        payload.pickupMethod,
        payload.paymentMethod,
        "pending",
        payload.notes ?? "",
        payload.deliveryAddress ?? "",
        pricing.subtotal,
        pricing.deliveryFee,
        pricing.totalAmount
      ]
    );

    await insertOrderItems(connection, orderId, items);
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }

  const createdOrder = await getOrderById(orderId);

  if (!createdOrder) {
    throw new Error("Gagal membuat pesanan");
  }

  return createdOrder;
}

export async function updateOrder(id: string, payload: UpdateOrderInput) {
  const existingOrder = await getOrderById(id);

  if (!existingOrder) {
    throw new Error("Pesanan tidak ditemukan");
  }

  const nextItems = payload.items ? normalizeOrderItems(payload.items) : existingOrder.items.map((item) => ({
    ...item,
    unitPrintPrice: UNIT_PRINT_PRICE,
    unitCopyPrice: UNIT_COPY_PRICE,
    unitBindingPrice: UNIT_BINDING_PRICE,
    totalPrice:
      item.totalPrintedSheets * UNIT_PRINT_PRICE +
      item.copyQty * UNIT_COPY_PRICE +
      item.bindingQty * UNIT_BINDING_PRICE
  }));

  const pickupMethod = payload.pickupMethod ?? existingOrder.pickupMethod;

  if (payload.status && payload.status !== existingOrder.status) {
    const isAllowed = isValidStatusTransition(existingOrder.status, payload.status, pickupMethod);

    if (!isAllowed) {
      throw new Error(`Transisi status dari ${existingOrder.status} ke ${payload.status} tidak valid`);
    }
  }

  const pricing = calculatePricing(nextItems, pickupMethod);
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();
    await connection.query<ResultSetHeader>(
      `UPDATE orders
       SET copy_shop_user_id = ?, pickup_method = ?, payment_method = ?, status = ?,
           notes = ?, delivery_address = ?, subtotal = ?, delivery_fee = ?, total_amount = ?
       WHERE id = ?`,
      [
        payload.assignedCopyShopId ?? existingOrder.assignedCopyShopId ?? null,
        pickupMethod,
        payload.paymentMethod ?? existingOrder.paymentMethod,
        payload.status ?? existingOrder.status,
        payload.notes ?? existingOrder.notes,
        payload.deliveryAddress ?? existingOrder.deliveryAddress,
        pricing.subtotal,
        pricing.deliveryFee,
        pricing.totalAmount,
        id
      ]
    );

    if (payload.items) {
      await connection.query<ResultSetHeader>("DELETE FROM order_items WHERE order_id = ?", [id]);
      await insertOrderItems(connection, id, nextItems);
    }

    if ((payload.status ?? existingOrder.status) === "completed") {
      const archivedPayload = JSON.stringify({
        ...existingOrder,
        status: payload.status ?? existingOrder.status,
        pickupMethod,
        paymentMethod: payload.paymentMethod ?? existingOrder.paymentMethod,
        notes: payload.notes ?? existingOrder.notes,
        deliveryAddress: payload.deliveryAddress ?? existingOrder.deliveryAddress,
        assignedCopyShopId: payload.assignedCopyShopId ?? existingOrder.assignedCopyShopId,
        items: nextItems.map(({ unitPrintPrice, unitCopyPrice, unitBindingPrice, totalPrice, ...item }) => ({
          ...item,
          unitPrintPrice,
          unitCopyPrice,
          unitBindingPrice,
          totalPrice
        })),
        subtotal: pricing.subtotal,
        deliveryFee: pricing.deliveryFee,
        totalAmount: pricing.totalAmount
      });

      await connection.query<ResultSetHeader>(
        `INSERT INTO history (id, order_id, archived_payload)
         VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE archived_payload = VALUES(archived_payload), completed_at = CURRENT_TIMESTAMP`,
        [createId("history"), id, archivedPayload]
      );
    }

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }

  const updatedOrder = await getOrderById(id);

  if (!updatedOrder) {
    throw new Error("Gagal memperbarui pesanan");
  }

  return updatedOrder;
}

export async function deleteOrder(id: string) {
  const order = await getOrderById(id);

  if (!order) {
    throw new Error("Pesanan tidak ditemukan");
  }

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();
    await connection.query<ResultSetHeader>("DELETE FROM order_items WHERE order_id = ?", [id]);
    await connection.query<ResultSetHeader>("DELETE FROM orders WHERE id = ?", [id]);
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }

  return order;
}
