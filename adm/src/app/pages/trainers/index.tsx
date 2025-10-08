import React, { useState, useEffect } from "react";

// Layout components
import { Container, Column } from "../../components/layout";

// Ant Design
import {
  Card,
  Typography,
  Table,
  Button,
  Modal,
  Switch,
  Descriptions,
  Form,
  Input,
  Col,
  Row,
  message,
  Upload,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../../context/NotificationContext";
import { DeleteOutlined, UploadOutlined, CloseOutlined } from "@ant-design/icons";

const { Title } = Typography;

// =========================
// Types
// =========================
interface TrainersPageProps {
  isSidebarOpen: boolean;
  isMobile: boolean;
  toggleSidebar: () => void;
}

export interface Trainer {
  trainer_id: number;
  trainer_name: string;
  trainer_email?: string | null;
  trainer_phone?: string | null;
  trainer_speciality?: string | null;
  trainer_status?: boolean;
  created_at?: string | null;
  updated_at?: string | null;
}

// =========================
// Table Card
// =========================
const DataTableCard: React.FC = () => {
  const initialData: Trainer[] = [];


  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();  


  const [data, setData] = useState<Trainer[]>(initialData);
  const [pageSize, setPageSize] = useState(5);
  const [searchText, setSearchText] = useState("");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<Trainer | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);

  // Row selection
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const API_URL = process.env.REACT_APP_API_URL;
  const API_IMAGE_URL = process.env.REACT_APP_API_IMAGE_URL;

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [previewTitle, setPreviewTitle] = useState<string>("");  

  const [btnLoading, setBtnLoading] = useState(false);  

  // =========================
  // FETCH DATA DARI API
  // =========================
  const fetchData = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      showError("Please login first")
      navigate("/login");
      return;
    }

    try {
      const response = await axios.get(
         `${API_URL}/admin/v1/trainers/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setData(response.data.data);
      } else {
        showError("Failed to fetch program ages")
      }
    } catch (error) {
      console.error(error);
      showError("Error fetching program ages from server") 
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
      showError("Please login first");
      navigate("/login");
      return;
    }

    if (deleteId !== null) {
      try {
        const response = await axios.delete(
          `${API_URL}/admin/v1/trainers/delete/${deleteId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data.success) {
          fetchData(); // pastikan ada fungsi untuk reload data table
          showSuccess("Trainers deleted successfully!");
        } else {
          showError(response.data.message || "Failed to delete court");
        }
      } catch (error: any) {
        console.error("Delete failed:", error);
        showError(error.response?.data?.message || "Error deleting court");
      }
    }

    setIsDeleteOpen(false);
    setDeleteId(null);
  };




  // Bulk delete
  const handleDeleteSelected = () => {
    if (selectedRowKeys.length === 0) {
      showError("Please select at least one row!");
      return;
    }
    setIsBulkDeleteOpen(true);
  };

  const confirmBulkDelete = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      showError("Please login first");
      navigate("/login");
      return;
    }

    if (selectedRowKeys.length === 0) {
      showError("Please select at least one court");
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/admin/v1/trainers/delete-multiple`,
        { trainer_ids: selectedRowKeys },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        fetchData(); // reload table
        setSelectedRowKeys([]);
        setIsBulkDeleteOpen(false);
        showSuccess("Selected Trainers deleted successfully!");
      } else {
        showError(response.data.message || "Failed to delete selected Trainers");
      }
    } catch (error: any) {
      console.error("Bulk delete failed:", error);
      showError(error.response?.data?.message || "Error deleting selected Trainers");
    }
  };



  // Edit Trainer
  const handleEdit = (record: Trainer) => {
    setEditingRow(record);
    setIsModalOpen(true);

    // Set form values sesuai field Trainer
    form.setFieldsValue({
      trainer_name: record.trainer_name,
      trainer_email: record.trainer_email || "",
      trainer_phone: record.trainer_phone || "",
      trainer_speciality: record.trainer_speciality || "",
      trainer_status: record.trainer_status === true,
    });
  };


  // 🚀 Function untuk open modal Create dan reset form
  const handleOpenCreateModal = () => {
    form.resetFields(); // kosongkan semua field form
    setIsCreateModalOpen(true); // buka modal create
  };

  const handleSave = async () => {
    if (!editingRow) return;

    try {
      const values = await form.validateFields();
      setBtnLoading(true);

      const payload = {
        trainer_name: values.trainer_name?.trim(),
        trainer_email: values.trainer_email?.trim() || null,
        trainer_phone: values.trainer_phone?.trim() || null,
        trainer_speciality: values.trainer_speciality?.trim() || null,
        trainer_status: (values.trainer_status ?? true).toString(), // kirim string "true"/"false"
      };

      const token = localStorage.getItem("token");
      if (!token) {
        showError("Please login first");
        return;
      }

      await axios.put(
        `${API_URL}/admin/v1/trainers/update/${editingRow.trainer_id}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchData();
      setIsModalOpen(false);
      showSuccess("Trainer updated successfully");
    } catch (error: any) {
      console.error("Update failed:", error);
      showError(error.response?.data?.message || "Error updating Trainer");
    } finally {
      setBtnLoading(false);
    }
  };

  const handleCreateCancel = () => {
    form.resetFields();  
    setIsCreateModalOpen(false)
  }

  // Create Trainer
  const handleCreate = async () => {
    try {
      setBtnLoading(true);

      const values = await form.validateFields();
      const token = localStorage.getItem("token");
      if (!token) {
        showError("Please login first");
        return;
      }

      // Siapkan body request
      const body = {
        trainer_name: values.trainer_name?.trim() || "",
        trainer_email: values.trainer_email?.trim() || "",
        trainer_phone: values.trainer_phone?.trim() || "",
        trainer_speciality: values.trainer_speciality?.trim() || "",
        trainer_status: (values.trainer_status ?? true).toString(),
      };

      const response = await axios.post(
        `${API_URL}/admin/v1/trainers/create`,
        body,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        showSuccess("Trainer created successfully!");
        fetchData();
        setIsCreateModalOpen(false);
        form.resetFields(); // Reset fields setelah sukses
      } else {
        showError(response.data.message || "Failed to create trainer");
      }
    } catch (err: any) {
      console.error(err);
      showError(err.response?.data?.message || "Error creating trainer");
    } finally {
      setBtnLoading(false);
    }
  };

  // Table columns
  const columns: ColumnsType<Trainer> = [
    {
      title: "ID",
      dataIndex: "trainer_id",
      key: "trainer_id",
      width: 60,
    },
    {
      title: "Name",
      dataIndex: "trainer_name",
      key: "trainer_name",
      render: (text: string | undefined) => text ?? "-", // fallback jika null/undefined
    },
    {
      title: "Email",
      dataIndex: "trainer_email",
      key: "trainer_email",
      render: (text: string | null | undefined) => text ?? "-", // fallback
    },
    {
      title: "Phone",
      dataIndex: "trainer_phone",
      key: "trainer_phone",
      render: (text: string | null | undefined) => text ?? "-", // fallback
    },
    {
      title: "Speciality",
      dataIndex: "trainer_speciality",
      key: "trainer_speciality",
      render: (text: string | null | undefined) => text ?? "-", // fallback
    },
    {
      title: "Status",
      dataIndex: "trainer_status",
      key: "trainer_status",
      render: (status: boolean | undefined) => (
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
          <Button type="link" danger onClick={() => handleDelete(record.trainer_id)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  // Row selection config
  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: React.Key[]) => {
      setSelectedRowKeys(keys);
    },
    hideSelectAll: true,
  };

  const filteredData = data.filter((item) =>
    (item.trainer_name ?? "").toLowerCase().includes(searchText.toLowerCase())
  );

  // =========================
  // Render
  // =========================
  return (
    <Column size={12}>
      <Card
        style={{
          borderRadius: 14,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)",
        }}
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
              placeholder="Search category"
              allowClear
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 200 }}
            />
            <Button
              onClick={() =>
                setSelectedRowKeys(filteredData.map((item) => item.trainer_id))
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
            <Button type="primary" onClick={handleOpenCreateModal}>
              + Create
            </Button>
          </div>
        </div>

        {/* Table */}
        <Table<Trainer>
          rowSelection={rowSelection}
          columns={columns}
          dataSource={filteredData}
          rowKey="trainer_id" // ⬅️ ganti mc_id menjadi trainer_id
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

  <Modal
    title={editingRow ? "Edit Trainer" : "Create Trainer"}
    open={isModalOpen}
    onCancel={() => setIsModalOpen(false)}
    centered
    width={600}
    destroyOnClose
    footer={[
      <Button key="cancel" onClick={() => setIsModalOpen(false)}>Cancel</Button>,
      <Button key="save" type="primary" loading={btnLoading} onClick={handleSave}>
        {editingRow ? "Update" : "Create"}
      </Button>,
    ]}
  >
    <Form form={form} layout="vertical">
      {/* Trainer Name */}
      <Form.Item
        label="Trainer Name"
        name="trainer_name"
        rules={[
          { required: true, message: "Please input trainer name" },
          { min: 3, message: "Name must be at least 3 characters" },
          { max: 50, message: "Name cannot exceed 50 characters" },
        ]}
      >
        <Input placeholder="Enter trainer name" />
      </Form.Item>

      {/* Trainer Email */}
      <Form.Item
        label="Trainer Email"
        name="trainer_email"
        rules={[
          { required: true, message: "Please input trainer email" },
          { type: "email", message: "Please enter a valid email" },
          { max: 100, message: "Email cannot exceed 100 characters" },
        ]}
      >
        <Input placeholder="Enter trainer email" />
      </Form.Item>

      {/* Trainer Phone */}
      <Form.Item
        label="Trainer Phone"
        name="trainer_phone"
        rules={[
          { required: true, message: "Please input trainer phone" },
          { pattern: /^08[0-9]{0,13}$/, message: "Phone must start with 08 and contain up to 15 digits" },
        ]}
      >
        <Input 
          placeholder="Enter trainer phone" 
          type="number" 
          inputMode="numeric" 
        />
      </Form.Item>


      {/* Trainer Speciality */}
      <Form.Item
        label="Speciality"
        name="trainer_speciality"
        rules={[
          { required: true, message: "Please input trainer speciality" },
          { max: 50, message: "Speciality cannot exceed 50 characters" },
        ]}
      >
        <Input placeholder="Enter trainer speciality" />
      </Form.Item>

      {/* Trainer Status */}
      <Form.Item
        name="trainer_status"
        label="Status"
        valuePropName="checked"
        initialValue={true}
      >
        <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
      </Form.Item>
    </Form>
  </Modal>


  <Modal
    title="Create Trainer"
    open={isCreateModalOpen}
    onCancel={handleCreateCancel}
    centered
    width={600}
    destroyOnClose
    footer={[
      <Button key="cancel" onClick={handleCreateCancel}>Cancel</Button>,
      <Button key="create" type="primary" loading={btnLoading} onClick={handleCreate}>Create</Button>,
    ]}
  >
    <Form form={form} layout="vertical">
      {/* Trainer Name */}
      <Form.Item
        label="Trainer Name"
        name="trainer_name"
        rules={[
          { required: true, message: "Please input trainer name" },
          { min: 3, message: "Name must be at least 3 characters" }
        ]}
      >
        <Input placeholder="Enter trainer name" />
      </Form.Item>

      {/* Email */}
      <Form.Item
        label="Email"
        name="trainer_email"
        rules={[
          { required: true, message: "Please input email" },
          { type: "email", message: "Please enter a valid email" }
        ]}
      >
        <Input placeholder="Enter email" />
      </Form.Item>

      {/* Phone */}
      <Form.Item
        label="Phone"
        name="trainer_phone"
        rules={[
          { required: true, message: "Please input phone number" },
          { pattern: /^08[0-9]{7,13}$/, message: "Phone must start with 08 and be 9-15 digits long" },
        ]}
      >
        <Input 
          placeholder="Enter phone number" 
          type="number" 
          inputMode="numeric" 
        />
      </Form.Item>


      {/* Speciality */}
      <Form.Item
        label="Speciality"
        name="trainer_speciality"
        rules={[{ required: true, message: "Please input speciality" }]}
      >
        <Input placeholder="Enter speciality (e.g., Yoga, Pilates)" />
      </Form.Item>

      {/* Status */}
      <Form.Item
        label="Status"
        name="trainer_status"
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
    <p>This action cannot be undone. The Trainers will be permanently deleted.</p>
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
      Are you sure you want to delete{" "}
      <b>{selectedRowKeys.length}</b> selected Trainers? This action
      cannot be undone.
    </p>
  </Modal>


          {/* Preview modal */}
          <Modal
            open={previewOpen}
            footer={null}
            onCancel={() => setPreviewOpen(false)}
            centered
            closable={false} // kita buat custom close
            width={600}
            bodyStyle={{ padding: 0 }}
            title={
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography.Text strong ellipsis style={{ maxWidth: "80%" }}>
                  {previewTitle}
                </Typography.Text>
                <CloseOutlined onClick={() => setPreviewOpen(false)} style={{ fontSize: 16, cursor: "pointer" }} />
              </div>
            }
             zIndex={1500}
          >
            <img alt="preview" style={{ width: '100%', display: 'block' }} src={previewImage} />
          </Modal>

      </Card>
    </Column>
  );
};

// =========================
// Main Component
// =========================
const TrainersPage: React.FC<
  TrainersPageProps
> = ({ isSidebarOpen, isMobile }) => {
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

export default TrainersPage;