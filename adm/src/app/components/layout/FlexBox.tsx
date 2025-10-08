import React, { ReactNode, CSSProperties } from 'react';
import styles from './styles/layout.module.css';

interface FlexBoxProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
}

const FlexBox: React.FC<FlexBoxProps> = ({
  children,
  className = '',
  style = {},
  direction = 'row',
}) => {
  return (
    <div
      className={`${styles.flexBox} flex-box ${className}`}
      style={{ flexDirection: direction, ...style }}
    >
      {children}
    </div>
  );
};

export default FlexBox;