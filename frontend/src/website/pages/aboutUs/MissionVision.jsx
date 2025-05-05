import { Target, Compass, ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import image from "../../images/aboutBg.jpg"; // Ensure this path is correct

export function MissionVision() {
  const [missionExpanded, setMissionExpanded] = useState(false);
  const [visionExpanded, setVisionExpanded] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get("/api/missionVision/get");
        console.log("API Response:", response.data);
        setData(response.data.data[0]);
      } catch (error) {
        console.error("Error fetching mission and vision data:", error);
      }
    }
    fetchData();
  }, []);

  if (!data) {
    return (
      <section className="py-16 px-6 flex  items-center justify-center min-h-screen relative text-white">
        {/* Background Image with Overlay for Loading State */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/50 z-10"></div>
          <img
            src={image}
            alt="Background"
            className="w-full h-full object-cover" // Changed to object-cover
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/1920x1080?text=Background+Image"; // Fallback image
              console.error("Failed to load background image");
            }}
          />
        </div>
        <div className="container mx-auto text-center relative z-20">
          <p>Loading...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen/2  flex items-center justify-center px-4 py-16">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/80 z-10" />
        <img
          src={image}
          alt="Background"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/1920x1080?text=Background+Image";
            console.error("Failed to load background image");
          }}
        />
      </div>

      {/* Centered Content */}
      <div className="relative z-20 w-full max-w-6xl text-white text-center">
        {/* Header */}
        <div className="mb-12 xl:-mt-12">
          <h2 className="text-3xl sm:text-4xl mt-5 font-bold tracking-tight mb-4">
            {data.heading || "Our Mission & Vision"}
          </h2>
          <div className="h-1 w-24 bg-[#7d5ea7] mx-auto rounded-full mb-4"></div>
          <p className="max-w-2xl mx-auto text-sm sm:text-base">
            {data.subHeading || "Guiding principles that drive our organization toward excellence and innovation"}
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-8 md:grid-cols-2">
          <Card
            icon={<Target className="h-6 w-6 text-white" />}
            title={data.missionTitle || "Our Mission"}
            description={data.missionDescription || ""}
            expanded={missionExpanded}
            setExpanded={setMissionExpanded}
            buttonText="Learn more about our approach"
            expandedContent={
              <>
                <h4 className="font-semibold text-white mb-3">Key Mission Pillars:</h4>
                <ul className="space-y-3 text-left">
                  {(data.missionPoints || []).map((point, index) => (
                    <li key={`mission-${index}`} className="flex items-start">
                      <div className="h-5 w-5 rounded-full bg-blue-600/30 flex items-center justify-center mt-0.5 mr-3">
                        <span className="text-xs text-white">{index + 1}</span>
                      </div>
                      <p>{point}</p>
                    </li>
                  ))}
                </ul>
              </>
            }
            theme="blue"
          />

          <Card
            icon={<Compass className="h-6 w-6 text-white" />}
            title={data.visionTitle || "Our Vision"}
            description={data.visionDescription || ""}
            expanded={visionExpanded}
            setExpanded={setVisionExpanded}
            buttonText=""
            expandedContent={<></>}
            theme="teal"
          />
        </div>
      </div>
    </section>
  );

}

function Card({ icon, title, description, expanded, setExpanded, buttonText, expandedContent, theme }) {
  const buttonColor = theme === "blue" ? "hover:text-white text-white" : "hover:text-white text-white";

  const bgColor = theme === "blue" ? "bg-[#965d99]" : "bg-[#965d99]";


  return (
    <div className={`${bgColor} backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 `}>
      <div className="p-8">
        <div className="flex items-center mb-6">
          <div className="p-3 bg-white/10 backdrop-blur-lg rounded-lg mr-4">
            {icon}
          </div>
          <h3 className="text-2xl font-bold text-white">{title}</h3>
        </div>
        <p className="text-white leading-relaxed mb-6">{description}</p>

        {expanded && (
          <div className="mt-6 pt-6 border-t border-white/10 text-white animate-fadeIn">
            {expandedContent}
          </div>
        )}
      </div>
    </div>
  );
}

Card.propTypes = {
  icon: PropTypes.element.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  expanded: PropTypes.bool.isRequired,
  setExpanded: PropTypes.func.isRequired,
  buttonText: PropTypes.string.isRequired,
  expandedContent: PropTypes.node.isRequired,
  theme: PropTypes.oneOf(["blue", "teal"]).isRequired,
};