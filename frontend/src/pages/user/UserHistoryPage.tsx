import { Empty, Typography } from "antd";
import { OrdersTable } from "../../components/OrdersTable";
import { UserLayout } from "../../components/layouts/UserLayout";
import { useGoPrint } from "../../hooks/useGoPrint";

export function UserHistoryPage() {
  const { orders } = useGoPrint();
  const historyOrders = orders.filter((order) => order.status === "completed" || order.status === "cancelled");

  return (
    <UserLayout>
      <div className="page-section">
        <Typography.Title level={3}>History Pesanan</Typography.Title>
        <Typography.Paragraph>
          Semua pesanan yang telah selesai atau dibatalkan akan muncul di sini.
        </Typography.Paragraph>
      </div>
      {historyOrders.length === 0 ? <Empty description="Belum ada history pesanan" /> : <OrdersTable orders={historyOrders} />}
    </UserLayout>
  );
}
