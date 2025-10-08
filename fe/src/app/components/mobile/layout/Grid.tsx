import React, { ReactNode, CSSProperties } from 'react';
import styles from './styles/layout.module.css';

interface GridProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

const Grid: React.FC<GridProps> = ({ children, className = '', style = {} }) => {
  return (
    <div className={`${styles.grid} grid ${className}`} style={style}>
      {children}
    </div>
  );
};

export default Grid;
