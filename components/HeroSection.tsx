"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, Sparkles, Html } from "@react-three/drei";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Tag, Zap, Cpu } from "lucide-react";
import { motion } from "framer-motion";
import * as THREE from "three";

export default function HeroSection() {
  const whatsappNumber = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "").replace(/\D/g, "");
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=Hi Liam Products! I'm interested in looking at your premium honey.`;

  return (
    <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden bg-background">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFF6E5] via-[#FFF9EE] to-[#FFF6E5]" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px]" />
        <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
          <Environment preset="city" />
          <ambientLight intensity={0.8} />
          <directionalLight position={[10, 10, 5]} intensity={1.5} color="#FFC107" />
          
          <Sparkles count={300} scale={10} size={2} speed={0.4} opacity={0.5} color="#FBB901" />
        </Canvas>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 md:px-6 relative z-10 pointer-events-none">
        <div className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto h-full min-h-[50vh]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center pointer-events-auto"
          >
            <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
              <div className="inline-block px-4 py-1.5 rounded-full border border-accent/30 bg-white/50 backdrop-blur-sm shadow-sm">
                <span className="text-sm font-medium tracking-wide text-accent uppercase">
                  🍯 Pure Premium Quality
                </span>
              </div>
            </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-serif text-foreground mb-6 leading-tight tracking-tight drop-shadow-sm">
            Taste the Sweetness <br />
            of Nature
          </h1>
          <p className="text-lg md:text-xl text-foreground/80 mb-10 max-w-xl leading-relaxed font-light">
            100% Pure Raw Honey, harvested naturally
          </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 w-full mt-2">
              <a
                href="/products"
                className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent-hover text-white px-8 py-4 rounded-xl font-medium text-lg min-h-[44px] transition-all hover:-translate-y-1 shadow-[0_8px_20px_-6px_rgba(230,168,23,0.4)]"
              >
                Shop Now
                <ArrowRight size={20} />
              </a>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-transparent hover:bg-accent/5 border border-accent/20 text-foreground px-8 py-4 rounded-xl font-medium text-lg min-h-[44px] transition-all shadow-sm"
              >
                Order via WhatsApp
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50 z-20">
        <span className="text-xs uppercase tracking-widest text-gray-500 font-bold">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-accent to-transparent" />
      </div>
    </section>
  );
}
