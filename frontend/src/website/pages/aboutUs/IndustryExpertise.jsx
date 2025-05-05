import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

export default function IndustryExpertise() {
  const [expertiseData, setExpertiseData] = useState([]);
  const [heading, setHeading] = useState('');
  const [subHeading, setSubHeading] = useState('');
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    const fetchExpertiseData = async () => {
      try {
        const response = await axios.get('/api/industry/getAll');
        console.log('Expertise data:', response.data);

        if (response.data.length > 0) {
          const data = response.data[0];
          setHeading(data.heading);
          setSubHeading(data.subHeading);
          setExpertiseData(data.items || []);
        }
      } catch (error) {
        console.error('Error fetching expertise data:', error);
      }
    };

    fetchExpertiseData();
  }, []);

  const colors = [
    { borderColor: 'border-blue-600', bgColor: 'bg-blue-600' },
    { borderColor: 'border-teal-600', bgColor: 'bg-teal-600' },
    { borderColor: 'border-cyan-600', bgColor: 'bg-cyan-600' },
    { borderColor: 'border-emerald-600', bgColor: 'bg-emerald-600' },
  ];

  function getBorderColor(index) {
    return colors[index % colors.length].borderColor;
  }

  function getBgColor(index) {
    return colors[index % colors.length].bgColor;
  }

  return (
    <section className="py-5 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-6 max-w-[80rem]">
        <div className="text-center mb-5">
          <h2 className="text-4xl font-bold text-[#985d97] mb-4">{heading}</h2>
          <div className="w-24 h-1 bg-[#e95821] mx-auto mb-4"></div>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">{subHeading}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {expertiseData.map((item, index) => (
            <ExpertiseCard
              key={item._id}
              item={{
                number: String(index + 1).padStart(2, '0'), // 01, 02, 03, etc.
                title: item.name.trim(),
                description: item.description,
                borderColor: getBorderColor(index),
                bgColor: getBgColor(index),
                textColor: '', // optional if you want to add
              }}
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
          <div className="flex items-center mb-5">
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

ExpertiseCard.propTypes = {
  item: PropTypes.shape({
    number: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    borderColor: PropTypes.string.isRequired,
    bgColor: PropTypes.string.isRequired,
    textColor: PropTypes.string, // optional
  }).isRequired,
  isHovered: PropTypes.bool.isRequired,
  onMouseEnter: PropTypes.func.isRequired,
  onMouseLeave: PropTypes.func.isRequired,
};
