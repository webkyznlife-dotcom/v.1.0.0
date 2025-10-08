// src/components/SubFooter.tsx
import React from 'react';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram, FaSkype, FaWhatsapp } from 'react-icons/fa';
import logo from '../../assets/images/logo.png';

interface SubFooterProps {
  isMobile: boolean;
}

const SubFooter: React.FC<SubFooterProps> = ({ isMobile }) => {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        {/* Logo dan Deskripsi */}
        <div style={styles.logoDesc}>
          {/* <img src={logo} alt="KYZN Logo" style={styles.logo} /> */}
          <p style={styles.description}>
            KYZN is a family and social wellness club that helps families live healthier and happier lives together by embracing continuous positive change inspired by the "Kaizen" philosophy.
          </p>
        </div>

        {/* Social Media */}
        <div style={styles.socialMedia}>
          <a href="https://www.facebook.com/kyzn.kuningan" style={styles.icon} target="_blank" rel="noopener noreferrer">
            {React.createElement(FaFacebookF as React.ElementType)}
          </a>
          {/* <a href="#" style={styles.icon}>
            {React.createElement(FaTwitter as React.ElementType)}
          </a> */}
          <a href="https://www.linkedin.com/in/kyzn/" style={styles.icon} target="_blank" rel="noopener noreferrer">
            {React.createElement(FaLinkedinIn as React.ElementType)}
          </a>
          <a href="https://www.instagram.com/kyzn.kuningan/" style={styles.icon} target="_blank" rel="noopener noreferrer">
            {React.createElement(FaInstagram as React.ElementType)}
          </a>
          <a href="https://wa.me/message/MMKTL43S5AG3J1" style={styles.icon} target="_blank" rel="noopener noreferrer">
            {React.createElement(FaWhatsapp as React.ElementType)}
          </a>
        </div>
      </div>
    </footer>
  );
};

const styles: Record<string, React.CSSProperties> = {
  footer: {
    backgroundColor: '#F8F8F8', // ganti warna background
    padding: '20px',
    width: '100%',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    paddingRight: '0px',
    paddingLeft: '0px',
  },
  logoDesc: {
    fontFamily: 'Raleway',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: '250px',
    gap: '15px',
  },
  logo: {
    height: '30px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  description: {
    fontSize: '14px',
    color: '#333',
    lineHeight: 1.4,
    maxWidth: '450px',
    marginBottom: '0px',
    // marginLeft: '20px',
  },
  socialMedia: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '32px',
    height: '32px',
    backgroundColor: '#e0e0e0',
    borderRadius: '50%',
    color: '#000',
    textDecoration: 'none',
  },
};

export default SubFooter;
