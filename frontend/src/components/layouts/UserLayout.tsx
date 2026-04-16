import {
  HistoryOutlined,
  HomeOutlined,
  LogoutOutlined,
  MenuOutlined,
  OrderedListOutlined,
  UserOutlined
} from "@ant-design/icons";
import { Avatar, Button, Dropdown, Grid, Layout, Menu, Space, Typography } from "antd";
import { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useGoPrint } from "../../hooks/useGoPrint";
import { roleLabels } from "../../constants";

const { Header, Content } = Layout;
const { useBreakpoint } = Grid;

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
  const screens = useBreakpoint();
  const isMobile = !screens.lg;
  const accountMenuItems = [
    {
      key: "account",
      disabled: true,
      label: (
        <Space align="start" size={12}>
          <Avatar icon={<UserOutlined />} />
          <div className="account-menu-info">
            <Typography.Text strong>{session?.user.fullName}</Typography.Text>
            <Typography.Text type="secondary">
              {session ? roleLabels[session.user.role] : ""}
            </Typography.Text>
          </div>
        </Space>
      )
    },
    {
      type: "divider" as const
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout"
    }
  ];

  return (
    <Layout className="user-shell">
      <Header className="user-header">
        <div className="user-brand">
          <Typography.Title level={3} style={{ margin: 0 }}>
            GoPrint
          </Typography.Title>
          <Typography.Text type="secondary">Print kampus tanpa antre lift.</Typography.Text>
        </div>
        {isMobile ? (
          <Dropdown
            menu={{
              items: accountMenuItems,
              onClick: ({ key }) => {
                if (key === "logout") {
                  logout();
                }
              }
            }}
            placement="bottomRight"
            trigger={["click"]}
          >
            <Button className="mobile-account-trigger" icon={<MenuOutlined />} type="text" />
          </Dropdown>
        ) : (
          <div className="header-user">
            <Avatar icon={<UserOutlined />} />
            <div className="user-info">
              <Typography.Text strong>{session?.user.fullName}</Typography.Text>
              <Typography.Text type="secondary">
                {session ? roleLabels[session.user.role] : ""}
              </Typography.Text>
            </div>
            <Button icon={<LogoutOutlined />} onClick={logout} size="large">
              Logout
            </Button>
          </div>
        )}
      </Header>
      {!isMobile && (
        <Menu
          className="user-menu user-menu-desktop"
          items={userMenuItems}
          mode="horizontal"
          onClick={({ key }) => navigate(key)}
          selectedKeys={[location.pathname]}
        />
      )}
      <Content className={`user-content ${isMobile ? "user-content-mobile" : ""}`}>{children}</Content>
      {isMobile && (
        <div className="user-mobile-nav">
          <Menu
            className="user-menu-mobile"
            items={userMenuItems}
            mode="horizontal"
            onClick={({ key }) => navigate(key)}
            selectedKeys={[location.pathname]}
          />
        </div>
      )}
    </Layout>
  );
}
