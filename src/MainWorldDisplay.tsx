
import { Canvas, createRoot } from "@react-three/fiber";
import { Cube } from "./Cube";
import { OrbitControls } from "@react-three/drei";
import { Duck, StreetCenter, AnotherDuck, StreetCenter2 } from "./StreetCenter";
import { Suspense, useEffect } from "react";

// import { render } from '@react-three/offscreen';

// include this in a canvas in WorldApp, and it will display the street and the duck
// it should case on the cubeName and display the appropriate cube and BE the iFrame logic for that cube.

export function MainWorldDisplay() {

  const index = 0
  const markerSize = 0.5
  const color = 'red'
  const corners = [
    [0, 0, 0],
    [32, 0, 0],
    [32, 0, 32],
    [0, 0, 32]
  ]
  return (
     <>

      <StreetCenter />
      <StreetCenter2 />

      <mesh key={index} position={[4, 0, -8]}>
        <boxGeometry args={[markerSize * 0.8, markerSize * 0.8, markerSize * 0.8]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <Duck />
      <AnotherDuck />
      
    </>
  );
}
    
   