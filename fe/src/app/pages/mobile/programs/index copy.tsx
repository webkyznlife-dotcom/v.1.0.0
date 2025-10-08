import React, { useRef, useState, useEffect } from "react";
import { Container } from "../../../components/web/layout";
import ProgramsHeader from "./components/programs-header";
import { motion, useInView } from "framer-motion";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import { Select, Input } from "antd";
import { Link } from "react-router-dom";
import { SearchOutlined } from "@ant-design/icons";

import zumbaImage from "../../../assets/images/program/zumba.png";

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

const programs = [
  { title: "Junior Taekwondo", image: zumbaImage, color: "#FF8A80", category: "Junior", slug: "basketball" },
  { title: "Starter Tennis", image: zumbaImage, color: "#80D8FF", category: "Junior", slug: "basketball" },
  { title: "Muay Thai", image: zumbaImage, color: "#FF8A80", category: "Adult", slug: "basketball" },
  { title: "Yoga", image: zumbaImage, color: "#80D8FF", category: "Adult", slug: "basketball" },
  { title: "Zumba", image: zumbaImage, color: "#FF8A80", category: "Adult", slug: "basketball" },
  { title: "Pilates", image: zumbaImage, color: "#FF8A80", category: "Adult", slug: "basketball" },
  { title: "Batting Cage", image: zumbaImage, color: "#80D8FF", category: "Junior", slug: "basketball" },
  { title: "Ninja Warrior", image: zumbaImage, color: "#FF8A80", category: "Junior", slug: "basketball" },
  { title: "Junior HipHop Dance", image: zumbaImage, color: "#FF8A80", category: "Junior", slug: "basketball" },
  { title: "Adult Soccer", image: zumbaImage, color: "#80D8FF", category: "Adult", slug: "basketball" },
  { title: "Junior Basketball", image: zumbaImage, color: "#80D8FF", category: "Junior", slug: "basketball" },
  { title: "Adult Basketball", image: zumbaImage, color: "#80D8FF", category: "Adult", slug: "basketball" },
];

const categories = ["All", "Adult", "Junior"];

const ProgramsMobile: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedAge, setSelectedAge] = useState("All");
  const [search, setSearch] = useState("");
  const [isSticky, setIsSticky] = useState(false);

  const sectionRef = useRef(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { amount: 0.3 });

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
    const matchCategory = selectedCategory === "All" || program.category === selectedCategory;
    const matchAge = selectedAge === "All" || program.category === selectedAge;
    const matchSearch = program.title.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchAge && matchSearch;
  });

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
                value={selectedCategory}
                onChange={(val) => setSelectedCategory(val || "All")}
                className="text-gray-800 w-full"
              >
                {categories.map((cat) => (
                  <Option key={cat} value={cat}>{cat}</Option>
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
                value={selectedAge}
                onChange={(val) => setSelectedAge(val || "All")}
                className="text-gray-800 w-full"
              >
                <Option value="All">All</Option>
                <Option value="Junior">Junior</Option>
                <Option value="Adult">Adult</Option>
              </Select>
            </div>
          </div>

          {/* Search Section */}
          <div className="flex flex-col items-center mt-0 mb-4 px-4 sm:px-6 lg:px-10 w-full">
            <Input
              placeholder="Search here..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              size="large"
              prefix={<SearchOutlined />}
              allowClear
              className="rounded-lg w-full max-w-3xl"
            />
            <div className="mt-3 text-sm text-gray-700 text-center w-full">
              Result for category : <strong>{selectedCategory}</strong>{" "}
              &nbsp;&nbsp; Ages : <strong>{selectedAge}</strong>
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
        <div className="flex flex-col gap-2.5 px-4 sm:px-6 lg:px-10">
          {filteredPrograms.map((program, index) => {
            let categoryInfo = { color: "bg-gray-300", label: "Unknown" };
            if (program.color === "#FF8A80") categoryInfo = { color: "bg-red-300", label: "Fitness, Wellness & Dance" };
            else if (program.color === "#80D8FF") categoryInfo = { color: "bg-blue-200", label: "Sport" };
            else if (program.color === "#FFEB3B") categoryInfo = { color: "bg-yellow-400", label: "Non-Sports & Legends" };

            return (
              <Link
                key={index}
                to={`/programs/${program.slug}`}
                className="flex items-center justify-between bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow duration-200 no-underline min-h-[56px]"
              >
                <div className="flex items-center">
                  <span className={`w-3 h-3 rounded-full flex-shrink-0 mr-3 ${categoryInfo.color}`}></span>
                  <div className="flex flex-col">
                    <span className="text-gray-800 font-medium text-base">{program.title}</span>
                    <span className={`text-xs mt-0.5 font-medium ${categoryInfo.color.replace("bg-", "text-")}`}>
                      {categoryInfo.label}
                    </span>
                  </div>
                </div>
                <ChevronRight className="text-gray-400" />
              </Link>
            );
          })}
        </div>
      </Container>
    </div>
  );
};

export default ProgramsMobile;
