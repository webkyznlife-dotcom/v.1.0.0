import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { motion } from "framer-motion";
import axios from "axios";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../testimonial/styles/custom-dots.css"; 

import { getSocialTypeLabel } from "../../components/testimonial/data/socialTypeMap";

interface Testimonial { 
  id: number;
  name: string;
  role: string;
  image: string;
  content: string;
  socialUrl: string;
  socialType: string;
}

const styles: { [key: string]: React.CSSProperties } = {
  headingAaccess: {
    fontFamily: "Rubik, sans-serif",
    fontWeight: "bold",
    fontSize: "2rem",
    marginLeft: "0.5rem",
    marginBottom: "16px",
    letterSpacing: "-0.01em"
  },
  testimonialName: {
    fontFamily: "Rubik, sans-serif",
    fontWeight: "bold",
    fontSize: "1rem",
    marginBottom: 0,
    letterSpacing: "-0.01em"
  },
};

const TestimonialCard: React.FC<{ testimonial: Testimonial; apiUrlImage: string }> = ({ testimonial, apiUrlImage }) => (
  <motion.div
    style={{ padding: "10px" }}
    initial={{ opacity: 0.7, scale: 1 }}
    whileHover={{ opacity: 1, scale: 1.03 }}
    whileFocus={{ opacity: 1, scale: 1.03 }}
    whileTap={{ opacity: 1, scale: 1.03 }}
    transition={{ duration: 0.3, ease: "easeOut" }}
    tabIndex={0}
  >
    <div
      style={{
        background: "#fff",
        borderRadius: "10px",
        overflow: "hidden",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "#f3f3f3",
          display: "flex",
          alignItems: "center",
          padding: "15px",
          paddingBottom: "35px",
          height: '120px'
        }}
      >
        <img
          src={`${apiUrlImage}/uploads/customer_testimonial/${testimonial.image}`}
          alt={testimonial.name}
          style={{
            width: 60,
            height: 60,
            borderRadius: "10px",
            objectFit: "cover",
            marginRight: "15px",
          }}
        />
        <div style={{ textAlign: "left" }}>
          <h4 style={{ margin: 0, ...styles.testimonialName }}>
            {testimonial.name}
          </h4>
          <p style={{ fontSize: "14px", color: "#888", margin: 0 }}>{testimonial.role}</p>
        </div>
      </div>

      {/* Preview Button */}
      <div style={{ textAlign: "center", marginTop: "-20px" }}>
        <button
          style={{
            background: "#fff",
            border: "none",
            borderRadius: "10px",
            padding: "8px 30px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            margin: "0 auto",
          }}
          onClick={() => window.open(testimonial.socialUrl, "_blank")} // ← ini yang ditambahkan
        >
          {/* Icon YouTube Play */} 
          <div
            style={{
              width: "20px",
              height: "20px",
              borderRadius: "50%",
              backgroundColor: "red",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: 0,
                height: 0,
                borderLeft: "6px solid white",
                borderTop: "4px solid transparent",
                borderBottom: "4px solid transparent",
                marginLeft: "2px",
              }}
            ></div>
          </div>
          <span style={{ fontSize: "14px", fontWeight: "500" }}>Preview</span>
        </button>
      </div>

      {/* Content */}
      <div style={{ padding: "20px", textAlign: "center", background: "#fff", height: '150px' }}>
        <p style={{ fontSize: "14px", color: "#333", margin: 0 }}>
          {testimonial.content}
        </p>
      </div>
    </div>
  </motion.div>
);

const TestimonialCarousel: React.FC = () => {
  const [data, setData] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.REACT_APP_API_URL;
  const API_URLIMAGE = process.env.REACT_APP_API_IMAGE_URL || "";  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_URL}/user/v1/customer-testimonial`);
        const testimonials: Testimonial[] = res.data.data.map((item: any) => ({
          id: item.mct_id,
          name: item.mct_name,
          role: getSocialTypeLabel(item.mct_social_type),
          image: item.mct_avatar,
          content: item.mct_testimonial,
          socialUrl: item.mct_social_url,
          socialType: item.mct_social_type
        }));
        setData(testimonials);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    arrows: false,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 600, settings: { slidesToShow: 1 } },
    ],
  };

  if (loading) return <p>Loading testimonials...</p>;

  return (
    <motion.div
      initial={{ opacity: 0, y: -60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "50px 30px",
        paddingTop: "40px",
        background: "#E3ECFF",
        borderRadius: "10px",
      }}
    >
      <h2 style={{ ...styles.headingAaccess, textAlign: "center" }}>
        Customer Testimonial
      </h2>
      <p className="text-gray-600 max-w-3xl mx-auto mb-4 text-center">
        Everyone has their own reasons and journey when it comes to sports — and we're grateful to be part of that story.
        Here are some real thoughts and experiences from those who've felt the impact firsthand.
      </p>
      <Slider {...settings} className="customer-tersimonial">
        {data.map((t) => (
          <TestimonialCard key={t.id} testimonial={t} apiUrlImage={API_URLIMAGE} />
        ))}
      </Slider>
    </motion.div>
  );
};

export default TestimonialCarousel;
