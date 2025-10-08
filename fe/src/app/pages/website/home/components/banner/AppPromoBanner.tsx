// src/components/AppPromoBanner.tsx
import React from "react";
import appStoreLogo from "../../../../../assets/images/appstore_2.png"; 
import googlePlayLogo from "../../../../../assets/images/googleplay_1.png"; 
import appScreenshot1 from "../../../../../assets/images/device.png"; 

const AppPromoBanner: React.FC = () => {
  return (
    <section style={styles.container}>
      <div style={styles.wrapper}>
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
    </section>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    width: '100%',
    background: `
      radial-gradient(circle at top left, rgba(255,255,255,0.15) 0%, transparent 40%),
      linear-gradient(135deg, #3a7bd5, #3a6073, #8e44ad)
    `,
    color: "#fff",
    display: "flex",
    justifyContent: "center",
    boxSizing: "border-box",
  },
  wrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    maxWidth: "1200px",
    width: "100%",
    paddingLeft: "130px",
    paddingRight: "130px",
    boxSizing: "border-box",
  },
  textContainer: {
    flex: 1,
    minWidth: "300px",
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: "bold",
    marginBottom: "10px",
    fontFamily: "Raleway, sans-serif",
  },
  subtitle: {
    fontSize: "1rem",
    marginBottom: "30px",
    width: "300px",
  },
  buttonContainer: {
    display: "flex",
    gap: "20px",
    marginBottom: "50px",
  },
  storeButton: {
    width: "130px",
    cursor: "pointer",
  },
  screenshotContainer: {
    display: "flex",
    gap: "20px",
    flex: 1,
    justifyContent: "flex-end",
    minWidth: "300px",
  },
  screenshot: {
    width: "448px",
  },
};

export default AppPromoBanner;
