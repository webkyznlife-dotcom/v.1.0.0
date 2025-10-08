// src/components/Footer.tsx
import React from "react";

interface FooterProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
  isMobile: boolean;
}

const Footer: React.FC<FooterProps> = ({ isSidebarOpen, isMobile }) => {
  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <footer
          style={{
            ...styles.footer,
            left: isSidebarOpen && !isMobile ? "274px" : "0",
            width:
              isSidebarOpen && !isMobile ? "calc(100% - 274px)" : "100%",
          }}
        >
          <p style={{ marginBottom: "0" }}>
            &copy; 2025 KYZN. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    width: "100%",
  },
  content: {
    flex: 1,
    position: "relative",
  },
  footer: {
    backgroundColor: "#FFFFFF",
    color: "#74788D",
    textAlign: "center",
    padding: "10px",
    position: "fixed",
    bottom: "0",
    left: "0",
    right: "0",
    zIndex: 3,
    width: "calc(100% - 274px)",
    borderTop: "1px solid #A6ACAF",
    transition: "width 0.3s ease-in-out, left 0.3s ease-in-out",
  },
};

export default Footer;