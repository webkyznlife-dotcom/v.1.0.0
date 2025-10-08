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
  Form,
  Input,
  Col,
  Row,
  message,
  InputNumber,
  Select,
  Upload,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { DeleteOutlined, UploadOutlined, CloseOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useNotification } from "../../../context/NotificationContext";

const { Title } = Typography;

// =========================
// Types
// =========================
interface ProgramManagementClassesPageProps {
  isSidebarOpen: boolean;
  isMobile: boolean;
  toggleSidebar: () => void;
}

export interface ProgramImage {
  id: number;              // sebelumnya mpi_id
  image: string;           // sebelumnya mpi_image
  description: string;     // sebelumnya mpi_description
  status: boolean;         // sebelumnya mpi_status
  created_at?: string;
  updated_at?: string;
}

export interface MstProgramImages {
  mpi_id: number;
  mp_id: number;
  mpi_image: string;
  mpi_description: string;
  mpi_status: boolean;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}

export interface ProgramCategory {
  id: number;              // sebelumnya mpc_id
  name: string;            // sebelumnya mpc_name
}

export interface ProgramAge {
  id: number;              // sebelumnya mpa_id
  min: number;             // sebelumnya mpa_min
  max: number;             // sebelumnya mpa_max
}

export interface ProgramActivityCategory {
  id: number;              // sebelumnya mpac_id
  name: string;            // sebelumnya mpac_name
}


export interface ProgramClass {
  mp_id: number;
  mp_name: string;
  mp_description?: string;
  mp_status?: boolean;
  mp_header_image?: string;
  mp_thumbnail?: string;
  created_at?: string;
  updated_at?: string;

  // Relasi
  MstProgramImages?: MstProgramImages[];
  MstProgramActivityCategory?: any;
  MstProgramCategory?: any;
  MstProgramAge?: any;
  
  images?: MstProgramImages[];
  mp_category?: ProgramCategory;
  mp_age_id?: ProgramAge;
  mp_activity_category?: ProgramActivityCategory;
}

export interface ProgramClassCategory {
  mpc_id: number;
  mpc_name: string;
  mpc_status?: boolean; // default true
}

export interface ProgramClassActivityCategory {
  mpac_id: number;      // ID dari tabel
  mpac_name: string;    // Nama kategori
  mpac_status?: boolean; // Status aktif atau tidak, opsional
}

export interface ProgramClassAgeGroups {
  mpa_id: number;      // ID dari tabel
  mpa_min: number;     // Usia minimum
  mpa_max: number;     // Usia maksimum
  mpa_status?: boolean; // Status aktif atau tidak, opsional
}

interface ImageItem {
  file: File | null;
  description: string;
  status: boolean;
}

interface ProgramPayload {
  mp_name: string;
  mp_description: string;
  mp_status: boolean;
  mp_category_id: number | null;
  mp_age_id: number | null;
  mp_activity_category_id: number | null;
  mp_header_image: File | null;
  mp_thumbnail: File | null;
  images: ImageItem[];
}


// =========================
// Table Card
// =========================
const DataTableCard: React.FC = () => {

  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();

  // States
  const [data, setData] = useState<ProgramClass[]>([]);
  const [dataClassCategory, setDataClassCategory] = useState<ProgramClassCategory[]>([]);
  const [dataClassActivityCategory, setDataClassActivityCategory] = useState<ProgramClassActivityCategory[]>([]);
  const [dataClassAgeGroups, setDataClassAgeGroups] = useState<ProgramClassAgeGroups[]>([]);

  const [pageSize, setPageSize] = useState(5);
  const [searchText, setSearchText] = useState("");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<ProgramClass | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);

  // Row selection
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const API_URL = process.env.REACT_APP_API_URL;
  const API_IMAGE_URL = process.env.REACT_APP_API_IMAGE_URL;

  const [btnLoading, setBtnLoading] = useState(false);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>('');
  const [previewTitle, setPreviewTitle] = useState<string>('');

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
        `${API_URL}/admin/v1/program-management/classes`,
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

  const fetchDataClassCategory = async () => {
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

        const categories: ProgramClassCategory[] = response.data.data
          .filter((item: any) => item.mpc_status) // hanya true
          .map((item: any) => ({
            mpc_id: item.mpc_id,
            mpc_name: item.mpc_name,
            mpc_status: item.mpc_status,
          }));

        setDataClassCategory(categories);

      } else {
        showError("Failed to fetch program ages")
      }
    } catch (error) {
      console.error(error);
      showError("Error fetching program ages from server")
    }
  };  

  const fetchDataClassActivityCategory = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      showError("Please login first")
      navigate("/login");
      return;
    }

    try {
      const response = await axios.get(
        `${API_URL}/admin/v1/program-management/activity-categories`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {

        const activitycategories: ProgramClassActivityCategory[] = response.data.data
          .filter((item: any) => item.mpac_status) // hanya true
          .map((item: any) => ({
            mpac_id: item.mpac_id,
            mpac_name: item.mpac_name,
            mpac_status: item.mpac_status,
          }));

        setDataClassActivityCategory(activitycategories);

      } else {
        showError("Failed to fetch program ages")
      }
    } catch (error) {
      console.error(error);
      showError("Error fetching program ages from server")
    }
  };

  const fetchDataClassAgeGroups = async () => {
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

        const agegroups: ProgramClassAgeGroups[] = response.data.data
          .filter((item: any) => item.mpa_status) // hanya true
          .map((item: any) => ({
            mpa_id: item.mpa_id,
            mpa_min: item.mpa_min,
            mpa_max: item.mpa_max,
            mpa_status: item.mpa_status,
          }));

        setDataClassAgeGroups(agegroups);

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
    fetchDataClassCategory();
    fetchDataClassActivityCategory();
    fetchDataClassAgeGroups();
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
        `${API_URL}/admin/v1/program-management/classes/delete/${deleteId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        fetchData(); // refresh data tabel
        setSelectedRowKeys([]); // ✅ otomatis deselect all
        showSuccess("Program deleted successfully");
        setDeleteId(null);
        setIsDeleteOpen(false);
      } else {
        showError(response.data.message || "Failed to delete program");
      }
    } catch (error: any) {
      console.error("Delete failed:", error);
      showError(error.response?.data?.message || "Error deleting program");
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
    if (selectedRowKeys.length === 0) return;

    try {
      const token = localStorage.getItem("token"); // jika pakai auth
      if (!token) {
        message.warning("Please login first");
        return;
      }

      const response = await axios.post(
        `${API_URL}/admin/v1/program-management/classes/delete-multiple`,
        { mp_ids: selectedRowKeys },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        fetchData(); // refresh tabel
        setSelectedRowKeys([]); // ✅ deselect setelah berhasil
        setIsBulkDeleteOpen(false);
        showSuccess("Selected programs deleted successfully");
      } else {
        showError(response.data.message || "Failed to delete selected programs");
      }
    } catch (error: any) {
      console.error("Bulk delete failed:", error);
      showError(error.response?.data?.message || "Error deleting selected programs");
    }
  };


    // Edit
  const handleEdit = (record: ProgramClass) => {
    setEditingRow(record);
    setIsModalOpen(true);
    
    form.setFieldsValue({
      mp_name: record.mp_name,
      mp_description: record.mp_description,
      mp_status: record.mp_status === true,

      mp_category: { id: record.MstProgramCategory?.mpc_id },
      mp_activity_category: { id: record.MstProgramActivityCategory?.mpac_id },
      mp_age_id: { id: record.MstProgramAge?.mpa_id },

      // Header Image
      mp_header_image: record.mp_header_image
        ? [
            {
              uid: "-1",
              name: record.mp_header_image,
              status: "done",
              url: `${API_IMAGE_URL}/uploads/program/header/${record.mp_header_image}`,
            },
          ]
        : [],

      // Thumbnail
      mp_thumbnail: record.mp_thumbnail
        ? [
            {
              uid: "-2",
              name: record.mp_thumbnail,
              status: "done",
              url: `${API_IMAGE_URL}/uploads/program/thumbnail/${record.mp_thumbnail}`,
            },
          ]
        : [],

      images: record.MstProgramImages?.map((img: any) => ({
    file: [
      {
        uid: img.mpi_id?.toString(),
        name: img.mpi_image || `image-${img.mpi_id}`,
        status: "done",
        url: `${API_IMAGE_URL}/uploads/program/images/${img.mpi_image}`,
      },
    ],
    existingFileName: img.mpi_image, // ⬅️ penting
    description: img.mpi_description,
    status: img.mpi_status === true,
  })) || [],

        
    });
  };

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
      formData.append("mp_name", values.mp_name?.trim() || "");
      formData.append("mp_description", values.mp_description || "");
      formData.append("mp_status", values.mp_status ? "true" : "false");

      if (values.mp_category?.id) formData.append("mp_category_id", values.mp_category.id);
      if (values.mp_activity_category?.id) formData.append("mp_activity_category_id", values.mp_activity_category.id);
      if (values.mp_age_id?.id) formData.append("mp_age_id", values.mp_age_id.id);

      // Header Image
      if (values.mp_header_image?.length > 0) {
        formData.append("mp_header_image", values.mp_header_image[0].originFileObj);
      }

      // Thumbnail
      if (values.mp_thumbnail?.length > 0) {
        formData.append("mp_thumbnail", values.mp_thumbnail[0].originFileObj);
      }


      values.images?.forEach((img: any, index: number) => {
        // Jika user memilih file baru, pakai file baru
        if (img.file?.[0]?.originFileObj) {
          formData.append("mpi_images", img.file[0].originFileObj);
          console.log("👉 Append NEW file:", img.file[0].originFileObj.name);
        } 
        // Jika user tidak mengganti file, tetap pakai file lama
        else if (img.existingFileName) {
          formData.append("mpi_images_existing", img.existingFileName);
          console.log("👉 Append OLD file:", img.existingFileName);
        }

        // Deskripsi & status tetap dikirim
        formData.append(`mpi_description_${index}`, img.description || "");
        console.log(`👉 Append Description [${index}]:`, img.description || "");

        formData.append(`mpi_status_${index}`, img.status ? "true" : "false");
        console.log(`👉 Append Status [${index}]:`, img.status ? "true" : "false");
      });


      // Token
      const token = localStorage.getItem("token");

      await axios.put(
        `${API_URL}/admin/v1/program-management/classes/update/${editingRow.mp_id}`,
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
      showSuccess("Class updated successfully");
    } catch (error: any) {
      console.error("Update failed:", error);
      showError(error.response?.data?.message || "Error updating Class");
    } finally {
      setBtnLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      setBtnLoading(true); // 🚀 mulai loading

      const values = await form.validateFields();
      const token = localStorage.getItem("token");
      if (!token) {
        showError("Please login first");
        return;
      }

      const formData = new FormData();

      formData.append("mp_name", values.mp_name);
      formData.append("mp_description", values.mp_description);
      formData.append("mp_status", (values.mp_status ?? true).toString());
      formData.append("mp_category_id", values.mp_category?.id || "");
      formData.append("mp_age_id", values.mp_age_id?.id || "");
      formData.append("mp_activity_category_id", values.mp_activity_category?.id || "");

      // Header image & thumbnail
      if (values.mp_header_image?.[0]?.originFileObj) {
        formData.append("mp_header_image", values.mp_header_image[0].originFileObj);
      }
      if (values.mp_thumbnail?.[0]?.originFileObj) {
        formData.append("mp_thumbnail", values.mp_thumbnail[0].originFileObj);
      }

      // Multiple images
      values.images?.forEach((img: any, index: number) => {
        if (img.file?.[0]?.originFileObj) {
          formData.append("mpi_images", img.file[0].originFileObj);
          formData.append(`mpi_description_${index}`, img.description || "");
          formData.append(`mpi_status_${index}`, (img.status ?? true).toString());
        }
      });

      const response = await axios.post(
        `${API_URL}/admin/v1/program-management/classes/create`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        showSuccess("Class Program created successfully!");
        fetchData();
        setIsCreateModalOpen(false);
        form.resetFields();
      } else {
        showError(response.data.message || "Failed to create Class Program");
      }
    } catch (err: any) {
      console.error(err);
      showError(err.response?.data?.message || "Error creating Class Program");
    } finally {
      setBtnLoading(false); // ✅ loading berhenti apapun hasilnya
    }
  };

  // Table columns
  const columns: ColumnsType<ProgramClass> = [
    {
      title: "ID",
      dataIndex: "mp_id",
      key: "mp_id",
      width: 60,
    },
    {
      title: "Program Name",
      dataIndex: "mp_name",
      key: "mp_name",
    },
    {
      title: "Category",
      dataIndex: ["MstProgramCategory", "mpc_name"],
      key: "mp_category",
      render: (_, record) => record.MstProgramCategory?.mpc_name || "-",
    },
    {
      title: "Age",
      dataIndex: ["MstProgramAge", "mpa_min"], // bisa gabungkan min-max
      key: "mp_age",
      render: (_, record) =>
        record.MstProgramAge
          ? `${record.MstProgramAge.mpa_min} - ${record.MstProgramAge.mpa_max}`
          : "-",
    },
    {
      title: "Activity Category",
      dataIndex: ["MstProgramActivityCategory", "mpac_name"],
      key: "mp_activity_category",
      render: (_, record) =>
        record.MstProgramActivityCategory?.mpac_name || "-",
    },
    {
      title: "Description",
      dataIndex: "mp_description",
      key: "mp_description",
    },
    {
      title: "Status",
      dataIndex: "mp_status",
      key: "mp_status",
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
          <Button type="link" danger onClick={() => handleDelete(record.mp_id!)}>
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
  const filteredData = data.filter(
    (item) =>
      item.mp_name?.toLowerCase().includes(searchText.toLowerCase()) ||
      item.mp_activity_category?.name
        ?.toLowerCase()
        .includes(searchText.toLowerCase())
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
              placeholder="Search program / activity"
              allowClear
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 200 }}
            />
            <Button
              onClick={() =>
                setSelectedRowKeys(filteredData.map((item) => item.mp_id))
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
        <Table<ProgramClass>
          rowSelection={rowSelection}
          columns={columns}
          dataSource={filteredData}
          rowKey="mp_id"   // ✅ ganti pakai mp_id dari API
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
          title="Edit Classes"
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
            {/* Classes Name */}
            <Form.Item
              label="Classes Name"
              name="mp_name"
              rules={[{ required: true, message: "Please input classes name" }]}
            >
              <Input placeholder="Enter classes name" />
            </Form.Item>

            {/* Description */}
            <Form.Item
              label="Description"
              name="mp_description"
              rules={[{ required: true, message: "Please input description" }]}
            >
              <Input.TextArea rows={3} placeholder="Enter description" />
            </Form.Item>

            {/* Header & Thumbnail */}
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={12}>
                <Form.Item
                  name="mp_header_image"
                  label="Header Image"
                  valuePropName="fileList"
                  getValueFromEvent={(e) => Array.isArray(e) ? e : e?.fileList}
                  rules={[{ validator: (_, value) => value && value.length > 0 ? Promise.resolve() : Promise.reject(new Error("Please upload header image")) }]}
                >
                  <Upload beforeUpload={() => false} listType="picture-card" maxCount={1} onPreview={handlePreview}>
                    <div>
                      <UploadOutlined />
                      <div style={{ marginTop: 8 }}>Upload</div>
                    </div>
                  </Upload>
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="mp_thumbnail"
                  label="Thumbnail"
                  valuePropName="fileList"
                  getValueFromEvent={(e) => Array.isArray(e) ? e : e?.fileList}
                  rules={[{ validator: (_, value) => value && value.length > 0 ? Promise.resolve() : Promise.reject(new Error("Please upload thumbnail image")) }]}
                >
                  <Upload beforeUpload={() => false} listType="picture-card" maxCount={1} onPreview={handlePreview}>
                    <div>
                      <UploadOutlined />
                      <div style={{ marginTop: 8 }}>Upload</div>
                    </div>
                  </Upload>
                </Form.Item>
              </Col>
            </Row>

            {/* Images dynamic */}
            <Form.Item label="Images">
              <Form.List name="images" 
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

            {/* Category & Activity Category */}
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name={["mp_category", "id"]}
                  label="Category"
                  rules={[{ required: true, message: "Please select a category" }]}
                >
                  <Select placeholder="Select category">
                    {dataClassCategory.map((cat) => (
                      <Select.Option key={cat.mpc_id} value={cat.mpc_id}>{cat.mpc_name}</Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name={["mp_activity_category", "id"]}
                  label="Activity Category"
                  rules={[{ required: true, message: "Please select an activity category" }]}
                >
                  <Select placeholder="Select activity category">
                    {dataClassActivityCategory.map((cat) => (
                      <Select.Option key={cat.mpac_id} value={cat.mpac_id}>{cat.mpac_name}</Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            {/* Age Group & Status */}
            <Row gutter={16}>
              <Col span={6}>
                <Form.Item
                  name={["mp_age_id", "id"]}
                  label="Age Group"
                  rules={[{ required: true, message: "Please select an age group" }]}
                >
                  <Select placeholder="Select age group">
                    {dataClassAgeGroups.map((cat) => (
                      <Select.Option key={cat.mpa_id} value={cat.mpa_id}>{`${cat.mpa_min} - ${cat.mpa_max}`}</Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col span={6}>
                <Form.Item
                  name="mp_status"
                  label="Status"
                  valuePropName="checked"
                  initialValue={true}
                >
                  <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>


        {/* Create Modal */}
        <Modal
          title="Create Classes"
          open={isCreateModalOpen}
          onCancel={() => setIsCreateModalOpen(false)}
          centered
          width={800}
          destroyOnClose
          footer={[
            <Button key="cancel" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>,
            <Button
              key="create"
              type="primary"
              loading={btnLoading}   // ✅ tombol ada spinner
              onClick={handleCreate}
            >
              Create
            </Button>,
          ]}
        >
          <Form form={form} layout="vertical">
            {/* Category Name */}
            <Form.Item
              label="Classes Name"
              name="mp_name"
              rules={[{ required: true, message: "Please input classes name" }]}
            >
              <Input placeholder="Enter classes name" />
            </Form.Item>

            {/* Description */}
            <Form.Item
              label="Description"
              name="mp_description"
              rules={[{ required: true, message: "Please input description" }]}
            >
              <Input.TextArea rows={3} placeholder="Enter description" />
            </Form.Item>

            {/* Additional Images */}
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={12}>
                <Form.Item
                  name="mp_header_image"
                  label="Header Image"
                  valuePropName="fileList"
                  getValueFromEvent={(e) => Array.isArray(e) ? e : e?.fileList}
                  rules={[
                    {
                      validator: (_, value) =>
                        value && value.length > 0
                          ? Promise.resolve()
                          : Promise.reject(new Error("Please upload header image")),
                    },
                  ]}
                >
                  <Upload beforeUpload={() => false} listType="picture-card" maxCount={1}>
                    <div>
                      <UploadOutlined />
                      <div style={{ marginTop: 8 }}>Upload</div>
                    </div>
                  </Upload>
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="mp_thumbnail"
                  label="Thumbnail"
                  valuePropName="fileList"
                  getValueFromEvent={(e) => Array.isArray(e) ? e : e?.fileList}
                  rules={[
                    {
                      validator: (_, value) =>
                        value && value.length > 0
                          ? Promise.resolve()
                          : Promise.reject(new Error("Please upload thumbnail image")),
                    },
                  ]}
                >
                  <Upload beforeUpload={() => false} listType="picture-card" maxCount={1}>
                    <div>
                      <UploadOutlined />
                      <div style={{ marginTop: 8 }}>Upload</div>
                    </div>
                  </Upload>
                </Form.Item>
              </Col>
            </Row>
          

            {/* Images */}
            <Form.Item label="Images">
              <Form.List name="images">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <Row
                        key={key}
                        gutter={12}
                        align="top"
                        style={{ marginBottom: 16 }}
                      >
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
                            <Upload beforeUpload={() => false} listType="picture-card" maxCount={1}>
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
                              placeholder="Description"
                              autoSize={{ minRows: 4, maxRows: 4 }}
                            />
                          </Form.Item>
                        </Col>

                        {/* Status */}
                        <Col span={4}>
                          <Form.Item
                            {...restField}
                            name={[name, "status"]}
                            valuePropName="checked"
                            initialValue={true}   // default Active
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

            {/* Category & Activity Category */}
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name={["mp_category", "id"]}
                  label="Category"
                  rules={[{ required: true, message: "Please select a category" }]}
                >
                  <Select placeholder="Select category">
                    {dataClassCategory.map((cat) => (
                      <Select.Option key={cat.mpc_id} value={cat.mpc_id}>
                        {cat.mpc_name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name={["mp_activity_category", "id"]}
                  label="Activity Category"
                  rules={[{ required: true, message: "Please select an activity category" }]}
                >
                  <Select placeholder="Select activity category">
                    {dataClassActivityCategory.map((cat) => (
                      <Select.Option key={cat.mpac_id} value={cat.mpac_id}>
                        {cat.mpac_name}
                      </Select.Option>
                    ))}                    
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            {/* Age Group */}
            <Row gutter={16}>
              <Col span={6}>
                <Form.Item
                  name={["mp_age_id", "id"]}
                  label="Age Group"
                  rules={[{ required: true, message: "Please select an age group" }]}
                >
                  <Select placeholder="Select age group">
                    {dataClassAgeGroups.map((cat) => (
                      <Select.Option key={cat.mpa_id} value={cat.mpa_id}>
                        {`${cat.mpa_min} - ${cat.mpa_max}`}
                      </Select.Option>
                    ))}                        
                  </Select>
                </Form.Item>
              </Col>

              {/* Status */}
              <Col span={6}>
                <Form.Item
                  name="mp_status"
                  label="Status"
                  valuePropName="checked"
                  initialValue={true} // default true
                >
                  <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
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
            Are you sure you want to delete <b>{selectedRowKeys.length}</b> selected
            categories? This action cannot be undone.
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
const ProgramManagementClassesPage: React.FC<
  ProgramManagementClassesPageProps
> = ({ isSidebarOpen, isMobile, toggleSidebar }) => {
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

export default ProgramManagementClassesPage;