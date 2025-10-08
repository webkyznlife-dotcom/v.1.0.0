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
interface LinkFacilitiesPageProps {
  isSidebarOpen: boolean;
  isMobile: boolean;
  toggleSidebar: () => void;
}

export interface FacilityDetail {
  mf_id: number;
  mf_name: string;
  mf_icon: string | null;
}

export interface Facility {
  mbf_id: number;
  mb_id: number;
  mf_id: number;
  mbf_icon: string | null;
  mbf_status: boolean;
  created_at: string | null;
  updated_at: string | null;
  MstBranch: Branch;
  MstFacility: FacilityDetail;
}


export interface MstFacility {
  mf_id: number;
  mf_name: string;
  mf_description: string;
  mf_icon: string;
  mf_status: boolean;
  created_at: string;   // pakai string kalau langsung dari API (ISO date)
  updated_at: string;   // bisa juga Date kalau kamu convert manual
}

export interface Branch {
  mb_id: number;
  mb_name: string;
  mb_address: string;
  mb_city: string;
  mb_province: string;
  mb_postal_code: string;
  mb_phone: string;
  mb_status: boolean;
  created_at: string | null;
  updated_at: string | null;
}


// =========================
// Table Card
// =========================
const DataTableCard: React.FC = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();

  // =========================
  // State
  // =========================
  const [data, setData] = useState<Facility[]>([]);
  const [dataBranch, setDataBranch] = useState<Branch[]>([]);
  const [dataFacilities, setDataFacilities] = useState<MstFacility[]>([]);
  const [pageSize, setPageSize] = useState(5);
  const [searchText, setSearchText] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<Facility | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL;

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
      const response = await axios.get(
        `${API_URL}/admin/v1/facilities-management/link-facilities/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

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

  const fetchDataFacilities = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      showError("Please login first");
      navigate("/login");
      return;
    }

    try {
      const response = await axios.get(
        `${API_URL}/admin/v1/facilities-management/facilities/for-select`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setDataFacilities(response.data.data);
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
    fetchDataFacilities();
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
          `${API_URL}/admin/v1/facilities-management/link-facilities/delete/${deleteId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data.success) {
          fetchData();
          showSuccess("Facility deleted successfully!");
        } else {
          showError(response.data.message || "Failed to delete facility");
        }
      } catch (error: any) {
        console.error("Delete failed:", error);
        showError(error.response?.data?.message || "Error deleting facility");
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
      message.error("Please select at least one facility");
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/admin/v1/facilities-management/link-facilities/delete-multiple`,
        { mbf_ids: selectedRowKeys },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        fetchData();
        setSelectedRowKeys([]);
        setIsBulkDeleteOpen(false);
        showSuccess("Selected facilities deleted successfully!");
      } else {
        showError(response.data.message || "Failed to delete selected facilities");
      }
    } catch (error: any) {
      console.error("Bulk delete failed:", error);
      showError(error.response?.data?.message || "Error deleting selected facilities");
    }
  };

  // Edit
  const handleEdit = (record: any) => {
    setEditingRow(record);
    setIsModalOpen(true);

    editForm.setFieldsValue({
      mb_id: record.mb_id ?? null,        // isi branch
      mf_id: record.mf_id ?? null,        // isi facility
      mbf_status: record.mbf_status ?? true, // isi status default true
    });
  };

  // Open Create Modal
  const openCreateModal = () => {
    setEditingRow(null);
    createForm.resetFields();
    setIsCreateModalOpen(true);
  };

  const handleSave = async () => {
    if (!editingRow) return;

    try {
      const values = await editForm.validateFields();

      const payload = {
        mb_id: values.mb_id,               // branch ID
        mf_id: values.mf_id,               // facility ID
        mbf_status: values.mbf_status ?? true, // default true
      };

      setBtnLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        message.error("Please login first");
        navigate("/login");
        return;
      }

      const response = await axios.put(
        `${API_URL}/admin/v1/facilities-management/link-facilities/update/${editingRow.mbf_id}`, // pakai mbf_id dari data link
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        showSuccess("Facility assignment updated successfully");
        setIsModalOpen(false);
        editForm.resetFields();
        fetchData();
      } else {
        showError(response.data.message || "Failed to update facility assignment");
      }
    } catch (error: any) {
      console.error("Update failed:", error);
      showError(error.response?.data?.message || "Error updating facility assignment");
    } finally {
      setBtnLoading(false);
    }
  };


  // Create
  const handleCreate = async () => {
    try {
      const values = await createForm.validateFields();

      if (!values.mb_id) {
        showError("Branch is required!");
        return;
      }
      if (!values.mf_id) {
        showError("Facility is required!");
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        message.error("Please login first");
        navigate("/login");
        return;
      }

      const response = await axios.post(
        `${API_URL}/admin/v1/facilities-management/link-facilities/create`,
        {
          mb_id: values.mb_id,
          mf_id: values.mf_id,
          mbf_status: values.mbf_status ?? true,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        showSuccess("Facility assigned to branch successfully");
        createForm.resetFields();
        setIsCreateModalOpen(false);
        fetchData();
      } else {
        showError(response.data.message || "Failed to assign facility");
      }
    } catch (error: any) {
      console.error("Create failed:", error);
      if (error.response?.data?.message) {
        showError(error.response.data.message);
      } else {
        showError("Error assigning facility. Please try again");
      }
    }
  };

  // =========================
  // Table columns
  // =========================
  const columns: ColumnsType<Facility> = [
    { 
      title: "ID", 
      dataIndex: "mbf_id", 
      key: "mbf_id", 
      width: 60 
    },
    { 
      title: "Branch", 
      dataIndex: ["MstBranch", "mb_name"], 
      key: "branch_name" 
    },
    { 
      title: "Facility Name", 
      dataIndex: ["MstFacility", "mf_name"], 
      key: "mf_name" 
    },
    { 
      title: "Icon", 
      key: "icon",
      render: (_, record) =>
        record.MstFacility.mf_icon ? (
          <img
            src={record.MstFacility.mf_icon}
            alt="icon"
            style={{ width: 24, height: 24, objectFit: "contain" }}
          />
        ) : (
          <span style={{ color: "#999" }}>No Icon</span>
        ),
    },
    {
      title: "Status",
      dataIndex: "mbf_status",
      key: "mbf_status",
      render: (status) => (
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
          <Button type="link" danger onClick={() => handleDelete(record.mbf_id)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];


  // =========================
  // Row selection
  // =========================
  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: React.Key[]) => setSelectedRowKeys(keys),
    hideSelectAll: true,
  };

  const filteredData = data.filter(
    (item) =>
      (item.MstBranch?.mb_name?.toLowerCase().includes(searchText.toLowerCase()) ?? false) ||
      (item.MstFacility?.mf_name?.toLowerCase().includes(searchText.toLowerCase()) ?? false)
  );




  // =========================
  // Render
  // =========================
  return (
    <Column size={12}>
      <Card
        style={{ borderRadius: 14, boxShadow: "0 4px 12px rgba(0,0,0,0.06)" }}
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
              placeholder="Search facility or branch"
              allowClear
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 200 }}
            />
            <Button
              onClick={() =>
                setSelectedRowKeys(filteredData.map((item) => item.mbf_id))
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
            <Button type="primary" onClick={openCreateModal}>
              + Create
            </Button>
          </div>
        </div>

        {/* Table */}
        <Table<Facility>
          rowSelection={rowSelection}
          columns={columns}
          dataSource={filteredData}
          rowKey="mbf_id" // diganti dari "mf_id" menjadi "mbf_id"
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
          title="Edit Facility Assignment"
          open={isModalOpen}
          onOk={handleSave}
          onCancel={() => setIsModalOpen(false)}
          okText="Update"
          cancelText="Cancel"
          centered
          destroyOnClose
        >
          <Form form={editForm} layout="vertical">
            <Form.Item
              name="mb_id"
              label="Branch *"
              rules={[{ required: true, message: "Branch is required!" }]}
            >
              <Select
                placeholder="Select branch"
                showSearch
                allowClear
                optionFilterProp="children"
              >
                {dataBranch.map((branch) => (
                  <Select.Option key={branch.mb_id} value={branch.mb_id}>
                    {branch.mb_name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="mf_id"
              label="Facility *"
              rules={[{ required: true, message: "Facility is required!" }]}
            >
              <Select
                placeholder="Select facility"
                showSearch
                allowClear
                optionFilterProp="children"
              >
                {dataFacilities.map((facility) => (
                  <Select.Option key={facility.mf_id} value={facility.mf_id}>
                    {facility.mf_name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="mbf_status"
              label="Status"
              valuePropName="checked"
              initialValue={true}
            >
              <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
            </Form.Item>
          </Form>
        </Modal>


        {/* Create Modal */}
        <Modal
          title="Assign Facility to Branch"
          open={isCreateModalOpen}
          onOk={handleCreate}
          onCancel={() => setIsCreateModalOpen(false)}
          okText="Create"
          cancelText="Cancel"
          centered
          destroyOnClose 
        >
          <Form form={createForm} layout="vertical">
            {/* Select Branch */}
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="mb_id"
                  label="Branch *"
                  rules={[{ required: true, message: "Branch is required!" }]}
                >
                  <Select 
                    placeholder="Select branch"
                    showSearch
                    optionFilterProp="children"
                    allowClear  
                  >
                    {dataBranch.map((branch) => (
                      <Select.Option key={branch.mb_id} value={branch.mb_id}>
                        {branch.mb_name}
                      </Select.Option>
                    ))}
                  </Select> 
                </Form.Item>
              </Col>
            </Row>

            {/* Select Facility */}
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="mf_id"
                  label="Facility *"
                  rules={[{ required: true, message: "Facility is required!" }]}
                >
                  <Select 
                    placeholder="Select facility"
                    showSearch
                    optionFilterProp="children"
                    allowClear  
                    >
                    {dataFacilities.map((facility) => (
                      <Select.Option key={facility.mf_id} value={facility.mf_id}>
                        {facility.mf_name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            {/* Status */}
            <Form.Item
              name="mbf_status"
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
            Are you sure you want to delete <b>{selectedRowKeys.length}</b> selected facilities? This action cannot be undone.
          </p>
        </Modal>
      </Card>
    </Column>
  );
};

// =========================
// Main Component
// =========================
const LinkFacilitiesPage: React.FC<LinkFacilitiesPageProps> = ({ isSidebarOpen, isMobile }) => {
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

export default LinkFacilitiesPage;