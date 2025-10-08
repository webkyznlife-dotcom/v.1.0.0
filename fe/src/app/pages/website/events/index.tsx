import React, { useRef, useEffect, useState } from "react";
import { Container } from "../../../components/web/layout";
import EventsHeader from "./components/events-header/index";
import { motion, useInView } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// === Inline Styles ===
const styles: { [key: string]: React.CSSProperties } = { 
  container: {
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

const EventsWebsite: React.FC = () => {
  const navigate = useNavigate();

  // === Refs & Animation View ===
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { amount: 0.3 });

  const API_URL = process.env.REACT_APP_API_URL;
  const API_URLIMAGE = process.env.REACT_APP_API_IMAGE_URL;

  // === State ===
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // === Config Pagination ===
  const itemsPerPage = 9;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentEvents = events;

  // === Fetch Events (dari API dengan pagination) ===
  const fetchEvents = async (page: number) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_URL}/user/v1/event/with-pagination?page=${page}&limit=${itemsPerPage}`
      );

      setEvents(response.data.data); // asumsi API balikin { data: [...], totalPages: X }
      setTotalPages(response.data.meta.totalPages); // ambil totalPages dari meta
    } catch (error) {
      console.error("Failed to fetch events:", error);
    } finally {
      setLoading(false);
    }
  };

  // === Load data pertama kali & ketika currentPage berubah ===
  useEffect(() => {
    fetchEvents(currentPage);
  }, [currentPage]);

  return (
    <div style={styles.container}>
      <Container style={{ padding: 0, border: 0, paddingBottom: "50px" }}>
        {/* ================= Header ================= */}
        <EventsHeader title="EVENTS" breadcrumb="Home / Events" />

        {/* ================= Title + Description ================= */}
        <div
          ref={sectionRef}
          className="mt-16 mb-12 px-6 pt-0 w-[70%] mx-auto"
        >
          <motion.h2
            style={styles.headingAaccess}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            Family Wellness Tips, Articles and Events
          </motion.h2>

          <motion.p
            style={styles.headingSubAaccess}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          >
            Discover family wellness insights, health tips, and KYZN events.
            Stay inspired with practical ideas to build a healthier and happier
            lifestyle.
          </motion.p>
        </div>

        {/* ================= List Events ================= */}
        <div className="mx-auto max-w-[1200px] w-full mx-auto">
          {loading ? (
            <p className="text-center text-gray-500">Loading events...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentEvents.map((event) => (
                <div
                  key={event.me_id}
                  className="overflow-hidden shadow-md rounded-lg bg-white cursor-pointer"
                  onClick={() => navigate(`/events/${event.me_slug}`)}
                >
                  <motion.img
                    src={`${API_URLIMAGE}/uploads/events/${event.me_image_url}`}
                    alt={event.me_name}
                    className="w-full h-48 object-cover"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    viewport={{ once: true }}
                  />

                  <div className="p-4">
                    <motion.h3
                      className="text-lg font-semibold mt-1"
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                      viewport={{ once: true }}
                    >
                      {event.me_name}
                    </motion.h3>

                    <motion.p
                      className="text-gray-600 text-sm mt-2"
                      initial={{ opacity: 0, x: 30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
                      viewport={{ once: true }}
                    >
                      {event.me_description}
                    </motion.p>
                  </div>
                </div>
              ))}

            </div>
          )}
        </div>
        {/* ================= End List ================= */}

        {/* ================= Pagination ================= */}
        <div className="flex justify-center mt-10 space-x-2">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 border rounded ${
              currentPage === 1
                ? "text-gray-400 cursor-not-allowed bg-gray-100"
                : "hover:bg-gray-200"
            }`}
          >
            «
          </button>

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 border rounded ${
              currentPage === totalPages
                ? "text-gray-400 cursor-not-allowed bg-gray-100"
                : "hover:bg-gray-200"
            }`}
          >
            &gt;
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(
              (page) =>
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
            )
            .map((page, idx, arr) => (
              <React.Fragment key={page}>
                {idx > 0 && arr[idx - 1] !== page - 1 && (
                  <span className="px-3 py-1">...</span>
                )}
                <button
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 border rounded ${
                    currentPage === page
                      ? "bg-blue-500 text-white"
                      : "hover:bg-gray-200"
                  }`}
                >
                  {page}
                </button>
              </React.Fragment>
            ))}

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className={`px-3 py-1 border rounded ${
              currentPage === totalPages
                ? "text-gray-400 cursor-not-allowed bg-gray-100"
                : "hover:bg-gray-200"
            }`}
          >
            &gt;
          </button>

          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 border rounded ${
              currentPage === totalPages
                ? "text-gray-400 cursor-not-allowed bg-gray-100"
                : "hover:bg-gray-200"
            }`}
          >
            »
          </button>
        </div>
        {/* ================= End Pagination ================= */}
      </Container>
    </div>
  );
};

export default EventsWebsite;
