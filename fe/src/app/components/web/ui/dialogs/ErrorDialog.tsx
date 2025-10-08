import React from "react";
import { Modal } from "antd";

interface ErrorDialogProps {
  visible: boolean;
  message: string;
  onClose: () => void;
}

const ErrorDialog: React.FC<ErrorDialogProps> = ({ visible, message, onClose }) => {
  return (
    <Modal
      title="Something Went Wrong"
      open={visible}
      onCancel={onClose}
      onOk={onClose}
      okText="Close"
      cancelButtonProps={{ style: { display: "none" } }} // Hanya tombol "Tutup"
    >
      <p>{message}</p>
    </Modal>
  );
};

export default ErrorDialog;
