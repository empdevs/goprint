import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AuthPanel } from "../components/auth/AuthPanel";
import { DashboardScreen } from "../components/dashboard/DashboardScreen";
import { HeroSection } from "../components/HeroSection";
import { StatusBar } from "../components/StatusBar";
import { useGoPrint } from "../hooks/useGoPrint";
export function AppShell() {
    const { session } = useGoPrint();
    return (_jsxs("main", { className: "app-shell", children: [_jsx(HeroSection, {}), _jsx(StatusBar, {}), session ? _jsx(DashboardScreen, {}) : _jsx(AuthPanel, {})] }));
}
