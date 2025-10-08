import React from "react";
import { Modal } from "antd";

interface ErrorDialogProps {
  visible: boolean;
  message: string;
  onClose: () => void;
  zIndex?: number; // tambahkan ini
}

const ErrorDialog: React.FC<ErrorDialogProps> = ({ visible, message, onClose, zIndex }) => {
  return (
    <Modal
      title="An unexpected error occurred"
      open={visible}
      onCancel={onClose}
      onOk={onClose}
      okText="Close"
      cancelButtonProps={{ style: { display: "none" } }}
      zIndex={zIndex} // gunakan prop zIndex
    >
      <p>{message}</p>
    </Modal>
  );
};

export default ErrorDialog;
