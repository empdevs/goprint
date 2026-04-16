import { Order, OrderStatus, StatusAction, UserRole } from "../types";

function getWorkerNextStatus(order: Order): StatusAction[] {
  switch (order.status) {
    case "pending":
      return [
        { label: "Terima Pesanan", nextStatus: "confirmed" },
        { label: "Batalkan", nextStatus: "cancelled" }
      ];
    case "confirmed":
      return [{ label: "Mulai Proses", nextStatus: "processing" }];
    case "processing":
      return [
        {
          label: order.pickupMethod === "delivery" ? "Kirim Pesanan" : "Siap Diambil",
          nextStatus: order.pickupMethod === "delivery" ? "out_for_delivery" : "ready_for_pickup"
        }
      ];
    case "ready_for_pickup":
    case "out_for_delivery":
      return [{ label: "Tandai Selesai", nextStatus: "completed" }];
    default:
      return [];
  }
}

export function getAvailableStatusActions(role: UserRole, order: Order): StatusAction[] {
  if (role === "admin" || role === "copy_shop") {
    return getWorkerNextStatus(order);
  }

  if (role === "user") {
    switch (order.status) {
      case "pending":
        return [{ label: "Batalkan", nextStatus: "cancelled" }];
      case "ready_for_pickup":
        return [{ label: "Konfirmasi Sudah Diambil", nextStatus: "completed" }];
      case "out_for_delivery":
        return [{ label: "Konfirmasi Sudah Diterima", nextStatus: "completed" }];
      default:
        return [];
    }
  }

  return [];
}

export function getOrderStatusDescription(status: OrderStatus) {
  switch (status) {
    case "pending":
      return "Pesanan baru masuk dan menunggu respons tukang fotokopi.";
    case "confirmed":
      return "Pesanan sudah diterima dan siap dikerjakan.";
    case "processing":
      return "Dokumen sedang diprint, difotokopi, atau dijilid.";
    case "ready_for_pickup":
      return "Pesanan selesai dan siap diambil pengguna.";
    case "out_for_delivery":
      return "Pesanan sedang diantar ke lokasi pengguna.";
    case "completed":
      return "Pesanan telah selesai diterima.";
    case "cancelled":
      return "Pesanan dibatalkan.";
  }
}
