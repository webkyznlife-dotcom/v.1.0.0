import React, { useEffect, useState } from "react";
import { Card, Typography, Select, List, Spin, message } from "antd";
import axios from "axios";

const { Title } = Typography;

// 🎯 Tipe data
interface AgeGroup {
  range: string;
  count: number;
}

export const ParticipantByAgeGroupStatCard: React.FC = () => {
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
  const years = [currentYear - 1, currentYear];

  const [month, setMonth] = useState<string>("All");
  const [year, setYear] = useState<number>(currentYear);
  const [data, setData] = useState<AgeGroup[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const API_URL = process.env.REACT_APP_API_URL;  

  const fetchDataByMonthYear = async (selectedMonth: string, selectedYear: number) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token"); // ganti sesuai lokasi tokenmu

      const response = await axios.post(
        API_URL + "/admin/v1/dashboard/participant-by-age-range",
        {
          month: selectedMonth,
          year: selectedYear,
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
        message.warning(response.data.message || "No data returned from server");
      }
    } catch (error: any) {
      console.error("❌ Error fetching participants by age range:", error);
      setData([]);
      message.error(error.response?.data?.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  // 📌 Tambahkan handler untuk perubahan bulan
  const handleMonthChange = (value: string) => {
    setMonth(value);
    fetchDataByMonthYear(value, year); // otomatis fetch data baru
  };

  const handleYearChange = (value: number) => {
    setYear(value);
    fetchDataByMonthYear(month, value);
  };  


  useEffect(() => {
    fetchDataByMonthYear(month, year);
  }, [month, year]);

  const sortedAgeGroups = [...data].sort((a, b) => b.count - a.count);

  return (
    <Card style={{ borderRadius: 14, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <Title level={5} style={{ margin: 0, color: "#cd8a42" }}>
          Participants by Age Group
        </Title>

        <div style={{ display: "flex", gap: 8 }}>
          <Select<number> value={year} onChange={handleYearChange} style={{ width: 100 }}>
            {years.map((y) => (
              <Select.Option key={y} value={y}>{y}</Select.Option>
            ))}
          </Select>

          <Select<string> value={month} onChange={handleMonthChange} style={{ width: 150 }}>
            <Select.Option value="All">All Months</Select.Option>
            {months.map((m) => (
              <Select.Option key={m.value} value={m.value}>{m.label}</Select.Option>
            ))}
          </Select>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "24px 0" }}>
          <Spin />
        </div>
      ) : sortedAgeGroups.length > 0 ? (
        <List
          dataSource={sortedAgeGroups}
          renderItem={(item, index) => (
            <List.Item style={{ display: "flex", justifyContent: "space-between", fontWeight: 500 }}>
              <span>{index + 1}. {item.range}</span>
              <span>{item.count}</span>
            </List.Item>
          )}
        />
      ) : (
        <div style={{ textAlign: "center", color: "#999", padding: "24px 0" }}>
          No data available
        </div>
      )}
    </Card>
  );
};