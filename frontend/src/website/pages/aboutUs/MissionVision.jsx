// MissionVision.jsx
import { Target } from "lucide-react";

export function MissionVision() {
  return (
    <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-teal-600 text-white">
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-block p-3 bg-white/20 rounded-full mb-6">
            <Target className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-8">Our Mission & Vision</h2>

          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl mb-8">
            <h3 className="text-2xl font-bold mb-4">Mission</h3>
            <p className="text-white/90 mb-4">
              Our mission is to transform hydrocarbon resources into valuable products that power modern life while
              continuously reducing our environmental footprint. We are committed to operational excellence, safety,
              and creating sustainable value for all stakeholders.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl">
            <h3 className="text-2xl font-bold mb-4">Vision</h3>
            <p className="text-white/90 mb-4">
              We envision a future where petrochemical innovation drives the transition to a circular economy. Our
              goal is to lead the industry in developing carbon-neutral processes and biodegradable alternatives while
              maintaining the highest standards of product quality and reliability.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}