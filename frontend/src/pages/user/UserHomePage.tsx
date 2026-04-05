import { ArrowRightOutlined, HistoryOutlined, OrderedListOutlined } from "@ant-design/icons";
import { Button, Card, Col, Row, Statistic, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { UserLayout } from "../../components/layouts/UserLayout";
import { useGoPrint } from "../../hooks/useGoPrint";

export function UserHomePage() {
  const navigate = useNavigate();
  const { orders, session } = useGoPrint();

  return (
    <UserLayout>
      <div className="user-page-hero">
        <div>
          <Typography.Title>GoPrint untuk {session?.user.fullName}</Typography.Title>
          <Typography.Paragraph>
            Pesan print, fotokopi, dan jilid dokumen kampus dengan cepat. Pantau statusnya secara
            real-time tanpa perlu turun ke basement atau kantin.
          </Typography.Paragraph>
          <Button icon={<ArrowRightOutlined />} onClick={() => navigate("/app/orders")} size="large" type="primary">
            Buat Pesanan Sekarang
          </Button>
        </div>
      </div>

      <Row gutter={[16, 16]}>
        <Col md={8} xs={24}>
          <Card>
            <Statistic title="Total Pesanan" value={orders.length} />
          </Card>
        </Col>
        <Col md={8} xs={24}>
          <Card>
            <Statistic title="Sedang Diproses" value={orders.filter((order) => ["pending", "confirmed", "processing"].includes(order.status)).length} />
          </Card>
        </Col>
        <Col md={8} xs={24}>
          <Card>
            <Statistic title="Selesai" value={orders.filter((order) => order.status === "completed").length} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 8 }}>
        <Col md={12} xs={24}>
          <Card actions={[<Button icon={<OrderedListOutlined />} onClick={() => navigate("/app/orders")} type="link">Lihat Pesanan</Button>]}>
            <Card.Meta description="Pantau seluruh pesanan aktif, lihat detail dokumen, dan konfirmasi penerimaan hasil." title="Pesanan Aktif" />
          </Card>
        </Col>
        <Col md={12} xs={24}>
          <Card actions={[<Button icon={<HistoryOutlined />} onClick={() => navigate("/app/history")} type="link">Lihat History</Button>]}>
            <Card.Meta description="Akses riwayat pesanan yang sudah selesai atau dibatalkan dengan cepat." title="Riwayat Pesanan" />
          </Card>
        </Col>
      </Row>
    </UserLayout>
  );
}
