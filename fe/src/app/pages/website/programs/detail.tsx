import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Container } from "../../../components/web/layout";
import ProgramsHeaderDetail from "./components/programs-header-detail/index";
import SimpleCarousel from "../../../pages/website/programs/components/detail/SimpleCarousel";
import TrialBanner from "../../../pages/website/programs/components/detail/TrialBanner";

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
        const response = await axios.get(
          `${API_URL}/user/v1/program/${mp_slug}`
        );
        setProgram(response.data.data);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
        setLoading(false);
      }
    };

    if (mp_slug) fetchProgramDetail();
  }, [mp_slug]);

  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <Container style={{ padding: 0, paddingBottom: "50px" }}>
        {/* Header */}
        <ProgramsHeaderDetail 
          title={loading ? "Loading..." : program?.mp_activity_category.name} 
          breadcrumb={loading ? "Loading..." : `Home / Programs / ${program?.mp_activity_category.name}`} 
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start mt-10 p-10 pl-0 pr-0 max-w-[1200px] w-full mx-auto">
          <div>
            {/* Title */}
            <h2 className="text-2xl font-bold mb-4">
              {loading ? <span className="bg-gray-300 h-6 w-48 inline-block animate-pulse rounded"></span> : program?.mp_name}
            </h2>

            {/* Description */}
            <p className="text-gray-700 leading-relaxed mb-6">
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
              <h3 className="text-lg font-bold mb-2">Key Points</h3>
              {loading ? (
                <div className="space-y-2">
                  <div className="bg-gray-300 h-3 w-3/4 animate-pulse rounded"></div>
                  <div className="bg-gray-300 h-3 w-2/3 animate-pulse rounded"></div>
                  <div className="bg-gray-300 h-3 w-1/2 animate-pulse rounded"></div>
                </div>
              ) : (
                <ol className="list-decimal list-inside text-sm text-gray-600 space-y-1">
                  {program.key_points?.map((kp: any) => (
                    <li key={kp.mpkp_id}>{kp.key_point}</li>
                  ))}
                </ol>
              )}
            </div>

          </div>

          {/* Carousel */}
          <div className="flex justify-center">
            {loading ? (
              <div className="bg-gray-300 w-full h-64 animate-pulse rounded"></div>
            ) : (
              <SimpleCarousel
                images={program.images?.map((img: any) => `${API_URLIMAGE}/uploads/program/images/${img.image}`) || []}
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