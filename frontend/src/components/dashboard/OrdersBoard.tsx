import { roleLabels, statusTone } from "../../constants";
import { useGoPrint } from "../../hooks/useGoPrint";
import { getAvailableStatusActions, getOrderStatusDescription } from "../../utils/order-status";

export function OrdersBoard() {
  const { session, orders, updateOrderStatus, deleteOrder } = useGoPrint();

  if (!session) {
    return null;
  }

  return (
    <article className="card">
      <h2>Dashboard {roleLabels[session.user.role]}</h2>
      <div className="order-list">
        {orders.map((order) => {
          const actions = getAvailableStatusActions(session.user.role, order);

          return (
            <article className="order-card" key={order.id}>
              <div className="order-head">
                <div>
                  <strong>{order.orderCode}</strong>
                  <p>{new Date(order.createdAt).toLocaleString("id-ID")}</p>
                </div>
                <span className={`status-pill ${statusTone[order.status]}`}>{order.status}</span>
              </div>

              <p className="order-meta">
                {order.pickupMethod === "delivery" ? "Diantar" : "Ambil sendiri"} |{" "}
                {order.paymentMethod === "cash" ? "Cash" : "Transfer"} | Rp
                {order.totalAmount.toLocaleString("id-ID")}
              </p>

              <p className="order-note">{getOrderStatusDescription(order.status)}</p>

              <ul className="item-list">
                {order.items.map((item) => (
                  <li key={item.id}>
                    <a href={item.fileUrl} rel="noreferrer" target="_blank">
                      {item.fileName}
                    </a>{" "}
                    | print {item.printQty} | copy {item.copyQty} | jilid {item.bindingQty} | source{" "}
                    {item.sourcePrintQty}
                    {item.description ? ` | ${item.description}` : ""}
                  </li>
                ))}
              </ul>

              <p className="order-note">{order.notes || "Tanpa catatan tambahan."}</p>

              {actions.length > 0 && (
                <div className="action-row">
                  {actions.map((action) => (
                    <button key={`${order.id}-${action.nextStatus}`} onClick={() => void updateOrderStatus(order.id, action.nextStatus)} type="button">
                      {action.label}
                    </button>
                  ))}
                </div>
              )}

              {session.user.role === "admin" && order.status !== "completed" && order.status !== "cancelled" && (
                <div className="action-row">
                  <button className="danger-btn" onClick={() => void deleteOrder(order.id)} type="button">
                    Hapus Pesanan
                  </button>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </article>
  );
}
