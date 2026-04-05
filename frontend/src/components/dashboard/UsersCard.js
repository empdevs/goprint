import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { roleLabels } from "../../constants";
import { useGoPrint } from "../../hooks/useGoPrint";
export function UsersCard() {
    const { session, users } = useGoPrint();
    if (!session || session.user.role !== "admin") {
        return null;
    }
    return (_jsxs("article", { className: "card", children: [_jsx("h2", { children: "Daftar Pengguna" }), _jsx("div", { className: "user-grid", children: users.map((user) => (_jsxs("div", { className: "user-card", children: [_jsx("strong", { children: user.fullName }), _jsx("span", { children: roleLabels[user.role] }), _jsx("p", { children: user.email }), _jsx("p", { children: user.nim || "-" }), _jsx("p", { children: user.studyProgram || "-" }), _jsx("p", { children: user.campusLocation })] }, user.id))) })] }));
}
