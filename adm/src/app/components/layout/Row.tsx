import React, { ReactNode, CSSProperties } from 'react';
import styles from './styles/layout.module.css'; // Optional, jika pakai CSS Modules

interface RowProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

const Row: React.FC<RowProps> = ({ children, className = '', style = {} }) => {
  return (
    <div className={`${styles.row} ${className}`} style={style}>
      {children}
    </div>
  );
};

export default Row;
