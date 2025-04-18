"use client";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import YouTubeEmbed from "@/components/embed/YoutubeEmbed";
import { TextAnimate } from "@/components/ui/text-animate";

export default function Hero() {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Darker overlay for better text visibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/60 z-10" />
      
      <YouTubeEmbed
        videoId="TOir-ss8W9c"
        title="Dhaka, Bangladesh | 4K Drone Footage"
      />
      
      <div className="absolute inset-0 z-20 flex items-center justify-center ">
        <div className="text-center max-w-4xl mx-auto">
          <TextAnimate
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl
                      font-bold mb-4 text-white/90 leading-tight"
            duration={50}
            delay={500}
            startOnView={true}
          >
            Shelter Housing Limited
          </TextAnimate>
          
          <TextAnimate
            className="text-base sm:text-lg md:text-xl lg:text-2xl mb-8
                      text-white/80 max-w-3xl mx-auto"
            duration={30}
            delay={2000}
            startOnView={true}
          >
            A Tradition of Trust
          </TextAnimate>
          
          <Link href="/projects/completed">
            <Button
              size="lg"
              variant="secondary"
              className="text-base sm:text-lg font-semibold
                        py-3 px-6 sm:px-8
                        rounded-full
                        transition-all duration-300 ease-in-out
                        transform hover:scale-105
                        shadow-lg hover:shadow-xl
                        bg-white/90 hover:bg-white
                        text-gray-900"
            >
              Explore Our Projects
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}