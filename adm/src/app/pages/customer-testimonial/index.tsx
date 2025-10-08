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
interface CustomerTestimonialPageProps {
  isSidebarOpen: boolean;
  isMobile: boolean;
  toggleSidebar: () => void;
}

export interface CustomerTestimonial {
  mct_id: number;
  mct_name: string;
  mct_testimonial: string;
  mct_avatar?: string | null;       // avatar bisa null
  mct_social_url?: string | null;   // social url bisa null
  mct_social_type?: string | null;  // social type bisa null
  mct_status: boolean;
  created_at: string;               // bisa juga Date jika nanti di-convert
  updated_at: string;               // bisa juga Date
  mct_avatar_file?: File | null;
}

// =========================
// Table Card
// =========================
const DataTableCard: React.FC = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();

  const initialData: CustomerTestimonial[] = [];
  const [data, setData] = useState<CustomerTestimonial[]>([]);
  const [pageSize, setPageSize] = useState(5);
  const [searchText, setSearchText] = useState("");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<CustomerTestimonial | null>(null);
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

const socialTypes = [
  { label: "Celebrity", value: "celebrity" },
  { label: "Doctor", value: "doctor" },
  { label: "Lawyer", value: "lawyer" },
  { label: "Engineer", value: "engineer" },
  { label: "Teacher", value: "teacher" },
  { label: "Entrepreneur", value: "entrepreneur" },
  { label: "Artist", value: "artist" },
  { label: "Musician", value: "musician" },
  { label: "Influencer", value: "influencer" },
  { label: "YouTuber", value: "youtuber" },
  { label: "Athlete - Basketball", value: "athlete_basketball" },
  { label: "Athlete - Football", value: "athlete_football" },
  { label: "Athlete - Badminton", value: "athlete_badminton" },
  { label: "Athlete - Tennis", value: "athlete_tennis" },
  { label: "Athlete - Swimming", value: "athlete_swimming" },
  { label: "Athlete - Athletics", value: "athlete_athletics" },
  { label: "Athlete - Boxing", value: "athlete_boxing" },
  { label: "Athlete - Martial Arts", value: "athlete_martial_arts" },
  { label: "Athlete - Volleyball", value: "athlete_volleyball" },
  { label: "Athlete - Gymnastics", value: "athlete_gymnastics" },
];

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
      const res = await axios.get(`${API_URL}/admin/v1/customer-testimonial/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) setData(res.data.data);
      else showError(res.data.message || "Failed to fetch customer testimonial");
    } catch (err: any) {
      console.error(err);
      showError(err.response?.data?.message || "Error fetching customer testimonial");
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
      src = `${API_IMAGE_URL}/uploads/customer_testimonial/${file.name}`;
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
          `${API_URL}/admin/v1/customer-testimonial/delete/${deleteId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.data.success) {
          fetchData();
          showSuccess("Customer testimonial deleted successfully");
        } else showError(res.data.message || "Failed to delete customer testimonial");
      } catch (err: any) {
        console.error(err);
        showError(err.response?.data?.message || "Error deleting customer testimonial");
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
        `${API_URL}/admin/v1/customer-testimonial/delete-multiple`,
        { mct_ids: selectedRowKeys },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        fetchData();
        setSelectedRowKeys([]);
        setIsBulkDeleteOpen(false);
        showSuccess("Selected customer testimonial deleted successfully");
      } else showError(res.data.message || "Failed to delete selected customer testimonial");
    } catch (err: any) {
      console.error(err);
      showError(err.response?.data?.message || "Error deleting selected customer testimonial");
    }
  };

  // Edit
  const handleEdit = (record: CustomerTestimonial) => {
    setEditingRow(record);
    editForm.resetFields();
    editForm.setFieldsValue({
      mct_name: record.mct_name,
      mct_testimonial: record.mct_testimonial,
      mct_avatar: record.mct_avatar,
      mct_social_url: record.mct_social_url,
      mct_social_type: record.mct_social_type,
      mct_status: record.mct_status,
    });
    setIsModalOpen(true);
  };


  const handleSave = async () => {
    if (!editingRow) return;

    try {
      const values = await editForm.validateFields();

      if (!editingRow.mct_name || editingRow.mct_name.trim() === "") {
        showError("Name is required");
        return;
      }
      if (!editingRow.mct_testimonial || editingRow.mct_testimonial.trim() === "") {
        showError("Testimonial is required");
        return;
      }
      if (!editingRow.mct_avatar && !editingRow.mct_avatar_file) {
        showError("Please upload an avatar image");
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      setBtnLoading(true);

      const formData = new FormData();
      formData.append("mct_id", editingRow.mct_id.toString());
      formData.append("mct_name", editingRow.mct_name);
      formData.append("mct_testimonial", editingRow.mct_testimonial || "");
      formData.append("mct_status", editingRow.mct_status ? "1" : "0");
      formData.append("mct_social_url", editingRow.mct_social_url || "");
      formData.append("mct_social_type", editingRow.mct_social_type || "");

      if (editingRow.mct_avatar_file) formData.append("mct_avatar", editingRow.mct_avatar_file);
      else if (editingRow.mct_avatar) formData.append("mct_avatar", editingRow.mct_avatar);

      await axios.put(
        `${API_URL}/admin/v1/customer-testimonial/update/${editingRow.mct_id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } }
      );

      fetchData();
      setIsModalOpen(false);
      showSuccess("Customer Testimonial updated successfully");
    } catch (err: any) {
      console.error(err);
      showError(err.response?.data?.message || "Error updating testimonial");
    } finally {
      setBtnLoading(false);
    }
  };

  // Create Customer Testimonial
  const handleCreate = async () => {
    try {
      const values = await createForm.validateFields();

      if (!values.mct_avatar_file || values.mct_avatar_file.length === 0) {
        showError("Please upload an avatar image");
        return;
      }

      const isDuplicate = data.some(
        (item) => (item.mct_name || "").toLowerCase() === values.mct_name.toLowerCase()
      );
      if (isDuplicate) {
        showError("Customer name already exists");
        return;
      }

      const formData = new FormData();
      formData.append("mct_name", values.mct_name.trim());
      formData.append("mct_testimonial", values.mct_testimonial?.trim() || "");
      formData.append("mct_status", values.mct_status ? "true" : "false");
      formData.append("mct_social_url", values.mct_social_url?.trim() || "");
      formData.append("mct_social_type", values.mct_social_type?.trim() || "");

      if (values.mct_avatar_file[0]?.originFileObj) {
        formData.append("mct_avatar", values.mct_avatar_file[0].originFileObj);
      }

      const token = localStorage.getItem("token");
      if (!token) {
        showError("Please login first");
        navigate("/login");
        return;
      }

      const response = await axios.post(
        `${API_URL}/admin/v1/customer-testimonial/create`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        showSuccess("Customer Testimonial created successfully");
        setIsCreateModalOpen(false);
        createForm.resetFields();
        fetchData();
      } else {
        showError(response.data.message || "Failed to create testimonial");
      }
    } catch (error: any) {
      console.error("Create failed:", error);
      showError(error.response?.data?.message || "Error creating testimonial");
    }
  };

  // Table columns
  const columns: ColumnsType<CustomerTestimonial> = [
    { title: "ID", dataIndex: "mct_id", key: "mct_id", width: 60 },
    { title: "Name", dataIndex: "mct_name", key: "mct_name" },
    { title: "Testimonial", dataIndex: "mct_testimonial", key: "mct_testimonial", ellipsis: true },
    {
      title: "Status",
      key: "mct_status",
      render: (_, record) => (
        <span style={{ color: record.mct_status ? "green" : "red", fontWeight: 500 }}>
          {record.mct_status ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => handleEdit(record)}>Edit</Button>
          <Button type="link" danger onClick={() => handleDelete(record.mct_id)}>Delete</Button>
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
    (item.mct_name || "").toLowerCase().includes(searchText.toLowerCase())
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
              placeholder="Search testimonial"
              allowClear
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 200 }}
            />
            <Button onClick={() => setSelectedRowKeys(filteredData.map((item) => item.mct_id))}>
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
        <Table<CustomerTestimonial>
          rowSelection={rowSelection}
          columns={columns}
          dataSource={filteredData}
          rowKey="mct_id"
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
          title="Edit Customer Testimonial"
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
                mct_name: editingRow.mct_name,
                mct_testimonial: editingRow.mct_testimonial,
                mct_status: editingRow.mct_status,
              }}
              onValuesChange={(changedValues) => {
                if (editingRow && changedValues.mct_status !== undefined) {
                  setEditingRow({ ...editingRow, ...changedValues });
                }
              }}
            >
              {/* Name */}
              <Form.Item
                label="Name"
                name="mct_name"
                rules={[{ required: true, message: "Please input name" }]}
              >
                <Input
                  value={editingRow.mct_name}
                  onChange={(e) =>
                    setEditingRow({ ...editingRow, mct_name: e.target.value })
                  }
                />
              </Form.Item>

              {/* Testimonial */}
              <Form.Item
                label="Testimonial"
                name="mct_testimonial"
                rules={[{ required: true, message: "Please input testimonial" }]}
              >
                <Input.TextArea
                  rows={3}
                  value={editingRow.mct_testimonial}
                  onChange={(e) =>
                    setEditingRow({ ...editingRow, mct_testimonial: e.target.value })
                  }
                />
              </Form.Item>

              {/* Avatar / Image */}
              <Form.Item
                label="Avatar"
                name="mct_avatar"
                rules={[
                  {
                    validator: () =>
                      editingRow?.mct_avatar || editingRow?.mct_avatar_file
                        ? Promise.resolve()
                        : Promise.reject(new Error("Please upload an avatar")),
                  },
                ]}
              >
                {editingRow.mct_avatar || editingRow.mct_avatar_file ? (
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Input
                      readOnly
                      value={editingRow.mct_avatar || editingRow.mct_avatar_file?.name}
                      style={{ width: "calc(100% - 160px)", marginRight: 8 }}
                    />
                    <Button
                      onClick={() =>
                        handlePreview({
                          name: editingRow.mct_avatar,
                          originFileObj: editingRow.mct_avatar_file || undefined,
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
                          mct_avatar: "",
                          mct_avatar_file: undefined,
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
                        mct_avatar_file: file,
                        mct_avatar: file.name,
                      });
                      return false;
                    }}
                    onPreview={() => {
                      if (editingRow.mct_avatar_file || editingRow.mct_avatar) {
                        handlePreview({
                          name: editingRow.mct_avatar,
                          originFileObj: editingRow.mct_avatar_file || undefined,
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

              {/* Social URL */}
              <Form.Item label="Social URL" name="mct_social_url" 
                rules={[
                  { required: true, message: "Please input social URL" },
                  { type: "url", message: "Please enter a valid URL" },
                ]}
              >
                <Input
                  value={editingRow.mct_social_url || ""}
                  onChange={(e) =>
                    setEditingRow({ ...editingRow, mct_social_url: e.target.value })
                  }
                />
              </Form.Item>

              {/* Social Type */}
              <Form.Item
                name="mct_social_type"
                label="Social Type"
                rules={[{ required: true, message: "Please select social type" }]}
              >
                <Select
                  placeholder="Select social type"
                  options={socialTypes}
                  value={editingRow?.mct_social_type || undefined}
                  onChange={(value) =>
                    editingRow && setEditingRow({ ...editingRow, mct_social_type: value })
                  }
                />
              </Form.Item>



              {/* Status */}
              <Form.Item label="Status" name="mct_status" valuePropName="checked">
                <Switch
                  checked={editingRow.mct_status}
                  onChange={(checked) =>
                    setEditingRow({ ...editingRow, mct_status: checked })
                  }
                />
              </Form.Item>
            </Form>
          )}
        </Modal>


       {/* Create Modal */}
        <Modal
          title="Create Customer Testimonial"
          open={isCreateModalOpen}
          onCancel={() => setIsCreateModalOpen(false)}
          okText="Create"
          onOk={handleCreate}
        >
          <Form form={createForm} layout="vertical">
            {/* Name */}
            <Form.Item
              name="mct_name"
              label="Customer Name"
              rules={[{ required: true, message: "Please input customer name" }]}
            >
              <Input placeholder="Enter customer name" />
            </Form.Item>

            {/* Testimonial */}
            <Form.Item
              name="mct_testimonial"
              label="Testimonial"
              rules={[{ required: true, message: "Please input testimonial" }]}
            >
              <Input.TextArea placeholder="Enter testimonial" rows={3} />
            </Form.Item>

            {/* Avatar / Image */}
            <Form.Item
              name="mct_avatar_file"
              label="Upload Avatar"
              valuePropName="fileList"
              getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
              rules={[{ required: true, message: "Please upload an avatar" }]}
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

            {/* Social URL */}
            <Form.Item
              name="mct_social_url"
              label="Social URL"
              rules={[
                { required: true, message: "Please input social URL" },
                { type: "url", message: "Please enter a valid URL" },
              ]}              
            >
              <Input placeholder="Enter social profile URL" />
            </Form.Item>

            {/* Social Type */}
            <Form.Item
              name="mct_social_type"
              label="Social Type"
              rules={[{ required: true, message: "Please select social type" }]}
            >
              <Select
                placeholder="Select social type"
                options={socialTypes}
                value={editingRow?.mct_social_type || undefined} // untuk edit
                onChange={(value) =>
                  editingRow && setEditingRow({ ...editingRow, mct_social_type: value })
                }
              />
            </Form.Item>

            {/* Status */}
            <Form.Item
              name="mct_status"
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
const CustomerTestimonialPage: React.FC<CustomerTestimonialPageProps> = ({ isSidebarOpen, isMobile }) => {
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

export default CustomerTestimonialPage;