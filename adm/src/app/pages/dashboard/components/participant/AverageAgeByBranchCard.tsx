import React, { useMemo, useState, useEffect } from 'react';
import { Card, Typography, Select, Spin } from 'antd';
import { Column } from '../../../../components/layout';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LabelList,
} from 'recharts';
import axios from 'axios';

const { Title, Text } = Typography;

const calcAge = (dobStr: string): number => {
  const dob = new Date(dobStr);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
  return age;
};

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

export const AverageAgeByBranchCard: React.FC<{ title?: string }> = ({
  title = 'Average Age by Branch',
}) => {
  const [month, setMonth] = useState<string>("All");
  const [dataSource, setDataSource] = useState<TrialParticipant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const currentYear = new Date().getFullYear();
  const years = [currentYear - 1, currentYear];
  const [year, setYear] = useState(currentYear.toString());

  const API_URL = process.env.REACT_APP_API_URL;  

  const handleMonthChange = (value: string) => {
    setMonth(value);
    fetchData(value, year);
  };

  const handleYearChange = (value: string) => {
    setYear(value);
    fetchData(month, value); 
  };

  const fetchData = async (monthParam: string = "All", yearParam: string = "2025", branchIdParam: string | number = "All") => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        API_URL + "/admin/v1/dashboard/average-by-branch",
        {
          month: monthParam,
          year: yearParam,
          branchId: branchIdParam,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setDataSource(response.data.data || []);
    } catch (err) {
      console.error("❌ Failed to fetch average by branch data", err);
      setDataSource([]); // kosongkan jika gagal
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchData("All", year);
  }, []);

  const byBranch = useMemo(() => {
    const map = new Map<string, number[]>();
    dataSource.forEach(d => {
      const age = calcAge(d.dateOfBirth);
      if (!isFinite(age)) return;
      if (!map.has(d.branch)) map.set(d.branch, []);
      map.get(d.branch)!.push(age);
    });
    return Array.from(map, ([name, ages]) => ({
      name,
      avgAge: Math.round(ages.reduce((s, a) => s + a, 0) / ages.length),
    })).sort((a, b) => b.avgAge - a.avgAge);
  }, [dataSource]);

  const overallAvg = useMemo(() => {
    const ages = dataSource.map(d => calcAge(d.dateOfBirth)).filter(Number.isFinite);
    return ages.length ? Math.round(ages.reduce((s, a) => s + a, 0) / ages.length) : 0;
  }, [dataSource]);

  return (
    <Column size={12}>
      <Card style={{ borderRadius: 14, boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
        {/* Header row: title + overall avg */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Title level={5} style={{ margin: 0, color: '#cd8a42' }}>{title}</Title>
          <Text type="secondary">Overall Avg: <b>{overallAvg}</b> yrs</Text>
        </div>

        {/* Dropdown Month & Year */}
        <div style={{ marginBottom: 12, display: 'flex', gap: 12 }}>
          <div>
            <span style={{ marginRight: 8 }}>Year:</span>
            <Select value={year} onChange={handleYearChange} style={{ width: 120 }}>
              {years.map(y => (
                <Select.Option key={y} value={y.toString()}>{y}</Select.Option>
              ))}
            </Select>
          </div>

          <div>
            <span style={{ marginRight: 8 }}>Month:</span>
            <Select value={month} onChange={handleMonthChange} style={{ width: 150 }}>
              <Select.Option value="All">All Months</Select.Option>
              {months.map((m) => (
                <Select.Option key={m.value} value={m.value}>
                  {m.label}
                </Select.Option>
              ))}
            </Select>
          </div>
        </div>

        {/* Chart */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 32 }}>
            <Spin />
          </div>
        ) : (
          <div style={{ width: '100%', height: 328 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byBranch} layout="vertical" margin={{ top: 8, right: 12, left: 12, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 'dataMax + 5']} />
                <YAxis type="category" dataKey="name" width={110} />
                <Tooltip formatter={(v: number) => [`${v} yrs`, 'Avg Age']} />
                <Bar dataKey="avgAge" fill="#3b82f6" radius={[6, 6, 6, 6]} barSize={26}>
                  <LabelList dataKey="avgAge" position="right" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>
    </Column>
  );
};