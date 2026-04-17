import { Button, Space, Table, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useMemo } from "react";
import { useGoPrint } from "../hooks/useGoPrint";
import { getAvailableStatusActions } from "../utils/order-status";
import { Order } from "../types";
import { OrderStatusTag } from "./OrderStatusTag";
import { ORDER_STATUS_LABELS, API_BASE_URL } from "../constants";

type OrdersTableProps = {
  orders: Order[];
  canDelete?: boolean;
};

export function OrdersTable({ orders, canDelete = false }: OrdersTableProps) {
  const { session, updateOrderStatus, deleteOrder } = useGoPrint();

  const columns = useMemo<ColumnsType<Order>>(() => {
    const baseColumns: ColumnsType<Order> = [
      {
        title: "Kode",
        dataIndex: "orderCode",
        key: "orderCode"
      },
      {
        title: "Dokumen",
        key: "items",
        render: (_, order) => (
          <Space direction="vertical" size={2}>
            {order.items.map((item) => (
              <Typography.Link
                key={item.id}
                onClick={async () => {
                  if (!session) return;
                  try {
                    const res = await fetch(`${API_BASE_URL}/uploads/download?url=${encodeURIComponent(item.fileUrl)}`, {
                      headers: { Authorization: `Bearer ${session.token}` }
                    });
                    if (!res.ok) throw new Error("Gagal akses file");
                    
                    const blob = await res.blob();
                    const fileType = res.headers.get("Content-Type") || "application/octet-stream";
                    const fileBlob = new Blob([blob], { type: fileType });
                    
                    const objUrl = window.URL.createObjectURL(fileBlob);
                    window.open(objUrl, "PreviewDokumen", "width=800,height=800,menubar=no,toolbar=no,location=no,status=no");
                    setTimeout(() => window.URL.revokeObjectURL(objUrl), 60000);
                  } catch (error) {
                    console.error(error);
                    alert("Gagal membuka dokumen yang diproteksi.");
                  }
                }}
              >
                {item.fileName}
              </Typography.Link>
            ))}
          </Space>
        )
      },
      {
        title: "Gerai",
        key: "copyShop",
        render: (_, order) => order.assignedCopyShopName ?? "-"
      },
      {
        title: "Layanan",
        key: "services",
        render: (_, order) => (
          <Space direction="vertical" size={2}>
            {order.items.map((item) => (
              <span key={item.id}>
                Print {item.printQty} | Copy {item.copyQty} | Jilid {item.bindingQty}
              </span>
            ))}
          </Space>
        )
      },
      {
        title: "Pengambilan",
        key: "pickupMethod",
        render: (_, order) => (order.pickupMethod === "delivery" ? "Diantar" : "Ambil sendiri")
      },
      {
        title: "Status",
        key: "status",
        render: (_, order) => <OrderStatusTag status={order.status} label={ORDER_STATUS_LABELS[order.status]} />
      },
      {
        title: "Total",
        key: "totalAmount",
        render: (_, order) => `Rp${order.totalAmount.toLocaleString("id-ID")}`
      }
    ];

    if (!session) {
      return baseColumns;
    }

    return [
      ...baseColumns,
      {
        title: "Aksi",
        key: "actions",
        render: (_, order) => {
          const actions = getAvailableStatusActions(session.user.role, order);

          return (
            <Space wrap>
              {actions.map((action) => (
                <Button
                  key={`${order.id}-${action.nextStatus}`}
                  onClick={() => void updateOrderStatus(order.id, action.nextStatus)}
                  size="small"
                >
                  {action.label}
                </Button>
              ))}
              {canDelete && order.status !== "completed" && order.status !== "cancelled" && (
                <Button danger onClick={() => void deleteOrder(order.id)} size="small">
                  Hapus
                </Button>
              )}
            </Space>
          );
        }
      }
    ];
  }, [canDelete, deleteOrder, session, updateOrderStatus]);

  return (
    <Table
      columns={columns}
      dataSource={orders}
      pagination={{ pageSize: 5 }}
      rowKey="id"
      scroll={{ x: 900 }}
    />
  );
}
