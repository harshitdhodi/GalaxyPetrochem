import React, { useState } from 'react';
import axios from 'axios';

const TestimonialTable = ({ testimonials, setSelected, fetchTestimonials }) => {
  const [expandedMessageId, setExpandedMessageId] = useState(null);

  const handleDelete = async (id) => {
    await axios.delete(`/api/testimonial/delete/${id}`);
    fetchTestimonials();
  };

  const toggleMessage = (id) => {
    setExpandedMessageId(expandedMessageId === id ? null : id);
  };

  const renderMessage = (item) => {
    const isExpanded = expandedMessageId === item._id;
    const shortMessage = item.message.length > 50 ? item.message.slice(0, 50) + '...' : item.message;

    return (
      <div>
        <p className="text-sm text-gray-700">
          {isExpanded ? item.message : shortMessage}
        </p>
        {item.message.length > 50 && (
          <button
            onClick={() => toggleMessage(item._id)}
            className="text-blue-500 text-xs mt-1 hover:underline"
          >
            {isExpanded ? 'Show less' : 'Read more'}
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="overflow-x-auto mt-6">
      <table className="min-w-full border text-sm text-left">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="p-2 border">Photo</th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Designation</th>
            <th className="p-2 border">Company</th>
            <th className="p-2 border">Rating</th>
            <th className="p-2 border">Message</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {testimonials.map((item) => (
            <tr key={item._id} className="border-t hover:bg-gray-50">
              <td className="p-2 text-center">
                <img
                  src={`/api/image/download/${item.photo}`}
                  alt={item.altName}
                  title={item.imgTitle}
                  className="w-12 h-12 object-cover rounded-full mx-auto"
                />
              </td>
              <td className="p-2">{item.name}</td>
              <td className="p-2">{item.designation}</td>
              <td className="p-2">{item.company}</td>
              <td className="p-2">{item.rating}</td>
              <td className="p-2">{renderMessage(item)}</td>
              <td className="p-2 space-x-2">
                <button
                  onClick={() => setSelected(item)}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TestimonialTable;
