"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { type CarouselApi } from "@/components/ui/carousel"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import Autoplay from "embla-carousel-autoplay"
import { carouselItems } from "@/constants"


export default function Hero() {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!api) return
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  const plugin = Autoplay({ delay: 5000, stopOnInteraction: true })
  return (
    <section className="relative text-white">
      <Carousel
        plugins={[plugin]}
        className="w-full"
        setApi={setApi}
      >
        <CarouselContent>
          {carouselItems.map((item, index) => (
            <CarouselItem key={index}>
              <div className="relative h-[600px] bg-black">
                <img
                  src={item.image}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-40"
                />
                <div className="relative z-10 h-full flex flex-col items-center justify-center px-4">
                  <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight text-center">
                    {item.title}
                  </h1>
                  <p className="text-xl md:text-2xl mb-10 max-w-2xl mx-auto text-center">
                    {item.subtitle}
                  </p>
                  <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
                    Explore Our Projects
                  </Button>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {carouselItems.map((_, index) => (
            <button
              key={index}
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                current === index ? "bg-white w-4" : "bg-white/50"
              )}
              onClick={() => api?.scrollTo(index)}
            />
          ))}
        </div>

        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white border-none">
          <ChevronLeft className="h-6 w-6" />
        </CarouselPrevious>
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white border-none">
          <ChevronRight className="h-6 w-6" />
        </CarouselNext>
      </Carousel>
    </section>
  )
}