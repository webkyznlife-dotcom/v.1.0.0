import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Pages
import DashboardPage from '../pages/dashboard';

interface ContentProps {
  isSidebarOpen: boolean;
  isMobile: boolean;
}

const Content: React.FC<ContentProps> = ({ isSidebarOpen, isMobile }) => {
  return (
    <div style={{ ...styles.container, marginLeft: isSidebarOpen && !isMobile ? '274px' : '0' }}>
      <Routes>
        <Route path="/" element={<DashboardPage isSidebarOpen={isSidebarOpen} isMobile={isMobile} toggleSidebar={function (): void {
          throw new Error('Function not implemented.');
        } } />} />
        <Route path="*" element={<h2>404 - Page Not Found</h2>} />
      </Routes>
    </div>
  );
};

const styles = {
  container: {
    flex: 1, // Memastikan konten mengisi sisa ruang
    padding: '20px', // Beri padding agar konten tidak mepet
    marginTop: '60px', // Jarak dari header agar tidak tertutup
    paddingBottom: '60px', // Jarak ke footer
    transition: 'margin-left 0.3s ease-in-out', // Animasi smooth saat sidebar buka/tutup
  } as React.CSSProperties,
};

export default Content;
