import React, { useEffect } from "react";
import { Modal, Button } from "antd";

type NotificationDialogProps = {
  visible: boolean;
  onClose: () => void;
  title?: string;
  message: string;
};

export const NotificationDialog: React.FC<NotificationDialogProps> = ({
  visible,
  onClose,
  title = "Notification",
  message,
}) => {
  // Disable scroll background saat modal muncul
  useEffect(() => {
    if (visible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [visible]);

  return (
    <Modal
      title={title}
      open={visible}
      onCancel={onClose}
      centered
      maskClosable={false} // agar tidak bisa klik background untuk close
      footer={[
        <Button key="close" type="primary" onClick={onClose}>
          Close
        </Button>,
      ]}
      bodyStyle={{ overflow: "hidden" }}
    >
      <p>{message}</p>
    </Modal>
  );
};
