import React from "react";
import { Modal, Button } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";

interface SuccessNotificationDialogProps {
  visible: boolean;
  onClose: () => void;
  message?: string;
}

const SuccessNotificationDialog: React.FC<SuccessNotificationDialogProps> = ({
  visible,
  onClose,
  message,
}) => {
  return (
    <Modal
      title={
        <>
          <CheckCircleOutlined style={{ color: 'green', marginRight: 8 }} />
          Success
        </>
      }
      open={visible}
      onCancel={onClose}  // menutup modal saat klik di luar modal
      onOk={onClose}
      footer={[
        <Button key="ok" type="primary" onClick={onClose}>
          Close
        </Button>,
      ]}
    >
      <p>{message || "Operasi berhasil dilakukan!"}</p>
    </Modal>
  );
};

export default SuccessNotificationDialog;