import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useGoPrint } from "../hooks/useGoPrint";
export function StatusBar() {
    const { message, isLoading } = useGoPrint();
    return (_jsxs("section", { className: "status-bar", children: [_jsx("span", { children: message }), isLoading ? _jsx("strong", { children: "Memproses..." }) : _jsx("strong", { children: "Siap" })] }));
}
