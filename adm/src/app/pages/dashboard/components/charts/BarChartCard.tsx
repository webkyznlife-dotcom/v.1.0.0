import React from 'react';
import { Card, Typography } from 'antd';
import { Column } from '../../../../components/layout';
import {
  ResponsiveContainer,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Line,
  LabelList,
} from 'recharts';

const { Title } = Typography;

export interface ChartData {
  name: string;
  uv?: number;
  bsd?: number;
  count: number;
}

interface BarChartCardProps {
  title?: string;
  data: ChartData[];
  height?: number;
}

const BarChartCard: React.FC<BarChartCardProps> = ({
  title = 'Web Traffic',
  data,
  height = 398,
}) => {

  // Hitung max count untuk menentukan domain Y-axis
  const maxCount = Math.max(...data.map(d => d.count));
  const yDomain = maxCount > 0 ? [0, maxCount + 5] : [0, 10]; // tambah 5 supaya ada jarak

  return (
    <Column size={12}>
      <Card
        style={{ borderRadius: 14, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)' }}
        className="custom-card"
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
          }}
        >
          <Title level={5} style={{ margin: 0 }}>
            {title}
          </Title>
        </div>

        <ResponsiveContainer width="100%" height={height}>
          <ComposedChart data={data} barCategoryGap="20%">
            <XAxis dataKey="name" />
            <YAxis domain={yDomain} allowDecimals={false} />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />

            <Line
              type="monotone"
              dataKey="count"
              stroke="#2E8BFF"
              strokeWidth={2}
              dot={{ r: 2, stroke: '#2E8BFF', strokeWidth: 1, fill: '#fff' }}
              connectNulls
            >
              <LabelList dataKey="count" position="top" />
            </Line>
          </ComposedChart>
        </ResponsiveContainer>
      </Card>
    </Column>
  );
};

export default BarChartCard;
