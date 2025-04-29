import React, { useState, useEffect } from 'react';
import { format, getDaysInMonth } from 'date-fns';
import { useGetInquiriesQuery } from '@/slice/inquiry/inquiry';

const InquiryLineChart = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [minInquiries, setMinInquiries] = useState(0);
  const [chartData, setChartData] = useState([]);

  const { data: inquiries, isLoading } = useGetInquiriesQuery();

  useEffect(() => {
    if (!inquiries || isLoading) return;

    const daysInMonth = getDaysInMonth(currentMonth);
    const monthlyData = Array.from({ length: daysInMonth }, () => 0);

    inquiries.forEach((inquiry) => {
      const inquiryDate = new Date(inquiry.createdAt);
      if (
        inquiryDate.getFullYear() === currentMonth.getFullYear() &&
        inquiryDate.getMonth() === currentMonth.getMonth()
      ) {
        const day = inquiryDate.getDate() - 1;
        monthlyData[day] += 1;
      }
    });

    const filteredData = monthlyData.map((val) =>
      val >= minInquiries ? val : 0
    );

    setChartData(filteredData);
  }, [inquiries, isLoading, currentMonth, minInquiries]);

  const handleMonthChange = (e) => {
    const [year, month] = e.target.value.split('-');
    setCurrentMonth(new Date(year, month - 1));
  };

  const handleMinInquiriesChange = (e) => {
    setMinInquiries(Number(e.target.value));
  };

  // SVG chart dimensions
  const width = 800;
  const height = 300;
  const padding = 40;
  const maxY = Math.max(...chartData, 5);

  const points = chartData.map((value, index) => {
    const x = (index / (chartData.length - 1 || 1)) * (width - padding * 2) + padding;
    const y = height - padding - (value / maxY) * (height - padding * 2);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="w-full mt-10 p-4">
      <h2 className="text-lg text-purple-800 mb-5 pb-1 font-semibold border-b border-purple-800">
        Monthly Inquiries
      </h2>

      <div className="mb-4 flex justify-between items-center">
        <input
          type="month"
          value={format(currentMonth, 'yyyy-MM')}
          onChange={handleMonthChange}
          className="border rounded p-2"
        />
        <div>
          <label htmlFor="minInquiries" className="mr-2">Min Inquiries:</label>
          <input
            type="number"
            id="minInquiries"
            value={minInquiries}
            onChange={handleMinInquiriesChange}
            min="0"
            className="border rounded p-2 w-20"
          />
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        {isLoading ? (
          <p>Loading inquiries...</p>
        ) : (
          <svg width={width} height={height} className="border rounded bg-white shadow">
            {/* X and Y axes */}
            <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#ccc" />
            <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#ccc" />

            {/* Data line */}
            <polyline
              fill="none"
              stroke="#ad7ee6"
              strokeWidth="2"
              points={points}
            />

            {/* Data points */}
            {chartData.map((value, index) => {
              const x = (index / (chartData.length - 1 || 1)) * (width - padding * 2) + padding;
              const y = height - padding - (value / maxY) * (height - padding * 2);
              return (
                <circle
                  key={index}
                  cx={x}
                  cy={y}
                  r={3}
                  fill="#ad7ee6"
                />
              );
            })}

            {/* Y-axis labels */}
            {[0, maxY].map((val, i) => (
              <text
                key={i}
                x={padding - 10}
                y={height - padding - (val / maxY) * (height - padding * 2) + 5}
                textAnchor="end"
                fontSize="12"
              >
                {val}
              </text>
            ))}

            {/* X-axis labels */}
            {chartData.length <= 31 &&
              chartData.map((_, index) => {
                const x = (index / (chartData.length - 1 || 1)) * (width - padding * 2) + padding;
                return (
                  <text
                    key={index}
                    x={x}
                    y={height - padding + 15}
                    textAnchor="middle"
                    fontSize="10"
                    fill="#666"
                  >
                    {index + 1}
                  </text>
                );
              })}
          </svg>
        )}
      </div>
    </div>
  );
};

export default InquiryLineChart;
