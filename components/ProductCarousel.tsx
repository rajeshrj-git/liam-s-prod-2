"use client";

import { useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs, FreeMode } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "swiper/css/free-mode";

export default function ProductCarousel({ images, altText }: { images: string[]; altText: string }) {
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-[4/3] bg-card flex items-center justify-center rounded-2xl border border-white/10 shadow-xl overflow-hidden">
        <span className="text-gray-500">No images available</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden border border-gray-100 shadow-xl bg-gray-50 relative">
        <Swiper
          spaceBetween={10}
          navigation={true}
          thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
          modules={[Navigation, Thumbs]}
          className="w-full h-full"
        >
          {images.map((src, idx) => (
            <SwiperSlide key={idx}>
              <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0 select-none pointer-events-none">
                  <Image
                    src={src}
                    alt="Background blur"
                    fill
                    className="object-cover blur-[40px] scale-125 opacity-50"
                    priority={idx === 0}
                  />
                </div>
                <Image
                  src={src}
                  alt={`${altText} image ${idx + 1}`}
                  fill
                  className="object-contain p-4 z-10 drop-shadow-2xl"
                  priority={idx === 0}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {images.length > 1 && (
        <div className="h-24 w-full">
          <Swiper
            onSwiper={setThumbsSwiper}
            spaceBetween={10}
            slidesPerView={4}
            freeMode={true}
            watchSlidesProgress={true}
            modules={[FreeMode, Navigation, Thumbs]}
            className="h-full w-full custom-thumbs"
          >
            {images.map((src, idx) => (
              <SwiperSlide key={idx} className="opacity-50 cursor-pointer rounded-lg overflow-hidden border border-gray-200 [&.swiper-slide-thumb-active]:border-accent [&.swiper-slide-thumb-active]:border-2 [&.swiper-slide-thumb-active]:opacity-100 transition-all bg-white shadow-sm hover:opacity-80">
                <div className="relative w-full h-full">
                  <Image
                    src={src}
                    alt={`${altText} thumbnail ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </div>
  );
}
