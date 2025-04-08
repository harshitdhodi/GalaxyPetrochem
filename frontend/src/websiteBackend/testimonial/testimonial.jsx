import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TestimonialForm from './TestimonialForm';
import TestimonialTable from './TestimonialTable';

const TestimonialManager = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [selected, setSelected] = useState(null);

  const fetchTestimonials = async () => {
    const res = await axios.get('/api/testimonial/getAll');
    setTestimonials(res.data.data || []);
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  return (
    <div className="p-6 ">
      <h2 className="text-2xl font-bold mb-4">Manage Testimonials</h2>
      <TestimonialForm 
        selected={selected} 
        setSelected={setSelected} 
        fetchTestimonials={fetchTestimonials} 
      />
      <TestimonialTable 
        testimonials={testimonials} 
        setSelected={setSelected} 
        fetchTestimonials={fetchTestimonials} 
      />
    </div>
  );
};

export default TestimonialManager;