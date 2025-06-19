import { useRef } from "react";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

export default function Arena() {
  const meshRef = useRef<THREE.Mesh>(null);
  const asphaltTexture = useTexture("/textures/asphalt.png");
  const sandTexture = useTexture("/textures/sand.jpg");
  const grassTexture = useTexture("/textures/grass.png");
  
  // Configure arena floor texture
  asphaltTexture.wrapS = asphaltTexture.wrapT = THREE.RepeatWrapping;
  asphaltTexture.repeat.set(4, 4);
  
  // Configure ground textures
  sandTexture.wrapS = sandTexture.wrapT = THREE.RepeatWrapping;
  sandTexture.repeat.set(8, 8);
  
  grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
  grassTexture.repeat.set(12, 12);

  return (
    <group>
      {/* Large ground plane extending beyond arena */}
      <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial map={grassTexture} color="#2d5a2d" />
      </mesh>
      
      {/* Sand area around arena */}
      <mesh position={[0, -0.48, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <cylinderGeometry args={[15, 15, 0.02, 64]} />
        <meshStandardMaterial map={sandTexture} color="#d4a574" />
      </mesh>
      
      {/* Arena floor */}
      <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <cylinderGeometry args={[8, 8, 0.2, 32]} />
        <meshStandardMaterial map={asphaltTexture} />
      </mesh>
      
      {/* Arena wall (invisible collision boundary) */}
      <mesh position={[0, 2, 0]} visible={false}>
        <cylinderGeometry args={[8, 8, 4, 32]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
      
      {/* Visible arena boundary wall */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[8.1, 8.1, 1, 64, 1, true]} />
        <meshStandardMaterial 
          color="#666666" 
          metalness={0.1}
          roughness={0.8}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Arena boundary ring - more visible */}
      <mesh position={[0, 0.12, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[7.9, 8.3, 64]} />
        <meshStandardMaterial 
          color="#ff4444" 
          emissive="#ff2222"
          emissiveIntensity={0.3}
          transparent 
          opacity={0.8} 
        />
      </mesh>
      
      {/* Warning zone ring */}
      <mesh position={[0, 0.11, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[7.2, 7.8, 64]} />
        <meshStandardMaterial 
          color="#ffaa00" 
          emissive="#ff8800"
          emissiveIntensity={0.2}
          transparent 
          opacity={0.4} 
        />
      </mesh>
      
      {/* Center circle */}
      <mesh position={[0, 0.13, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0, 1, 32]} />
        <meshStandardMaterial 
          color="#00ff00" 
          emissive="#00aa00"
          emissiveIntensity={0.3}
          transparent 
          opacity={0.6} 
        />
      </mesh>
      
      {/* Sky dome for better atmosphere */}
      <mesh position={[0, 0, 0]} scale={[50, 50, 50]}>
        <sphereGeometry args={[1, 32, 16]} />
        <meshBasicMaterial 
          color="#87CEEB" 
          side={THREE.BackSide}
          transparent
          opacity={0.3}
        />
      </mesh>
      
      {/* Arena stands/bleachers around the arena */}
      {Array.from({ length: 8 }, (_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const x = Math.cos(angle) * 18;
        const z = Math.sin(angle) * 18;
        return (
          <group key={i} position={[x, 0, z]} rotation={[0, angle + Math.PI, 0]}>
            <mesh position={[0, 2, 0]} castShadow receiveShadow>
              <boxGeometry args={[6, 4, 2]} />
              <meshStandardMaterial color="#8B4513" />
            </mesh>
            <mesh position={[0, 4.5, 0]} castShadow receiveShadow>
              <boxGeometry args={[6, 1, 2]} />
              <meshStandardMaterial color="#654321" />
            </mesh>
          </group>
        );
      })}
      
      {/* Decorative pillars at cardinal points */}
      {Array.from({ length: 4 }, (_, i) => {
        const angle = (i / 4) * Math.PI * 2;
        const x = Math.cos(angle) * 12;
        const z = Math.sin(angle) * 12;
        return (
          <mesh key={i} position={[x, 3, z]} castShadow receiveShadow>
            <cylinderGeometry args={[0.5, 0.8, 6, 16]} />
            <meshStandardMaterial color="#A0A0A0" metalness={0.3} roughness={0.7} />
          </mesh>
        );
      })}
      
      {/* Warning lights around arena perimeter */}
      {Array.from({ length: 12 }, (_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const x = Math.cos(angle) * 9.5;
        const z = Math.sin(angle) * 9.5;
        return (
          <group key={i} position={[x, 1.5, z]}>
            <mesh castShadow>
              <sphereGeometry args={[0.2, 8, 8]} />
              <meshStandardMaterial 
                color="#ff0000" 
                emissive="#ff0000"
                emissiveIntensity={0.5}
              />
            </mesh>
            <pointLight
              position={[0, 0, 0]}
              intensity={0.5}
              color="#ff0000"
              distance={5}
            />
          </group>
        );
      })}
    </group>
  );
}
