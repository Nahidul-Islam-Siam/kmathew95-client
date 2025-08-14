/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { Modal, Form, Input, Upload, Button, Typography } from "antd"
import { InboxOutlined } from "@ant-design/icons"
import type { UploadProps } from "antd"

const { Title, Text } = Typography
const { TextArea } = Input
const { Dragger } = Upload

interface TaskModalProps {
  open: boolean
  onCancel: () => void
  onSubmit: (values: any) => void
}

export default function TaskModal({ open, onCancel, onSubmit }: TaskModalProps) {
  const [form] = Form.useForm()

  const uploadProps: UploadProps = {
    name: "file",
    multiple: true,
    action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
    onChange(info) {
      const { status } = info.file
      if (status !== "uploading") {
        console.log(info.file, info.fileList)
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files)
    },
  }

  const handleSubmit = (values: any) => {
    console.log("Form values:", values)
    onSubmit(values)
  }

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      width={600}
      centered
      styles={{
        body: { padding: 0 },
      }}
    >
      <div>
        {/* Header Section */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "24px",
            borderBottom: "1px solid #f0f0f0",
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: 16,
            }}
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2L3 7L12 12L21 7L12 2Z"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M3 17L12 22L21 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M3 12L12 17L21 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <Text style={{ fontSize: 14, color: "#666" }}>bespoke Logo+OneDay+Unlimited Rev+Favicon+Source files</Text>
          </div>
          <div style={{ textAlign: "right" }}>
            <Text strong style={{ fontSize: 16 }}>
              2 Day / $50.00
            </Text>
          </div>
        </div>

        {/* Form Section */}
        <div style={{ padding: "24px" }}>
          <Form form={form} layout="vertical" onFinish={handleSubmit} requiredMark={false}>
            <Form.Item
              label={<Text strong>Task name*</Text>}
              name="taskName"
              rules={[{ required: true, message: "Please enter task name" }]}
            >
              <Input placeholder="Enter your task name" style={{ height: 48 }} />
            </Form.Item>

            <Form.Item
              label={<Text strong>Task ID*</Text>}
              name="taskId"
              rules={[{ required: true, message: "Please enter task ID" }]}
            >
              <Input placeholder="Enter your name" style={{ height: 48 }} />
            </Form.Item>

            <Form.Item label={<Text strong>Task details</Text>} name="taskDetails">
              <TextArea placeholder="Enter your name" rows={4} style={{ resize: "none" }} />
            </Form.Item>

            <Form.Item label={<Text strong>Attachments</Text>} name="attachments">
              <Dragger {...uploadProps} style={{ background: "#fafafa" }}>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined style={{ color: "#d9d9d9", fontSize: 24 }} />
                </p>
                <p style={{ color: "#999", margin: "8px 0 4px" }}>Add your files</p>
                <p style={{ color: "#ccc", fontSize: 12, margin: 0 }}>PDF</p>
              </Dragger>
            </Form.Item>

            <Form.Item style={{ marginBottom: 0, marginTop: 32 }}>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                style={{
                  width: 200,
                  height: 48,
                  borderRadius: 24,
                  background: "#ff7a45",
                  borderColor: "#ff7a45",
                  fontSize: 16,
                  fontWeight: 500,
                }}
              >
                Submit Task
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </Modal>
  )
}
