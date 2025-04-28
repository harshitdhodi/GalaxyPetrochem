import { useState } from 'react';
import PropTypes from 'prop-types';

export default function IndustryExpertise() {
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-6 max-w-[80rem]">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Industry Expertise</h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-8"></div>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
            With decades of experience in petrochemical processing, our expertise spans the entire value chain,
            delivering innovative solutions for the most complex challenges.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {expertiseData.map((item, index) => (
            <ExpertiseCard
              key={index}
              item={item}
              isHovered={hoveredCard === index}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ExpertiseCard({ item, isHovered, onMouseEnter, onMouseLeave }) {
  return (
    <div
      className={`rounded-xl shadow-lg transition-all duration-300 overflow-hidden ${
        isHovered ? 'transform -translate-y-2' : ''
      }`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className={`h-full flex flex-col bg-white border-t-4 ${item.borderColor}`}>
        <div className="p-8 flex-grow">
          <div className="flex items-center mb-6">
            <div
              className={`h-12 w-12 ${item.bgColor} text-white rounded-lg flex items-center justify-center mr-4 shadow-md`}
            >
              <span className="text-xl font-bold">{item.number}</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">{item.title}</h3>
          </div>
          <p className="text-gray-600 leading-relaxed">{item.description}</p>
        </div>
      </div>
    </div>
  );
}

// Define PropTypes for ExpertiseCard
ExpertiseCard.propTypes = {
  item: PropTypes.shape({
    number: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    borderColor: PropTypes.string.isRequired,
    bgColor: PropTypes.string.isRequired,
    textColor: PropTypes.string.isRequired,
  }).isRequired,
  isHovered: PropTypes.bool.isRequired,
  onMouseEnter: PropTypes.func.isRequired,
  onMouseLeave: PropTypes.func.isRequired,
};

const expertiseData = [
  {
    number: '01',
    title: 'Refining Technology',
    description:
      'Advanced catalytic cracking and hydroprocessing technologies that maximize yield and product quality while reducing energy consumption and environmental impact.',
    borderColor: 'border-blue-600',
    bgColor: 'bg-blue-600',
    textColor: 'text-blue-600',
  },
  {
    number: '02',
    title: 'Polymer Engineering',
    description:
      'Cutting-edge polymerization processes and catalyst systems that enable the production of high-performance plastics with enhanced properties for demanding applications.',
    borderColor: 'border-teal-600',
    bgColor: 'bg-teal-600',
    textColor: 'text-teal-600',
  },
  {
    number: '03',
    title: 'Process Optimization',
    description:
      'Digital twin technology and advanced analytics to optimize plant operations, reduce downtime, and enhance overall efficiency throughout the production lifecycle.',
    borderColor: 'border-cyan-600',
    bgColor: 'bg-cyan-600',
    textColor: 'text-cyan-600',
  },
  {
    number: '04',
    title: 'Sustainable Chemistry',
    description:
      'Development of bio-based feedstocks, carbon capture technologies, and circular economy solutions to reduce environmental impact and advance sustainability goals.',
    borderColor: 'border-emerald-600',
    bgColor: 'bg-emerald-600',
    textColor: 'text-emerald-600',
  },
  {
    number: '05',
    title: 'Safety & Compliance',
    description:
      'Industry-leading safety protocols, environmental management systems, and regulatory compliance expertise across global operations to protect personnel and communities.',
    borderColor: 'border-blue-600',
    bgColor: 'bg-blue-600',
    textColor: 'text-blue-600',
  },
  {
    number: '06',
    title: 'Supply Chain Integration',
    description:
      'End-to-end supply chain solutions from feedstock procurement to finished product delivery, optimized for reliability, resilience and cost-effectiveness.',
    borderColor: 'border-teal-600',
    bgColor: 'bg-teal-600',
    textColor: 'text-teal-600',
  },
];