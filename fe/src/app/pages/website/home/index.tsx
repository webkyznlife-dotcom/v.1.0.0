import React, { useState, useEffect } from 'react';
import { Container } from '../../../components/web/layout';

import Program from '../../../pages/website/home/components/program/program';
import Event from '../../../pages/website/home/components/event/event';
import AppPromoBanner from '../../../pages/website/home/components/banner/AppPromoBanner';
import OurBranch from '../../../pages/website/home/components/branch/OurBranch';
import TestimonialCarousel from '../../../pages/website/home/components/testimonial/TestimonialCarousel';
import Collaboration from '../../../pages/website/home/components/collaboration/Collaboration';

import { motion, AnimatePresence } from "framer-motion";

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        transition: 'margin-left 0.3s ease-in-out',
    },

    bannerText: {
        textAlign: 'center',
        marginBottom: '40px',
    },

    title: {
        fontSize: '28px',
        fontWeight: 'bold',
        lineHeight: 1.4,
    },

    subtitle: {
        fontSize: '14px',
        color: '#777',
        marginTop: '8px',
    },

    heroSection: {
        position: 'relative',
        width: '100%',
        overflow: 'hidden',
        height: '600px',
    },

    video: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        display: 'block',
    },

    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.4)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },

    overlayContent: {
        maxWidth: '1200px',
        width: '100%',
        textAlign: 'center',
        color: '#fff',
        padding: '20px',
        paddingLeft: '0px',
        marginTop: '-50px',
    },

    heroTitle: {
        fontSize: '48px',
        fontWeight: 'bold',
        lineHeight: 1,
        marginBottom: '20px',
        textAlign: "left",
    },

    buttonGroup: {
        display: 'flex',
        gap: '15px',
    },

    primaryButton: {
        padding: '12px 24px',
        fontSize: '16px',
        border: 'none',
        borderRadius: '10px',
        backgroundColor: '#2e7d32',
        color: '#fff',
        cursor: 'pointer',
    },

    secondaryButton: {
        padding: '12px 24px',
        fontSize: '16px',
        borderRadius: '10px',
        border: '1px solid #fff',
        backgroundColor: 'transparent',
        color: '#fff',
        cursor: 'pointer',
    },

    headingAaccess: {
        fontFamily: "Rubik, sans-serif",
        fontWeight: "bold",
        fontSize: "2.5rem",
        marginLeft: "0.5rem",
        marginBottom: 0,
        letterSpacing: "-0.02em",
    },

    headingSubAaccess: {
        fontFamily: "Rubik, sans-serif",
        fontWeight: "normal",
        fontSize: '1rem',
        color: '#777',
        marginTop: '8px',
    },
};

const HomeWebsite: React.FC = () => {
    const [showOverlay, setShowOverlay] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setShowOverlay((prev) => !prev);
        }, 6000); // setiap 6 detik toggle fade in/out

        return () => clearInterval(interval);
    }, []);

    return (
        <div style={styles.container}>
            <Container style={{ padding: 0, border: 0 }}>
                {/* Hero Section */}
                <Container style={{ padding: 0, border: 0 }}>
                    <div style={styles.heroSection}>
                        <video
                            src="/videos/compro2024.mp4"
                            autoPlay
                            muted
                            loop
                            playsInline
                            style={styles.video}
                        />
                        <div style={styles.overlay}>
                            <AnimatePresence>
                                {showOverlay && (
                                    <motion.div
                                        key="overlayContent"
                                        style={styles.overlayContent}
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -30 }}
                                        transition={{ duration: 1 }}
                                    >
                                        <h1 style={styles.heroTitle}>
                                            The Leading<br />Destination For<br />Family Wellness
                                        </h1>

                                        <p style={{
                                            fontSize: '18px',
                                            color: '#fff',
                                            marginTop: '20px',
                                            lineHeight: 1.5,
                                            textAlign: 'left',
                                            maxWidth: '30%',
                                            marginBottom: '30px'
                                        }}>
                                            Welcome to our family wellness center, where we offer a wide range of classes and activities designed to keep you healthy, active, and happy.
                                        </p>

                                        <div style={styles.buttonGroup}>
                                            <button style={styles.primaryButton}>Download Our App</button>
                                            <button style={styles.secondaryButton}>Contact Us</button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </Container>

                {/* Program Section */}
                <Program />

                {/* Banner Text Section */}
                <motion.div
                    style={styles.bannerText}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 40 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    viewport={{ once: false, amount: 0.3 }}
                >
                    <motion.h2
                        style={styles.headingAaccess}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 1.4, ease: "easeOut" }}
                        viewport={{ once: false, amount: 0.3 }}
                    >
                        Join now and get unlimited access <br />
                        to 40+ exciting classes!
                    </motion.h2>

                    <motion.p
                        style={styles.headingSubAaccess}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 1.6, ease: "easeOut", delay: 0.2 }}
                        viewport={{ once: false, amount: 0.3 }}
                    >
                        Led by fun, supportive coaches who keep you moving and motivated!
                    </motion.p>
                </motion.div>

                {/* Other Sections */}
                <Event />
                <AppPromoBanner />
                <OurBranch />
                <TestimonialCarousel />
                <Collaboration />
            </Container>
        </div>
    );
};

export default HomeWebsite;
