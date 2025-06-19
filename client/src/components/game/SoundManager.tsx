import { useEffect } from "react";
import { useAudio } from "../../lib/stores/useAudio";

export default function SoundManager() {
  const { setHitSound, setSuccessSound } = useAudio();

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

    console.log("Sound effects loaded");
  }, [setHitSound, setSuccessSound]);

  return null;
}
