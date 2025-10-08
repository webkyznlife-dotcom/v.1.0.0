import React from 'react';
import { Card, Typography, Avatar } from 'antd';
import { Column } from '../../../../components/layout'; // sesuaikan path
import { LineChartOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

// =========================
// Styles
// =========================
const styles: { [key: string]: React.CSSProperties } = {
  container: {
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

// Props untuk komponen
interface StatCardProps {
  title?: string;
  number: number;
  icon?: React.ReactNode;
  color?: string;
}

const TrafficChartCard: React.FC<StatCardProps> = ({
  title = 'This Week Visitors',
  number,
  icon = <LineChartOutlined />,
  color = '#7694ff',
}) => {
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
            width: '100%',
          }}
        >
          {/* Text + Title */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Text type="secondary" style={{ marginTop: 0 }}>
              {title}
            </Text>
            <Title level={2} style={styles.numberVisitor}>
              {number}
            </Title>
          </div>

          {/* Avatar icon */}
          <Avatar style={{ backgroundColor: color, marginLeft: 10 }} icon={icon} size={50} />
        </div>
      </Card>
    </Column>
  );
};

export default TrafficChartCard;