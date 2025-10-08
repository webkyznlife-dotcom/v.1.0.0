import React, { CSSProperties, ReactNode } from 'react';
import styles from './styles/layout.module.css'; // Import CSS Module for styling

interface BoxProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

const Box: React.FC<BoxProps> = ({ children, className = '', style = {} }) => {
  // Combine the passed className with styles.box if required
  const cardStyle: CSSProperties = {
    ...style, // Merge any additional styles passed via props
  };

  return (
    <div className={`${styles.box} ${className}`} style={cardStyle}>
      {children}
    </div>
  );
};

export default Box;
