import React, { useRef, useState } from "react";
import { Container } from "../../../components/web/layout";
import WhatIsKYZNHeader from "./components/what-is-kyzn-header/index";
import { motion, useInView } from "framer-motion";
import { Card, Slider, Button } from "antd";
import {
  PlayCircleOutlined,
  PauseCircleOutlined,
  SoundOutlined,
  AudioMutedOutlined,
} from "@ant-design/icons";
import {
  FiVolumeX,
  FiVolume2,
  FiPlay,
  FiPause,
} from "react-icons/fi";

import facilitiesImg from "../../../assets/images/what-is-kyzn/w-building.png";
import tennisImg from "../../../assets/images/what-is-kyzn/w-tennis.png";
import peopleImg from "../../../assets/images/what-is-kyzn/w-people.png";

// === Inline Styles ===
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    // paddingTop: "55px",
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
  headingAaccessSub: {
    fontFamily: "Rubik, sans-serif",
    fontWeight: "normal",
    fontSize: "2.1rem",
    marginBottom: "0.2rem",
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
  paragrafStyle: {
    fontFamily: "Rubik, sans-serif",
    fontSize: "1rem",
    color: "#4a5568",
  },
  content: {
    maxWidth: "1200px",
    margin: "0 auto",
  }
};

const OurJourneySection = () => {
  const features = [
    {
      img: peopleImg,
      count: "69312+",
      title: "Community Connection",
      text: "Join a vibrant community that encourages social interaction and lifelong friendships.",
    },
    {
      img: "/images/programs.jpg",
      count: "3823+",
      title: "Diverse Programs",
      text: "From toddlers to seniors, explore a variety of programs tailored to all ages and interests.",
    },
    {
      img: "/images/facilities.jpg",
      count: "60+",
      title: "State-of-the-Art Facilities",
      text: "Experience top-notch amenities that cater to both fitness enthusiasts and families alike.",
    },
  ];

  return (
    <section className="w-full bg-white">
      {/* ================= Community Section ================= */}
      <div className="w-full bg-white py-5">
        <div className="mx-auto" style={styles.content}>
          {/* Title */}
          {/* <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-8 text-center">
            Connect, Play, and Grow with Us
          </h2> */}

          {/* Grid Layout */}
          <div className="grid md:grid-cols-3 gap-6">
  {/* Left Big Image */}
  <motion.div
    className="relative md:row-span-2 rounded-2xl overflow-hidden shadow-sm"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
  >
    <div className="w-full h-[500px] md:h-full"> {/* parent kasih tinggi */}
      <img
        src={facilitiesImg}
        alt="Facilities"
        className="w-full h-full object-cover"
      />
    </div>
    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent text-white">
      <span className="text-3xl font-bold text-amber-400">60+</span>
      <h3 className="text-lg font-semibold mt-2">
        State-of-the-Art Facilities
      </h3>
      <p className="text-sm text-gray-200 mt-1">
        Experience top-notch amenities that cater to both fitness
        enthusiasts and families alike.
      </p>
    </div>
    <span className="absolute top-4 left-4 bg-white/70 text-gray-800 text-xs font-medium px-3 py-1 rounded-full shadow">
      KYZN Building
    </span>
  </motion.div>

  {/* Right Top - Tennis */}
  <motion.div
    className="rounded-2xl overflow-hidden shadow-md h-56 md:h-64"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.2 }}
  >
    <img
      src={tennisImg}
      alt="Tennis Program"
      className="w-full h-full object-cover"
    />
  </motion.div>

  {/* Right Top - Community */}
  <motion.div
    className="bg-white rounded-2xl shadow-sm p-6 flex flex-col justify-center"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.4 }}
  >
    <span className="text-3xl font-bold text-amber-500">69312+</span>
    <h3 className="text-lg font-semibold text-gray-800 mt-2">
      Community Connection
    </h3>
    <p className="text-sm text-gray-600 mt-1">
      Join a vibrant community that encourages social interaction
      and lifelong friendships.
    </p>
  </motion.div>

  {/* Right Bottom - Diverse Programs */}
  <motion.div
    className="bg-gray-50 rounded-2xl shadow-sm p-6 flex flex-col justify-center"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.6 }}
  >
    <span className="text-3xl font-bold text-amber-500">3823+</span>
    <h3 className="text-lg font-semibold text-gray-800 mt-2">
      Diverse Programs
    </h3>
    <p className="text-sm text-gray-600 mt-1">
      From toddlers to seniors, explore a variety of programs tailored
      to all ages and interests.
    </p>
  </motion.div>

  {/* Right Bottom - People */}
  <motion.div
    className="rounded-2xl overflow-hidden shadow-md h-56 md:h-64"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.8 }}
  >
    <img
      src={peopleImg}
      alt="Group Activity"
      className="w-full h-full object-cover"
    />
  </motion.div>
</div>

        </div>
      </div>
      {/* End Here */}
    </section>
  );
};

const WhatIsKYZNWebsite: React.FC = () => {
  // === Refs & Animation View ===
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { amount: 0.3 });

  const coreValueRef = useRef(null);
  const isCoreValueInView = useInView(coreValueRef, { amount: 0.3 });

  // === Video States ===
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(0.7);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // === Video Handlers ===
  const handlePlayPause = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.muted = false;
      setIsMuted(false);
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (value: number) => {
    if (videoRef.current) {
      videoRef.current.volume = value;
      setVolume(value);

      if (value > 0 && videoRef.current.muted) {
        videoRef.current.muted = false;
        setIsMuted(false);
      }
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const dur = videoRef.current.duration || 0;

      setCurrentTime(current);
      setProgress(dur ? (current / dur) * 100 : 0);
    }
  };

  const handleSeek = (value: number) => {
    if (videoRef.current) {
      const dur = videoRef.current.duration || 0;
      if (dur) {
        videoRef.current.currentTime = (value / 100) * dur;
      }
      setProgress(value);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return (
    <div style={styles.container}>
      <Container style={{ padding: 0, border: 0, paddingBottom: "50px" }}>
        {/* ================= Header ================= */}
        <WhatIsKYZNHeader
          title="WHAT IS KYZN"
          breadcrumb="Home / What is KYZN"
        />

        {/* ================= Title + Description ================= */}
        <div ref={sectionRef} className="mt-16 mb-12 px-6 pt-0">
          <motion.h2
            style={styles.headingAaccess}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            Family & Social Wellness Club
          </motion.h2>

          <motion.p
            style={styles.headingSubAaccess}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          >
            The leading destination for family wellness, fun & growth. Empowering
            families to thrive through fun, active lifestyles, mindful living,
            and lifelong learning in a vibrant, supportive community
          </motion.p>
        </div>

        {/* ================= Content + Video ================= */}
        <div className="grid md:grid-cols-2 gap-12 items-center" style={styles.content}>
          {/* Text Content */}
          <div
            className="space-y-6 text-gray-700 text-lg leading-relaxed"
            style={styles.paragrafStyle}
          >
            <p>
              At KYZN, we believe in <strong>Family Wellness</strong> as the
              cornerstone of a vibrant community where families thrive together.
              More than just a fitness club, KYZN empowers families to reach
              their full potential through fun, active lifestyles, mindful
              living, and lifelong learning.
            </p>
            <p>
              It&apos;s a place where families connect, grow, and create lasting
              memories. Our thoughtfully scheduled programs allow family members
              to join classes simultaneously, and our engaging events provide
              the perfect setting for families to have fun together.
            </p>
            <p>
              Join our supportive community of like-minded families and connect
              with others who share your values and vision for a healthy, active
              lifestyle. <strong>KYZN</strong> is your family-friendly haven
              where everyone feels welcome and lifelong memories are made.
            </p>
          </div>

          {/* Video Section */}
          <Card className="shadow-sm rounded-2xl overflow-hidden">
            <div className="relative">
              <video
                ref={videoRef}
                src="/videos/compro2024.mp4"
                autoPlay
                muted
                loop
                playsInline
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={() =>
                  setDuration(videoRef.current?.duration || 0)
                }
                className="w-full h-64 object-cover rounded-md"
              />
            </div>

            {/* Controls */}
            <div className="mt-4 flex flex-col gap-3 px-4 pb-4">
              {/* Progress Bar */}
              <Slider value={progress} onChange={handleSeek} />

              {/* Time + Play Button + Volume */}
              <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                <span>{formatTime(currentTime)}</span>

                <div className="flex-1 flex justify-center items-center gap-2">
                  {/* Play / Pause */}
                  <Button
                    type="primary"
                    shape="circle"
                    icon={
                      isPlaying
                        ? React.createElement(FiPause as React.ElementType, {
                            size: 15,
                            color: "#e2e8f0",
                          })
                        : React.createElement(FiPlay as React.ElementType, {
                            size: 15,
                            color: "#e2e8f0",
                          })
                    }
                    onClick={handlePlayPause}
                    className="bg-blue-500 text-white shadow-md hover:bg-blue-600 !w-6 !h-8 flex items-center justify-center"
                  />

                  {/* Volume */}
                  <Button
                    type="default"
                    shape="circle"
                    icon={
                      isMuted
                        ? React.createElement(FiVolumeX as React.ElementType, {
                            size: 20,
                            color: "#64748b",
                          })
                        : React.createElement(FiVolume2 as React.ElementType, {
                            size: 20,
                            color: "#64748b",
                          })
                    }
                    onClick={() => {
                      if (videoRef.current) {
                        const nextMuted = !videoRef.current.muted;
                        videoRef.current.muted = nextMuted;
                        setIsMuted(nextMuted);
                      }
                    }}
                    className="shadow-md hover:bg-blue-600 !w-6 !h-8 flex items-center justify-center"
                  />
                </div>

                <span>{formatTime(duration)}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* ================= Our Core Value Section ================= */}
        <div className="w-full mt-16 py-5" style={{ backgroundColor: '#fafafa' }}>
          <div ref={coreValueRef} className="w-4/5 mx-auto text-2xl md:text-3xl font-semibold text-gray-900 mb-8 text-center">
            {/* Title */}
            <motion.h2
              className="px-6 pt-0"
              initial={{ opacity: 0, y: 30 }}
              animate={isCoreValueInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              Our Core Value
            </motion.h2>

            <motion.p
              className="text-gray-700 mt-0 text-lg md:text-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={isCoreValueInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            >
              Guiding Principles for a Thriving Community
            </motion.p>

            {/* Cards */}
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              {/* Family Wellness */}
              <motion.div
                className="p-6 rounded-2xl shadow-md hover:shadow-lg transition"
                style={{ backgroundColor: '#ffffff' }}
                initial={{ opacity: 0, y: 20 }}
                animate={isCoreValueInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h3 className="font-semibold text-xl text-gray-800 mb-3">
                  Family Wellness
                </h3>
                <p className="text-gray-700 text-base">
                  Nurturing strong bonds and healthy lifestyles for families to thrive together.
                </p>
              </motion.div>

              {/* Fun */}
              <motion.div
                className="p-6 rounded-2xl shadow-md hover:shadow-lg transition"
                style={{ backgroundColor: '#f9faff' }}
                initial={{ opacity: 0, y: 20 }}
                animate={isCoreValueInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <h3 className="font-semibold text-xl text-gray-800 mb-3">
                  Fun
                </h3>
                <p className="text-gray-700 text-base">
                  Embracing joy and excitement in every activity to inspire happiness and connection.
                </p>
              </motion.div>

              {/* Growth */}
              <motion.div
                className="p-6 rounded-2xl shadow-md hover:shadow-lg transition"
                style={{ backgroundColor: '#fff8f8' }}
                initial={{ opacity: 0, y: 20 }}
                animate={isCoreValueInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <h3 className="font-semibold text-xl text-gray-800 mb-3">
                  Growth
                </h3>
                <p className="text-gray-700 text-base">
                  Fostering personal and communal development through continuous learning and innovation.
                </p>
              </motion.div>
            </div>
          </div>
        </div>

        {/* ================= Our Journey Section ================= */}
        <div
          className="py-5"
          style={{
            background: 'linear-gradient(to bottom, #e2e2e2, rgba(226, 226, 226, 0))',
          }}
        >
          <div className="text-center" style={styles.content}>
            {/* Title */}
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">
              Our Journey: Building Wellness Together
            </h2>
            <p className="text-gray-700 max-w-2xl mx-auto mb-12 text-base md:text-lg">
              At KYZN, we cultivate Family Wellness, creating vibrant communities
              where families flourish. Beyond fitness, we inspire active,
              mindful, and lifelong learning experiences.
            </p>

            {/* Timeline */}
            <div className="relative flex justify-between items-start border-t-2 border-dashed border-purple-400">
              {[
                {
                  year: "2021",
                  text: "Launched our first branch, KYZN BSD, in November.",
                },
                {
                  year: "2022",
                  text: "Achieved 1,500+ members, 1,900+ activities, and welcomed 10,000 visitors monthly.",
                },
                {
                  year: "2023",
                  text: "Opened our second branch, KYZN Kuningan, in May. Introduced The Forge and 30+ new programs.",
                },
                {
                  year: "2024",
                  text: "Reached 3,000+ members, hosted 3,000+ activities, and launched 20+ programs with new facilities.",
                },
                {
                  year: "2025",
                  text: "Exciting new branch coming soon!",
                },
              ].map((item, index) => (
                <div key={index} className="flex flex-col items-center w-1/5 px-2">
                  {/* Dot */}
                  <div className="w-3 h-3 bg-purple-400 rounded-full -mt-[7px]"></div>
                  {/* Content */}
                  <div className="mt-6 text-center">
                    <h3 className="font-semibold text-lg text-gray-800">{item.year}</h3>
                    <p className="text-gray-700 text-sm mt-2">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Community */}
        <OurJourneySection />
        {/* End Here */}
      </Container>
    </div>
  );
};

export default WhatIsKYZNWebsite;
