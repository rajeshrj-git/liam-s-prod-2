"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, Sparkles, Html } from "@react-three/drei";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Tag, Zap, Cpu } from "lucide-react";
import { motion } from "framer-motion";
import * as THREE from "three";

import BeeSwarm from "./BeeSwarm";

export default function HeroSection() {
  const whatsappLink = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=Hi Liam Products! I'm interested in looking at your premium honey.`;

  return (
    <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden bg-white">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 blur-3xl opacity-30 bg-white" />
        <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
          <Environment preset="city" />
          <ambientLight intensity={0.8} />
          <directionalLight position={[10, 10, 5]} intensity={1.5} color="#FFC107" />
          
          <BeeSwarm />

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
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="inline-block px-4 py-1.5 rounded-full border border-gray-900/10 bg-white/40 backdrop-blur-sm">
                <span className="text-sm font-semibold tracking-wide text-gray-900 uppercase">
                  🍯 Pure Premium Quality
                </span>
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex items-center gap-2 mb-2 text-gray-800 font-medium"
            >
              {/* <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-[#FFE082] bg-gray-200 flex items-center justify-center overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="Customer" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <span>100% Pure & Natural Sourcing</span> */}
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-bold font-serif text-gray-900 mb-6 leading-[1.1] tracking-tight drop-shadow-sm">
            Taste the <span className="text-[#FFC107]">Sweetness</span> <br />
            <span className="text-[#FFC107]">
              Of Nature
            </span> Directly.
          </h1>
            <p className="text-lg md:text-xl text-gray-800 mb-8 max-w-xl leading-relaxed font-medium">
              Discover our top-tier, rigorously sourced natural honey. Unbeatable quality, rich flavor, and the essence of pure nature in every drop.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 w-full mt-4">
              <a
                href="/products"
                className="inline-flex items-center justify-center gap-2 bg-[#FFC107] hover:bg-[#FFB300] text-gray-900 px-8 py-4 rounded-xl font-bold text-lg transition-transform hover:scale-105 shadow-xl"
              >
                Browse Collection
                <ArrowRight size={20} />
              </a>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-white/80 backdrop-blur-md hover:bg-white border border-gray-200 text-gray-900 px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-md"
              >
                Chat on WhatsApp
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
