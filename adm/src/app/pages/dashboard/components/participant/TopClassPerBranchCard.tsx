import React, { useMemo, useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Typography, Select, Spin } from 'antd';
import { Column } from '../../../../components/layout';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LabelList,
} from 'recharts';

const { Title } = Typography;

type TopClassRow = { branch: string; topClass: string; count: number; label: string };

interface TrialParticipant {
  key: string;
  no: number;
  name: string;
  dateOfBirth: string;
  ageCategory: string;
  email: string;
  whatsapp: string;
  branch: string;
  trialClass: string;
  day: string;
  time: string;
  status?: string;
}

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

export const TopClassPerBranchCard: React.FC<{ title?: string }> = ({
  title = 'Top Trial Class per Branch',
}) => {
  const currentYear = new Date().getFullYear();
  const years = [currentYear - 1, currentYear]; // hanya dua tahun terakhir
  const [month, setMonth] = useState<string>("All");
  const [year, setYear] = useState<string>(currentYear.toString());
  const [dataSource, setDataSource] = useState<TrialParticipant[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const API_URL = process.env.REACT_APP_API_URL;

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        API_URL + "/admin/v1/dashboard/top-trial-class-branch",
        {
          month: month || "All", // default 'All'
          year: year || new Date().getFullYear(), // default tahun sekarang
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Pastikan data valid
      setDataSource(response.data?.data || []);
    } catch (err) {
      console.error("❌ Failed to fetch data:", err);
      setDataSource([]); // kosongkan jika gagal
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    fetchData();
  }, [month, year]);

  // 🔹 Hitung top class per branch
  const data: TopClassRow[] = useMemo(() => {
    const byBranch = new Map<string, Map<string, number>>();
    dataSource.forEach((d) => {
      if (!byBranch.has(d.branch)) byBranch.set(d.branch, new Map());
      const m = byBranch.get(d.branch)!;
      m.set(d.trialClass, (m.get(d.trialClass) || 0) + 1);
    });

    return Array.from(byBranch.entries())
      .map(([branch, classMap]) => {
        let topClass = ''; let count = 0;
        classMap.forEach((cCount, cls) => { if (cCount > count) { count = cCount; topClass = cls; } });
        return { branch, topClass, count, label: `${topClass} (${count})` };
      })
      .sort((a, b) => b.count - a.count);
  }, [dataSource]);

  return (
    <Column size={12}>
      <Card style={{ borderRadius: 14, boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
        <Title level={5} style={styles.title}>{title}</Title>

        {/* Filter Section */}
        <div style={{ marginBottom: 12, display: 'flex', gap: 12 }}>
          <div>
            <span style={{ marginRight: 8 }}>Year:</span>
            <Select
              value={year}
              onChange={setYear}
              style={{ width: 120 }}
            >
              {years.map((y) => (
                <Select.Option key={y.toString()} value={y.toString()}>
                  {y.toString()}
                </Select.Option>
              ))}
            </Select>
          </div>

          <div>
            <span style={{ marginRight: 8 }}>Month:</span>
            <Select
              value={month}
              onChange={setMonth}
              style={{ width: 150 }}
            >
              <Select.Option value="All">All Months</Select.Option>
              {months.map((m) => (
                <Select.Option key={m.value} value={m.value}>
                  {m.label}
                </Select.Option>
              ))}
            </Select>
          </div>
        </div>

        {/* Chart / Loading / Empty State */}
        {loading ? (
          <div style={{ height: 320, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Spin size="large" />
          </div>
        ) : data.length === 0 ? (
          <div style={{ padding: 16, color: '#999' }}>No data available</div>
        ) : (
          <div style={{ width: '100%', height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} layout="vertical" margin={{ top: 8, right: 12, left: 12, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" allowDecimals={false} />
                <YAxis type="category" dataKey="branch" width={110} />
                <Tooltip
                  formatter={(v: number, _n, p: any) => [
                    `${v} participants`,
                    p?.payload?.topClass ?? 'Top Class',
                  ]}
                />
                <Bar dataKey="count" fill="#10b981" radius={[6, 6, 6, 6]} barSize={28}>
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
    color: '#cd8a42',
  },
};
