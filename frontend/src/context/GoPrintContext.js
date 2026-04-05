import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useEffect, useState } from "react";
import { demoAccounts, SESSION_KEY } from "../constants";
import { apiRequest } from "../lib/api";
import { readFileAsBase64 } from "../utils/file";
export const GoPrintContext = createContext(null);
export function GoPrintProvider({ children }) {
    const [session, setSession] = useState(null);
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState("Silakan login untuk mulai menggunakan GoPrint.");
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        const rawSession = window.localStorage.getItem(SESSION_KEY);
        if (!rawSession) {
            return;
        }
        setSession(JSON.parse(rawSession));
    }, []);
    useEffect(() => {
        if (!session) {
            return;
        }
        window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
        void refreshDashboard(session);
    }, [session]);
    async function refreshDashboard(activeSession) {
        setIsLoading(true);
        try {
            const [ordersResponse, usersResponse] = await Promise.all([
                apiRequest("/orders", {}, activeSession.token),
                apiRequest("/users", {}, activeSession.token)
            ]);
            setOrders(ordersResponse.data);
            setUsers(usersResponse.data);
            setMessage(`Halo ${activeSession.user.fullName}, dashboard GoPrint siap digunakan.`);
        }
        catch (error) {
            setMessage(error instanceof Error ? error.message : "Gagal memuat dashboard");
        }
        finally {
            setIsLoading(false);
        }
    }
    async function login(email, password) {
        setIsLoading(true);
        try {
            const response = await apiRequest("/auth/login", {
                method: "POST",
                body: JSON.stringify({ email, password })
            });
            setSession(response.data);
        }
        catch (error) {
            setMessage(error instanceof Error ? error.message : "Login gagal");
        }
        finally {
            setIsLoading(false);
        }
    }
    async function register(form) {
        setIsLoading(true);
        try {
            const response = await apiRequest("/auth/register", {
                method: "POST",
                body: JSON.stringify(form)
            });
            setSession(response.data);
        }
        catch (error) {
            setMessage(error instanceof Error ? error.message : "Register gagal");
        }
        finally {
            setIsLoading(false);
        }
    }
    function logout() {
        setSession(null);
        setOrders([]);
        setUsers([]);
        window.localStorage.removeItem(SESSION_KEY);
        setMessage("Anda telah logout dari GoPrint.");
    }
    async function createOrder(form, file) {
        if (!session) {
            return;
        }
        setIsLoading(true);
        try {
            if (!file) {
                throw new Error("Silakan pilih file dokumen terlebih dahulu");
            }
            const base64Content = await readFileAsBase64(file);
            const uploadResponse = await apiRequest("/uploads", {
                method: "POST",
                body: JSON.stringify({
                    fileName: file.name,
                    contentType: file.type || "application/octet-stream",
                    base64Content
                })
            }, session.token);
            const response = await apiRequest("/orders", {
                method: "POST",
                body: JSON.stringify({
                    pickupMethod: form.pickupMethod,
                    paymentMethod: form.paymentMethod,
                    deliveryAddress: form.deliveryAddress,
                    notes: form.orderNotes,
                    items: [
                        {
                            fileName: form.fileName || file.name,
                            fileUrl: uploadResponse.data.url,
                            fileType: form.fileType || file.type || "document",
                            printQty: Number(form.printQty),
                            copyQty: Number(form.copyQty),
                            bindingQty: Number(form.bindingQty),
                            description: form.description,
                            notes: form.notes
                        }
                    ]
                })
            }, session.token);
            setOrders((currentOrders) => [response.data, ...currentOrders]);
            setMessage(`Pesanan ${response.data.orderCode} berhasil dibuat.`);
        }
        catch (error) {
            setMessage(error instanceof Error ? error.message : "Gagal membuat pesanan");
        }
        finally {
            setIsLoading(false);
        }
    }
    async function updateOrderStatus(orderId, status) {
        if (!session) {
            return;
        }
        setIsLoading(true);
        try {
            const response = await apiRequest(`/orders/${orderId}`, {
                method: "PATCH",
                body: JSON.stringify({ status })
            }, session.token);
            setOrders((currentOrders) => currentOrders.map((currentOrder) => (currentOrder.id === orderId ? response.data : currentOrder)));
            setMessage(`Status ${response.data.orderCode} diperbarui menjadi ${status}.`);
        }
        catch (error) {
            setMessage(error instanceof Error ? error.message : "Gagal update status");
        }
        finally {
            setIsLoading(false);
        }
    }
    async function deleteOrder(orderId) {
        if (!session) {
            return;
        }
        setIsLoading(true);
        try {
            await apiRequest(`/orders/${orderId}`, { method: "DELETE" }, session.token);
            setOrders((currentOrders) => currentOrders.filter((order) => order.id !== orderId));
            setMessage("Pesanan berhasil dihapus.");
        }
        catch (error) {
            setMessage(error instanceof Error ? error.message : "Gagal menghapus pesanan");
        }
        finally {
            setIsLoading(false);
        }
    }
    return (_jsx(GoPrintContext.Provider, { value: {
            session,
            orders,
            users,
            message,
            isLoading,
            demoAccounts,
            login,
            register,
            logout,
            createOrder,
            updateOrderStatus,
            deleteOrder
        }, children: children }));
}
