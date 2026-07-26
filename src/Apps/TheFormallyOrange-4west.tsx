
import { Canvas, RootState, useThree } from "@react-three/fiber";
import { Suspense, useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { MainWorldDisplay } from "../MainWorldDisplay";
import { OrbitControls } from "@react-three/drei";
import { useTexture, useGLTF } from '@react-three/drei';
import { Group, Scene } from "three";
import * as messes from "../knotfree-ts-lib/3d/messageTypes";
import * as utils from "../knotfree-ts-lib/3d/utils";


import * as THREE from 'three';
import { GLTFExporter, GLTFExporterOptions } from 'three/examples/jsm/exporters/GLTFExporter.js';


// testmain-2n0u4w2p is the correct name. 

export function TheFormallyOrange4WestApp() {

    // http://localhost:3010/?domain=testmain-2n0u4w2p.vr&asset=undefined&type=undefined
    // or, could be https://testmain-2n0u4w2p.xyz
    // or, could be http://testmain-2n0u4w2p_vr.knotfree

    const [domainName, err] = utils.FindDomainName(window.location.hostname, window.location.search);
    if (err) {
        console.log("TheFormallyOrange4WestApp FindDomainName error: " + err.message);
        return (<div style={{
            fontSize: "8px"
        }}>FindDomainName Error {err.message}</div>);
    }
    const master = domainName; // "testmain-2n0u4w2p"; // this is the name of the master. It's the domain name.

    console.log("TheFormallyOrange4WestApp has loaded:", domainName);

    // We have to pretend that we've just now loaded.
    // Even though the splitter just derived the name we have to do it again.
    // In reality it's just request.hostname.


    // it's in the URL. It IS the Domain name, 
    // const urlParams = new URLSearchParams(window.location.search);
    // const domainName = urlParams.get("domain");
    // or it mught just be localhost:3010
    // is it 


    // auxLeafData has my name.
    const [auxLeafData, setAuxLeafData] = useState<any>(null);

    // these are supposedly all the messages for this entire iFrame app
    const handleMessageOrangeWest = (event: MessageEvent<any>) => {


        console.log("TheFormallyOrange4WestApp got message Data from parent:", event.data, event.origin, event.source);

        // We're supposed to check that we only get messages from gotohere but that would lock out all
        // the other possible people who want to write Metaverse appa from also running 
        // this app and also ending the same messages and basically working. Not good.
        // but I don't look at it then I have see: {source: 'react-devtools-bridge'
        // and type: 'webpackInvalid'
        // how do I get rid of those?

        // SECURITY STEP: Replace with your actual trusted parent domain
        //   const trustedOrigin = "https://parent-domain.com";
        //   if (event.origin !== trustedOrigin) return;
        // this isn't going to work I don't think. 
        const trustedList = new Set<string>([
            "https://gotohere.com",
            "https://gotohere.org",
            "http://localhost:3020",
            "http://localhost:3010"
        ]);
        // this is localhost dev mode. What's going to break when in prod when 
        // these static react apps are coming from CND networks and not localhost?
        // I'm going to turn this off is what's going to happen. I ton't have time for this crap.
        if (!trustedList.has(event.origin)) {
            console.warn("TheFormallyOrange4WestApp received a message from an untrusted origin:", event.origin);
            return;
        }

        if (event.source === null) {
            console.warn("TheFormallyOrange4WestApp received a message with no source:", event);
            return;
        }

        if (!messes.ensureMessageBaseClass(event.data)) {
            return; // Not a valid MessageBaseClass, ignore. It's not from us.
        }
        const request = event.data as messes.MessageBaseClass;

        // Process the incoming data
        console.log("TheFormallyOrange4WestApp got message Data from parent:", event.data, event.origin, event.source);
        // setParentData(event.data);

        // We MUST parse the message for meaning now.
        // and generate the right response. 

        if (request.type === "Greetings") {
            const greetingsMessage = event.data as messes.Greetings;
            console.log("TheFormallyOrange4WestApp received Greetings message:", greetingsMessage.message);
            //setAuxLeafData(greetingsMessage.auxLeafStatus);

            // we should send a reply back to the parent to acknowledge receipt of the message - na. 
            // this is not the internet. 
            // how do we pause the animation, or force it so it will make the BLB we want

            // how do I do this? now?  renderer.render(scene, camera);
            // try this later  DrawOnceAndStop()
        }

        // this will be more fun when we can recognize this as an avatar move request and then we can push a ghost around.

        // let's send them a glb of the scene., once. later.

        // note how it falls on the floor. We need some subscribers in here.

        // TODO: Fixme: put a pubsub in here and deal with reality.

    };

    function XXDrawOnceAndStop() {
        // This function will render the scene once and then stop the animation loop. Doesn't work.
        const { gl, scene, camera } = useThree();

        // Render the scene once
        gl.render(scene, camera);

        // Stop the animation loop
        gl.setAnimationLoop(null);
    }

    useEffect(() => {
        // Add listener on mount
        window.addEventListener("message", handleMessageOrangeWest);
        // Clean up listener on unmount to prevent memory leaks
        return () => window.removeEventListener("message", handleMessageOrangeWest);
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

                <OrbitControls
                    enableDamping={true}
                    enableZoom={true}
                    enablePan={true}
                    rotateSpeed={0.5}
                    zoomSpeed={0.5}
                    panSpeed={0.5}
                    dampingFactor={0.1}
                    makeDefault={true}
                    target={[0, 0, 0]}
                    maxDistance={100}
                />

                <TheCanvasContents />
            </Canvas>
        </div>
    );
}

// This seems fine. Exports aboout 14k bytes.  It's a stack of cylinders.
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
                // Create Blob from the ArrayBuffer output
                const blob = new Blob([gltf as ArrayBuffer], { type: 'application/octet-stream' });
                resolve(blob)
            },
            (error) => {
                reject(error);
            },
            { binary: true } // Ensures .glb format
        );
    });
}

//  setBlob(finalBlob);
//     return finalBlob

// if (blob == null) {
//     const ablob = exportToBlob(); // just once. 
//     if (ablob != null) {
//         console.log("GLTF exportToBlob has size:", ablob.size);
//         setBlob(ablob);

//         // send away, fly away little bird.
//         let gltfMessage: messes.GlbMessage = {
//             to: "GlbCreatedMessage", // "request.from", // Fill in the appropriate recipient
//             from: "testmain-2n0u4w2p-to-frame", // Fill in the sender // should be the master. that's me.
//             type: "glb",
//             sessionId: "none", // Fill in the session ID
//             name: "TheFormallyOrange4WestAppScene.glb",
//             errorMessage: "",
//             comment: "This is a GLB exported from TheFormallyOrange4WestApp",
//             key: "mainglb",
//             data: ablob
//         };

//         // it's going to pop out at the iFrame util and then publish as GlbCreatedMessage

//         // Replace with your parent page's exact domain/origin
//         const parentOrigin = "http://localhost:3020";
//         // Send the message
//         // window.parent.postMessage(gltfMessage, parentOrigin);
//         console.log("GLTF message prepared size:", gltfMessage.data.size);
//         // avoid using (they say) '*' as the target origin for security reasons.
//         window.parent.postMessage(gltfMessage, '*'); // lol - because it might work.}
//     }


function StackOfCylinders() {

    // this is the inside of a canvas, designated group of stuff we wish to publish to our counterpart 
    // out in the real world.

    // nobody 'invokes' this except that it's loaded and drawing.

    const groupRef = useRef<Group>(null);
    const cubeRef = useRef<THREE.Mesh>(null);

    // const [blob, setBlob] = useState<Blob | null>(null);
    // const { scene } = useThree(); // only inside canvas

    useEffect(() => {
        (async () => {
            try {

                interface MessageWrapper {
                    adest: string;
                    areturn: string;
                    msg: any;
                }

                const stackblob = await exportGroupToBlob(groupRef);

                var testGlbMessage : messes.GlbMessage = {

                    to: "Glb????CreatedMessage", // "request.from", // Fill in the appropriate recipient
                    from: "testmain-2n0u4w2p-to-frame", // Fill in the sender // should be the master. that's me.
                    type: "glb",
                    sessionId: "none", // Fill in the session ID

                   // type: "glb";
                    name: "none",// of the master w/0 the tld. This will refer to the AuxLeafStatus on the other side..
                    
                    command: "add", // "add" or "remove" or "update" or "replace", or "pause"/
                    // "start" or "delete" or "modify" or "change" or "redraw"
                    comment: "", // a comment about the change, for logging and debugging.
                
                    key: "stack", // a name for the blob.
                    active: true, // should it be playing? 
                    data: stackblob, // this is the exported glb data as a Blob.
                };


                window.parent.postMessage("testMessage11", "*");
   
                window.parent.postMessage(testGlbMessage, "*");


            } catch (error) {
                console.error('Failed to export GLB:', error);
            }
        })();
    }, []); // Empty dependency array ensures this runs only once on mount

    // useEffect(() => { // just once, right? 

    //     (async () => {
    //         // This effect runs once when the component mounts
    //         try {
    //             const blob = await exportGroupToBlob(groupRef);
    //             // send the message
    //             //                 let gltfMessage: messes.MessageBaseClass = {
    //             // `                    to: "GlbCreatedMessage", // "request.from", // Fill in the appropriate recipient
    //             //                     from: "testmain-2n0u4w2p-to-frame", // Fill in the sender // should be the master. that's me.
    //             //                     type: "glb",
    //             //                     sessionId: "none", // Fill in the session ID
    //             //                 }
    //             // {
    //             //     // can we dump this as hex? yes we can. But it's a lot of hex.
    //             //     const arrayBuffer = await (gltfMessage.data as Blob).arrayBuffer();
    //             //     const hexString = Array.from(new Uint8Array(arrayBuffer))
    //             //         .map(byte => byte.toString(16).padStart(2, '0'))
    //             //         .join('');
    //             //     console.log("GLTF message prepared hex string length:", hexString.length);
    //             //     // console.log("GLTF message prepared hex string:", hexString);
    //             //     // I know it's correct because I can read it elsewhere. 
    //             //     // Na, lets just write the file, 
    //             //     if ( false ){ // I have a hundred of these now. lol. 
    //             //         try {

    //             //             // Create a temporary URL and trigger a download
    //             //             const url = URL.createObjectURL(gltfMessage.data as Blob);
    //             //             const link = document.createElement('a');
    //             //             link.href = url;
    //             //             link.download = './orange-cylinders.glb';
    //             //             link.click();

    //             //             URL.revokeObjectURL(url); // Clean up
    //             //         } catch (error) {
    //             //             console.error('Failed to export GLB:', error);
    //             //         }
    //             //     };
    //             // }

    //             // it's going to pop out at the iFrame util and then publish as GlbCreatedMessage
    //             // console.log("GLTF message prepared size:", gltfMessage.data.size);

    //             const parentOrigin = "http://localhost:3020";
    //             // Send the message
    //             // window.parent.postMessage(gltfMessage, parentOrigin);
    //             //   console.log("GLTF message prepared ok?:", gltfMessage.data ? gltfMessage.data.size : "no data siz");
    //             //console.log("GLTF message prepared size:", gltfMessage.data.size);
    //             // avoid using (they say) '*' as the target origin for security reasons.
    //             // const transferrable = [gltfMessage.data as ArrayBuffer]; // it's 14,664 bytes. 

    //             //   window.parent.postMessage(gltfMessage, '*'); // lol - because it might work.}




    //             // const wrappedMessage: messageWrapper = {
    //             //     actualDestination: "master-draw-element",
    //             //     message: gltfMessage
    //             // };

    //             // window.parent.postMessage(gltfMessage, '*'); // lol - because it might work.}


    //             interface ApiResponse<Data> {
    //                 status: number;
    //                 message: string;
    //                 payload: Data; // Becomes whatever type you pass in
    //             }


    //             // this goes in here and comes out in the handleMesssage of MakeListOfIFrames.
    //             // where it needs to be re-published so that the ThingWithAux drawing element can 
    //             // get it. subscribe to it and get the glb and then draw it, and them maybe respond.
    //             // // actualDestination: string // aka testmain-0n0u0e32-glb-changes
    //             // actualReturn: string // aka testmain-0n0u0e32-to-frame

    //             interface MessageWrapper<MTYPE> {
    //                 adest: string;
    //                 areturn: string;
    //                 msg: <MTYPE>;
    //             }


    //             /*
    //                             so we sent it to the MakeListOfIFrames
    //                                      who gets all the messages from all the frames. 
    //                                        subscribes to master + "-to-frame"
    //                                       so it can deliver to the iframes.
    //                                        will publish to master + "-to-frame");
    //                             but we really want to send it directly to the ThingWithAux drawing elsement
    //                                     subscribes master + "-redraw"
    //                                     and
    //                                     sub.subscribe(master + "-glb-changes",
    //             */


    //             // it's going to re-appear in the player as a GlbCreatedMessage.  
    //             // we assign it to a AuxLeafStatus and then we can use it to make a scene.

    //             // very cute. Now let's send it directly to the master drawing react-three drawing element involved.

    //             // the destination is master-draw-element,  
    //             // we want to send it to the react-three drawing element draws this space.
    //             // That address is 
    //             const destination = "-draw-element";

    // //            gltfMessage.to = "GlbCreatedMessage" + "master-draw-element"; // "request.from", // Fill in the appropriate recipient

    //         } catch (error) {
    //             console.error('Failed to export GLB:', error);
    //         }
    //     })();

    // }, []);


    // it should occupy 1 cubic meter?

    useFrame((state: RootState, delta: number) => {
        const cube = cubeRef.current;
        if (!cube)
            return;
        cube.rotation.y += 0.05;
        cube.rotation.z += 0.015;
    });

    const radius = .4
    return (
        // in meters? Seems kinda small.
        <>
            <group ref={groupRef}>

                <directionalLight position={[1, 1, 1]} intensity={0.8} />

                <pointLight position={[10, 10, 10]} />
                {/* <ambientLight intensity={0.5} /> */}

                {/* args: [radiusTop, radiusBottom, 
            height, radialSegments, heightSegments, openEnded] */ }

                <mesh position={[0.5, 0, 0.5]}  >
                    <cylinderGeometry args={[radius, radius, 0.45, 16]} />
                    <meshStandardMaterial color="yellow" />
                </mesh>
                <mesh ref={cubeRef} position={[0.5, 0.5, 0.5]}  >
                    <cylinderGeometry args={[radius, radius, 0.45, 16]} />
                    <meshStandardMaterial color="green" />
                </mesh >
                <mesh position={[0.5, .75, 0.5]}  >
                    <cylinderGeometry args={[radius, radius, .45, 16]} />
                    <meshStandardMaterial color="blue" />
                </mesh >
            </group >
        </>
    );
}

function TheCanvasContents() {

    const cubeRef = useRef<THREE.Mesh>(null);

    // const { scene: scene1 } = useGLTF("/glbdump/scene (1).gltf");
    // const { scene: scene2 } = useGLTF("/glbdump/scene (2).gltf");
    // const { scene: scene3 } = useGLTF("/glbdump/scene (3).gltf");
    // const { scene: scene4 } = useGLTF("/glbdump/scene.gltf");

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
            <ambientLight intensity={0.5} />


            <StackOfCylinders />

            <mesh position={[25, 0, 25]}>
                <StackOfCylinders />
            </mesh>


            {/* <mesh position={[0, 0, 0]}>
                <primitive object={scene1} />
            </mesh>


            <mesh position={[0, 0, 0]}>
                <primitive object={scene1} />
            </mesh>

            <mesh position={[10, 0, 0]}>
                <primitive object={scene2} />
            </mesh>

            <mesh ref={cubeRef} position={[0, 0, 10]}>
                <primitive object={scene3} />
            </mesh>

            <mesh position={[10, 0, 10]}>
                <primitive object={scene4} />
            </mesh> */}

        </Suspense>
    </>
    );
}