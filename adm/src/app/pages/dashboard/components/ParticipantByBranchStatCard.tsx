import React, { useEffect, useState } from "react";
import { Card, Typography, Select, Spin } from "antd";
import axios from "axios";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LabelList,
} from "recharts";

const { Title } = Typography;

interface BranchData {
  name: string; // bulan (Jan, Feb, dst)
  [branch: string]: number | string;
}

interface Branch {
  mb_id: number;
  mb_name: string;
  mb_address: string;
  mb_city: string;
  mb_province: string;
  mb_postal_code: string;
  mb_phone: string;
  mb_status: boolean;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}

export const ParticipantByBranchStatCard: React.FC = () => {
  const months = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  const currentYear = new Date().getFullYear();
  const years = [currentYear - 1, currentYear]; // hanya 2 tahun terakhir

  const [month, setMonth] = useState<string>("All");
  const [year, setYear] = useState<number>(currentYear);
  const [data, setData] = useState<BranchData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [dataBranch, setDataBranch] = useState<Branch[]>([]);
  const [selectedBranchId, setSelectedBranchId] = useState<number | "All">("All");

  const API_URL = process.env.REACT_APP_API_URL;  

  const colors = [
    "#2E8BFF",
    "#EE4274",
    "#00C49F",
    "#FFBB28",
    "#8A2BE2",
    "#FF4500",
    "#008B8B",
    "#DC143C",
    "#556B2F",
    "#FF69B4",
  ];

  // 🚀 Fetch data
  const fetchData = async (selectedYear: number, selectedBranch: string | number = "All") => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token"); // ambil token dari localStorage

      const response = await axios.post(
        API_URL + "/admin/v1/dashboard/participant-by-branch",
        {
          month: "All",
          year: selectedYear,
          branchId: selectedBranch,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setData(response.data.data);
      } else {
        setData([]);
        console.log("⚠️ Warning:", response.data.message || "No data returned from server");
      }
    } catch (error: any) {
      console.error("❌ Error fetching branch stats:", error.response?.data?.message || error.message);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchDataBranch = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        API_URL + "/admin/v1/locations/branch-list/for-select",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setDataBranch(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch branch list", error);
      setDataBranch([]); // kosongkan jika gagal
    } finally {
      setLoading(false);
    }
  };

  const handleBranchChange = (value: number | "All") => {
    setSelectedBranchId(value);
    fetchData(year, value);
  };

  // 🔄 Fetch data saat month/year berubah
  useEffect(() => {
    fetchData(year, "All");
    fetchDataBranch();
  }, [month, year]);

  const branches = data.length > 0 ? Object.keys(data[0]).filter((key) => key !== "name") : [];

  return (
    <Card
      style={{
        borderRadius: 14,
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Title level={5} style={{ margin: 0, color: "#cd8a42" }}>
          Participants by Branch
        </Title>

        <div style={{ display: "flex", gap: 8 }}>
          <Select value={year} onChange={setYear} style={{ width: 100 }}>
            {years.map((y) => (
              <Select.Option key={y} value={y}>
                {y}
              </Select.Option>
            ))}
          </Select>

          <Select
            value={selectedBranchId} // state untuk branch terpilih
            onChange={handleBranchChange} // handler update state
            style={{ width: 200 }}
          >
            <Select.Option value="All">All Branches</Select.Option>
            {dataBranch.map((branch) => (
              <Select.Option key={branch.mb_id} value={branch.mb_id}>
                {branch.mb_name}
              </Select.Option>
            ))}
          </Select>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "24px 0" }}>
          <Spin />
        </div>
      ) : data.length === 0 ? (
        <div style={{ textAlign: "center", color: "#999", padding: "24px 0" }}>
          No data available
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={470}>
          <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />

            {branches.map((branch, index) => (
              <Line
                key={branch}
                type="monotone"
                dataKey={branch}
                stroke={colors[index % colors.length]}
                strokeWidth={2}
                dot={{ r: 2 }}
              >
                <LabelList dataKey={branch} position="top" />
              </Line>
            ))}
          </LineChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
};