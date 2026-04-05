import { Segmented, Typography } from "antd";
import { useMemo, useState } from "react";
import { DashboardLayout, copyShopMenuItems } from "../../components/layouts/DashboardLayout";
import { OrdersTable } from "../../components/OrdersTable";
import { useGoPrint } from "../../hooks/useGoPrint";

export function CopyShopOrdersPage() {
  const { orders } = useGoPrint();
  const [filter, setFilter] = useState<"active" | "completed" | "all">("active");

  const filteredOrders = useMemo(() => {
    if (filter === "completed") {
      return orders.filter((order) => order.status === "completed");
    }

    if (filter === "active") {
      return orders.filter((order) => order.status !== "completed" && order.status !== "cancelled");
    }

    return orders;
  }, [filter, orders]);

  return (
    <DashboardLayout items={copyShopMenuItems} title="Dashboard Tukang Fotokopi">
      <div className="page-section">
        <Typography.Title level={4}>Proses Pesanan Masuk</Typography.Title>
        <Segmented
          onChange={(value) => setFilter(value as typeof filter)}
          options={[
            { label: "Aktif", value: "active" },
            { label: "Selesai", value: "completed" },
            { label: "Semua", value: "all" }
          ]}
          value={filter}
        />
        <div style={{ marginTop: 16 }}>
          <OrdersTable orders={filteredOrders} />
        </div>
      </div>
    </DashboardLayout>
  );
}
