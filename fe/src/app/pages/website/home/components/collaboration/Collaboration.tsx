import React, { useRef, useEffect, useState } from 'react';
import PartnerCard from './PartnerCard';
import { motion, cubicBezier, useInView } from 'framer-motion';
import axios from 'axios';

interface Partner {
  mc_id: number;
  mc_name: string;
  mc_description: string;
  mc_image: string;
  mc_status: boolean;
}

const fadeUp = {
  hidden: { opacity: 0, y: 40, transition: { duration: 0.7, ease: cubicBezier(0.42, 0, 0.58, 1) } },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: cubicBezier(0.42, 0, 0.58, 1) } },
};

const slideHorizontal = {
  hidden: { opacity: 0, x: 80, transition: { duration: 0.7, ease: cubicBezier(0.42, 0, 0.58, 1) } },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: cubicBezier(0.42, 0, 0.58, 1) } },
  exit: { opacity: 0, x: -80, transition: { duration: 0.7, ease: cubicBezier(0.42, 0, 0.58, 1) } },
};

const Collaboration: React.FC = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.3 });

  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.REACT_APP_API_URL;
  const API_URLIMAGE = process.env.REACT_APP_API_IMAGE_URL;   

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const token = localStorage.getItem('token'); 
        const response = await axios.get(`${API_URL}/user/v1/collaboration`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPartners(response.data.data);
      } catch (error) {
        console.error('Error fetching partners:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPartners();
  }, []);

  return (
    <motion.section
      ref={ref}
      style={styles.section}
      variants={fadeUp}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
    >
      <motion.h2 style={styles.title} variants={fadeUp} animate={inView ? "visible" : "hidden"} initial="hidden">
        Collaboration With
      </motion.h2>
      <motion.p
        style={styles.description}
        variants={slideHorizontal}
        initial="hidden"
        animate={inView ? "visible" : "exit"}
      >
        We are proud to collaborate with remarkable partners who share our vision in creating
        meaningful impact through innovation, dedication, and lasting partnerships.
      </motion.p>
      <motion.div
        style={styles.logosContainer}
        variants={fadeUp}
        animate={inView ? "visible" : "hidden"}
        initial="hidden"
      >
        {loading ? (
          <p>Loading...</p>
        ) : (
          partners.map((partner) => (
            <PartnerCard
              key={partner.mc_id}
              partner={{
                name: partner.mc_name,
                logo: API_URLIMAGE +'/uploads/collaborations/'+ partner.mc_image,
              }}
            />
          ))
        )}
      </motion.div>
    </motion.section>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  section: { textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 40px', paddingTop: '40px' },
  title: { fontSize: '2rem', fontWeight: 'bold', marginBottom: '16px', fontFamily: "Rubik, sans-serif", letterSpacing: "-0.01em" },
  description: { maxWidth: '700px', margin: '0 auto 40px', color: '#555' },
  logosContainer: { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '14px', width: '100%', maxWidth: '1200px', marginLeft: '-7px', marginRight: '-7px' },
};

export default Collaboration;