

import * as THREE from 'three';

import { Canvas } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useTexture, useGLTF } from '@react-three/drei';
import { Scene } from "three";


// just a simple courtyard with a cobblestone texture on the ground

export function TheStreetApp() {


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
                <StreetCanvas />
            </Canvas>
        </div>
    );
}


function StreetCanvas() {

    const cubeRef = useRef<THREE.Mesh>(null);

    const texture = useTexture("/street.jpg");

    useFrame(() => {
        const cube = cubeRef.current;
        if (!cube) return;
        // cube.rotation.x += 0.01;
        cube.rotation.y += 0.05;
        cube.scale.set(10, 10, 10);
    });

    return (<>
        <Suspense fallback={null}>

            <directionalLight position={[1, 1, 1]} intensity={0.8} />

            <pointLight position={[10, 10, 10]} />
            {/* <ambientLight intensity={0.5} /> */}

            <mesh ref={cubeRef}>
                <planeGeometry args={[1, 1]} />
                <meshStandardMaterial map={texture} side={THREE.DoubleSide} />
            </mesh>

        </Suspense>
    </>
    );

}