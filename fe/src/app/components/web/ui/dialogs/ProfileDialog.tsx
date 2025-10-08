import React from 'react';
import { Modal, Descriptions, Avatar, Tag, Divider } from 'antd';

interface Role {
  mut_id: number;
  mut_name: string;
}

interface Level {
  ml_level_name: string;
  ml_min_value: number;
  ml_discount: number | string;
}

interface ProfileData {
  mu_avatar?: string;
  mu_full_name: string;
  mu_email?: string;
  mu_phone?: string;
  mu_member_id?: string | number;
  mu_status?: boolean;
  mu_persentase?: number | string;
  role?: Role;
  level?: Level;
  mu_is_influencer?: boolean;
  mu_is_admin?: boolean;
  mu_auth_provider?: string;
  mu_provider_id?: string;
}

interface ProfileDialogProps {
  visible: boolean;
  onClose: () => void;
  data?: ProfileData | null;
}

const ProfileDialog: React.FC<ProfileDialogProps> = ({ visible, onClose, data }) => {
  if (!data) return null;

  const labelStyle = { fontWeight: 'bold', color: '#555' };

  const formatRupiah = (value: number | undefined) => {
    if (value === undefined || value === null) return '-';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatPersentase = (value: number | string | undefined) => {
    if (value === undefined || value === null) return '-';
    return `${parseFloat(String(value)).toFixed(0)}%`;
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      centered
      width={700}
      title={
        <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 20 }}>
          User Profile
        </div>
      }
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: 20 }}>
        <Avatar size={80} src={data.mu_avatar} />
        <div>
          <div style={{ fontSize: 22, fontWeight: 'bold' }}>{data.mu_full_name}</div>
          <div style={{ color: '#888', fontSize: 16 }}>{data.mu_email}</div>
        </div>
      </div>

      <Divider />

      <Descriptions
        column={2}
        labelStyle={labelStyle}
        bordered
        size="middle"
        contentStyle={{ padding: '8px 16px' }}
      >
        <Descriptions.Item label="Nomor HP">{data.mu_phone || '-'}</Descriptions.Item>
        <Descriptions.Item label="Member ID">{data.mu_member_id || '-'}</Descriptions.Item>
        <Descriptions.Item label="Status">
          <Tag color={data.mu_status ? 'green' : 'red'}>
            {data.mu_status ? 'Active' : 'Not Active'}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Persentase">{formatPersentase(data.mu_persentase)}</Descriptions.Item>
        <Descriptions.Item label="Role">{data.role?.mut_name || '-'}</Descriptions.Item>
        <Descriptions.Item label="Level">
          {data.role?.mut_id !== 1 ? "-" : data.level?.ml_level_name || '-'}
        </Descriptions.Item>
        <Descriptions.Item label="Min Value">
          {data.role?.mut_id !== 1 ? "-" : formatRupiah(data.level?.ml_min_value)}
        </Descriptions.Item>
        <Descriptions.Item label="Diskon Level">
          {data.role?.mut_id !== 1 ? "-" : formatPersentase(data.level?.ml_discount)}
        </Descriptions.Item>
        <Descriptions.Item label="Influencer">{data.mu_is_influencer ? 'Ya' : 'Tidak'}</Descriptions.Item>
        <Descriptions.Item label="Admin">{data.mu_is_admin ? 'Ya' : 'Tidak'}</Descriptions.Item>
        <Descriptions.Item label="Auth Provider">{data.mu_auth_provider || 'N/A'}</Descriptions.Item>
        <Descriptions.Item label="Provider ID">{data.mu_provider_id || 'N/A'}</Descriptions.Item>
      </Descriptions>

      <div style={{ paddingBottom: '20px' }} />
    </Modal>
  );
};

export default ProfileDialog;