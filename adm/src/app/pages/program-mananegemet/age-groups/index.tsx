import React, { useState, useEffect } from "react";
import { Container, Column } from "../../../components/layout";
import {
  Card,
  Typography,
  Table,
  Button,
  Modal,
  Switch,
  Form,
  InputNumber,
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
// INTERFACES
// =========================
interface ProgramManagementPageProps {
  isSidebarOpen: boolean;
  isMobile: boolean;
  toggleSidebar: () => void;
}

type ProgramAge = {
  mpa_id: number;
  mpa_min: number | null;
  mpa_max: number | null;
  mpa_status: boolean;
};

// =========================
// DATA TABLE CARD COMPONENT
// =========================
const DataTableCard: React.FC = () => {
  const navigate = useNavigate();

  const { showSuccess, showError } = useNotification();

  // =========================
  // STATE
  // =========================
  const [data, setData] = useState<ProgramAge[]>([]);
  const [pageSize, setPageSize] = useState(5);
  const [searchText, setSearchText] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<ProgramAge | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [form] = Form.useForm();

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
        `${API_URL}/admin/v1/program-management/age-groups/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setData(response.data.data);
      } else {
        showError("Failed to fetch age groups")
      }
    } catch (error) {
      console.error(error);
      showError("Error fetching age groups from server")
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // =========================
  // FILTERED DATA
  // =========================
  const filteredData = data.filter(
    (item) =>
      (item.mpa_min ?? "").toString().includes(searchText) ||
      (item.mpa_max ?? "").toString().includes(searchText)
  );

  // =========================
  // ROW SELECTION
  // =========================
  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: React.Key[]) => setSelectedRowKeys(keys),
    hideSelectAll: true,
  };

  // =========================
  // HANDLERS
  // =========================
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
        await axios.delete(
          `${API_URL}/admin/v1/program-management/age-groups/delete/${deleteId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        showSuccess("Age Groups deleted successfully");
        fetchData();
      } catch (error) {
        console.error("Delete failed:", error);
        showError("Failed to delete Program Age");
      }
    }

    setIsDeleteOpen(false);
    setDeleteId(null);
  };

  const handleDeleteSelected = () => {
    if (!selectedRowKeys.length) {
      message.warning("Please select at least one row");
      return;
    }
    setIsBulkDeleteOpen(true);
  };

  const confirmBulkDelete = async () => {
    try {
      if (selectedRowKeys.length === 0) {
        showError("No Age Groups selected");
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        showError("Please login first");
        navigate("/login");
        return;
      }

      const response = await axios.post(
        `${API_URL}/admin/v1/program-management/age-groups/delete-multiple`,
        {
          mpa_ids: selectedRowKeys, // kirim array ID yang dipilih
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setIsBulkDeleteOpen(false)
        // Hapus data di state sesuai ID yang berhasil di-soft delete
        setData((prev) =>
          prev.filter((item) => !selectedRowKeys.includes(item.mpa_id))
        );
        setSelectedRowKeys([]);
        showSuccess("Selected Age Groups deleted successfully");
        fetchData();
      } else {
        showError(response.data.message || "Failed to delete Age Groups");
      }
    } catch (error) {
      console.error("Bulk delete failed:", error);
      showError("Error deleting Age Groups. Please try again");
    }
  };


  const handleEdit = (record: ProgramAge) => {
    setEditingRow(record);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (editingRow) {
      // Validasi required fields
      if (
        editingRow.mpa_min == null ||
        editingRow.mpa_max == null ||
        editingRow.mpa_status == null
      ) {
        showError("All fields are required");
        return;
      }

      // Validasi min < max
      if (Number(editingRow.mpa_min) >= Number(editingRow.mpa_max)) {
        showError("Minimum age must be smaller than maximum age");
        return;
      }

      try {
        const token = localStorage.getItem("token");

        const response = await axios.put(
          `${API_URL}/admin/v1/program-management/age-groups/update/${editingRow.mpa_id}`,
          {
            mpa_min: editingRow.mpa_min,
            mpa_max: editingRow.mpa_max,
            mpa_status: editingRow.mpa_status,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data.success) {
          setData((prev) =>
            prev.map((row) =>
              row.mpa_id === editingRow.mpa_id ? response.data.data : row
            )
          );
          showSuccess("Age group updated successfully");
        } else {
          showError(response.data.message || "Failed to update age group");
        }
      } catch (error: any) {
        console.error(error);
        showError(error.response?.data?.message || "Error updating age group");
      }
    }

    setIsModalOpen(false);
  };

  const handleCreate = async () => {
    try {
      const values = await form.validateFields();

      if (values.mpa_min >= values.mpa_max) {
        message.error("Min age must be less than Max age");
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        showSuccess("Please login first");
        navigate("/login");
        return;
      }

      const response = await axios.post(
        `${API_URL}/admin/v1/program-management/age-groups/create`,
        {
          mpa_min: values.mpa_min,
          mpa_max: values.mpa_max,
          mpa_status: values.mpa_status,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        showSuccess("Age Groups created successfully");
        setIsCreateModalOpen(false);
        form.resetFields();
        fetchData();
      } else {
        message.error(response.data.message || "Failed to create Age Group");
      }
    } catch (error) {
      console.error("Create failed:", error);
      showError("Error creating Age Groups. Please try again");
    }
  };

  // =========================
  // TABLE COLUMNS
  // =========================
  const columns: ColumnsType<ProgramAge> = [
    { title: "ID", dataIndex: "mpa_id", key: "mpa_id", width: 60 },
    { title: "Min Age", dataIndex: "mpa_min", key: "mpa_min" },
    { title: "Max Age", dataIndex: "mpa_max", key: "mpa_max" },
    {
      title: "Status",
      dataIndex: "mpa_status",
      key: "mpa_status",
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
          <Button type="link" danger onClick={() => handleDelete(record.mpa_id)}>
            Delete
          </Button>
        </>
      ),
    },
  ];

  // =========================
  // MODALS
  // =========================
  const renderEditModal = () => (
    <Modal
      title="Edit Age Groups"
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
            <Input value={editingRow.mpa_id} disabled />
          </Form.Item>

          <Row gutter={12}>
            <Col span={12}>
              <Form.Item
                label="Min Age"
                validateStatus={editingRow.mpa_min == null ? "error" : undefined}
                help={editingRow.mpa_min == null ? "Please input min age" : ""}
              >
                <InputNumber
                  min={0}
                  style={{ width: "100%" }}
                  value={editingRow.mpa_min}
                  onChange={(value) =>
                    setEditingRow({ ...editingRow, mpa_min: value })
                  }
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Max Age"
                validateStatus={
                  editingRow.mpa_max == null
                    ? "error"
                    : editingRow.mpa_min != null &&
                      editingRow.mpa_max < editingRow.mpa_min
                    ? "error"
                    : undefined
                }
                help={
                  editingRow.mpa_max == null
                    ? "Please input max age"
                    : editingRow.mpa_min != null &&
                      editingRow.mpa_max < editingRow.mpa_min
                    ? "Max Age must ≥ Min Age"
                    : ""
                }
              >
                <InputNumber
                  min={0}
                  style={{ width: "100%" }}
                  value={editingRow.mpa_max}
                  onChange={(value) =>
                    setEditingRow({ ...editingRow, mpa_max: value })
                  }
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Status">
            <Switch
              checked={editingRow.mpa_status}
              onChange={(checked) =>
                setEditingRow({ ...editingRow, mpa_status: checked })
              }
              checkedChildren="Active"
              unCheckedChildren="Inactive"
            />
          </Form.Item>
        </Form>
      )}
    </Modal>
  );

  const renderCreateModal = () => (
    <Modal
      title="Create Age Groups"
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
          <Col span={12}>
            <Form.Item
              name="mpa_min"
              label="Min Age"
              rules={[
                { required: true, message: "Please input min age" },
                { type: "number", min: 0, message: "Min age must be >= 0" },
              ]}
            >
              <InputNumber
                placeholder="Enter min age"
                style={{ width: "100%" }}
                min={0}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="mpa_max"
              label="Max Age"
              dependencies={["mpa_min"]}
              rules={[
                { required: true, message: "Please input max age" },
                { type: "number", min: 1, message: "Max age must be >= 1" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || value > getFieldValue("mpa_min")) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Max age must be greater than Min age")
                    );
                  },
                }),
              ]}
            >
              <InputNumber
                placeholder="Enter max age"
                style={{ width: "100%" }}
                min={1}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="mpa_status"
          label="Status"
          valuePropName="checked"
          initialValue={true}
        >
          <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
        </Form.Item>
      </Form>
    </Modal>
  );

  const renderDeleteModals = () => (
    <>
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
          <b>{selectedRowKeys.length}</b> selected age groups? This action
          cannot be undone.
        </p>
      </Modal>
    </>
  );

  // =========================
  // RENDER
  // =========================
  return (
    <Column size={12}>
      <Card
        style={{
          borderRadius: 14,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)",
        }}
      >
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
            <Input
              placeholder="Search min/max age"
              allowClear
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 200 }}
            />
            <Button
              onClick={() =>
                setSelectedRowKeys(filteredData.map((item) => item.mpa_id))
              }
            >
              Select All
            </Button>
            <Button onClick={() => setSelectedRowKeys([])}>Deselect All</Button>
            <Button
              danger
              disabled={!selectedRowKeys.length}
              onClick={handleDeleteSelected}
            >
              Delete Selected
            </Button>
            <Button type="primary" onClick={() => setIsCreateModalOpen(true)}>
              + Create
            </Button>
          </div>
        </div>

        <Table<ProgramAge>
          rowSelection={rowSelection}
          columns={columns}
          dataSource={filteredData}
          rowKey="mpa_id"
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

        {renderEditModal()}
        {renderCreateModal()}
        {renderDeleteModals()}
      </Card>
    </Column>
  );
};

// =========================
// DASHBOARD PAGE
// =========================
const AgeGroupsPage: React.FC<ProgramManagementPageProps> = ({
  isSidebarOpen,
  isMobile,
}) => (
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

// =========================
// STYLES
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

export default AgeGroupsPage;
