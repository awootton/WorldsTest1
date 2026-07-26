import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';
import { CylinderGeometry, Group } from 'three';
import React, { useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';

import { useFrame } from "@react-three/fiber";

const exportGroupToBlob = (groupRef: React.RefObject<Group | null>): Promise<Blob> => {

  return new Promise((resolve, reject) => {
    if (!groupRef.current) {
      reject(new Error("Group reference is not attached."));
      return;
    }

    const exporter = new GLTFExporter();
    exporter.parse(
      groupRef.current,
      (gltf) => {
        // Create a binary Blob if gltf is an ArrayBuffer (binary GLB)
        const blob = new Blob([gltf as ArrayBuffer], { type: 'model/gltf-binary' });
        resolve(blob);
      },
      (error) => {
        reject(error);
      },
      { binary: true }
    );
  });
};


export function CylinderCanvas() {

  const CylinderScene = () => {

    const cubeRef = useRef<THREE.Mesh>(null);
    const groupRef = useRef<Group>(null);

    useEffect(() => {
      // This effect runs once when the component mounts

      // handleDownload()

    }, []);

    useFrame(() => {
      const cube = cubeRef.current;
      if (!cube) return;
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      cube.scale.set(1, 1, 1);
    });

    const handleDownload = async () => {
      try {
        const blob = await exportGroupToBlob(groupRef);

        // Create a temporary URL and trigger a download
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'cylinders.glb';
        link.click();

        URL.revokeObjectURL(url); // Clean up
      } catch (error) {
        console.error('Failed to export GLB:', error);
      }
    };

    return (
      <>
        <group ref={groupRef}>
          <directionalLight position={[1, 1, 1]} intensity={0.8} />
          <mesh position={[-2, 0, 0]}>
            <cylinderGeometry args={[1, 1, 1, 32]} />
            <meshStandardMaterial color="orange" />
          </mesh>
          <mesh ref={cubeRef} position={[0, 0, 0]}>
            <cylinderGeometry args={[1, 1, 1, 32]} />
            <meshStandardMaterial color="hotpink" />
          </mesh>
          <mesh position={[2, 0, 0]}>
            <cylinderGeometry args={[1, 1, 1, 32]} />
            <meshStandardMaterial color="teal" />
          </mesh>
        </group>

      </>
    );
  };


  return (
    <div
      className="App"
      style={{
        height: "100vh",
        width: "100vw"
      }}
    >
      <Canvas
        id="canvas"
        camera={{
          near: 0.1,
          far: 1000,
          zoom: 1,
          position: [0, 1.75, 25]
        }}
      >
        <CylinderScene />

      </Canvas>

      {/* <button onClick={doDownload} style={{ position: 'absolute', top: 20, left: 20 }}>
        Export GLB
      </button> */}
    </div>
  );


}

