import React from "react";
import { Modal, Button } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";

interface SuccessNotificationDialogProps {
  visible: boolean;
  onClose: () => void;
  message?: string;
  zIndex?: number; // tambahkan ini
}

const SuccessNotificationDialog: React.FC<SuccessNotificationDialogProps> = ({
  visible,
  onClose,
  message,
  zIndex,
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
      onCancel={onClose}
      onOk={onClose}
      footer={[
        <Button key="ok" type="primary" onClick={onClose}>
          Close
        </Button>,
      ]}
      zIndex={zIndex} // gunakan prop zIndex
    >
      <p>{message || "Operasi berhasil dilakukan!"}</p>
    </Modal>
  );
};

export default SuccessNotificationDialog;
