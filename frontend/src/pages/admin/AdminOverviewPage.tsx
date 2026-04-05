import { Col, Row, Statistic, Typography } from "antd";
import { DashboardLayout, adminMenuItems } from "../../components/layouts/DashboardLayout";
import { OrdersTable } from "../../components/OrdersTable";
import { useGoPrint } from "../../hooks/useGoPrint";

export function AdminOverviewPage() {
  const { orders, users } = useGoPrint();

  return (
    <DashboardLayout items={adminMenuItems} title="Admin Dashboard">
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Statistic title="Total Pengguna" value={users.length} />
        </Col>
        <Col span={8}>
          <Statistic title="Pesanan Aktif" value={orders.filter((order) => !["completed", "cancelled"].includes(order.status)).length} />
        </Col>
        <Col span={8}>
          <Statistic title="Pesanan Selesai" value={orders.filter((order) => order.status === "completed").length} />
        </Col>
      </Row>
      <div className="page-section">
        <Typography.Title level={4}>Ringkasan Pesanan Terbaru</Typography.Title>
        <OrdersTable canDelete orders={orders.slice(0, 5)} />
      </div>
    </DashboardLayout>
  );
}
