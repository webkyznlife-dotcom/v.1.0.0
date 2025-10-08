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
  Select,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../../../context/NotificationContext";

const { Title } = Typography;

// =========================
// Types
// =========================
interface ProgramManagementKeyPointsPageProps {
  isSidebarOpen: boolean;
  isMobile: boolean;
  toggleSidebar: () => void;
}

export interface ProgramKeyPoint {
  mpkp_id: number;
  mp_id: number;
  key_point: string;
  sort_order: number;
  created_at: string;   // ISO date string
  updated_at: string;   // ISO date string
  status: boolean;
  MstProgram: {
    mp_id: number;
    mp_name: string;
  };
} 

export interface MstProgram {
  mp_id: number;
  mp_name: string;
  mp_description: string;
  mp_category_id: number;
  mp_age_id: number;
  mp_activity_category_id: number;
  mp_status: boolean;
  mp_header_image: string;
  mp_thumbnail: string;
  created_at: string;
  updated_at: string;
}



// =========================
// Table Card
// =========================
const DataTableCard: React.FC = () => {

  const navigate = useNavigate();

  const { showSuccess, showError } = useNotification();  

  const [data, setData] = useState<ProgramKeyPoint[]>([]);
  const [dataProgram, setDataProgram] = useState<MstProgram[]>([]);
  const [pageSize, setPageSize] = useState(5);
  const [searchText, setSearchText] = useState("");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<ProgramKeyPoint | null>(null);
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
         `${API_URL}/admin/v1/program-management/key-points`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setData(response.data.data);
      } else {
        showError("Failed to fetch program key points");
      }
    } catch (error) {
      console.error(error);
      showError("Error fetching program key points from server")
    }
  };

  const fetchDataProgram = async () => { 
    const token = localStorage.getItem("token");
    if (!token) {
      showError("Please login first");
      navigate("/login");
      return;
    }

    try {
      const response = await axios.get(
        `${API_URL}/admin/v1/program-management/classes/for-select`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) setDataProgram(response.data.data);
      else showError("Failed to fetch facilities");
    } catch (error) {
      console.error(error);
      showError("Error fetching facilities from server");
    }
  };   

  useEffect(() => {
    fetchData();
    fetchDataProgram();
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
          `${API_URL}/admin/v1/program-management/key-points/delete/${deleteId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data.success) {
          fetchData()
          showSuccess("Program key points deleted successfully");
        } else {
          showError(response.data.message || "Failed to delete program key points");
        }
      } catch (error: any) {
          console.error("Delete failed:", error);
          showError(error.response?.data?.message || "Error deleting program key points");
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
        `${API_URL}/admin/v1/program-management/key-points/delete-multiple`,
        { mpkp_ids: selectedRowKeys }, // kirim array ID kategori
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        // hapus dari state lokal sesuai ID yang berhasil dihapus
        fetchData()
        setSelectedRowKeys([]);
        setIsBulkDeleteOpen(false);
        showSuccess("Selected program key points deleted successfully");
      } else {
        showError(response.data.message || "Failed to delete selected program key points");
      }
    } catch (error: any) {
        console.error("Bulk delete failed:", error);
        showError(error.response?.data?.message || "Error deleting selected program key points");
      }
  };


  // Edit
  const handleEdit = (record: ProgramKeyPoint) => {
    setEditingRow(record);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!editingRow) return;

    // Validasi required fields
    if (!editingRow.key_point || editingRow.key_point.trim() === "") {
      showError("Key Point name is required");
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
        `${API_URL}/admin/v1/program-management/key-points/update/${editingRow.mpkp_id}`,
        {
          key_point: editingRow.key_point.trim(),
          status: editingRow.status,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        fetchData();
        showSuccess("Program key point updated successfully");
        setIsModalOpen(false);
      } else {
        showError(response.data.message || "Failed to update program key point");
      }
    } catch (error: any) {
      console.error(error);
      showError(error.response?.data?.message || "Error updating program key point");
    }
  };


  // Create
  const handleCreate = async () => {
    try {
      const values = await form.validateFields();

      const token = localStorage.getItem("token");
      if (!token) {
        showError("Please login first");
        navigate("/login");
        return;
      }

      const response = await axios.post(
        `${API_URL}/admin/v1/program-management/key-points/create`,
        {
          mp_id: values.mp_id,
          key_point: values.key_point.trim(),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        showSuccess("Program key point created successfully");
        setIsCreateModalOpen(false);
        form.resetFields();
        fetchData(); // refresh table
      } else {
        showError(response.data.message || "Failed to create program key point");
      }
    } catch (error: any) {
      console.error("Create failed:", error);
      showError(error.response?.data?.message || "Error creating program key point");
    }
  };


  // Table columns
  const columns: ColumnsType<ProgramKeyPoint> = [
    {
      title: "ID",
      dataIndex: "mpkp_id",
      key: "mpkp_id",
      width: 60,
    },
    {
      title: "Name",
      dataIndex: "key_point",
      key: "key_point",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
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
            onClick={() => handleDelete(record.mpkp_id)}
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
    (item.key_point || "").toLowerCase().includes(searchText.toLowerCase())
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
              placeholder="Search key point"
              allowClear
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 200 }}
            />
            <Button
              onClick={() =>
                setSelectedRowKeys(filteredData.map((item) => item.mpkp_id))
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

        <Table<ProgramKeyPoint>
          rowSelection={rowSelection} // untuk checkbox bulk select
          columns={columns}           // kolom ID, Name, Action
          dataSource={filteredData}   // hasil filter search
          rowKey="mpkp_id"            // pakai primary key yang benar
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
          title="Edit Program Key Point"
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
                <Input value={editingRow.mpkp_id} disabled />
              </Form.Item>

              {/* Select Program */}
              <Form.Item
                label="Program"
                validateStatus={!editingRow.mp_id ? "error" : undefined}
                help={!editingRow.mp_id ? "Please select program" : ""}
              >
                <Select
                  value={editingRow.mp_id}
                  onChange={(value) => setEditingRow({ ...editingRow, mp_id: value })}
                  placeholder="Select program"
                >
                  {dataProgram.map((program) => (
                    <Select.Option key={program.mp_id} value={program.mp_id}>
                      {program.mp_name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              {/* Key Point */}
              <Form.Item
                label="Key Point"
                validateStatus={
                  !editingRow.key_point || editingRow.key_point.trim() === ""
                    ? "error"
                    : undefined
                }
                help={
                  !editingRow.key_point || editingRow.key_point.trim() === ""
                    ? "Please input key point"
                    : ""
                }
              >
                <Input
                  value={editingRow.key_point}
                  onChange={(e) =>
                    setEditingRow({ ...editingRow, key_point: e.target.value })
                  }
                />
              </Form.Item>

              {/* Status */}
              <Form.Item label="Status">
                <Switch
                  checked={editingRow.status}
                  onChange={(checked) =>
                    setEditingRow({ ...editingRow, status: checked })
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
          title="Create Program Key Point"
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
              {/* Select Program (Branch) */}
              <Col span={24}>
                <Form.Item
                  name="mp_id"
                  label="Select Program"
                  rules={[{ required: true, message: "Please select a program" }]}
                >
                  <Select placeholder="Choose program">
                    {dataProgram.map((program) => (
                      <Select.Option key={program.mp_id} value={program.mp_id}>
                        {program.mp_name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              {/* Key Point */}
              <Col span={24}>
                <Form.Item
                  name="key_point"
                  label="Key Point"
                  rules={[{ required: true, message: "Please input key point" }]}
                >
                  <Input placeholder="Enter key point" />
                </Form.Item>
              </Col>
            </Row>
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
const ProgramManagementKeyPointsPage: React.FC<
  ProgramManagementKeyPointsPageProps
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

export default ProgramManagementKeyPointsPage;