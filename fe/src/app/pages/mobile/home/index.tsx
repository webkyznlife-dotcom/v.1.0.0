import React from 'react';
import { Container } from '../../../components/mobile/layout';

import Program from '../../../pages/mobile/home/components/program/program';
import Event from '../../../pages/mobile/home/components/event/event';
import AppPromoBanner from '../../../pages/mobile/home/components/banner/AppPromoBanner';
import OurBranch from '../../../pages/mobile/home/components/branch/OurBranch';
import TestimonialCarousel from '../../../pages/mobile/home/components/testimonial/TestimonialCarousel';
import Collaboration from '../../../pages/mobile/home/components/collaboration/Collaboration';

import { motion } from "framer-motion"; 

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        paddingTop: '55px',
        transition: 'margin-left 0.3s ease-in-out',
    },

    bannerText: {
        textAlign: 'center',
        marginBottom: '20px',
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
    },

    video: {
        width: '100%',
        height: 'auto',
        display: 'block',
    },

    overlay: {
        position: 'absolute',
        top: '50%',
        left: '60px',
        transform: 'translateY(-50%)',
        color: '#fff',
        textAlign: 'left',
        maxWidth: '500px',
    },

    heroTitle: {
        fontSize: '48px',
        fontWeight: 'bold',
        lineHeight: 1.2,
        marginBottom: '20px',
    },

    buttonGroup: {
        display: 'flex',
        gap: '15px',
    },

    primaryButton: {
        padding: '12px 24px',
        fontSize: '16px',
        border: 'none',
        borderRadius: '25px',
        backgroundColor: '#2e7d32',
        color: '#fff',
        cursor: 'pointer',
    },

    secondaryButton: {
        padding: '12px 24px',
        fontSize: '16px',
        borderRadius: '25px',
        border: '1px solid #fff',
        backgroundColor: 'transparent',
        color: '#fff',
        cursor: 'pointer',
    },

    headingAaccess: {
        fontFamily: "Rubik, sans-serif",
        fontWeight: "bold",
        fontSize: "1.3rem",
        marginLeft: "0.5rem",
        marginBottom: 0,
        letterSpacing: "-0.02em",
        paddingLeft: "1.5rem",
        paddingRight: "1.5rem",
    },

    headingSubAaccess: {
        fontFamily: "Rubik, sans-serif",
        fontWeight: "normal",
        fontSize: '0.8rem',
        color: '#777',
        marginTop: '8px',
        paddingLeft: "1.5rem",
        paddingRight: "1.5rem",
    },
};

const Home: React.FC = () => {
    return (
        <div style={styles.container}>
            <Container style={{ padding: 0, border: 0, paddingBottom: '70px' }}>
                <Container style={{ padding: 0, border: 0 }}>
                    <div
                        style={{
                            position: 'relative',
                            width: '100%',
                            height: '100vh',
                            overflow: 'hidden',
                            textAlign: 'center',
                        }}
                    >
                        <video
                            src="/videos/compro2024.mp4"
                            autoPlay
                            muted
                            loop
                            playsInline
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                            }}
                        />

                        <div
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                background: 'rgba(0,0,0,0.4)',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                padding: '0 20px',
                                boxSizing: 'border-box',
                            }}
                        >
                            <h1
                                style={{
                                    color: '#fff',
                                    fontSize: '28px',
                                    lineHeight: '1.3',
                                    fontWeight: '700',
                                    textAlign: 'center',
                                    marginBottom: '20px',
                                }}
                            >
                                The Leading<br />Destination For<br />Family Wellness
                            </h1>

                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '12px',
                                    width: '100%',
                                    maxWidth: '250px',
                                }}
                            >
                                <button
                                    style={{
                                        background: 'linear-gradient(135deg, #2b3dff 0%, #5f6dff 100%)',
                                        border: 'none',
                                        borderRadius: '12px',
                                        padding: '14px 0',
                                        color: '#fff',
                                        fontWeight: '600',
                                        fontSize: '16px',
                                        cursor: 'pointer',
                                        width: '100%',
                                    }}
                                >
                                    Download Our App
                                </button>

                                <button
                                    style={{
                                        background: 'transparent',
                                        border: '2px solid #fff',
                                        borderRadius: '12px',
                                        padding: '14px 0',
                                        color: '#fff',
                                        fontWeight: '600',
                                        fontSize: '16px',
                                        cursor: 'pointer',
                                        width: '100%',
                                    }}
                                >
                                    Contact Us
                                </button>
                            </div>
                        </div>
                    </div>
                </Container>

                <Program />

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
                        Join now and get unlimited access
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

                <Event />
                <AppPromoBanner />
                <OurBranch />
                <TestimonialCarousel />
                <Collaboration />
            </Container>
        </div>
    );
};

export default Home;
