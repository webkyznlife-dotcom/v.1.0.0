// src/components/OurBranch.tsx
import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import { motion, useInView } from "framer-motion";
import { Modal, Tabs, Tag } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import Slider from "react-slick";

import "../branch/styles/custom-dots.css"; 

// ===== Interfaces =====
interface Facility {
  name: string;
  img?: string;
}

interface BranchImage {
  src: string;
  alt?: string;
}

interface Branch {
  name: string;
  description: string;
  images?: BranchImage[];
  facilities?: (string | Facility)[];
  mapEmbed?: string;
  programs?: string[];
  courts?: string[];
}

// ===== Styles =====
const styles: { [key: string]: React.CSSProperties } = {
  headingAaccess: {
    fontFamily: "Rubik, sans-serif",
    fontWeight: "bold",
    fontSize: "2rem",
    marginLeft: "0.5rem",
    marginBottom: "16px",
    letterSpacing: "-0.01em",
  },
  paragraph: {
    fontFamily: "Poppins, sans-serif",
    fontSize: "0.7rem",
    lineHeight: "1.5",
    marginBottom: "16px",
    letterSpacing: "0.01em",
  },
  behindContent: { maxWidth: "100%" },
  content: { maxWidth: "1200px", margin: "0 auto" },
};

// ===== OurBranch Component =====
const OurBranch: React.FC = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { amount: 0.3 });

  const [branches, setBranches] = useState<Branch[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [dragging, setDragging] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL;
  const API_URLIMAGE = process.env.REACT_APP_API_IMAGE_URL;    

const sliderSettings = {
  dots: true,
  infinite: false,
  speed: 500,
  slidesToShow: 4, // ubah sesuai jumlah visible
  slidesToScroll: 1,
  arrows: true,
  responsive: [
    { breakpoint: 1024, settings: { slidesToShow: 3 } },
    { breakpoint: 768, settings: { slidesToShow: 2 } },
    { breakpoint: 480, settings: { slidesToShow: 1 } },
  ],
};

  // ===== Fetch Function =====
  const fetchBranches = async () => {
    try {
      const res = await axios.get(`${API_URL}/user/v1/branch/with-formatted`);
      if (res.data?.success && Array.isArray(res.data.data)) {
        setBranches(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching branches:", error);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const handleOpenModal = (branch: Branch) => {
    setSelectedBranch(branch);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBranch(null);
  };

  return (
    <section
      ref={sectionRef}
      className="py-10 px-10 pt-10 text-center h-[650px]"
      style={styles.behindContent}
    >
      <div style={styles.content}>
        {/* Heading */}
        <motion.h2
          style={styles.headingAaccess}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          Our Branch
        </motion.h2>

        {/* Paragraph */}
        <motion.p
          className="text-gray-600 max-w-4xl mx-auto mb-10"
          initial={{ opacity: 0, x: -40 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
        >
          From a single location to multiple branches, our journey has always
          been about getting closer to you. Each branch is more than just a
          place—it’s where our passion meets your needs, bringing the same
          quality and care wherever you find us.
        </motion.p>

        {/* Grid Card */}
        <motion.div
          className="w-full"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
        <Slider {...sliderSettings} onSwipe={() => setDragging(true)} afterChange={() => setDragging(false)} className="branch-modal-slider -mx-2"> {/* offset padding */}
          {branches.map((branch, index) => (
            <div key={index} className="px-2"> {/* ini bikin gap antar slide */}
            <div
              className="cursor-pointer p-4 rounded-xl flex flex-col bg-white border border-gray-200 shadow-sm h-[400px]"
            >
                {/* Image */}
                <div className="h-40 mb-4 rounded-lg overflow-hidden">
                  {branch.images && branch.images.length > 0 ? (
                    <img
                      src={`${API_URLIMAGE}/uploads/branchs/${branch.images[0]?.src || "placeholder.png"}`}
                      alt={branch.name}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400">No Image</span>
                    </div>
                  )}
                </div>

                {/* Text */}
                <div className="flex-1 flex flex-col items-start">
                  <h3 className="font-semibold text-lg mb-2 text-gray-800 text-center w-full">
                    {branch.name || "Unnamed Branch"}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed text-left">
                    {branch.description || "No description available"}
                  </p>
                </div>

                {/* Icon */}
                <div className="mt-4 text-right"
                        onClick={() => {
                  if (!dragging) handleOpenModal(branch);
                }}
                >
                  <span className="text-blue-600 text-xl inline-block transform transition-transform group-hover:translate-x-1">
                    ↗
                  </span>
                </div>
              </div>
            </div>
          ))}
        </Slider>

        </motion.div>

        {/* Modal Detail */}
        <Modal
          title="Branch Detail Information"
          open={isModalOpen}
          onCancel={handleCloseModal}
          footer={null}
          width={850}
          bodyStyle={{ padding: 0 }}
        >
          {selectedBranch && (
            <div className="flex flex-col">
              {/* Header Image Carousel */}
              <div className="relative w-full h-56 rounded-t-lg overflow-visible">
                {selectedBranch.images && selectedBranch.images.length > 0 ? (
                  <Slider
                    dots={true}
                    infinite={true}
                    speed={500}
                    slidesToShow={1}
                    slidesToScroll={1}
                    autoplay={true}
                    autoplaySpeed={3000}
                    arrows={true}
                    draggable={true}
                    appendDots={(dots) => (
                      <div
                        style={{
                          position: "absolute",
                          bottom: "-30px",
                          width: "100%",
                          display: "flex",
                          justifyContent: "center",
                          zIndex: 10,
                        }}
                      >
                        <ul
                          style={{
                            margin: 0,
                            padding: 0,
                            display: "flex",
                          }}
                        >
                          {dots}
                        </ul>
                      </div>
                    )}
                    customPaging={() => (
                      <div
                        style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          background: "gray",
                        }}
                      />
                    )}
                  >
                    {selectedBranch.images.map((img, idx) => (
                      <div key={idx}>
                        <img
                          src={`${API_URLIMAGE}/uploads/branchs/${img.src || "placeholder.png"}`}
                          alt={img.alt || selectedBranch.name}
                          className="w-full h-56 object-cover"
                        />
                      </div>
                    ))}
                  </Slider>
                ) : (
                  <div className="w-full h-56 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">No Images Available</span>
                  </div>
                )}

                <style>
                  {`
                    .slick-dots li {
                      margin: 0px;
                    }
                    .slick-dots li.slick-active div {
                      background: black !important;
                    }
                  `}
                </style>
              </div>

              {/* Branch Name & Address */}
              <div className="p-6 bg-white border-b border-gray-200 mt-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  {selectedBranch.name || "Unnamed Branch"}
                </h2>
                <p className="text-gray-600 mt-2 text-sm leading-relaxed">
                  {selectedBranch.description || "No description available"}
                </p>
              </div>

              {/* Tabs */}
              <div className="p-6">
                <Tabs defaultActiveKey="1" type="line" size="large">
                  {/* Facilities */}
                  <Tabs.TabPane tab="Facilities" key="1">
                    {selectedBranch.facilities && selectedBranch.facilities.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {selectedBranch.facilities.map((f, i) => {
                          const facility = typeof f === "string" ? { name: f } : f;
                          return (
                            <div
                              key={i}
                              className="flex flex-col items-center justify-center bg-gray-50 p-4 rounded-xl shadow-sm hover:shadow-md transition"
                            >
                              {facility.img && (
                                <img
                                  src={facility.img}
                                  alt={facility.name}
                                  className="w-10 h-10 mb-2"
                                />
                              )}
                              <span className="text-sm font-medium text-gray-700 text-center">
                                {facility.name}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-gray-400">No facilities available</p>
                    )}
                  </Tabs.TabPane>

                  {/* Programs */}
                  <Tabs.TabPane tab="Programs" key="3">
                    {selectedBranch.programs && selectedBranch.programs.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {selectedBranch.programs.map((p, i) => (
                          <Tag color="blue" key={i}>
                            {p}
                          </Tag>
                        ))}
                        <Tag
                          color="#69c0ff"
                          className="cursor-pointer flex items-center gap-1"
                          onClick={() => (window.location.href = "/programs")}
                        >
                          More <ArrowRightOutlined />
                        </Tag>
                      </div>
                    ) : (
                      <p className="text-gray-400">No programs available</p>
                    )}
                  </Tabs.TabPane>

                  {/* Courts */}
                  <Tabs.TabPane tab="Courts" key="4">
                    {selectedBranch.courts && selectedBranch.courts.length > 0 ? (
                      <ul className="list-disc list-inside space-y-2 text-gray-700">
                        {selectedBranch.courts.map((c, i) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-400">No courts available</p>
                    )}
                  </Tabs.TabPane>

                  {/* Map */}
                  <Tabs.TabPane tab="Map" key="2">
                    {selectedBranch.mapEmbed ? (
                      <div className="rounded-xl overflow-hidden shadow-md">
                        <iframe
                          src={selectedBranch.mapEmbed}
                          width="100%"
                          height="300"
                          style={{ border: 0 }}
                          loading="lazy"
                          allowFullScreen
                        ></iframe>
                      </div>
                    ) : (
                      <p className="text-gray-400">Map not available</p>
                    )}
                  </Tabs.TabPane>
                </Tabs>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </section>
  );
};

export default OurBranch;