import React from "react";
import { Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

interface DeleteConfirmationDialogProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  visible,
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal
      title={
        <>
          <ExclamationCircleOutlined style={{ color: "red", marginRight: 8 }} />
          Confirm Delete
        </>
      }
      open={visible}
      onOk={onConfirm}
      onCancel={onCancel}
      okText="Delete"
      cancelText="Cancel"
      okButtonProps={{ danger: true }}
    >
      <p>Are you sure you want to delete this item? This action cannot be undone.</p>
    </Modal>
  );
};

export default DeleteConfirmationDialog;