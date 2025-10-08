import React, { useEffect, useState } from "react";
import { Container } from "../../../components/web/layout";
import { FaFacebookF, FaTwitter, FaWhatsapp } from "react-icons/fa";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { Modal, Spin } from "antd";
import {
  FacebookShareButton,
  WhatsappShareButton,
  TwitterShareButton,
  FacebookIcon,
  WhatsappIcon,
  TwitterIcon,
} from "react-share";
import { Title, Meta } from "react-head";

// === Inline Styles ===
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    paddingTop: "55px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "calc(60% - 15px) calc(40% - 15px)",
    gap: "30px",
    alignItems: "start",
    maxWidth: "1200px",
    width: "100%",
  },
  videoWrapper: {
    width: "100%",
    overflow: "hidden",
    boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
    marginBottom: "20px",
    aspectRatio: "16/9",
  },
  title: {
    fontSize: "1.8rem",
    fontWeight: "bold",
    marginBottom: "15px",
    letterSpacing: "1px",
    fontFamily: "Raleway, sans-serif",
  },
  content: {
    color: "#333",
    lineHeight: 1.7,
    fontSize: "1rem",
    marginBottom: "20px",
    fontFamily: "Rubik, sans-serif",
  },
  contentRow: {
    display: "grid",
    gridTemplateColumns: "60px 1fr",
    gap: "20px",
    alignItems: "flex-start",
  },
  shareSidebar: {
    position: "sticky",
    top: "100px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  shareButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "38px",
    height: "38px",
    borderRadius: "50%",
    color: "#fff",
    fontSize: "16px",
    textDecoration: "none",
  },
  otherVideos: {
    marginTop: "50px",
  },
  otherVideosTitle: {
    fontSize: "1.2rem",
    marginBottom: "20px",
    borderBottom: "2px solid #eee",
    paddingBottom: "8px",
    color: "#b67018",
  },
  otherVideosList: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  otherVideoCard: {
    display: "flex",
    gap: "12px",
    borderRadius: "10px",
    overflow: "hidden",
    background: "#fff",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    cursor: "pointer",
  },
  otherVideoThumb: {
    width: "120px",
    height: "80px",
    objectFit: "cover",
    borderRadius: "8px 0 0 8px",
  },
  otherVideoInfo: {
    flex: 1,
    padding: "8px 10px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
};

interface BranchType {
  mb_id: number;
  mb_name: string;
  mb_address: string;
  mb_city: string;
  mb_province: string;
  mb_postal_code: string;
  mb_phone: string;
  mb_status: boolean;
}

interface EventType {
  me_id: number;
  me_name: string;
  me_slug: string;
  me_description: string;
  me_youtube_url: string;
  me_image_url: string;
  me_created_at: string; // ISO date string
  me_updated_at: string; // ISO date string
  Branch: BranchType;
}

interface SocialShareProps {
  url: string;
  title: string;
  description: string;
  image: string;
}


const EventsWebsiteDetail: React.FC = () => {

  const navigate = useNavigate();

  const location = useLocation();
  const [event, setEvent] = useState<EventType | null>(null);
  const [otherEvent, setOtherEvent] = useState<EventType[]>([]); // <-- array kosong
  const [loading, setLoading] = useState<boolean>(false);

  // Ambil slug dari URL (semua setelah /events/)
  const me_slug = location.pathname.replace("/events/", "");

  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const API_URL = process.env.REACT_APP_API_URL;
  const API_URLIMAGE = process.env.REACT_APP_API_IMAGE_URL;  

  // Fungsi format tanggal
  const formatDate = (dateStr: string) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const date = new Date(dateStr);
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const fetchEventDetail = async (slug: string) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/user/v1/event/read`, { slug });

      if (response.data.success) {
        setEvent(response.data.data); // set data detail event
      } else {
        console.error("Event not found:", response.data.message);
      }
    } catch (error) {
      console.error("Failed to fetch event detail:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEventOther = async (slug: string) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/user/v1/event/other`, { slug });

      if (response.data.success) {
        setOtherEvent(response.data.data); // set data detail event
      } else {
        console.error("Event not found:", response.data.message);
      }
    } catch (error) {
      console.error("Failed to fetch event detail:", error);
    } finally {
      setLoading(false);
    }
  };  


  useEffect(() => {
    fetchEventDetail(me_slug);
    fetchEventOther(me_slug);
  }, [me_slug]);
  
  if (!event) {
    return (
      <Modal
        open={true}
        footer={null}
        closable={false}
        centered
        width={210}
        bodyStyle={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "110px",
          borderRadius: "10px",
          background: "#fff",
        }}
        maskStyle={{ backgroundColor: "rgba(0,0,0,0.2)" }}
      >
        <Spin size="large" />
        <span style={{ marginTop: "12px", fontSize: "0.9rem", color: "#555" }}>
          Loading event details...
        </span>
      </Modal>
    );
  }


  // Tambahkan dummy data saat loading
  const dummyEvent: EventType = {
    me_id: 0,
    me_name: "Loading Event...",
    me_slug: "",
    me_description: "Please wait while we load the event details...",
    me_youtube_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    me_image_url: "",
    me_created_at: new Date().toISOString(),
    me_updated_at: new Date().toISOString(),
    Branch: {
      mb_id: 0,
      mb_name: "",
      mb_address: "",
      mb_city: "",
      mb_province: "",
      mb_postal_code: "",
      mb_phone: "", 
      mb_status: false,
    },
  };

  const displayEvent = loading ? dummyEvent : event;


  return (
    <div style={styles.container} className="w-full mx-auto">

      {/* Meta Tags untuk social media */}
      <Title>{event.me_name}</Title>
      <Meta name="description" content={event.me_description} />
      <Meta property="og:type" content="website" />
      <Meta property="og:title" content={event.me_name} />
      <Meta property="og:description" content={event.me_description} />
      <Meta
        property="og:image"
        content={`${API_URLIMAGE}/uploads/events/${event.me_image_url}`}
      />
      <Meta property="og:url" content={`${BASE_URL}/events/${event.me_slug}`} />
      <Meta name="twitter:card" content="summary_large_image" />
      <Meta name="twitter:title" content={event.me_name} />
      <Meta name="twitter:description" content={event.me_description} />
      <Meta
        name="twitter:image"
        content={`${API_URLIMAGE}/uploads/events/${event.me_image_url}`}
      />

      <Container style={{ padding: "0px", border: 0, paddingBottom: "50px" }}>
        {/* Video Besar */}
        <div
          style={{
            marginBottom: "50px",
            position: "relative",
            width: "100%",
            // borderRadius: "12px",
            aspectRatio: "30/4",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: `linear-gradient(
              to bottom,
              rgba(0,0,0,0.9) 0%,
              rgba(0,0,0,0.7) 40%,
              rgba(0,0,0,0.7) 60%,
              rgba(0,0,0,0.9) 100%
            )`,
          }}
        >
          <iframe
            src={displayEvent.me_youtube_url}
            title={displayEvent.me_name}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{
              width: "80%",
              height: "80%",
              maxWidth: "1200px",
              aspectRatio: "16/8",
              border: "2px solid #fff",
              borderRadius: "8px",
              boxShadow: "0 0 20px rgba(255,255,255,0.2)",
              zIndex: 2,
            }}
          ></iframe>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",      // ganti maxWidth dengan width full
            margin: 0           // hilangkan auto margin
          }}
          className="p-8 pt-0"
        >
        {/* Date + Title */}
        <h1 style={{ fontSize: "0.7rem", color: "#999", marginBottom: "10px" }}>
          {formatDate(displayEvent.me_created_at)}
        </h1>
        <h1 style={styles.title}>{displayEvent.me_name}</h1>

        {/* Share + Content */}
        <div style={{ marginBottom: "30px" }}>
          {/* Share Buttons (horizontal) */}
          <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
            <FacebookShareButton url={BASE_URL + "/event/" + displayEvent.me_slug} title={displayEvent.me_name}>
              <FacebookIcon size={30} round />
            </FacebookShareButton>

            <TwitterShareButton url={BASE_URL + "/event/" + displayEvent.me_slug} title={displayEvent.me_name}>
              <TwitterIcon size={30} round />
            </TwitterShareButton>

            <WhatsappShareButton url={BASE_URL + "/event/" + displayEvent.me_slug} title={displayEvent.me_name}>
              <WhatsappIcon size={30} round />
            </WhatsappShareButton>
          </div>

          {/* Content Text */}
          <p style={styles.content}>{displayEvent.me_description}</p>
        </div>

        {/* Other Events */}
        <div style={{ marginTop: "20px" }}>
          <h2 style={styles.otherVideosTitle}>Other Events</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {otherEvent.map((ev, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  gap: "12px",
                  borderRadius: "8px",
                  overflow: "hidden",
                  background: "#f9f9f9",
                  border: "1px solid #eee",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  cursor: "pointer",
                  padding: "8px",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 18px rgba(0,0,0,0.08)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 8px rgba(0,0,0,0.05)";
                }}
                onClick={() => navigate(`/events/${ev.me_slug}`)}
              >
                {/* Thumbnail */}
                <img
                  src={
                    ev.me_image_url
                      ? API_URLIMAGE + "/uploads/events/" + ev.me_image_url
                      : "https://via.placeholder.com/100x60?text=No+Image"
                  }
                  alt={ev.me_name}
                  style={{
                    width: "100px",
                    height: "60px",
                    objectFit: "cover",
                    borderRadius: "6px",
                  }}
                />

                {/* Info */}
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.55rem",
                      color: "#999",
                      marginBottom: "2px",
                    }}
                  >
                    {formatDate(ev.me_created_at)}
                  </span>
                  <h3
                    style={{
                      fontSize: "0.85rem",
                      fontWeight: "bold",
                      margin: 0,
                      lineHeight: 1.3,
                      fontFamily: "Rubik, sans-serif",
                    }}
                  >
                    {ev.me_name}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      </Container>
    </div>
  );
};

export default EventsWebsiteDetail;
