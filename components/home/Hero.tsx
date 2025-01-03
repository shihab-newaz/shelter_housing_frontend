"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import YouTubeEmbed from "@/components/embed/YoutubeEmbed";
import TypingAnimation from "@/components/ui/typing-animation";
import Link from "next/link";

/**
 * Hero component displaying a video background with animated text overlay
 * Features a responsive design with typing animations and a call-to-action button
 */
export default function Hero() {
  return (
    <section className="relative text-sage-50">
      <div className="relative h-[80vh] bg-sage-900">
        <YouTubeEmbed
          videoId="TOir-ss8W9c"
          title="Dhaka, Bangladesh | 4K Drone Footage"
        />
        {/* Overlay with sage gradient for better text visibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-sage-900/60 to-sage-900/40" />
        
        {/* Content container */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-4">
          <TypingAnimation
            className="text-5xl md:text-6xl font-bold mb-6 leading-tight text-center font-playfair"
            duration={50}
            delay={500}
            startOnView={true}
          >
            Building Dreams, Creating Homes
          </TypingAnimation>
          
          <TypingAnimation
            className="text-xl md:text-2xl mb-10 max-w-2xl mx-auto text-center text-sage-100"
            duration={30}
            delay={2000}
            startOnView={true}
          >
            Your trusted partner in premium real estate development
          </TypingAnimation>
          
          <Link href="/projects/completed">
            <Button 
              size="lg" 
              variant="outline"
              className="text-lg px-8 py-3 bg-sage-50/10 border-sage-200 text-sage-50 
                hover:bg-sage-700 hover:text-sage-50 transition-all duration-300
                backdrop-blur-sm"
            >
              Explore Our Projects
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}