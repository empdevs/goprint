export type UserRole = "admin" | "copy_shop" | "student" | "lecturer";

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

export type User = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  nim: string;
  studyProgram: string;
  password: string;
  role: UserRole;
  campusLocation: string;
  createdAt: string;
};

export type Order = {
  id: string;
  orderCode: string;
  userId: string;
  assignedCopyShopId?: string;
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

export type Session = {
  token: string;
  userId: string;
  createdAt: string;
};
