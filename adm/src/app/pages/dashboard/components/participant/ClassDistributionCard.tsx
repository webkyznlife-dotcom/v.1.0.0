import React, { useMemo, useState, useEffect } from 'react';
import { Card, Typography, Select, Spin } from 'antd';
import { Column } from '../../../../components/layout';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LabelList,
} from 'recharts';
import axios from 'axios';

const { Title } = Typography;

type ClassCount = { trialClass: string; count: number };

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

export const ClassDistributionCard: React.FC<{ title?: string }> = ({
  title = 'Participants by Trial Class', 
}) => {
  const [month, setMonth] = useState<string>("All");
  const [dataSource, setDataSource] = useState<TrialParticipant[]>([]);
  const [dataBranch, setDataBranch] = useState<Branch[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const currentYear = new Date().getFullYear();
  const years = [currentYear - 1, currentYear]; // tahun ini + 1 tahun sebelumnya
  const [year, setYear] = useState(currentYear.toString()); // default tahun ini

  const [selectedBranchId, setSelectedBranchId] = useState<number | "All">("All");

  const API_URL = process.env.REACT_APP_API_URL;  

  const handleYearChange = (value: string) => {
    setYear(value);
    fetchData(month, value, selectedBranchId);
  };

  const handleBranchChange = (value: number | "All") => {
    setSelectedBranchId(value);
    fetchData(month, year, value);
  };

  const fetchData = async (
    monthParam: string = "All",
    yearParam: string = "",
    branchIdParam: number | "All" = "All"
  ) => {
    setLoading(true);
    try {

      const token = localStorage.getItem("token");

      const response = await axios.post(
        API_URL + '/admin/v1/dashboard/participant-trial-class',
        {
          month: monthParam,
          year: yearParam,
          branchId: branchIdParam // branch optional
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setDataSource(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch trial participants", error);
      setDataSource([]);
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


  useEffect(() => {
    fetchData("All", "2025", "All");
    fetchDataBranch();
  }, [currentYear]);

  const data: ClassCount[] = useMemo(() => {
    const m = new Map<string, number>();

    dataSource.forEach(d => {
      m.set(d.trialClass, (m.get(d.trialClass) || 0) + 1);
    });

    return Array.from(m, ([trialClass, count]) => ({ trialClass, count }))
      .sort((a, b) => b.count - a.count);
  }, [dataSource]);



  return (
    <Column size={12}>
      <Card style={{ borderRadius: 14, boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
        <Title level={5} style={{ marginBottom: 12, color: '#cd8a42' }}>{title}</Title>

        {/* Dropdown Month & Year */}
        <div style={{ marginBottom: 16, display: 'flex', gap: 12 }}>
          <div>
            <span style={{ marginRight: 8 }}>Year:</span>
            <Select value={year} onChange={handleYearChange} style={{ width: 120 }}>
              {years.map(y => <Select.Option key={y} value={y.toString()}>{y}</Select.Option>)}
            </Select>
          </div>

          <div>
            <span style={{ marginRight: 8 }}>Month:</span>
            <Select
              value={month}
              onChange={(value) => {
                setMonth(value);
                fetchData(value, year, selectedBranchId);
              }}
              style={{ width: 150 }}
            >
              <Select.Option value="All">All Months</Select.Option>
              {months.map(m => (
                <Select.Option key={m.value} value={m.value}>
                  {m.label}
                </Select.Option>
              ))}
            </Select>
          </div>

          <div>
            <span style={{ marginRight: 8 }}>Branch:</span>
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
          <div style={{ display: 'flex', justifyContent: 'center', padding: 32 }}>
            <Spin />
          </div>
        ) : data.length === 0 ? (
          <div style={{ padding: 16, color: "#999" }}>No participants available</div>
        ) : (
          <div style={{ width: '100%', height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 8, right: 12, left: 12, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="trialClass" />
                <YAxis allowDecimals={false} />
                <Tooltip formatter={(v: number) => [`${v} participants`, 'Count']} />
                <Bar dataKey="count" fill="#ff9595" radius={[6, 6, 0, 0]} barSize={28}>
                  <LabelList dataKey="count" position="top" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>
    </Column>
  );
};
