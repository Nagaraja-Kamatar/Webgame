import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useGameState } from "../../lib/stores/useGameState";
import { useAudio } from "../../lib/stores/useAudio";
import { checkSphereCollision, keepInBounds, resolveCollision } from "../../lib/collision";

interface PlayerProps {
  playerId: 1 | 2;
}

export default function Player({ playerId }: PlayerProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { players, updatePlayerPosition, updatePlayerVelocity, incrementScore, lastCollision, setLastCollision, gamePhase } = useGameState();
  const { playHit } = useAudio();
  const [subscribe, get] = useKeyboardControls();
  
  // Load the appropriate avatar model based on player ID
  const avatarPath = playerId === 1 ? "/models/player1_avatar.glb" : "/models/player2_avatar.glb";
  const { scene } = useGLTF(avatarPath);
  
  const player = players[playerId];
  const otherPlayer = players[playerId === 1 ? 2 : 1];
  
  const velocity = useRef(new THREE.Vector3(...player.velocity));
  const position = useRef(new THREE.Vector3(...player.position));
  
  // Movement parameters
  const moveSpeed = 0.15;
  const friction = 0.85;
  const arenaCenter = new THREE.Vector3(0, 0.5, 0);
  const arenaRadius = 7.5;
  const playerRadius = 0.8; // Slightly larger for avatar collision
  
  useEffect(() => {
    // Reset position when game restarts
    position.current.set(...player.position);
    velocity.current.set(...player.velocity);
    if (groupRef.current) {
      groupRef.current.position.copy(position.current);
    }
  }, [player.position, gamePhase]);

  useFrame((state) => {
    if (!groupRef.current || gamePhase !== 'playing') return;
    
    const controls = get();
    const currentTime = state.clock.getElapsedTime();
    
    // Get input based on player ID
    let moveX = 0;
    let moveZ = 0;
    
    if (playerId === 1) {
      if (controls.p1Left) moveX -= 1;
      if (controls.p1Right) moveX += 1;
      if (controls.p1Forward) moveZ -= 1;
      if (controls.p1Backward) moveZ += 1;
    } else {
      if (controls.p2Left) moveX -= 1;
      if (controls.p2Right) moveX += 1;
      if (controls.p2Forward) moveZ -= 1;
      if (controls.p2Backward) moveZ += 1;
    }
    
    // Apply movement
    velocity.current.x += moveX * moveSpeed;
    velocity.current.z += moveZ * moveSpeed;
    
    // Apply friction
    velocity.current.multiplyScalar(friction);
    
    // Update position
    position.current.add(velocity.current);
    
    // Keep player in arena bounds
    position.current = keepInBounds(position.current, arenaCenter, arenaRadius, playerRadius);
    
    // Check collision with other player
    const otherPosition = new THREE.Vector3(...otherPlayer.position);
    const collision = checkSphereCollision(position.current, playerRadius, otherPosition, playerRadius);
    
    if (collision.collided && currentTime - lastCollision > 0.5) {
      // Play hit sound
      playHit();
      
      // Resolve collision
      const otherVelocity = new THREE.Vector3(...otherPlayer.velocity);
      const { vel1: newVel1, vel2: newVel2 } = resolveCollision(
        position.current,
        velocity.current,
        1, // mass
        otherPosition,
        otherVelocity,
        1, // mass
        0.9 // restitution
      );
      
      // Apply new velocities
      velocity.current.copy(newVel1);
      
      // Separate players to prevent overlap
      if (collision.normal && collision.penetration) {
        const separation = collision.normal.clone().multiplyScalar(collision.penetration * 0.5);
        position.current.sub(separation);
      }
      
      // Award point to the player who initiated the collision (higher velocity)
      const vel1Magnitude = velocity.current.length();
      const vel2Magnitude = otherVelocity.length();
      
      if (vel1Magnitude > vel2Magnitude + 0.1) {
        incrementScore(playerId);
      } else if (vel2Magnitude > vel1Magnitude + 0.1) {
        incrementScore(playerId === 1 ? 2 : 1);
      }
      
      setLastCollision(currentTime);
    }
    
    // Update group position
    groupRef.current.position.copy(position.current);
    
    // Update game state
    updatePlayerPosition(playerId, [position.current.x, position.current.y, position.current.z]);
    updatePlayerVelocity(playerId, [velocity.current.x, velocity.current.y, velocity.current.z]);
  });

  // Clone the scene to avoid sharing between instances
  const clonedScene = scene.clone();
  
  // Scale the avatar appropriately for the game
  clonedScene.scale.setScalar(2.5);
  
  // Ensure the avatar has proper materials and colors
  clonedScene.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.castShadow = true;
      child.receiveShadow = true;
      
      // Apply player color tint to the materials
      if (child.material) {
        const material = child.material.clone();
        if (material instanceof THREE.MeshStandardMaterial) {
          // Tint the material with player color
          const playerColorHex = new THREE.Color(player.color);
          material.emissive = playerColorHex;
          material.emissiveIntensity = 0.3;
        }
        child.material = material;
      }
    }
  });

  return (
    <group ref={groupRef} position={player.position}>
      <primitive object={clonedScene} />
    </group>
  );
}
