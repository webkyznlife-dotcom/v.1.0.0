import React, { ReactNode, CSSProperties } from 'react';
import styles from './styles/layout.module.css'; // Mengimpor CSS Module

interface WrapperProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

const Wrapper: React.FC<WrapperProps> = ({ children, className = '', style = {} }) => {
  return (
    <div className={`${styles.wrapper} ${className}`} style={style}>
      {children}
    </div>
  );
};

export default Wrapper;