"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const slides = [
  "https://wafilife-media-backend.wafilife.com/2026/06/desktop%20(26)-mqc5jj0k-us21.jpg",
  "https://wafilife-media-backend.wafilife.com/2026/07/Desktop%20(35)-mr7srtak-gzz8.jpg",
  "https://wafilife-media-backend.wafilife.com/2026/06/desktop%20(26)-mqc5jj0k-us21.jpg",
];

export default function HeroCarousel() {
  return (
    <Carousel className="w-full" opts={{ loop: true }}>
      <CarouselContent>
        {slides.map((src, i) => (
          <CarouselItem key={i}>
            <div className="relative w-full overflow-hidden bg-muted max-h-92.5">
              <img src={src} alt="Banner" className="w-full h-auto" />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-3 top-1/2 -translate-y-1/2" />
      <CarouselNext className="right-3 top-1/2 -translate-y-1/2" />
    </Carousel>
  );
}