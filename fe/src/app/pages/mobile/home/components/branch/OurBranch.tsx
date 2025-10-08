// src/components/OurBranchMobileGrid.tsx
import React, { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 

interface Branch {
  name: string;
  images?: { src: string }[];
  mapEmbed?: string;
}

const OurBranchMobileGrid: React.FC = () => {
  const navigate = useNavigate();

  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { amount: 0.3 });

  const [branches, setBranches] = useState<Branch[]>([]);
  const API_URL = process.env.REACT_APP_API_URL;
  const API_URLIMAGE = process.env.REACT_APP_API_IMAGE_URL;

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const res = await axios.get(`${API_URL}/user/v1/branch/with-formatted`);
        if (res.data?.success && Array.isArray(res.data.data)) {
          setBranches(res.data.data);
        }
      } catch (err) {
        console.error("Error fetching branches:", err);
      }
    };

    fetchBranches();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-4 px-4 bg-white text-center"
    >
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
          Our Branch
          <span className="w-5 h-[2px] bg-red-500 inline-block" />
        </h2>
      </motion.div>

      {/* Paragraf kecil */}
      <motion.p
        className="text-gray-600 text-sm mb-4 max-w-sm mx-auto"
        initial={{ opacity: 0, y: 10 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
      >
        From a single location to multiple branches, our journey has always been
        about getting closer to you. Each branch is more than just a place—it’s
        where our passion meets your needs, bringing the same quality and care
        wherever you find us.
      </motion.p>

      {/* Grid 2x2 dengan kotak */}
      <motion.div
        className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {branches.map((branch, index) => (
          <div
            key={index}
            className="flex flex-col items-center flex-shrink-0 w-40"
            onClick={() => window.open(branch.mapEmbed, "_blank")} // ← ini yang ditambahkan
          >
            <div className="rounded-xl bg-gray-200 h-32 w-full shadow-sm hover:shadow-md transition-all duration-200">
              {branch.images && branch.images[0]?.src && (
                <img
                  src={`${API_URLIMAGE}/uploads/branchs/${branch.images[0].src}`}
                  alt={branch.name}
                  className="w-full h-full object-cover rounded-xl"
                />
              )}
            </div>
            <span className="mt-2 font-semibold text-gray-800 text-center">{branch.name}</span>
          </div>
        ))}
      </motion.div>
    </section>
  );
};

export default OurBranchMobileGrid;