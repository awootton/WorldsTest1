

import * as THREE from 'three';

import { useEffect } from "react";

import { Canvas, useFrame } from "@react-three/fiber";
import type { RootState } from "@react-three/fiber";

import { OrbitControls } from '@react-three/drei';
import { Perf } from 'r3f-perf'
import { pubsub } from '../index';

import {Cmd_Lacky} from '../knotfree-ts-lib/avatars/Cmd_Lacky';
import {RPC_Gadget} from '../knotfree-ts-lib/avatars/RPC_Gadget';


function createParticleSystem(scene: THREE.Scene): [THREE.Scene, THREE.Points, () => void] {

    // 1. Create geometry and add random vertex positions
    const particleCount = 500; // can easily go 8x higher
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {

        const y = Math.random() * 10; // Spread particles above the ground
        const x = (Math.random() - 0.5) * .5; // Spread particles in X direction
        const z = (Math.random() - 0.5) * .5; // Spread particles in Z direction

        positions[0 + i * 3] = x * y;
        positions[1 + i * 3] = y;
        positions[2 + i * 3] = z * y;
    }

    // for (let i = 0; i < particleCount * 3; i++) {
    //     positions[i] = (Math.random() - 0.5) * 10; // Spread particles above the ground
    // }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // 2. Create standard particle material
    const material = new THREE.PointsMaterial({
        size: 0.05,
        color: 0xff0000, // red, //0xffffff,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending, // Makes overlapping particles brighter
        depthWrite: false                 // Prevents particles from blocking each other
    });

    // 3. Combine into Points and add to scene
    const particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);

    // 4. Animate inside your render loop
    function animate() {
        // requestAnimationFrame(animate);

        // Rotate the whole particle system
        particleSystem.rotation.y += 0.002;

        // renderer.render(scene, camera);
    }
    // Add custom time uniform to pass into the shader
    const customUniforms = {
        uTime: { value: 0 },
        uSize: { value: 30.0 }
    };

    const shaderMaterial = new THREE.ShaderMaterial({
        uniforms: customUniforms,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexShader: `
        uniform float uTime;
        uniform float uSize;
        void main() {
            vec3 pos = position;
            
            // Create a wave effect based on time and position
            pos.y += sin(pos.x * 2.0 + uTime) * 0.5;
            
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_Position = projectionMatrix * mvPosition;
            
            // Size attenuation (particles get smaller further away)
            gl_PointSize = uSize * (1.0 / -mvPosition.z);
        }
    `,
        fragmentShader: `
        void main() {
            // Make particles round instead of square box
            float strength = distance(gl_PointCoord, vec2(0.5));
            strength = 1.0 - strength;
            strength = pow(strength, 3.0); // Soft edge glow
            
            gl_FragColor = vec4(vec3(0.0, 0.8, 1.0) * strength, strength);
        }
    `
    });

    const advancedParticles = new THREE.Points(geometry, shaderMaterial);
    scene.add(advancedParticles);

    // In your animation loop:
    // customUniforms.uTime.value = clock.getElapsedTime();

    return [scene, particleSystem, animate];
}

export function TheParticleDemoApp() {

    const [scene, particleSystem, animate] = createParticleSystem(new THREE.Scene());

    const size = 20.0; // Set the size of the particle system

    const targetPosition = new THREE.Vector3(0, 0, 0); // Set the target position for OrbitControls

    const cube = "testmain-2n0u7w2p";  
    const cmdr = new Cmd_Lacky(); // I love it
    const rpc = new RPC_Gadget(pubsub,cube,cube + "-island-centre",cmdr);
    // useEffect(() => {
    //     console.log("subscribing to our channel:", rpc.GetOurChannelName(), "to ", pubsub.getDebugName());
    //     pubsub.subscribe(rpc.GetOurChannelName(), "", false, (cmd: any, err: Error) => {
    //         rpc.ProcessCommand(cmd, err);
    //     });
    // }, []); // empty dependency array means this effect runs once on mount and cleans up on unmount is that right?  yes.  see https://react.dev/reference/react/useEffect



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


                <ambientLight intensity={0.5} />
                <directionalLight position={[5, 10, 7.5]} intensity={1} />

                <Perf position="bottom-right" minimal />

                <mesh position={[0, 0, 0]}>
                    <boxGeometry args={[0.05, 0.5, 0.05]} />
                    <meshStandardMaterial color="#ff0000" />
                </mesh>

                <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <planeGeometry args={[4, 4]} />
                    <meshStandardMaterial color="white" />
                </mesh>

                <OrbitControls
                    target={targetPosition}
                    enableDamping={true} // Smooth stopping momentum
                    dampingFactor={0.05}
                    maxDistance={10 * size}     // Limit how far user can zoom out
                    minDistance={0.5 * size}      // Limit how far user can zoom in
                    maxPolarAngle={Math.PI / 2} // Prevent looking underneath the ground
                />

                <TheParticleDemoAppCanvas scene={scene} particleSystem={particleSystem} animate={animate} />

            </Canvas>
        </div>
    );
}

export function TheParticleDemoAppCanvas({ scene, particleSystem, animate }:
    {
        scene: THREE.Scene; particleSystem: THREE.Points;
        animate: () => void
    }) {


    useFrame((state: RootState, delta: number) => {
        // Update the time uniform for the shader
        animate();
    });

    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <primitive object={scene} />
        </mesh>

    );
}


