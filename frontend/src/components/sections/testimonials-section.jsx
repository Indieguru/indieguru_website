"use client"

import { useState, useRef, useEffect } from "react"
import { Star, SmilePlus, Smile, Frown } from "lucide-react"

const TestimonialsSection = () => {
  const [isFirstRowHovered, setIsFirstRowHovered] = useState(false)
  const [isSecondRowHovered, setIsSecondRowHovered] = useState(false)

  const firstRowRef = useRef(null)
  const secondRowRef = useRef(null)

  // Sample testimonial data
  const testimonials = [
    {
      id: 1,
      title: "Direct yet Friendly Tone",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices",
      rating: 5,
      author: "Kavya Sharma",
      role: "happy customer",
      emoji: "smile-plus",
    },
    {
      id: 2,
      title: "Direct yet Friendly Tone",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices",
      rating: 3,
      author: "Kavya Sharma",
      role: "happy customer",
      emoji: "smile",
    },
    {
      id: 3,
      title: "Direct yet Friendly Tone",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices",
      rating: 4,
      author: "Kavya Sharma",
      role: "happy customer",
    },
    {
      id: 4,
      title: "Direct yet Friendly Tone",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices",
      rating: 1,
      author: "Kavya Sharma",
      role: "happy customer",
      emoji: "frown",
    },
    {
      id: 5,
      title: "Direct yet Friendly Tone",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices",
      rating: 5,
      author: "Kavya Sharma",
      role: "happy customer",
    },
    {
      id: 6,
      title: "Direct yet Friendly Tone",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices",
      rating: 2,
      author: "Kavya Sharma",
      role: "happy customer",
      emoji: "frown",
    },
    {
      id: 7,
      title: "Direct yet Friendly Tone",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices",
      rating: 5,
      author: "Kavya Sharma",
      role: "happy customer",
      emoji: "smile",
    },
    {
      id: 8,
      title: "Direct yet Friendly Tone",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices",
      rating: 4,
      author: "Kavya Sharma",
      role: "happy customer",
    },
  ]

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

  // Render emoji
  const renderEmoji = (type) => {
    switch (type) {
      case "smile-plus":
        return <SmilePlus className="w-12 h-12 text-blue-500" />
      case "smile":
        return <Smile className="w-12 h-12 text-blue-500" />
      case "frown":
        return <Frown className="w-12 h-12 text-blue-500" />
      default:
        return null
    }
  }

  // Animation for infinite scrolling
  useEffect(() => {
    const firstRow = firstRowRef.current
    const secondRow = secondRowRef.current
  
    let firstRowAnimation
    let secondRowAnimation
  
    const animateFirstRow = () => {
      if (!firstRow || isFirstRowHovered) return
  
      let position = firstRow.scrollLeft
      const speed = 0.5
  
      const step = () => {
        if (isFirstRowHovered) return
        position += speed
        if (position >= firstRow.scrollWidth / 2) {
          position = 0
        }
        firstRow.scrollLeft = position
        firstRowAnimation = requestAnimationFrame(step)
      }
  
      step()
    }
  
    const animateSecondRow = () => {
      if (!secondRow || isSecondRowHovered) return
  
      let position = secondRow.scrollLeft || secondRow.scrollWidth / 2
      const speed = 0.5
  
      const step = () => {
        if (isSecondRowHovered) return
        position -= speed
        if (position <= 0) {
          position = secondRow.scrollWidth / 2
        }
        secondRow.scrollLeft = position
        secondRowAnimation = requestAnimationFrame(step)
      }
  
      step()
    }
  
    animateFirstRow()
    animateSecondRow()
  
    return () => {
      cancelAnimationFrame(firstRowAnimation)
      cancelAnimationFrame(secondRowAnimation)
    }
  }, [isFirstRowHovered, isSecondRowHovered])
  

  return (
    <section className="max-w-[100vw] my-20 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-[#003265] mb-2">Testimonials</h2>
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
            >
              {firstRowTestimonials.map((testimonial, index) => (
                <div
                  key={`row1-${testimonial.id}-${index}`}
                  className="min-w-[280px] md:min-w-[320px] bg-white rounded-lg p-4 shadow-md flex flex-col"
                >
                  <h3 className="text-lg font-semibold text-[#003265] mb-2">{testimonial.title}</h3>
                  <p className="text-gray-500 text-sm mb-4 flex-grow">{testimonial.content}</p>
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="flex mb-2">{renderStars(testimonial.rating)}</div>
                      <div>
                        <p className="font-medium">- {testimonial.author}</p>
                        <p className="text-sm text-gray-400">{testimonial.role}</p>
                      </div>
                    </div>
                    {testimonial.emoji && <div className="ml-2">{renderEmoji(testimonial.emoji)}</div>}
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
            >
              {secondRowTestimonials.map((testimonial, index) => (
                <div
                  key={`row2-${testimonial.id}-${index}`}
                  className="min-w-[280px] md:min-w-[320px] bg-white rounded-lg p-4 shadow-md flex flex-col"
                >
                  <h3 className="text-lg font-semibold text-[#003265] mb-2">{testimonial.title}</h3>
                  <p className="text-gray-500 text-sm mb-4 flex-grow">{testimonial.content}</p>
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="flex mb-2">{renderStars(testimonial.rating)}</div>
                      <div>
                        <p className="font-medium">- {testimonial.author}</p>
                        <p className="text-sm text-gray-400">{testimonial.role}</p>
                      </div>
                    </div>
                    {testimonial.emoji && <div className="ml-2">{renderEmoji(testimonial.emoji)}</div>}
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
