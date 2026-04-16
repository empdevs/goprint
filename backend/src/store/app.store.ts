import { Order, Session, User } from "../types/domain.js";
import { createId, createOrderCode } from "../utils/id.js";

const now = new Date().toISOString();

const users: User[] = [
  {
    id: "8f94516d-31b2-47db-ab3b-65b0db0caf38",
    fullName: "Admin GoPrint",
    email: "admin@goprint.local",
    phone: "081200000001",
    nim: "",
    studyProgram: "",
    password: "admin123",
    role: "admin",
    campusLocation: "Gedung Viktor Lt. 1",
    createdAt: now
  },
  {
    id: "6d49acb3-1c58-4f13-b1ca-b40985a03886",
    fullName: "Basement Print Center",
    email: "copyshop@goprint.local",
    phone: "081200000002",
    nim: "",
    studyProgram: "",
    password: "copy123",
    role: "copy_shop",
    campusLocation: "Basement Kampus",
    createdAt: now
  },
  {
    id: "0e64804a-3b0e-4bb6-a8b1-912c370428e8",
    fullName: "Alya Mahasiswa",
    email: "user@goprint.local",
    phone: "081200000003",
    nim: "221011700123",
    studyProgram: "Teknik Informatika",
    password: "student123",
    role: "user",
    campusLocation: "Gedung Viktor Lt. 5",
    createdAt: now
  }
];

const sessions: Session[] = [];

const orders: Order[] = [
  {
    id: "5d533c27-4d57-42f9-9c65-1c1cf0f71234",
    orderCode: createOrderCode(),
    userId: "0e64804a-3b0e-4bb6-a8b1-912c370428e8",
    assignedCopyShopId: "6d49acb3-1c58-4f13-b1ca-b40985a03886",
    pickupMethod: "delivery",
    paymentMethod: "bank_transfer",
    status: "processing",
    notes: "Mohon diprioritaskan untuk presentasi jam 13.00",
    deliveryAddress: "Gedung Viktor Lt. 5 Ruang Kelas A",
    items: [
      {
        id: createId("item"),
        fileName: "proposal-skripsi.pdf",
        fileUrl: "https://example.com/proposal-skripsi.pdf",
        fileType: "pdf",
        printQty: 2,
        copyQty: 4,
        bindingQty: 1,
        sourcePrintQty: 0,
        totalPrintedSheets: 2,
        description: "Print, fotokopi, dan jilid untuk proposal",
        notes: ""
      }
    ],
    subtotal: 5000,
    deliveryFee: 3000,
    totalAmount: 8000,
    createdAt: now,
    updatedAt: now
  }
];

export const appStore = {
  users,
  sessions,
  orders
};
