import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { OrderCreateCard } from "./OrderCreateCard";
import { OrdersBoard } from "./OrdersBoard";
import { ProfileSummary } from "./ProfileSummary";
import { UsersCard } from "./UsersCard";
export function DashboardScreen() {
    return (_jsxs("section", { className: "dashboard-layout", children: [_jsx(ProfileSummary, {}), _jsx(OrderCreateCard, {}), _jsx(OrdersBoard, {}), _jsx(UsersCard, {})] }));
}
