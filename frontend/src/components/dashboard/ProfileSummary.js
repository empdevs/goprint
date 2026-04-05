import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { roleLabels } from "../../constants";
import { useGoPrint } from "../../hooks/useGoPrint";
export function ProfileSummary() {
    const { session, orders, users, logout } = useGoPrint();
    if (!session) {
        return null;
    }
    return (_jsxs("article", { className: "card", children: [_jsxs("div", { className: "profile-head", children: [_jsxs("div", { children: [_jsx("p", { className: "eyebrow", children: "Role Aktif" }), _jsx("h2", { children: roleLabels[session.user.role] }), _jsx("p", { children: session.user.fullName })] }), _jsx("button", { className: "ghost-btn", onClick: logout, type: "button", children: "Logout" })] }), _jsxs("div", { className: "stats-grid", children: [_jsxs("div", { className: "stat-box", children: [_jsx("span", { children: "Total Order" }), _jsx("strong", { children: orders.length })] }), _jsxs("div", { className: "stat-box", children: [_jsx("span", { children: "Pengguna Terdaftar" }), _jsx("strong", { children: users.length })] }), _jsxs("div", { className: "stat-box", children: [_jsx("span", { children: "Pesanan Selesai" }), _jsx("strong", { children: orders.filter((order) => order.status === "completed").length })] })] })] }));
}
