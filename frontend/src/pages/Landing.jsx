import React from 'react';
import HeroSection from "../components/sections/HeroSection";
import HowItWorks from "../components/sections/HowItWorks";
import EducationalPlatform from "../components/sections/EducationalPlatform";
import CategoryBrowser from "../components/sections/catrgory-browser";
import TestimonialsSection from "../components/sections/testimonials-section";
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

export default function Landing() { 
  return (
    <div className="w-full min-h-screen bg-white">
      <Header/>
      <main className="relative">
        <HeroSection />
        <HowItWorks />
        <EducationalPlatform />
        <CategoryBrowser />
        <TestimonialsSection />
      </main>
      <Footer />
    </div>
  );
}
