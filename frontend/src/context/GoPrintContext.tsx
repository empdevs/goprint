import { ReactNode, createContext, useEffect, useState } from "react";
import { demoAccounts, SESSION_KEY } from "../constants";
import { apiRequest } from "../lib/api";
import { readFileAsBase64 } from "../utils/file";
import {
  AppSession,
  AuthUser,
  Feedback,
  FeedbackFormState,
  Order,
  OrderFormState,
  OrderStatus,
  RegisterFormState,
  UploadResponse
} from "../types";

type GoPrintContextValue = {
  session: AppSession | null;
  orders: Order[];
  users: AuthUser[];
  feedbacks: Feedback[];
  message: string;
  isLoading: boolean;
  demoAccounts: string[];
  login: (email: string, password: string) => Promise<void>;
  register: (form: RegisterFormState) => Promise<void>;
  logout: () => void;
  createOrder: (form: OrderFormState, file: File | null) => Promise<void>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  deleteOrder: (orderId: string) => Promise<void>;
  updateProfile: (payload: {
    fullName: string;
    phone: string;
    nim: string;
    studyProgram: string;
    campusLocation: string;
  }) => Promise<void>;
  submitFeedback: (payload: FeedbackFormState) => Promise<void>;
};

export const GoPrintContext = createContext<GoPrintContextValue | null>(null);

export function GoPrintProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AppSession | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [message, setMessage] = useState("Silakan login untuk mulai menggunakan GoPrint.");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    void loadFeedbacks();
  }, []);

  useEffect(() => {
    const rawSession = window.localStorage.getItem(SESSION_KEY);

    if (!rawSession) {
      return;
    }

    setSession(JSON.parse(rawSession) as AppSession);
  }, []);

  async function loadFeedbacks() {
    try {
      const response = await apiRequest<Feedback[]>("/feedbacks");
      setFeedbacks(response.data);
    } catch {
      setFeedbacks([]);
    }
  }

  useEffect(() => {
    if (!session) {
      return;
    }

    window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    void refreshDashboard(session);
  }, [session]);

  async function refreshDashboard(activeSession: AppSession) {
    setIsLoading(true);

    try {
      const [ordersResponse, usersResponse] = await Promise.all([
        apiRequest<Order[]>("/orders", {}, activeSession.token),
        apiRequest<AuthUser[]>("/users", {}, activeSession.token)
      ]);

      setOrders(ordersResponse.data);
      setUsers(usersResponse.data);
      setMessage(`Halo ${activeSession.user.fullName}, dashboard GoPrint siap digunakan.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Gagal memuat dashboard");
    } finally {
      setIsLoading(false);
    }
  }

  async function login(email: string, password: string) {
    setIsLoading(true);

    try {
      const response = await apiRequest<AppSession>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password })
      });

      setSession(response.data);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Login gagal");
    } finally {
      setIsLoading(false);
    }
  }

  async function register(form: RegisterFormState) {
    setIsLoading(true);

    try {
      const response = await apiRequest<AppSession>("/auth/register", {
        method: "POST",
        body: JSON.stringify(form)
      });

      setSession(response.data);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Register gagal");
    } finally {
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

  async function createOrder(form: OrderFormState, file: File | null) {
    if (!session) {
      return;
    }

    setIsLoading(true);

    try {
      if (!file) {
        throw new Error("Silakan pilih file dokumen terlebih dahulu");
      }

      const base64Content = await readFileAsBase64(file);
      const uploadResponse = await apiRequest<UploadResponse>(
        "/uploads",
        {
          method: "POST",
          body: JSON.stringify({
            fileName: file.name,
            contentType: file.type || "application/octet-stream",
            base64Content
          })
        },
        session.token
      );

      const response = await apiRequest<Order>(
        "/orders",
        {
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
        },
        session.token
      );

      setOrders((currentOrders) => [response.data, ...currentOrders]);
      setMessage(`Pesanan ${response.data.orderCode} berhasil dibuat.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Gagal membuat pesanan");
    } finally {
      setIsLoading(false);
    }
  }

  async function updateOrderStatus(orderId: string, status: OrderStatus) {
    if (!session) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiRequest<Order>(
        `/orders/${orderId}`,
        {
          method: "PATCH",
          body: JSON.stringify({ status })
        },
        session.token
      );

      setOrders((currentOrders) =>
        currentOrders.map((currentOrder) => (currentOrder.id === orderId ? response.data : currentOrder))
      );
      setMessage(`Status ${response.data.orderCode} diperbarui menjadi ${status}.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Gagal update status");
    } finally {
      setIsLoading(false);
    }
  }

  async function deleteOrder(orderId: string) {
    if (!session) {
      return;
    }

    setIsLoading(true);

    try {
      await apiRequest<Order>(`/orders/${orderId}`, { method: "DELETE" }, session.token);
      setOrders((currentOrders) => currentOrders.filter((order) => order.id !== orderId));
      setMessage("Pesanan berhasil dihapus.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Gagal menghapus pesanan");
    } finally {
      setIsLoading(false);
    }
  }

  async function updateProfile(payload: {
    fullName: string;
    phone: string;
    nim: string;
    studyProgram: string;
    campusLocation: string;
  }) {
    if (!session) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiRequest<AuthUser>(
        "/users/me",
        {
          method: "PATCH",
          body: JSON.stringify(payload)
        },
        session.token
      );

      const nextSession = {
        ...session,
        user: response.data
      };

      setSession(nextSession);
      setUsers((currentUsers) =>
        currentUsers.map((user) => (user.id === response.data.id ? response.data : user))
      );
      setMessage("Profil berhasil diperbarui.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Gagal memperbarui profil");
    } finally {
      setIsLoading(false);
    }
  }

  async function submitFeedback(payload: FeedbackFormState) {
    setIsLoading(true);

    try {
      const response = await apiRequest<Feedback>(
        "/feedbacks",
        {
          method: "POST",
          body: JSON.stringify({
            name: payload.name,
            nim: payload.nim,
            studyProgram: payload.studyProgram,
            comment: payload.comment
          })
        }
      );

      setFeedbacks((currentFeedbacks) => [response.data, ...currentFeedbacks]);
      setMessage("Terima kasih, feedback kamu sudah masuk.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Gagal mengirim feedback");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <GoPrintContext.Provider
      value={{
        session,
        orders,
        users,
        feedbacks,
        message,
        isLoading,
        demoAccounts,
        login,
        register,
        logout,
        createOrder,
        updateOrderStatus,
        deleteOrder,
        updateProfile,
        submitFeedback
      }}
    >
      {children}
    </GoPrintContext.Provider>
  );
}
