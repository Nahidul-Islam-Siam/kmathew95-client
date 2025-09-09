/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Button, Form, Input, Typography, Card, Row, Col, Space } from "antd";
import { EnvironmentOutlined, PhoneOutlined, MailOutlined } from "@ant-design/icons";
import { useAddContactApiMutation } from "@/redux/service/contactApi";
import { toast } from "sonner";

const { Title, Text } = Typography;
const { TextArea } = Input;

// Define form values type
interface ContactFormValues {
  fullName: string;
  email: string;
  subject: string;
  message: string;
}

export default function ContactUs() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const [addContact] = useAddContactApiMutation();

  const onFinish = async (values: ContactFormValues) => {
    setLoading(true);
    try {
      const res = await addContact(values).unwrap();

      if (res.success) {
        toast.success(res.message || "Message sent successfully!");
        form.resetFields(); // Reset only on success
      } else {
        toast.error(res.message || "Failed to send message. Please try again.");
      }
    } catch (error: any) {
      const errorMsg = error?.data?.message || "Failed to send message. Please try again.";
      toast.error(errorMsg);
      console.error("Contact form submission error:", error);
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: <EnvironmentOutlined className="text-2xl" />,
      title: "Location",
      content: (
        <>
          <Text>Location 345c, Los Jogan</Text>
          <br />
          <Text>USA</Text>
        </>
      ),
    },
    {
      icon: <PhoneOutlined className="text-2xl" />,
      title: "Call us",
      content: (
        <>
          <Text>0123 456 789</Text>
          <br />
          <Text type="secondary" className="text-xs">
            Share some cool solutions for a mix of online and local businesses.
          </Text>
        </>
      ),
    },
    {
      icon: <MailOutlined className="text-2xl" />,
      title: "Email",
      content: (
        <>
          <Text>info@yourmail.com</Text>
          <br />
          <Text type="secondary" className="text-xs">
            Let&apos;s collaborate to connect smoothly and empower one another!
          </Text>
        </>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-16 font-dm">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Title level={1} className="!mb-8 !text-4xl">
            Contact Us
          </Title>

          {/* Contact Info Cards */}
          <Row gutter={[32, 32]} justify="center">
            {contactInfo.map((item, index) => (
              <Col xs={24} sm={12} md={8} key={index}>
                <Card className="text-center shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-orange-500">{item.icon}</span>
                    </div>
                  </div>
                  <Title level={4} className="!mb-2">
                    {item.title}
                  </Title>
                  <div className="text-gray-600">{item.content}</div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          <Row gutter={[48, 48]} align="middle">
            {/* Left Side - Questions Section */}
            <Col xs={24} lg={10}>
              <Title level={2} className="!mb-2">
                Have Questions?
              </Title>
              <Title level={2} className="!mb-8 !font-bold">
                Reach Out to Us
              </Title>

              <Card className="shadow-sm">
                <Space size="middle">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <MailOutlined className="text-orange-500 text-xl" />
                  </div>
                  <div>
                    <Title level={5} className="!mb-0">
                      Send E-Mail
                    </Title>
                    <Text className="text-gray-600">info@yourmail.com</Text>
                  </div>
                </Space>
              </Card>
            </Col>

            {/* Right Side - Contact Form */}
            <Col xs={24} lg={14}>
              <Card className="shadow-md bg-[#FCF2EA] p-6">
                <Title level={3} className="!mb-6">
                  Get in touch
                </Title>

                <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={false}>
                  <Form.Item
                    label="Full Name"
                    name="fullName"
                    rules={[{ required: true, message: "Please enter your full name" }]}
                  >
                    <Input placeholder="Enter your name" size="large" />
                  </Form.Item>

                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                      { required: true, message: "Please enter your email" },
                      { type: "email", message: "Please enter a valid email" },
                    ]}
                  >
                    <Input placeholder="Enter your email" size="large" />
                  </Form.Item>

                  <Form.Item
                    label="Subject"
                    name="subject"
                    rules={[{ required: true, message: "Please enter a subject" }]}
                  >
                    <Input placeholder="Subject" size="large" />
                  </Form.Item>

                  <Form.Item
                    label="Message"
                    name="message"
                    rules={[{ required: true, message: "Please enter your message" }]}
                  >
                    <TextArea
                      placeholder="Write your message here..."
                      rows={5}
                      className="resize-none"
                    />
                  </Form.Item>

                  <Form.Item className="!mb-0">
                    <Button
                      type="primary"
                      htmlType="submit"
                      size="large"
                      loading={loading}
                      block
                      className="!bg-orange-500 hover:!bg-orange-600 !border-orange-500 hover:!border-orange-600"
                    >
                      Send Now
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
}