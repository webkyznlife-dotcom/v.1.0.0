// src/components/TestimonialMobileCarousel.tsx
import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { motion } from "framer-motion";
import axios from "axios";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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
    fontSize: "1.4rem",
    marginBottom: "12px",
    letterSpacing: "-0.01em",
    textAlign: "center",
  },
  testimonialName: {
    fontFamily: "Rubik, sans-serif",
    fontWeight: "bold",
    fontSize: "0.95rem",
    marginBottom: 0,
    letterSpacing: "-0.01em",
  },
};

const TestimonialCard: React.FC<{ testimonial: Testimonial; apiUrlImage: string }> = ({ testimonial, apiUrlImage }) => (
  <motion.div
    style={{ padding: "6px" }}
    initial={{ opacity: 1, scale: 1 }}
    whileHover={{ scale: 1.02 }}
    transition={{ duration: 0.3, ease: "easeOut" }}
  >
    <div
      style={{
        background: "#fff",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "#F3F3F3",
          display: "flex",
          alignItems: "center",
          padding: "12px",
          paddingBottom: "24px",
        }}
      >
        <img
          src={`${apiUrlImage}/uploads/customer_testimonial/${testimonial.image}`}
          alt={testimonial.name}
          style={{
            width: 50,
            height: 50,
            borderRadius: "8px",
            objectFit: "cover",
            marginRight: "12px",
          }}
        />
        <div>
          <h4 style={{ margin: 0, ...styles.testimonialName }}>{testimonial.name}</h4>
          <p style={{ fontSize: "12px", color: "#777", margin: 0 }}>{testimonial.role}</p>
        </div>
      </div>

      {/* Preview Button */}
      <div style={{ textAlign: "center", marginTop: "-16px" }}>
        <button
          style={{
            background: "#fff",
            border: "none",
            borderRadius: "8px",
            padding: "6px 14px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            margin: "0 auto",
          }}
          onClick={() => window.open(testimonial.socialUrl, "_blank")}
        >
          <div
            style={{
              width: "18px",
              height: "18px",
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
                borderLeft: "5px solid white",
                borderTop: "3px solid transparent",
                borderBottom: "3px solid transparent",
                marginLeft: "2px",
              }}
            />
          </div>
          <span style={{ fontSize: "12px", fontWeight: "500" }}>Preview</span>
        </button>
      </div>

      {/* Content */}
      <div style={{ padding: "20px", textAlign: "center", backgroundColor: "#ffffff", height: '130px' }}>
        <p
          style={{
            fontSize: "13px",
            color: "#333",
            margin: 0,
            fontFamily: "Rubik, sans-serif",
            lineHeight: "1.3",
          }}
        >
          {testimonial.content}
        </p>
      </div>
    </div>
  </motion.div>
);

const TestimonialMobileCarousel: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.REACT_APP_API_URL;
  const API_URLIMAGE = process.env.REACT_APP_API_IMAGE_URL || "";

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await axios.get(`${API_URL}/user/v1/customer-testimonial`);
        const data = res.data.data.map((item: any) => ({
          id: item.mct_id,
          name: item.mct_name,
          role: item.mct_social_type, // bisa gunakan mapping label jika ada
          image: item.mct_avatar,
          content: item.mct_testimonial,
          socialUrl: item.mct_social_url,
          socialType: item.mct_social_type,
        }));
        setTestimonials(data);
      } catch (err) {
        console.error("Error fetching testimonials:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, [API_URL]);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    centerMode: true,
    centerPadding: "30px",
  };

  if (loading) return <p>Loading testimonials...</p>;

  return (
    <motion.div
      initial={{ opacity: 0, y: -40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{
        maxWidth: "100%",
        margin: "0 auto",
        padding: "25px 14px",
        background: "#E3ECFF",
      }}
    >
      <motion.div
        className="flex justify-between items-center mb-2 pl-3 pr-3"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ amount: 0.3 }}
      >
        <h2 className="text-lg sm:text-sm font-bold text-gray-800 flex items-center gap-2 leading-none">
          Customer Testimonial
          <span className="w-5 h-[2px] bg-red-500 inline-block" />
        </h2>
      </motion.div>

      <p
        className="text-sm mb-4 max-w-sm mx-auto"
        style={{
          fontFamily: "Rubik, sans-serif",
          color: "#555",
          textAlign: "center",
          paddingLeft: "1.2rem",
          paddingRight: "1.2rem",
        }}
      >
        Everyone has their own reasons and journey when it comes to sports.
        Here are some real thoughts and experiences.
      </p>

      <Slider {...settings}>
        {testimonials.map((t) => (
          <TestimonialCard key={t.id} testimonial={t} apiUrlImage={API_URLIMAGE} />
        ))}
      </Slider>
    </motion.div>
  );
};

export default TestimonialMobileCarousel;