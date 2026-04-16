import { Divider, Typography } from "antd";
import { OrderCreateCard } from "../../components/dashboard/OrderCreateCard";
import { OrdersTable } from "../../components/OrdersTable";
import { UserLayout } from "../../components/layouts/UserLayout";
import { useGoPrint } from "../../hooks/useGoPrint";

export function UserOrdersPage() {
  const { orders } = useGoPrint();

  return (
    <UserLayout>
      <div className="page-section">
        <Typography.Title level={3}>Pesanan Saya</Typography.Title>
        <Typography.Paragraph>
          Susun pesanan seperti keranjang, kirim dokumen yang ingin diproses, lalu pantau statusnya
          sampai selesai.
        </Typography.Paragraph>
      </div>
      <OrderCreateCard />
      <Divider />
      <div className="page-section">
        <OrdersTable orders={orders.filter((order) => order.status !== "completed" && order.status !== "cancelled")} />
      </div>
    </UserLayout>
  );
}
