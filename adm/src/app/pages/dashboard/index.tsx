import React, { useEffect, useState, useRef, useMemo } from 'react';

import axios from 'axios';

// Layout components (pastikan path sesuai struktur project)
import { Container, Row, Column, Box } from '../../components/layout';

// Ant Design
import { Card, Avatar, Typography, Space, Select, Table, Col, Tag, Button, ConfigProvider, Input, List  } from 'antd';

// Icons
import {
  UserOutlined,
  TeamOutlined,
  BarChartOutlined,
  AreaChartOutlined,
} from '@ant-design/icons';
import { TopClassPerBranchCard } from './components/participant/TopClassPerBranchCard';
import { ClassDistributionCard } from './components/participant/ClassDistributionCard';
import { AverageAgeByBranchCard } from './components/participant/AverageAgeByBranchCard';

import BarChartCard, {ChartData} from './components/charts/BarChartCard';
import TrafficChartCard from './components/charts/TrafficChartCard';

import { InquiryAnalysisCard } from './components/contact/InquiryAnalysisCard';
import { ParticipantByAgeGroupStatCard } from './components/ParticipantByAgeGroupStatCard';
import { ParticipantByBranchStatCard } from './components/ParticipantByBranchStatCard';



// =========================
// Types
// =========================

interface DashboardPageProps {
  isSidebarOpen: boolean;
  isMobile: boolean;
  toggleSidebar: () => void;
}

// =========================
// Main Component
// =========================
const DashboardPage: React.FC<DashboardPageProps> = ({ isSidebarOpen, isMobile, toggleSidebar }) => {

  const currentYear = new Date().getFullYear();
  const years = [currentYear - 1, currentYear];
  const [year, setYear] = useState<number>(currentYear);
  const [loading, setLoading] = useState<boolean>(false);

  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [summaryData, setSummaryData] = useState<{
    today: number;
    week: number;
    month: number;
    year: number;
  }>({
    today: 0,
    week: 0,
    month: 0,
    year: 0,
  });

  const API_URL = process.env.REACT_APP_API_URL;  

  // 🚀 Fetch data
  const fetchData = async (selectedYear: number) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token"); // ambil token dari localStorage

      const response = await axios.post(
        API_URL + "/admin/v1/dashboard/visitor-bar-chart",
        {
          year: selectedYear,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setChartData(response.data.data);
      } else {
        setChartData([]);
        console.log("⚠️ Warning:", response.data.message || "No data returned from server");
      }
    } catch (error: any) {
      console.error("❌ Error fetching visitor stats:", error.response?.data?.message || error.message);
      setChartData([]);
    } finally {
      setLoading(false);
    }
  };  

  const fetchDataSummary = async (selectedYear: number) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token"); // ambil token dari localStorage

      const response = await axios.post(
        API_URL + "/admin/v1/dashboard/visitor-summary", // endpoint POST
        {
          year: selectedYear, // dikirim di body
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setSummaryData(response.data.data);
      } else {
        setSummaryData({ today: 0, week: 0, month: 0, year: 0 });
        console.log("⚠️ Warning:", response.data.message || "No data returned from server");
      }
    } catch (error: any) {
      console.error(
        "❌ Error fetching visitor summary stats:",
        error.response?.data?.message || error.message
      );
      setSummaryData({ today: 0, week: 0, month: 0, year: 0 });
    } finally {
      setLoading(false);
    }
  };


  // Contoh fetch data / update state
  useEffect(() => {
     fetchData(year);
     fetchDataSummary(year);
  }, []); 

  useEffect(() => {
    // console.log(isSidebarOpen);
    // console.log(toggleSidebar);
    // console.log(isMobile);
  }, []);

  return (
    <div style={{ ...styles.container, marginLeft: isSidebarOpen && !isMobile ? '274px' : '0' }}>
      <Container>

        <Row className="mb-2">
          <Column size={12} className="flex items-center gap-4">
            <div>
              <span>Choose Year: </span>
              <Select
                value={year}
                onChange={(value: number) => {
                  setYear(value);     // update state year
                  fetchData(value);   // fetch data untuk tahun baru
                  fetchDataSummary(value);
                }}
                style={{ width: 120 }}
              >
                {years.map((y) => (
                  <Select.Option key={y} value={y}>
                    {y}
                  </Select.Option>
                ))}
              </Select>
            </div>
          </Column>
        </Row>

        <Row className="mb-0">
          <Column size={9}>
            <BarChartCard title="Web Traffic" data={chartData} height={400} />
          </Column>

          <Column size={3}>
            <TrafficChartCard number={summaryData.today} title="Today Visitors" icon={<TeamOutlined />} /> 
            <TrafficChartCard number={summaryData.week} title="This Week" icon={<UserOutlined />} />
            <TrafficChartCard number={summaryData.month} title="This Month" icon={<BarChartOutlined />} />
            <TrafficChartCard number={summaryData.year} title="This Year" icon={<AreaChartOutlined />} />
          </Column>
        </Row>

        {/* Free Trial / Class */}
        <Row className="mb-0">

          <Column size={7}>
            <ParticipantByBranchStatCard />
          </Column>          

          <Column size={5} style={{ marginBottom: 30 }}>
            <ParticipantByAgeGroupStatCard />
          </Column>        

          <Column size={6}>
              <AverageAgeByBranchCard />
          </Column>      

          <Column size={6}>
              <TopClassPerBranchCard />
          </Column>    

          <Column size={12}>
              <ClassDistributionCard />
          </Column>
        </Row>        

        <Row className="mb-0">
          <Column size={12}>
            <InquiryAnalysisCard />
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
    // position: 'absolute', // typo fix from 'abosulte'
    flex: 1,
    padding: '0px',
    marginTop: '60px',
    paddingBottom: '60px',
    transition: 'margin-left 0.3s ease-in-out',
  },
  numberVisitor: {
    color: '#7694ff',
    fontWeight: 'bold',
    fontFamily: 'Poppins',
    margin: 0,
  },
  numberVisitorIcon: {
    color: '#fff',
    fontWeight: 'bold',
    backgroundColor: '#7694ff',
    marginLeft: 10,
  },
  titleFreeTrialCard: { margin: 0, marginBottom: 16, color: '#cd8a42', fontWeight: 600 },
};

export default DashboardPage;