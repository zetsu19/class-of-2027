"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { ArrowRight, Zap } from "lucide-react";

export default function LandingPage() {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: false }),
  );

  const slides = [
    { src: "/classpic4.jpg", label: "THE CREW", year: "'27" },
    { src: "/classpic2.jpg", label: "HUGE W", year: "crew" },
    { src: "/classpic3.jpg", label: "BIG WINS", year: "CHAMPS" },
    { src: "/classpic1.jpg", label: "THE ARCHIVE", year: "v2.7" },
  ];

  return (
    <main className="fixed inset-0 w-screen h-[100dvh] bg-[#0f0e0e] overflow-hidden m-0 p-0 flex flex-col">
      <link
        href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@700;900&display=swap"
        rel="stylesheet"
      />

      <style jsx global>{`
        .bebas {
          font-family: "Bebas Neue", sans-serif;
        }
        .dm-sans {
          font-family: "DM Sans", sans-serif;
        }

        /* Film Grain Overlay */
        .grain::before {
          content: "";
          pointer-events: none;
          position: fixed;
          inset: 0;
          z-index: 50;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E");
          opacity: 0.4;
        }
      `}</style>

      <div className="grain w-full h-full">
        <Carousel
          plugins={[plugin.current]}
          className="w-full h-full border-none"
        >
          <CarouselContent className="h-[100dvh] ml-0">
            {slides.map((slide, index) => (
              <CarouselItem
                key={index}
                className="pl-0 h-screen relative border-none"
              >
                <div className="relative w-full h-full overflow-hidden">
                  <Image
                    src={slide.src}
                    alt={slide.label}
                    fill
                    priority={index === 0}
                    className="object-cover"
                    sizes="100vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f0e0e] via-transparent to-transparent flex flex-col justify-end p-6 md:p-16 z-10">
                    <div className="flex flex-col items-start gap-2 mb-6">
                      <div className="bg-[#f2c14e] border-2 border-[#0f0e0e] px-3 py-1 text-xs font-black uppercase tracking-tighter shadow-[4px_4px_0px_0px_rgba(15,14,14,1)] dm-sans">
                        MEMORIES // {slide.year}
                      </div>
                      <h2 className="text-white bebas text-[clamp(4rem,15vw,12rem)] leading-[0.8] uppercase italic">
                        {slide.label.split(" ")[0]} <br />
                        <span
                          className="text-transparent"
                          style={{ WebkitTextStroke: "2px white" }}
                        >
                          {slide.label.split(" ")[1] || ""}
                        </span>
                      </h2>
                    </div>

                    <Link
                      href="/members"
                      className="flex items-center gap-4 bg-[#e8325a] text-white border-4 border-[#0f0e0e] px-8 py-5 rounded-none font-bold uppercase tracking-widest shadow-[8px_8px_0px_0px_rgba(15,14,14,1)] hover:shadow-[4px_4px_0px_0px_rgba(15,14,14,1)] hover:translate-x-1 hover:translate-y-1 transition-all w-fit dm-sans"
                    >
                      Enter The Wall
                      <ArrowRight size={24} />
                    </Link>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="absolute top-8 left-8 z-50 pointer-events-none">
            <div className="flex items-center gap-3 bg-[#f0ebe4] border-4 border-[#0f0e0e] p-4 shadow-[6px_6px_0px_0px_rgba(15,14,14,1)]">
              <Zap className="fill-[#f2c14e] text-[#0f0e0e]" size={24} />
              <div className="leading-none">
                <p className="bebas text-2xl uppercase leading-none text-[#0f0e0e]">
                  Class Archive
                </p>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#e8325a] dm-sans">
                  Est. 2015
                </p>
              </div>
            </div>
          </div>
        </Carousel>
      </div>
    </main>
  );
}
