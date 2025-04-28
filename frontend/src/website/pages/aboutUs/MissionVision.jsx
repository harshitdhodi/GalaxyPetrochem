import { Target, Compass, ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { useState } from "react";
import PropTypes from "prop-types";

export function MissionVision() {
  const [missionExpanded, setMissionExpanded] = useState(false);
  const [visionExpanded, setVisionExpanded] = useState(false);

  return (
    <section className="py-24 px-6 bg-gradient-to-br from-indigo-900 via-blue-800 to-teal-700 text-white">
      <div className="container mx-auto max-w-5xl">
        {/* Header */} 
        <div className="text-center mb-16">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-blue-400 blur-md opacity-30"></div>
              <div className="relative inline-flex items-center justify-center p-4 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full">
                <Target className="h-8 w-8 text-blue-100" />
              </div>
            </div>
          </div>
          <h2 className="text-4xl font-bold tracking-tight mb-3">Our Mission & Vision</h2>
          <div className="h-1 w-24 bg-blue-400 mx-auto rounded-full mb-6"></div>
          <p className="text-blue-100 max-w-2xl mx-auto">
            Guiding principles that drive our organization toward excellence and innovation
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Mission Card */}
          <Card
            icon={<Target className="h-6 w-6 text-blue-200" />}
            title="Our Mission"
            description="Our mission is to transform hydrocarbon resources into valuable products that power modern life while continuously reducing our environmental footprint. We are committed to operational excellence, safety, and creating sustainable value for all stakeholders."
            expanded={missionExpanded}
            setExpanded={setMissionExpanded}
            buttonText="Learn more about our approach"
            expandedContent={
              <>
                <h4 className="font-semibold text-white mb-3">Key Mission Pillars:</h4>
                <ul className="space-y-3">
                  {[
                    { title: "Sustainable Operations", description: "Implementing cutting-edge technologies to minimize emissions and waste." },
                    { title: "Product Innovation", description: "Developing next-generation materials with improved performance and reduced environmental impact." },
                    { title: "Community Engagement", description: "Building meaningful partnerships with local communities and supporting sustainable development initiatives." }
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <div className="h-5 w-5 rounded-full bg-blue-600/30 flex items-center justify-center mt-0.5 mr-3">
                        <span className="text-xs text-blue-200">{index + 1}</span>
                      </div>
                      <p>
                        <span className="font-medium text-blue-200">{item.title}:</span> {item.description}
                      </p>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 p-4 bg-white/5 rounded-lg">
                  <p className="italic text-sm">
                    Our approach balances economic growth with environmental stewardship and social responsibility, creating lasting value for future generations.
                  </p>
                </div>
              </>
            }
            theme="blue"
          />

          {/* Vision Card */}
          <Card
            icon={<Compass className="h-6 w-6 text-teal-200" />}
            title="Our Vision"
            description="We envision a future where petrochemical innovation drives the transition to a circular economy. Our goal is to lead the industry in developing carbon-neutral processes and biodegradable alternatives while maintaining the highest standards of product quality and reliability."
            expanded={visionExpanded}
            setExpanded={setVisionExpanded}
            buttonText="Discover our future goals"
            expandedContent={
              <>
                <h4 className="font-semibold text-white mb-3">Strategic Vision 2030:</h4>
                <div className="space-y-4">
                  {[
                    { label: "Carbon Neutrality", detail: "Achieve carbon-neutral operations across all production facilities by 2030 through renewable energy integration and carbon capture technologies." },
                    { label: "Circular Products", detail: "Develop a portfolio where 75% of products are fully recyclable or biodegradable, reducing end-of-life environmental impact." },
                    { label: "Industry Leadership", detail: "Establish our organization as the global benchmark for sustainable petrochemical operations through innovation and transparency." }
                  ].map((item, index) => (
                    <div key={index}>
                      <div className="flex items-center">
                        <div className="w-16 h-1 rounded-full bg-teal-500/50 mr-3"></div>
                        <p className="font-medium text-teal-200">{item.label}</p>
                      </div>
                      <p className="ml-20 -mt-2">{item.detail}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-4 bg-white/5 rounded-lg">
                  <p className="italic text-sm">
                  not just adapting to the future; we&apos;re actively creating it by reimagining what&apos;s possible in our industry.
                  </p>
                </div>
              </>
            }
            theme="teal"
          />
        </div>
      </div>
    </section>
  );
}

// Card Component
function Card({ icon, title, description, expanded, setExpanded, buttonText, expandedContent, theme }) {
  const buttonColor = theme === "blue" ? "hover:text-white text-blue-200" : "hover:text-white text-teal-200";
  const hoverShadow = theme === "blue" ? "hover:shadow-blue-500/20" : "hover:shadow-teal-500/20";

  return (
    <div className={`bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 ${hoverShadow} hover:bg-white/10`}>
      <div className="p-8">
        <div className="flex items-center mb-6">
          <div className="p-3 bg-opacity-30 rounded-lg mr-4 bg-current" style={{ color: theme === "blue" ? "#3B82F6" : "#14B8A6" }}>
            {icon}
          </div>
          <h3 className="text-2xl font-bold">{title}</h3>
        </div>
        <p className="text-blue-100 leading-relaxed mb-6">{description}</p>
        <div className="pt-4 border-t border-white/10">
          <button
            className={`inline-flex items-center font-medium ${buttonColor}`}
            onClick={() => setExpanded(!expanded)}
          >
            {buttonText}
            {expanded ? (
              <ArrowUpCircle className="ml-2 h-4 w-4" />
            ) : (
              <ArrowDownCircle className="ml-2 h-4 w-4" />
            )}
          </button>
        </div>

        {expanded && (
          <div className="mt-6 pt-6 border-t border-white/10 text-blue-100 animate-fadeIn">
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
  theme: PropTypes.oneOf(['blue', 'teal']).isRequired,
};