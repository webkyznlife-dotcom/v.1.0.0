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
interface LinkClassesPageProps {
  isSidebarOpen: boolean;
  isMobile: boolean;
  toggleSidebar: () => void;
}

export interface BranchProgram {
  mbp_id: number;
  mb_id: number;
  mp_id: number;
  mbp_status: boolean;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
  MstBranch: Branch;
  MstProgram: Program;
}

export interface Program {
  mp_id: number;
  mp_name: string;
  mp_description: string;
  mp_category_id: number;
  mp_age_id: number;
  mp_activity_category_id: number;
  mp_status: boolean;
  mp_header_image: string | null;
  mp_thumbnail: string | null;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
  mp_slug: string;
  mpt_id: number;
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
  const [data, setData] = useState<BranchProgram[]>([]);
  const [dataBranch, setDataBranch] = useState<Branch[]>([]);
  const [dataProgram, setDataProgram] = useState<Program[]>([]);
  const [pageSize, setPageSize] = useState(5);
  const [searchText, setSearchText] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<BranchProgram | null>(null);
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
        `${API_URL}/admin/v1/program-management/link-classes`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setData(response.data.data);
      } else {
        showError("Failed to fetch branch program");
      }
    } catch (error) {
      console.error(error);
      showError("Error fetching branch program from server");
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

  const fetchDataProgram = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      showError("Please login first");
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
        setDataProgram(response.data.data);
      } else {
        showError("Failed to fetch program");
      }
    } catch (error) {
      console.error(error);
      showError("Error fetching program from server");
    }
  };
  

  useEffect(() => {
    fetchData();
    fetchDataBranch();
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
          `${API_URL}/admin/v1/program-management/link-classes/delete/${deleteId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data.success) {
          fetchData();
          showSuccess("Branch program deleted successfully!");
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
        `${API_URL}/admin/v1/program-management/link-classes/delete-multiple`,
        { mbp_ids: selectedRowKeys },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        fetchData();
        setSelectedRowKeys([]);
        setIsBulkDeleteOpen(false);
        showSuccess("Selected branch program deleted successfully!");
      } else {
        showError(response.data.message || "Failed to delete selected branch program");
      }
    } catch (error: any) {
      console.error("Bulk delete failed:", error);
      showError(error.response?.data?.message || "Error deleting selected program");
    }
  };

  // Edit
  const handleEdit = (record: BranchProgram) => {
    setEditingRow(record);
    setIsModalOpen(true);

    editForm.setFieldsValue({
      mb_id: record.mb_id ?? null,        // isi branch
      mp_id: record.mp_id ?? null,        // isi program
      mbp_status: record.mbp_status ?? true, // isi status default true
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
        mb_id: values.mb_id,                 // branch ID
        mp_id: values.mp_id,                 // program ID
        mbp_status: values.mbp_status ?? true, // default true
      };

      setBtnLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        message.error("Please login first");
        navigate("/login");
        return;
      }

      const response = await axios.put(
        `${API_URL}/admin/v1/program-management/link-classes/update/${editingRow.mbp_id}`, // pakai mbp_id dari data link
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        showSuccess("Program assignment updated successfully");
        setIsModalOpen(false);
        editForm.resetFields();
        fetchData(); // pastikan fetchData mengambil link-classes terbaru
      } else {
        showError(response.data.message || "Failed to update program assignment");
      }
    } catch (error: any) {
      console.error("Update failed:", error);
      showError(error.response?.data?.message || "Error updating program assignment");
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
      if (!values.mp_id) {
        showError("Program is required!");
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        message.error("Please login first");
        navigate("/login");
        return;
      }

      const response = await axios.post(
        `${API_URL}/admin/v1/program-management/link-classes/create`,
        {
          mb_id: values.mb_id,               // ID branch
          mp_id: values.mp_id,               // ID program
          mbp_status: values.mbp_status ?? true, // default true
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        showSuccess("Branch program assigned to branch successfully");
        createForm.resetFields();
        setIsCreateModalOpen(false);
        fetchData(); // pastikan fetchData mengambil link-classes terbaru
      } else {
        showError(response.data.message || "Failed to assign branch program");
      }
    } catch (error: any) {
      console.error("Create failed:", error);
      if (error.response?.data?.message) {
        showError(error.response.data.message);
      } else {
        showError("Error assigning branch program. Please try again");
      }
    }
  };

  // =========================
  // Table columns
  // =========================
  const columns: ColumnsType<BranchProgram> = [
    { 
      title: "ID", 
      dataIndex: "mbp_id", 
      key: "mbp_id", 
      width: 60 
    },
    { 
      title: "Branch", 
      dataIndex: ["MstBranch", "mb_name"], 
      key: "branch_name" 
    },
    { 
      title: "Program Name", 
      dataIndex: ["MstProgram", "mp_name"], 
      key: "mp_name" 
    },
    {
      title: "Status",
      dataIndex: "mbp_status",
      key: "mbp_status",
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
          <Button type="link" danger onClick={() => handleDelete(record.mbp_id)}>
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
      (item.MstProgram?.mp_name?.toLowerCase().includes(searchText.toLowerCase()) ?? false)
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
              placeholder="Search program or branch"
              allowClear
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 200 }}
            />
            <Button
              onClick={() =>
                setSelectedRowKeys(filteredData.map((item) => item.mbp_id))
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
        <Table<BranchProgram>
          rowSelection={rowSelection}
          columns={columns}
          dataSource={filteredData}
          rowKey="mbp_id" // diganti dari "mbf_id" menjadi "mbp_id"
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
          title="Edit Program Assignment"
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
              name="mp_id"
              label="Program *"
              rules={[{ required: true, message: "Program is required!" }]}
            >
              <Select
                placeholder="Select program"
                showSearch
                allowClear
                optionFilterProp="children"
              >
                {dataProgram.map((program) => (
                  <Select.Option key={program.mp_id} value={program.mp_id}>
                    {program.mp_name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="mbp_status"
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
          title="Assign Program to Branch"
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

            {/* Select Program */}
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="mp_id"
                  label="Program *"
                  rules={[{ required: true, message: "Program is required!" }]}
                >
                  <Select 
                    placeholder="Select program"
                    showSearch
                    optionFilterProp="children"
                    allowClear  
                  >
                    {dataProgram.map((program) => (
                      <Select.Option key={program.mp_id} value={program.mp_id}>
                        {program.mp_name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            {/* Status */}
            <Form.Item
              name="mbp_status"
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
const LinkClassesPage: React.FC<LinkClassesPageProps> = ({ isSidebarOpen, isMobile }) => {
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

export default LinkClassesPage;