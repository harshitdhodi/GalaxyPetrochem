import { Target, Compass, ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { useState } from "react";

export function MissionVision() {
  const [missionExpanded, setMissionExpanded] = useState(false);
  const [visionExpanded, setVisionExpanded] = useState(false);

  return (
    <section className="py-24 px-6 bg-gradient-to-br from-indigo-900 via-blue-800 to-teal-700 text-white">
      <div className="container mx-auto">
        <div className="max-w-5xl mx-auto">
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

          {/* Content Cards */}
          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Mission Card */}
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 hover:shadow-blue-500/20 hover:bg-white/10 h-auto">
              <div className="p-8">
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-blue-600/30 rounded-lg mr-4">
                    <Target className="h-6 w-6 text-blue-200" />
                  </div>
                  <h3 className="text-2xl font-bold">Our Mission</h3>
                </div>
                <p className="text-blue-100 leading-relaxed mb-6">
                  Our mission is to transform hydrocarbon resources into valuable products that power modern life while
                  continuously reducing our environmental footprint. We are committed to operational excellence, safety,
                  and creating sustainable value for all stakeholders.
                </p>
                <div className="pt-4 border-t border-white/10">
                  <button 
                    className="inline-flex items-center text-blue-200 font-medium hover:text-white"
                    onClick={() => setMissionExpanded(!missionExpanded)}
                  >
                    Learn more about our approach
                    {missionExpanded ? (
                      <ArrowUpCircle className="ml-2 h-4 w-4" />
                    ) : (
                      <ArrowDownCircle className="ml-2 h-4 w-4" />
                    )}
                  </button>
                </div>
                
                {/* Expandable Content */}
                {missionExpanded && (
                  <div className="mt-6 pt-6 border-t border-white/10 text-blue-100 animate-fadeIn">
                    <h4 className="font-semibold text-white mb-3">Key Mission Pillars:</h4>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <div className="h-5 w-5 rounded-full bg-blue-600/30 flex items-center justify-center mt-0.5 mr-3">
                          <span className="text-xs text-blue-200">1</span>
                        </div>
                        <p><span className="font-medium text-blue-200">Sustainable Operations:</span> Implementing cutting-edge technologies to minimize emissions and waste.</p>
                      </li>
                      <li className="flex items-start">
                        <div className="h-5 w-5 rounded-full bg-blue-600/30 flex items-center justify-center mt-0.5 mr-3">
                          <span className="text-xs text-blue-200">2</span>
                        </div>
                        <p><span className="font-medium text-blue-200">Product Innovation:</span> Developing next-generation materials with improved performance and reduced environmental impact.</p>
                      </li>
                      <li className="flex items-start">
                        <div className="h-5 w-5 rounded-full bg-blue-600/30 flex items-center justify-center mt-0.5 mr-3">
                          <span className="text-xs text-blue-200">3</span>
                        </div>
                        <p><span className="font-medium text-blue-200">Community Engagement:</span> Building meaningful partnerships with local communities and supporting sustainable development initiatives.</p>
                      </li>
                    </ul>
                    <div className="mt-4 p-4 bg-white/5 rounded-lg">
                      <p className="italic text-sm">"Our approach balances economic growth with environmental stewardship and social responsibility, creating lasting value for future generations."</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Vision Card */}
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 hover:shadow-teal-500/20 hover:bg-white/10 h-auto">
              <div className="p-8">
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-teal-600/30 rounded-lg mr-4">
                    <Compass className="h-6 w-6 text-teal-200" />
                  </div>
                  <h3 className="text-2xl font-bold">Our Vision</h3>
                </div>
                <p className="text-blue-100 leading-relaxed mb-6">
                  We envision a future where petrochemical innovation drives the transition to a circular economy. Our
                  goal is to lead the industry in developing carbon-neutral processes and biodegradable alternatives while
                  maintaining the highest standards of product quality and reliability.
                </p>
                <div className="pt-4 border-t border-white/10">
                  <button 
                    className="inline-flex items-center text-teal-200 font-medium hover:text-white"
                    onClick={() => setVisionExpanded(!visionExpanded)}
                  >
                    Discover our future goals
                    {visionExpanded ? (
                      <ArrowUpCircle className="ml-2 h-4 w-4" />
                    ) : (
                      <ArrowDownCircle className="ml-2 h-4 w-4" />
                    )}
                  </button>
                </div>
                
                {/* Expandable Content */}
                {visionExpanded && (
                  <div className="mt-6 pt-6 border-t border-white/10 text-blue-100 animate-fadeIn">
                    <h4 className="font-semibold text-white mb-3">Strategic Vision 2030:</h4>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <div className="w-16 h-1 rounded-full bg-teal-500/50 mr-3"></div>
                        <p className="font-medium text-teal-200">Carbon Neutrality</p>
                      </div>
                      <p className="ml-20 -mt-2">Achieve carbon-neutral operations across all production facilities by 2030 through renewable energy integration and carbon capture technologies.</p>
                      
                      <div className="flex items-center">
                        <div className="w-16 h-1 rounded-full bg-teal-500/50 mr-3"></div>
                        <p className="font-medium text-teal-200">Circular Products</p>
                      </div>
                      <p className="ml-20 -mt-2">Develop a portfolio where 75% of products are fully recyclable or biodegradable, reducing end-of-life environmental impact.</p>
                      
                      <div className="flex items-center">
                        <div className="w-16 h-1 rounded-full bg-teal-500/50 mr-3"></div>
                        <p className="font-medium text-teal-200">Industry Leadership</p>
                      </div>
                      <p className="ml-20 -mt-2">Establish our organization as the global benchmark for sustainable petrochemical operations through innovation and transparency.</p>
                    </div>
                    <div className="mt-4 p-4 bg-white/5 rounded-lg">
                      <p className="italic text-sm">"We're not just adapting to the future; we're actively creating it by reimagining what's possible in our industry."</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}