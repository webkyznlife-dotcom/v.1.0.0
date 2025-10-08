import React, { useRef, useEffect, useState } from "react";
import { Container } from "../../../components/web/layout";
import ContactUsHeaderMobile from "./components/contact-us-header/index";
import { motion, useInView } from "framer-motion";
import { Form, Input, DatePicker, Select, Button, Row, Col, Checkbox } from "antd";
import ContactFormMobile from "./components/form/ContactForm";

// === Inline Styles ===
const styles: { [key: string]: React.CSSProperties } = { 
  container: {
    paddingTop: "55px",
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

  // === Form Submit Handler ===
  const onFinish = (values: any) => {
    console.log("Form Values:", values);
  };

  return (
    <div style={styles.container}>
      <Container style={{ padding: 0, border: 0, paddingBottom: "50px" }}>
        {/* ================= Header ================= */}
        <ContactUsHeaderMobile
          title="CONTACT US"
          breadcrumb="Home / Contact Us"
        />

        {/* ================= Title + Description ================= */} 
        <div ref={sectionRef} className="mt-4 mb-0 px-6 pt-0">
          <motion.h2
            style={styles.headingAaccess}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            We’re Here to Help
          </motion.h2>

          <motion.p
            style={styles.headingSubAaccess}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          >
            Our friendly team is available every day from 09.00 to 21.00 WIB, ready to assist you and get you started in just 5 minutes!
          </motion.p>
        </div>

        {/* ================= Form Sections ================= */}
        <div className="w-[100%] mx-auto bg-white p-8">
          <ContactFormMobile />
        </div>
      </Container>
    </div>
  );
};

export default FreeTrialWebsite;