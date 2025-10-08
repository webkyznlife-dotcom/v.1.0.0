import React, { useRef, useEffect, useState } from "react";
import { Container } from "../../../components/web/layout";
import FreeTrialHeader from "./components/free-trial-header/index";
import { motion, useInView } from "framer-motion";
import { Form, Select} from "antd";

// === Inline Styles ===
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    // paddingTop: "55px",
    transition: "margin-left 0.3s ease-in-out",
  },
  headingAaccess: {
    fontFamily: "Rubik, sans-serif",
    fontWeight: "normal",
    fontSize: "2.1rem",
    marginBottom: "0.5rem",
    letterSpacing: "-0.02em",
    textAlign: "center",
  },
  headingSubAaccess: {
    fontFamily: "Rubik, sans-serif",
    fontWeight: "normal",
    fontSize: "1rem",
    color: "#555",
    maxWidth: "700px",
    margin: "0 auto",
    textAlign: "center",
    lineHeight: 1.6,
  },
};

const { Option } = Select;

const FreeTrialWebsite: React.FC = () => {
  // === Refs & Animation View ===
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { amount: 0.3 });

  // === Form Instance ===
  const [form] = Form.useForm();

  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
  }, []);  


  return (
    <div style={styles.container}>
      <Container style={{ padding: 0, border: 0, paddingBottom: "50px" }}>
        {/* ================= Header ================= */}
        <FreeTrialHeader
          title="BUY DAILY PASS"
          breadcrumb="Home / Buy Daily Pass"
        />

        {/* ================= Title + Description ================= */}
        <div ref={sectionRef} className="mt-16 mb-12 px-6 pt-0 w-[50%] mx-auto">
          <motion.h2
            style={styles.headingAaccess}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            Wellness for All, One Day at a Time
          </motion.h2>

          <motion.p
            style={styles.headingSubAaccess}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          >
          With a Daily Pass, you and your family can enjoy full access to a wide range of facilities, including the Olympic Pool, Leisure Pool, and Kids Pool, jogging track, sauna, children’s playground, and comfortable changing rooms. Whether for fun, fitness, or relaxation, everything you need is all in one complete package.
          </motion.p>
        </div>

        {/* ================= Form Sections ================= */}
        <div className="w-[60%] mx-auto bg-white p-8">

          {/* Iframe Goers Ticketing */}
          <iframe
            src="https://goers.co/tiketkyznbsd"
            title="KYZN BSD Ticketing"
            style={{
              width: "100%",
              height: "800px",
              border: "none",
            }}
          />
          
        </div>

      </Container>
   
    </div>
  );
};

export default FreeTrialWebsite;