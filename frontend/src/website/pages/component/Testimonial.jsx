"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Star, ChevronLeft, ChevronRight } from "lucide-react"

export default function TestimonialSection() {
  const [testimonials, setTestimonials] = useState([])
  const [activeIndex, setActiveIndex] = useState(0)
  const [activePage, setActivePage] = useState(0)
  const itemsPerPage = 3

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await axios.get("/api/testimonial/getAll")
        setTestimonials(res.data.data || [])
      } catch (err) {
        console.error("Failed to fetch testimonials:", err)
      }
    }
    fetchTestimonials()
  }, [])

  const totalPages = Math.ceil(testimonials.length / itemsPerPage)
  const hasMoreThanThree = testimonials.length > 3

  const nextTestimonial = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length)
  }

  const nextPage = () => {
    setActivePage((prevPage) => (prevPage + 1) % totalPages)
  }

  const prevPage = () => {
    setActivePage((prevPage) => (prevPage - 1 + totalPages) % totalPages)
  }

  const goToPage = (pageIndex) => {
    setActivePage(pageIndex)
  }

  const getCurrentPageTestimonials = () => {
    const startIndex = activePage * itemsPerPage
    return testimonials.slice(startIndex, startIndex + itemsPerPage)
  }

  return (
    <section className="py-16 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#2860da]/10 via-white to-[#9e5d94]/10 -z-10" />
      <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-[#e84c20]/5 -z-10" />
      <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-[#2860da]/5 -z-10" />

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold pb-4 bg-gradient-to-r from-[#e84c20] via-[#2860da] to-[#9e5d94] bg-clip-text text-transparent">
            What Our Clients Say
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our clients have to say about their experience.
          </p>
        </div>

        {/* Desktop view */}
        <div className="hidden lg:block">
          {!hasMoreThanThree ? (
            <div className="grid grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <TestimonialCard key={testimonial._id} testimonial={testimonial} />
              ))}
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-3 gap-8">
                {getCurrentPageTestimonials().map((testimonial) => (
                  <TestimonialCard key={testimonial._id} testimonial={testimonial} />
                ))}
              </div>

              {/* Pagination */}
              <div className="mt-12 flex justify-between items-center">
                <button
                  onClick={prevPage}
                  className="flex items-center gap-2 text-[#2860da] hover:text-[#e84c20] transition-colors"
                  disabled={activePage === 0}
                >
                  <ChevronLeft size={20} />
                  <span className="font-medium">Previous</span>
                </button>

                <div className="flex gap-2">
                  {Array.from({ length: totalPages }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToPage(index)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                        activePage === index
                          ? "bg-[#e84c20] text-white"
                          : "bg-white text-gray-600 border border-gray-200 hover:border-[#9e5d94]"
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={nextPage}
                  className="flex items-center gap-2 text-[#2860da] hover:text-[#e84c20] transition-colors"
                  disabled={activePage === totalPages - 1}
                >
                  <span className="font-medium">Next</span>
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Mobile/Tablet carousel view */}
        <div className="lg:hidden relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial._id} className="w-full flex-shrink-0 px-4">
                  <TestimonialCard testimonial={testimonial} />
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={prevTestimonial}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft className="text-[#2860da]" />
          </button>
          <button
            onClick={nextTestimonial}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
          >
            <ChevronRight className="text-[#2860da]" />
          </button>

          <div className="flex justify-center mt-6 gap-2 flex-wrap">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  activeIndex === index ? "bg-[#e84c20]" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function TestimonialCard({ testimonial }) {
  const avatarSrc = testimonial.photo
    ? `/api/image/download/${testimonial.photo}`
    : "/placeholder.svg"

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow duration-300 border border-gray-100 h-full flex flex-col">
      <div className="flex items-center mb-6">
        <div className="relative">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#9e5d94]">
            <img
              src={avatarSrc}
              alt={testimonial.altName || testimonial.name}
              title={testimonial.imgTitle || testimonial.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-1 -right-1 bg-[#e84c20] text-white p-1 rounded-full">
            <Star size={12} fill="white" />
          </div>
        </div>
        <div className="ml-4">
          <h3 className="font-bold text-lg">{testimonial.name}</h3>
          <p className="text-gray-600 text-sm">{testimonial.designation}</p>
          <p className="text-[#2860da] font-medium text-sm">{testimonial.company}</p>
        </div>
      </div>

      <div className="flex mb-4">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={18}
            className={i < testimonial.rating ? "text-[#e84c20] fill-[#e84c20]" : "text-gray-300"}
          />
        ))}
      </div>

      <blockquote className="flex-grow">
        <p className="text-gray-700 italic relative">
          <span className="text-[#9e5d94] text-4xl absolute -top-2 -left-2 opacity-20">"</span>
          {testimonial.message}
          <span className="text-[#9e5d94] text-4xl absolute -bottom-6 -right-2 opacity-20">"</span>
        </p>
      </blockquote>
    </div>
  )
}
