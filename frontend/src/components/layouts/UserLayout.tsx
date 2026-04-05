import { HistoryOutlined, HomeOutlined, LogoutOutlined, OrderedListOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Layout, Menu, Typography } from "antd";
import { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useGoPrint } from "../../hooks/useGoPrint";

const { Header, Content } = Layout;

const userMenuItems = [
  { key: "/app", label: "Beranda", icon: <HomeOutlined /> },
  { key: "/app/orders", label: "Pesanan", icon: <OrderedListOutlined /> },
  { key: "/app/history", label: "History", icon: <HistoryOutlined /> },
  { key: "/app/profile", label: "Profil", icon: <UserOutlined /> }
];

export function UserLayout({ children }: { children: ReactNode }) {
  const { session, logout } = useGoPrint();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Layout className="user-shell">
      <Header className="user-header">
        <div className="user-brand">
          <Typography.Title level={3} style={{ margin: 0 }}>
            GoPrint
          </Typography.Title>
          <Typography.Text type="secondary">Print kampus tanpa antre lift.</Typography.Text>
        </div>
        <Menu
          className="user-menu"
          items={userMenuItems}
          mode="horizontal"
          onClick={({ key }) => navigate(key)}
          selectedKeys={[location.pathname]}
        />
        <div className="header-user">
          <Avatar icon={<UserOutlined />} />
          <div className="user-info">
            <Typography.Text strong>{session?.user.fullName}</Typography.Text>
            <Typography.Text type="secondary">{session?.user.role}</Typography.Text>
          </div>
          <Button icon={<LogoutOutlined />} onClick={logout}>
            Logout
          </Button>
        </div>
      </Header>
      <Content className="user-content">{children}</Content>
    </Layout>
  );
}
