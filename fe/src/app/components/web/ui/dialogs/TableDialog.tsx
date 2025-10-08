import React from 'react';
import { Modal, Descriptions, Tag, Carousel, Row, Col } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

interface Image {
  mtri_image_url: string;
}

interface ReservationType {
  mtrt_name: string;
}

interface TableData {
  mtr_table_name: string;
  mtr_table_description: string;
  mtr_status: string;
  mtr_created_at: string;
  mtr_floor: string;
  mtr_seat_count: number;
  mtr_minimum_price: number;
  reservationType?: ReservationType | null;
  mtr_duration: number;
  images?: Image[];
}

interface TableDialogProps {
  visible: boolean;
  onClose: () => void;
  data?: TableData | null;
}

const TableDialog: React.FC<TableDialogProps> = ({ visible, onClose, data }) => {
  if (!data) return null;

  const labelStyle = { fontWeight: 'bold', color: '#555' };

  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      centered
      width={800}
      title={
        <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 20 }}>
          Table Details
        </div>
      }
      style={{ zIndex: 1050 }}
    >
      <Carousel
        autoplay
        style={{ marginBottom: '20px', position: 'relative' }}
        nextArrow={<RightOutlined style={{ fontSize: '30px', color: '#000', zIndex: 1060 }} />}
        prevArrow={<LeftOutlined style={{ fontSize: '30px', color: '#000', zIndex: 1060 }} />}
      >
        {data.images && data.images.length > 0 ? (
          data.images.map((image, index) => (
            <div key={index}>
              <img
                src={image.mtri_image_url}
                alt={`Table Image ${index + 1}`}
                style={{ width: '100%', height: 300, objectFit: 'cover' }}
              />
            </div>
          ))
        ) : (
          <div>
            <img
              src="https://via.placeholder.com/800x300.png?text=No+Image"
              alt="No Image Available"
              style={{ width: '100%', height: 300, objectFit: 'cover' }}
            />
          </div>
        )}
      </Carousel>

      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Descriptions
            column={1}
            labelStyle={labelStyle}
            bordered
            size="middle"
            contentStyle={{ padding: '8px 16px' }}
          >
            <Descriptions.Item label="Table Name">{data.mtr_table_name}</Descriptions.Item>
            <Descriptions.Item label="Table Description">{data.mtr_table_description}</Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color={data.mtr_status === 'available' ? 'green' : 'red'}>
                {data.mtr_status === 'available' ? 'Available' : 'Not Available'}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Created At">{new Date(data.mtr_created_at).toLocaleString()}</Descriptions.Item>
          </Descriptions>
        </Col>

        <Col span={12}>
          <Descriptions
            column={1}
            labelStyle={labelStyle}
            bordered
            size="middle"
            contentStyle={{ padding: '8px 16px' }}
          >
            <Descriptions.Item label="Floor">{data.mtr_floor}</Descriptions.Item>
            <Descriptions.Item label="Seats">{data.mtr_seat_count}</Descriptions.Item>
            <Descriptions.Item label="Minimum Price">{formatRupiah(data.mtr_minimum_price)}</Descriptions.Item>
            <Descriptions.Item label="Reservation Type">
              {data.reservationType?.mtrt_name || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="Duration (hours)">{data.mtr_duration}</Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>

      <div style={{ paddingBottom: '20px' }} />
    </Modal>
  );
};

export default TableDialog;