import React, { useRef, useEffect, useState } from "react";
import { Container } from "../../../components/web/layout";
import ProgramsHeader from "./components/programs-header/index";
import { motion, useInView } from "framer-motion";
import { ArrowUpRight, Search } from "lucide-react";
import { Select, Radio } from "antd";
import { Link } from "react-router-dom";
import axios from "axios";

import zumbaImage from "../../../assets/images/program/zumba.png"; 

// ===== Interfaces untuk Program API Response =====
export interface ProgramType {
  id: number;
  name: string;
}

export interface ProgramImage {
  id: number;
  image: string;
  description: string;
  status: boolean;
}

export interface ProgramCategory {
  id: number;
  name: string;
}

export interface ProgramAge {
  id: number;
  min: number;
  max: number;
}

export interface ProgramActivityCategory {
  id: number;
  name: string;
}

export interface Program {
  mp_id: number;
  mp_name: string;
  mp_slug: string;
  mp_description: string;
  mp_status: boolean;
  mp_header_image: string;
  mp_thumbnail: string;
  created_at: string;
  updated_at: string;
  images: ProgramImage[];
  mp_category: ProgramCategory;
  mp_age: ProgramAge;
  mp_activity_category: ProgramActivityCategory;
  mp_type: ProgramType; // ⬅️ ditambahkan
}

export interface ProgramMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProgramResponse {
  success: boolean;
  data: Program[];
  meta: ProgramMeta;
  message: string;
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

export interface AgeGroups {
  mpa_id: number;
  mpa_min: number;
  mpa_max: number;
  mpa_status: boolean;
}

export interface AgeGroupsResponse {
  success: boolean;
  data: AgeGroups[];
  message: string;
}

const { Option } = Select;

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
  content: {
    maxWidth: "1200px",
  },
};

const ProgramsWebsite: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<{ id: number; name: string }>({
    id: 0,
    name: "All",
  });
  const [selectedAge, setSelectedAge] = useState<{ id: number; label: string }>({
    id: 0,
    label: "All",
  });


  const [search, setSearch] = useState("");

  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { amount: 0.3 });

  const API_URL = process.env.REACT_APP_API_URL;
  const API_URLIMAGE = process.env.REACT_APP_API_IMAGE_URL;


  // === State ===
  const [programs, setPrograms] = useState<Program[]>([]);
  const [programCategories, setProgramCategories] = useState<ProgramCategories[]>([]);
  const [ageGroups, setAgeGroups] = useState<AgeGroups[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1); 

  // === Config Pagination ===
  const itemsPerPage = 12;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPrograms = programs;  

  // Fungsi untuk handle age change
  const handleAgeChange = async (option: { value: number; label: React.ReactNode }) => {
    if (option.value === 0) {
      setSelectedAge({ id: 0, label: "All" });
    } else {
      const age = ageGroups.find((a) => a.mpa_id === option.value);
      if (age) {
        setSelectedAge({
          id: age.mpa_id,
          label: `${age.mpa_min} - ${age.mpa_max} Years`,
        });
      }
    }

    setCurrentPage(1);
    setLoading(true);

    try {
      const body = {
        page: 1,
        limit: itemsPerPage,
        mp_category_id: selectedCategory.id !== 0 ? selectedCategory.id : null,
        mp_age_id: option.value !== 0 ? option.value : null, // kirim ID age
      };

      const response = await axios.post<ProgramResponse>(
        `${API_URL}/user/v1/program/with-pagination`,
        body
      );

      setPrograms(response.data.data);
      setTotalPages(response.data.meta.totalPages);
    } catch (error) {
      console.error("Failed to fetch programs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = async (value: number) => {
    // update state category (object)
    if (value === 0) {
      setSelectedCategory({ id: 0, name: "All" });
    } else {
      const cat = programCategories.find((c) => c.mpc_id === value);
      setSelectedCategory(
        cat ? { id: cat.mpc_id, name: cat.mpc_name } : { id: 0, name: "All" }
      );
    }

    setCurrentPage(1);

    setLoading(true);
    try {
      const body = {
        page: 1,
        limit: itemsPerPage,
        mp_category_id: value !== 0 ? value : null,           // kirim ID kategori
        mp_age_id: selectedAge.id !== 0 ? selectedAge.id : null, // kirim ID age
      };

      const response = await axios.post<ProgramResponse>(
        `${API_URL}/user/v1/program/with-pagination`,
        body
      );

      setPrograms(response.data.data);
      setTotalPages(response.data.meta.totalPages);
    } catch (error) {
      console.error("Failed to fetch programs:", error);
    } finally {
      setLoading(false);
    }
  };


  // === Fetch Programs ===
  const fetchPrograms = async (page: number) => {
    setLoading(true);
    try {
      const body = {
        page,
        limit: itemsPerPage,
        mp_category_id:
          selectedCategory && selectedCategory.id !== 0
            ? selectedCategory.id
            : null, // ambil ID kategori
        mp_age_id:
          selectedAge && selectedAge.id !== 0
            ? selectedAge.id
            : null, // ambil ID age
      };

      const response = await axios.post<ProgramResponse>(
        `${API_URL}/user/v1/program/with-pagination`,
        body
      );

      setPrograms(response.data.data);
      setTotalPages(response.data.meta.totalPages);
    } catch (error) {
      console.error("Failed to fetch programs:", error);
    } finally {
      setLoading(false);
    }
  };

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

  // === Fetch Age Groups ===
  const fetchAgeGroups = async () => {
    // setLoading(true);
    try {
      const response = await axios.get<AgeGroupsResponse>(
        `${API_URL}/user/v1/age-groups`
      );

      setAgeGroups(response.data.data);
    } catch (error) {
      console.error("Failed to fetch age groups:", error);
    } finally {
      // setLoading(false);
    }
  };  

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    setCurrentPage(1); // reset ke halaman 1

    // Panggil fetchPrograms dengan search term
    const fetchProgramsWithSearch = async () => {
      setLoading(true);
      try {
        const body = {
          page: 1,
          limit: itemsPerPage,
          search: value || null, // kirim search ke backend
          mp_category_id: selectedCategory.id !== 0 ? selectedCategory.id : null,
          mp_age_id: selectedAge.id !== 0 ? selectedAge.id : null,
        };

        const response = await axios.post<ProgramResponse>(
          `${API_URL}/user/v1/program/with-pagination-search`,
          body
        );

        setPrograms(response.data.data);
        setTotalPages(response.data.meta.totalPages);
      } catch (error) {
        console.error("Failed to fetch programs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgramsWithSearch();
  };


  // === Load data pertama kali & ketika currentPage berubah ===
  useEffect(() => {
    fetchPrograms(currentPage);
    fetchProgramCategories();
    fetchAgeGroups();
  }, [currentPage]);  

  const filteredPrograms = programs.filter((program) => {
    // search (amankan jika mp_name undefined/null)
    const matchSearch = program.mp_name
      ? program.mp_name.toLowerCase().includes(search.toLowerCase())
      : false;

    return matchSearch;
  });


 const getTypeColor = (typeId: number): string => {
    switch (typeId) {
      case 1: // Fitness, Wellness & Dance
        return "bg-red-300/70";
      case 2: // Sport
        return "bg-blue-200/70";
      case 3: // Non-Sports & Legends
        return "bg-yellow-400/70";
      default:
        return "bg-gray-300/70"; // fallback
    }
  };

  return (
    <div style={styles.container}>
      <Container
          style={{
            padding: 0,
            border: 0,
            paddingBottom: loading ? "100px" : "50px",
          }}
        >
        
        {/* Header */}
        <ProgramsHeader title="PROGRAMS" breadcrumb="Home / Programs" />

        {/* Title + Description */}
        <div ref={sectionRef} className="mt-16 mb-12 px-10 pt-0">
          <motion.h2
            style={styles.headingAaccess}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            Discover Our Programs
          </motion.h2>

          <motion.p
            style={styles.headingSubAaccess}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          >
            KYZN Academy's Programs are designed to provide students with a
            well-rounded learning experience, covering all levels of skills and
            techniques. Explore a wide range of programs tailored to match your
            child’s interests and passions.
          </motion.p>
        </div>

        {/* Filter Section */}
          <div className="flex flex-wrap items-center justify-between mb-6 max-w-[1200px] w-full mx-auto">
            
          {/* Filter by Category */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700 text-center">
              Filter by Category
            </label>
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

          </div>

          {/* Filter by Ages */}
          <div className="mt-3 sm:mt-0 w-48">
            <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
              Filter by Ages
            </label>
            <Select
              labelInValue
              value={{ value: selectedAge.id, label: selectedAge.label }}
              onChange={handleAgeChange}
              className="text-gray-800 w-full"
            >
              <Option value={0}>All</Option>
              {ageGroups.map((age) => (
                <Option key={age.mpa_id} value={age.mpa_id}>
                  {age.mpa_min} - {age.mpa_max} Years
                </Option>
              ))}
            </Select>
          </div>

          </div>

        {/* Search + Result Info */}
        <div className="flex flex-col items-center mt-4 mb-10 px-10 max-w-[1200px] w-full mx-auto">
          <div className="w-full max-w-3xl relative">
            <input
              type="text"
              placeholder="Search here..."
              value={search}
              onChange={handleSearchChange}
              className="w-full border border-gray-300 rounded-full py-3 px-5 pr-10 focus:outline-none focus:ring-2 focus:ring-green-600 transition-all"
            />
            <Search
              size={18}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500"
            />
          </div>

          <div className="mt-3 text-sm text-gray-700">
            Result for category:{" "}
            <strong>
              {selectedCategory
                ? selectedCategory.name.charAt(0).toUpperCase() +
                  selectedCategory.name.slice(1)
                : "All"}
            </strong>{" "}
            &nbsp;&nbsp; Ages: <strong>{selectedAge.label}</strong>
          </div>

        </div>

        {/* Sign */}
        <div className="flex justify-center gap-6 mb-8 max-w-[1200px] w-full mx-auto">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-300"></span>
            <span className="text-sm text-gray-700">Fitness, Wellness & Dance</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-200"></span>
            <span className="text-sm text-gray-700">Sport</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
            <span className="text-sm text-gray-700">Non-Sports & Legends</span>
          </div>
        </div>
        {/* Sign End */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-[1200px] w-full mx-auto">
          {loading
            ? Array.from({ length: itemsPerPage }).map((_, idx) => (
                <div key={idx} className="animate-pulse w-full">
                  <div className="bg-gray-200 h-60 w-full rounded-xl mb-2"></div>
                  <div className="h-4 w-3/4 bg-gray-300 rounded mb-1"></div>
                  <div className="h-4 w-1/2 bg-gray-300 rounded"></div>
                </div>
              ))
            : filteredPrograms.length > 0
            ? filteredPrograms.map((program) => (
                <Link key={program.mp_id} to={`/programs/${program.mp_slug}`} className="block">
                  <div className="relative rounded-xl overflow-hidden group">
                    <img
                      src={`${API_URLIMAGE}/uploads/program/thumbnail/${program.mp_thumbnail}`}
                      alt={program.mp_name}
                      className="w-full h-60 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div
                      className={`absolute bottom-4 inset-x-4 flex items-center justify-between px-4 py-3 rounded-xl text-white ${getTypeColor(program.mp_type?.id || 0)} bg-opacity-70`}
                    >
                      <span className="font-medium">{program.mp_name}</span>
                      <ArrowUpRight size={18} className="text-white" />
                    </div>
                  </div>
                </Link>
              ))
            : (
                <div className="col-span-full text-center text-gray-500 py-10">
                  No programs found
                </div>
              )}
        </div>


        {/* Pagination */}
        {!loading && filteredPrograms.length > 0 && (
          <div className="flex justify-center items-center mt-10 space-x-2 mb-10 max-w-[1200px] w-full mx-auto">
            {/* Previous */}
            <button
              className="px-3 py-1 border rounded"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              &laquo;
            </button>
            <button
              className="px-3 py-1 border rounded"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              &lt;
            </button>

            {/* Page numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`px-3 py-1 border rounded ${
                  currentPage === page ? "bg-blue-500 text-white" : ""
                }`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}

            {/* Next */}
            <button
              className="px-3 py-1 border rounded"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              &gt;
            </button>
            <button
              className="px-3 py-1 border rounded"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              &raquo;
            </button>
          </div>
        )}


      </Container>
    </div>
  );
};

export default ProgramsWebsite;