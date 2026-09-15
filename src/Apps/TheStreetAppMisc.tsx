

import * as THREE from 'three';

import { Canvas } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useTexture, useGLTF } from '@react-three/drei';
import { Scene } from "three";


// just a simple courtyard with a cobblestone texture on the ground
// it's a link problem. get rid of it. 

export function XXTheStreetMisc() {

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
                <XXXStreetCanvas />
            </Canvas>
        </div>
    );
}


function XXXStreetCanvas() {

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

export function LinksToAll() {
    return (
        <>
            <a target="_" href="http://testmain-0n0u0e5p.zzz:4001">Go to testmain-0n0u0e5p courtyard</a>
            <br />
            <a target="_" href="http://testmain-2n0u4w2p.zzz:4002">Go to testmain-2n0u4w2p orange</a>
            <br />
            <a target="_" href="http://testmain-2n0u5w2p.zzz:4003">Go to testmain-2n0u5w2p duck</a>
            <br />
            <a target="_" href="http://testmain-2n0u7w2p.zzz:4004">Go to testmain-2n0u7w2p SevenWest</a>
            <br />
            <a target="_" href="http://testmain-1n0u10w4p.zzz:4005">Go to testmain-2n0u8w2p TheStreet</a>
            <br />
            <a target="_" href="http://testmain-0n1d0e9p.zzz:4006">Go to testmain-0n1d0e9p dirt</a>
        </>
    )
}