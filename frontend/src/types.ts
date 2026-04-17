export type UserRole = "admin" | "copy_shop" | "user";
export type PickupMethod = "pickup" | "delivery";
export type PaymentMethod = "cash" | "bank_transfer";
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "ready_for_pickup"
  | "out_for_delivery"
  | "completed"
  | "cancelled";

export type AuthUser = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  nim: string;
  studyProgram: string;
  role: UserRole;
  campusLocation: string;
  createdAt: string;
};

export type OrderItem = {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  printQty: number;
  copyQty: number;
  bindingQty: number;
  sourcePrintQty: number;
  totalPrintedSheets: number;
  description: string;
  notes: string;
};

export type Order = {
  id: string;
  orderCode: string;
  userId: string;
  assignedCopyShopId?: string;
  assignedCopyShopName?: string;
  assignedCopyShopLocationNote?: string;
  pickupMethod: PickupMethod;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  notes: string;
  deliveryAddress: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
};

export type AppSession = {
  token: string;
  user: AuthUser;
};

export type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

export type UploadResponse = {
  url: string;
  pathname: string;
  contentType: string;
};

export type RegisterFormState = {
  fullName: string;
  email: string;
  nim: string;
  studyProgram: string;
  password: string;
};

export type Feedback = {
  id: string;
  name: string;
  nim: string;
  studyProgram: string;
  comment: string;
  createdAt: string;
};

export type FeedbackFormState = {
  name: string;
  nim: string;
  studyProgram: string;
  comment: string;
};

export type CopyShop = {
  id: string;
  userId: string;
  shopName: string;
  locationNote: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type OrderDraftItem = {
  id: string;
  file: File;
  fileName: string;
  printQty: number;
  copyQty: number;
  bindingQty: number;
  description: string;
};

export type OrderFormState = {
  items: OrderDraftItem[];
  copyShopId: string;
  pickupMethod: PickupMethod;
  paymentMethod: PaymentMethod;
  deliveryAddress: string;
};

export type StatusAction = {
  label: string;
  nextStatus: OrderStatus;
};

export type CreateCopyShopFormState = {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  campusLocation: string;
  shopName: string;
  locationNote: string;
};
