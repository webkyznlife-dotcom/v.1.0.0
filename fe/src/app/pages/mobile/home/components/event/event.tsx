// src/components/EventsMobile.tsx
import React, { useEffect, useState } from "react";
import { Calendar } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";

import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom"; 

interface EventItem {
  me_id: number;
  me_name: string;
  me_slug: string;
  me_description?: string;
  me_image_url: string;
  me_created_at: string; 
}

const styles: { [key: string]: React.CSSProperties } = {
  eventOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: "12px",
    color: "white",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    backgroundImage: "linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0))",
  },
  eventTitleText: {
    fontSize: "1.125rem",
    fontWeight: 700,
    lineHeight: 1.2,
    margin: 0,
    paddingBottom: "0px",
    textAlign: "left",
  },
  eventDateText: {
    fontSize: "0.75rem",
    fontWeight: 500,
    fontFamily: "Rubik, sans-serif",
  },
};

const EventsMobile: React.FC = () => {
  const navigate = useNavigate();


  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.REACT_APP_API_URL;
  const API_URLIMAGE = process.env.REACT_APP_API_IMAGE_URL;

  // Ambil data event dari API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get(`${API_URL}/user/v1/event`);
        if (res.data.success) {
          setEvents(res.data.data);
        }
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

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <section className="bg-[#f5f8fc] p-4 pt-4">
      {/* Heading */}
      <motion.div
        className="flex justify-between items-center mb-2"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ amount: 0.3 }}
      >
        <h2 className="text-lg sm:text-sm font-bold text-gray-800 flex items-center gap-2 leading-none">
          All KYZN Events
          <span className="w-5 h-[2px] bg-red-500 inline-block" />
        </h2>

        <button onClick={() => navigate("/events")} className="text-sm font-medium text-blue-600 hover:underline flex items-center gap-1 pb-2">
          VIEW ALL <ArrowRight size={16} />
        </button>
      </motion.div>

      {/* Main Event */}
      <motion.div
        className="relative overflow-hidden rounded-md shadow-md mb-2"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ amount: 0.2 }}
      >
        <img
          src={`${API_URLIMAGE}/uploads/events/${events[0].me_image_url}`}
          alt={events[0].me_name}
          className="w-full h-48 object-cover"
        />
        <div style={styles.eventOverlay} onClick={() => navigate(`/events/${events[0].me_slug}`)}>
          <h3 style={styles.eventTitleText}>{events[0].me_name}</h3>
          <div className="flex items-center gap-1 text-xs mt-1">
            <Calendar size={12} /> {formatDate(events[0].me_created_at)}
          </div>
        </div>
      </motion.div>

      {/* List Events */}
      <div className="flex flex-col gap-1.5">
        {events.slice(1).map((event, idx) => (
          <motion.div
            key={event.me_id}
            className="flex gap-2 bg-white rounded-lg shadow p-3"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: idx * 0.1 }}
            viewport={{ amount: 0.2 }}
          >
            <div className="w-24 h-16 overflow-hidden rounded-md flex-shrink-0">
              <img
                src={`${API_URLIMAGE}/uploads/events/${event.me_image_url}`}
                alt={event.me_name}
                className="w-full h-full object-cover"
              />
            </div>
            <div onClick={() => navigate(`/events/${event.me_slug}`)} className="flex-1 flex flex-col justify-center">
              <h4 className="text-xs font-medium">{event.me_name}</h4>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Calendar size={12} /> {formatDate(event.me_created_at)}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default EventsMobile;