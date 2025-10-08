import React from "react";
import { Modal, Spin } from "antd";

interface ProgressDialogProps {
  visible: boolean;
  message?: string;
}

const ProgressDialog: React.FC<ProgressDialogProps> = ({ visible, message }) => {
  return (
    <Modal
      open={visible}
      footer={null}
      closable={false}
      centered
      width="fit-content" // Membuat lebar menyesuaikan konten
      style={{ padding: "16px", display: "flex", justifyContent: "center" }} // Perbaikan style
    >
      <div className="flex flex-col items-center justify-center">
        <Spin size="large" />
        <span className="mt-3 text-md">{message || "Processing..."}</span>
      </div>
    </Modal>
  );
};

export default ProgressDialog;