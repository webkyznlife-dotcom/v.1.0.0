import React, { useState, useRef } from "react";
import { MailOutlined, PhoneOutlined, ClockCircleOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Modal, Carousel, Button } from "antd";

interface FooterProps {
  toggleSidebar?: () => void; 
  isMobile: boolean;
}

const instagramImages = [
  "https://bsdcity-official.com/wp-content/uploads/2025/06/lapangan-basket-kyzn-kyzn-bsd-basketball-court-KYZN-BSD-harga-Tiket-masuk-768x512.jpg",
  "https://linketo.fra1.cdn.digitaloceanspaces.com/5908-17041854150.jpg",
  "https://framerusercontent.com/images/h6tHUByrFLWP15irkBfWl8EvT8.webp",
  "https://framerusercontent.com/images/pQuImFPiRZyhvfRc5huwbAIXWE.webp",
  "https://linketo.fra1.cdn.digitaloceanspaces.com/5908-17041853990.jpg",
  "https://classpass-res.cloudinary.com/image/upload/f_auto/q_auto/jhxfdatzpezwfjixfijy.jpg",
  "https://framerusercontent.com/images/J9uXhZvXmuKboZvQr305NF1q838.webp",
  "https://linketo.fra1.cdn.digitaloceanspaces.com/5908-17041848240.jpg",
];

const Footer: React.FC<FooterProps> = ({ isMobile }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const carouselRef = useRef<any>(null);

  return (
    <footer style={styles.footer}>
      <div style={styles.content}>
        <div style={styles.topSection}>
          <div style={styles.workingHours}>
            <h3 style={styles.title}>WORKING HOURS</h3>
            <p style={styles.description}>
              Our friendly team is here for you daily from 09.00 to 21.00 WIB — ready to get you set up in just 5 minutes!
            </p>
            <div style={styles.contactItem}>
              <MailOutlined style={styles.icon} /> hello@kyzn.life
            </div>
            <div style={styles.contactItem}>
              <PhoneOutlined style={styles.icon} /> +62811-8601000 (Whatsapp Only)
            </div>
            <div style={styles.contactItem}>
              <ClockCircleOutlined style={styles.icon} /> Open Daily: 06:00 - 22:00 WIB
            </div>
          </div>

          <div style={styles.instagram}>
            <h3 style={styles.title}>OUR PHOTO GALLERY</h3>
            <div style={styles.grid}>
              {instagramImages.map((img, index) => (
                <div
                  key={index}
                  style={{
                    ...styles.instagramItem,
                    backgroundImage: `url(${img})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    cursor: "pointer",
                  }}
                  onClick={() => { setStartIndex(index); setIsModalOpen(true); }}
                />
              ))}
            </div>
          </div>
        </div>

        <div style={styles.bottomBar}>
          <span>© 2025 KYZN. All rights reserved.</span>
          <div>
            <a href="https://legal.kyzn.life/terms-and-conditions" target="_blank" style={styles.link}>Term of Use</a>
            <a href="https://legal.kyzn.life/privacy-policy" target="_blank" style={{ ...styles.link, marginLeft: "20px" }}>Privacy Policy</a>
          </div>
        </div>
      </div>

      {/* Modal dengan Carousel dan Next/Prev */}
      <Modal
        visible={isModalOpen}
        footer={null}
        onCancel={() => setIsModalOpen(false)}
        centered
        width={700}
        bodyStyle={{ padding: 0, position: "relative" }}
        closeIcon={
          <span
            style={{
              fontSize: "24px",
              color: "#fff",
              position: "absolute",
              top: "3px",
              right: "3px",
              zIndex: 2,
              cursor: "pointer",
              background: "rgba(0,0,0,0.4)",
              borderRadius: "50%",
              width: "30px",
              height: "30px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s ease",
              paddingBottom: "5px",
            }}
            onMouseEnter={e => {
              const target = e.currentTarget as HTMLSpanElement;
              target.style.transform = "scale(1)";
              target.style.background = "rgba(156, 96, 96, 0.7)";
            }}
            onMouseLeave={e => {
              const target = e.currentTarget as HTMLSpanElement;
              target.style.transform = "scale(1)";
              target.style.background = "rgba(0,0,0,0.4)";
            }}
          >
            ×
          </span>
        }
      >
        {/* Next / Prev Button */}
        <Button
          type="text" // penting! ini menghilangkan background & border default
          style={{
            position: "absolute",
            left: 20,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 2,
            fontSize: "24px",
            color: "#fff",
            background: "rgba(0,0,0,0.4)", // custom background
            borderRadius: "50%",           // bulat
            width: "30px",
            height: "30px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "none",                // pastikan border hilang
          }}
          onClick={() => carouselRef.current.prev()}
        >
          <LeftOutlined style={{ fontSize: "15px", color: "#fff" }} />
        </Button>
        <Button
          type="text" // penting supaya hilang background & border default
          style={{
            position: "absolute",
            right: 20,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 2,
            fontSize: "24px",        // ukuran icon
            color: "#fff",            // warna icon
            background: "rgba(0,0,0,0.4)", // background bulat
            borderRadius: "50%",
            width: "30px",
            height: "30px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "none",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onClick={() => carouselRef.current.next()}
        >
          <RightOutlined style={{ fontSize: "15px", color: "#fff" }} />
        </Button>


        <Carousel
          ref={carouselRef}
          initialSlide={startIndex}
          dots={true}
          dotPosition="bottom"
          effect="scrollx"
        >
          {instagramImages.map((img, index) => (
            <div key={index}>
              <img
                src={img}
                alt={`Instagram ${index}`}
                style={{
                  width: "100%",        // penuh lebar container
                  height: "500px",      // tetap tinggi sama
                  objectFit: "cover",   // crop agar tetap proporsional
                  display: "block",     // hilangkan space bawah image
                }}
              />
            </div>
          ))}
        </Carousel>
      </Modal>
    </footer>
  );
};

const styles: Record<string, React.CSSProperties> = {
  footer: {
    background: "radial-gradient(circle at center, #1a1a1a 0%, #0d0d0d 100%)",
    color: "#fff",
    fontFamily: "sans-serif",
    padding: "0px 0px",
    width: "100%",
  },
  content: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  topSection: {
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap",
    padding: "40px 0",
    gap: "50px",
  },
  workingHours: {
    flex: "1 1 300px",
    minWidth: "250px",
  },
  instagram: {
    flex: "1 1 300px",
    minWidth: "250px",
  },
  title: {
    display: "inline-block",
    paddingBottom: "15px",
    marginBottom: "15px",
    fontWeight: "bold",
    fontSize: "16px",
    width: "100%",
  },
  description: {
    color: "#ccc",
    lineHeight: 1.6,
    marginBottom: "15px",
  },
  contactItem: {
    display: "flex",
    alignItems: "center",
    color: "#ccc",
    marginBottom: "10px",
  },
  icon: {
    marginRight: "10px",
    color: "#d4af37",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    gap: "10px",
  },
  instagramItem: {
    backgroundColor: "#ccc",
    height: "70px",
    borderRadius: "10px",
  },
  bottomBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    padding: "15px 0",
    fontSize: "14px",
    borderTop: "1px solid rgba(255,255,255,0.1)",
    gap: "10px",
  },
  link: {
    color: "#fff",
    textDecoration: "none",
  },
  prevNext: {
    display: "flex",               // Flex lebih fleksibel untuk tombol navigasi
    justifyContent: "space-between", // Tombol kiri-kanan di ujung
    alignItems: "center",
    width: "100%",                  // Penuhi container
    marginTop: "10px",              // Jarak atas dari elemen sebelumnya
    gap: "10px",                    // Jarak antar tombol
  },
  prevNextButton: {
    background: "rgba(0,0,0,0.4)",
    color: "#fff",
    border: "none",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  prevNextButtonHover: {
    background: "rgba(156,96,96,0.7)",
    transform: "scale(1.1)",
  }, 
};

export default Footer;
