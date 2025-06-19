import { useRef } from "react";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import WarpEffect from "./WarpEffect";
import EnvironmentEffects from "./EnvironmentEffects";

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
        <boxGeometry args={[30, 30, 0.02]} />
        <meshStandardMaterial map={sandTexture} color="#d4a574" />
      </mesh>
      
      {/* Arena floor */}
      <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <boxGeometry args={[16, 16, 0.2]} />
        <meshStandardMaterial map={asphaltTexture} />
      </mesh>
      
      {/* Arena wall (invisible collision boundary) */}
      <mesh position={[0, 2, 0]} visible={false}>
        <boxGeometry args={[16, 4, 16]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
      
      {/* Visible arena boundary walls */}
      {/* North wall */}
      <mesh position={[0, 0.5, 8]} castShadow receiveShadow>
        <boxGeometry args={[16.2, 1, 0.2]} />
        <meshStandardMaterial 
          color="#666666" 
          metalness={0.1}
          roughness={0.8}
        />
      </mesh>
      {/* South wall */}
      <mesh position={[0, 0.5, -8]} castShadow receiveShadow>
        <boxGeometry args={[16.2, 1, 0.2]} />
        <meshStandardMaterial 
          color="#666666" 
          metalness={0.1}
          roughness={0.8}
        />
      </mesh>
      {/* East wall */}
      <mesh position={[8, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.2, 1, 16]} />
        <meshStandardMaterial 
          color="#666666" 
          metalness={0.1}
          roughness={0.8}
        />
      </mesh>
      {/* West wall */}
      <mesh position={[-8, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.2, 1, 16]} />
        <meshStandardMaterial 
          color="#666666" 
          metalness={0.1}
          roughness={0.8}
        />
      </mesh>
      
      {/* Arena boundary lines - outer square */}
      <mesh position={[0, 0.12, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[7.8, 8.2, 4]} />
        <meshStandardMaterial 
          color="#ff4444" 
          emissive="#ff2222"
          emissiveIntensity={0.3}
          transparent 
          opacity={0.8} 
        />
      </mesh>
      
      {/* Warning zone lines - inner square */}
      <mesh position={[0, 0.11, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[7.0, 7.6, 4]} />
        <meshStandardMaterial 
          color="#ffaa00" 
          emissive="#ff8800"
          emissiveIntensity={0.2}
          transparent 
          opacity={0.4} 
        />
      </mesh>
      
      {/* Center square */}
      <mesh position={[0, 0.13, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <boxGeometry args={[2, 2, 0.01]} />
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
      
      {/* Arena stands/bleachers around the square arena */}
      {/* North stands */}
      <group position={[0, 0, 18]}>
        <mesh position={[0, 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[20, 4, 2]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        <mesh position={[0, 4.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[20, 1, 2]} />
          <meshStandardMaterial color="#654321" />
        </mesh>
      </group>
      {/* South stands */}
      <group position={[0, 0, -18]}>
        <mesh position={[0, 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[20, 4, 2]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        <mesh position={[0, 4.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[20, 1, 2]} />
          <meshStandardMaterial color="#654321" />
        </mesh>
      </group>
      {/* East stands */}
      <group position={[18, 0, 0]}>
        <mesh position={[0, 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[2, 4, 16]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        <mesh position={[0, 4.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[2, 1, 16]} />
          <meshStandardMaterial color="#654321" />
        </mesh>
      </group>
      {/* West stands */}
      <group position={[-18, 0, 0]}>
        <mesh position={[0, 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[2, 4, 16]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        <mesh position={[0, 4.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[2, 1, 16]} />
          <meshStandardMaterial color="#654321" />
        </mesh>
      </group>
      
      {/* Decorative pillars at corners */}
      {[
        [12, 12], [-12, 12], [12, -12], [-12, -12]
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, 3, z]} castShadow receiveShadow>
          <boxGeometry args={[1, 6, 1]} />
          <meshStandardMaterial color="#A0A0A0" metalness={0.3} roughness={0.7} />
        </mesh>
      ))}
      
      {/* Warning lights around square arena perimeter */}
      {[
        // North side
        [-6, 1.5, 9], [0, 1.5, 9], [6, 1.5, 9],
        // South side
        [-6, 1.5, -9], [0, 1.5, -9], [6, 1.5, -9],
        // East side
        [9, 1.5, -6], [9, 1.5, 0], [9, 1.5, 6],
        // West side
        [-9, 1.5, -6], [-9, 1.5, 0], [-9, 1.5, 6]
      ].map((pos, i) => (
        <group key={i} position={pos as [number, number, number]}>
          <mesh castShadow>
            <boxGeometry args={[0.3, 0.3, 0.3]} />
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
      ))}
      
      {/* Background warp effect */}
      <WarpEffect />
      
      {/* Environment effects */}
      <EnvironmentEffects />
    </group>
  );
}
