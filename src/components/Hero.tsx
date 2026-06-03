"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = [
    {
      title: "Premium Wireless Audio Devices",
      subtitle: "Experience authentic studio profiles with ultimate active noise cancellation layers.",
      image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=1200&auto=format&fit=crop&q=80",
      tag: "Limited Offer"
    },
    {
      title: "Next-Gen Computing Ecosystems",
      subtitle: "Boost workflows with high performance architectures and dedicated configurations.",
      image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&auto=format&fit=crop&q=80",
      tag: "New Arrivals"
    },
    {
      title: "Smart Fitness Wearables",
      subtitle: "Monitor oxygen saturation tracks and algorithmic body evaluation parameters 24/7.",
      image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=1200&auto=format&fit=crop&q=80",
      tag: "Trending Now"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 4500);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="relative w-full h-[240px] md:h-[380px] bg-slate-900 overflow-hidden rounded-2xl border border-slate-100 shadow-xs group">
      <div 
        className="w-full h-full flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {slides.map((slide, idx) => (
          <div key={idx} className="w-full h-full shrink-0 relative flex items-center justify-start">
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10" />
            <img src={slide.image} className="absolute inset-0 w-full h-full object-cover" alt="" />
            
            <div className="relative z-20 text-white max-w-xl px-8 md:px-16 space-y-3">
              <span className="inline-block text-[10px] md:text-xs font-bold uppercase tracking-widest bg-blue-600 text-white px-2.5 py-0.5 rounded-md shadow-xs">
                {slide.tag}
              </span>
              <h2 className="text-xl md:text-4xl font-extrabold tracking-tight leading-tight">
                {slide.title}
              </h2>
              <p className="text-xs md:text-sm text-gray-300 font-medium leading-relaxed line-clamp-2">
                {slide.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>

      <button onClick={() => setCurrentIndex(currentIndex === 0 ? slides.length - 1 : currentIndex - 1)} className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-1.5 rounded-full bg-white/10 text-white hover:bg-white/20 opacity-0 group-hover:opacity-100 transition cursor-pointer">
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button onClick={() => setCurrentIndex(currentIndex === slides.length - 1 ? 0 : currentIndex + 1)} className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-1.5 rounded-full bg-white/10 text-white hover:bg-white/20 opacity-0 group-hover:opacity-100 transition cursor-pointer">
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}