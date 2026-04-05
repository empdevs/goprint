import { Typography } from "antd";
import { DashboardLayout, adminMenuItems } from "../../components/layouts/DashboardLayout";
import { OrdersTable } from "../../components/OrdersTable";
import { useGoPrint } from "../../hooks/useGoPrint";

export function AdminOrdersPage() {
  const { orders } = useGoPrint();

  return (
    <DashboardLayout items={adminMenuItems} title="Admin Dashboard">
      <div className="page-section">
        <Typography.Title level={4}>Manajemen Semua Pesanan</Typography.Title>
        <OrdersTable canDelete orders={orders} />
      </div>
    </DashboardLayout>
  );
}
