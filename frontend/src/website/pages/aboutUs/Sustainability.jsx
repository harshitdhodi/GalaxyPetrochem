// Sustainability.jsx
import { Leaf } from "lucide-react";

export function Sustainability() {
  return (
    <section className="py-16 px-4 bg-gradient-to-r from-emerald-600 to-teal-700 text-white">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <div className="inline-block p-3 bg-white/20 rounded-lg mb-4">
              <Leaf className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-6">Our Sustainability Commitment</h2>
            <p className="text-white/90 mb-6">
              At PetroTech Industries, sustainability isn't just a goal—it's integrated into everything we do. We're
              committed to reducing our environmental footprint while developing the next generation of eco-friendly
              petrochemical solutions.
            </p>
            <div className="space-y-4">
              <SustainabilityPoint text="30% reduction in carbon emissions since 2015" />
              <SustainabilityPoint text="40% of our R&D budget dedicated to green chemistry initiatives" />
              <SustainabilityPoint text="Developing biodegradable alternatives to traditional plastics" />
              <SustainabilityPoint text="Zero-waste initiatives at all manufacturing facilities" />
            </div>
          </div>
          <div className="md:w-1/2">
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl">
              <h3 className="text-2xl font-bold mb-6">2030 Sustainability Targets</h3>
              <div className="space-y-6">
                <ProgressBar label="Carbon Neutrality" percentage={65} />
                <ProgressBar label="Renewable Energy Use" percentage={70} />
                <ProgressBar label="Water Conservation" percentage={80} />
                <ProgressBar label="Circular Products" percentage={45} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SustainabilityPoint({ text }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-6 h-6 rounded-full bg-white/30 flex items-center justify-center mt-1 flex-shrink-0">
        <span className="text-white text-sm">✓</span>
      </div>
      <p className="text-white/90">{text}</p>
    </div>
  );
}

function ProgressBar({ label, percentage }) {
  return (
    <div>
      <div className="flex justify-between mb-2">
        <span>{label}</span>
        <span>{percentage}%</span>
      </div>
      <div className="w-full bg-white/20 rounded-full h-2.5">
        <div className="bg-white h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
}
