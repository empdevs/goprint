import {
  CopyOutlined,
  FileTextOutlined,
  InboxOutlined,
  MinusOutlined,
  PaperClipOutlined,
  PlusOutlined,
  PrinterOutlined
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Divider,
  Input,
  Radio,
  Row,
  Space,
  Typography,
  Upload
} from "antd";
import { useOrderForm } from "../../hooks/useOrderForm";
import { useGoPrint } from "../../hooks/useGoPrint";

const quantityFields = [
  { key: "printQty", label: "Print", icon: <PrinterOutlined /> },
  { key: "copyQty", label: "Fotokopi", icon: <CopyOutlined /> },
  { key: "bindingQty", label: "Jilid", icon: <PaperClipOutlined /> }
] as const;

export function OrderCreateCard() {
  const { session, isLoading } = useGoPrint();
  const { orderForm, setOrderForm, selectedFile, setDocumentFile, updateQuantity, handleSubmit } =
    useOrderForm();

  if (!session || !["user", "admin"].includes(session.user.role)) {
    return null;
  }

  return (
    <Card className="order-cart-card" styles={{ body: { padding: 24 } }}>
      <Space className="order-cart-header" direction="vertical" size={4}>
        <Typography.Title level={3} style={{ margin: 0 }}>
          Keranjang Pesanan
        </Typography.Title>
        <Typography.Paragraph style={{ marginBottom: 0 }}>
          Upload dokumen, atur jumlah layanan per file, lalu pilih pembayaran dan pengantaran.
        </Typography.Paragraph>
      </Space>

      <Upload.Dragger
        accept=".pdf,.doc,.docx,.ppt,.pptx"
        beforeUpload={(file) => {
          setDocumentFile(file);
          return false;
        }}
        className="order-upload"
        fileList={
          selectedFile
            ? [
                {
                  uid: selectedFile.name,
                  name: selectedFile.name,
                  status: "done"
                }
              ]
            : []
        }
        maxCount={1}
        onRemove={() => {
          setDocumentFile(null);
        }}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <Typography.Title level={5}>Tarik file ke sini atau klik untuk upload</Typography.Title>
        <Typography.Text type="secondary">
          Mendukung PDF, DOC, DOCX, PPT, dan PPTX.
        </Typography.Text>
      </Upload.Dragger>

      <div className="order-cart-item">
        <div className="order-cart-file">
          <div className="order-cart-file-icon">
            <FileTextOutlined />
          </div>
          <div>
            <Typography.Text strong>File dokumen</Typography.Text>
            <Typography.Paragraph className="order-cart-file-name">
              {orderForm.fileName || "Nama file akan terisi otomatis setelah upload"}
            </Typography.Paragraph>
          </div>
        </div>

        <Row gutter={[12, 12]}>
          {quantityFields.map((field) => (
            <Col key={field.key} lg={8} xs={24}>
              <div className="quantity-card">
                <Space align="center" className="quantity-card-title">
                  {field.icon}
                  <Typography.Text strong>{field.label}</Typography.Text>
                </Space>
                <div className="quantity-stepper">
                  <Button
                    icon={<MinusOutlined />}
                    onClick={() => updateQuantity(field.key, orderForm[field.key] - 1)}
                  />
                  <Typography.Text className="quantity-value">{orderForm[field.key]}</Typography.Text>
                  <Button
                    icon={<PlusOutlined />}
                    onClick={() => updateQuantity(field.key, orderForm[field.key] + 1)}
                  />
                </div>
              </div>
            </Col>
          ))}
        </Row>

        <div style={{ marginTop: 16 }}>
          <Typography.Text strong>Deskripsi tambahan</Typography.Text>
          <Input.TextArea
            placeholder="Contoh: jilid hitam, cover bening, gunakan kertas A4"
            rows={3}
            style={{ marginTop: 8 }}
            value={orderForm.description}
            onChange={(event) =>
              setOrderForm((current) => ({
                ...current,
                description: event.target.value
              }))
            }
          />
        </div>
      </div>

      <Divider />

      <Row gutter={[16, 16]}>
        <Col lg={12} xs={24}>
          <Typography.Text strong>Pembayaran</Typography.Text>
          <Radio.Group
            className="option-group"
            optionType="button"
            options={[
              { label: "Cash", value: "cash" },
              { label: "Transfer Bank", value: "bank_transfer" }
            ]}
            style={{ marginTop: 8 }}
            value={orderForm.paymentMethod}
            onChange={(event) =>
              setOrderForm((current) => ({
                ...current,
                paymentMethod: event.target.value
              }))
            }
          />
        </Col>
        <Col lg={12} xs={24}>
          <Typography.Text strong>Metode pengambilan</Typography.Text>
          <Radio.Group
            className="option-group"
            optionType="button"
            options={[
              { label: "Ambil sendiri", value: "pickup" },
              { label: "Diantar", value: "delivery" }
            ]}
            style={{ marginTop: 8 }}
            value={orderForm.pickupMethod}
            onChange={(event) =>
              setOrderForm((current) => ({
                ...current,
                pickupMethod: event.target.value
              }))
            }
          />
        </Col>
      </Row>

      {orderForm.pickupMethod === "delivery" && (
        <div style={{ marginTop: 16 }}>
          <Typography.Text strong>Alamat pengantaran</Typography.Text>
          <Input.TextArea
            placeholder="Tulis lokasi pengantaran yang jelas"
            rows={3}
            style={{ marginTop: 8 }}
            value={orderForm.deliveryAddress}
            onChange={(event) =>
              setOrderForm((current) => ({
                ...current,
                deliveryAddress: event.target.value
              }))
            }
          />
        </div>
      )}

      <Space style={{ marginTop: 20 }} wrap>
        <Button
          disabled={!selectedFile}
          loading={isLoading}
          size="large"
          type="primary"
          onClick={() => void handleSubmit()}
        >
          Kirim Pesanan
        </Button>
        <Typography.Text type="secondary">
          Langkah berikutnya akan kita perluas ke multi-file dalam satu order.
        </Typography.Text>
      </Space>
    </Card>
  );
}
