import React, { ReactNode, CSSProperties } from 'react';
import styles from './styles/layout.module.css'; // Mengimpor CSS Module

interface SectionProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

const Section: React.FC<SectionProps> = ({ children, className = '', style = {} }) => {
  return (
    <section className={`section ${className}`} style={{ ...style }}>
      {children}
    </section>
  );
};

export default Section;
