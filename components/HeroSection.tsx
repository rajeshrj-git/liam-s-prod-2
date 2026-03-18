"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, Sparkles, Html } from "@react-three/drei";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Tag, Zap, Cpu } from "lucide-react";
import { motion } from "framer-motion";
import * as THREE from "three";

function CyberneticCore() {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group ref={meshRef}>
      {/* Outer Holographic Grid Ring */}
      <mesh>
        <torusGeometry args={[2.5, 0.02, 16, 100]} />
        <meshBasicMaterial color="#FF6B00" wireframe opacity={0.3} transparent />
      </mesh>
      
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.5, 0.02, 16, 100]} />
        <meshBasicMaterial color="#FF6B00" wireframe opacity={0.3} transparent />
      </mesh>

      {/* Inner Tech Core */}
      <mesh>
        <icosahedronGeometry args={[1.5, 1]} />
        <meshStandardMaterial 
          color="#0a0a0a" 
          emissive="#FF3300"
          emissiveIntensity={0.2}
          wireframe={true}
        />
      </mesh>

      {/* Solid Inner Core */}
      <mesh scale={0.8}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial 
          color="#111" 
          metalness={0.9}
          roughness={0.1}
          emissive="#FF6B00"
          emissiveIntensity={0.5}
        />
      </mesh>
    </group>
  );
}

export default function HeroSection() {
  const whatsappLink = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=Hi Jarvis Computer! I'm interested in looking at your premium collections.`;

  return (
    <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
          <Environment preset="city" />
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} color="#FF6B00" />
          
          <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
            <CyberneticCore />
          </Float>

          <Sparkles count={300} scale={10} size={2} speed={0.4} opacity={0.5} color="#FF6B00" />
        </Canvas>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="inline-block px-4 py-1.5 rounded-full border border-accent/30 bg-accent/10 backdrop-blur-sm">
                <span className="text-accent font-semibold text-sm tracking-wide uppercase">
                  Premium Refurbished Tech
                </span>
              </div>

              {/* Glowing Warranty Badge - The Flex */}
              <motion.div
                initial={{ opacity: 0, inlineSize: "fit-content" }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.8 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/30 text-accent font-bold text-sm tracking-wide shadow-[0_0_20px_rgba(255,107,0,0.2)]"
              >
                <ShieldCheck size={16} />
                <span>1 Week Testing & 6 Month Service Warranty</span>
              </motion.div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-[1.1] tracking-tight">
              Upgrade Your Tech <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-[#FFB800]">
                Without The Price Tag.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-xl leading-relaxed">
              Discover top-tier, rigorously tested refurbished laptops and desktops. Unbeatable prices, guaranteed quality, and unmatched support.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="/products"
                className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent-hover text-black px-8 py-4 rounded-xl font-bold text-lg transition-transform hover:scale-105 shadow-[0_0_20px_rgba(255,107,0,0.4)]"
              >
                Browse Collection
                <ArrowRight size={20} />
              </a>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all hover:border-white/20 backdrop-blur-sm"
              >
                Chat on WhatsApp
              </a>
            </div>
          </motion.div>
          
          <div className="hidden lg:block h-full min-h-[500px]" /> {/* Spacer for 3D model */}
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-accent to-transparent" />
      </div>
    </section>
  );
}
