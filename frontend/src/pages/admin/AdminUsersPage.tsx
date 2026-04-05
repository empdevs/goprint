import { Table, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { DashboardLayout, adminMenuItems } from "../../components/layouts/DashboardLayout";
import { useGoPrint } from "../../hooks/useGoPrint";
import { AuthUser } from "../../types";

export function AdminUsersPage() {
  const { users } = useGoPrint();

  const columns: ColumnsType<AuthUser> = [
    { title: "Nama", dataIndex: "fullName", key: "fullName" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Role", dataIndex: "role", key: "role" },
    { title: "NIM", dataIndex: "nim", key: "nim" },
    { title: "Program Studi", dataIndex: "studyProgram", key: "studyProgram" },
    { title: "Lokasi", dataIndex: "campusLocation", key: "campusLocation" }
  ];

  return (
    <DashboardLayout items={adminMenuItems} title="Admin Dashboard">
      <div className="page-section">
        <Typography.Title level={4}>Data Pengguna</Typography.Title>
        <Table columns={columns} dataSource={users} rowKey="id" />
      </div>
    </DashboardLayout>
  );
}
