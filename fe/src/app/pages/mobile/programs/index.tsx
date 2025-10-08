import React, { useRef, useState, useEffect } from "react";
import { Container } from "../../../components/web/layout";
import ProgramsHeader from "./components/programs-header";
import { motion, useInView } from "framer-motion";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import { Select, Input } from "antd";
import { Link } from "react-router-dom";
import { SearchOutlined } from "@ant-design/icons";

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
    paddingTop: "55px",
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

const ProgramsMobile: React.FC = () => {

  const [selectedCategory, setSelectedCategory] = useState<{ id: number; name: string }>({
    id: 0,
    name: "All",
  });
  const [selectedAge, setSelectedAge] = useState<{ id: number; label: string }>({
    id: 0,
    label: "All",
  });

  const [search, setSearch] = useState("");
  const [isSticky, setIsSticky] = useState(false);

  const sectionRef = useRef(null);
  const stickyRef = useRef<HTMLDivElement>(null);
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

  // === Fetch Data Awal ===
  useEffect(() => {
    fetchPrograms(currentPage);
    fetchProgramCategories();
    fetchAgeGroups();
  }, [currentPage]);  

  useEffect(() => {
    const handleScroll = () => {
      if (!stickyRef.current) return;
      const offsetTop = stickyRef.current.getBoundingClientRect().top;
      setIsSticky(offsetTop <= 55); // 55px = top offset
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
      <Container style={{ padding: 0, border: 0, paddingBottom: "50px" }}> 

        {/* Header */}
        <ProgramsHeader title="PROGRAMS" breadcrumb="Home / Programs" />

        {/* Title + Description */}
        <div ref={sectionRef} className="mt-4 mb-0 px-6 pt-0">
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

        {/* Sticky Filter + Search */}
        <div
          ref={stickyRef}
          className={`sticky top-[55px] z-50 bg-white pt-3 transition-shadow duration-300 ${
            isSticky ? "shadow-md border-b border-gray-200" : ""
          }`}
        >
          {/* Filter Section */}
          <div className="flex flex-wrap items-center justify-between px-4 sm:px-6 lg:px-10 mb-6 gap-4">
            {/* Filter by Category */}
            <div className="flex-1 max-w-xs">
              <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
                Filter by Category
              </label>
              <Select
                placeholder="Select Category"
                value={selectedCategory.id} // gunakan ID sebagai value
                onChange={(val) => handleCategoryChange(val)} // panggil fungsi handleCategoryChange
                className="text-gray-800 w-full"
              >
                <Option key={0} value={0}>All</Option>
                {programCategories.map((cat) => (
                  <Option key={cat.mpc_id} value={cat.mpc_id}>
                    {cat.mpc_name.charAt(0).toUpperCase() + cat.mpc_name.slice(1)}
                  </Option>
                ))}
              </Select>
            </div>

            {/* Filter by Ages */}
            <div className="flex-1 max-w-xs">
              <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
                Filter by Ages
              </label>
              <Select
                placeholder="Select Age"
                value={selectedAge.id} // gunakan ID sebagai value
                onChange={(val) => handleAgeChange({ value: val, label: "" })} // panggil fungsi handleAgeChange
                className="text-gray-800 w-full"
              >
                <Option key={0} value={0}>All</Option>
                {ageGroups.map((age) => (
                  <Option key={age.mpa_id} value={age.mpa_id}>
                    {age.mpa_min} - {age.mpa_max} Years
                  </Option>
                ))}
              </Select>
            </div>
          </div>

          {/* Search Section */}
          <div className="flex flex-col items-center mt-0 mb-4 px-4 sm:px-6 lg:px-10 w-full">
            <Input
              placeholder="Search here..."
              value={search}
              onChange={handleSearchChange}
              size="large"
              prefix={<SearchOutlined />}
              allowClear
              className="rounded-lg w-full max-w-3xl"
            />
            <div className="mt-3 text-sm text-gray-700 text-center w-full">
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
        </div>

        {/* Legend / Sign */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {[
            { color: "bg-red-300", label: "Fitness, Wellness & Dance" },
            { color: "bg-blue-200", label: "Sport" },
            { color: "bg-yellow-400", label: "Non-Sports & Legends" },
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${item.color}`}></span>
              <span className="text-sm text-gray-700 leading-none">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Programs List View */}
        <div className="flex flex-col gap-2.5 px-4 sm:px-6 lg:px-10 pb-10">
          {loading ? (
            // Skeleton placeholder
            Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between bg-gray-200 rounded-lg p-3 animate-pulse min-h-[56px]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                  <div className="flex flex-col gap-1">
                    <div className="h-4 w-40 bg-gray-300 rounded"></div>
                    <div className="h-3 w-24 bg-gray-300 rounded"></div>
                  </div>
                </div>
                <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
              </div>
            ))
          ) : filteredPrograms.length === 0 ? (
            <div className="text-center text-gray-500 text-sm py-6">
              No programs found
            </div>
          ) : (
            filteredPrograms.map((program, index) => {
              const colorClass = getTypeColor(program.mp_type?.id || 0);

              const typeLabelMap: { [key: number]: string } = {
                1: "Fitness, Wellness & Dance",
                2: "Sport",
                3: "Non-Sports & Legends",
              };
              const label = typeLabelMap[program.mp_type?.id || 0] || "Unknown";

              return (
                <Link
                  key={program.mp_id || index}
                  to={`/programs/${program.mp_slug}`}
                  className="flex items-center justify-between bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow duration-200 no-underline min-h-[56px]"
                >
                  <div className="flex items-center">
                    <span className={`w-3 h-3 rounded-full flex-shrink-0 mr-3 ${colorClass}`}></span>
                    <div className="flex flex-col">
                      <span className="text-gray-800 font-medium text-base">
                        {program.mp_name || "Unnamed Program"}
                      </span>
                      <span className={`text-xs mt-0.5 font-medium ${colorClass.replace("bg-", "text-")}`}>
                        {label}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="text-gray-400" />
                </Link>
              );
            })
          )}
        </div>


      </Container>
    </div>
  );
};

export default ProgramsMobile;
