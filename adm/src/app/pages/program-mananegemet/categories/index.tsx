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
  Descriptions,
  Form,
  Input,
  Col,
  Row,
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { useNotification } from "../../../context/NotificationContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const { Title } = Typography;

// =========================
// Types
// =========================
interface ProgramManagementCategoriesPageProps {
  isSidebarOpen: boolean;
  isMobile: boolean;
  toggleSidebar: () => void;
}

export interface ProgramCategories {
  mpc_id: number; // Primary key
  mpc_name: string; // Nama kategori
  mpc_status: boolean; // Status aktif / tidak
}

// =========================
// Table Card
// =========================
const DataTableCard: React.FC = () => {

  const navigate = useNavigate();

  const { showSuccess, showError } = useNotification();

  const [data, setData] = useState<ProgramCategories[]>([]);
  const [pageSize, setPageSize] = useState(5);
  const [searchText, setSearchText] = useState("");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<ProgramCategories | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);

  // Row selection
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);


   const API_URL = process.env.REACT_APP_API_URL;

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
        `${API_URL}/admin/v1/program-management/categories/`,
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
  if (deleteId === null) return;

  try {
    const token = localStorage.getItem("token"); // jika pakai auth
    if (!token) {
      message.warning("Please login first");
      return;
    }

    const response = await axios.delete(
      `${API_URL}/admin/v1/program-management/categories/delete/${deleteId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.success) {
      fetchData();
      showSuccess("Category deleted successfully");
      setDeleteId(null);
      setIsDeleteOpen(false);
    } else {
      showError(response.data.message || "Failed to delete category");
    }
  } catch (error: any) {
    console.error("Delete failed:", error);
    showError(error.response?.data?.message || "Error deleting category");
  }
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
  if (selectedRowKeys.length === 0) {
    showError("Please select at least one category");
    return;
  }

  try {
    const token = localStorage.getItem("token"); // jika pakai auth
    if (!token) {
      showError("Please login first");
      return;
    }

    const response = await axios.post(
      `${API_URL}/admin/v1/program-management/categories/delete-multiple`,
      { mpc_ids: selectedRowKeys },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.success) {
      fetchData();
      setSelectedRowKeys([]);
      setIsBulkDeleteOpen(false);
       showSuccess("Selected categories deleted successfully");
    } else {
      showError(response.data.message || "Failed to delete selected categories");
    }
  } catch (error: any) {
    console.error("Bulk delete failed:", error);
    showError(error.response?.data?.message || "Error deleting selected categories");
  }
};


  // Edit
  const handleEdit = (record: ProgramCategories) => {
    setEditingRow(record);
    setIsModalOpen(true);
  };

const handleSave = async () => {
  if (!editingRow) return;

  try {
    // Validasi sederhana
    if (!editingRow.mpc_name) {
      showError("Category name is required");
      return; // tetap buka modal
    }

    const token = localStorage.getItem("token"); // jika pakai auth
    if (!token) {
      message.warning("Please login first");
      return; // tetap buka modal
    }

    const response = await axios.put(
      `${API_URL}/admin/v1/program-management/categories/update/${editingRow.mpc_id}`,
      {
        mpc_name: editingRow.mpc_name.trim(),
        mpc_status: editingRow.mpc_status,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.success) {
      fetchData();
      showSuccess("Program Category updated successfully");

      // Hanya tutup modal kalau berhasil
      setIsModalOpen(false);
      setEditingRow(null);
    } else {
      showError(response.data.message || "Failed to update Program Category");
      // modal tetap terbuka
    }
  } catch (error: any) {
    console.error("Update failed:", error);
    showError(error.response?.data?.message || "Error updating Program Category");
    // modal tetap terbuka
  }
};


const handleCreate = async () => {
  try {
    const values = await form.validateFields();

    const token = localStorage.getItem("token"); // kalau pakai auth
    if (!token) {
      showError("Please login first");
      return;
    }

    const response = await axios.post(
      `${API_URL}/admin/v1/program-management/categories/create`,
      {
        mpc_name: values.mpc_name.trim(),
        mpc_status: values.mpc_status,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.success) {
      // Jika ingin langsung update state agar tabel langsung muncul data baru
      setData((prev) => [...prev, response.data.data]);
      setIsCreateModalOpen(false);
      form.resetFields();
      showSuccess("Program Category created successfully!");
    } else {
      showError(response.data.message || "Failed to create Program Category");
    }
  } catch (error: any) {
    console.error("Create failed:", error);
    showError(error.response?.data?.message || "Error creating Program Category");
  }
};

  // Table columns
  const columns: ColumnsType<ProgramCategories> = [
    {
      title: "ID",
      dataIndex: "mpc_id",
      key: "mpc_id",
      width: 60,
    },
    {
      title: "Name",
      dataIndex: "mpc_name",
      key: "mpc_name",
    },
    {
      title: "Status",
      dataIndex: "mpc_status",
      key: "mpc_status",
      render: (value: boolean) =>
        value ? (
          <span style={{ color: "green", fontWeight: 600 }}>Active</span>
        ) : (
          <span style={{ color: "red", fontWeight: 600 }}>Inactive</span>
        ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record.mpc_id)}>
            Delete
          </Button>
        </>
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

  // Filtered data
  const filteredData = data.filter((item) =>
    (item.mpc_name ?? "").toLowerCase().includes(searchText.toLowerCase())
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
                setSelectedRowKeys(filteredData.map((item) => item.mpc_id))
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
            <Button type="primary" onClick={() => setIsCreateModalOpen(true)}>
              + Create
            </Button>
          </div>
        </div>

        {/* Table */}
        <Table<ProgramCategories>
          rowSelection={rowSelection}
          columns={columns}
          dataSource={filteredData}
          rowKey="mpc_id"
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

        {/* Edit Modal */}
<Modal
  title="Edit Program Category"
  open={isModalOpen}
  onOk={handleSave}
  onCancel={() => setIsModalOpen(false)}
  okText="Save Changes"
  cancelText="Cancel"
  centered
>
  {editingRow && (
    <Form layout="vertical">
      <Form.Item label="ID">
        <Input value={editingRow.mpc_id} disabled />
      </Form.Item>

      <Form.Item
        label="Category Name"
        validateStatus={!editingRow.mpc_name ? "error" : undefined}
        help={!editingRow.mpc_name ? "Category name is required" : ""}
      >
        <Input
          value={editingRow.mpc_name}
          onChange={(e) =>
            setEditingRow({ ...editingRow, mpc_name: e.target.value })
          }
        />
      </Form.Item>

      <Form.Item label="Status">
        <Switch
          checked={editingRow.mpc_status}
          onChange={(checked) =>
            setEditingRow({ ...editingRow, mpc_status: checked })
          }
          checkedChildren="Active"
          unCheckedChildren="Inactive"
        />
      </Form.Item>
    </Form>
  )}
</Modal>


        {/* Create Modal */}
        <Modal
          title="Create Program Category"
          open={isCreateModalOpen}
          onOk={handleCreate}
          onCancel={() => setIsCreateModalOpen(false)}
          okText="Create"
          cancelText="Cancel"
          centered
          destroyOnClose
        >
          <Form form={form} layout="vertical">
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="mpc_name"
                  label="Category Name"
                  rules={[{ required: true, message: "Please input category name" }]}
                >
                  <Input placeholder="Enter category name" />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              name="mpc_status"
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
            Are you sure you want to delete <b>{selectedRowKeys.length}</b> selected categories? This action
            cannot be undone.
          </p>
        </Modal>
      </Card>
    </Column>
  );
};

// =========================
// Main Component
// =========================
const ProgramManagementCategoriesPage: React.FC<ProgramManagementCategoriesPageProps> = ({
  isSidebarOpen,
  isMobile,
}) => {
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

export default ProgramManagementCategoriesPage;