// components/FreeTrialHeaderMobile/index.tsx
import React from "react";

interface FreeTrialHeaderMobileProps {
  title?: string;
  breadcrumb?: string;
}

const styles: { [key: string]: React.CSSProperties } = {
  wrapper: {
    position: "relative",
    overflow: "hidden",
    backgroundColor: "#e8f0fb",
    height: "100px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "0 1rem",
  },
  title: {
    fontSize: "1.4rem",
    fontWeight: 700,
    color: "#000",
    lineHeight: 1.1,
    textAlign: "center",
    margin: 0,
    marginBottom: '0rem',
  },
  breadcrumb: {
    color: "#374151",
    fontSize: "0.7rem",
    lineHeight: 1.5,
    textAlign: "center",
    marginBottom: 0,
  },
};

function FreeTrialHeaderMobile({
  title = "FREE TRIAL",
  breadcrumb = "Home / Free Trial",
}: FreeTrialHeaderMobileProps) {
  return (
    <div style={styles.wrapper}>
      <h1 style={styles.title}>{title}</h1>
      <p style={styles.breadcrumb}>{breadcrumb}</p>
    </div>
  );
}

export default FreeTrialHeaderMobile;
