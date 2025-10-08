import React, { useRef, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Container } from "../../../components/web/layout";
import ProgramsHeaderDetail from "./components/programs-header-detail/index";
import SimpleCarousel from "../../../pages/mobile/programs/components/detail/SimpleCarousel";
import TrialBanner from "../../../pages/mobile/programs/components/detail/TrialBanner";

/* =======================
   Styles
======================= */
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    paddingTop: "55px",
    paddingBottom: "55px",
    transition: "margin-left 0.3s ease-in-out",
  },
  headingTitle: {
    fontFamily: "Raleway, sans-serif",
    fontWeight: "bold",
    fontSize: "1.6rem",
    marginBottom: "0.5rem",
    textAlign: "left",
  },
  headingTitleKeyPoints: {
    fontFamily: "Raleway, sans-serif",
    fontWeight: "bold",
    fontSize: "0.95rem",
    marginBottom: "0.5rem",
    textAlign: "left",
  },
  headingSubAaccess: {
    fontFamily: "Rubik, sans-serif",
    fontWeight: "normal",
    fontSize: "0.95rem",
    color: "#555",
    maxWidth: "100%",
    margin: "0 auto",
    textAlign: "left",
    lineHeight: 1.5,
  },
};

/* =======================
   Component
======================= */
const ProgramsWebsiteDetail: React.FC = () => {
  const { mp_slug } = useParams<{ mp_slug: string }>();
  const [program, setProgram] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL = process.env.REACT_APP_API_URL;
  const API_URLIMAGE = process.env.REACT_APP_API_IMAGE_URL; 

  useEffect(() => {
    const fetchProgramDetail = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/user/v1/program/${mp_slug}`);
        setProgram(response.data.data);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
        setLoading(false);
      }
    };

    if (mp_slug) fetchProgramDetail();
  }, [mp_slug, API_URL]);

  if (error) return <p>Error: {error}</p>;

  return (
    <div style={styles.container}>
      <Container style={{ padding: 0, paddingBottom: "30px" }}>
        {/* Header */}
        <ProgramsHeaderDetail 
          title={loading ? "Loading..." : program?.mp_name || "Program Detail"} 
          breadcrumb={loading ? "Loading..." : `Home / Programs / ${program?.mp_name || ""}`} 
        />

        {/* Body */}
        <div className="flex flex-col md:flex-row gap-6 mt-6 px-4 md:px-10">
          
          {/* Left Section - Text */}
          <div className="md:w-1/2">
            <h2 className="font-bold mb-4" style={styles.headingTitle}>
              {loading ? <span className="bg-gray-300 h-6 w-48 inline-block animate-pulse rounded"></span> : program?.mp_name}
            </h2>

            <p className="text-gray-700 mb-4 leading-relaxed" style={styles.headingSubAaccess}>
              {loading ? (
                <>
                  <span className="block bg-gray-300 h-4 w-full mb-2 animate-pulse rounded"></span>
                  <span className="block bg-gray-300 h-4 w-5/6 mb-2 animate-pulse rounded"></span>
                  <span className="block bg-gray-300 h-4 w-3/4 animate-pulse rounded"></span>
                </>
              ) : (
                program?.mp_description
              )}
            </p>

            {/* Key Points */}
            <div className="border rounded-lg p-4 bg-white shadow-sm">
              {loading ? (
                <div className="space-y-2">
                  {/* Placeholder untuk judul */}
                  <div className="bg-gray-300 h-4 w-32 mb-2 animate-pulse rounded"></div>
                  {/* Placeholder untuk list */}
                  <div className="bg-gray-300 h-3 w-3/4 animate-pulse rounded"></div>
                  <div className="bg-gray-300 h-3 w-2/3 animate-pulse rounded"></div>
                  <div className="bg-gray-300 h-3 w-1/2 animate-pulse rounded"></div>
                </div>
              ) : (
                <>
                  <h3 style={styles.headingTitleKeyPoints}>Key Points</h3>
                  <ol className="list-decimal list-inside text-sm text-gray-600 space-y-1">
                    {program?.key_points?.map((kp: any) => (
                      <li key={kp.mpkp_id}>{kp.key_point}</li>
                    ))}
                  </ol>
                </>
              )}
            </div>

          </div>

          {/* Right Section - Carousel */}
          <div className="md:w-1/2 flex justify-center">
            {loading ? (
              <div className="bg-gray-300 w-full h-64 animate-pulse rounded"></div>
            ) : (
              <SimpleCarousel
                images={program?.images?.map((img: any) => `${API_URLIMAGE}/uploads/program/images/${img.image}`) || []}
              />
            )}
          </div>
        </div>
      </Container>

      {/* Banner */}
      <TrialBanner />
    </div>
  );
};

export default ProgramsWebsiteDetail;