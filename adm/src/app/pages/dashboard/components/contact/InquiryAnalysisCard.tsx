import React, { useMemo, useState, useEffect } from "react";
import { Card, Typography, Select, Spin } from "antd";
import { Column } from "../../../../components/layout";
import axios from "axios";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LabelList,
} from "recharts";

const { Title } = Typography;

interface ContactInquiry {
  subject: string;
  count?: number;
}

export const InquiryAnalysisCard: React.FC<{ title?: string }> = ({
  title = "Inquiry Analysis",
}) => {
    const currentYear = new Date().getFullYear();
    const years = [currentYear - 1, currentYear];

    const [month, setMonth] = useState<string>("All");
    const [year, setYear] = useState<number>(currentYear);

    const [dataSource, setDataSource] = useState<ContactInquiry[]>([]);
    const [dataMasterSubject, setDataMasterSubject] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState<boolean>(true);

    const API_URL = process.env.REACT_APP_API_URL; 

    const handleMonthChange = (value: string) => {
      setMonth(value);
      fetchData(value, year?.toString() || null); // konversi year ke string
    };

    const handleYearChange = (value: number) => {
      setYear(value);
      fetchData(month || null, value.toString()); // konversi ke string
    };


    // ✅ Fetch master subject (GET)
    const fetchDataMasterSubject = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        const response = await axios.get(`${API_URL}/admin/v1/dashboard/inquiry-analysis/master-subject`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        setDataMasterSubject(response.data.data || {});
      } catch (error) {
        console.error("Failed to fetch master subject", error);
      } finally {
        setLoading(false);
      }
    };

    // ✅ Fetch inquiry summary (POST)
    const fetchData = async (monthParam?: string | null, yearParam?: string | null) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      // ✅ Default ke bulan dan tahun saat ini jika null/undefined
      const now = new Date();
      const month = monthParam || String(now.getMonth() + 1).padStart(2, "0");
      const year = yearParam || String(now.getFullYear());

      const response = await axios.post(
        `${API_URL}/admin/v1/dashboard/inquiry-analysis`,
        { month, year },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setDataSource(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch inquiries", error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchDataMasterSubject();
    fetchData(month);
  }, []);

  // ✅ Gunakan master subject untuk mengganti nama label
  const data = useMemo(() => {
    const counts = new Map<string, number>();

    dataSource.forEach((d) => {
      const subjectName =
        dataMasterSubject[d.subject] || dataMasterSubject["other"] || "Unknown";
      const addCount = d.count ?? 1;
      counts.set(subjectName, (counts.get(subjectName) || 0) + addCount);
    });

    return Array.from(counts.entries())
      .map(([subject, count]) => ({
        subject,
        count,
        label: `${count}`,
      }))
      .sort((a, b) => b.count - a.count);
  }, [dataSource, dataMasterSubject]);

  const months = [
    { value: "All", label: "All Months" },
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  return (
    <Column size={12}>
      <Card style={{ borderRadius: 14, boxShadow: "0 4px 12px rgba(0,0,0,0.06)" }}>
        <Title level={5} style={styles.title}>{title}</Title>

        {/* Filter Year + Month */}
        <div style={{ marginBottom: 16, display: "flex", gap: 16 }}>
          <div>
            <span style={{ marginRight: 8 }}>Year:</span>
            <Select value={year} onChange={handleYearChange} style={{ width: 120 }}>
              {years.map((y) => (
                <Select.Option key={y} value={y}>{y}</Select.Option>
              ))}
            </Select>
          </div>

          <div>
            <span style={{ marginRight: 8 }}>Month:</span>
            <Select value={month} onChange={handleMonthChange} style={{ width: 150 }}>
              {months.map((m) => (
                <Select.Option key={m.value} value={m.value}>{m.label}</Select.Option>
              ))}
            </Select>
          </div>
        </div>

        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: 32 }}>
            <Spin />
          </div>
        ) : data.length === 0 ? (
          <div style={{ padding: 16, color: "#999" }}>No inquiries available</div>
        ) : (
          <div style={{ width: "100%", height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                layout="vertical"
                margin={{ top: 8, right: 12, left: 12, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" allowDecimals={false} />
                <YAxis type="category" dataKey="subject" width={200} />
                <Tooltip formatter={(v: number) => [`${v} inquiries`, "Count"]} />
                <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 6, 6]} barSize={28}>
                  <LabelList dataKey="label" position="right" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>
    </Column>
  );
};

const styles = {
  title: {
    marginBottom: 12,
    color: "#cd8a42",
  },
};