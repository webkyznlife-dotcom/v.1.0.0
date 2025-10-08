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
interface EventsPageProps {
  isSidebarOpen: boolean;
  isMobile: boolean;
  toggleSidebar: () => void;
}

export interface MstBranch {
  mb_id: number;
  mb_name: string;
  mb_address: string;
  mb_city: string;
  mb_province: string;
  mb_postal_code: string;
  mb_phone: string;
  mb_status: boolean;
  created_at: string;
  updated_at: string;
}

export interface EventItem {
  me_id: number;
  me_name: string;
  me_description?: string;
  me_youtube_url?: string;
  me_image_url?: string;
  mb_id: number;
  me_created_at: string;
  me_updated_at: string;
  me_status: boolean;
  MstBranch: {
    mb_id: number;
    mb_name: string;
    mb_address?: string;
    mb_city?: string;
    mb_province?: string;
    mb_postal_code?: string;
    mb_phone?: string;
    mb_status: boolean;
    created_at: string;
    updated_at: string;
  };

  // Tambahkan ini
  me_image_file?: File | null;
}


// =========================
// Table Card
// =========================
const DataTableCard: React.FC = () => {

  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();  


  const initialData: EventItem[] = [];

  const [data, setData] = useState<EventItem[]>([]);
  const [dataBranch, setDataBranch] = useState<MstBranch[]>([]);
  const [pageSize, setPageSize] = useState(5);
  const [searchText, setSearchText] = useState("");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<EventItem | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);

  const [eventImage, setEventImage] = useState<any[]>([]);

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
         `${API_URL}/admin/v1/event/`,
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
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) setDataBranch(response.data.data);
      else showError("Failed to fetch facilities");
    } catch (error) {
      console.error(error);
      showError("Error fetching facilities from server");
    }
  };  

  useEffect(() => {
    fetchData();
    fetchDataBranch();
  }, []);

  const branchOptions = [
    { value: 11, label: "BSD" },
    { value: 12, label: "Kuningan" },
    { value: 13, label: "Semarang" },
    { value: 14, label: "Surabaya" },
  ];

  // Row selection
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

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
          `${API_URL}/admin/v1/event/delete/${deleteId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data.success) {
          // Bisa panggil fetchData() kalau ada fungsi untuk reload data
          fetchData(); 
          showSuccess("Event deleted successfully!");
        } else {
          showError(response.data.message || "Failed to delete event");
        }
      } catch (error: any) {
        console.error("Delete failed:", error);
        showError(error.response?.data?.message || "Error deleting event");
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
      message.error("Please select at least one event");
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/admin/v1/event/delete-multiple`,
        { me_ids: selectedRowKeys }, // kirim array ID event
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        fetchData(); // ambil ulang data setelah hapus
        setSelectedRowKeys([]);
        setIsBulkDeleteOpen(false);
        showSuccess("Selected events deleted successfully");
      } else {
        showError(response.data.message || "Failed to delete selected events");
      }
    } catch (error: any) {
      console.error("Bulk delete failed:", error);
      showError(error.response?.data?.message || "Error deleting selected events");
    }
  };

  // Edit
  const handleEdit = (record: EventItem) => {
    setEditingRow(record);

    // reset form supaya tidak bawa nilai dari modal sebelumnya
    editForm.resetFields();

    // set nilai form sesuai record
    editForm.setFieldsValue({
      me_id: record.me_id,
      me_name: record.me_name,
      me_description: record.me_description,
      me_youtube_url: record.me_youtube_url,
      mb_id: record.MstBranch?.mb_id,
      me_status: record.me_status,
      me_image_url: record.me_image_url,
    });

    setIsModalOpen(true);
  };

  // 🚀 Function untuk open modal Create dan reset form
  const handleOpenCreateModal = () => {
    createForm.resetFields(); // reset semua form field
    setEventImage([]);  // reset Upload component
    setIsCreateModalOpen(true); // buka modal
  };

  const handleSave = async () => { 
    if (!editingRow) return;

    try {
      const values = await editForm.validateFields(); // validasi form

      // Validasi semua field
      const name = editingRow.me_name?.trim();
      const description = editingRow.me_description?.trim();
      const youtubeUrl = editingRow.me_youtube_url?.trim();
      const mbId = values.mb_id;

      if (!name) {
        showError("Name cannot be empty");
        return;
      }
      if (!description) {
        showError("Description cannot be empty");
        return;
      }
      if (!youtubeUrl) {
        showError("YouTube URL cannot be empty");
        return;
      }
      if (!mbId) {
        showError("Category must be selected");
        return;
      }

      if (!editingRow.me_image_url && !editingRow.me_image_file) {
        showError("Please upload an image");
        return;
      }    

      setBtnLoading(true);

      const formData = new FormData();
      formData.append("me_id", editingRow.me_id.toString());
      formData.append("me_name", editingRow.me_name?.trim() || "");
      formData.append("me_description", editingRow.me_description || "");
      formData.append("me_youtube_url", editingRow.me_youtube_url || "");
      formData.append("mb_id", values.mb_id?.toString() || "");
      formData.append("me_status", editingRow.me_status ? "1" : "0");

      // Append file baru kalau ada
      if (editingRow.me_image_file) {
        formData.append("me_image_url", editingRow.me_image_file);
      } 
      // Jika ada file lama tapi user tidak mengganti, tetap kirim nama lama
      else if (editingRow.me_image_url) {
        formData.append("me_image_url", editingRow.me_image_url);
      }

      // Token
      const token = localStorage.getItem("token");

      await axios.put(
        `${API_URL}/admin/v1/event/update/${editingRow.me_id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchData(); // refresh data
      setIsModalOpen(false);
      showSuccess("Event updated successfully");
    } catch (error: any) {
      console.error("Update failed:", error);
      showError(error.response?.data?.message || "Error updating Event");
    } finally {
      setBtnLoading(false);
    }
  };


  // Create
  const handleCreate = async () => {
    try {
      // validasi form
      const values = await createForm.validateFields();

      // cek duplikasi nama event
      const isDuplicate = data.some(
        (item) =>
          (item.me_name || "").toLowerCase() === values.me_name.toLowerCase()
      );
      if (isDuplicate) {
        showError("Event name already exists");
        return;
      }

      // buat FormData untuk upload file
      const formData = new FormData();
      formData.append("me_name", values.me_name.trim());
      formData.append("me_description", values.me_description?.trim() || "");
      formData.append("me_youtube_url", values.me_youtube_url?.trim() || "");
      formData.append("mb_id", values.mb_id);
      formData.append("me_status", values.mb_status ? "true" : "false");

      // append file jika ada
      if (values.me_image_file && values.me_image_file[0]) {
        formData.append("me_image_url", values.me_image_file[0].originFileObj);
      }

      // token untuk auth
      const token = localStorage.getItem("token");
      if (!token) {
        showError("Please login first");
        navigate("/login");
        return;
      }

      // kirim ke server
      const response = await axios.post(
        `${API_URL}/admin/v1/event/create`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        showSuccess("Event created successfully");
        setIsCreateModalOpen(false);
        createForm.resetFields();
        fetchData(); // reload data dari server
      } else {
        showError(response.data.message || "Failed to create event");
      }
    } catch (error: any) {
      console.error("Create failed:", error);
      showError(error.response?.data?.message || "Error creating event");
    }
  };

  const getBase64 = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
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
      src = `${API_IMAGE_URL}/uploads/events/${file.name}`;
    }

    setPreviewImage(src);
    setPreviewTitle(file.name || "Preview");
    setPreviewOpen(true);
  };



  // Table columns
  const columns: ColumnsType<EventItem> = [
    {
      title: "ID",
      dataIndex: "me_id",
      key: "me_id",
      width: 60,
    },
    {
      title: "Name",
      dataIndex: "me_name",
      key: "me_name",
    },
    {
      title: "Description",
      dataIndex: "me_description",
      key: "me_description",
      ellipsis: true,
    },
    {
      title: "Branch",
      key: "branch",
      render: (_, record) => record.MstBranch?.mb_name || "-",
    },
    {
      title: "Created At",
      dataIndex: "me_created_at",
      key: "me_created_at",
    },
    {
      title: "Status",
      key: "status",
      render: (_, record) => (
        <span style={{ color: record.me_status ? "green" : "red", fontWeight: 500 }}>
          {record.me_status ? "Active" : "Inactive"}
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
          <Button type="link" danger onClick={() => handleDelete(record.me_id)}>
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
    (item.me_name || "").toLowerCase().includes(searchText.toLowerCase())
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
              placeholder="Search event"
              allowClear
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 200 }}
            />
            <Button
              onClick={() =>
                setSelectedRowKeys(filteredData.map((item) => item.me_id))
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
        <Table<EventItem>
          rowSelection={rowSelection}
          columns={columns}
          dataSource={filteredData}
          rowKey="me_id"
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

        {/* Edit Event Modal */}
        <Modal
          title="Edit Event"
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
                me_name: editingRow.me_name,
                me_description: editingRow.me_description,
                me_youtube_url: editingRow.me_youtube_url,
                mb_id: editingRow.MstBranch?.mb_id,
                me_status: editingRow.me_status,
              }}
              onValuesChange={(changedValues) => {
                // Update branch selection di editingRow
                if (changedValues.mb_id) {
                  const branch = branchOptions.find((b) => b.value === changedValues.mb_id);
                  setEditingRow({
                    ...editingRow,
                    MstBranch: {
                      ...editingRow.MstBranch,
                      mb_id: changedValues.mb_id,
                      mb_name: branch?.label || "",
                    },
                  });
                }
              }}
            >
              {/* ID */}
              <Form.Item label="ID" name="me_id" initialValue={editingRow.me_id}>
                <Input disabled />
              </Form.Item>

              {/* Name */}
              <Form.Item
                label="Name"
                name="me_name"
                rules={[{ required: true, message: "Please input event name" }]}
              >
                <Input
                  value={editingRow.me_name}
                  onChange={(e) =>
                    setEditingRow({ ...editingRow, me_name: e.target.value })
                  }
                />
              </Form.Item>

              {/* Description */}
              <Form.Item
                label="Description"
                name="me_description"
                rules={[{ required: true, message: "Please input description" }]}
              >
                <Input.TextArea
                  rows={3}
                  value={editingRow.me_description}
                  onChange={(e) =>
                    setEditingRow({ ...editingRow, me_description: e.target.value })
                  }
                />
              </Form.Item>

              {/* YouTube URL */}
              <Form.Item
                label="YouTube URL"
                name="me_youtube_url"
                rules={[
                  { required: true, message: "Please input YouTube URL" },
                  { type: "url", message: "Please enter a valid URL" },
                ]}
              >
                <Input
                  value={editingRow.me_youtube_url}
                  onChange={(e) =>
                    setEditingRow({ ...editingRow, me_youtube_url: e.target.value })
                  }
                />
              </Form.Item>

              {/* Branch */}
              <Form.Item
                label="Branch"
                name="mb_id"
                rules={[{ required: true, message: "Please select a branch" }]}
              >
                <Select
                  placeholder="Select a branch"
                  allowClear
                  showSearch
                  optionFilterProp="children"
                  options={dataBranch.map(branch => ({
                    value: branch.mb_id,
                    label: branch.mb_name,
                  }))}
                  style={{ width: "100%" }}
                />
              </Form.Item>

              {/* Image */}
              <Form.Item
                label="Image"
                name="me_image_url"
                rules={[
                  {
                    validator: () =>
                      editingRow?.me_image_url || editingRow?.me_image_file
                        ? Promise.resolve()
                        : Promise.reject(new Error("Please upload an image")),
                  },
                ]}
              >
                {editingRow.me_image_url || editingRow.me_image_file ? (
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Input
                      readOnly
                      value={editingRow.me_image_url || editingRow.me_image_file?.name}
                      style={{ width: "calc(100% - 160px)", marginRight: 8 }}
                    />
                    <Button
                      onClick={() =>
                        handlePreview({
                          name: editingRow.me_image_url,
                          originFileObj: editingRow.me_image_file || undefined,
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
                          me_image_url: "",
                          me_image_file: null,
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
                        me_image_file: file,
                        me_image_url: file.name,
                      });
                      return false; // prevent automatic upload
                    }}
                    onPreview={() => {
                      if (editingRow.me_image_file || editingRow.me_image_url) {
                        handlePreview({
                          name: editingRow.me_image_url,
                          originFileObj: editingRow.me_image_file || undefined,
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
              <Form.Item label="Status Active" name="me_status" valuePropName="checked">
                <Switch
                  checked={editingRow.me_status}
                  onChange={(checked) =>
                    setEditingRow({ ...editingRow, me_status: checked })
                  }
                />
              </Form.Item>
            </Form>
          )}
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
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
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
          <img
            alt="preview"
            style={{ width: "100%", display: "block" }}
            src={previewImage}
          />
        </Modal>


        {/* Create Modal */}
        <Modal
          title="Create Event"
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
                  name="me_name"
                  label="Event Name"
                  rules={[{ required: true, message: "Please input event name" }]}
                >
                  <Input placeholder="Enter event name" />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item 
                  name="me_description" 
                  label="Description" 
                  rules={[{ required: true, message: "Please input description" }]}
                >
                  <Input.TextArea placeholder="Enter description" />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item 
                  name="me_youtube_url" 
                  label="YouTube URL"
                  rules={[{ required: true, message: "Please input event name" }]}
                >
                  <Input placeholder="Enter YouTube link" />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item
                  name="me_image_file"
                  label="Upload Image"
                  valuePropName="fileList"
                  getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
                  rules={[
                    {
                      validator: (_, value) =>
                        value && value.length > 0
                          ? Promise.resolve()
                          : Promise.reject(new Error("Please upload an image")),
                    },
                  ]}
                >
                  <Upload
                    beforeUpload={() => false}
                    listType="picture-card"
                    maxCount={1}
                    fileList={eventImage}
                    onChange={({ fileList }) => setEventImage(fileList)}
                    onPreview={handlePreview}
                  >
                    {eventImage.length >= 1 ? null : (
                      <div>
                        <UploadOutlined />
                        <div style={{ marginTop: 8 }}>Upload</div>
                      </div>
                    )}
                  </Upload>
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item
                  name="mb_id"
                  label="Branch"
                  rules={[{ required: true, message: "Please select a branch" }]}
                >
                  <Select
                    placeholder="Select a branch"
                    allowClear showSearch optionFilterProp="children"
                    options={dataBranch.map(branch => ({
                      value: branch.mb_id,
                      label: branch.mb_name
                    }))}
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item
                  name="mb_status"
                  label="Status"
                  valuePropName="checked"
                  initialValue={true}
                >
                  <Switch
                    checkedChildren="Active"
                    unCheckedChildren="Inactive"
                  />
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
            <b>{selectedRowKeys.length}</b> selected events? This action cannot
            be undone.
          </p>
        </Modal>
      </Card>
    </Column>
  );
};

// =========================
// Main Component
// =========================
const EventsPage: React.FC<EventsPageProps> = ({ isSidebarOpen, isMobile }) => {
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

export default EventsPage;
