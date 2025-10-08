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
  Select,
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
interface BranchListProps {
  isSidebarOpen: boolean;
  isMobile: boolean;
  toggleSidebar: () => void;
}

export interface BranchImage {
  mbi_id: number;           // Primary key image
  mb_id: number;            // Foreign key ke Branch
  mbi_image: string;        // Nama file/image path
  mbi_description?: string; // Deskripsi image (nullable)
  mbi_status?: boolean;     // Status aktif/inaktif image
  created_at?: string;      // Timestamp dibuat
  updated_at?: string;      // Timestamp update terakhir
  existingFileName?: string;
}

export interface Branch {
  mb_id: number;              // Primary key
  mb_name: string;            // Nama cabang
  mb_address?: string;        // Alamat cabang (nullable)
  mb_city?: string;           // Kota cabang (nullable)
  mb_province?: string;       // Provinsi cabang (nullable)
  mb_postal_code?: string;    // Kode pos (nullable)
  mb_phone?: string;          // Nomor telepon (nullable)
  mb_status?: boolean;        // Status aktif/inaktif, default true
  created_at?: string;        // Timestamp dibuat
  updated_at?: string;        // Timestamp update terakhir
  MstBranchImages?: BranchImage[]; // Array image branch
}

// =========================
// Table Card
// =========================
const DataTableCard: React.FC = () => {
  const initialData: Branch[] = [];

  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();  

  const [data, setData] = useState<Branch[]>(initialData);
  const [pageSize, setPageSize] = useState(5);
  const [searchText, setSearchText] = useState("");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<Branch | null>(null);
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
         `${API_URL}/admin/v1/locations/branch-list/`,
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

  const cityOptions = [
    { label: "Jakarta Pusat", value: "jakarta pusat" },
    { label: "Jakarta Barat", value: "jakarta barat" },
    { label: "Jakarta Timur", value: "jakarta timur" },
    { label: "Jakarta Selatan", value: "jakarta selatan" },
    { label: "Jakarta Utara", value: "jakarta utara" },
    { label: "Bandung", value: "bandung" },
    { label: "Bandung Barat", value: "bandung barat" },
    { label: "Bekasi", value: "bekasi" },
    { label: "Bogor", value: "bogor" },
    { label: "Depok", value: "depok" },
    { label: "Cimahi", value: "cimahi" },
    { label: "Cirebon", value: "cirebon" },
    { label: "Tasikmalaya", value: "tasikmalaya" },
    { label: "Semarang", value: "semarang" },
    { label: "Surabaya", value: "surabaya" },
    { label: "Medan", value: "medan" },
    { label: "Palembang", value: "palembang" },
    { label: "Makassar", value: "makassar" },
    { label: "Denpasar", value: "denpasar" },
    { label: "Pontianak", value: "pontianak" },
    { label: "Balikpapan", value: "balikpapan" },
    { label: "Banjarmasin", value: "banjarmasin" },
    { label: "Manado", value: "manado" },
    { label: "Kupang", value: "kupang" },
    { label: "Jayapura", value: "jayapura" },
    { label: "Ambon", value: "ambon" },
    { label: "Mataram", value: "mataram" },
    { label: "Padang", value: "padang" },
    { label: "Pekanbaru", value: "pekanbaru" },
    { label: "Jambi", value: "jambi" },
    { label: "Banda Aceh", value: "banda aceh" },
    { label: "Tangerang", value: "tangerang" },
    { label: "Tangerang Selatan", value: "tangerang selatan" },
  ];

  const provinceOptions = [
    { label: "Aceh", value: "aceh" },
    { label: "Sumatera Utara", value: "sumatera utara" },
    { label: "Sumatera Barat", value: "sumatera barat" },
    { label: "Riau", value: "riau" },
    { label: "Kepulauan Riau", value: "kepulauan riau" },
    { label: "Jambi", value: "jambi" },
    { label: "Sumatera Selatan", value: "sumatera selatan" },
    { label: "Bangka Belitung", value: "bangka belitung" },
    { label: "Bengkulu", value: "bengkulu" },
    { label: "Lampung", value: "lampung" },
    { label: "DKI Jakarta", value: "dki jakarta" },
    { label: "Jawa Barat", value: "jawa barat" },
    { label: "Banten", value: "banten" },
    { label: "Jawa Tengah", value: "jawa tengah" },
    { label: "DI Yogyakarta", value: "di yogyakarta" },
    { label: "Jawa Timur", value: "jawa timur" },
    { label: "Bali", value: "bali" },
    { label: "Nusa Tenggara Barat", value: "nusa tenggara barat" },
    { label: "Nusa Tenggara Timur", value: "nusa tenggara timur" },
    { label: "Kalimantan Barat", value: "kalimantan barat" },
    { label: "Kalimantan Tengah", value: "kalimantan tengah" },
    { label: "Kalimantan Selatan", value: "kalimantan selatan" },
    { label: "Kalimantan Timur", value: "kalimantan timur" },
    { label: "Kalimantan Utara", value: "kalimantan utara" },
    { label: "Sulawesi Utara", value: "sulawesi utara" },
    { label: "Gorontalo", value: "gorontalo" },
    { label: "Sulawesi Tengah", value: "sulawesi tengah" },
    { label: "Sulawesi Barat", value: "sulawesi barat" },
    { label: "Sulawesi Selatan", value: "sulawesi selatan" },
    { label: "Sulawesi Tenggara", value: "sulawesi tenggara" },
    { label: "Maluku", value: "maluku" },
    { label: "Maluku Utara", value: "maluku utara" },
    { label: "Papua", value: "papua" },
    { label: "Papua Barat", value: "papua barat" },
  ];


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
          `${API_URL}/admin/v1/locations/branch-list/delete/${deleteId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data.success) {
          fetchData(); // reload data table
          showSuccess("Branch deleted successfully!");
        } else {
          showError(response.data.message || "Failed to delete branch");
        }
      } catch (error: any) {
        console.error("Delete failed:", error);
        showError(error.response?.data?.message || "Error deleting branch");
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
      showError("Please select at least one branch");
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/admin/v1/locations/branch-list/delete-multiple`,
        { mb_ids: selectedRowKeys },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        fetchData(); // reload table
        setSelectedRowKeys([]);
        setIsBulkDeleteOpen(false);
        showSuccess("Selected branchs deleted successfully!");
      } else {
        showError(response.data.message || "Failed to delete selected branchs");
      }
    } catch (error: any) {
      console.error("Bulk delete failed:", error);
      showError(error.response?.data?.message || "Error deleting selected branchs");
    }
  };


  // Edit Branch
  const handleEdit = (record: Branch) => {
    setEditingRow(record);
    setIsModalOpen(true);

    form.setFieldsValue({
      mb_name: record.mb_name,
      mb_address: record.mb_address || "",
      mb_city: record.mb_city || "",
      mb_province: record.mb_province || "",
      mb_postal_code: record.mb_postal_code || "",
      mb_phone: record.mb_phone || "",
      mb_status: record.mb_status === true,

      // Images dynamic
      images:
        record.MstBranchImages?.map((img: any) => ({
          file: [
            {
              uid: img.mbi_id?.toString(),
              name: img.mbi_image || `image-${img.mbi_id}`,
              status: "done",
              url: `${API_IMAGE_URL}/uploads/branchs/${img.mbi_image}`, // 📌 path image untuk branch
            },
          ],
          existingFileName: img.mbi_image, // ⬅️ penting untuk update
          description: img.mbi_description,
          status: img.mbi_status === true,
        })) || [],
    });
  };

  // 🚀 Function untuk open modal Create dan reset form
  const handleOpenCreateModal = () => {
    form.resetFields(); // kosongkan semua field form
    setIsCreateModalOpen(true); // buka modal create
  };


  // Update Branch
  const handleSave = async () => {
    if (!editingRow) return;

    try {

      if (form.getFieldsValue().images.length === 0) { 
        showError("Please upload at least one image"); return; 
      }

      const values = await form.validateFields();
      setBtnLoading(true);

      const formData = new FormData();

      // ✅ Branch fields
      formData.append("mb_name", values.mb_name?.trim() || "");
      formData.append("mb_address", values.mb_address || "");
      formData.append("mb_city", values.mb_city || "");
      formData.append("mb_province", values.mb_province || "");
      formData.append("mb_postal_code", values.mb_postal_code || "");
      formData.append("mb_phone", values.mb_phone || "");
      formData.append("mb_status", values.mb_status ? "true" : "false");

      // ✅ Handle images
      values.images?.forEach((img: any, index: number) => {
        if (img.file?.[0]?.originFileObj) {
          // User upload file baru
          formData.append("mbi_image", img.file[0].originFileObj);
          console.log("👉 Append NEW file:", img.file[0].originFileObj.name);
        } else if (img.existingFileName) {
          // Kalau pakai gambar lama
          formData.append("mbi_image_existing", img.existingFileName);
          console.log("👉 Append OLD file:", img.existingFileName);
        }

        // Deskripsi & status tiap gambar
        formData.append(`mbi_description_${index}`, img.description || "");
        formData.append(`mbi_status_${index}`, img.status ? "true" : "false");
      });

      // ✅ Token
      const token = localStorage.getItem("token");

      await axios.put(
        `${API_URL}/admin/v1/locations/branch-list/update/${editingRow.mb_id}`,
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
      showSuccess("Branch updated successfully!");
    } catch (error: any) {
      console.error("Update failed:", error);
      showError(error.response?.data?.message || "Error updating Branch");
    } finally {
      setBtnLoading(false);
    }
  };


  const handleCreateCancel = () => {
    form.resetFields();  
    setIsCreateModalOpen(false)
  }

  // Create Branch
  const handleCreate = async () => {
    try {

      if (form.getFieldsValue().images === undefined) { 
        showError("Please upload at least one image"); return; 
      }

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

      // Field Branch
      formData.append("mb_name", values.mb_name);
      formData.append("mb_address", values.mb_address || "");
      formData.append("mb_city", values.mb_city || "");
      formData.append("mb_province", values.mb_province || "");
      formData.append("mb_postal_code", values.mb_postal_code || "");
      formData.append("mb_phone", values.mb_phone || "");
      formData.append("mb_status", (values.mb_status ?? true).toString());

      // Multiple images
      values.images.forEach((img: any, index: number) => {
        if (img.file?.[0]?.originFileObj) {
          formData.append("mbi_image", img.file[0].originFileObj);
          formData.append(`mbi_description_${index}`, img.description || "");
          formData.append(`mbi_status_${index}`, (img.status ?? true).toString());
        }
      });

      const response = await axios.post(
        `${API_URL}/admin/v1/locations/branch-list/create`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        showSuccess("Branch created successfully!");
        fetchData();
        setIsCreateModalOpen(false);
        form.resetFields(); // Reset form setelah sukses
      } else {
        showError(response.data.message || "Failed to create branch");
      }
    } catch (err: any) {
      console.error(err);
      showError(err.response?.data?.message || "Error creating branch");
    } finally {
      setBtnLoading(false);
    }
  };



  const columns: ColumnsType<Branch> = [
    {
      title: "ID",
      dataIndex: "mb_id",
      key: "mb_id",
      width: 60,
    },
    {
      title: "Name",
      dataIndex: "mb_name",
      key: "mb_name",
    },
    {
      title: "City",
      dataIndex: "mb_city",
      key: "mb_city",
    },
    {
      title: "Phone",
      dataIndex: "mb_phone",
      key: "mb_phone",
    },
    {
      title: "Status",
      dataIndex: "mb_status",
      key: "mb_status",
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
        <>
          <Button type="link" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Button
            type="link"
            danger
            onClick={() => handleDelete(record.mb_id)}
          >
            Delete
          </Button>
        </>
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
    item.mb_name.toLowerCase().includes(searchText.toLowerCase())
  )

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
              placeholder="Search branch"
              allowClear
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 200 }}
            />
            <Button
              onClick={() =>
                setSelectedRowKeys(filteredData.map((item) => item.mb_id))
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
        <Table<Branch>
          rowSelection={rowSelection}
          columns={columns}
          dataSource={filteredData}
          rowKey="mb_id"
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


{/* Edit Branch Modal */}
<Modal
  title="Edit Branch"
  open={isModalOpen}
  onCancel={() => setIsModalOpen(false)}
  centered
  width={800}
  destroyOnClose
  footer={[
    <Button key="cancel" onClick={() => setIsModalOpen(false)}>
      Cancel
    </Button>,
    <Button
      key="update"
      type="primary"
      loading={btnLoading}
      onClick={handleSave}
    >
      Update
    </Button>,
  ]}
>
  <Form form={form} layout="vertical">
    <Row gutter={16}>
      {/* Branch Name */}
      <Col span={12}>
        <Form.Item
          label="Branch Name"
          name="mb_name"
          rules={[{ required: true, message: "Please input branch name" }]}
        >
          <Input placeholder="Enter branch name" />
        </Form.Item>
      </Col>

      {/* Postal Code */}
      <Col span={12}>
        <Form.Item
          label="Postal Code"
          name="mb_postal_code"
          rules={[
            { required: true, pattern: /^\d{5}$/, message: "Postal code must be 5 digits" },
          ]}
        >
          <Input type="number" placeholder="Enter postal code" />
        </Form.Item>
      </Col>
    </Row>

    {/* Address */}
    <Form.Item
      label="Address"
      name="mb_address"
      rules={[{ required: true, message: "Please input branch address" }]}
    >
      <Input.TextArea
        placeholder="Enter branch address"
        autoSize={{ minRows: 2, maxRows: 4 }}
      />
    </Form.Item>

    <Row gutter={16}>
      {/* City */}
      <Col span={12}>
        <Form.Item
          label="City"
          name="mb_city"
          rules={[{ required: true, message: "Please select a city" }]}
        >
          <Select
            placeholder="Select a city"
            options={cityOptions}
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
          />
        </Form.Item>
      </Col>

      {/* Province */}
      <Col span={12}>
        <Form.Item
          label="Province"
          name="mb_province"
          rules={[{ required: true, message: "Please select province" }]}
        >
          <Select
            placeholder="Select province"
            options={provinceOptions}
            showSearch
            optionFilterProp="children"
          />
        </Form.Item>
      </Col>
    </Row>

    <Row gutter={16}>
      {/* Phone */}
      <Col span={12}>
        <Form.Item
          label="Phone"
          name="mb_phone"
          rules={[
            { required: true, message: "Phone number is required" },
            { pattern: /^[0-9]{8,15}$/, message: "Phone number must be 8–15 digits" },
          ]}
        >
          <Input
            placeholder="Enter phone number"
            maxLength={15}
            onKeyPress={(e) => {
              if (!/[0-9]/.test(e.key)) {
                e.preventDefault();
              }
            }}
          />
        </Form.Item>
      </Col>

      {/* Branch Status */}
      <Col span={12}>
        <Form.Item
          name="mb_status"
          label="Status"
          valuePropName="checked"
          initialValue={true}
        >
          <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
        </Form.Item>
      </Col>
    </Row>

    {/* Branch Images */}
    <Form.Item label="Branch Images">
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
                    getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
                    rules={[{ required: true, message: "Please upload image" }]}
                    style={{ marginBottom: 0 }}
                  >
                    <Upload
                      beforeUpload={() => false}
                      listType="picture-card"
                      maxCount={1}
                      onPreview={handlePreview}
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
                    rules={[{ required: true, message: "Please input description" }]}
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

                {/* Delete Button */}
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



{/* Create Modal */}
<Modal
  title="Create Branch"
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
    <Row gutter={16}>
      {/* Branch Name */}
      <Col span={12}>
        <Form.Item
          label="Branch Name"
          name="mb_name"
          rules={[{ required: true, message: "Please input branch name" }]}
        >
          <Input placeholder="Enter branch name" />
        </Form.Item>
      </Col>

      {/* Postal Code */}
      <Col span={12}>
        <Form.Item
          label="Postal Code"
          name="mb_postal_code"
          rules={[
            { required: true, pattern: /^\d{5}$/, message: "Postal code must be 5 digits" },
          ]}
        >
          <Input type="number" placeholder="Enter postal code" />
        </Form.Item>
      </Col>

    </Row>

    {/* Address (full width) */}
    <Form.Item label="Address" name="mb_address" rules={[{ required: true, message: "Please input branch address" }]}>
      <Input.TextArea
        placeholder="Enter branch address"
        autoSize={{ minRows: 2, maxRows: 4 }}
      />
    </Form.Item>

    <Row gutter={16}>
      {/* City */}
      <Col span={12}>
        <Form.Item
          label="City"
          name="mb_city"
          rules={[{ required: true, message: "Please select a city" }]}
        >
          <Select
            placeholder="Select a city"
            options={cityOptions}
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
          />
        </Form.Item>
      </Col>


      {/* Province */}
      <Col span={12}>
        <Form.Item 
          label="Province" 
          name="mb_province" 
          rules={[{ required: true, message: "Please select province" }]}
        >
          <Select 
            placeholder="Select province"
            options={provinceOptions}
            showSearch
            optionFilterProp="children"
          />
        </Form.Item>
      </Col>
    </Row>

    <Row gutter={16}>
      {/* Phone */}
      <Col span={12}>
        <Form.Item
          label="Phone"
          name="mb_phone"
          rules={[
            { required: true, message: "Phone number is required" },
            { pattern: /^[0-9]{8,15}$/, message: "Phone number must be 8–15 digits" },
          ]}
        >
          <Input
            placeholder="Enter phone number"
            maxLength={15}
            onKeyPress={(e) => {
              if (!/[0-9]/.test(e.key)) {
                e.preventDefault();
              }
            }}
          />
        </Form.Item>
      </Col>


      {/* Branch Status */}
      <Col span={12}>
        <Form.Item
          name="mb_status"
          label="Status"
          valuePropName="checked"
          initialValue={true}
        >
          <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
        </Form.Item>
      </Col>
    </Row>

    {/* Branch Images */}
    <Form.Item label="Branch Images">
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
                    getValueFromEvent={(e) =>
                      Array.isArray(e) ? e : e?.fileList
                    }
                    rules={[{ required: true, message: "Please upload image" }]}
                    style={{ marginBottom: 0 }}
                  >
                    <Upload
                      beforeUpload={() => false}
                      listType="picture-card"
                      maxCount={1}
                      onPreview={handlePreview}
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
                    <Input.TextArea
                      autoSize={{ minRows: 4, maxRows: 4 }}
                      placeholder="Description"
                    />
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
</Modal>


{/* Modal preview gambar */}
<Modal
  open={previewOpen}
  title={previewTitle}
  footer={null}
  onCancel={() => setPreviewOpen(false)}
  zIndex={1500}
>
  <img alt="preview" style={{ width: "100%" }} src={previewImage} />
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
  <p>This branch will be permanently deleted. This action cannot be undone.</p>
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
    Are you sure you want to delete <b>{selectedRowKeys.length}</b> selected branches? This action cannot be undone.
  </p>
</Modal>

      </Card>
    </Column>
  );
};

// =========================
// Main Component
// =========================
const BranchList: React.FC<
  BranchListProps
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

export default BranchList;