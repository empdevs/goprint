import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { roleLabels, statusTone } from "../../constants";
import { useGoPrint } from "../../hooks/useGoPrint";
import { getAvailableStatusActions, getOrderStatusDescription } from "../../utils/order-status";
export function OrdersBoard() {
    const { session, orders, updateOrderStatus, deleteOrder } = useGoPrint();
    if (!session) {
        return null;
    }
    return (_jsxs("article", { className: "card", children: [_jsxs("h2", { children: ["Dashboard ", roleLabels[session.user.role]] }), _jsx("div", { className: "order-list", children: orders.map((order) => {
                    const actions = getAvailableStatusActions(session.user.role, order);
                    return (_jsxs("article", { className: "order-card", children: [_jsxs("div", { className: "order-head", children: [_jsxs("div", { children: [_jsx("strong", { children: order.orderCode }), _jsx("p", { children: new Date(order.createdAt).toLocaleString("id-ID") })] }), _jsx("span", { className: `status-pill ${statusTone[order.status]}`, children: order.status })] }), _jsxs("p", { className: "order-meta", children: [order.pickupMethod === "delivery" ? "Diantar" : "Ambil sendiri", " |", " ", order.paymentMethod === "cash" ? "Cash" : "Transfer", " | Rp", order.totalAmount.toLocaleString("id-ID")] }), _jsx("p", { className: "order-note", children: getOrderStatusDescription(order.status) }), _jsx("ul", { className: "item-list", children: order.items.map((item) => (_jsxs("li", { children: [_jsx("a", { href: item.fileUrl, rel: "noreferrer", target: "_blank", children: item.fileName }), " ", "| print ", item.printQty, " | copy ", item.copyQty, " | jilid ", item.bindingQty, " | source", " ", item.sourcePrintQty, item.description ? ` | ${item.description}` : ""] }, item.id))) }), _jsx("p", { className: "order-note", children: order.notes || "Tanpa catatan tambahan." }), actions.length > 0 && (_jsx("div", { className: "action-row", children: actions.map((action) => (_jsx("button", { onClick: () => void updateOrderStatus(order.id, action.nextStatus), type: "button", children: action.label }, `${order.id}-${action.nextStatus}`))) })), session.user.role === "admin" && order.status !== "completed" && order.status !== "cancelled" && (_jsx("div", { className: "action-row", children: _jsx("button", { className: "danger-btn", onClick: () => void deleteOrder(order.id), type: "button", children: "Hapus Pesanan" }) }))] }, order.id));
                }) })] }));
}
