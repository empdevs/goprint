import { Button, Card, Col, Form, Input, List, Row, Space, Tabs, Typography } from "antd";
import { demoAccounts } from "../../constants";
import { useAuthForm } from "../../hooks/useAuthForm";

export function AuthPanel() {
  const {
    feedbacks,
    authMode,
    setAuthMode,
    loginEmail,
    setLoginEmail,
    loginPassword,
    setLoginPassword,
    registerForm,
    setRegisterForm,
    feedbackForm,
    setFeedbackForm,
    handleLogin,
    handleRegister,
    handleFeedbackSubmit
  } = useAuthForm();

  return (
    <section className="auth-page">
      <Row gutter={[16, 16]}>
        <Col lg={8} xs={24}>
          <Card className="auth-panel-card auth-hero-card">
            <Typography.Text className="eyebrow">GoPrint Feedback Loop</Typography.Text>
            <Typography.Title level={2}>Cetak dokumen kampus tanpa ribet turun ke basement.</Typography.Title>
            <Typography.Paragraph>
              GoPrint membantu mahasiswa dan dosen pesan print, fotokopi, sampai jilid secara
              online, lalu memantau progresnya sampai selesai.
            </Typography.Paragraph>
          </Card>
        </Col>

        <Col lg={7} xs={24}>
          <Card className="auth-panel-card">
            <Typography.Title level={4}>Akun Demo</Typography.Title>
            <List
              dataSource={demoAccounts}
              renderItem={(item) => <List.Item>{item}</List.Item>}
              size="small"
            />
          </Card>
        </Col>

        <Col lg={9} xs={24}>
          <Card className="auth-panel-card">
            <Tabs
              activeKey={authMode}
              items={[
                {
                  key: "login",
                  label: "Login",
                  children: (
                    <Form layout="vertical" onFinish={() => void handleLogin()}>
                      <Form.Item label="Email">
                        <Input value={loginEmail} onChange={(event) => setLoginEmail(event.target.value)} />
                      </Form.Item>
                      <Form.Item label="Password">
                        <Input.Password
                          value={loginPassword}
                          onChange={(event) => setLoginPassword(event.target.value)}
                        />
                      </Form.Item>
                      <Button block htmlType="submit" type="primary">
                        Masuk ke Dashboard
                      </Button>
                    </Form>
                  )
                },
                {
                  key: "register",
                  label: "Register",
                  children: (
                    <Form layout="vertical" onFinish={() => void handleRegister()}>
                      <Form.Item label="Nama Lengkap">
                        <Input
                          value={registerForm.fullName}
                          onChange={(event) =>
                            setRegisterForm((current) => ({ ...current, fullName: event.target.value }))
                          }
                        />
                      </Form.Item>
                      <Form.Item label="Email">
                        <Input
                          value={registerForm.email}
                          onChange={(event) =>
                            setRegisterForm((current) => ({ ...current, email: event.target.value }))
                          }
                        />
                      </Form.Item>
                      <Form.Item label="NIM">
                        <Input
                          value={registerForm.nim}
                          onChange={(event) =>
                            setRegisterForm((current) => ({ ...current, nim: event.target.value }))
                          }
                        />
                      </Form.Item>
                      <Form.Item label="Program Studi">
                        <Input
                          value={registerForm.studyProgram}
                          onChange={(event) =>
                            setRegisterForm((current) => ({
                              ...current,
                              studyProgram: event.target.value
                            }))
                          }
                        />
                      </Form.Item>
                      <Form.Item label="Password">
                        <Input.Password
                          value={registerForm.password}
                          onChange={(event) =>
                            setRegisterForm((current) => ({ ...current, password: event.target.value }))
                          }
                        />
                      </Form.Item>
                      <Button block htmlType="submit" type="primary">
                        Buat Akun
                      </Button>
                    </Form>
                  )
                }
              ]}
              onChange={(key) => setAuthMode(key as "login" | "register")}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 8 }}>
        <Col lg={10} xs={24}>
          <Card className="auth-panel-card">
            <Typography.Title level={4}>Feedback / Komentar</Typography.Title>
            <Form layout="vertical" onFinish={() => void handleFeedbackSubmit()}>
              <Form.Item label="Nama">
                <Input
                  value={feedbackForm.name}
                  onChange={(event) =>
                    setFeedbackForm((current) => ({ ...current, name: event.target.value }))
                  }
                />
              </Form.Item>
              <Form.Item label="NIM">
                <Input
                  value={feedbackForm.nim}
                  onChange={(event) =>
                    setFeedbackForm((current) => ({ ...current, nim: event.target.value }))
                  }
                />
              </Form.Item>
              <Form.Item label="Program Studi">
                <Input
                  value={feedbackForm.studyProgram}
                  onChange={(event) =>
                    setFeedbackForm((current) => ({
                      ...current,
                      studyProgram: event.target.value
                    }))
                  }
                />
              </Form.Item>
              <Form.Item label="Komentar">
                <Input.TextArea
                  rows={4}
                  value={feedbackForm.comment}
                  onChange={(event) =>
                    setFeedbackForm((current) => ({ ...current, comment: event.target.value }))
                  }
                />
              </Form.Item>
              <Button htmlType="submit" type="primary">
                Kirim Feedback
              </Button>
            </Form>
          </Card>
        </Col>

        <Col lg={14} xs={24}>
          <Card className="auth-panel-card">
            <Typography.Title level={4}>Komentar Pengguna</Typography.Title>
            <List
              dataSource={feedbacks}
              locale={{ emptyText: "Belum ada komentar publik." }}
              renderItem={(feedback) => (
                <List.Item>
                  <Space direction="vertical" size={2}>
                    <Typography.Text strong>{feedback.name}</Typography.Text>
                    <Typography.Text type="secondary">
                      {feedback.nim || "-"} | {feedback.studyProgram || "-"}
                    </Typography.Text>
                    <Typography.Paragraph style={{ marginBottom: 0 }}>
                      {feedback.comment}
                    </Typography.Paragraph>
                  </Space>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </section>
  );
}
