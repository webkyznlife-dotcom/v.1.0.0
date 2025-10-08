// src/components/Header.tsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import logo from "../../assets/images/logo.png";
import axios from "axios";

interface HeaderProps {
  toggleSidebar: () => void;
  isMobile: boolean;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, isMobile }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isHovered, setIsHovered] = useState<string | null>(null);

   const API_URL = process.env.REACT_APP_API_URL;

  const menus = [
    { label: "Home", path: "/" },
    { label: "What is KYZN", path: "/what-is-kyzn" },
    { label: "Programs", path: "/programs" },
    { label: "Schedules", path: "/schedules" },
    { label: "Events", path: "/events" },
    { label: "Contact Us", path: "/contact-us" }, // langsung ke url
  ];

  // ---- INSERT VISITOR LOG ----
  useEffect(() => {
    const logVisitor = async () => {
      try {
        // 1. Ambil IP publik visitor
        const ipRes = await axios.get("https://api.ipify.org?format=json");
        const ip = ipRes.data.ip;

        // 2. Ambil lokasi berdasarkan IP
        const geoRes = await axios.get(`https://geolocation-db.com/json/${ip}&position=true`);
        const city = geoRes.data.city || "";
        const country = geoRes.data.country_name || "";

        // 3. Kirim data ke backend
        await axios.post(API_URL + "/user/v1/log-visitor/insert-visitor", {
          tv_ip_address: ip,
          tv_user_agent: navigator.userAgent,
          tv_page: window.location.pathname,
          tv_city: city,
          tv_country: country,
        });

        console.log("Visitor logged successfully");
      } catch (err) {
        console.error("Failed to log visitor:", err);
      }
    };

    logVisitor();
  }, []); // hanya dijalankan sekali saat mount  

  return (
    <>
      <header style={styles.header}>
        <div style={styles.container}>
          {/* Logo */}
          <img
            src={logo}
            alt="KYZN Logo"
            style={styles.logo}
            onClick={() => navigate("/")}
          />

          {/* Mobile menu button */}
          {isMobile && (
            <button style={styles.mobileMenuButton} onClick={toggleSidebar}>
              {React.createElement(FiMenu as React.ElementType, {
                size: 24,
                color: "#fff",
              })}
            </button>
          )}

          {/* Desktop Menu */}
          {!isMobile && (
            <>
              <nav style={styles.nav}>
                {menus.map((menu) => {
                  const isActive = location.pathname === menu.path;
                  return (
                    <div
                      key={menu.path}
                      style={{
                        ...styles.navItemWrapper,
                        borderBottom: isActive
                          ? "3px solid #00B6BD"
                          : "3px solid transparent",
                        transition: "border-color 0.3s ease",
                      }}
                      onMouseEnter={() => setIsHovered(menu.path)}
                      onMouseLeave={() => setIsHovered(null)}
                      onClick={() => navigate(menu.path)}
                    >
                      <span
                        style={{
                          ...styles.navItem,
                          color: isActive ? "#00B6BD" : "#fff",
                          fontWeight: isActive ? 600 : 400,
                        }}
                      >
                        {menu.label}
                      </span>
                    </div>
                  );
                })}
              </nav>

              <div style={styles.buttons}>
                <a
                  href="buy-daily-pass"
                  style={{ ...styles.primaryButton, textDecoration: "none" }}
                >
                  Buy Daily Pass
                </a>
                <a
                  href="/free-trial"
                  style={{ ...styles.secondaryButton, textDecoration: "none" }}
                >
                  Book a Trial / Tour
                </a>
              </div>
            </>
          )}
        </div>
      </header>
    </>
  );
};

const styles: Record<string, React.CSSProperties> = {
  header: {
    // position: "fixed",
    backgroundColor: "#000",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    display: "flex",
    justifyContent: "center",
    boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
    height: "65px", // tinggi header website, sesuaikan jika perlu
    },
    container: {
    maxWidth: "1200px",
    width: "100%",
    backgroundColor: "#000",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0px",
    boxSizing: "border-box",
    height: "65px", // pastikan container juga sama tingginya
    // boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
  },
  logo: {
    height: "25px",
    cursor: "pointer",
  },
  nav: {
    display: "flex",
    gap: "30px",
    height: "100%",
  },
  navItemWrapper: {
    height: "65px",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
  },
  navItem: {
    fontSize: "14px",
    fontFamily: "sans-serif",
    transition: "color 0.2s ease",
  },
  buttons: {
    display: "flex",
    gap: "10px",
  },
  button: {
    border: "none",
    borderRadius: "20px",
    color: "#fff",
    padding: "8px 16px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: 600,
  },
  mobileMenuButton: {
    background: "none",
    border: "none",
    cursor: "pointer",
  },
  primaryButton: {
    background: "linear-gradient(135deg, #2b3dff 0%, #5f6dff 100%)",
    border: "none",
    borderRadius: "10px",
    color: "#fff",
    padding: "6px 16px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 600,
    boxShadow: "0 2px 6px rgba(43, 61, 255, 0.25)",
    transition: "all 0.3s ease",
  },
  secondaryButton: {
    background: "linear-gradient(135deg, #d40000 0%, #ff4d4d 100%)",
    border: "none",
    borderRadius: "10px",
    color: "#fff",
    padding: "6px 16px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 600,
    boxShadow: "0 2px 6px rgba(212, 0, 0, 0.25)",
    transition: "all 0.3s ease",
  },
};

export default Header;
