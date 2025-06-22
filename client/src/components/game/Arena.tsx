import { useRef, Suspense } from "react";
import { useTexture, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import WarpEffect from "./WarpEffect";
import EnvironmentEffects from "./EnvironmentEffects";

export default function Arena() {
  const meshRef = useRef<THREE.Mesh>(null);
  const asphaltTexture = useTexture("/textures/asphalt.png");
  const sandTexture = useTexture("/textures/sand.jpg");
  const grassTexture = useTexture("/textures/grass.png");
  
  // Load royal battle arena models
  const { scene: arenaFloor } = useGLTF("/models/royal_arena_floor.glb");
  const { scene: castleWalls } = useGLTF("/models/castle_walls.glb");
  
  // Load additional royal battle models
  const { scene: tournamentPavilions } = useGLTF("/models/tournament_pavilions.glb");
  const { scene: cheeringCrowd } = useGLTF("/models/cheering_crowd.glb");
  
  // Preload models for better performance
  useGLTF.preload("/models/royal_arena_floor.glb");
  useGLTF.preload("/models/castle_walls.glb");
  useGLTF.preload("/models/tournament_pavilions.glb");
  useGLTF.preload("/models/cheering_crowd.glb");
  
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
      {/* Large medieval countryside extending beyond arena */}
      <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial map={grassTexture} color="#3a5f3a" />
      </mesh>
      
      {/* Royal tournament ground around arena */}
      <mesh position={[0, -0.48, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <boxGeometry args={[35, 35, 0.02]} />
        <meshStandardMaterial map={sandTexture} color="#c19a6b" />
      </mesh>
      
      {/* Royal Arena Floor */}
      <Suspense fallback={
        <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <boxGeometry args={[16, 16, 0.2]} />
          <meshStandardMaterial map={asphaltTexture} />
        </mesh>
      }>
        <primitive 
          object={arenaFloor.clone()} 
          scale={[3, 1, 3]} 
          position={[0, 0, 0]}
          receiveShadow
          castShadow
        />
      </Suspense>
      
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
      
      {/* Medieval sky dome for royal battle atmosphere */}
      <mesh position={[0, 0, 0]} scale={[50, 50, 50]}>
        <sphereGeometry args={[1, 32, 16]} />
        <meshBasicMaterial 
          color="#4169e1" 
          side={THREE.BackSide}
          transparent
          opacity={0.4}
        />
      </mesh>
      
      {/* Castle Walls Background */}
      <Suspense fallback={null}>
        <primitive 
          object={castleWalls.clone()} 
          scale={[4, 4, 4]} 
          position={[0, 0, -20]}
          castShadow
        />
      </Suspense>
      
      {/* Additional castle walls around the arena */}
      <Suspense fallback={null}>
        <primitive 
          object={castleWalls.clone()} 
          scale={[4, 4, 4]} 
          position={[20, 0, 0]}
          rotation={[0, Math.PI / 2, 0]}
          castShadow
        />
      </Suspense>
      
      <Suspense fallback={null}>
        <primitive 
          object={castleWalls.clone()} 
          scale={[4, 4, 4]} 
          position={[-20, 0, 0]}
          rotation={[0, -Math.PI / 2, 0]}
          castShadow
        />
      </Suspense>
      
      <Suspense fallback={null}>
        <primitive 
          object={castleWalls.clone()} 
          scale={[4, 4, 4]} 
          position={[0, 0, 20]}
          rotation={[0, Math.PI, 0]}
          castShadow
        />
      </Suspense>

      {/* Tournament Pavilions */}
      <Suspense fallback={null}>
        <primitive 
          object={tournamentPavilions.clone()} 
          scale={[2, 2, 2]} 
          position={[15, 0, 15]}
          castShadow
        />
      </Suspense>
      
      <Suspense fallback={null}>
        <primitive 
          object={tournamentPavilions.clone()} 
          scale={[2, 2, 2]} 
          position={[-15, 0, 15]}
          rotation={[0, -Math.PI / 2, 0]}
          castShadow
        />
      </Suspense>
      
      <Suspense fallback={null}>
        <primitive 
          object={tournamentPavilions.clone()} 
          scale={[2, 2, 2]} 
          position={[15, 0, -15]}
          rotation={[0, Math.PI / 2, 0]}
          castShadow
        />
      </Suspense>
      
      <Suspense fallback={null}>
        <primitive 
          object={tournamentPavilions.clone()} 
          scale={[2, 2, 2]} 
          position={[-15, 0, -15]}
          rotation={[0, Math.PI, 0]}
          castShadow
        />
      </Suspense>

      {/* Cheering Crowd in Stands */}
      <Suspense fallback={null}>
        <primitive 
          object={cheeringCrowd.clone()} 
          scale={[1.5, 1.5, 1.5]} 
          position={[0, 3, -16]}
          castShadow
        />
      </Suspense>
      
      <Suspense fallback={null}>
        <primitive 
          object={cheeringCrowd.clone()} 
          scale={[1.5, 1.5, 1.5]} 
          position={[16, 3, 0]}
          rotation={[0, -Math.PI / 2, 0]}
          castShadow
        />
      </Suspense>
      
      <Suspense fallback={null}>
        <primitive 
          object={cheeringCrowd.clone()} 
          scale={[1.5, 1.5, 1.5]} 
          position={[-16, 3, 0]}
          rotation={[0, Math.PI / 2, 0]}
          castShadow
        />
      </Suspense>
      
      <Suspense fallback={null}>
        <primitive 
          object={cheeringCrowd.clone()} 
          scale={[1.5, 1.5, 1.5]} 
          position={[0, 3, 16]}
          rotation={[0, Math.PI, 0]}
          castShadow
        />
      </Suspense>
      
      {/* Royal tournament banners at corners */}
      {[
        [12, 12], [-12, 12], [12, -12], [-12, -12]
      ].map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          {/* Banner pole */}
          <mesh position={[0, 4, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.1, 0.1, 8]} />
            <meshStandardMaterial color="#8B4513" />
          </mesh>
          {/* Royal banner */}
          <mesh position={[0.5, 6, 0]} castShadow>
            <planeGeometry args={[1.5, 2]} />
            <meshStandardMaterial 
              color={i % 2 === 0 ? "#4169e1" : "#dc143c"} 
              transparent 
              opacity={0.9}
            />
          </mesh>
        </group>
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
