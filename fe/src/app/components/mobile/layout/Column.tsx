import React, { CSSProperties, ReactNode } from 'react';
import styles from './styles/layout.module.css'; // Import CSS Module for styling

interface ColumnProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  size?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12; // size dari 1 sampai 12
}

const Column: React.FC<ColumnProps> = ({
  children,
  className = '',
  style = {},
  size = 12,
}) => {
  // Dynamically use class like 'col-6', 'col-12', etc.
  const columnClass = styles[`col-${size}`];

  const columnStyle: CSSProperties = {
    marginBottom: '16px', // default margin-bottom
    ...style, // Merge additional styles
  };

  return (
    <div className={`${columnClass} ${className}`} style={columnStyle}>
      {children}
    </div>
  );
};

export default Column;
