// src/components/Header.tsx
import React, { useState } from "react";
import { useLocation } from "react-router-dom"; 
import { FiLogOut, FiMenu } from "react-icons/fi";
import { getAuthToken } from "../services/ApiService";

// Definisi props untuk Header
interface HeaderProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
  isMobile: boolean;
}

// Tipe user yang dikembalikan dari getAuthToken
interface User {
  fullname?: string;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, isSidebarOpen, isMobile }) => {
  const location = useLocation();

  // Casting supaya TypeScript tidak error, tetap menggunakan interface lokal User
  const user: User | null = getAuthToken() as User | null;

  const [isMenuHovered, setIsMenuHovered] = useState<boolean>(false);

  const path = location.pathname;

  const getTitle = (): string => {
    const parts = path.split("/").filter(Boolean); 
    let title = parts.length > 1 ? parts[parts.length - 1] : parts[0];
  
    title = title.replace(/-/g, " "); 
    title = title.replace(/\b\w/g, (char) => char.toUpperCase()); 
  
    return title || "Dashboard";
  };

  const setLogout = (): void => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("token");
    window.location.href = "/admin/login";
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <header
          style={{
            ...styles.header,
            left: isSidebarOpen && !isMobile ? "274px" : "0",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <FiMenu
              style={{
                marginRight: "10px",
                fontSize: "1.2rem",
                cursor: "pointer",
                color: isMenuHovered ? "black" : "black",
                transition: "color 0.2s ease-in-out",
              }}
              onClick={toggleSidebar}
              onMouseEnter={() => setIsMenuHovered(true)}
              onMouseLeave={() => setIsMenuHovered(false)}
            />
            <h1 style={styles.left}>{getTitle()}</h1>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={styles.right}>{user?.fullname || "Guest"}</span>
            <FiLogOut
              style={{ marginLeft: "10px", cursor: "pointer" }}
              onClick={setLogout}
            />
          </div>
        </header>
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
  header: {
    backgroundColor: "#FFFFFF",
    padding: "10px 20px",
    color: "#212B36",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    position: "fixed",
    top: 0,
    right: 0,
    zIndex: 3,
    height: "60px",
    transition: "left 0.3s ease-in-out",
    boxShadow:
      "0 3px 5px rgba(0,0,0,.02), 0 0 2px rgba(0,0,0,.05), 0 1px 4px rgba(0,0,0,.08)",
  },
  left: {
    fontSize: "1.2rem",
    marginBottom: 0,
    fontFamily: "Pontano Sans, sans-serif",
    fontWeight: 700,
  },
  right: {
    fontFamily: "Pontano Sans, sans-serif",
  },
};

export default Header;
