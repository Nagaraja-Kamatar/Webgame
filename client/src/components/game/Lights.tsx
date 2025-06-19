export default function Lights() {
  return (
    <>
      {/* Ambient light for overall illumination */}
      <ambientLight intensity={0.4} />
      
      {/* Main directional light with shadows */}
      <directionalLight
        position={[10, 15, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      
      {/* Point light above the arena */}
      <pointLight
        position={[0, 10, 0]}
        intensity={0.8}
        color="#ffffff"
        castShadow
      />
      
      {/* Colored rim lights for atmosphere */}
      <pointLight
        position={[-8, 3, 0]}
        intensity={0.3}
        color="#4caf50"
      />
      
      <pointLight
        position={[8, 3, 0]}
        intensity={0.3}
        color="#f44336"
      />
    </>
  );
}
