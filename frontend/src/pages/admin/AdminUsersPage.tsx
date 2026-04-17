import { Button, Card, Col, Form, Input, Row, Table, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useState } from "react";
import { DashboardLayout, adminMenuItems } from "../../components/layouts/DashboardLayout";
import { roleLabels } from "../../constants";
import { useGoPrint } from "../../hooks/useGoPrint";
import { AuthUser, CreateCopyShopFormState } from "../../types";

const initialCopyShopForm: CreateCopyShopFormState = {
  fullName: "",
  email: "",
  password: "",
  phone: "",
  campusLocation: "",
  shopName: "",
  locationNote: ""
};

export function AdminUsersPage() {
  const { users, isLoading, createCopyShopAccount } = useGoPrint();
  const [copyShopForm, setCopyShopForm] = useState(initialCopyShopForm);

  const columns: ColumnsType<AuthUser> = [
    { title: "Nama", dataIndex: "fullName", key: "fullName" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role: AuthUser["role"]) => roleLabels[role]
    },
    { title: "NIM", dataIndex: "nim", key: "nim", render: (value) => value || "-" },
    {
      title: "Program Studi",
      dataIndex: "studyProgram",
      key: "studyProgram",
      render: (value) => value || "-"
    },
    {
      title: "Lokasi",
      dataIndex: "campusLocation",
      key: "campusLocation",
      render: (value) => value || "-"
    }
  ];

  async function handleCreateCopyShop() {
    const isSuccess = await createCopyShopAccount(copyShopForm);

    if (isSuccess) {
      setCopyShopForm(initialCopyShopForm);
    }
  }

  return (
    <DashboardLayout items={adminMenuItems} title="Admin Dashboard">
      <Row gutter={[20, 20]}>
        <Col lg={9} xs={24}>
          <Card className="admin-form-card">
            <Typography.Title level={4}>Add Copy Shop</Typography.Title>
            <Typography.Paragraph>
              Create a copy shop login and link it directly to a shop profile.
            </Typography.Paragraph>
            <Form layout="vertical" onFinish={() => void handleCreateCopyShop()}>
              <Form.Item label="Account Name">
                <Input
                  value={copyShopForm.fullName}
                  onChange={(event) =>
                    setCopyShopForm((current) => ({ ...current, fullName: event.target.value }))
                  }
                />
              </Form.Item>
              <Form.Item label="Email">
                <Input
                  value={copyShopForm.email}
                  onChange={(event) =>
                    setCopyShopForm((current) => ({ ...current, email: event.target.value }))
                  }
                />
              </Form.Item>
              <Form.Item label="Password">
                <Input.Password
                  value={copyShopForm.password}
                  onChange={(event) =>
                    setCopyShopForm((current) => ({ ...current, password: event.target.value }))
                  }
                />
              </Form.Item>
              <Form.Item label="Phone">
                <Input
                  value={copyShopForm.phone}
                  onChange={(event) =>
                    setCopyShopForm((current) => ({ ...current, phone: event.target.value }))
                  }
                />
              </Form.Item>
              <Form.Item label="Campus Location">
                <Input
                  value={copyShopForm.campusLocation}
                  onChange={(event) =>
                    setCopyShopForm((current) => ({
                      ...current,
                      campusLocation: event.target.value
                    }))
                  }
                />
              </Form.Item>
              <Form.Item label="Shop Name">
                <Input
                  value={copyShopForm.shopName}
                  onChange={(event) =>
                    setCopyShopForm((current) => ({ ...current, shopName: event.target.value }))
                  }
                />
              </Form.Item>
              <Form.Item label="Shop Location Note">
                <Input.TextArea
                  rows={3}
                  value={copyShopForm.locationNote}
                  onChange={(event) =>
                    setCopyShopForm((current) => ({
                      ...current,
                      locationNote: event.target.value
                    }))
                  }
                />
              </Form.Item>
              <Button block htmlType="submit" loading={isLoading} type="primary">
                Create Copy Shop
              </Button>
            </Form>
          </Card>
        </Col>
        <Col lg={15} xs={24}>
          <div className="page-section">
            <Typography.Title level={4}>User Directory</Typography.Title>
            <Table columns={columns} dataSource={users} rowKey="id" scroll={{ x: 880 }} />
          </div>
        </Col>
      </Row>
    </DashboardLayout>
  );
}
