/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCreateStripeVerificationMutation } from "@/redux/service/verification/stripe-verification";
import { LoadingOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { Button, Modal, Result, Typography } from "antd";
import { AnimatePresence, motion } from "framer-motion";
import { redirect } from "next/navigation";
import { useState } from "react";

const { Paragraph, Title } = Typography;

interface VerificationModalProps {
  open: boolean;
  onClose: () => void;
}

const AnimatedCheckIcon = () => (
  <motion.div
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 0.5, ease: "easeOut" }}
    style={{ fontSize: 140, color: "#52c41a", margin: "auto" }}
  >
    <CheckCircleOutlined />
  </motion.div>
);

const VerificationModal: React.FC<VerificationModalProps> = ({ open, onClose }) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationComplete, setVerificationComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [stripeVerificationMutation] = useCreateStripeVerificationMutation();

  const handleVerify = async () => {
    setIsVerifying(true);
    setError(null); // Reset previous errors

    try {
      const result = await stripeVerificationMutation({}).unwrap();

      if (result.success && result.data?.onboardingUrl) {
        // Open Stripe Connect onboarding in a new tab
        window.open(result.data.onboardingUrl.trim(), "_blank", "noopener,noreferrer");

        // Show success animation
        setVerificationComplete(true);

        // Close modal after animation
        setTimeout(() => {
          onClose();
          setVerificationComplete(false);
        }, 1500);
      } else {
        throw new Error(result.message || "Failed to retrieve onboarding link");
      }
    } catch (err: any) {
      const errorMessage =
        err.data?.message || err.message || "Something went wrong. Please try again.";

      setError(errorMessage);

      Modal.error({
        title: "Verification Failed",
        content: errorMessage,
        okText: "OK",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSkip = () => {
    onClose();
    setVerificationComplete(false);
    setIsVerifying(false);
    setError(null);
    redirect("/"); // Redirect to the home page or any other page
  };

  return (
    <AnimatePresence>
      {open && (
        <Modal
          open={open}
          footer={null}
          closable={false}
          maskClosable={false}
          width={480}
          styles={{ body: { padding: 0 } }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            style={{ textAlign: "center", padding: "24px 0" }}
          >
            {!verificationComplete ? (
              <>
                <Title level={3}>Identity Verification</Title>
                <Paragraph type="secondary" style={{ marginBottom: 24 }}>
                  Please verify your identity to start trading and receiving payments.
                </Paragraph>

                <AnimatedCheckIcon />

                {/* Loading Spinner */}
                {isVerifying && (
                  <LoadingOutlined
                    style={{
                      fontSize: 36,
                      color: "#1890ff",
                      margin: "20px auto",
                      display: "block",
                    }}
                    spin
                  />
                )}

                {/* Error Message */}
                {error && (
                  <Paragraph type="danger" style={{ marginTop: 10 }}>
                    {error}
                  </Paragraph>
                )}

                {/* Action Buttons */}
                <Button
                  type="primary"
                  size="large"
                  onClick={handleVerify}
                  disabled={isVerifying}
                  style={{ minWidth: 200, marginBottom: 12 }}
                >
                  {isVerifying ? "Processing..." : "Start Verification"}
                </Button>

                <br />

                <Button type="link" onClick={handleSkip} disabled={isVerifying} style={{ padding: 0 }}>
                  Skip for now
                </Button>
              </>
            ) : (
              <Result
                icon={
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <CheckCircleOutlined style={{ color: "#52c41a", fontSize: 60 }} />
                  </motion.div>
                }
                status="success"
                title="Redirecting to Stripe..."
                subTitle="Please complete your verification in the new tab."
              />
            )}
          </motion.div>
        </Modal>
      )}
    </AnimatePresence>
  );
};

export default VerificationModal;