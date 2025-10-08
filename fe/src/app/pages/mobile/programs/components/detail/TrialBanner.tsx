import React from "react";
import bgFooter from "../../../../../assets/images/banner/footer-programs.png";
import { useNavigate } from "react-router-dom";

const TrialBanner: React.FC = () => {
  const navigate = useNavigate(); 

  const handleClick = () => {
    navigate("/free-trial"); // arahkan ke /free-trial
  };

  return (
    <div className="w-full bg-gray-100 py-10 px-4">
      <div
        className="relative max-w-5xl mx-auto h-32 md:h-40 lg:h-48 rounded-lg overflow-hidden"
        style={{
          backgroundImage: `url(${bgFooter})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-center px-4">
          <h2 className="text-white text-lg md:text-2xl lg:text-3xl font-bold mb-2">
            Begin your complimentary trial today
          </h2>
          <button 
            onClick={handleClick}
            className="bg-white text-black font-medium px-6 py-2 rounded-full shadow-md hover:bg-gray-100 transition">
            Book a Trial/ Tour
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrialBanner;
