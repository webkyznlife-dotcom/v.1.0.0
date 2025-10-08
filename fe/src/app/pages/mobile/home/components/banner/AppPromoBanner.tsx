// src/components/AppPromoBannerMobile.tsx
import React from "react";
import appStoreLogo from "../../../../../assets/images/appstore_2.png";
import googlePlayLogo from "../../../../../assets/images/googleplay_1.png";
import appScreenshot1 from "../../../../../assets/images/device.png";

const AppPromoBannerMobile: React.FC = () => {
  return (
    <div style={styles.container}>
      <div style={styles.textContainer}>
        <h1 style={styles.title}>Get Our Apps Now!</h1>
        <p style={styles.subtitle}>
          Elevate Your Game: Empowering Fitness, Sports, and Wellness.
        </p>
        <div style={styles.buttonContainer}>
          <a href="https://apps.apple.com" target="_blank" rel="noreferrer">
            <img src={appStoreLogo} alt="Download on the App Store" style={styles.storeButton} />
          </a>
          <a href="https://play.google.com" target="_blank" rel="noreferrer">
            <img src={googlePlayLogo} alt="Get it on Google Play" style={styles.storeButton} />
          </a>
        </div>
      </div>
      <div style={styles.screenshotContainer}>
        <img src={appScreenshot1} alt="App Screenshot 1" style={styles.screenshot} />
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    flexDirection: "column", // stack vertical
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    paddingBottom: "0px",
    background: `
      radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 70%),
      linear-gradient(90deg, #1a1a1a, #333)
    `,
    color: "#fff",
    gap: "20px",
  },
  textContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    width: "100%",
    maxWidth: "350px",
  },
  title: {
    fontSize: "1.3rem",
    fontWeight: "bold",
    marginBottom: "5px",
    fontFamily: "Poppins, sans-serif",
  },
  subtitle: {
    fontSize: "0.8rem",
    lineHeight: "1rem",
    fontWeight: "normal",
    marginBottom: "20px",
    fontFamily: "Poppins, sans-serif",
    width: "70%",
    maxWidth: "350px",
  },
  buttonContainer: {
    display: "flex",
    gap: "15px",
    justifyContent: "center",
  },
  storeButton: {
    width: "110px",
    cursor: "pointer",
  },
  screenshotContainer: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
  },
  screenshot: {
    width: "280px",
  },
};

export default AppPromoBannerMobile;
