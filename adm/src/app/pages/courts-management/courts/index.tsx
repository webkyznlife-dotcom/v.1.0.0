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
  Upload,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../../../context/NotificationContext";
import { DeleteOutlined, UploadOutlined, CloseOutlined } from "@ant-design/icons";

const { Title } = Typography;

// =========================
// Types
// =========================
interface CourtsPageProps {
  isSidebarOpen: boolean;
  isMobile: boolean;
  toggleSidebar: () => void;
}

export interface CourtImage {
  mci_id: number;
  mc_id: number;
  mci_image: string;
  mci_description?: string | null;
  mci_status?: boolean;
  mci_image_existing?: string; // untuk update, optional
  created_at?: string | null;
  updated_at?: string | null;
}

export interface Court {
  mc_id: number;                // Primary key
  mc_name: string;              // Nama court
  mc_type?: string | null;      // Tipe court, bisa null
  mc_status?: boolean;          // Status court, default true
  created_at?: string | null;   // Timestamp dibuat
  updated_at?: string | null;   // Timestamp diupdate
  MstCourtImages?: CourtImage[]; // Array gambar court
}

// =========================
// Table Card
// =========================
const DataTableCard: React.FC = () => {
  const initialData: Court[] = [];


  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();  


  const [data, setData] = useState<Court[]>(initialData);
  const [pageSize, setPageSize] = useState(5);
  const [searchText, setSearchText] = useState("");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<Court | null>(null);
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
         `${API_URL}/admin/v1/courts-management/court/`,
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
          `${API_URL}/admin/v1/courts-management/court/delete/${deleteId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data.success) {
          fetchData(); // pastikan ada fungsi untuk reload data table
          showSuccess("Court deleted successfully!");
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
        `${API_URL}/admin/v1/courts-management/court/delete-multiple`,
        { mc_ids: selectedRowKeys },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        fetchData(); // reload table
        setSelectedRowKeys([]);
        setIsBulkDeleteOpen(false);
        showSuccess("Selected courts deleted successfully!");
      } else {
        showError(response.data.message || "Failed to delete selected courts");
      }
    } catch (error: any) {
      console.error("Bulk delete failed:", error);
      showError(error.response?.data?.message || "Error deleting selected courts");
    }
  };



// Edit Court
const handleEdit = (record: Court) => {
  setEditingRow(record);
  setIsModalOpen(true);

  console.log("record.images:", record);

  form.setFieldsValue({
    mc_name: record.mc_name,
    mc_type: record.mc_type || "",
    mc_status: record.mc_status === true,

    // Images dynamic
    images: record.MstCourtImages?.map((img: any) => ({
      file: [
        {
          uid: img.mci_id?.toString(),
          name: img.mci_image || `image-${img.mci_id}`,
          status: "done",
          url: `${API_IMAGE_URL}/uploads/courts/${img.mci_image}`,
        },
      ],
      existingFileName: img.mci_image, // ⬅️ penting untuk backend update
      description: img.mci_description,
      status: img.mci_status === true,
    })) || [],
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

    const formData = new FormData();

    formData.append("mc_name", values.mc_name?.trim() || "");
    formData.append("mc_type", values.mc_type || "");
    formData.append("mc_status", values.mc_status ? "true" : "false");

    // Handle images
    values.images?.forEach((img: any, index: number) => {
      // Jika user pilih file baru
      if (img.file?.[0]?.originFileObj) {
        formData.append("mci_image", img.file[0].originFileObj);
        console.log("👉 Append NEW file:", img.file[0].originFileObj.name);
      } 
      // Jika tidak diganti, pakai file lama
      else if (img.existingFileName) {
        formData.append("mci_image_existing", img.existingFileName);
        console.log("👉 Append OLD file:", img.existingFileName);
      }

      // Deskripsi & status
      formData.append(`mci_description_${index}`, img.description || "");
      console.log(`👉 Append Description [${index}]:`, img.description || "");

      formData.append(`mci_status_${index}`, img.status ? "true" : "false");
      console.log(`👉 Append Status [${index}]:`, img.status ? "true" : "false");
    });

    // Token
    const token = localStorage.getItem("token");

    await axios.put(
      `${API_URL}/admin/v1/courts-management/court/update/${editingRow.mc_id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    fetchData();
    setIsModalOpen(false);
    showSuccess("Court updated successfully");
  } catch (error: any) {
    console.error("Update failed:", error);
    showError(error.response?.data?.message || "Error updating Court");
  } finally {
    setBtnLoading(false);
  }
};



const handleCreateCancel = () => {
  form.resetFields();  
  setIsCreateModalOpen(false)
}

// Create
const handleCreate = async () => {
  try {
    setBtnLoading(true);

    const values = await form.validateFields();
    const token = localStorage.getItem("token");
    if (!token) {
      showError("Please login first");
      return;
    }

    // ✅ Cek minimal 1 image
    if (!values.images || values.images.length === 0) {
      showError("Please upload at least one image");
      return;
    }

    const formData = new FormData();

    // Field Court
    formData.append("mc_name", values.mc_name);
    formData.append("mc_type", values.mc_type || "");
    formData.append("mc_status", (values.mc_status ?? true).toString());

    // Multiple images
    values.images.forEach((img: any, index: number) => {
      if (img.file?.[0]?.originFileObj) {
        formData.append("mci_image", img.file[0].originFileObj);
        formData.append(`mci_description_${index}`, img.description || "");
        formData.append(`mci_status_${index}`, (img.status ?? true).toString());
      }
    });

    const response = await axios.post(
      `${API_URL}/admin/v1/locations/court/create`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.success) {
      showSuccess("Court created successfully!");
      fetchData();
      setIsCreateModalOpen(false);
      form.resetFields(); // Reset fields setelah sukses
    } else {
      showError(response.data.message || "Failed to create court");
    }
  } catch (err: any) {
    console.error(err);
    showError(err.response?.data?.message || "Error creating court");
  } finally {
    setBtnLoading(false);
  }
};



// Table columns
const columns: ColumnsType<Court> = [
  {
    title: "ID",
    dataIndex: "mc_id",
    key: "mc_id",
    width: 60,
  },
  {
    title: "Name",
    dataIndex: "mc_name",
    key: "mc_name",
    render: (text: string | undefined) => text ?? "-", // fallback jika null/undefined
  },
  {
    title: "Type",
    dataIndex: "mc_type",
    key: "mc_type",
    render: (text: string | null | undefined) => text ?? "-", // fallback
  },
  {
    title: "Status",
    dataIndex: "mc_status",
    key: "mc_status",
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
        <Button type="link" danger onClick={() => handleDelete(record.mc_id)}>
          Delete
        </Button>
      </div>
    ),
  },
];


  const getBase64 = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });

  const handlePreview = async (file: any) => {
    if (!file.url && !file.preview && file.originFileObj) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewTitle(file.name || 'Preview');
    setPreviewOpen(true);
  };

  // Row selection config
  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: React.Key[]) => {
      setSelectedRowKeys(keys);
    },
    hideSelectAll: true,
  };

  const filteredData = data.filter((item) =>
    (item.mc_name ?? "").toLowerCase().includes(searchText.toLowerCase())
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
    setSelectedRowKeys(filteredData.map((item) => item.mc_id))
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
  <Table<Court>
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

<Modal
  title="Edit Court"
  open={isModalOpen}
  onCancel={() => setIsModalOpen(false)}
  centered
  width={800}
  destroyOnClose
  footer={[
    <Button key="cancel" onClick={() => setIsModalOpen(false)}>Cancel</Button>,
    <Button key="update" type="primary" loading={btnLoading} onClick={handleSave}>Update</Button>,
  ]}
>
  <Form form={form} layout="vertical">
    {/* Court Name */}
    <Form.Item
      label="Court Name"
      name="mc_name"
      rules={[{ required: true, message: "Please input court name" }]}
    >
      <Input placeholder="Enter court name" />
    </Form.Item>

    {/* Court Type */}
    <Form.Item label="Court Type" name="mc_type">
      <Input placeholder="Enter court type" />
    </Form.Item>

    {/* Court Status */}
    <Form.Item
      name="mc_status"
      label="Status"
      valuePropName="checked"
      initialValue={true}
    >
      <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
    </Form.Item>

    {/* Images dynamic */}
    <Form.Item label="Court Images">
      <Form.List
        name="images"
        rules={[
          {
            validator: async (_, images) => {
              if (!images || images.length < 1) {
                return Promise.reject(new Error("Please add at least one image"));
              }
            },
          },
        ]}
      >
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Row key={key} gutter={12} align="top" style={{ marginBottom: 16 }}>
                <Col span={8}>
                  <Form.Item
                    {...restField}
                    name={[name, "file"]}
                    valuePropName="fileList"
                    getValueFromEvent={(e) => Array.isArray(e) ? e : e?.fileList}
                    rules={[{ required: true, message: "Please upload image" }]}
                    style={{ marginBottom: 0 }}
                  >
                    <Upload beforeUpload={() => false} listType="picture-card" maxCount={1} onPreview={handlePreview}>
                      <div>
                        <UploadOutlined />
                        <div style={{ marginTop: 8 }}>Upload</div>
                      </div>
                    </Upload>
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item
                    {...restField}
                    name={[name, "description"]}
                    rules={[{ required: true, message: "Please input image description" }]}
                    style={{ marginBottom: 0 }}
                  >
                    <Input.TextArea autoSize={{ minRows: 4, maxRows: 4 }} placeholder="Description" />
                  </Form.Item>
                </Col>

                <Col span={4}>
                  <Form.Item
                    {...restField}
                    name={[name, "status"]}
                    valuePropName="checked"
                    initialValue={true}
                    style={{ marginBottom: 0 }}
                  >
                    <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
                  </Form.Item>
                </Col>

                <Col span={2} style={{ display: "flex", alignItems: "flex-start" }}>
                  <Button
                    danger
                    type="text"
                    icon={<DeleteOutlined style={{ fontSize: 20 }} />}
                    onClick={() => remove(name)}
                  />
                </Col>
              </Row>
            ))}
            <Button type="dashed" onClick={() => add()} block className="mt-4">
              + Add Image
            </Button>
          </>
        )}
      </Form.List>
    </Form.Item>
  </Form>
</Modal>

<Modal
  title="Create Court"
  open={isCreateModalOpen}
  onCancel={handleCreateCancel}
  centered
  width={800}
  destroyOnClose
  footer={[
    <Button key="cancel" onClick={handleCreateCancel}>Cancel</Button>,
    <Button key="create" type="primary" loading={btnLoading} onClick={handleCreate}>Create</Button>,
  ]}
>
  <Form form={form} layout="vertical">
    {/* Court Name */}
    <Form.Item
      label="Court Name"
      name="mc_name"
      rules={[{ required: true, message: "Please input court name" }]}
    >
      <Input placeholder="Enter court name" />
    </Form.Item>

    {/* Court Type */}
    <Form.Item
      label="Court Type"
      name="mc_type"
      rules={[{ required: true, message: "Please input court type" }]}
    >
      <Input placeholder="Enter court type (e.g., Tennis, Badminton)" />
    </Form.Item>

    {/* Court Status */}
    <Form.Item
      name="mc_status" 
      label="Status"
      valuePropName="checked"
      initialValue={true}
    >
      <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
    </Form.Item>

    {/* Images dynamic */}
    <Form.Item label="Court Images">
      <Form.List
        name="images"
        rules={[
          {
            validator: async (_, images) => {
              if (!images || images.length < 1) {
                return Promise.reject(new Error("Please add at least one image"));
              }
            },
          },
        ]}
      >
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Row key={key} gutter={12} align="top" style={{ marginBottom: 16 }}>
                {/* Upload */}
                <Col span={8}>
                  <Form.Item
                    {...restField}
                    name={[name, "file"]}
                    valuePropName="fileList"
                    getValueFromEvent={(e) => Array.isArray(e) ? e : e?.fileList}
                    rules={[{ required: true, message: "Please upload image" }]}
                    style={{ marginBottom: 0 }}
                  >
                    <Upload
                      beforeUpload={() => false}
                      listType="picture-card"
                      maxCount={1}
                      onPreview={handlePreview} // 🔹 preview
                    >
                      <div>
                        <UploadOutlined />
                        <div style={{ marginTop: 8 }}>Upload</div>
                      </div>
                    </Upload>
                  </Form.Item>
                </Col>

                {/* Description */}
                <Col span={8}>
                  <Form.Item
                    {...restField}
                    name={[name, "description"]}
                    rules={[{ required: true, message: "Please input image description" }]}
                    style={{ marginBottom: 0 }}
                  >
                    <Input.TextArea autoSize={{ minRows: 4, maxRows: 4 }} placeholder="Description" />
                  </Form.Item>
                </Col>

                {/* Status */}
                <Col span={4}>
                  <Form.Item
                    {...restField}
                    name={[name, "status"]}
                    valuePropName="checked"
                    initialValue={true}
                    style={{ marginBottom: 0 }}
                  >
                    <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
                  </Form.Item>
                </Col>

                {/* Delete button */}
                <Col span={2} style={{ display: "flex", alignItems: "flex-start" }}>
                  <Button
                    danger
                    type="text"
                    icon={<DeleteOutlined style={{ fontSize: 20 }} />}
                    onClick={() => remove(name)}
                  />
                </Col>
              </Row>
            ))}
            <Button type="dashed" onClick={() => add()} block className="mt-4">
              + Add Image
            </Button>
          </>
        )}
      </Form.List>
    </Form.Item>
  </Form>

  {/* Modal preview gambar */}
  <Modal
    open={previewOpen}
    title={previewTitle}
    footer={null}
    onCancel={() => setPreviewOpen(false)}
  >
    <img alt="preview" style={{ width: "100%" }} src={previewImage} />
  </Modal>
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
    <p>This action cannot be undone. The court will be permanently deleted.</p>
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
      <b>{selectedRowKeys.length}</b> selected courts? This action
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
const CourtsPage: React.FC<
  CourtsPageProps
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

export default CourtsPage;