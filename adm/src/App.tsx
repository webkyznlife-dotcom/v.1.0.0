import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

// Components
import Header from "../src/app/components/Header";
import Sidebar from "../src/app/components/Sidebar";
import Footer from "../src/app/components/Footer";

// Context
import { NotificationProvider } from "../src/app/context/NotificationContext";

// Pages
import LoginPage from "../src/app/pages/login/index";
import Dashboard from "../src/app/pages/dashboard";

// -- Program Management
import ProgramManagementAgeGroups from "./app/pages/program-mananegemet/age-groups";
import ProgramManagementCategories from "./app/pages/program-mananegemet/categories";
import ProgramManagementActivityCategories from "./app/pages/program-mananegemet/activity";
import ProgramManagementClasses from "./app/pages/program-mananegemet/classes";
import ProgramManagementKeyPoints from "./app/pages/program-mananegemet/key-points";
import ProgramManagementLinkClasses from "./app/pages/program-mananegemet/link-classes";

// -- Events
import Events from "./app/pages/events";

// -- Collaborations
import Collaborations from "./app/pages/collaborations";

// -- Map
import Map from "./app/pages/map";

// -- Branch List
import BranchList from "./app/pages/branch-list";

// -- Contact Us
import ContactUs from "./app/pages/contact-us";

// -- Book Free Trial
import BookAFreeTrial from "./app/pages/book-a-free-trial";

// -- Facilities Management
import FacilitiesManagementFacilities from "./app/pages/facilities-management/facilities";
import FacilitiesManagementLinkFacilities from "./app/pages/facilities-management/link-facilities";

// -- Courts Management
import Courts from "./app/pages/courts-management/courts";
import LinkCourts from "./app/pages/courts-management/link-courts/index";

// -- Customer Testimonial
import CustomerTestimonial from "./app/pages/customer-testimonial";

// -- Trainers
import Trainers from "./app/pages/trainers";

// -- Schedule
import Schedules from "./app/pages/schedules";

import "./App.css";

// ✅ Definisikan tipe untuk komponen layout
interface LayoutProps {
  isSidebarOpen: boolean;
  isMobile: boolean;
  toggleSidebar: () => void;
}

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    localStorage.getItem("isAuthenticated") === "true"
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const isMobile: boolean = windowWidth <= 768;

  const toggleSidebar = (): void => {
    setIsSidebarOpen((prevState) => !prevState);
  };

  return (
    <Router basename="/admin">
      <NotificationProvider>
        <Routes>
          {/* Default ke halaman login */}
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <LoginPage setIsAuthenticated={setIsAuthenticated} />
              )
            }
          />

          {/* Jika belum login, redirect ke login */}
          {!isAuthenticated ? (
            <Route path="*" element={<Navigate to="/" replace />} />
          ) : (
            <Route
              path="*"
              element={
                <>
                  <Header
                    toggleSidebar={toggleSidebar}
                    isSidebarOpen={isSidebarOpen}
                    isMobile={isMobile}
                  />
                  <div style={styles.layout}>
                    <Sidebar
                      isSidebarOpen={isSidebarOpen}
                      isMobile={isMobile}
                      toggleSidebar={toggleSidebar}
                    />
                    <div style={styles.content}>
                      <Routes>
                        <Route
                          path="/dashboard"
                          element={
                            <Dashboard
                              isSidebarOpen={isSidebarOpen}
                              isMobile={isMobile}
                              toggleSidebar={toggleSidebar}
                            />
                          }
                        />
                        <Route
                          path="/program-management/age-groups"
                          element={
                            <ProgramManagementAgeGroups
                              isSidebarOpen={isSidebarOpen}
                              isMobile={isMobile}
                              toggleSidebar={toggleSidebar}
                            />
                          }
                        />     
                        <Route
                          path="/program-management/categories"
                          element={
                            <ProgramManagementCategories
                              isSidebarOpen={isSidebarOpen}
                              isMobile={isMobile}
                              toggleSidebar={toggleSidebar}
                            />
                          }
                        />    
                        <Route
                          path="/program-management/activity"
                          element={
                            <ProgramManagementActivityCategories
                              isSidebarOpen={isSidebarOpen}
                              isMobile={isMobile}
                              toggleSidebar={toggleSidebar}
                            />
                          }
                        />
                        <Route
                          path="/program-management/classes"
                          element={
                            <ProgramManagementClasses
                              isSidebarOpen={isSidebarOpen}
                              isMobile={isMobile}
                              toggleSidebar={toggleSidebar}
                            />
                          }
                        />
                        <Route
                          path="/program-management/key-points"
                          element={
                            <ProgramManagementKeyPoints
                              isSidebarOpen={isSidebarOpen}
                              isMobile={isMobile}
                              toggleSidebar={toggleSidebar}
                            />
                          }
                        />                        
                        <Route
                          path="/events"
                          element={
                            <Events
                              isSidebarOpen={isSidebarOpen}
                              isMobile={isMobile}
                              toggleSidebar={toggleSidebar}
                            />
                          }
                        />     
                        <Route
                          path="/collaborations"
                          element={
                            <Collaborations
                              isSidebarOpen={isSidebarOpen}
                              isMobile={isMobile}
                              toggleSidebar={toggleSidebar}
                            />
                          }
                        />   
                        <Route
                          path="/locations/map"
                          element={
                            <Map
                              isSidebarOpen={isSidebarOpen}
                              isMobile={isMobile}
                              toggleSidebar={toggleSidebar}
                            />
                          }
                        />      
                        <Route
                          path="/locations/branch-list"
                          element={
                            <BranchList
                              isSidebarOpen={isSidebarOpen}
                              isMobile={isMobile}
                              toggleSidebar={toggleSidebar}
                            />
                          }
                        />   
                        <Route
                          path="/forms/contact-us"
                          element={
                            <ContactUs
                              isSidebarOpen={isSidebarOpen}
                              isMobile={isMobile}
                              toggleSidebar={toggleSidebar}
                            />
                          }
                        />     
                      <Route
                          path="/forms/book-a-free-trial"
                          element={
                            <BookAFreeTrial
                              isSidebarOpen={isSidebarOpen}
                              isMobile={isMobile}
                              toggleSidebar={toggleSidebar}
                            />
                          }
                        />   
                        <Route
                          path="/facilities-management/facilities"
                          element={
                            <FacilitiesManagementFacilities
                              isSidebarOpen={isSidebarOpen}
                              isMobile={isMobile}
                              toggleSidebar={toggleSidebar}
                            />
                          }
                        />  
                        <Route
                          path="/facilities-management/link-facilities"
                          element={
                            <FacilitiesManagementLinkFacilities
                              isSidebarOpen={isSidebarOpen}
                              isMobile={isMobile}
                              toggleSidebar={toggleSidebar}
                            />
                          }
                        />    
                        <Route
                          path="/courts-management/courts"
                          element={
                            <Courts
                              isSidebarOpen={isSidebarOpen}
                              isMobile={isMobile}
                              toggleSidebar={toggleSidebar}
                            />
                          }
                        />     
                        <Route
                          path="/courts-management/link-courts"
                          element={
                            <LinkCourts
                              isSidebarOpen={isSidebarOpen}
                              isMobile={isMobile}
                              toggleSidebar={toggleSidebar}
                            />
                          }
                        />    
                        <Route
                          path="/customer-testimonial"
                          element={
                            <CustomerTestimonial
                              isSidebarOpen={isSidebarOpen}
                              isMobile={isMobile}
                              toggleSidebar={toggleSidebar}
                            />
                          }
                        /> 
                        <Route
                          path="/trainers"
                          element={
                            <Trainers
                              isSidebarOpen={isSidebarOpen}
                              isMobile={isMobile}
                              toggleSidebar={toggleSidebar}
                            />
                          }
                        />  
                        <Route
                          path="/link-classes"
                          element={
                            <ProgramManagementLinkClasses
                              isSidebarOpen={isSidebarOpen}
                              isMobile={isMobile}
                              toggleSidebar={toggleSidebar}
                            />
                          }
                        />   
                        <Route
                          path="/schedules"
                          element={
                            <Schedules
                              isSidebarOpen={isSidebarOpen}
                              isMobile={isMobile}
                              toggleSidebar={toggleSidebar}
                            />
                          }
                        />                                                                                                                                                                                                                                                                                                  
                      </Routes>
                    </div>
                  </div>
                  <Footer
                    isSidebarOpen={isSidebarOpen}
                    isMobile={isMobile}
                    toggleSidebar={toggleSidebar}
                  />
                </>
              }
            />
          )}
        </Routes>
      </NotificationProvider>
    </Router>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  layout: {
    display: "flex",
    minHeight: "100vh",
  },
  content: {
    flex: 1,
    padding: "20px",
    backgroundColor: "#F4F6F8",
  },
};

export default App;