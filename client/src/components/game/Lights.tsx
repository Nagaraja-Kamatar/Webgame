export default function Lights() {
  return (
    <>
      {/* Ambient light for overall illumination */}
      <ambientLight intensity={0.6} />
      
      {/* Main directional light with shadows */}
      <directionalLight
        position={[15, 20, 10]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={100}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
      />
      
      {/* Point light above the arena */}
      <pointLight
        position={[0, 15, 0]}
        intensity={0.6}
        color="#ffffff"
        castShadow
      />
      
      {/* Colored rim lights for atmosphere */}
      <pointLight
        position={[-12, 5, 0]}
        intensity={0.4}
        color="#4caf50"
      />
      
      <pointLight
        position={[12, 5, 0]}
        intensity={0.4}
        color="#f44336"
      />
      
      {/* Fill lights to reduce harsh shadows */}
      <pointLight
        position={[0, 8, 15]}
        intensity={0.3}
        color="#ffffff"
      />
      
      <pointLight
        position={[0, 8, -15]}
        intensity={0.3}
        color="#ffffff"
      />
    </>
  );
}
