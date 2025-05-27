// AudioSphere.tsx
import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";

interface AudioSphereProps {
  isSpeaking: boolean;
}

const AudioSphere: React.FC<AudioSphereProps> = ({ isSpeaking }) => {
  const meshRef = useRef<any>();

  useFrame((state) => {
    if (meshRef.current) {
      if (isSpeaking) {
        // Create a pulsating effect using sine wave timing
        const pulsate = 0.2 * Math.sin(state.clock.elapsedTime * 10);
        const scale = 1 + pulsate;
        meshRef.current.scale.set(scale, scale, scale);
      } else {
        // Default scale when not speaking
        meshRef.current.scale.set(1, 1, 1);
      }
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color="#00d0ff" emissive="#00d0ff" />
    </mesh>
  );
};

export default AudioSphere;
