

import * as THREE from 'three';

import { Canvas } from "@react-three/fiber";
import { Suspense, useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useTexture, useGLTF } from '@react-three/drei';
import { Scene } from "three";

import * as messes from "../knotfree-ts-lib/3d/messageTypes";


// if (window.addEventListener) {
//     // For standards-compliant web browsers
//     window.addEventListener("message", gotMessage, false);
// }

// function gotMessage(event: MessageEvent) {

//     // they say we're supposed to watch the origin, but for now, let's just log it and see what we get

//     console.log("Worlds test courtyard Received message:", event.data, event.origin, event.source);

//     // sending ping back to the parent window

//     console.log("Sending pong back to parent window");
//     event.source?.postMessage("pong");
// }

// window.addEventListener("message", (event) => {

//   // SECURITY STEP: Always verify the sender's origin!
//   if (event.origin !== "https://parent-domain.com") {
//     return; // Reject messages from untrusted domains
//   }

//   // Handle the received data
//   console.log("Message received from parent:", event.data);

//   // Custom logic based on the message content
//   if (event.data.type === "changeColor") {
//     document.body.style.backgroundColor = event.data.color;
//   }
// });


// just a simple courtyard with a cobblestone texture on the ground

var replyCount = 0;// // ad hoc


// TheCourtyardApp got message Data from parent: {type: 'TEST_MESSAGE', content: 'Hello from parent! to framethis is coming from master: testmain-0n0u0e5p.vr'}content: "Hello from parent! to framethis is coming from master: testmain-0n0u0e5p.vr"type: "TEST_MESSAGE"[[Prototype]]: Object http://localhost:3020 


// TheCourtyardApp got message Data from parent: courtyard says right back at ya http://localhost:3010 Window {window: Window, self: Window, document: document, name: '', location: Location, …}
// PubSubSimple.tsx:46 



export function TheCourtyardApp() {

    // We should register the listener for messages as an effect so it will clean up after itself when the component is unmounted. 
    // But for now, let's just log the messages and see what we get.
    // Since this is inside a iFrame it may load and unload.

    const handleMessage = (event: MessageEvent<any>) => {

        const request = messes.ensureMessageBaseClass(event.data)
        if (!request) {
            // bite me: console.warn("TheCourtyardApp received a message that is not a valid MessageBaseClass:", event.data);
            return; // Not a valid MessageBaseClass, ignore
        }

        if (replyCount > 10) {
            return; // don't reply more than 10 times, just in case.
        }
        replyCount += 1;

        //       TheCourtyardApp got message Data from parent: courtyard says right back at ya http://localhost:3010 

        // We're supposed to check that we only get messages from gotohere but that would lock out all
        // the other possible people who want to write Metaverse apps. Not good.

        // SECURITY STEP: Replace with your actual trusted parent domain
        //   const trustedOrigin = "https://parent-domain.com";
        //   if (event.origin !== trustedOrigin) return;

        // Process the incoming data - we don't reply.
        console.log("TheCourtyardApp got message Data from parent:", event.data, event.origin, event.source);
        // setParentData(event.data);
        const reply = "courtyard says right back at ya";
        const options = { targetOrigin: event.origin }; // Specify the target origin for security
        // event.source?.postMessage(reply,options);
    };

    useEffect(() => {

        // Add listener on mount
        window.addEventListener("message", handleMessage);

        // Clean up listener on unmount to prevent memory leaks
        return () => window.removeEventListener("message", handleMessage);
    }, []); // Empty array ensures this runs once on mount

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

// we should try to make a glb blog in here and message it away to the parent window. 
// that's the plan.

function CourtyardCanvas() {

    const cubeRef = useRef<THREE.Mesh>(null);

    const texture = useTexture("/cobblestonesgrok512.jpg");

    useFrame(() => {
        const cube = cubeRef.current;
        if (!cube) return;
        // cube.rotation.x += 0.01;
        cube.rotation.y += 0.05;
        cube.rotation.x += 0.025;
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