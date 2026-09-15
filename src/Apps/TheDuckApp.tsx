
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useRef } from "react"; import { MainWorldDisplay } from "../MainWorldDisplay";
import { useTexture, useGLTF } from '@react-three/drei';
import { Scene } from "three";

import { OrbitControls, useAnimations } from '@react-three/drei';
import {Cmd_Lacky} from '../knotfree-ts-lib/avatars/Cmd_Lacky';
import {RPC_Gadget} from '../knotfree-ts-lib/avatars/RPC_Gadget';
import { pubsub } from "../index";

// spinning duck

//  2n0u5w2p-The-Duck-App

export function TheDuckApp() {

    // set up the RPC and the commander with the least amount of fuss and muss and witcherery possible.

    const cmdr = new Cmd_Lacky(); // I love it
    const rpc = new RPC_Gadget(pubsub, "testmain-2n0u5w2p", "testmain-2n0u5w2p-island-centre",cmdr);
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
                <DuckCanvas />

                <OrbitControls />

            </Canvas>
        </div>
    );
}

function DuckCanvas() {

    const cubeRef = useRef<THREE.Mesh>(null);
    const group = useRef<THREE.Group>(null);

    // const { scene, animations } = useGLTF("/Duck.glb");
    const { scene, animations } = useGLTF("/animated-cubes (2).glb");

    useEffect(() => {

        // cmdr.set_command(
        //     // mom said anywhere? ~~~~````~~~~~ Right?
        // );

    }, [scene]);


    // Bind animations to the group reference
    // Bind animations to the group reference
    const { actions } = useAnimations(animations, group);

    useEffect(() => {
        // Play the first available animation action safely
        const actionName = Object.keys(actions)[0];
        if (actionName && actions[actionName]) {
            actions[actionName]?.reset().fadeIn(0.5).play();
        }

        // Clean up animation on unmount
        return () => {
            if (actionName && actions[actionName]) {
                actions[actionName]?.fadeOut(0.5);
            }
        };
    }, [actions]);

    // const { scene } = useGLTF('Duck.glb');
    //   const { scene } = useGLTF('CommercialRefrigerator.glb');

    // useFrame(() => {
    //     const cube = cubeRef.current;
    //     if (!cube) return;
    //     // cube.rotation.x += 0.01;
    //     cube.rotation.y += 0.01;
    //     cube.scale.set(10, 10, 10);
    // });

    return (<>
        <Suspense fallback={null}>

            <directionalLight position={[1, 1, 1]} intensity={0.8} />

            <pointLight position={[10, 10, 10]} />
            {/* <ambientLight intensity={0.5} /> */}

            <mesh ref={cubeRef} scale={4}>
                <primitive object={scene} />
            </mesh>

        </Suspense>
    </>
    );

}