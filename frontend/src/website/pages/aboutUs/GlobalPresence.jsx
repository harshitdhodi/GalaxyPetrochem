// GlobalPresence.jsx
export function GlobalPresence() {
    return (
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800">Global Presence</h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              With manufacturing facilities and offices across the globe, we serve customers in over 80 countries.
            </p>
          </div>
  
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <StatCard number="12" label="Production Plants" color="blue" />
            <StatCard number="8" label="R&D Centers" color="teal" />
            <StatCard number="25" label="Sales Offices" color="emerald" />
            <StatCard number="80+" label="Countries Served" color="cyan" />
          </div>
  
          <div className="mt-12 p-8 bg-gray-50 rounded-xl">
            <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">Our Major Manufacturing Hubs</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <LocationItem number="1" location="Houston, USA" description="Integrated refining and petrochemical complex" />
              <LocationItem number="2" location="Rotterdam, Netherlands" description="European production and distribution center" />
              <LocationItem number="3" location="Singapore" description="Asia-Pacific manufacturing hub" />
              <LocationItem number="4" location="Jubail, Saudi Arabia" description="Middle East production facility" />
              <LocationItem number="5" location="Shanghai, China" description="Specialty chemicals production" />
              <LocationItem number="6" location="São Paulo, Brazil" description="South American operations center" />
            </div>
          </div>
        </div>
      </section>
    );
  }
  
  function StatCard({ number, label, color }) {
    return (
      <div className="bg-gray-50 p-6 rounded-lg text-center">
        <h3 className={`text-2xl font-bold text-${color}-700 mb-2`}>{number}</h3>
        <p className="text-gray-700 font-medium">{label}</p>
      </div>
    );
  }
  
  function LocationItem({ number, location, description }) {
    return (
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
          <span className="text-blue-700 font-bold">{number}</span>
        </div>
        <div>
          <h4 className="font-bold text-gray-800">{location}</h4>
          <p className="text-gray-600 text-sm">{description}</p>
        </div>
      </div>
    );
  }
  