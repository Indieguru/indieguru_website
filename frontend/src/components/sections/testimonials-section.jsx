"use client"

import { useState, useRef, useEffect } from "react"
import { Star, SmilePlus, Smile, Frown } from "lucide-react"
import axiosInstance from "../../config/axios.config"

const TestimonialsSection = () => {
  const [isFirstRowHovered, setIsFirstRowHovered] = useState(false)
  const [isSecondRowHovered, setIsSecondRowHovered] = useState(false)
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)

  const firstRowRef = useRef(null)
  const secondRowRef = useRef(null)

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const { data } = await axiosInstance.get('/course/testimonials')
        if (data.success) {
          setTestimonials(data.testimonials)
        }
      } catch (error) {
        console.error('Error fetching testimonials:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTestimonials()
  }, [])

  // Duplicate testimonials for infinite scrolling effect
  const firstRowTestimonials = [...testimonials, ...testimonials]
  const secondRowTestimonials = [...testimonials.reverse(), ...testimonials.reverse()]

  // Render star ratings
  const renderStars = (rating) => {
    return Array(5)
      .fill(0)
      .map((_, index) => (
        <Star
          key={index}
          className={`w-5 h-5 ${index < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
        />
      ))
  }

  // Emoji mapping based on rating
  const getEmoji = (rating) => {
    if (rating >= 4) return "smile-plus"
    if (rating >= 3) return "smile"
    return "frown"
  }

  // Render emoji
  const renderEmoji = (type) => {
    switch (type) {
      case "smile-plus":
        return <SmilePlus className="w-6 h-6 text-green-500" />
      case "smile":
        return <Smile className="w-6 h-6 text-blue-500" />
      case "frown":
        return <Frown className="w-6 h-6 text-gray-400" />
      default:
        return null
    }
  }

  useEffect(() => {
    if (!firstRowRef.current || !secondRowRef.current || loading) return
    
    let firstRowAnimation;
    let secondRowAnimation;
    const firstRow = firstRowRef.current;
    const secondRow = secondRowRef.current;

    const animateFirstRow = () => {
      if (!firstRow || isFirstRowHovered) return;

      let position = firstRow.scrollLeft;
      const speed = 0.5;

      const step = () => {
        if (isFirstRowHovered) return;
        position += speed;
        if (position >= firstRow.scrollWidth / 2) {
          position = 0;
        }
        firstRow.scrollLeft = position;
        firstRowAnimation = requestAnimationFrame(step);
      };

      step();
    };

    const animateSecondRow = () => {
      if (!secondRow || isSecondRowHovered) return;

      let position = secondRow.scrollLeft || secondRow.scrollWidth / 2;
      const speed = 0.5;

      const step = () => {
        if (isSecondRowHovered) return;
        position -= speed;
        if (position <= 0) {
          position = secondRow.scrollWidth / 2;
        }
        secondRow.scrollLeft = position;
        secondRowAnimation = requestAnimationFrame(step);
      };

      step();
    };

    // Start both animations
    animateFirstRow();
    animateSecondRow();

    // Cleanup animations on unmount
    return () => {
      if (firstRowAnimation) cancelAnimationFrame(firstRowAnimation);
      if (secondRowAnimation) cancelAnimationFrame(secondRowAnimation);
    };
  }, [isFirstRowHovered, isSecondRowHovered, loading]);

  if (loading) {
    return (
      <section className="py-16 relative overflow-hidden">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-[#003265] mb-2">Testimonials</h2>
          <div className="w-48 h-1 bg-blue-800 mx-auto"></div>
          <div className="mt-12">Loading testimonials...</div>
        </div>
      </section>
    )
  }

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section className="py-16 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-[#003265] mb-2">Indie Tales</h2>
          <div className="w-48 h-1 bg-blue-800 mx-auto"></div>
        </div>
  
        <div className="relative bg-[#dfefff] rounded-2xl p-6 md:p-10 overflow-hidden">
          {/* ⬅️ Fade Left */}
          <div className="pointer-events-none absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-[#dfefff] via-[#dfefff]/80 to-transparent z-20" />

          {/* ➡️ Fade Right */}
          <div className="pointer-events-none absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-[#dfefff] via-[#dfefff]/80 to-transparent z-20" />
    
          {/* First row - left to right */}
          <div className="relative mb-8">
            <div
              ref={firstRowRef}
              className="flex overflow-x-hidden gap-4 pb-4"
              onMouseEnter={() => setIsFirstRowHovered(true)}
              onMouseLeave={() => setIsFirstRowHovered(false)}
              style={{ scrollBehavior: 'auto' }}
            >
              {firstRowTestimonials.map((testimonial, index) => (
                <div
                  key={`row1-${index}`}
                  className="min-w-[280px] md:min-w-[320px] bg-white rounded-lg p-4 shadow-md flex flex-col"
                >
                  <div className="mb-4">
                    <p className="font-medium text-lg text-[#003265]">{testimonial.heading}</p>
                    <p className="text-sm text-gray-400">by {testimonial.author}</p>
                  </div>
                  <div className="mb-2">
                    <p className="text-gray-600 text-sm flex-grow italic">{testimonial.content}</p>
                  </div>
                  <div className="mt-auto pt-4 flex justify-between items-end border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <div className="flex">{renderStars(testimonial.rating)}</div>
                      <span className="text-sm text-gray-400">• {testimonial.type}</span>
                    </div>
                    <div className="ml-2">{renderEmoji(getEmoji(testimonial.rating))}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
  
          {/* Second row - right to left */}
          <div className="relative">
            <div
              ref={secondRowRef}
              className="flex overflow-x-hidden gap-4"
              onMouseEnter={() => setIsSecondRowHovered(true)}
              onMouseLeave={() => setIsSecondRowHovered(false)}
              style={{ scrollBehavior: 'auto' }}
            >
              {secondRowTestimonials.map((testimonial, index) => (
                <div
                  key={`row2-${index}`}
                  className="min-w-[280px] md:min-w-[320px] bg-white rounded-lg p-4 shadow-md flex flex-col"
                >
                  <div className="mb-4">
                    <p className="font-medium text-lg text-[#003265]">{testimonial.heading}</p>
                    <p className="text-sm text-gray-400">by {testimonial.author}</p>
                  </div>
                  <div className="mb-2">
                    <p className="text-gray-600 text-sm flex-grow italic">{testimonial.content}</p>
                  </div>
                  <div className="mt-auto pt-4 flex justify-between items-end border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <div className="flex">{renderStars(testimonial.rating)}</div>
                      <span className="text-sm text-gray-400">• {testimonial.type}</span>
                    </div>
                    <div className="ml-2">{renderEmoji(getEmoji(testimonial.rating))}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TestimonialsSection