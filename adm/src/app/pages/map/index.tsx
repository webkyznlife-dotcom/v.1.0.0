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
import { useNotification } from "../../context/NotificationContext";

const { Title } = Typography;
const { Option } = Select;

// =========================
// Types
// =========================
interface MapProps {
  isSidebarOpen: boolean;
  isMobile: boolean;
  toggleSidebar: () => void;
}

export interface Branch {
  mb_id: number;
  mb_name: string;
  mb_address?: string;
  mb_city?: string;
  mb_province?: string;
  mb_postal_code?: string;
  mb_phone?: string;
  mb_status?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface BranchMap {
  mbm_id: number;
  mb_id: number;
  mbm_title: string;
  mbm_url: string;
  mbm_status?: boolean;
  created_at?: string;
  updated_at?: string;
  MstBranch?: Branch;
}

// =========================
// Table Card
// =========================
const DataTableCard: React.FC = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();
  const API_URL = process.env.REACT_APP_API_URL;

  const [data, setData] = useState<BranchMap[]>();
  const [dataBranch, setDataBranch] = useState<Branch[]>();
  const [pageSize, setPageSize] = useState(5);
  const [searchText, setSearchText] = useState("");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<BranchMap | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);

  // Row selection
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [btnLoading, setBtnLoading] = useState(false);

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
      const response = await axios.get(`${API_URL}/admin/v1/locations/map/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
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

  const fetchDataBranch = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      showError("Please login first");
      navigate("/login");
      return;
    }

    try {
      const response = await axios.get(
        `${API_URL}/admin/v1/locations/branch-list/for-select`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setDataBranch(response.data.data);
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
    fetchDataBranch();
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
          `${API_URL}/admin/v1/locations/map/delete/${deleteId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.success) {
          fetchData();
          showSuccess("Branch map deleted successfully!");
        } else {
          showError(response.data.message || "Failed to delete branch map");
        }
      } catch (error: any) {
        console.error("Delete failed:", error);
        showError(error.response?.data?.message || "Error deleting branch map");
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
      message.error("Please select at least one branch map");
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/admin/v1/locations/map/delete-multiple`,
        { mbm_ids: selectedRowKeys },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        fetchData();
        setSelectedRowKeys([]);
        setIsBulkDeleteOpen(false);
        showSuccess("Selected branch maps deleted successfully!");
      } else {
        showError(response.data.message || "Failed to delete selected branch maps");
      }
    } catch (error: any) {
      console.error("Bulk delete failed:", error);
      showError(error.response?.data?.message || "Error deleting selected branch maps");
    }
  };

  // Edit Branch Map
  const handleEdit = (record: BranchMap) => {
    setEditingRow(record);
    setIsModalOpen(true);

    editForm.setFieldsValue({
      mbm_title: record.mbm_title ?? "",
      mb_id: record.mb_id ?? "",
      mbm_url: record.mbm_url ?? "",
      mbm_status: record.mbm_status ?? false,
    });
  };

  // Open Create Modal
  const openCreateModal = () => {
    setEditingRow(null);
    createForm.resetFields();
    setIsCreateModalOpen(true);
  };

  // Save Edit
  const handleSave = async () => {
    if (!editingRow) return;

    try {
      const values = await editForm.validateFields();
      const payload = {
        mb_id: values.mb_id,
        mbm_title: values.mbm_title.trim(),
        mbm_url: values.mbm_url.trim(),
        mbm_status: values.mbm_status ?? true,
      };

      try {
        new URL(payload.mbm_url);
      } catch {
        showError("Map URL must be a valid URL (example: https://...)");
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
        `${API_URL}/admin/v1/locations/map/update/${editingRow.mbm_id}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        showSuccess("Branch map updated successfully");
        setIsModalOpen(false);
        editForm.resetFields();
        fetchData();
      } else {
        showError(response.data.message || "Failed to update branch map");
      }
    } catch (error: any) {
      console.error("Update failed:", error);
      showError(error.response?.data?.message || "Error updating branch map");
    } finally {
      setBtnLoading(false);
    }
  };

  // Create Branch Map
  const handleCreate = async () => {
    try {
      const values = await createForm.validateFields();

      if (!values.mbm_title?.trim()) {
        showError("Map title is required!");
        return;
      }
      if (!values.mbm_url?.trim()) {
        showError("Map URL is required!");
        return;
      }
      if (!values.mb_id) {
        showError("Branch must be selected!");
        return;
      }

      try {
        new URL(values.mbm_url);
      } catch (_) {
        showError("Map URL must be a valid URL!");
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        message.error("Please login first");
        navigate("/login");
        return;
      }

      const response = await axios.post(
        `${API_URL}/admin/v1/locations/map/create`,
        {
          mb_id: values.mb_id,
          mbm_title: values.mbm_title.trim(),
          mbm_url: values.mbm_url.trim(),
          mbm_status: values.mbm_status ?? true,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        showSuccess("Branch map created successfully!");
        createForm.resetFields();
        setIsCreateModalOpen(false);
        fetchData();
      } else {
        showError(response.data.message || "Failed to create branch map");
      }
    } catch (error: any) {
      console.error("Create failed:", error);
      if (error.response?.data?.message) {
        showError(error.response.data.message);
      } else {
        showError("Error creating branch map. Please try again");
      }
    }
  };

  // =========================
  // Table columns
  // =========================
  const columns: ColumnsType<BranchMap> = [
    { title: "ID", dataIndex: "mbm_id", key: "mbm_id", width: 60 },
    {
      title: "Branch",
      dataIndex: ["MstBranch", "mb_name"],
      key: "branch",
      render: (_, record) => record.MstBranch?.mb_name || "-",
    },
    { title: "Title", dataIndex: "mbm_title", key: "mbm_title" },
    {
      title: "Map URL",
      dataIndex: "mbm_url",
      key: "mbm_url",
      render: (url: string) => (
        <a href={url} target="_blank" rel="noopener noreferrer">
          {url}
        </a>
      ),
    },
    {
      title: "Status",
      dataIndex: "mbm_status",
      key: "mbm_status",
      render: (status: boolean) => (
        <span style={{ color: status ? "green" : "red" }}>
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
          <Button type="link" danger onClick={() => handleDelete(record.mbm_id)}>
            Delete
          </Button>
        </>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: React.Key[]) => setSelectedRowKeys(keys),
    hideSelectAll: true,
  };

  const filteredData = (data || []).filter(
    (item) =>
      item.mbm_title.toLowerCase().includes(searchText.toLowerCase()) ||
      item.MstBranch?.mb_name.toLowerCase().includes(searchText.toLowerCase())
  );

  // =========================
  // Render
  // =========================
  return (
    <Column size={12}>
      <Card style={{ borderRadius: 14, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)" }}>
        {/* Header */}
        <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Title level={5} style={{ margin: 0 }}>
            List Data
          </Title>

          <div style={{ display: "flex", gap: 8 }}>
            <Input.Search
              placeholder="Search branch map"
              allowClear
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 200 }}
            />
            <Button onClick={() => setSelectedRowKeys(filteredData.map((item) => item.mbm_id))}>
              Select All
            </Button>
            <Button onClick={() => setSelectedRowKeys([])}>Deselect All</Button>
            <Button danger disabled={selectedRowKeys.length === 0} onClick={handleDeleteSelected}>
              Delete Selected
            </Button>
            <Button type="primary" onClick={openCreateModal}>
              + Create
            </Button>
          </div>
        </div>

        {/* Table */}
        <Table<BranchMap>
          rowSelection={rowSelection}
          columns={columns}
          dataSource={filteredData}
          rowKey="mbm_id"
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
          title="Edit Branch Map"
          open={isModalOpen}
          onOk={handleSave}
          onCancel={() => setIsModalOpen(false)}
          okText="Save Changes"
          cancelText="Cancel"
          centered
          destroyOnClose
        >
          {editingRow && (
            <Form
              form={editForm}
              layout="vertical"
              initialValues={{
                mb_id: editingRow.mb_id,
                mbm_title: editingRow.mbm_title,
                mbm_url: editingRow.mbm_url,
                mbm_status: editingRow.mbm_status,
              }}
            >
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item
                    name="mb_id"
                    label="Branch"
                    rules={[{ required: true, message: "Please select branch" }]}
                  >
                    <Select placeholder="Select a branch" allowClear>
                      {(dataBranch || []).map((branch) => (
                        <Option key={branch.mb_id} value={branch.mb_id}>
                          {branch.mb_name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item
                    name="mbm_title"
                    label="Map Title"
                    rules={[{ required: true, message: "Please input map title" }]}
                  >
                    <Input placeholder="Enter map title" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item
                    name="mbm_url"
                    label="Map URL"
                    rules={[
                      { required: true, message: "Please input map URL" },
                      {
                        validator: (_, value) => {
                          if (!value) return Promise.resolve();
                          try {
                            new URL(value);
                            return Promise.resolve();
                          } catch {
                            return Promise.reject("Map must be a valid URL!");
                          }
                        },
                      },
                    ]}
                  >
                    <Input placeholder="Enter map URL" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item name="mbm_status" label="Status" valuePropName="checked">
                <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
              </Form.Item>
            </Form>
          )}
        </Modal>

        {/* Create Modal */}
        <Modal
          title="Create Branch Map"
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
                  name="mbm_title"
                  label="Map Title"
                  rules={[{ required: true, message: "Please input map title" }]}
                >
                  <Input placeholder="Enter map title" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="mb_id"
                  label="Branch"
                  rules={[{ required: true, message: "Please select branch" }]}
                >
                  <Select placeholder="Select a branch" allowClear showSearch optionFilterProp="children">
                    {(dataBranch || []).map((branch) => (
                      <Option key={branch.mb_id} value={branch.mb_id}>
                        {branch.mb_name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="mbm_url"
                  label="Map URL"
                  rules={[
                    { required: true, message: "Please input map URL" },
                    {
                      validator: (_, value) => {
                        if (!value) return Promise.resolve();
                        try {
                          new URL(value);
                          return Promise.resolve();
                        } catch {
                          return Promise.reject("Map must be a valid URL!");
                        }
                      },
                    },
                  ]}
                >
                  <Input placeholder="Enter map URL" />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              name="mbm_status"
              label="Status"
              valuePropName="checked"
              initialValue={true}
              rules={[{ required: true, message: "Please select status" }]}
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
            Are you sure you want to delete <b>{selectedRowKeys.length}</b> selected branch maps? This action
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
const Map: React.FC<MapProps> = ({ isSidebarOpen, isMobile }) => {
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

export default Map;
