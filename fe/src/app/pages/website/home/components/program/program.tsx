import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Search, ArrowLeft, ArrowRight } from "lucide-react";
import { Radio, Input, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom"; 

interface Program {
  mp_id: number;
  mp_name: string;
  mp_slug: string;
  mp_description: string;
  mp_thumbnail: string; 
}

export interface ProgramCategories {
  mpc_id: number;
  mpc_name: string;
  mpc_status: boolean;
}

export interface ProgramCategoriesResponse {
  success: boolean;
  data: ProgramCategories[];
  message: string;
}

const styles: { [key: string]: React.CSSProperties } = {
  heading: {
    fontFamily: "Rubik, sans-serif",
    fontWeight: "bold",
    fontSize: "1.125rem",
    marginLeft: "0.5rem",
    marginBottom: 0,
  },
  content: {
    maxWidth: "1200px",
    margin: "0 auto",
    paddingTop: "40px",
  },
  styleRadius: {
    borderRadius: "10px",
  },
};

export default function Programs() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<{ id: number; name: string }>({
    id: 0,
    name: "All",
  });
  const [programCategories, setProgramCategories] = useState<ProgramCategories[]>([]);
  const [search, setSearch] = useState("");
  const [programs, setPrograms] = useState<Program[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const API_URL = process.env.REACT_APP_API_URL;
  const API_URLIMAGE = process.env.REACT_APP_API_IMAGE_URL;     

  // === Fetch Program Categories ===
  const fetchProgramCategories = async () => {
    // setLoading(true);
    try {
      const response = await axios.get<ProgramCategoriesResponse>(
        `${API_URL}/user/v1/program-categories`
      );

      setProgramCategories(response.data.data);
    } catch (error) {
      console.error("Failed to fetch program categories:", error);
    } finally {
      // setLoading(false);
    }
  };  

  const fetchPrograms = async () => {
    try {
      const res = await axios.get(`${API_URL}/user/v1/program`);
      if (res.data.success) {
        setPrograms(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching programs:", err);
    }
  };  

  const handleSearchChange = async (value: string) => {
    setSearch(value);
    try {
      const res = await axios.post(`${API_URL}/user/v1/programs`, {
        mp_category_id: selectedCategory.id, // bisa dinamis
        search: search
      });
      setPrograms(res.data.data);
    } catch (err) {
      console.error("Error fetching programs:", err);
    }
  };

  const handleCategoryChange = async (value: number) => {
    // update state category (object)
    if (value === 0) {
      setSelectedCategory({ id: 0, name: "All" });

      setLoading(true);
      try {
        const body = {
          "mp_category_id": null,
          "search": search
        }

        const response = await axios.post(
          `${API_URL}/user/v1/program/with-search`,
          body
        );

        setPrograms(response.data.data);
      } catch (error) {
        console.error("Failed to fetch programs:", error);
      } finally {
        setLoading(false);
      }

    } else {
      const cat = programCategories.find((c) => c.mpc_id === value);
      
      console.log("selected category", cat);
      setSelectedCategory(
        cat ? { id: cat.mpc_id, name: cat.mpc_name } : { id: 0, name: "All" }
      );

      setLoading(true);
      try {
        const body = {
          "mp_category_id": cat?.mpc_id,
          "search": search
        }

        const response = await axios.post(
          `${API_URL}/user/v1/program/with-search`,
          body
        );

        setPrograms(response.data.data);
      } catch (error) {
        console.error("Failed to fetch programs:", error);
      } finally {
        setLoading(false);
      }

    }
  };  

  // ✅ Ambil data dari API
  useEffect(() => {
    fetchPrograms();
    fetchProgramCategories();
  }, []);

  const filteredPrograms = programs.filter((p) =>
    p.mp_name.toLowerCase().includes(search.toLowerCase())
  );

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -200, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 200, behavior: "smooth" });
  };

  // State untuk drag scroll
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeftPos = useRef(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault(); // cegah drag image bawaan browser
    isDown.current = true;
    startX.current = e.pageX - (scrollRef.current?.offsetLeft || 0);
    scrollLeftPos.current = scrollRef.current?.scrollLeft || 0;
  };

  const handleMouseLeave = () => {
    isDown.current = false;
  };

  const handleMouseUp = () => {
    isDown.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDown.current) return;
    e.preventDefault();
    const x = e.pageX - (scrollRef.current?.offsetLeft || 0);
    const walk = (x - startX.current) * 1.5; // kecepatan scroll
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollLeftPos.current - walk;
    }
  };

  return (
    <div className="bg-white rounded-2xl w-full" style={styles.content}>
      {/* Header */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        {/* Kiri: Radio Group + Title */}
        <div className="flex items-center gap-2">
            <Radio.Group
              value={selectedCategory.id} // pakai ID saja
              onChange={(e) => {
                const catId = e.target.value;
                if (catId === 0) {
                  setSelectedCategory({ id: 0, name: "All" });
                } else {
                  const cat = programCategories.find((c) => c.mpc_id === catId);
                  if (cat) {
                    setSelectedCategory({ id: cat.mpc_id, name: cat.mpc_name });
                  }
                }
                handleCategoryChange(catId); // tetap panggil API fetch sesuai kategori
              }}
              optionType="button"
              buttonStyle="solid"
              className="flex flex-wrap gap-0"
            >
              <Radio.Button key="all" value={0}>
                All
              </Radio.Button>
              {programCategories.map((cat) => (
                <Radio.Button key={cat.mpc_id} value={cat.mpc_id} className="capitalize">
                  {cat.mpc_name}
                </Radio.Button>
              ))}
            </Radio.Group>

          <h2 className="font-bold text-lg mb-0" style={styles.heading}>
            Programs
          </h2>
        </div>

        {/* Kanan: Search + Button */}
        <div className="ml-auto flex items-center gap-2">
          <Input
            placeholder="Search here..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            size="middle"
            suffix={<SearchOutlined />}
            className="w-48"
          />
          <Button type="primary" onClick={() => navigate("/programs")}>View All →</Button>
        </div>
      </div>

      {/* Cards - scroll horizontal dengan drag */}
      <div className="relative">
        <div
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className="flex gap-4 overflow-x-auto scroll-smooth pb-2 hide-scrollbar cursor-grab active:cursor-grabbing"
        >
          {filteredPrograms.map((program) => (
            <Link key={program.mp_id} to={`/programs/${program.mp_slug}`}
              className="relative rounded-xl overflow-hidden shadow-sm group cursor-pointer flex-shrink-0 w-48"
            >
              <img
                src={`${API_URLIMAGE}/uploads/program/thumbnail/${program.mp_thumbnail}`}
                alt={program.mp_name}
                draggable={false} // supaya tidak kebawa saat drag
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
              />
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[70%] text-center bg-white/90 rounded-lg py-1 text-sm font-medium">
                {program.mp_name}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-6">
        <div className="flex gap-2">
          <button
            onClick={scrollLeft}
            className="p-2 border hover:bg-gray-100"
            style={styles.styleRadius}
          >
            <ArrowLeft size={18} />
          </button>
          <button
            onClick={scrollRight}
            className="p-2 border hover:bg-gray-100"
            style={styles.styleRadius}
          >
            <ArrowRight size={18} />
          </button>
        </div>
        <p className="text-sm text-gray-500 max-w-md text-right">
          Reserve a court for individual practice, team sessions, or personalized coaching to elevate your performance.
        </p>
      </div>
    </div>
  );
}