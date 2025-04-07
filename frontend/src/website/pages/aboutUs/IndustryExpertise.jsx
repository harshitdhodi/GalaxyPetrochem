// IndustryExpertise.jsx
export function IndustryExpertise() {
    return (
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800">Industry Expertise</h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              With decades of experience in petrochemical processing, our expertise spans the entire value chain.
            </p>
          </div>
  
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ExpertiseCard 
              number="01" 
              title="Refining Technology" 
              description="Advanced catalytic cracking and hydroprocessing technologies that maximize yield and product quality while reducing energy consumption."
              gradientFrom="blue-50"
              gradientTo="blue-100"
              borderColor="blue-200"
              bgColor="blue-600"
            />
            
            <ExpertiseCard 
              number="02" 
              title="Polymer Engineering" 
              description="Cutting-edge polymerization processes and catalyst systems that enable the production of high-performance plastics with enhanced properties."
              gradientFrom="teal-50"
              gradientTo="teal-100"
              borderColor="teal-200"
              bgColor="teal-600"
            />
            
            <ExpertiseCard 
              number="03" 
              title="Process Optimization" 
              description="Digital twin technology and advanced analytics to optimize plant operations, reduce downtime, and enhance overall efficiency."
              gradientFrom="cyan-50"
              gradientTo="cyan-100"
              borderColor="cyan-200"
              bgColor="cyan-600"
            />
            
            <ExpertiseCard 
              number="04" 
              title="Sustainable Chemistry" 
              description="Development of bio-based feedstocks, carbon capture technologies, and circular economy solutions to reduce environmental impact."
              gradientFrom="emerald-50"
              gradientTo="emerald-100"
              borderColor="emerald-200"
              bgColor="emerald-600"
            />
            
            <ExpertiseCard 
              number="05" 
              title="Safety & Compliance" 
              description="Industry-leading safety protocols, environmental management systems, and regulatory compliance expertise across global operations."
              gradientFrom="blue-50"
              gradientTo="blue-100"
              borderColor="blue-200"
              bgColor="blue-600"
            />
            
            <ExpertiseCard 
              number="06" 
              title="Supply Chain Integration" 
              description="End-to-end supply chain solutions from feedstock procurement to finished product delivery, optimized for reliability and cost-effectiveness."
              gradientFrom="teal-50"
              gradientTo="teal-100"
              borderColor="teal-200"
              bgColor="teal-600"
            />
          </div>
        </div>
      </section>
    );
  }
  // ExpertiseCard component for Industry Expertise
function ExpertiseCard({ number, title, description, gradientFrom, gradientTo, borderColor, bgColor }) {
  return (
    <div className={`bg-gradient-to-br from-${gradientFrom} to-${gradientTo} p-8 rounded-xl shadow-sm border border-${borderColor}`}>
      <div className={`h-12 w-12 bg-${bgColor} text-white rounded-lg flex items-center justify-center mb-4`}>
        <span className="text-xl font-bold">{number}</span>
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
