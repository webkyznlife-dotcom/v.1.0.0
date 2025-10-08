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
  DatePicker,
  TimePicker,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../../context/NotificationContext";
import dayjs from "dayjs";

const { Title } = Typography;

// =========================
// Types
// =========================
interface SchedulesPageProps {
  isSidebarOpen: boolean;
  isMobile: boolean;
  toggleSidebar: () => void;
}


export interface ISchedule {
  tpsd_id: number;
  mp_id: number;
  mb_id: number;
  mc_id: number;
  mpa_id: number;
  tpsd_date: string;             // format: YYYY-MM-DD
  tpsd_start_time: string;       // format: HH:mm:ss
  tpsd_end_time: string;         // format: HH:mm:ss
  trainer_id: number;
  tpsd_status: boolean;
  created_at: string;            // ISO date string
  updated_at: string;            // ISO date string

  MstProgram?: {
    mp_id: number;
    mp_name: string;
    mp_description?: string | null;
  };

  MstBranch?: {
    mb_id: number;
    mb_name: string;
    mb_city?: string | null;
    mb_province?: string | null;
  };

  MstCourt?: {
    mc_id: number;
    mc_name: string;
    mc_type?: string | null;
  };

  MstTrainer?: {
    trainer_id: number;
    trainer_name: string;
    trainer_speciality?: string | null;
  };

  MstProgramAge?: {
    mpa_id: number;
    mpa_min: number;
    mpa_max: number;
  };
}

export interface IProgram {
  mp_id: number;
  mp_name: string;
  mp_description?: string | null;
  mp_category_id?: number | null;
  mp_age_id?: number | null;
  mp_activity_category_id?: number | null;
  mp_status: boolean;
  mp_header_image?: string | null;
  mp_thumbnail?: string | null;
  created_at: string;   // ISO date string
  updated_at: string;   // ISO date string
  mp_slug?: string | null;
  mpt_id?: number | null;
}

export interface ICourtImage {
  mci_id: number;
  mc_id: number;
  mci_image: string;
  mci_description?: string | null;
  mci_status: boolean;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}

export interface ICourt {
  mc_id: number;
  mc_name: string;
  mc_type?: string | null;
  mc_status: boolean;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
  MstCourtImages?: ICourtImage[]; // relasi court → images
}

export interface IBranch {
  mb_id: number;
  mb_name: string;
  mb_address?: string | null;
  mb_city?: string | null;
  mb_province?: string | null;
  mb_postal_code?: string | null;
  mb_phone?: string | null;
  mb_status: boolean;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}

export interface IAgeGroup {
  mpa_id: number;
  mpa_min: number;
  mpa_max: number;
  mpa_status: boolean;
}

export interface ITrainer {
  trainer_id: number;
  trainer_name: string;
  trainer_email: string;
  trainer_phone: string;
  trainer_speciality: string;
  trainer_status: boolean;
  created_at: string;  // ISO datetime string
  updated_at: string;  // ISO datetime string
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
  const [data, setData] = useState<ISchedule[]>([]);
  const [dataBranch, setDataBranch] = useState<IBranch[]>([]);
  const [dataProgram, setDataProgram] = useState<IProgram[]>([]);
  const [dataCourt, setDataCourt] = useState<ICourt[]>([]);
  const [dataAgeGroup, setDataAgeGroup] = useState<IAgeGroup[]>([]);
  const [dataTrainer, setDataTrainer] = useState<ITrainer[]>([]);  

  const [pageSize, setPageSize] = useState(5);
  const [searchText, setSearchText] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<ISchedule | null>(null);
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
        `${API_URL}/admin/v1/schedule`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setData(response.data.data);
      } else {
        showError("Failed to fetch schedules");
      }
    } catch (error) {
      console.error(error);
      showError("Error fetching schedules from server");
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
        `${API_URL}/admin/v1/program-management/classes/for-select`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setDataProgram(response.data.data);
      } else {
        showError("Failed to fetch programs");
      }
    } catch (error) {
      console.error(error);
      showError("Error fetching programs from server");
    }
  };    

  const fetchDataCourt = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      showError("Please login first");
      navigate("/login");
      return;
    }

    try {
      const response = await axios.get(
        `${API_URL}/admin/v1/courts-management/court/for-select`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setDataCourt(response.data.data);
      } else {
        showError("Failed to fetch courts");
      }
    } catch (error) {
      console.error(error);
      showError("Error fetching courts from server");
    }
  };  

const fetchDataAgeGroup = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      showError("Please login first");
      navigate("/login");
      return;
    }

    try {
      const response = await axios.get(
        `${API_URL}/admin/v1/program-management/age-groups/for-select`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setDataAgeGroup(response.data.data);
      } else {
        showError("Failed to fetch age group");
      }
    } catch (error) {
      console.error(error);
      showError("Error fetching age group from server");
    }
  };  


const fetchDataTrainer = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      showError("Please login first");
      navigate("/login");
      return;
    }

    try {
      const response = await axios.get(
        `${API_URL}/admin/v1/trainers/for-select`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setDataTrainer(response.data.data);
      } else {
        showError("Failed to trainer");
      }
    } catch (error) {
      console.error(error);
      showError("Error fetching trainer from server");
    }
  };   


  useEffect(() => {
    fetchData();
    fetchDataBranch();
    fetchDataProgram();
    fetchDataCourt();
    fetchDataAgeGroup();
    fetchDataTrainer();
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
          `${API_URL}/admin/v1/schedule/delete/${deleteId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data.success) {
          fetchData();
          showSuccess("Schedule deleted successfully!");
        } else {
          showError(response.data.message || "Failed to delete schedule");
        }
      } catch (error: any) {
        console.error("Delete failed:", error);
        showError(error.response?.data?.message || "Error deleting schedule");
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
      message.error("Please select at least one schedule");
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/admin/v1/schedule/delete-multiple`,
        { tpsd_ids: selectedRowKeys },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        fetchData();
        setSelectedRowKeys([]);
        setIsBulkDeleteOpen(false);
        showSuccess("Selected schedule deleted successfully!");
      } else {
        showError(response.data.message || "Failed to delete selected schedule");
      }
    } catch (error: any) {
      console.error("Bulk delete failed:", error);
      showError(error.response?.data?.message || "Error deleting selected schedule");
    }
  };

  // ===== Edit =====
  const handleEdit = (record: ISchedule) => {
    setEditingRow(record);
    setIsModalOpen(true);

    editForm.setFieldsValue({
      mp_id: record.mp_id,
      mb_id: record.mb_id,
      mc_id: record.mc_id,
      tpsd_date: dayjs(record.tpsd_date),
      tpsd_start_time: dayjs(record.tpsd_start_time, "HH:mm:ss"),
      tpsd_end_time: dayjs(record.tpsd_end_time, "HH:mm:ss"),
      trainer_id: record.trainer_id,
      mpa_id: record.mpa_id,
      tpsd_status: record.tpsd_status,
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
        mp_id: values.mp_id,                                // program ID
        mb_id: values.mb_id,                                // branch ID
        mc_id: values.mc_id,                                // court ID
        tpsd_date: values.tpsd_date.format("YYYY-MM-DD"),   // pastikan pakai DatePicker
        tpsd_start_time: values.tpsd_start_time.format("HH:mm:ss"),
        tpsd_end_time: values.tpsd_end_time.format("HH:mm:ss"),
        trainer_id: values.trainer_id ?? null,
        mpa_id: values.mpa_id ?? null,
        tpsd_status: values.tpsd_status ?? true,
      };

      setBtnLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        message.error("Please login first");
        navigate("/login");
        return;
      }

      const response = await axios.put(
        `${API_URL}/admin/v1/schedule/update/${editingRow.tpsd_id}`, // pakai tpsd_id dari data schedule
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        showSuccess("Schedule updated successfully");
        setIsModalOpen(false);
        editForm.resetFields();
        fetchData();
      } else {
        showError(response.data.message || "Failed to update schedule");
      }
    } catch (error: any) {
      console.error("Update failed:", error);
      showError(error.response?.data?.message || "Error updating schedule");
    } finally {
      setBtnLoading(false);
    }
  };



  // Create Schedule
  const handleCreate = async () => {
    try {
      const values = await createForm.validateFields();

      if (!values.mp_id) {
        showError("Program is required!");
        return;
      }
      if (!values.mb_id) {
        showError("Branch is required!");
        return;
      }
      if (!values.mc_id) {
        showError("Class is required!");
        return;
      }
      if (!values.tpsd_date) {
        showError("Date is required!");
        return;
      }
      if (!values.tpsd_start_time || !values.tpsd_end_time) {
        showError("Start and End time are required!");
        return;
      }
      if (!values.trainer_id) {
        showError("Trainer is required!");
        return;
      }
      if (!values.mpa_id) {
        showError("Program Age is required!");
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        message.error("Please login first");
        navigate("/login");
        return;
      }

      const payload = {
        mp_id: values.mp_id,
        mb_id: values.mb_id,
        mc_id: values.mc_id,
        tpsd_date: values.tpsd_date.format("YYYY-MM-DD"),
        tpsd_start_time: values.tpsd_start_time.format("HH:mm"),
        tpsd_end_time: values.tpsd_end_time.format("HH:mm"),
        trainer_id: values.trainer_id,
        mpa_id: values.mpa_id,
      };

      const response = await axios.post(
        `${API_URL}/admin/v1/schedule/create`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        showSuccess("Schedule created successfully");
        createForm.resetFields();
        setIsCreateModalOpen(false);
        fetchData();
      } else {
        showError(response.data.message || "Failed to create schedule");
      }
    } catch (error: any) {
      console.error("Create failed:", error);
      if (error.response?.data?.message) {
        showError(error.response.data.message);
      } else {
        showError("Error creating schedule. Please try again");
      }
    }
  };

  // handle ketika Program dipilih
  const handleProgramChange = (value: number) => {
    const selectedProgram = dataProgram.find(p => p.mp_id === value);
    if (selectedProgram) {
      // auto set Program Age sesuai mp_age_id
      createForm.setFieldsValue({ mpa_id: selectedProgram.mp_age_id });
    }
  };  

  // handle ketika Program dipilih di Edit Form
  const handleProgramChangeEdit = (value: number) => {
    const selectedProgram = dataProgram.find(p => p.mp_id === value);
    if (selectedProgram) {
      editForm.setFieldsValue({
        mpa_id: selectedProgram.mp_age_id,
      });
    }
  };  

  // =========================
  // Table columns for Schedule
  // =========================
  const columns: ColumnsType<ISchedule> = [
    { 
      title: "ID", 
      dataIndex: "tpsd_id",   
      key: "tpsd_id", 
      width: 60 
    },
    { 
      title: "Program", 
      dataIndex: ["MstProgram", "mp_name"], 
      key: "mp_name" 
    },
    { 
      title: "Branch", 
      dataIndex: ["MstBranch", "mb_name"], 
      key: "mb_name" 
    },
    { 
      title: "Court", 
      dataIndex: ["MstCourt", "mc_name"], 
      key: "mc_name" 
    },
    { 
      title: "Trainer", 
      dataIndex: ["MstTrainer", "trainer_name"], 
      key: "trainer_name" 
    },
    { 
      title: "Age Range", 
      dataIndex: "MstProgramAge", 
      key: "mpa_id",
      render: (age: any) => `${age.mpa_min} - ${age.mpa_max} yrs`
    },
    { 
      title: "Date", 
      dataIndex: "tpsd_date", 
      key: "tpsd_date",
      render: (date: string) => new Date(date).toLocaleDateString()
    },
    { 
      title: "Time", 
      key: "time",
      render: (_, record) => `${record.tpsd_start_time} - ${record.tpsd_end_time}`
    },
    {
      title: "Status",
      dataIndex: "tpsd_status",
      key: "tpsd_status",
      render: (status: boolean) => (
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
          <Button type="link" danger onClick={() => handleDelete(record.tpsd_id)}>
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

  const filteredData = data.filter((item) => {
    const search = searchText.toLowerCase();

    return (
      (item.MstBranch?.mb_name?.toLowerCase().includes(search) ?? false) ||
      (item.MstProgram?.mp_name?.toLowerCase().includes(search) ?? false) ||
      (item.MstCourt?.mc_name?.toLowerCase().includes(search) ?? false) ||
      (item.MstTrainer?.trainer_name?.toLowerCase().includes(search) ?? false)
    );
  });


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
                setSelectedRowKeys(filteredData.map((item) => item.tpsd_id))
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
        <Table<ISchedule>
          rowSelection={rowSelection}
          columns={columns}
          dataSource={filteredData}
          rowKey="tpsd_id" // diganti dari "mbf_id" → "tpsd_id"
          bordered
          pagination={{
            pageSize,
            total: filteredData.length,
            showSizeChanger: true,
            pageSizeOptions: ["5", "10", "20"],
            onShowSizeChange: (_, size) => setPageSize(size),
            onChange: (_, size) => setPageSize(size),
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} items`,
          }}
        />


        <Modal
          title="Edit Schedule"
          open={isModalOpen}
          onOk={handleSave}
          onCancel={() => setIsModalOpen(false)}
          okText="Update"
          cancelText="Cancel"
          centered
          destroyOnClose
        >
          <Form form={editForm} layout="vertical">
            {/* Branch */}
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

            {/* Court */}
            <Form.Item
              name="mc_id"
              label="Court *"
              rules={[{ required: true, message: "Court is required!" }]}
            >
              <Select
                placeholder="Select court"
                showSearch
                allowClear
                optionFilterProp="children"
              >
                {dataCourt.map((court) => (
                  <Select.Option key={court.mc_id} value={court.mc_id}>
                    {court.mc_name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            {/* Program */}
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
                onChange={handleProgramChangeEdit}
              >
                {dataProgram.map((program) => (
                  <Select.Option key={program.mp_id} value={program.mp_id}>
                    {program.mp_name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            {/* Program Age */}
            <Form.Item
              name="mpa_id"
              label="Program Age *"
              rules={[{ required: true, message: "Program age is required!" }]}
            >
              <Select
                placeholder="Select program age"
                showSearch
                allowClear
                optionFilterProp="children"
                disabled
              >
                {dataAgeGroup.map((age) => (
                  <Select.Option key={age.mpa_id} value={age.mpa_id}>
                    {`${age.mpa_min} - ${age.mpa_max} years`}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            {/* Trainer */}
            <Form.Item
              name="trainer_id"
              label="Trainer *"
              rules={[{ required: true, message: "Trainer is required!" }]}
            >
              <Select
                placeholder="Select trainer"
                showSearch
                allowClear
                optionFilterProp="children"
              >
                {dataTrainer.map((trainer) => (
                  <Select.Option key={trainer.trainer_id} value={trainer.trainer_id}>
                    {trainer.trainer_name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            {/* Date */}
            <Form.Item
              name="tpsd_date"
              label="Date *"
              rules={[{ required: true, message: "Date is required!" }]}
            >
              <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
            </Form.Item>

            {/* Time Range */}
            <Form.Item
              label="Time *"
              required
              style={{ marginBottom: 0 }}
            >
              <Form.Item
                name="tpsd_start_time"
                rules={[{ required: true, message: "Start time is required!" }]}
                style={{ display: "inline-block", width: "calc(50% - 8px)" }}
              >
                <TimePicker
                  style={{ width: "100%" }}
                  format="HH:mm"
                  disabledSeconds={() => []} // biarkan detik 0 tersedia
                  disabledMinutes={(selectedHour) =>
                    Array.from({ length: 60 }, (_, i) => i).filter((m) => m !== 0)
                  }
                  value={createForm.getFieldValue("tpsd_start_time") || dayjs().hour(12).minute(0)}
                  onChange={(time) => createForm.setFieldsValue({ tpsd_start_time: time })}
                />
              </Form.Item>
              <span style={{ display: "inline-block", width: "16px", textAlign: "center" }}>-</span>
              <Form.Item
                name="tpsd_end_time"
                rules={[{ required: true, message: "End time is required!" }]}
                style={{ display: "inline-block", width: "calc(50% - 8px)" }}
              >
                <TimePicker
                  style={{ width: "100%" }}
                  format="HH:mm"
                  disabledSeconds={() => []} // biarkan detik 0 tersedia
                  disabledMinutes={(selectedHour) =>
                    Array.from({ length: 60 }, (_, i) => i).filter((m) => m !== 0)
                  }
                  value={createForm.getFieldValue("tpsd_end_time") || dayjs().hour(12).minute(0)}
                  onChange={(time) => createForm.setFieldsValue({ tpsd_end_time: time })}
                />
              </Form.Item>
            </Form.Item>

            {/* Status */}
            <Form.Item
              name="tpsd_status"
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
          title="Create Schedule"
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
              {/* Branch */}
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

              {/* Court */}
              <Col span={24}>
                <Form.Item
                  name="mc_id"
                  label="Court *"
                  rules={[{ required: true, message: "Court is required!" }]}
                >
                  <Select
                    placeholder="Select court"
                    showSearch
                    optionFilterProp="children"
                    allowClear
                  >
                    {dataCourt.map((court) => (
                      <Select.Option key={court.mc_id} value={court.mc_id}>
                        {court.mc_name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              {/* Program */}
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
                    onChange={handleProgramChange}
                  >
                    {dataProgram.map((program) => (
                      <Select.Option key={program.mp_id} value={program.mp_id}>
                        {program.mp_name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              {/* Program Age */}
              <Col span={24}>
                <Form.Item
                  name="mpa_id"
                  label="Program Age *"
                  rules={[{ required: true, message: "Program age is required!" }]}
                >
                  <Select
                    placeholder="Select program age"
                    showSearch
                    optionFilterProp="children"
                    allowClear
                    disabled
                  >
                    {dataAgeGroup.map((age) => (
                      <Select.Option key={age.mpa_id} value={age.mpa_id}>
                        {`${age.mpa_min} - ${age.mpa_max} years`}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              {/* Trainer */}
              <Col span={24}>
                <Form.Item
                  name="trainer_id"
                  label="Trainer *"
                  rules={[{ required: true, message: "Trainer is required!" }]}
                >
                  <Select
                    placeholder="Select trainer"
                    showSearch
                    optionFilterProp="children"
                    allowClear
                  >
                    {dataTrainer.map((trainer) => (
                      <Select.Option key={trainer.trainer_id} value={trainer.trainer_id}>
                        {trainer.trainer_name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              {/* Date */}
              <Col span={24}>
                <Form.Item
                  name="tpsd_date"
                  label="Date *"
                  rules={[{ required: true, message: "Date is required!" }]}
                >
                  <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
                </Form.Item>
              </Col>

              {/* Time Range */}
              <Col span={24}>
                <Form.Item label="Time *" required style={{ marginBottom: 0 }}>
                  <Form.Item
                    name="tpsd_start_time"
                    rules={[{ required: true, message: "Start time is required!" }]}
                    style={{ display: "inline-block", width: "calc(50% - 8px)" }}
                  >
                    <TimePicker
                      style={{ width: "100%" }}
                      format="HH:mm"
                      disabledSeconds={() => []} // biarkan detik 0 tersedia
                      disabledMinutes={(selectedHour) =>
                        Array.from({ length: 60 }, (_, i) => i).filter((m) => m !== 0)
                      }
                      value={createForm.getFieldValue("tpsd_start_time") || dayjs().hour(12).minute(0)}
                      onChange={(time) => createForm.setFieldsValue({ tpsd_start_time: time })}
                    />
                  </Form.Item>
                  <span
                    style={{
                      display: "inline-block",
                      width: "16px",
                      textAlign: "center",
                    }}
                  >
                    -
                  </span>
                  <Form.Item
                    name="tpsd_end_time"
                    rules={[{ required: true, message: "End time is required!" }]}
                    style={{ display: "inline-block", width: "calc(50% - 8px)" }}
                  >
                    <TimePicker
                      style={{ width: "100%" }}
                      format="HH:mm"
                      disabledSeconds={() => []} // biarkan detik 0 tersedia
                      disabledMinutes={(selectedHour) =>
                        Array.from({ length: 60 }, (_, i) => i).filter((m) => m !== 0)
                      }
                      value={createForm.getFieldValue("tpsd_end_time") || dayjs().hour(12).minute(0)}
                      onChange={(time) => createForm.setFieldsValue({ tpsd_end_time: time })}
                    />
                  </Form.Item>
                </Form.Item>
              </Col>

              {/* Status */}
              <Col span={24}>
                <Form.Item
                  name="tpsd_status"
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
const SchedulesPage: React.FC<SchedulesPageProps> = ({ isSidebarOpen, isMobile }) => {
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

export default SchedulesPage;