"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

function DetailedBee({ position, speedOffset }: { position: [number, number, number], speedOffset: number }) {
  const group = useRef<THREE.Group>(null);
  const wingsRight = useRef<THREE.Group>(null);
  const wingsLeft = useRef<THREE.Group>(null);
  const legs = useRef<THREE.Group>(null);

  // Use a custom stripe texture or a multi-material approach for the abdomen?
  // We'll use multiple simple shapes to form the striped abdomen for highest realism without external textures.
  const numStripes = 6;
  
  useFrame((state) => {
    const time = state.clock.elapsedTime + speedOffset;
    if (group.current) {
      // Roaming movement
      group.current.position.x = position[0] + Math.sin(time * 0.4) * 2.5;
      group.current.position.y = position[1] + Math.cos(time * 0.5) * 1.5;
      group.current.position.z = position[2] + Math.sin(time * 0.3) * 2;
      
      // Look direction
      group.current.rotation.y = Math.atan2(
        Math.cos(time * 0.4), 
        -Math.sin(time * 0.4)
      );
      // Roll and Pitch
      group.current.rotation.z = Math.sin(time * 1.5) * 0.15;
      group.current.rotation.x = Math.cos(time * 2) * 0.1;
    }

    // Extremely fast wing flapping (blur effect)
    if (wingsRight.current && wingsLeft.current) {
      const flap = Math.sin(time * 80) * 0.7; // ~80 rad/s
      wingsRight.current.rotation.z = flap;
      wingsLeft.current.rotation.z = -flap;
    }
  });

  return (
    <group ref={group}>
      <Float speed={4} rotationIntensity={0.2} floatIntensity={0.5}>
        <group scale={0.4} rotation={[0.2, 0, 0]}>
          
          {/* ----- ABOMEN (Striped Back part) ----- */}
          <group position={[0, -0.2, -0.7]} rotation={[0.3, 0, 0]}>
            <mesh>
              {/* Core shape of abdomen */}
              <capsuleGeometry args={[0.3, 0.5, 16, 16]} />
              <meshStandardMaterial color="#D97706" roughness={0.6} />
            </mesh>
            {/* Black stripes overlays */}
            {Array.from({ length: 3 }).map((_, i) => (
              <mesh key={i} position={[0, -0.15 + (i * 0.15), 0]}>
                <cylinderGeometry args={[0.305, 0.305, 0.08, 16]} />
                <meshStandardMaterial color="#111111" roughness={0.9} />
              </mesh>
            ))}
            {/* Stinger */}
            <mesh position={[0, -0.5, 0]}>
              <coneGeometry args={[0.05, 0.2, 8]} />
              <meshStandardMaterial color="#111111" />
            </mesh>
          </group>

          {/* ----- THORAX (Fuzzy Middle part) ----- */}
          <mesh position={[0, 0, 0]}>
            {/* Golden fuzzy thorax */}
            <sphereGeometry args={[0.35, 32, 32]} />
            <meshStandardMaterial color="#FBB901" roughness={0.9} />
          </mesh>

          {/* ----- HEAD ----- */}
          <group position={[0, 0.1, 0.4]} rotation={[-0.4, 0, 0]}>
            <mesh>
              {/* Head shape */}
              <sphereGeometry args={[0.22, 16, 16]} />
              <meshStandardMaterial color="#222222" roughness={0.5} />
            </mesh>
            {/* Left Eye */}
            <mesh position={[-0.15, 0.05, 0.12]} rotation={[0, -0.5, 0]}>
              <capsuleGeometry args={[0.08, 0.1, 16, 16]} />
              <meshStandardMaterial color="#000000" roughness={0.1} metalness={0.8} />
            </mesh>
            {/* Right Eye */}
            <mesh position={[0.15, 0.05, 0.12]} rotation={[0, 0.5, 0]}>
              <capsuleGeometry args={[0.08, 0.1, 16, 16]} />
              <meshStandardMaterial color="#000000" roughness={0.1} metalness={0.8} />
            </mesh>
            {/* Antennae */}
            <mesh position={[-0.08, 0.2, 0.2]} rotation={[0.5, -0.2, -0.5]}>
              <cylinderGeometry args={[0.01, 0.01, 0.3]} />
              <meshStandardMaterial color="#111111" />
            </mesh>
            <mesh position={[0.08, 0.2, 0.2]} rotation={[0.5, 0.2, 0.5]}>
              <cylinderGeometry args={[0.01, 0.01, 0.3]} />
              <meshStandardMaterial color="#111111" />
            </mesh>
          </group>

          {/* ----- WINGS ----- */}
          {/* Base of wings is above thorax */}
          <group position={[0, 0.35, 0]}>
            {/* Right Wing Group */}
            <group ref={wingsRight} position={[0.1, 0, 0]}>
              <mesh position={[0.4, 0, -0.2]} rotation={[0, -0.2, -0.1]}>
                {/* Large Forewing */}
                <cylinderGeometry args={[0.5, 0.5, 0.01, 16]} />
                <meshPhysicalMaterial color="#ffffff" transmission={0.9} opacity={0.6} transparent roughness={0.1} />
              </mesh>
              <mesh position={[0.3, 0, -0.5]} scale={[0.7, 1, 0.7]} rotation={[0, -0.4, -0.1]}>
                {/* Small Hindwing */}
                <cylinderGeometry args={[0.4, 0.4, 0.01, 16]} />
                <meshPhysicalMaterial color="#ffffff" transmission={0.9} opacity={0.6} transparent roughness={0.1} />
              </mesh>
            </group>
            
            {/* Left Wing Group */}
            <group ref={wingsLeft} position={[-0.1, 0, 0]}>
              <mesh position={[-0.4, 0, -0.2]} rotation={[0, 0.2, 0.1]}>
                {/* Large Forewing */}
                <cylinderGeometry args={[0.5, 0.5, 0.01, 16]} />
                <meshPhysicalMaterial color="#ffffff" transmission={0.9} opacity={0.6} transparent roughness={0.1} />
              </mesh>
              <mesh position={[-0.3, 0, -0.5]} scale={[0.7, 1, 0.7]} rotation={[0, 0.4, 0.1]}>
                {/* Small Hindwing */}
                <cylinderGeometry args={[0.4, 0.4, 0.01, 16]} />
                <meshPhysicalMaterial color="#ffffff" transmission={0.9} opacity={0.6} transparent roughness={0.1} />
              </mesh>
            </group>
          </group>

          {/* ----- LEGS & POLLEN BASKET ----- */}
          <group ref={legs} position={[0, -0.2, 0]}>
            {/* Front Legs */}
            <mesh position={[-0.2, -0.3, 0.2]} rotation={[0, 0, 0.5]}>
              <cylinderGeometry args={[0.02, 0.01, 0.4]} />
              <meshStandardMaterial color="#222222" />
            </mesh>
            <mesh position={[0.2, -0.3, 0.2]} rotation={[0, 0, -0.5]}>
              <cylinderGeometry args={[0.02, 0.01, 0.4]} />
              <meshStandardMaterial color="#222222" />
            </mesh>
            
            {/* Middle Legs */}
            <mesh position={[-0.25, -0.3, -0.1]} rotation={[0.2, 0, 0.5]}>
              <cylinderGeometry args={[0.02, 0.01, 0.4]} />
              <meshStandardMaterial color="#222222" />
            </mesh>
            <mesh position={[0.25, -0.3, -0.1]} rotation={[0.2, 0, -0.5]}>
              <cylinderGeometry args={[0.02, 0.01, 0.4]} />
              <meshStandardMaterial color="#222222" />
            </mesh>

            {/* Back Legs with Pollen Baskets (The orange lump from the image) */}
            <mesh position={[-0.2, -0.4, -0.4]} rotation={[0.5, 0, 0.3]}>
              <cylinderGeometry args={[0.03, 0.02, 0.5]} />
              <meshStandardMaterial color="#222222" />
              {/* Pollen Basket */}
              <mesh position={[0, 0, 0.05]} scale={[1, 1.5, 0.8]}>
                <sphereGeometry args={[0.08, 16, 16]} />
                <meshStandardMaterial color="#F97316" roughness={0.8} />
              </mesh>
            </mesh>
            <mesh position={[0.2, -0.4, -0.4]} rotation={[0.5, 0, -0.3]}>
              <cylinderGeometry args={[0.03, 0.02, 0.5]} />
              <meshStandardMaterial color="#222222" />
              {/* Pollen Basket */}
              <mesh position={[0, 0, 0.05]} scale={[1, 1.5, 0.8]}>
                <sphereGeometry args={[0.08, 16, 16]} />
                <meshStandardMaterial color="#F97316" roughness={0.8} />
              </mesh>
            </mesh>
          </group>

        </group>
      </Float>
    </group>
  );
}

export default function BeeSwarm() {
  const bees = [
    { pos: [0, 0, 0], offset: 0 },
    { pos: [2.5, 1.5, -1], offset: 1.2 },
    { pos: [-2, -1, 1], offset: 2.5 },
    { pos: [1.5, -2, -2], offset: 3.8 },
    { pos: [-1.5, 2, 2], offset: 5.1 },
    { pos: [3.5, -0.5, 0.5], offset: 6.4 },
    { pos: [-3, 0.5, -1], offset: 7.7 },
  ];

  return (
    <group>
      {bees.map((bee, idx) => (
        <DetailedBee key={idx} position={bee.pos as [number, number, number]} speedOffset={bee.offset} />
      ))}
    </group>
  );
}
