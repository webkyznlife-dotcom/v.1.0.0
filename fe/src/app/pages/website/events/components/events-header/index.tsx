// components/EventsHeader/index.tsx
import React from "react";
import bgLines from "../../../../../assets/images/headers/header-events.jpg";

interface EventsHeaderProps {
  title?: string;
  breadcrumb?: string;
}

const styles: { [key: string]: React.CSSProperties } = {
  wrapper: {
    position: "relative",
    overflow: "hidden",
    backgroundColor: "#e8f0fb",
    height: "330px",
  },
  background: {
    position: "absolute",
    inset: "0",
    backgroundImage: `url(${bgLines})`,
    backgroundSize: "cover",
    opacity: 1,
  },
  container: {
    position: "relative",
    zIndex: 10,
    // maxWidth: "1280px",
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "7rem 7rem",
    // paddingLeft: "5rem", // geser kanan
    paddingLeft: "0rem", // geser kanan
  },
  title: {
    fontSize: "2rem", // text-3xl
    fontWeight: 700,
    color: "#000",
  },
  breadcrumb: {
    marginTop: "0.5rem", // mt-2
    color: "#374151", // text-gray-700
  },
};

function EventsHeader({
  title = "PROGRAMS",
  breadcrumb = "Home / Programs",
}: EventsHeaderProps) {
  return (
    <div style={styles.wrapper}>
      {/* Background garis abstrak */}
      <div style={styles.background} />

      {/* Container */}
      <div style={styles.container}>
        <h1 style={styles.title}>{title}</h1>
        <p style={styles.breadcrumb}>{breadcrumb}</p>
      </div>
    </div>
  );
}

export default EventsHeader;
