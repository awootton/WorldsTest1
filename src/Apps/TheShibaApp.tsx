
import { Canvas } from "@react-three/fiber";
import { Suspense, useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
// import { MainWorldDisplay } from "../MainWorldDisplay";
import { OrbitControls } from "@react-three/drei";
import { useTexture, useGLTF } from '@react-three/drei';
import { Scene } from "three";
import { pubsub } from "../index";
import * as messes from '../knotfree-ts-lib/3d/messageTypes';

import {Cmd_Lacky} from '../knotfree-ts-lib/avatars/Cmd_Lacky';
import {RPC_Gadget} from '../knotfree-ts-lib/avatars/RPC_Gadget';
import { AnythingToDomainName } from "../knotfree-ts-lib/avatars/testServermap";

// spinning duck

export function TheShibaApp() {

    const domainName = AnythingToDomainName(window.location.href); // this is the name of the master. It's the domain name.

    // window.location name will get you a better one.

    const master = domainName[0]


    console.log("master domain name for TheShibaApp :", master);


    const cmdr = new Cmd_Lacky();  
    const rpc = new RPC_Gadget(pubsub, master, master + "-island-centre",cmdr);
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
                <ShibaCanvas />
            </Canvas>
        </div>
    );
}


function ShibaCanvas() {

    const cubeRef = useRef<THREE.Mesh>(null);

    const { scene } = useGLTF("/shiba/scene.gltf");

    // const { scene } = useGLTF('Duck.glb');
    //   const { scene } = useGLTF('CommercialRefrigerator.glb');

    useFrame(() => {
        const cube = cubeRef.current;
        if (!cube) return;
        // cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        cube.scale.set(10, 10, 10);
    });

    return (<>
        <Suspense fallback={null}>

            <directionalLight position={[1, 1, 1]} intensity={0.8} />

            <pointLight position={[10, 10, 10]} />
            {/* <ambientLight intensity={0.5} /> */}

            <mesh ref={cubeRef}>
                <primitive object={scene} />
            </mesh>

        </Suspense>
    </>
    );

}