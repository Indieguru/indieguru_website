import React from 'react';
import HeroSection from "../components/sections/HeroSection";
import HowItWorks from "../components/sections/HowItWorks";
import EducationalPlatform from "../components/sections/EducationalPlatform";
import CategoryBrowser from "../components/sections/catrgory-browser"; // Ensure the file extension is correct
import TestimonialsSection from "../components/sections/testimonials-section";
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';




export default function Landing() { 
  return (
    <div className="min-h-screen bg-white">
        <Header/>
      <HeroSection />
      <HowItWorks />
      <EducationalPlatform />
      <CategoryBrowser />
      <TestimonialsSection />
      <Footer />

    </div>
  );
}
