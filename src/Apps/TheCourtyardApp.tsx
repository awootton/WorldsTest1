

import * as THREE from 'three';

import { Canvas } from "@react-three/fiber";
import { Suspense, useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture, useGLTF } from '@react-three/drei';
import { Scene } from "three";

import { pubsub } from '../index';
import {Cmd_Lacky} from '../knotfree-ts-lib/avatars/Cmd_Lacky';
import {RPC_Gadget} from '../knotfree-ts-lib/avatars/RPC_Gadget';

// pubsub has a good name


// just a simple courtyard with a cobblestone texture on the ground

var replyCount = 0;// // ad hoc


export function TheCourtyardApp() {

    // We should register the listener for messages as an effect so it will clean up after itself when the component is unmounted. 
    // But for now, let's just log the messages and see what we get.
    // Since this is inside a iFrame it may load and unload.

    // Let's pretend that this is the only app here and we easily know the domain name and the master name
    // of the space.

    const cube = "testmain-0n0u0e5p";

    const cmdr = new Cmd_Lacky(); // I love it
    const rpc = new RPC_Gadget(pubsub, cube, cube + "-island-centre",cmdr);
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
                <CourtyardCanvas />
            </Canvas>
        </div>
    );
}

// we should try to make something in here and message it away to the parent window. 
// that's the plan.

function CourtyardCanvas() {

    const cubeRef = useRef<THREE.Mesh>(null);

    const texture = useTexture("/cobblestonesgrok512.jpg");

    useFrame(() => {
        const cube = cubeRef.current;
        if (!cube) return;
        // cube.rotation.x += 0.01;
        cube.rotation.y += 0.05 / 40;
        cube.rotation.x += 0.025 / 40;
        cube.scale.set(10, 10, 10);
    });

    return (<>
        <Suspense fallback={null}>

            <directionalLight position={[1, 1, 1]} intensity={0.8} />

            <pointLight position={[10, 10, 10]} />
            {/* <ambientLight intensity={0.5} /> */}

            <mesh ref={cubeRef}>
                <planeGeometry args={[10, 10]} />
                <meshStandardMaterial map={texture} side={THREE.DoubleSide} />
            </mesh>

        </Suspense>
    </>
    );

}