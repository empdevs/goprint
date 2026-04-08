import { Button, Space, Table, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useMemo } from "react";
import { useGoPrint } from "../hooks/useGoPrint";
import { getAvailableStatusActions } from "../utils/order-status";
import { Order } from "../types";
import { OrderStatusTag } from "./OrderStatusTag";
import { ORDER_STATUS_LABELS } from "../constants";

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
              <Typography.Link href={item.fileUrl} key={item.id} target="_blank">
                {item.fileName}
              </Typography.Link>
            ))}
          </Space>
        )
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

  return <Table columns={columns} dataSource={orders} pagination={{ pageSize: 5 }} rowKey="id" />;
}
