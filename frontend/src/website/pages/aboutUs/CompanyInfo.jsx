// CompanyInfo.jsx
import { Factory, Fuel, Atom, Leaf, FlaskRoundIcon as Flask } from "lucide-react";

export function CompanyInfo() {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <div className="bg-gradient-to-br from-blue-100 to-teal-100 p-1 rounded-lg">
              <div className="bg-white rounded-lg p-8 shadow-lg border border-gray-100">
                <div className="inline-block p-3 bg-blue-100 rounded-lg mb-4">
                  <Factory className="h-8 w-8 text-blue-700" />
                </div>
                <h2 className="text-3xl font-bold mb-4 text-gray-800">Company Information</h2>
                <p className="text-gray-600 mb-4">
                  Established in 1985, PetroTech Industries has evolved into a global leader in petrochemical
                  manufacturing and innovation. With state-of-the-art refineries and production facilities across
                  three continents, we deliver high-quality petrochemical products to industries worldwide.
                </p>
                <p className="text-gray-600">
                  Our integrated approach to petrochemical processing allows us to maximize efficiency while
                  minimizing environmental impact. From crude oil processing to specialized polymer production, our
                  comprehensive capabilities position us as a trusted partner in the global supply chain.
                </p>
              </div>
            </div>
          </div>
          <div className="md:w-1/2 grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-6 rounded-lg">
              <Fuel className="h-8 w-8 text-blue-600 mb-2" />
              <h3 className="font-bold text-lg text-gray-800 mb-1">4.5M Barrels</h3>
              <p className="text-gray-600 text-sm">Daily processing capacity</p>
            </div>
            <div className="bg-teal-50 p-6 rounded-lg">
              <Atom className="h-8 w-8 text-teal-600 mb-2" />
              <h3 className="font-bold text-lg text-gray-800 mb-1">200+ Products</h3>
              <p className="text-gray-600 text-sm">Specialized chemicals</p>
            </div>
            <div className="bg-emerald-50 p-6 rounded-lg">
              <Leaf className="h-8 w-8 text-emerald-600 mb-2" />
              <h3 className="font-bold text-lg text-gray-800 mb-1">30% Reduction</h3>
              <p className="text-gray-600 text-sm">In carbon emissions</p>
            </div>
            <div className="bg-cyan-50 p-6 rounded-lg">
              <Flask className="h-8 w-8 text-cyan-600 mb-2" />
              <h3 className="font-bold text-lg text-gray-800 mb-1">R&D Excellence</h3>
              <p className="text-gray-600 text-sm">Industry-leading research</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}