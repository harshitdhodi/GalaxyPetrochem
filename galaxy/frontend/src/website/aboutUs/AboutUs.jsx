import { Factory, Target, FlaskRoundIcon as Flask, Droplet, Leaf, Gauge, Atom, Zap, Fuel } from "lucide-react"
import { Banner } from "../contactUs/components/Banner"
import banner from "../.././assets/petrochemical.webp"
import { useEffect, useState } from "react";
export default function PetrochemicalAboutUs() {
    const path = location.pathname.replace(/^\//, '') || 'introduction'; 
     const [banners, setBanners] = useState([]);
    useEffect(() => {
      const fetchBanner = async () => {
        try {
          const response = await axios.get(`/api/banner/getByPageSlug?pageSlug=${path}`);
       
          setBanners(response.data || []);
        } catch (error) {
          console.error('Failed to fetch banner:', error);
        } finally {
          setIsBannerLoading(false);
        }
      };
  
      fetchBanner();
    }, [path]);
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      {banners && banners.length > 0 ? (
        <Banner imageUrl={`/api/image/download/${banners[0].image}`} />
      ) : (
        <Banner imageUrl={banner} />
      )}

      {/* Company Information */}
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

      {/* Mission and Vision */}
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

      {/* Product Showcase */}
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

      {/* Industry Expertise */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800">Industry Expertise</h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              With decades of experience in petrochemical processing, our expertise spans the entire value chain.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl shadow-sm border border-blue-200">
              <div className="h-12 w-12 bg-blue-600 text-white rounded-lg flex items-center justify-center mb-4">
                <span className="text-xl font-bold">01</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Refining Technology</h3>
              <p className="text-gray-600">
                Advanced catalytic cracking and hydroprocessing technologies that maximize yield and product quality
                while reducing energy consumption.
              </p>
            </div>

            <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-8 rounded-xl shadow-sm border border-teal-200">
              <div className="h-12 w-12 bg-teal-600 text-white rounded-lg flex items-center justify-center mb-4">
                <span className="text-xl font-bold">02</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Polymer Engineering</h3>
              <p className="text-gray-600">
                Cutting-edge polymerization processes and catalyst systems that enable the production of
                high-performance plastics with enhanced properties.
              </p>
            </div>

            <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 p-8 rounded-xl shadow-sm border border-cyan-200">
              <div className="h-12 w-12 bg-cyan-600 text-white rounded-lg flex items-center justify-center mb-4">
                <span className="text-xl font-bold">03</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Process Optimization</h3>
              <p className="text-gray-600">
                Digital twin technology and advanced analytics to optimize plant operations, reduce downtime, and
                enhance overall efficiency.
              </p>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-8 rounded-xl shadow-sm border border-emerald-200">
              <div className="h-12 w-12 bg-emerald-600 text-white rounded-lg flex items-center justify-center mb-4">
                <span className="text-xl font-bold">04</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Sustainable Chemistry</h3>
              <p className="text-gray-600">
                Development of bio-based feedstocks, carbon capture technologies, and circular economy solutions to
                reduce environmental impact.
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl shadow-sm border border-blue-200">
              <div className="h-12 w-12 bg-blue-600 text-white rounded-lg flex items-center justify-center mb-4">
                <span className="text-xl font-bold">05</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Safety & Compliance</h3>
              <p className="text-gray-600">
                Industry-leading safety protocols, environmental management systems, and regulatory compliance expertise
                across global operations.
              </p>
            </div>

            <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-8 rounded-xl shadow-sm border border-teal-200">
              <div className="h-12 w-12 bg-teal-600 text-white rounded-lg flex items-center justify-center mb-4">
                <span className="text-xl font-bold">06</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Supply Chain Integration</h3>
              <p className="text-gray-600">
                End-to-end supply chain solutions from feedstock procurement to finished product delivery, optimized for
                reliability and cost-effectiveness.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sustainability Section */}
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
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/30 flex items-center justify-center mt-1 flex-shrink-0">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <p className="text-white/90">30% reduction in carbon emissions since 2015</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/30 flex items-center justify-center mt-1 flex-shrink-0">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <p className="text-white/90">40% of our R&D budget dedicated to green chemistry initiatives</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/30 flex items-center justify-center mt-1 flex-shrink-0">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <p className="text-white/90">Developing biodegradable alternatives to traditional plastics</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/30 flex items-center justify-center mt-1 flex-shrink-0">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <p className="text-white/90">Zero-waste initiatives at all manufacturing facilities</p>
                </div>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl">
                <h3 className="text-2xl font-bold mb-6">2030 Sustainability Targets</h3>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Carbon Neutrality</span>
                      <span>65%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2.5">
                      <div className="bg-white h-2.5 rounded-full" style={{ width: "65%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Renewable Energy Use</span>
                      <span>70%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2.5">
                      <div className="bg-white h-2.5 rounded-full" style={{ width: "70%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Water Conservation</span>
                      <span>80%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2.5">
                      <div className="bg-white h-2.5 rounded-full" style={{ width: "80%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Circular Products</span>
                      <span>45%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2.5">
                      <div className="bg-white h-2.5 rounded-full" style={{ width: "45%" }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Global Presence */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800">Global Presence</h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              With manufacturing facilities and offices across the globe, we serve customers in over 80 countries.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <h3 className="text-2xl font-bold text-blue-700 mb-2">12</h3>
              <p className="text-gray-700 font-medium">Production Plants</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <h3 className="text-2xl font-bold text-teal-700 mb-2">8</h3>
              <p className="text-gray-700 font-medium">R&D Centers</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <h3 className="text-2xl font-bold text-emerald-700 mb-2">25</h3>
              <p className="text-gray-700 font-medium">Sales Offices</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <h3 className="text-2xl font-bold text-cyan-700 mb-2">80+</h3>
              <p className="text-gray-700 font-medium">Countries Served</p>
            </div>
          </div>

          <div className="mt-12 p-8 bg-gray-50 rounded-xl">
            <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">Our Major Manufacturing Hubs</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-700 font-bold">1</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">Houston, USA</h4>
                  <p className="text-gray-600 text-sm">Integrated refining and petrochemical complex</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-700 font-bold">2</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">Rotterdam, Netherlands</h4>
                  <p className="text-gray-600 text-sm">European production and distribution center</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-700 font-bold">3</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">Singapore</h4>
                  <p className="text-gray-600 text-sm">Asia-Pacific manufacturing hub</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-700 font-bold">4</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">Jubail, Saudi Arabia</h4>
                  <p className="text-gray-600 text-sm">Middle East production facility</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-700 font-bold">5</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">Shanghai, China</h4>
                  <p className="text-gray-600 text-sm">Specialty chemicals production</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-700 font-bold">6</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">São Paulo, Brazil</h4>
                  <p className="text-gray-600 text-sm">South American operations center</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Partner with PetroTech Industries</h2>
          <p className="mb-6 text-gray-300 max-w-xl mx-auto">
            Discover how our petrochemical expertise can support your business needs and sustainability goals.
          </p>
          <button className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-8 rounded-lg transition-colors">
            Contact Our Team
          </button>
          <div className="mt-12 text-sm text-gray-400">
            © {new Date().getFullYear()} PetroTech Industries. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

