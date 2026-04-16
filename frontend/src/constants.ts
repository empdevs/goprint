import {
  FeedbackFormState,
  OrderFormState,
  OrderStatus,
  RegisterFormState,
  StatusAction,
  UserRole
} from "./types";

export const SESSION_KEY = "goprint-session";
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000/api";

export const demoAccounts = [
  "Admin: admin@goprint.local / admin123",
  "Copy shop: copyshop@goprint.local / copy123",
  "User: user@goprint.local / student123"
];

export const roleLabels: Record<UserRole, string> = {
  admin: "Admin",
  copy_shop: "Tukang Fotokopi",
  user: "Mahasiswa / Dosen"
};

export const statusTone: Record<OrderStatus, string> = {
  pending: "tone-yellow",
  confirmed: "tone-blue",
  processing: "tone-blue",
  ready_for_pickup: "tone-green",
  out_for_delivery: "tone-blue",
  completed: "tone-green",
  cancelled: "tone-red"
};

export const initialRegisterForm: RegisterFormState = {
  fullName: "",
  email: "",
  nim: "",
  studyProgram: "",
  password: ""
};

export const initialFeedbackForm: FeedbackFormState = {
  name: "",
  nim: "",
  studyProgram: "",
  comment: ""
};

export const initialOrderForm: OrderFormState = {
  fileName: "",
  fileType: "pdf",
  printQty: 1,
  copyQty: 0,
  bindingQty: 0,
  description: "",
  notes: "",
  pickupMethod: "pickup",
  paymentMethod: "cash",
  deliveryAddress: "",
  orderNotes: ""
};

export const userStatusActions: Record<OrderStatus, StatusAction[]> = {
  pending: [{ label: "Batalkan", nextStatus: "cancelled" }],
  confirmed: [],
  processing: [],
  ready_for_pickup: [{ label: "Sudah Diambil", nextStatus: "completed" }],
  out_for_delivery: [{ label: "Sudah Diterima", nextStatus: "completed" }],
  completed: [],
  cancelled: []
};

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  processing: "Processing",
  ready_for_pickup: "Ready for Pickup",
  out_for_delivery: "Out for Delivery",
  completed: "Completed",
  cancelled: "Cancelled"
};
