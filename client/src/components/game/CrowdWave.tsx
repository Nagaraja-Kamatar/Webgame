import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useGameState } from "../../lib/stores/useGameState";

interface CrowdWaveProps {
  crowdPositions: Array<{
    position: [number, number, number];
    crowdId: string;
  }>;
}

export default function CrowdWave({ crowdPositions }: CrowdWaveProps) {
  const { gamePhase, players, lastCollision } = useGameState();
  const waveState = useRef({
    activeWave: false,
    waveStartTime: 0,
    waveDirection: 1,
    lastScore: { p1: 0, p2: 0 },
    waveOrigin: [0, 0, 0] as [number, number, number]
  });

  useEffect(() => {
    // Trigger wave when score changes
    const currentScores = { p1: players[1].score, p2: players[2].score };
    
    if (currentScores.p1 > waveState.current.lastScore.p1 || 
        currentScores.p2 > waveState.current.lastScore.p2) {
      
      // Start a crowd wave
      waveState.current.activeWave = true;
      waveState.current.waveStartTime = Date.now();
      waveState.current.waveDirection = Math.random() > 0.5 ? 1 : -1;
      
      // Random wave origin point
      const randomOrigin = crowdPositions[Math.floor(Math.random() * crowdPositions.length)];
      waveState.current.waveOrigin = randomOrigin.position;
    }
    
    waveState.current.lastScore = currentScores;
  }, [players, crowdPositions]);

  useFrame(() => {
    if (!waveState.current.activeWave || gamePhase !== 'playing') return;
    
    const currentTime = Date.now();
    const waveAge = (currentTime - waveState.current.waveStartTime) / 1000; // in seconds
    
    // Wave lasts for 8 seconds
    if (waveAge > 8) {
      waveState.current.activeWave = false;
      return;
    }
    
    // Calculate wave propagation
    const waveSpeed = 5; // units per second
    const waveRadius = waveAge * waveSpeed;
    
    // Apply wave effect to each crowd section
    crowdPositions.forEach((crowdPos, index) => {
      const distance = new THREE.Vector3(...crowdPos.position)
        .distanceTo(new THREE.Vector3(...waveState.current.waveOrigin));
      
      // Check if wave has reached this crowd section
      const timeDiff = distance / waveSpeed;
      const localWaveAge = waveAge - timeDiff;
      
      if (localWaveAge > 0 && localWaveAge < 2) { // Wave effect lasts 2 seconds per section
        // Find crowd element and apply wave animation
        const crowdElement = document.querySelector(`[data-crowd-id="${crowdPos.crowdId}"]`);
        if (crowdElement) {
          const intensity = Math.sin(localWaveAge * Math.PI) * 0.5; // Sine wave for smooth animation
          
          // Apply transform through CSS for performance
          const transform = `translateY(${intensity * 20}px) scale(${1 + intensity * 0.1})`;
          (crowdElement as HTMLElement).style.transform = transform;
        }
      }
    });
  });

  return null; // This component only manages state and animations
}