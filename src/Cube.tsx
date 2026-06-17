import { useFrame } from "@react-three/fiber";
import { FC, useRef } from "react";
import type { Mesh } from "three";

export const Cube: FC = () => {
  const cubeRef = useRef<Mesh>(null);
  useFrame(() => {
    const cube = cubeRef.current;
    if (!cube) return;
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
  });

  var cubeColor = "aqua";
  if ( window.location.href.includes('offscreen-canvas-demo=')) {
    cubeColor = "purple";
  }

  return (
    <mesh ref={cubeRef}>
      <boxBufferGeometry args={[.85, .85, .85]} />
      <meshPhongMaterial color={cubeColor} />
    </mesh>
  );
};
