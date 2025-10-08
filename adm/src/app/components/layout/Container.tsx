import React, { ReactNode, CSSProperties } from 'react';
import styles from './styles/layout.module.css'; // CSS Module

interface ContainerProps {
  children: ReactNode;          // Konten wajib di dalam container
  className?: string;           // Optional tambahan className
  style?: CSSProperties;        // Optional style inline
}

const Container: React.FC<ContainerProps> = ({
  children,
  className = '',
  style = {},
}) => {
  return (
    <div className={`${styles.container} ${className}`} style={style}>
      {children}
    </div>
  );
};

export default Container;
