import { Droplet, Zap, Gauge } from "lucide-react";

export function ProductShowcase() {
  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800">Our Key Products</h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            From basic petrochemicals to specialized polymers, our diverse product portfolio serves multiple
            industries.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Droplet className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Base Chemicals</h3>
            <ul className="text-gray-600 space-y-2">
              <li>• Ethylene & Propylene</li>
              <li>• Butadiene</li>
              <li>• Benzene & Toluene</li>
              <li>• Methanol</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="w-16 h-16 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
              <Zap className="h-8 w-8 text-teal-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Polymers & Plastics</h3>
            <ul className="text-gray-600 space-y-2">
              <li>• Polyethylene (HDPE, LDPE)</li>
              <li>• Polypropylene</li>
              <li>• PVC & PET</li>
              <li>• Engineering Plastics</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="w-16 h-16 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
              <Gauge className="h-8 w-8 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Specialty Chemicals</h3>
            <ul className="text-gray-600 space-y-2">
              <li>• Industrial Solvents</li>
              <li>• Performance Additives</li>
              <li>• Catalysts</li>
              <li>• Synthetic Rubber</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}