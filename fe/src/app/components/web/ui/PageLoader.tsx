import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";

interface PageLoaderProps {
  isLoading: boolean;
  isSidebarOpen: boolean;
  isMobile: boolean;
}

const PageLoader: React.FC<PageLoaderProps> = ({ isLoading, isSidebarOpen, isMobile }) => {
  const [show, setShow] = useState(isLoading);

  useEffect(() => {
    if (!isLoading) {
      const timeout = setTimeout(() => setShow(false), 500);
      return () => clearTimeout(timeout);
    } else {
      setShow(true);
    }
  }, [isLoading]);

  if (!show) return null;

  return (
    <motion.div
      style={{
        marginLeft: isSidebarOpen && !isMobile ? "274px" : "0",
      }}
      className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 backdrop-blur-md z-50 transition-all duration-300"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-16 h-16 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
    </motion.div>
  );
};

export default PageLoader;