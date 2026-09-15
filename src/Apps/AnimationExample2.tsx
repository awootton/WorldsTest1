import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
// import { GLTFExporter } from 'three-examples-ts'; // or 'three/examples/jsm/exporters/GLTFExporter.js'

import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';

// This is tsx from google search: "three.js export gltf with animation example"


export function AnimationExampleSceneExport() {
    const groupRef = useRef<THREE.Group>(null);
    const rotatingCubeRef = useRef<THREE.Mesh>(null);

       const listSize = 2 // quaternions will make a small move.
       // does it need to circleback?

    const times = [0, 10]; // 10 seconds (seconds) animation

       // const angles = THREE.Quaternion[]
        
        const listOfAngles: THREE.Quaternion[] = [];
            for (let i = 0; i < listSize; i++) {
            const angle = (i / (times.length - 1)) * Math.PI * 1;
            listOfAngles.push(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), angle));
        }
        // now we have 12 nice angles in some nice circles.
        // Let's flatten them into a list of floats for the keyframe track.
        const qList: number[] = [];
        for (const q of listOfAngles) {
            qList.push(q.x, q.y, q.z, q.w);
        }
        
        // const qInitial = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0);
        // const qFinal1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI * 2 / 3); // 120 degrees rotation
        // const qFinal2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI * 4 / 3); // 240 degrees rotation
 
        // one assumes these must match,

    const exportGLB = () => {
        if (!groupRef.current) return;

        // 1. Define explicit rotation keyframes for the named mesh (above)


        const track = new THREE.QuaternionKeyframeTrack(
            'rotatingCube.quaternion',
            times,
            qList,
        );

        const clip = new THREE.AnimationClip('SpinAction', 10, [track]);
        const exporter = new GLTFExporter();

        exporter.parse(
            groupRef.current,
            (gltf) => {
                const blob = new Blob([gltf as ArrayBuffer], { type: 'application/octet-stream' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = 'animated-cubes.glb';
            
                link.click();
            },
            (error) => console.error('An error occurred:', error),
            { binary: true, animations: [clip] }
        );
    };

    function InCanvasPart() {

        // Update loop for preview
        useFrame((_, delta) => {
            if (rotatingCubeRef.current) {
                rotatingCubeRef.current.rotation.y += delta;
            }
        });

        return (<>
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 5, 5]} />
            <group ref={groupRef} scale={3}>
                <mesh ref={rotatingCubeRef} name="rotatingCube" position={[-1.5, 0, 0]}>
                    <boxGeometry />
                    <meshStandardMaterial color="orange" />
                </mesh>
                <mesh name="staticCube" position={[1.5, 0, 0]}>
                    <boxGeometry />
                    <meshStandardMaterial color="blue" />
                </mesh>
            </group>
        </>
        )
    }

    return (
        <>
            <button onClick={exportGLB} style={{ position: 'absolute', zIndex: 10 }}>Export GLB</button>
            <button onClick={exportGLB} style={{ position: 'absolute', zIndex: 40 }}>Import GLB</button>
            <Canvas>

                <InCanvasPart />

            </Canvas>
        </>
    );
}

