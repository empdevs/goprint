import { Button, Card, Form, Input, Typography } from "antd";
import { useEffect } from "react";
import { UserLayout } from "../../components/layouts/UserLayout";
import { useGoPrint } from "../../hooks/useGoPrint";

export function UserProfilePage() {
  const { session, updateProfile, isLoading } = useGoPrint();
  const [form] = Form.useForm();

  useEffect(() => {
    if (!session) {
      return;
    }

    form.setFieldsValue({
      fullName: session.user.fullName,
      phone: session.user.phone,
      nim: session.user.nim,
      studyProgram: session.user.studyProgram,
      campusLocation: session.user.campusLocation
    });
  }, [form, session]);

  return (
    <UserLayout>
      <Card>
        <Typography.Title level={3}>Profil Pengguna</Typography.Title>
        <Typography.Paragraph>
          Kelola identitas akademik dan informasi kontak agar proses pengantaran atau pickup lebih lancar.
        </Typography.Paragraph>
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => void updateProfile(values)}
        >
          <Form.Item label="Nama Lengkap" name="fullName" rules={[{ required: true, message: "Nama wajib diisi" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Email">
            <Input disabled value={session?.user.email} />
          </Form.Item>
          <Form.Item label="Nomor HP" name="phone" rules={[{ required: true, message: "Nomor HP wajib diisi" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="NIM" name="nim">
            <Input />
          </Form.Item>
          <Form.Item label="Program Studi" name="studyProgram">
            <Input />
          </Form.Item>
          <Form.Item label="Lokasi Kampus" name="campusLocation" rules={[{ required: true, message: "Lokasi wajib diisi" }]}>
            <Input />
          </Form.Item>
          <Button htmlType="submit" loading={isLoading} type="primary">
            Simpan Profil
          </Button>
        </Form>
      </Card>
    </UserLayout>
  );
}
