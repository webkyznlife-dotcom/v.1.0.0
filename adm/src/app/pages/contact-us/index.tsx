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
  Select,
  Tag,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../../context/NotificationContext";
import { CheckCircleTwoTone, CloseCircleTwoTone } from "@ant-design/icons";

const { Title } = Typography;

// =========================
// Types
// =========================
interface ContactUsPageProps {
  isSidebarOpen: boolean;
  isMobile: boolean;
  toggleSidebar: () => void;
}

export interface MstBranch {
  mb_id: number;
  mb_name: string;
  mb_address?: string;
  mb_city?: string;
  mb_province?: string;
  mb_postal_code?: string;
  mb_phone?: string;
  mb_status?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface TrxContact {
  tc_id: number;
  tc_pic_name: string;
  tc_institution?: string | null;
  tc_whatsapp?: string | null;
  tc_email?: string | null;
  tc_message?: string | null;
  mb_id?: number | null;
  tc_status?: string | null;
  created_at?: string;
  updated_at?: string;
  subject_id?: number | null;

  MstBranch?: MstBranch | null;
}

// =========================
// Table Card
// =========================
const DataTableCard: React.FC = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();

  const [data, setData] = useState<TrxContact[]>([]);
  const [dataBranch, setDataBranch] = useState<MstBranch[]>([]);
  const [pageSize, setPageSize] = useState(5);
  const [searchText, setSearchText] = useState("");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<TrxContact | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isBulkChangeOpen, setIsBulkChangeOpen] = useState(false);
  const [bulkStatus, setBulkStatus] = useState("NEW");

  // Row selection
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [btnLoading, setBtnLoading] = useState(false);

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
      const response = await axios.get(`${API_URL}/admin/v1/contact-us/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

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

  useEffect(() => {
    fetchData();
    fetchDataBranch();
  }, []);

  // =========================
  // Handlers
  // =========================
  const handleDeleteSelected = () => {
    if (selectedRowKeys.length === 0) {
      message.warning("Please select at least one row!");
      return;
    }
    setIsBulkChangeOpen(true);
  };

  const confirmBulkChange = async () => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    if (selectedRowKeys.length === 0) return message.error("No row selected");

    try {
      const res = await axios.post(
        `${API_URL}/admin/v1/contact-us/update-multiple`,
        {
          tc_ids: selectedRowKeys,
          tc_status: bulkStatus,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        fetchData();
        setSelectedRowKeys([]);
        setIsBulkChangeOpen(false);
        showSuccess("Selected contacts updated successfully");
      } else {
        showError(res.data.message || "Failed to update selected contacts");
      }
    } catch (err: any) {
      console.error(err);
      showError(err.response?.data?.message || "Error updating selected contacts");
    }
  };

  const handleEdit = (record: TrxContact) => {
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
        `${API_URL}/admin/v1/contact-us/update/${editingRow.tc_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            tc_status: editingRow.tc_status,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to update trial class");
      }

      const result = await response.json();
      if (result.success) {
        showSuccess("Trial class updated successfully");
        fetchData();
        setIsModalOpen(false);
      } else {
        showError(result.message || "Update failed");
      }
    } catch (error: any) {
      console.error("Update error:", error);
      showError(error.message || "Failed to update trial class");
    }
  };

  // =========================
  // Table Columns
  // =========================
  const columns: ColumnsType<TrxContact> = [
    {
      title: "ID",
      dataIndex: "tc_id",
      key: "tc_id",
      width: 70,
      render: (value: number) => <span style={{ fontFamily: "monospace" }}>{value}</span>,
    },
    {
      title: "Customer Name",
      dataIndex: "tc_pic_name",
      key: "tc_pic_name",
    },
    {
      title: "Branch",
      dataIndex: ["MstBranch", "mb_name"],
      key: "branch",
      render: (value?: string) => value || <i style={{ color: "#999" }}>-</i>,
    },
    {
      title: "Phone",
      dataIndex: "tc_whatsapp",
      key: "tc_whatsapp",
      render: (value?: string) =>
        value ? (
          <a href={`https://wa.me/${value}`} target="_blank" rel="noreferrer">
            {value}
          </a>
        ) : (
          <i style={{ color: "#999" }}>-</i>
        ),
    },
    {
      title: "Membership",
      dataIndex: "tc_is_membership",
      key: "membership",
      render: (value?: boolean) =>
        value ? <CheckCircleTwoTone twoToneColor="#52c41a" /> : <CloseCircleTwoTone twoToneColor="#ff4d4f" />,
    },
    {
      title: "Subject",
      dataIndex: ["MstSubject", "subject_name"],
      key: "subject",
      render: (value?: string) => value || <i style={{ color: "#999" }}>-</i>,
    },
    {
      title: "Status",
      dataIndex: "tc_status",
      key: "tc_status",
      render: (status?: string) => {
        const color = status === "NEW" ? "blue" : status === "REPLY" ? "green" : "default";
        return <Tag color={color}>{status || "UNKNOWN"}</Tag>;
      },
    },
    {
      title: "Action",
      key: "action",
      width: 120,
      render: (_, record) => (
        <Button type="link" onClick={() => handleEdit(record)}>
          View
        </Button>
      ),
    },
  ];

  // =========================
  // Row Selection
  // =========================
  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: React.Key[]) => setSelectedRowKeys(keys),
    hideSelectAll: true,
  };

  const filteredData = data.filter((item) => {
    const search = searchText.toLowerCase();
    return (
      item.tc_pic_name?.toLowerCase().includes(search) ||
      item.tc_institution?.toLowerCase().includes(search) ||
      item.tc_email?.toLowerCase().includes(search) ||
      item.tc_whatsapp?.toLowerCase().includes(search) ||
      item.tc_message?.toLowerCase().includes(search)
    );
  });

  // =========================
  // Render
  // =========================
  return (
    <Column size={12}>
      <Card style={{ borderRadius: 14, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)" }} className="custom-card">
        {/* Header */}
        <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Title level={5} style={{ margin: 0 }}>
            List Data
          </Title>

          <div style={{ display: "flex", gap: 8 }}>
            <Input.Search
              placeholder="Search contact"
              allowClear
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 200 }}
            />
            <Button onClick={() => setSelectedRowKeys(filteredData.map((item) => item.tc_id))}>Select All</Button>
            <Button onClick={() => setSelectedRowKeys([])}>Deselect All</Button>
            <Button danger disabled={selectedRowKeys.length === 0} onClick={handleDeleteSelected}>
              Change Selected
            </Button>
          </div>
        </div>

        {/* Table */}
        <Table<TrxContact>
          rowSelection={rowSelection}
          columns={columns}
          dataSource={filteredData}
          rowKey="tc_id"
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
          title="Edit Contact"
          open={isModalOpen}
          onOk={handleSave}
          onCancel={() => setIsModalOpen(false)}
          okText="Save Changes"
          cancelText="Cancel"
          centered
          width={800}
        >
          {editingRow && (
            <Form layout="vertical">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="ID">
                    <Input value={editingRow.tc_id} disabled style={{ fontFamily: "monospace" }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="PIC Name" required>
                    <Input
                      value={editingRow.tc_pic_name}
                      onChange={(e) =>
                        setEditingRow({ ...editingRow, tc_pic_name: e.target.value })
                      }
                      disabled
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Institution">
                    <Input
                      value={editingRow.tc_institution || ""}
                      onChange={(e) =>
                        setEditingRow({ ...editingRow, tc_institution: e.target.value })
                      }
                      disabled
                    />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item label="Branch">
                        <Select
                          value={editingRow.MstBranch?.mb_id || editingRow.mb_id}
                          onChange={(value) => setEditingRow({ ...editingRow, mb_id: value })}
                          placeholder="Select Branch"
                          disabled
                        >
                          {(dataBranch || []).map((b) => (
                            <Select.Option key={b.mb_id} value={b.mb_id}>
                              {b.mb_name}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="Status">
                        <Select
                          value={editingRow.tc_status || "NEW"}
                          onChange={(value) => setEditingRow({ ...editingRow, tc_status: value })}
                        >
                          <Select.Option value="NEW">NEW</Select.Option>
                          <Select.Option value="REPLY">REPLY</Select.Option>
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="WhatsApp">
                    <Input
                      value={editingRow.tc_whatsapp || ""}
                      onChange={(e) => setEditingRow({ ...editingRow, tc_whatsapp: e.target.value })}
                      disabled
                    />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item label="Email">
                    <Input
                      value={editingRow.tc_email || ""}
                      onChange={(e) => setEditingRow({ ...editingRow, tc_email: e.target.value })}
                      disabled
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row>
                <Col span={24}>
                  <Form.Item label="Message">
                    <Input.TextArea
                      rows={6}
                      style={{ fontSize: 14 }}
                      value={editingRow.tc_message || ""}
                      onChange={(e) => setEditingRow({ ...editingRow, tc_message: e.target.value })}
                      disabled
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          )}
        </Modal>

        {/* Change Modal (bulk) */}
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
          <p>
            Are you sure you want to change <b>{selectedRowKeys.length}</b> selected contacts?
          </p>

          <Select
            style={{ width: "100%", marginTop: 12 }}
            value={bulkStatus}
            onChange={(value) => setBulkStatus(value)}
          >
            <Select.Option value="NEW">NEW</Select.Option>
            <Select.Option value="REPLY">REPLY</Select.Option>
          </Select>
        </Modal>
      </Card>
    </Column>
  );
};

// =========================
// Main Component
// =========================
const ContactUsPage: React.FC<ContactUsPageProps> = ({ isSidebarOpen, isMobile }) => {
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

export default ContactUsPage;