import { useRef } from "react";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

export default function Arena() {
  const meshRef = useRef<THREE.Mesh>(null);
  const asphaltTexture = useTexture("/textures/asphalt.png");
  
  // Configure texture
  asphaltTexture.wrapS = asphaltTexture.wrapT = THREE.RepeatWrapping;
  asphaltTexture.repeat.set(4, 4);

  return (
    <group>
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
      
      {/* Visual boundary ring */}
      <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[7.8, 8.2, 64]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.3} />
      </mesh>
      
      {/* Center circle */}
      <mesh position={[0, 0.11, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0, 1, 32]} />
        <meshBasicMaterial color="#ffff00" transparent opacity={0.2} />
      </mesh>
    </group>
  );
}
