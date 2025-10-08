// src/components/HeaderMobile.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/images/logo.png';  
import { Link } from 'react-router-dom'; 
import axios from "axios";

const HeaderMobile: React.FC = () => {
  const navigate = useNavigate();

  const API_URL = process.env.REACT_APP_API_URL;

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
    <header style={styles.header}>
      <div style={styles.container}>
        {/* Logo dan tulisan KYZN */}
        <div style={styles.logoWrapper} onClick={() => navigate('/')}>
          <img src={logo} alt="KYZN Logo" style={styles.logo} />
          <span style={styles.logoText}>KYZN</span>
        </div>

        {/* Tombol aksi di kanan header */}
        <div style={styles.buttons}>
          <Link to="/buy-daily-pass" style={styles.primaryButton}>
            Daily Pass
          </Link>          
          <Link to="/free-trial" style={styles.secondaryButton}>
            Trial / Tour
          </Link>
        </div>
      </div>
    </header>
  );
};

const styles: Record<string, React.CSSProperties> = {
  header: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: '#000',
    height: '56px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
  },
  container: {
    maxWidth: '1200px',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 10px',
    boxSizing: 'border-box',
  },
  logoWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    cursor: 'pointer',
  },
  logo: {
    height: '20px',
  },
  logoText: {
    color: '#fff',
    fontSize: '16px',
    fontWeight: 'normal',
    fontFamily: 'Rubik, sans-serif',
    lineHeight: '20px',
  },
  buttons: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  primaryButton: {
    background: 'linear-gradient(135deg, #2b3dff 0%, #5f6dff 100%)',
    border: 'none',
    borderRadius: '6px',          // kecil, biar mobile friendly
    color: '#fff',
    padding: '4px 8px',           // ramping
    cursor: 'pointer',
    fontSize: '11px',             // kecil agar pas
    fontWeight: 600,
    boxShadow: '0 1px 3px rgba(43, 61, 255, 0.25)',
    textDecoration: 'none'
  },
  secondaryButton: {
    background: 'linear-gradient(135deg, #d40000 0%, #ff4d4d 100%)',
    border: 'none',
    borderRadius: '6px',
    color: '#fff',
    padding: '4px 8px',
    cursor: 'pointer',
    fontSize: '11px',
    fontWeight: 600,
    boxShadow: '0 1px 3px rgba(212, 0, 0, 0.25)',
    textDecoration: 'none',
  },
};

export default HeaderMobile;
