import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { format, getDaysInMonth } from 'date-fns';
import { useGetInquiriesQuery } from '@/slice/inquiry/inquiry';

const InquiryLineChart = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [minInquiries, setMinInquiries] = useState(0);

  const { data: inquiries, isLoading } = useGetInquiriesQuery();

  useEffect(() => {
    if (!chartRef.current) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    const daysInMonth = getDaysInMonth(currentMonth);

    // Initialize monthly data
    const monthlyData = Array.from({ length: daysInMonth }, () => 0);

    if (inquiries && !isLoading) {
      inquiries.forEach((inquiry) => {
        const inquiryDate = new Date(inquiry.createdAt);
        if (
          inquiryDate.getFullYear() === currentMonth.getFullYear() &&
          inquiryDate.getMonth() === currentMonth.getMonth()
        ) {
          const day = inquiryDate.getDate() - 1; // Adjust index
          monthlyData[day] += 1;
        }
      });
    }

    // Apply minimum inquiries filter
    const filteredData = monthlyData.map((value) =>
      value >= minInquiries ? value : null
    );

    // Create the chart
    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: Array.from({ length: daysInMonth }, (_, i) => i + 1),
        datasets: [
          {
            label: 'Number of Inquiries',
            data: filteredData,
            borderColor: 'rgb(173, 126, 230)',
            tension: 0.1,
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: `Inquiries for ${format(currentMonth, 'MMMM yyyy')}`,
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Day of the Month',
            },
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Number of Inquiries',
            },
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [currentMonth, minInquiries, inquiries, isLoading]);

  const handleMonthChange = (event) => {
    const [year, month] = event.target.value.split('-');
    setCurrentMonth(new Date(year, month - 1));
  };

  const handleMinInquiriesChange = (event) => {
    setMinInquiries(parseInt(event.target.value, 10));
  };

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
          <label htmlFor="minInquiries" className="mr-2">
            Min Inquiries:
          </label>
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
      <div className="w-full" style={{ height: '60vh' }}>
        {isLoading ? (
          <p>Loading inquiries...</p>
        ) : (
          <canvas ref={chartRef}></canvas>
        )}
      </div>
    </div>
  );
};

export default InquiryLineChart;
