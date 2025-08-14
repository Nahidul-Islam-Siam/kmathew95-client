import { LoadingOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { Button, Modal, Result } from "antd";
import Paragraph from "antd/es/typography/Paragraph";
import Title from "antd/es/typography/Title";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

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

  const handleVerify = () => {
    setIsVerifying(true);

    setTimeout(() => {
      setIsVerifying(false);
      setVerificationComplete(true);

      setTimeout(() => {
        onClose();
        setVerificationComplete(false);
      }, 1500);
    }, 2000);
  };

  const handleSkip = () => {
    onClose();
    setVerificationComplete(false);
    setIsVerifying(false);
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
        >
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={{
              hidden: { opacity: 0, scale: 0.9 },
              visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
              exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
            }}
          >
            {!verificationComplete ? (
              <div style={{ textAlign: "center", padding: "24px 0" }}>
                <Title level={3}>Identity Verification</Title>
                <Paragraph>Please verify your identity to continue.</Paragraph>

                <AnimatedCheckIcon />

                {/* Show verifying icon above buttons only while verifying */}
                {isVerifying && (
                  <LoadingOutlined
                    style={{ fontSize: 36, color: "#1890ff", margin: "20px auto", display: "block" }}
                    spin
                  />
                )}

                <Button
                  type="primary"
                  size="large"
                  onClick={handleVerify}
                  disabled={isVerifying}
                  style={{ minWidth: 200, marginBottom: 12 }}
                >
                  Start Verification
                </Button>

                <Button type="link" onClick={handleSkip} disabled={isVerifying}>
                  Skip verification for now
                </Button>
              </div>
            ) : (
              <Result
                icon={<CheckCircleOutlined style={{ color: "#52c41a", fontSize: 60 }} />}
                status="success"
                title="Verification Successful!"
                subTitle="Redirecting you to your dashboard..."
              />
            )}
          </motion.div>
        </Modal>
      )}
    </AnimatePresence>
  );
};

export default VerificationModal;
