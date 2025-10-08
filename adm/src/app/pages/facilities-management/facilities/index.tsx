import React, { useState, useEffect } from "react";

// Layout components
import { Container, Column } from "../../../components/layout";

// Ant Design
import {
  Card,
  Typography,
  Table,
  Button,
  Modal,
  Switch,
  Form,
  Input,
  Col,
  Row,
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../../../context/NotificationContext";

const { Title } = Typography;

// =========================
// Types
// =========================
interface FacilitiesPageProps {
  isSidebarOpen: boolean;
  isMobile: boolean;
  toggleSidebar: () => void;
}

export interface Facility {
  mf_id: number;
  mf_name: string;
  mf_description: string | null;
  mf_icon: string | null;
  mf_status: boolean;
  created_at: string | null;
  updated_at: string | null;
}

// =========================
// Table Card
// =========================
const DataTableCard: React.FC = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();

  // =========================
  // State
  // =========================
  const [data, setData] = useState<Facility[]>([]);
  const [pageSize, setPageSize] = useState(5);
  const [searchText, setSearchText] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<Facility | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL;

  // =========================
  // FETCH DATA DARI API
  // =========================
  const fetchData = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      showError("Please login first");
      navigate("/login");
      return;
    }

    try {
      const response = await axios.get(
        `${API_URL}/admin/v1/facilities-management/facilities/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setData(response.data.data);
      } else {
        showError("Failed to fetch facilities");
      }
    } catch (error) {
      console.error(error);
      showError("Error fetching facilities from server");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // =========================
  // Handlers
  // =========================

  // Single delete
  const handleDelete = (id: number) => {
    setDeleteId(id);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      message.warning("Please login first");
      navigate("/login");
      return;
    }

    if (deleteId !== null) {
      try {
        const response = await axios.delete(
          `${API_URL}/admin/v1/facilities-management/facilities/delete/${deleteId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data.success) {
          fetchData();
          showSuccess("Facility deleted successfully!");
        } else {
          showError(response.data.message || "Failed to delete facility");
        }
      } catch (error: any) {
        console.error("Delete failed:", error);
        showError(error.response?.data?.message || "Error deleting facility");
      }
    }

    setIsDeleteOpen(false);
    setDeleteId(null);
  };

  // Bulk delete
  const handleDeleteSelected = () => {
    if (selectedRowKeys.length === 0) {
      message.warning("Please select at least one row!");
      return;
    }
    setIsBulkDeleteOpen(true);
  };

  const confirmBulkDelete = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      message.warning("Please login first");
      navigate("/login");
      return;
    }

    if (selectedRowKeys.length === 0) {
      message.error("Please select at least one facility");
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/admin/v1/facilities-management/facilities/delete-multiple`,
        { mf_ids: selectedRowKeys },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        fetchData();
        setSelectedRowKeys([]);
        setIsBulkDeleteOpen(false);
        showSuccess("Selected facilities deleted successfully!");
      } else {
        showError(response.data.message || "Failed to delete selected facilities");
      }
    } catch (error: any) {
      console.error("Bulk delete failed:", error);
      showError(error.response?.data?.message || "Error deleting selected facilities");
    }
  };

  // Edit
  const handleEdit = (record: Facility) => {
    setEditingRow(record);
    setIsModalOpen(true);

    editForm.setFieldsValue({
      mf_name: record.mf_name ?? "",
      mf_description: record.mf_description ?? "",
      mf_icon: record.mf_icon ?? "",
      mf_status: record.mf_status ?? false,
    });
  };

  // Open Create Modal
  const openCreateModal = () => {
    setEditingRow(null);
    createForm.resetFields();
    setIsCreateModalOpen(true);
  };

  const handleSave = async () => {
    if (!editingRow) return;

    try {
      const values = await editForm.validateFields();

      const payload = {
        mf_name: values.mf_name.trim(),
        mf_description: values.mf_description.trim(),
        mf_icon: values.mf_icon.trim(),
        mf_status: values.mf_status ?? true,
      };

      try {
        new URL(payload.mf_icon);
      } catch {
        showError("Icon must be a valid URL (example: https://...)");
        return;
      }

      setBtnLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        message.error("Please login first");
        navigate("/login");
        return;
      }

      const response = await axios.put(
        `${API_URL}/admin/v1/facilities-management/facilities/update/${editingRow.mf_id}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        showSuccess("Facility updated successfully");
        setIsModalOpen(false);
        editForm.resetFields();
        fetchData();
      } else {
        showError(response.data.message || "Failed to update Facility");
      }
    } catch (error: any) {
      console.error("Update failed:", error);
      showError(error.response?.data?.message || "Error updating Facility");
    } finally {
      setBtnLoading(false);
    }
  };

  // Create
  const handleCreate = async () => {
    try {
      const values = await createForm.validateFields();

      if (!values.mf_name?.trim()) {
        showError("Facility name is required!");
        return;
      }
      if (!values.mf_description?.trim()) {
        showError("Description is required!");
        return;
      }
      if (!values.mf_icon?.trim()) {
        showError("Icon is required!");
        return;
      }

      try {
        new URL(values.mf_icon);
      } catch (_) {
        showError("Icon must be a valid URL!");
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        message.error("Please login first");
        navigate("/login");
        return;
      }

      const response = await axios.post(
        `${API_URL}/admin/v1/facilities-management/facilities/create`,
        {
          mf_name: values.mf_name,
          mf_description: values.mf_description,
          mf_icon: values.mf_icon,
          mf_status: values.mf_status ?? true,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        showSuccess("Facility created successfully");
        createForm.resetFields();
        setIsCreateModalOpen(false);
        fetchData();
      } else {
        showError(response.data.message || "Failed to create Facility");
      }
    } catch (error: any) {
      console.error("Create failed:", error);
      if (error.response?.data?.message) {
        showError(error.response.data.message);
      } else {
        showError("Error creating Facility. Please try again");
      }
    }
  };

  // =========================
  // Table columns
  // =========================
  const columns: ColumnsType<Facility> = [
    { title: "ID", dataIndex: "mf_id", key: "mf_id", width: 60 },
    { title: "Name", dataIndex: "mf_name", key: "mf_name" },
    { title: "Description", dataIndex: "mf_description", key: "mf_description" },
    {
      title: "Icon",
      dataIndex: "mf_icon",
      key: "mf_icon",
      render: (icon) =>
        icon ? (
          <img
            src={icon}
            alt="icon"
            style={{ width: 24, height: 24, objectFit: "contain" }}
          />
        ) : (
          <span style={{ color: "#999" }}>No Icon</span>
        ),
    },
    {
      title: "Status",
      dataIndex: "mf_status",
      key: "mf_status",
      render: (status) => (
        <span style={{ color: status ? "green" : "red", fontWeight: 600 }}>
          {status ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div style={{ display: "flex", gap: 8 }}>
          <Button type="link" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record.mf_id)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  // =========================
  // Row selection
  // =========================
  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: React.Key[]) => setSelectedRowKeys(keys),
    hideSelectAll: true,
  };

  const filteredData = data.filter(
    (item) =>
      (item.mf_name?.toLowerCase().includes(searchText.toLowerCase()) ?? false) ||
      (item.mf_description?.toLowerCase().includes(searchText.toLowerCase()) ?? false)
  );

  // =========================
  // Render
  // =========================
  return (
    <Column size={12}>
      <Card
        style={{ borderRadius: 14, boxShadow: "0 4px 12px rgba(0,0,0,0.06)" }}
        className="custom-card"
      >
        {/* Header */}
        <div
          style={{
            marginBottom: 16,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Title level={5} style={{ margin: 0 }}>
            List Data
          </Title>
          <div style={{ display: "flex", gap: 8 }}>
            <Input.Search
              placeholder="Search facility"
              allowClear
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 200 }}
            />
            <Button
              onClick={() =>
                setSelectedRowKeys(filteredData.map((item) => item.mf_id))
              }
            >
              Select All
            </Button>
            <Button onClick={() => setSelectedRowKeys([])}>Deselect All</Button>
            <Button
              danger
              disabled={selectedRowKeys.length === 0}
              onClick={handleDeleteSelected}
            >
              Delete Selected
            </Button>
            <Button type="primary" onClick={openCreateModal}>
              + Create
            </Button>
          </div>
        </div>

        {/* Table */}
        <Table<Facility>
          rowSelection={rowSelection}
          columns={columns}
          dataSource={filteredData}
          rowKey="mf_id"
          bordered
          pagination={{
            pageSize,
            total: filteredData.length,
            showSizeChanger: true,
            pageSizeOptions: ["5", "10", "20"],
            onShowSizeChange: (_, size) => setPageSize(size),
            onChange: (_, size) => setPageSize(size),
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          }}
        />

        {/* Modals */}
        {/* Edit Modal */}
        <Modal
          title="Edit Facility"
          open={isModalOpen}
          onOk={handleSave}
          onCancel={() => setIsModalOpen(false)}
          okText="Save Changes"
          cancelText="Cancel"
          centered
          destroyOnClose
          okButtonProps={{ loading: btnLoading, disabled: btnLoading }}
        >
          {editingRow && (
            <Form
              form={editForm}
              layout="vertical"
              initialValues={{
                mf_name: editingRow.mf_name ?? "",
                mf_description: editingRow.mf_description ?? "",
                mf_icon: editingRow.mf_icon ?? "",
                mf_status: editingRow.mf_status ?? false,
              }}
              onValuesChange={(changedValues) => {
                setEditingRow((prev) => (prev ? { ...prev, ...changedValues } : prev));
              }}
            >
              <Form.Item
                label="Name"
                name="mf_name"
                rules={[{ required: true, message: "Facility name is required!" }]}
              >
                <Input placeholder="Enter facility name" />
              </Form.Item>

              <Form.Item
                label="Description"
                name="mf_description"
                rules={[{ required: true, message: "Description is required!" }]}
              >
                <Input placeholder="Enter description" />
              </Form.Item>

              <Form.Item
                label="Icon"
                name="mf_icon"
                rules={[
                  { required: true, message: "Icon is required!" },
                  {
                    validator: (_, value) => {
                      if (!value) return Promise.resolve();
                      try {
                        new URL(value);
                        return Promise.resolve();
                      } catch {
                        return Promise.reject(new Error("Icon must be a valid URL"));
                      }
                    },
                  },
                ]}
              >
                <Input placeholder="Enter icon URL" />
              </Form.Item>

              <Form.Item label="Status" name="mf_status" valuePropName="checked">
                <Switch />
              </Form.Item>
            </Form>
          )}
        </Modal>

        {/* Create Modal */}
        <Modal
          title="Create Facility"
          open={isCreateModalOpen}
          onOk={handleCreate}
          onCancel={() => setIsCreateModalOpen(false)}
          okText="Create"
          cancelText="Cancel"
          centered
          destroyOnClose
        >
          <Form form={createForm} layout="vertical">
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="mf_name"
                  label="Facility Name *"
                  rules={[{ required: true, message: "Facility name is required!" }]}
                >
                  <Input placeholder="Enter facility name" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="mf_description"
                  label="Description *"
                  rules={[{ required: true, message: "Description is required!" }]}
                >
                  <Input placeholder="Enter description" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="mf_icon"
                  label="Icon *"
                  rules={[
                    { required: true, message: "Icon is required!" },
                    {
                      validator: (_, value) => {
                        if (!value) return Promise.resolve();
                        try {
                          new URL(value);
                          return Promise.resolve();
                        } catch {
                          return Promise.reject("Icon must be a valid URL!");
                        }
                      },
                    },
                  ]}
                >
                  <Input placeholder="Enter icon filename or URL" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="mf_status"
              label="Status"
              valuePropName="checked"
              initialValue={true}
            >
              <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
            </Form.Item>
          </Form>
        </Modal>

        {/* Delete Modal (single) */}
        <Modal
          title="Confirm Delete"
          open={isDeleteOpen}
          onOk={confirmDelete}
          onCancel={() => setIsDeleteOpen(false)}
          okText="Yes, Delete"
          okType="danger"
          cancelText="Cancel"
          centered
        >
          <p>This action cannot be undone.</p>
        </Modal>

        {/* Delete Modal (bulk) */}
        <Modal
          title="Confirm Delete Selected"
          open={isBulkDeleteOpen}
          onOk={confirmBulkDelete}
          onCancel={() => setIsBulkDeleteOpen(false)}
          okText="Yes, Delete"
          okType="danger"
          cancelText="Cancel"
          centered
        >
          <p>
            Are you sure you want to delete <b>{selectedRowKeys.length}</b> selected facilities? This action cannot be undone.
          </p>
        </Modal>
      </Card>
    </Column>
  );
};

// =========================
// Main Component
// =========================
const FacilitiesPage: React.FC<FacilitiesPageProps> = ({ isSidebarOpen, isMobile }) => {
  return (
    <div
      style={{
        ...styles.container,
        marginLeft: isSidebarOpen && !isMobile ? "274px" : "0",
      }}
    >
      <Container>
        <Row className="mb-0">
          <Column size={12}>
            <DataTableCard />
          </Column>
        </Row>
      </Container>
    </div>
  );
};

// =========================
// Styles
// =========================
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    flex: 1,
    padding: "0px",
    marginTop: "60px",
    paddingBottom: "60px",
    transition: "margin-left 0.3s ease-in-out",
  },
};

export default FacilitiesPage;