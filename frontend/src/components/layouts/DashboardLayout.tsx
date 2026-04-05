import {
  FileTextOutlined,
  HomeOutlined,
  LogoutOutlined,
  TeamOutlined,
  UserOutlined
} from "@ant-design/icons";
import { Avatar, Layout, Menu, Typography } from "antd";
import { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useGoPrint } from "../../hooks/useGoPrint";

const { Header, Sider, Content } = Layout;

type DashboardLayoutProps = {
  title: string;
  items: { key: string; label: string; icon: ReactNode }[];
  children: ReactNode;
};

export function DashboardLayout({ title, items, children }: DashboardLayoutProps) {
  const { session, logout } = useGoPrint();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Layout className="dashboard-shell">
      <Sider breakpoint="lg" collapsedWidth="0" width={260}>
        <div className="brand-block">
          <Typography.Title level={4} style={{ color: "white", margin: 0 }}>
            GoPrint
          </Typography.Title>
          <Typography.Text style={{ color: "rgba(255,255,255,0.7)" }}>{title}</Typography.Text>
        </div>
        <Menu
          items={[
            ...items,
            {
              key: "logout",
              icon: <LogoutOutlined />,
              label: "Logout"
            }
          ]}
          mode="inline"
          onClick={({ key }) => {
            if (key === "logout") {
              logout();
              navigate("/");
              return;
            }

            navigate(key);
          }}
          selectedKeys={[location.pathname]}
          theme="dark"
        />
      </Sider>
      <Layout>
        <Header className="dashboard-header">
          <div>
            <Typography.Title level={3} style={{ margin: 0 }}>
              {title}
            </Typography.Title>
            <Typography.Text type="secondary">Kelola operasional GoPrint dengan lebih rapi.</Typography.Text>
          </div>
          <div className="header-user">
            <Avatar icon={<UserOutlined />} />
            <div>
              <Typography.Text strong>{session?.user.fullName}</Typography.Text>
              <br />
              <Typography.Text type="secondary">{session?.user.email}</Typography.Text>
            </div>
          </div>
        </Header>
        <Content className="dashboard-content">{children}</Content>
      </Layout>
    </Layout>
  );
}

export const adminMenuItems = [
  { key: "/admin", label: "Overview", icon: <HomeOutlined /> },
  { key: "/admin/orders", label: "Pesanan", icon: <FileTextOutlined /> },
  { key: "/admin/users", label: "Pengguna", icon: <TeamOutlined /> }
];

export const copyShopMenuItems = [
  { key: "/copy-shop", label: "Overview", icon: <HomeOutlined /> },
  { key: "/copy-shop/orders", label: "Antrian Pesanan", icon: <FileTextOutlined /> }
];
