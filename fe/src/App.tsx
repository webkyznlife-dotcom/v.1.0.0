import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DefaultMeta from "./app/components/seo/DefaultMeta";
import "bootstrap/dist/css/bootstrap.min.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

/* -----------------------------
   Website Components & Pages
----------------------------- */
import HeaderWebsite from "./app/components/web/Header";
import SubFooterWebsite from "./app/components/web/SubFooter";
import FooterWebsite from "./app/components/web/Footer";

import HomeWebsite from "../src/app/pages/website/home";
import WhatIsKYZNWebsite from "../src/app/pages/website/what-is-kyzn";
import ProgramsWebsite from "../src/app/pages/website/programs";
import ProgramsWebsiteDetail from "../src/app/pages/website/programs/detail";
import SchedulesWebsite from "../src/app/pages/website/schedules";
import EventsWebsite from "../src/app/pages/website/events";
import EventsWebsiteDetail from "../src/app/pages/website/events/detail";
import ContactUsWebsite from "../src/app/pages/website/contact-us";
import FreeTrialWebsite from "../src/app/pages/website/free-trial";
import BuyDailyPassWebsite from "../src/app/pages/website/buy-daily-pass";

/* -----------------------------
   Mobile Components & Pages
----------------------------- */
import HeaderMobile from "./app/components/mobile/HeaderMobile";
import MenuMobile from "./app/components/mobile/MenuMobile";

import HomeMobile from "./app/pages/mobile/home";
import ProgramsMobile from "./app/pages/mobile/programs";
import ProgramsMobileDetail from "./app/pages/mobile/programs/detail";
import SchedulesMobile from "../src/app/pages/mobile/schedules";
import EventsMobile from "../src/app/pages/mobile/events";
import EventsMobileDetail from "../src/app/pages/mobile/events/detail";
import FreeTrialMobile from "../src/app/pages/mobile/free-trial";
import WhatIsKYZNMobile from "../src/app/pages/mobile/what-is-kyzn";
import ContactUsMobile from "../src/app/pages/mobile/contact-us";
import BuyDailyPassMobile from "../src/app/pages/mobile/buy-daily-pass";

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);

  // 🔹 State khusus untuk Website Header
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 🔹 Scroll effect hanya berlaku kalau bukan Mobile
  useEffect(() => {
    if (windowWidth <= 768) return; // skip mobile

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShowHeader(false); // scroll ke bawah → hide
      } else {
        setShowHeader(true); // scroll ke atas → show
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, windowWidth]);

  const isMobile: boolean = windowWidth <= 768;

  const toggleSidebar = (): void => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <>
    <DefaultMeta />
    <Router basename="/">
      <div style={styles.appContainer}>
        {isMobile ? (
          <>
            <HeaderMobile />
            <main style={styles.main}>
              <div style={styles.contentWrapper}>
                <Routes>
                  <Route path="/" element={<HomeMobile />} />
                  <Route path="/what-is-kyzn" element={<WhatIsKYZNMobile />} />
                  <Route path="/programs" element={<ProgramsMobile />} />
                  <Route path="/programs/:mp_slug" element={<ProgramsMobileDetail />} />
                  <Route path="/schedules" element={<SchedulesMobile />} />
                  <Route path="/events" element={<EventsMobile />} />
                  <Route path="/events/*" element={<EventsMobileDetail />} />
                  <Route path="/contact-us" element={<ContactUsMobile />} />
                  <Route path="/free-trial" element={<FreeTrialMobile />} />
                  <Route path="/buy-daily-pass" element={<BuyDailyPassMobile />} />
                </Routes>
              </div>
            </main>
            <MenuMobile />
          </>
        ) : (
          <>
            {/* 🔹 Header Website dengan efek scroll + fade */}
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1000,
                transform: showHeader ? "translateY(0)" : "translateY(-100%)",
                opacity: showHeader ? 1 : 0,
                transition: "transform 0.4s ease, opacity 0.4s ease",
                boxShadow: showHeader
                  ? "0 2px 8px rgba(0,0,0,0.1)"
                  : "none", // 🔹 shadow muncul saat header terlihat
                backgroundColor: "#fff", // biar tidak transparan
              }}
            >
              <HeaderWebsite toggleSidebar={toggleSidebar} isMobile={isMobile} />
            </div>

            <main style={{ ...styles.main, paddingTop: "65px" }}>
              <div style={styles.contentWrapper}>
                <Routes>
                  <Route path="/" element={<HomeWebsite />} />
                  <Route path="/what-is-kyzn" element={<WhatIsKYZNWebsite />} />
                  <Route path="/programs" element={<ProgramsWebsite />} />
                  <Route path="/programs/:mp_slug" element={<ProgramsWebsiteDetail />} />
                  <Route path="/schedules" element={<SchedulesWebsite />} />
                  <Route path="/events" element={<EventsWebsite />} />
                  <Route path="/events/*" element={<EventsWebsiteDetail />} />
                  <Route path="/contact-us" element={<ContactUsWebsite />} />
                  <Route path="/free-trial" element={<FreeTrialWebsite />} />
                  <Route path="/buy-daily-pass" element={<BuyDailyPassWebsite />} />
                </Routes>
              </div>
            </main>
            <SubFooterWebsite isMobile={isMobile} />
            <FooterWebsite isMobile={isMobile} toggleSidebar={toggleSidebar} />
          </>
        )}
      </div>
    </Router>
    </>
  );
};

const styles: Record<string, React.CSSProperties> = {
  appContainer: {
    minHeight: "100vh",
    backgroundColor: "#F4F6F8",
  },
  main: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
  },
  contentWrapper: {
    width: "100%",
    // maxWidth: "1200px",
  },
};

export default App;
