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
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../../../context/NotificationContext";

const { Title } = Typography;

// =========================
// Types
// =========================
interface ProgramManagementActivityCategoriesPageProps {
  isSidebarOpen: boolean;
  isMobile: boolean;
  toggleSidebar: () => void;
}

export interface ActivityCategories {
  mpac_id: number;
  mpac_name: string;
  mpac_status: boolean;
}

// =========================
// Table Card
// =========================
const DataTableCard: React.FC = () => {

  const navigate = useNavigate();

  const { showSuccess, showError } = useNotification();  

  const [data, setData] = useState<ActivityCategories[]>([]);
  const [pageSize, setPageSize] = useState(5);
  const [searchText, setSearchText] = useState("");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<ActivityCategories | null>(null);
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
         `${API_URL}/admin/v1/program-management/activity-categories/`,
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
      message.warning("Please login first");
      navigate("/login");
      return;
    }

    if (deleteId !== null) {
      try {
        const response = await axios.delete(
          `${API_URL}/admin/v1/program-management/activity-categories/delete/${deleteId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data.success) {
          fetchData()
          showSuccess("Activity Category deleted successfully");
        } else {
          showError(response.data.message || "Failed to delete category");
        }
      } catch (error: any) {
          console.error("Delete failed:", error);
          showError(error.response?.data?.message || "Error deleting category");
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
      showError("Please select at least one categories");
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/admin/v1/program-management/activity-categories/delete-multiple`,
        { mpac_ids: selectedRowKeys }, // kirim array ID kategori
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        // hapus dari state lokal sesuai ID yang berhasil dihapus
        fetchData()
        setSelectedRowKeys([]);
        setIsBulkDeleteOpen(false);
        showSuccess("Selected activity categories deleted successfully");
      } else {
        showError(response.data.message || "Failed to delete selected categories");
      }
    } catch (error: any) {
        console.error("Bulk delete failed:", error);
        showError(error.response?.data?.message || "Error deleting selected categories");
      }
  };


  // Edit
  const handleEdit = (record: ActivityCategories) => {
    setEditingRow(record);
    setIsModalOpen(true);
  };

const handleSave = async () => {
  if (!editingRow) return;

  // Validasi required fields
  if (!editingRow.mpac_name || editingRow.mpac_name.trim() === "") {
    showError("Activity Category name is required");
    return;
  }

  try {
    const token = localStorage.getItem("token");
    if (!token) {
      showError("Please login first");
      navigate("/login");
      return;
    }

    const response = await axios.put(
      `${API_URL}/admin/v1/program-management/activity-categories/update/${editingRow.mpac_id}`,
      {
        mpac_name: editingRow.mpac_name.trim(),
        mpac_status: editingRow.mpac_status,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (response.data.success) {
      // update state lokal sesuai data terbaru dari backend
      // setData((prev) =>
      //   prev.map((row) =>
      //     row.mpac_id === editingRow.mpac_id ? response.data.data : row
      //   )
      // );
      fetchData();
      showSuccess("Activity Category updated successfully");
      setIsModalOpen(false);
    } else {
      showError(response.data.message || "Failed to update activity category");
    }
  } catch (error: any) {
    console.error(error);
    showError(error.response?.data?.message || "Error updating activity category");
  }
};



  // Create
const handleCreate = async () => {
  try {
    const values = await form.validateFields();

    // Validasi required
    if (!values.mpac_name || values.mpac_name.trim() === "") {
      showError("Activity Category name is required");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      showError("Please login first");
      navigate("/login");
      return;
    }

    console.log("sss", values)
    const response = await axios.post(
      `${API_URL}/admin/v1/program-management/activity-categories/create`,
      {
        mpac_name: values.mpac_name.trim(),
        mpac_status: values.mpac_status,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (response.data.success) {
      showSuccess("Category created successfully");
      setIsCreateModalOpen(false);
      form.resetFields();
      fetchData(); // refresh table
    } else {
      showError(response.data.message || "Failed to create category");
    }
  } catch (error: any) {
    console.error("Create failed:", error);
    showError(error.response?.data?.message || "Error creating activity category");
  }
};


  // Table columns
  const columns: ColumnsType<ActivityCategories> = [
  {
    title: "ID",
    dataIndex: "mpac_id",
    key: "mpac_id",
    width: 60,
  },
  {
    title: "Name",
    dataIndex: "mpac_name",
    key: "mpac_name",
  },
  {
    title: "Status",
    dataIndex: "mpac_status",
    key: "mpac_status",
    render: (status: boolean) => (
      <span style={{ color: status ? "green" : "red", fontWeight: 500 }}>
        {status ? "Active" : "Inactive"}
      </span>
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
        <Button
          type="link"
          danger
          onClick={() => handleDelete(record.mpac_id)}
        >
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

  const filteredData = data.filter((item) =>
    (item.mpac_name || "").toLowerCase().includes(searchText.toLowerCase())
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
                setSelectedRowKeys(filteredData.map((item) => item.mpac_id))
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

        <Table<ActivityCategories>
          rowSelection={rowSelection} // untuk checkbox bulk select
          columns={columns}           // kolom ID, Name, Action
          dataSource={filteredData}   // hasil filter search
          rowKey="mpac_id"            // primary key
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
  title="Edit Activity Category"
  open={isModalOpen}
  onOk={handleSave}
  onCancel={() => setIsModalOpen(false)}
  okText="Save Changes"
  cancelText="Cancel"
  centered
>
  {editingRow && (
    <Form layout="vertical">
      {/* ID */}
      <Form.Item label="ID">
        <Input value={editingRow.mpac_id} disabled />
      </Form.Item>

      {/* Name */}
      <Form.Item
        label="Category Name"
        validateStatus={
          !editingRow.mpac_name || editingRow.mpac_name.trim() === ""
            ? "error"
            : undefined
        }
        help={
          !editingRow.mpac_name || editingRow.mpac_name.trim() === ""
            ? "Please input category name"
            : ""
        }
      >
        <Input
          value={editingRow.mpac_name}
          onChange={(e) =>
            setEditingRow({ ...editingRow, mpac_name: e.target.value })
          }
        />
      </Form.Item>

      {/* Status */}
      <Form.Item label="Status">
        <Switch
          checked={editingRow.mpac_status}
          onChange={(checked) =>
            setEditingRow({ ...editingRow, mpac_status: checked })
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
                  name="mpac_name"
                  label="Activity Category Name"
                  rules={[
                    { required: true, message: "Please input activity category name" },
                  ]}
                >
                  <Input placeholder="Enter activity category name" />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              name="mpac_status"
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
            Are you sure you want to delete{" "}
            <b>{selectedRowKeys.length}</b> selected activity categories? This action
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
const ProgramManagementActivityCategoriesPage: React.FC<
  ProgramManagementActivityCategoriesPageProps
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

export default ProgramManagementActivityCategoriesPage;