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
  Form,
  Input,
  Col,
  Row,
  message,
  Tag,
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
interface BookAFreeTrialPageProps {
  isSidebarOpen: boolean;
  isMobile: boolean;
  toggleSidebar: () => void;
}

export interface MstBranch {
  mb_id: number;
  mb_name: string;
}

export interface MstProgramAge {
  mpa_id: number;
  mpa_min: number;
  mpa_max: number;
}

export interface MstProgram {
  mp_id: number;
  mp_name: string;
}

export interface TrxTrialClass {
  ttc_id: number;
  ttc_name: string;
  ttc_dob: string;
  ttc_email?: string;
  ttc_whatsapp?: string;
  mb_id?: number;
  mpa_id?: number;
  mp_id?: number;
  ttc_day: string;
  ttc_time: string;
  ttc_terms_accepted?: boolean;
  ttc_marketing_opt_in?: boolean;
  ttc_status?: string;
  created_at?: string;
  updated_at?: string;

  // Relasi
  MstBranch?: MstBranch;
  MstProgramAge?: MstProgramAge;
  MstProgram?: MstProgram;
}

// =========================
// Table Card Component
// =========================
const DataTableCard: React.FC = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();

  const [data, setData] = useState<TrxTrialClass[]>([]);
  const [dataBranch, setDataBranch] = useState<MstBranch[]>([]);
  const [pageSize, setPageSize] = useState(5);
  const [searchText, setSearchText] = useState("");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<TrxTrialClass | null>(null);
  const [form] = Form.useForm();
  const [isBulkChangeOpen, setIsBulkChangeOpen] = useState(false);
  const [bulkStatus, setBulkStatus] = useState("PENDING");

  // Row selection
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const API_URL = process.env.REACT_APP_API_URL;

  // =========================
  // Fetch Data
  // =========================
  const fetchData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      showError("Please login first");
      navigate("/login");
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/admin/v1/trial-class/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) setData(response.data.data);
      else showError("Failed to fetch facilities");
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

  // =========================
  // Handlers
  // =========================
  const handleChangeSelected = () => {
    if (selectedRowKeys.length === 0) {
      message.warning("Please select at least one row!");
      return;
    }
    setIsBulkChangeOpen(true);
  };

  const confirmBulkChange = async () => {
    if (selectedRowKeys.length === 0) {
      message.error("No row selected");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const res = await axios.post(
        `${API_URL}/admin/v1/trial-class/update-multiple`,
        {
          ids: selectedRowKeys,
          ttc_status: bulkStatus,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        fetchData();
        setSelectedRowKeys([]);
        setIsBulkChangeOpen(false);
        showSuccess("Selected trial classes updated successfully");
      } else {
        showError(res.data.message || "Failed to update selected trial classes");
      }
    } catch (err: any) {
      console.error("Bulk update error:", err);
      showError(
        err.response?.data?.message || err.message || "Error updating selected trial classes"
      );
    }
  };

  const handleEdit = (record: TrxTrialClass) => {
    setEditingRow(record);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!editingRow) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        message.error("Please login first");
        return;
      }

      const response = await fetch(
        `${API_URL}/admin/v1/trial-class/update/${editingRow.ttc_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ ttc_status: editingRow.ttc_status }),
        }
      );

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.message || "Failed to update trial class");
      }

      const result = await response.json();
      if (result.success) {
        showSuccess("Trial class updated successfully");
        fetchData();
        setIsModalOpen(false);
      } else showError(result.message || "Update failed");
    } catch (error: any) {
      console.error("Update error:", error);
      showError(error.message || "Failed to update trial class");
    }
  };

  // =========================
  // Table Columns
  // =========================
  const columns: ColumnsType<TrxTrialClass> = [
    { title: "ID", dataIndex: "ttc_id", key: "ttc_id", width: 60 },
    { title: "Name", dataIndex: "ttc_name", key: "ttc_name" },
    { title: "Branch", key: "mb_id", render: (_, record) => record.MstBranch?.mb_name || "-" },
    { title: "Program", key: "mp_id", render: (_, record) => record.MstProgram?.mp_name || "-" },
    { title: "Day", dataIndex: "ttc_day", key: "ttc_day" },
    { title: "Time", dataIndex: "ttc_time", key: "ttc_time" },
    {
      title: "Status",
      dataIndex: "ttc_status",
      key: "ttc_status",
      render: (status: string) => {
        let color = "default";
        if (status === "CONFIRMED") color = "green";
        else if (status === "PENDING") color = "orange";
        else if (status === "CANCELLED") color = "red";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => <Button type="link" onClick={() => handleEdit(record)}>View</Button>,
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: React.Key[]) => setSelectedRowKeys(keys),
    hideSelectAll: true,
  };

  const filteredData = data.filter((item) =>
    (item.ttc_name ?? "").toLowerCase().includes(searchText.toLowerCase())
  );

  // =========================
  // Render
  // =========================
  return (
    <Column size={12}>
      <Card style={{ borderRadius: 14, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)" }} className="custom-card">
        {/* Header */}
        <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Title level={5} style={{ margin: 0 }}>List Data</Title>

          <div style={{ display: "flex", gap: 8 }}>
            <Input.Search
              placeholder="Search trial class"
              allowClear
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 200 }}
            />
            <Button onClick={() => setSelectedRowKeys(filteredData.map((item) => item.ttc_id))}>Select All</Button>
            <Button onClick={() => setSelectedRowKeys([])}>Deselect All</Button>
            <Button danger disabled={selectedRowKeys.length === 0} onClick={handleChangeSelected}>Change Selected</Button>
          </div>
        </div>

        {/* Table */}
        <Table<TrxTrialClass>
          rowSelection={rowSelection}
          columns={columns}
          dataSource={filteredData}
          rowKey="ttc_id"
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
          title="Edit Trial Class"
          open={isModalOpen}
          onOk={handleSave}
          onCancel={() => setIsModalOpen(false)}
          okText="Save Changes"
          cancelText="Cancel"
          centered
          destroyOnClose
          width={800}
        >
          {editingRow && (
            <Form layout="vertical">
              <Row gutter={16}>
                {/* ID (read-only) */}
                <Col span={24}><Form.Item label="ID"><Input value={editingRow.ttc_id} disabled /></Form.Item></Col>
                {/* Name */}
                <Col span={12}><Form.Item label="Name"><Input value={editingRow.ttc_name} onChange={(e) => setEditingRow({ ...editingRow, ttc_name: e.target.value })} disabled /></Form.Item></Col>
                {/* DOB */}
                <Col span={12}><Form.Item label="DOB"><Input type="date" value={editingRow.ttc_dob} onChange={(e) => setEditingRow({ ...editingRow, ttc_dob: e.target.value })} disabled /></Form.Item></Col>
                {/* Email */}
                <Col span={12}><Form.Item label="Email"><Input type="email" value={editingRow.ttc_email} onChange={(e) => setEditingRow({ ...editingRow, ttc_email: e.target.value })} disabled /></Form.Item></Col>
                {/* WhatsApp */}
                <Col span={12}><Form.Item label="WhatsApp"><Input value={editingRow.ttc_whatsapp} onChange={(e) => setEditingRow({ ...editingRow, ttc_whatsapp: e.target.value })} disabled /></Form.Item></Col>
                {/* Branch */}
                <Col span={12}><Form.Item label="Branch"><Select value={editingRow.mb_id} onChange={(value) => setEditingRow({ ...editingRow, mb_id: value })} disabled>{dataBranch.map((branch) => <Select.Option key={branch.mb_id} value={branch.mb_id}>{branch.mb_name}</Select.Option>)}</Select></Form.Item></Col>
                {/* Program */}
                <Col span={12}><Form.Item label="Program"><Select value={editingRow.mp_id} onChange={(value) => setEditingRow({ ...editingRow, mp_id: value })} disabled>{/* isi dari API */}</Select></Form.Item></Col>
                {/* Age Range */}
                <Col span={12}><Form.Item label="Age Range"><Select value={editingRow.mpa_id} onChange={(value) => setEditingRow({ ...editingRow, mpa_id: value })} disabled>{/* isi dari API */}</Select></Form.Item></Col>
                {/* Day */}
                <Col span={12}><Form.Item label="Day"><Select value={editingRow.ttc_day} onChange={(value) => setEditingRow({ ...editingRow, ttc_day: value })} disabled>{["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"].map((day) => <Select.Option key={day} value={day}>{day}</Select.Option>)}</Select></Form.Item></Col>
                {/* Time */}
                <Col span={12}><Form.Item label="Time"><Input type="time" value={editingRow.ttc_time} onChange={(e) => setEditingRow({ ...editingRow, ttc_time: e.target.value })} disabled /></Form.Item></Col>
                {/* Status */}
                <Col span={12}><Form.Item label="Status"><Select value={editingRow.ttc_status} onChange={(value) => setEditingRow({ ...editingRow, ttc_status: value })}><Select.Option value="CONFIRMED">CONFIRMED</Select.Option><Select.Option value="PENDING">PENDING</Select.Option><Select.Option value="CANCELLED">CANCELLED</Select.Option></Select></Form.Item></Col>
              </Row>
            </Form>
          )}
        </Modal>

        {/* Bulk Change Modal */}
        <Modal
          title="Confirm Change Selected"
          open={isBulkChangeOpen}
          onOk={confirmBulkChange}
          onCancel={() => setIsBulkChangeOpen(false)}
          okText="Yes, Change"
          okType="danger"
          cancelText="Cancel"
          centered
        >
          <p>Are you sure you want to change <b>{selectedRowKeys.length}</b> selected contacts?</p>
          <Select style={{ width: "100%", marginTop: 12 }} value={bulkStatus} onChange={(value) => setBulkStatus(value)}>
            <Select.Option value="CONFIRMED">CONFIRMED</Select.Option>
            <Select.Option value="PENDING">PENDING</Select.Option>
            <Select.Option value="CANCELLED">CANCELLED</Select.Option>
          </Select>
        </Modal>
      </Card>
    </Column>
  );
};

// =========================
// Main Component
// =========================
const BookAFreeTrialPage: React.FC<BookAFreeTrialPageProps> = ({ isSidebarOpen, isMobile }) => {
  return (
    <div style={{ ...styles.container, marginLeft: isSidebarOpen && !isMobile ? "274px" : "0" }}>
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

export default BookAFreeTrialPage;
