// src/components/ProgramsMobile.tsx
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

interface Program {
  mp_id: number;
  mp_name: string;
  mp_slug: string;
  mp_thumbnail: string;
}

interface ProgramCategory {
  mpc_id: number;
  mpc_name: string;
  mpc_status: boolean; 
}

export default function ProgramsMobile() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<number>(0);
  const [categories, setCategories] = useState<ProgramCategory[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL;
  const API_URLIMAGE = process.env.REACT_APP_API_IMAGE_URL;

  // === Fetch Categories ===
  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_URL}/user/v1/program-categories`);
      if (res.data.success) {
        setCategories([{ mpc_id: 0, mpc_name: "All", mpc_status: true }, ...res.data.data]);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  // === Fetch Programs ===
  const fetchPrograms = async (categoryId: number | null = null) => {
    setLoading(true);
    try {
      const body = {
        mp_category_id: categoryId === 0 ? null : categoryId,
        search: ""
      };

      const res = await axios.post(`${API_URL}/user/v1/program/with-search`, body);
      if (res.data.success) {
        setPrograms(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching programs:", err);
    } finally {
      setLoading(false);
    }
  };

  // === Load awal ===
  useEffect(() => {
    fetchCategories();
    fetchPrograms();
  }, []);

  // === Scroll left/right ===
  const scrollLeft = () => scrollRef.current?.scrollBy({ left: -150, behavior: "smooth" });
  const scrollRight = () => scrollRef.current?.scrollBy({ left: 150, behavior: "smooth" });

  // === Drag scroll ===
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeftPos = useRef(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isDown.current = true;
    startX.current = e.pageX - (scrollRef.current?.offsetLeft || 0);
    scrollLeftPos.current = scrollRef.current?.scrollLeft || 0;
  };
  const handleMouseLeave = () => { isDown.current = false; };
  const handleMouseUp = () => { isDown.current = false; };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDown.current) return;
    e.preventDefault();
    const x = e.pageX - (scrollRef.current?.offsetLeft || 0);
    const walk = (x - startX.current) * 1.5;
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollLeftPos.current - walk;
    }
  };

  return (
    <div className="bg-white rounded-2xl p-4 w-full">
      {/* Programs Title */}
      <h2 className="text-lg sm:text-sm font-bold text-gray-800 flex items-center gap-2 leading-none mb-3">
        Programs
        <span className="w-5 h-[2px] bg-red-500 inline-block" />
      </h2>

      {/* Categories + scroll arrows */}
      <div className="flex items-center mb-4">
        <div className="flex gap-1 overflow-x-auto hide-scrollbar flex-1">
          {categories.map((cat) => (
            <button
              key={cat.mpc_id}
              onClick={() => {
                setSelectedCategory(cat.mpc_id);
                fetchPrograms(cat.mpc_id);
              }}
              className={`px-3 py-1 text-xs font-medium border transition-colors rounded-lg
                ${selectedCategory === cat.mpc_id
                  ? "bg-[#C2D7FF] text-[#273088] border-[#273088]"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                }
              `}
            >
              {cat.mpc_name.charAt(0).toUpperCase() + cat.mpc_name.slice(1)}
            </button>
          ))}
        </div>

        {/* Scroll buttons */}
        <div className="flex gap-1 ml-2">
          <button
            onClick={scrollLeft}
            className="p-1.5 text-xs font-medium rounded-lg border border-gray-300 bg-[#67A076] text-white hover:bg-[#2a5336] transition-colors"
          >
            <ArrowLeft size={14} />
          </button>
          <button
            onClick={scrollRight}
            className="p-1.5 text-xs font-medium rounded-lg border border-gray-300 bg-[#67A076] text-white hover:bg-[#2a5336] transition-colors"
          >
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Cards */}
      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className="flex gap-2 overflow-x-auto scroll-smooth pb-2 hide-scrollbar cursor-grab active:cursor-grabbing"
      >
        {programs.map((program) => (
          <Link key={program.mp_id} to={`/programs/${program.mp_slug}`}
            className="relative rounded-xl overflow-hidden shadow-sm group cursor-pointer flex-shrink-0 w-36"
          >
            <img
              src={`${API_URLIMAGE}/uploads/program/thumbnail/${program.mp_thumbnail}`}
              alt={program.mp_name}
              draggable={false}
              className="w-full h-36 object-cover group-hover:scale-105 transition-transform"
            />
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[80%] text-center bg-white/90 rounded-lg py-1 text-xs font-medium">
              {program.mp_name}
            </div>
          </Link>
        ))}

        {/* Card View All → */}
        <div
          onClick={() => navigate("/programs")}
          className="relative rounded-xl overflow-hidden shadow-sm cursor-pointer flex-shrink-0 w-36 bg-blue-600 flex items-center justify-center"
        >
          <span className="text-white text-xs font-medium flex items-center gap-1">
            View All <ArrowRight size={14} />
          </span>
        </div>
      </div>
    </div>
  );
}
