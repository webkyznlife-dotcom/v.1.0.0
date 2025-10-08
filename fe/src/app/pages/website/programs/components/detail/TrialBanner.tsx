import React from "react";
import { useNavigate } from "react-router-dom";
import bgFooter from "../../../../../assets/images/banner/footer-programs.png";

const TrialBanner: React.FC = () => {
  const navigate = useNavigate(); 

  const handleClick = () => {
    navigate("/free-trial"); // arahkan ke /free-trial
  };

  return (
    <div className="w-full bg-gray-100 py-10">
      <div
        className="relative max-w-4xl mx-auto h-40 md:h-48 lg:h-56 rounded-lg overflow-hidden cursor-pointer"
        style={{
          backgroundImage: `url(${bgFooter})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-center px-4">
          <h2 className="text-white text-xl md:text-2xl lg:text-3xl font-bold mb-4">
            Begin your complimentary trial today
          </h2>
          <button
            onClick={handleClick}
            className="bg-white text-black font-medium px-6 py-2 rounded-full shadow-md hover:bg-gray-100 transition"
          >
            Book a Trial/ Tour
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrialBanner;