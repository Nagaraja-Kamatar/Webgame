import { useEffect } from "react";
import { useAudio } from "../../lib/stores/useAudio";

export default function SoundManager() {
  const { setHitSound, setSuccessSound, setDodgeSound } = useAudio();

  useEffect(() => {
    // Load hit sound
    const hitAudio = new Audio("/sounds/hit.mp3");
    hitAudio.preload = "auto";
    hitAudio.volume = 0.3;
    setHitSound(hitAudio);

    // Load success sound
    const successAudio = new Audio("/sounds/success.mp3");
    successAudio.preload = "auto";
    successAudio.volume = 0.5;
    setSuccessSound(successAudio);

    // Create dodge sound programmatically (swoosh effect)
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const dodgeBuffer = audioContext.createBuffer(1, audioContext.sampleRate * 0.2, audioContext.sampleRate);
    const data = dodgeBuffer.getChannelData(0);
    
    for (let i = 0; i < data.length; i++) {
      const t = i / audioContext.sampleRate;
      data[i] = Math.sin(440 * 2 * Math.PI * t * (1 - t * 5)) * Math.exp(-t * 15) * 0.3;
    }
    
    const createDodgeSound = () => {
      const source = audioContext.createBufferSource();
      const gainNode = audioContext.createGain();
      source.buffer = dodgeBuffer;
      source.connect(gainNode);
      gainNode.connect(audioContext.destination);
      gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
      return { play: () => source.start() };
    };

    const dodgeAudio = {
      currentTime: 0,
      volume: 0.4,
      play: () => Promise.resolve(createDodgeSound().play())
    } as HTMLAudioElement;

    setDodgeSound(dodgeAudio);

    console.log("Sound effects loaded");
  }, [setHitSound, setSuccessSound, setDodgeSound]);

  return null;
}
