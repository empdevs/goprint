import { Col, Row, Statistic, Typography } from "antd";
import { DashboardLayout, copyShopMenuItems } from "../../components/layouts/DashboardLayout";
import { OrdersTable } from "../../components/OrdersTable";
import { useGoPrint } from "../../hooks/useGoPrint";

export function CopyShopOverviewPage() {
  const { orders } = useGoPrint();

  return (
    <DashboardLayout items={copyShopMenuItems} title="Dashboard Tukang Fotokopi">
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Statistic title="Order Baru" value={orders.filter((order) => order.status === "pending").length} />
        </Col>
        <Col span={8}>
          <Statistic title="Sedang Diproses" value={orders.filter((order) => ["confirmed", "processing"].includes(order.status)).length} />
        </Col>
        <Col span={8}>
          <Statistic title="Siap Diserahkan" value={orders.filter((order) => ["ready_for_pickup", "out_for_delivery"].includes(order.status)).length} />
        </Col>
      </Row>
      <div className="page-section">
        <Typography.Title level={4}>Antrian Hari Ini</Typography.Title>
        <OrdersTable orders={orders.filter((order) => order.status !== "completed" && order.status !== "cancelled")} />
      </div>
    </DashboardLayout>
  );
}
