import React, { useState, useEffect } from "react";

// Layout components
import { Container, Column } from "../../components/layout";

// Icons
import { UploadOutlined, CloseOutlined, DeleteOutlined } from "@ant-design/icons";

// Ant Design
import {
  Card,
  Typography,
  Table,
  Button,
  Modal,
  Descriptions,
  Form,
  Input,
  Col,
  Row,
  message,
  Switch,
  Upload,
  Select,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../../context/NotificationContext";

const { Title } = Typography;

// =========================
// Types
// =========================
interface CollaborationsPageProps {
  isSidebarOpen: boolean;
  isMobile: boolean;
  toggleSidebar: () => void;
}

export interface CollaborationItem {
  mc_id: number;
  mc_name: string;
  mc_description?: string;
  mc_image?: string;
  mc_status: boolean;
  created_at: string;
  updated_at: string;
  mc_image_file?: File | null;
}

// =========================
// Table Card
// =========================
const DataTableCard: React.FC = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();

  const initialData: CollaborationItem[] = [];
  const [data, setData] = useState<CollaborationItem[]>([]);
  const [pageSize, setPageSize] = useState(5);
  const [searchText, setSearchText] = useState("");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<CollaborationItem | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL;
  const API_IMAGE_URL = process.env.REACT_APP_API_IMAGE_URL;

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [previewTitle, setPreviewTitle] = useState<string>("");
  const [btnLoading, setBtnLoading] = useState(false);

  // Row selection
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  // =========================
  // FETCH DATA
  // =========================
  const fetchData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      showError("Please login first");
      navigate("/login");
      return;
    }

    try {
      const res = await axios.get(`${API_URL}/admin/v1/collaboration/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) setData(res.data.data);
      else showError(res.data.message || "Failed to fetch collaborations");
    } catch (err: any) {
      console.error(err);
      showError(err.response?.data?.message || "Error fetching collaborations");
    }
  };

  const getBase64 = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const handlePreview = async (file: any) => {
    let src = file.url || file.preview;

    // Kalau file dari lokal upload
    if (!src && file.originFileObj) {
      file.preview = await getBase64(file.originFileObj);
      src = file.preview;
    }

    // Kalau file dari server hanya nama file
    if (!src && !file.originFileObj && file.name) {
      src = `${API_IMAGE_URL}/uploads/collaborations/${file.name}`;
    }

    setPreviewImage(src);
    setPreviewTitle(file.name || "Preview");
    setPreviewOpen(true);
  };

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
    if (!token) return navigate("/login");

    if (deleteId !== null) {
      try {
        const res = await axios.delete(
          `${API_URL}/admin/v1/collaboration/delete/${deleteId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.data.success) {
          fetchData();
          showSuccess("Collaboration deleted successfully");
        } else showError(res.data.message || "Failed to delete collaboration");
      } catch (err: any) {
        console.error(err);
        showError(err.response?.data?.message || "Error deleting collaboration");
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
    if (!token) return navigate("/login");

    if (selectedRowKeys.length === 0) return message.error("No row selected");

    try {
      const res = await axios.post(
        `${API_URL}/admin/v1/collaboration/delete-multiple`,
        { mc_ids: selectedRowKeys },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        fetchData();
        setSelectedRowKeys([]);
        setIsBulkDeleteOpen(false);
        showSuccess("Selected collaborations deleted successfully");
      } else showError(res.data.message || "Failed to delete selected collaborations");
    } catch (err: any) {
      console.error(err);
      showError(err.response?.data?.message || "Error deleting selected collaborations");
    }
  };

  // Edit
  const handleEdit = (record: CollaborationItem) => {
    setEditingRow(record);
    editForm.resetFields();
    editForm.setFieldsValue({
      mc_name: record.mc_name,
      mc_description: record.mc_description,
      mc_status: record.mc_status,
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!editingRow) return;

    try {
      const values = await editForm.validateFields();

      if (!editingRow.mc_name || editingRow.mc_name.trim() === "") {
        showError("Name is required");
        return;
      }
      if (!editingRow.mc_description || editingRow.mc_description.trim() === "") {
        showError("Description is required");
        return;
      }
      if (!editingRow.mc_image && !editingRow.mc_image_file) {
        showError("Please upload an image");
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      setBtnLoading(true);

      const formData = new FormData();
      formData.append("mc_id", editingRow.mc_id.toString());
      formData.append("mc_name", editingRow.mc_name);
      formData.append("mc_description", editingRow.mc_description || "");
      formData.append("mc_status", editingRow.mc_status ? "1" : "0");

      if (editingRow.mc_image_file) formData.append("mc_image", editingRow.mc_image_file);
      else if (editingRow.mc_image) formData.append("mc_image", editingRow.mc_image);

      await axios.put(
        `${API_URL}/admin/v1/collaboration/update/${editingRow.mc_id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } }
      );

      fetchData();
      setIsModalOpen(false);
      showSuccess("Collaboration updated successfully");
    } catch (err: any) {
      console.error(err);
      showError(err.response?.data?.message || "Error updating collaboration");
    } finally {
      setBtnLoading(false);
    }
  };

  // Create
  const handleCreate = async () => {
    try {
      const values = await createForm.validateFields();

      if (!values.mc_image_file || values.mc_image_file.length === 0) {
        showError("Please upload an image");
        return;
      }

      const isDuplicate = data.some(
        (item) => (item.mc_name || "").toLowerCase() === values.mc_name.toLowerCase()
      );
      if (isDuplicate) {
        showError("Collaboration name already exists");
        return;
      }

      const formData = new FormData();
      formData.append("mc_name", values.mc_name.trim());
      formData.append("mc_description", values.mc_description?.trim() || "");
      formData.append("mc_status", values.mc_status ? "true" : "false");

      if (values.mc_image_file[0]?.originFileObj) {
        formData.append("mc_image", values.mc_image_file[0].originFileObj);
      }

      const token = localStorage.getItem("token");
      if (!token) {
        showError("Please login first");
        navigate("/login");
        return;
      }

      const response = await axios.post(
        `${API_URL}/admin/v1/collaboration/create`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        showSuccess("Collaboration created successfully");
        setIsCreateModalOpen(false);
        createForm.resetFields();
        fetchData();
      } else {
        showError(response.data.message || "Failed to create collaboration");
      }
    } catch (error: any) {
      console.error("Create failed:", error);
      showError(error.response?.data?.message || "Error creating collaboration");
    }
  };

  // Table columns
  const columns: ColumnsType<CollaborationItem> = [
    { title: "ID", dataIndex: "mc_id", key: "mc_id", width: 60 },
    { title: "Name", dataIndex: "mc_name", key: "mc_name" },
    { title: "Description", dataIndex: "mc_description", key: "mc_description", ellipsis: true },
    {
      title: "Status",
      key: "mc_status",
      render: (_, record) => (
        <span style={{ color: record.mc_status ? "green" : "red", fontWeight: 500 }}>
          {record.mc_status ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => handleEdit(record)}>Edit</Button>
          <Button type="link" danger onClick={() => handleDelete(record.mc_id)}>Delete</Button>
        </>
      ),
    },
  ];

  // Row selection config
  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: React.Key[]) => setSelectedRowKeys(keys),
    hideSelectAll: true,
  };

  const filteredData = data.filter((item) =>
    (item.mc_name || "").toLowerCase().includes(searchText.toLowerCase())
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
          <Title level={5} style={{ margin: 0 }}>List Data</Title>
          <div style={{ display: "flex", gap: 8 }}>
            <Input.Search
              placeholder="Search event"
              allowClear
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 200 }}
            />
            <Button onClick={() => setSelectedRowKeys(filteredData.map((item) => item.mc_id))}>
              Select All
            </Button>
            <Button onClick={() => setSelectedRowKeys([])}>Deselect All</Button>
            <Button danger disabled={selectedRowKeys.length === 0} onClick={handleDeleteSelected}>
              Delete Selected
            </Button>
            <Button type="primary" onClick={() => setIsCreateModalOpen(true)}>+ Create</Button>
          </div>
        </div>

        {/* Table */}
        <Table<CollaborationItem>
          rowSelection={rowSelection}
          columns={columns}
          dataSource={filteredData}
          rowKey="mc_id"
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
          title="Edit Collaboration"
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          onOk={handleSave}
          confirmLoading={btnLoading}
          centered
          destroyOnClose
        >
          {editingRow && (
            <Form
              layout="vertical"
              form={editForm}
              initialValues={{
                mc_name: editingRow.mc_name,
                mc_description: editingRow.mc_description,
                mc_status: editingRow.mc_status,
              }}
              onValuesChange={(changedValues) => {
                if (editingRow && changedValues.mc_status !== undefined) {
                  setEditingRow({ ...editingRow, ...changedValues });
                }
              }}
            >
              {/* Name */}
              <Form.Item
                label="Name"
                name="mc_name"
                rules={[{ required: true, message: "Please input name" }]}
              >
                <Input
                  value={editingRow.mc_name}
                  onChange={(e) =>
                    setEditingRow({ ...editingRow, mc_name: e.target.value })
                  }
                />
              </Form.Item>

              {/* Description */}
              <Form.Item
                label="Description"
                name="mc_description"
                rules={[{ required: true, message: "Please input description" }]}
              >
                <Input.TextArea
                  rows={3}
                  value={editingRow.mc_description}
                  onChange={(e) =>
                    setEditingRow({ ...editingRow, mc_description: e.target.value })
                  }
                />
              </Form.Item>

              {/* Image */}
              <Form.Item
                label="Image"
                name="mc_image"
                rules={[
                  {
                    validator: () =>
                      editingRow?.mc_image || editingRow?.mc_image_file
                        ? Promise.resolve()
                        : Promise.reject(new Error("Please upload an image")),
                  },
                ]}
              >
                {editingRow.mc_image || editingRow.mc_image_file ? (
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Input
                      readOnly
                      value={editingRow.mc_image || editingRow.mc_image_file?.name}
                      style={{ width: "calc(100% - 160px)", marginRight: 8 }}
                    />
                    <Button
                      onClick={() =>
                        handlePreview({
                          name: editingRow.mc_image,
                          originFileObj: editingRow.mc_image_file || undefined,
                        })
                      }
                    >
                      Preview
                    </Button>
                    <Button
                      className="ml-2"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() =>
                        setEditingRow({
                          ...editingRow,
                          mc_image: "",
                          mc_image_file: undefined,
                        })
                      }
                    />
                  </div>
                ) : (
                  <Upload
                    listType="picture-card"
                    maxCount={1}
                    beforeUpload={(file) => {
                      setEditingRow({
                        ...editingRow,
                        mc_image_file: file,
                        mc_image: file.name,
                      });
                      return false;
                    }}
                    onPreview={() => {
                      if (editingRow.mc_image_file || editingRow.mc_image) {
                        handlePreview({
                          name: editingRow.mc_image,
                          originFileObj: editingRow.mc_image_file || undefined,
                        });
                      }
                    }}
                  >
                    <div>
                      <UploadOutlined /> Upload
                    </div>
                  </Upload>
                )}
              </Form.Item>

              {/* Status */}
              <Form.Item label="Status" name="mc_status" valuePropName="checked">
                <Switch
                  checked={editingRow.mc_status}
                  onChange={(checked) =>
                    setEditingRow({ ...editingRow, mc_status: checked })
                  }
                />
              </Form.Item>
            </Form>
          )}
        </Modal>

        {/* Create Modal */}
        <Modal
          title="Create Collaboration"
          open={isCreateModalOpen}
          onCancel={() => setIsCreateModalOpen(false)}
          okText="Create"
          onOk={handleCreate}
        >
          <Form form={createForm} layout="vertical">
            <Form.Item
              name="mc_name"
              label="Collaboration Name"
              rules={[{ required: true, message: "Please input collaboration name" }]}
            >
              <Input placeholder="Enter collaboration name" />
            </Form.Item>

            <Form.Item
              name="mc_description"
              label="Description"
              rules={[{ required: true, message: "Please input description" }]}
            >
              <Input.TextArea placeholder="Enter description" />
            </Form.Item>

            <Form.Item
              name="mc_image_file"
              label="Upload Image"
              valuePropName="fileList"
              getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
              rules={[{ required: true, message: "Please upload an image" }]}
            >
              <Upload
                beforeUpload={() => false}
                listType="picture"
                maxCount={1}
                onPreview={handlePreview}
              >
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
              </Upload>
            </Form.Item>

            <Form.Item
              name="mc_status"
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
            Are you sure you want to delete <b>{selectedRowKeys.length}</b> selected events? This action cannot
            be undone.
          </p>
        </Modal>

        {/* Preview Modal */}
        <Modal
          open={previewOpen}
          footer={null}
          onCancel={() => setPreviewOpen(false)}
          centered
          closable={false}
          width={600}
          bodyStyle={{ padding: 0 }}
          title={
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography.Text strong ellipsis style={{ maxWidth: "80%" }}>
                {previewTitle}
              </Typography.Text>
              <CloseOutlined
                onClick={() => setPreviewOpen(false)}
                style={{ fontSize: 16, cursor: "pointer" }}
              />
            </div>
          }
          zIndex={1500}
        >
          <img alt="preview" style={{ width: "100%", display: "block" }} src={previewImage} />
        </Modal>
      </Card>
    </Column>
  );
};

// =========================
// Main Component
// =========================
const CollaborationsPage: React.FC<CollaborationsPageProps> = ({ isSidebarOpen, isMobile }) => {
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

export default CollaborationsPage;