// src/components/Events.tsx
import React, { useEffect, useState } from "react";
import { Calendar } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface EventItem {
  me_id: number;
  me_name: string;
  me_slug: string;
  me_description: string;
  me_youtube_url: string;
  me_image_url: string;
  me_created_at: string;
  Branch: {
    mb_id: number;
    mb_name: string;
  };
}

const styles: { [key: string]: React.CSSProperties } = {
  eventOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: "16px",
    color: "white",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    backgroundImage:
      "linear-gradient(to top, rgba(0,0,0,0.65), rgba(0,0,0,0.1))",
  },
  eventTitleText: {
    fontSize: "2rem",
    fontWeight: 700,
    lineHeight: 1.1,
    margin: 0,
    padding: "16px",
    paddingBottom: "0px",
    textAlign: "left",
    maxWidth: "80%",
  },
  eventRigtText: {
    fontSize: "0.9rem",
    fontWeight: 600,
    fontFamily: "Rubik, sans-serif",
    color: "#2c3e50",
  },
  behindContent: {
    width: "100%",
    margin: "0 auto",
    paddingTop: "40px",
    background: "linear-gradient(180deg, #f9fbfd 0%, #eef3f8 100%)",
  },
  content: {
    maxWidth: "1200px",
    margin: "0 auto",
  },
};

const Events: React.FC = () => {

  const navigate = useNavigate();

  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.REACT_APP_API_URL;
  const API_URLIMAGE = process.env.REACT_APP_API_IMAGE_URL;   

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get(`${API_URL}/user/v1/event`);
        setEvents(res.data.data);
      } catch (err) {
        console.error("Error fetching events:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents(); 
  }, []);

  if (loading) {
    return <div className="text-center py-10">Loading events...</div>;
  }

  if (events.length === 0) {
    return <div className="text-center py-10">No events available.</div>;
  }

  // format tanggal lebih rapi
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <section
      className="p-6 rounded-lg pb-10 px-10"
      style={styles.behindContent}
    >
      <div style={styles.content}>
        {/* Heading */}
        <motion.div
          className="flex justify-between items-center mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ amount: 0.3 }}
        >
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            Events
            <span className="w-8 h-[2px] bg-blue-400 inline-block rounded-full" />
          </h2>
          <button onClick={() => navigate("/events")} className="text-sm font-medium text-blue-500 hover:text-blue-600 hover:underline flex items-center gap-1 transition-colors">
            VIEW ALL ↗
          </button>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
          {/* Kiri besar */}
          <motion.div
            className="md:col-span-2 relative overflow-hidden rounded-xl shadow-lg h-full hover:shadow-2xl transition-shadow duration-300"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ amount: 0.2 }}
          >
            <img
              src={`${API_URLIMAGE}/uploads/events/${events[0].me_image_url}`}
              alt={events[0].me_name}
              className="w-full h-[400px] object-cover transform hover:scale-105 transition-transform duration-500"
            />
            <div style={styles.eventOverlay} onClick={() => navigate(`/events/${events[0].me_slug}`)} className="cursor-pointer">
              <h3 style={styles.eventTitleText}>{events[0].me_name}</h3>
              <div className="flex items-center gap-2 text-sm mt-1 pl-5 pb-3 opacity-90">
                <Calendar size={14} />
                {formatDate(events[0].me_created_at)}
              </div>
            </div>
          </motion.div>

          {/* Kanan list */}
          <div className="flex flex-col gap-4 h-full cursor-pointer">
            {events.slice(1).map((event, idx) => (
              <motion.div
                key={event.me_id}
                className="flex gap-3 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-3"
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{
                  duration: 0.6,
                  ease: "easeOut",
                  delay: idx * 0.2,
                }}
                viewport={{ amount: 0.2 }}
              >
                <div className="w-28 h-20 overflow-hidden rounded-md">
                  <img
                    src={`${API_URLIMAGE}/uploads/events/${event.me_image_url}`}
                    alt={event.me_name}
                    className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div 
                onClick={() => navigate(`/events/${event.me_slug}`)}
                className="flex-1">
                  <h4 style={styles.eventRigtText} className="pl-2">
                    {event.me_name}
                  </h4>
                  <div className="flex items-center gap-1 text-xs text-gray-500 my-1 pl-2">
                    <Calendar size={12} /> {formatDate(event.me_created_at)}
                  </div>
                  <p className="text-xs text-gray-600 line-clamp-2 pl-2">
                    {event.me_description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Events;
