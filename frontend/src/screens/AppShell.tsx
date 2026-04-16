import { ReactNode } from "react";
import { ConfigProvider, Result, Spin } from "antd";
import { Navigate, Route, Routes } from "react-router-dom";
import { useGoPrint } from "../hooks/useGoPrint";
import { UserRole } from "../types";
import { AuthLandingPage } from "../pages/AuthLandingPage";
import { AdminOrdersPage } from "../pages/admin/AdminOrdersPage";
import { AdminOverviewPage } from "../pages/admin/AdminOverviewPage";
import { AdminUsersPage } from "../pages/admin/AdminUsersPage";
import { CopyShopOrdersPage } from "../pages/copy-shop/CopyShopOrdersPage";
import { CopyShopOverviewPage } from "../pages/copy-shop/CopyShopOverviewPage";
import { UserHistoryPage } from "../pages/user/UserHistoryPage";
import { UserHomePage } from "../pages/user/UserHomePage";
import { UserOrdersPage } from "../pages/user/UserOrdersPage";
import { UserProfilePage } from "../pages/user/UserProfilePage";

function RoleRedirect() {
  const { session } = useGoPrint();

  if (!session) {
    return <Navigate replace to="/" />;
  }

  if (session.user.role === "admin") {
    return <Navigate replace to="/admin" />;
  }

  if (session.user.role === "copy_shop") {
    return <Navigate replace to="/copy-shop" />;
  }

  return <Navigate replace to="/app" />;
}

function ProtectedRoute({
  allow,
  children
}: {
  allow: UserRole[];
  children: ReactNode;
}) {
  const { session, isLoading } = useGoPrint();

  if (isLoading && !session) {
    return <Spin fullscreen />;
  }

  if (!session) {
    return <Navigate replace to="/" />;
  }

  if (!allow.includes(session.user.role)) {
    return (
      <Result
        extra={<Navigate replace to="/redirect" />}
        status="403"
        subTitle="Role akun ini tidak memiliki akses ke halaman tersebut."
        title="Akses Ditolak"
      />
    );
  }

  return children;
}

export function AppShell() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#0f6bcf",
          borderRadius: 14
        }
      }}
    >
      <Routes>
        <Route element={<AuthLandingPage />} path="/" />
        <Route element={<RoleRedirect />} path="/redirect" />

        <Route
          element={
            <ProtectedRoute allow={["admin"]}>
              <AdminOverviewPage />
            </ProtectedRoute>
          }
          path="/admin"
        />
        <Route
          element={
            <ProtectedRoute allow={["admin"]}>
              <AdminOrdersPage />
            </ProtectedRoute>
          }
          path="/admin/orders"
        />
        <Route
          element={
            <ProtectedRoute allow={["admin"]}>
              <AdminUsersPage />
            </ProtectedRoute>
          }
          path="/admin/users"
        />

        <Route
          element={
            <ProtectedRoute allow={["copy_shop"]}>
              <CopyShopOverviewPage />
            </ProtectedRoute>
          }
          path="/copy-shop"
        />
        <Route
          element={
            <ProtectedRoute allow={["copy_shop"]}>
              <CopyShopOrdersPage />
            </ProtectedRoute>
          }
          path="/copy-shop/orders"
        />

        <Route
          element={
            <ProtectedRoute allow={["user"]}>
              <UserHomePage />
            </ProtectedRoute>
          }
          path="/app"
        />
        <Route
          element={
            <ProtectedRoute allow={["user"]}>
              <UserOrdersPage />
            </ProtectedRoute>
          }
          path="/app/orders"
        />
        <Route
          element={
            <ProtectedRoute allow={["user"]}>
              <UserHistoryPage />
            </ProtectedRoute>
          }
          path="/app/history"
        />
        <Route
          element={
            <ProtectedRoute allow={["user"]}>
              <UserProfilePage />
            </ProtectedRoute>
          }
          path="/app/profile"
        />

        <Route element={<Navigate replace to="/redirect" />} path="*" />
      </Routes>
    </ConfigProvider>
  );
}
