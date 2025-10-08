import React, { useState } from 'react';
import { Partner } from './partners';

interface PartnerCardProps {
  partner: Partner;
}

const PartnerCard: React.FC<PartnerCardProps> = ({ partner }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        ...styles.logoWrapper,
        border: `1px solid ${isHovered ? '#666666' : '#dddddd'}`,
        borderRadius: '6px',
        padding: '8px',
        transition: 'border-color 0.3s ease, transform 0.2s ease',
        transform: isHovered ? 'translateY(-3px)' : 'translateY(0)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img src={partner.logo} alt={partner.name} style={styles.logo} />
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  logoWrapper: {
    flex: '0 1 100px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    height: '80px', 
    // jangan kasih margin di sini
  },
  logo: {
    maxWidth: '100%',
    maxHeight: '50px',
    objectFit: 'contain',
  },
};


export default PartnerCard;
