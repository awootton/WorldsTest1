import React, { useRef } from 'react';
import { useEffect } from "react";

import { Canvas, RootState } from "@react-three/fiber";
import { useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Group, Scene } from "three";
import * as utils from "../knotfree-ts-lib/3d/utils";
import * as oct from "../knotfree-ts-lib/3d/Dns8Tree";


import * as THREE from 'three';
import { GLTFExporter, GLTFExporterOptions } from 'three/examples/jsm/exporters/GLTFExporter.js';

import { useTexture } from '@react-three/drei'
import { Text } from '@react-three/drei';
import { Perf } from 'r3f-perf'

import { pubsub } from '../index';

import { CubeWithEdges } from './TheStreet'

import {Cmd_Lacky} from '../knotfree-ts-lib/avatars/Cmd_Lacky';
import {RPC_Gadget} from '../knotfree-ts-lib/avatars/RPC_Gadget';


// testmain-2n0u4w2p is the correct name. here.

// in this hodgepodge of 3d conponents there's one we want to make into a GlB (GhostKiller)
// there's a converter below. 


type GhostKillerProps = {
    cmdr: Cmd_Lacky;
    rpc: RPC_Gadget;
};


export function TheFormallyOrange4WestApp() {

    const cubeName = "testmain-2n0u4w2p"; // 4 m cube. cleanMasterDomainName has "_any" in it.
    const cmdr = new Cmd_Lacky(); 
    const rpc = new RPC_Gadget(pubsub, cubeName, cubeName + "-island-centre",cmdr);

    if (cubeName != rpc.cleanMasterDomainName) {
        console.error("Something is wrong here in TheHollywoodOrange4WestApp", cubeName, rpc.cleanMasterDomainName);
    }

    useEffect(() => {

        void (async () => {
            // ask a question: rpc.cleanMasterDomainName+"-mainland-centre is our counterpart (AuxGroupRender) on the mainland.
            // is has a command interpreter.
            const mainReplyProm = rpc.SendCommand(rpc.cleanMasterDomainName + "-mainland-centre", "help")
            const mainReply = await mainReplyProm;
            console.log("TheFormallyOrange4WestAppgot reply", mainReply);
            console.log("TheFormallyOrange4WestAppgot reply", mainReply);
            console.log("TheFormallyOrange4WestAppgot reply", mainReply);

            // The command we most want to send is "display GLB" which sends a glb blob over to player.
            // note that there is a function here (exportGroupToBlob) tyhat will create the GLB blob for us..


        })();

    }, []); // empty dependency array means this effect runs once on mount and cleans up on unmount is that right?  yes.  see https://react.dev/reference/react/useEffect

    // let's make an 'orange' command.
    // what's the advantage of doing this in a useEffect?
    cmdr.AddCommand({
        command: "whats orange",
        description: "a nonsense question🔓",
        execute: (msg: string, callContext: any) => {
            return "Orange was once the random color of a floor in a test object. It also became known a 4 west, 2 north " +
                "in order for a particular part of this 'app' to create a GlB there needed to be a single component that " +
                "Radnomly looked like a GhostKiller, and so it is. It's also a fruit.";
        }
    });


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
                    target={[4, 4, 4]}
                    maxDistance={100}
                />

                <TheCanvasContents cmdr={cmdr} rpc={rpc} />

                <CubeWithEdges cube={cube0} />
                <CubeWithEdges cube={cube1} />
                <CubeWithEdges cube={cube2} />
                <CubeWithEdges cube={cube4} />

                <Perf position="bottom-right" />

            </Canvas>
        </div>
    );
}

// <Perf position="bottom-right" minimal />

// Move to Utils.
// This seems fine. Exports aboout 14k bytes. It's a stack of cylinders but may export any group.
// can we just do this anytime in the app? Does it have to be part of a draw cycle?
// let's hook it to a timer or a button or a message see! 
// we should just put this in the library. 
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

// it should draw just front of the origin in a 4 meter cube.
// The outside group or mesh will have to position it in the world because we don't know yet.

function GhostKiller({ cmdr, rpc }: GhostKillerProps) {

    // this is inside of a canvas. check. has access to the groupRef. check.
    // This is it. We have to start as helen keller. Can't see, can't smell.

    // Let's just assume we can send messages to our main dock
    // he's loaded alrady.

    // what's his name  testmain-2n0u4w2p-island-centre 

    // send hello to this guy. testmain-2n0u4w2p-island-centre

    // Som we're here. Now what? Do we see and any ghosts?
    // We see nothing. We're not even thinking.

    // let's get a heartbeat and some state going.

    const [sentGLB, setSentGLB] = React.useState(false);

    const [heartbeat, setHeartbeat] = React.useState(0); // simple heartbeat counter

    async function runOneHeartbeat() {

        console.log("Orange Orange Heartbeat tick heartbeat is:", heartbeat);
        console.log("Orange Orange Heartbeat tick heartbeat is:", heartbeat);
        console.log("Orange Orange Heartbeat tick heartbeat is:", heartbeat);
        console.log("Orange Orange Heartbeat tick heartbeat is:", heartbeat);
        // say hello
        console.log("Sending hello message to testmain-2n0u4w2p-mainland-centre", rpc.cleanMasterDomainName + "-mainland-centre");

        // how do we track this critter as is moves along?
        // it's a publish that passes through post message
        const gotP = rpc.SendCommand("testmain-2n0u4w2p-mainland-centre", "hello");       // rpc.sendMessage( rpc.getMainDockId(), "hello" );
       
        console.log("Orange Sent hello message, got response Promise:", gotP);
        const got = await gotP
        console.log("Orange Sent hello message, got response:", got);

        setHeartbeat(heartbeat + 1);

    }

    // and, a heartbeat.
    useEffect(() => {

        let period = 10000

        // first, let's just run it.
        runOneHeartbeat();

        const interval = setInterval(async () => {

            runOneHeartbeat();// then every 10 sec

        }, 10000); // update heartbeat every 10 second
        return () => clearInterval(interval);

    }, []);

    // Now, we're alive!!!.


    const groupGhostKillerRef = useRef<Group>(null);
    const cubeRef = useRef<THREE.Mesh>(null); // the middle cube that we rotate and puff up and make angry.

    const center = oct.CubeToCenter(cube2)

    // it should occupy 4 cubic meter?
    // now translate that into an animation. lol. 
    // I can't do this is animation stop messing around with it.
    useFrame((state: RootState, delta: number) => {
        const cube = cubeRef.current;
        if (!cube)
            return;
        const group = groupGhostKillerRef.current;
        if (!group)
            return;
        cube.rotation.y += 0.05;// of pi?
        cube.rotation.z += 0.015;

        // every once in a while, jump scare.

        let puffCenter = 2
        groupGhostKillerRef.current?.scale.setScalar(puffCenter);
    });

    const radius = .4
    const xadjust = center[0] - 0.5; // adjust the height of the cylinders to make them look more like a stack of pancakes.
    const yadjust = 0 + 0.25; // adjust the height of the cylinders to make them look more like a stack of pancakes.
    const zadjust = center[2] - .5; // adjust the height of the cylinders to make them look more like a stack of pancakes.
    // what's the extra group for? ??
    return (
        // in meters? Seems kinda small.
        <>
            <group >
                <group ref={groupGhostKillerRef} position={center}>

                    <directionalLight position={[1, 1, 1]} intensity={2.0} />

                    {/* <pointLight position={[10, 10, 10]} /> */}
                    <ambientLight intensity={1.75} />

                    {/* <CubeWithEdges cube={cube2} /> */}

                    <TextOnFaces cube={cube2} ourTextToday="Hate Ghosts,Ghosts Stay back,
                                    I am the Ghost Eater,All Ghosts should run." />

                    <mesh position={[0.5 + xadjust, +yadjust, 0.5 + zadjust]}  >
                        <cylinderGeometry args={[radius * .98, radius * .98, 0.45, 7]} />
                        <meshStandardMaterial color="yellow" />
                    </mesh>
                    <mesh ref={cubeRef} position={[0.5 + xadjust, 0.45 + yadjust, 0.5 + zadjust]}  >
                        <cylinderGeometry args={[radius, radius, 0.45, 13]} />
                        <meshStandardMaterial color="green" />
                    </mesh >
                    <mesh position={[0.5 + xadjust, .75 + yadjust, 0.5 + zadjust]}  >
                        <cylinderGeometry args={[radius, radius, .45, 17]} />
                        <meshStandardMaterial color="blue" />
                    </mesh >

                    <GrassFloor />
                </group >
            </group>
        </>
    );
    // we should pass a cube to grass floor.
}

// what size is. It's only 2 meters across. We want it to be 4 meters across. So, we need to scale it up by 2.

// there's no cube but it's for a 2p
function GrassFloor() {
    const grassTexture = useTexture('/grass.jpg')

    grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping
    grassTexture.repeat.set(2, 2) // Adjust repeat count

    function centerMarker() { // marks the center of the universe. 
        return (
            <mesh position={[0, 0.0, 0]}>
                <boxGeometry args={[0.1, 8, 0.1]} />
                <meshStandardMaterial color="red" />
            </mesh>
        )
    }

    // receiveShadow don't trust you.

    return (<>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[2, 0, 2]} >
            <planeGeometry args={[4, 4]} />
            <meshStandardMaterial map={grassTexture} />
        </mesh>
        {/* {centerMarker()} */}
    </>

    )
}

// This will be the contents. We want just over 2 meters tall and angry and
// imposing. Occasional text messages "we hate ghosts".
function TheCanvasContents(props: GhostKillerProps) {

    const cubeRef = useRef<THREE.Mesh>(null);

    const { scene: scene1 } = useGLTF("/glbdump/scene (1).gltf");
    const { scene: scene2 } = useGLTF("/glbdump/scene (2).gltf");
    const { scene: scene3 } = useGLTF("/glbdump/scene (3).gltf");
    const { scene: scene4 } = useGLTF("/glbdump/scene.gltf");

    const { scene } = useGLTF('Duck.glb');


    useFrame(() => { // angry and imposing is the idea. We want to be able to rotate and puff up and down and make angry postures.
        const cube = cubeRef.current;
        if (!cube) return;
        // cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        cube.scale.set(10, 10, 10);
    });

    return (<>
        {/* <Suspense fallback={null}> */}
        <>

            {/* 
            
            no, put it in the group.
            <directionalLight position={[1, 1, 1]} intensity={2.0} />
            <ambientLight intensity={0.5} />
 */}

            {/* <StackOfCylinders /> */}

            <mesh position={[0, 0, 0]}>
                <GhostKiller cmdr={props.cmdr} rpc={props.rpc} />
            </mesh>


            <mesh position={[0, 0, 0]}>
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
            </mesh>
        </>
        {/* </Suspense> */}
    </>
    );
}

// Where's our cross project component lib.
// I'm not starting a new project for this. I'll never get rid of it.

type TextOnFacesProps = {
    cube: oct.Cube,
    ourTextToday: string
}

// TextOnFaces draws a 'banner' on the 4 faces of a cube more or less at eye level.
function TextOnFaces(props: TextOnFacesProps) {

    const halfSize = (2 ** (props.cube.p - 1))
    const center = oct.CubeToCenter(props.cube)
    const width = halfSize * 2
    const size = width

    const splitText = props.ourTextToday.split(",") // split the text into 4 parts. We want to put a different message on each face of the cube.    
    while (splitText.length < 4) {
        splitText.push(splitText[0])
    }

    const offset = width / 2 * 0.98
    const tweak = 0.01 // we have to be slightly outside the cube to avoid z-fighting, but we don't want to be too far outside the cube or the text will look like it's floating.
    const faceTexts = [
        { pos: [center[0] + offset + tweak, center[1], center[2]] as [number, number, number], rot: [0, Math.PI / 2, 0] as [number, number, number], message: splitText[0] },
        { pos: [center[0] - offset - tweak, center[1], center[2]] as [number, number, number], rot: [0, -Math.PI / 2, 0] as [number, number, number], message: splitText[1] },
        { pos: [center[0], center[1], center[2] + offset + tweak] as [number, number, number], rot: [0, 0, 0] as [number, number, number], message: splitText[2] },
        { pos: [center[0], center[1], center[2] - offset - tweak] as [number, number, number], rot: [0, Math.PI, 0] as [number, number, number], message: splitText[3] },
    ]
    const faceAdjustments: [number, number, number][] = [
        [+ tweak, 0, 0],
        [- tweak, 0, 0],
        [0, 0, tweak * 2],
        [0, 0, - tweak * 2],
    ]

    const elements = []
    for (let index = 0; index < faceTexts.length; index++) {
        const face = faceTexts[index]
        const adj = faceAdjustments[index]
        elements.push(MakeSign(props.cube, face.pos, face.rot, face.message, adj, index))
    }

    return (
        <>
            {elements}
        </>
    )
}

function MakeSign(
    cube: oct.Cube,
    position: [number, number, number],
    rotation: [number, number, number],
    message: string,
    adjustment: [number, number, number], index: number) {

    const center = oct.CubeToCenter(cube)
    const width = (2 ** (cube.p))
    const ypos = center[1] - width / 2 + 1.75

    let adjustedPosition: [number, number, number] = [
        position[0] + adjustment[0],
        ypos,
        position[2] + adjustment[2]
    ];
    let adjustedPosition2: [number, number, number] = [
        adjustedPosition[0] + adjustment[0],
        ypos, //adjustedPosition[1] + adjustment[1], eye height.
        adjustedPosition[2] + adjustment[2]
    ];

    // slightly randomize the rotation of the text so that it doesn't look too uniform. 
    // This is just for fun and to make it look more natural.
    let aHash = utils.djb2Hash("" + index + oct.CubeToString(cube)[0]) // an pseudo random 32 bit int. just for fun.
    if ((aHash & (1 << 16)) === 0) {
        aHash = -aHash
    }// now signed.
    aHash = aHash / (2 ** 31) // now just a fract.
    const rotationZ = aHash * Math.PI / 16; // 
    // console.log("textRotation ", rotationZ)

    // console.log(`OutlineBoxComponent not pppp Plain cube MESSAGE is `, label)
    // NEVER ADD A KEY TO A TEXT. IT WILL BE IN THE TEXT

    // the colors are supposed to be like a police banner.

    // const font="/fonts/Inter_18pt-Bold.ttf" // also has errors. I give up
    //                     font={font}

    // const font = useFont('public/fonts/Inter_Regular.json')
    //                     font={'public/fonts/Inter_Regular.json'}
    // todo: load and parse this sooner for all to use.
    // time wasted. I hate you. Someone else do this:

    function backgroundForText() {

        //  return null // it's broken. The offsets are wrong. 

        return (
            <mesh
                position={adjustedPosition}
                rotation-z={rotationZ}
            // key={index + 10000}
            >
                <planeGeometry args={[3, 0.25]} />
                <meshStandardMaterial
                    color="#CCFF00"      // Core fluorescent yellow color
                    emissive="#CCFF00"   // Emissive color for glowing effect
                    emissiveIntensity={4} // Boost the brightness
                />
            </mesh>
        )
    }

    // Put your .woff / .ttf / .otf in the public folder
    // Example: public/fonts/Inter-Bold.woff woff is incompatible with useFont. It must be converted to json.

    // This works with the warnings.
    // const FONT_URL = '/fonts/Inter_18pt-Bold.ttf'
    //   font={FONT_URL}


    // Inter-Bold.woff2
    // const FONT_URL = '/fonts/Inter-Bold.woff2'

    //      font="https://jsdelivr.net"  didn't load?                  


    return (
        <React.Fragment key={index}>
            <mesh key={index} position={adjustedPosition} rotation={rotation}>

                {backgroundForText()}

            </mesh>
        </React.Fragment>
    )
}

// <Text color={"black"} anchorX="center" anchorY="middle"
//     position={[0, 0.0, -0.02]}

//     rotation-z={rotationZ}
//     fontSize={.15}
//     font={FONT_URL}
// >
//     {message.trim()}
// </Text>


// I need a complete example of a react-three-fiber using react-three/drei 
//  Text component complete with an embedded font hat has been converted to json and loaded with useFont, and then used in a Text, not Text3d, component.
//  
// 
// that uses the GLTFExporter to export a group of meshes to a .glb file. The example should include a button that, when clicked, exports the group and downloads the .glb file.



var testLoadCont = 0;

const cube0: oct.Cube = {
    world: "testmain",
    x: 0,
    y: 0,
    z: 0,
    p: 0
}

const cube1: oct.Cube = {
    world: "testmain",
    x: 0,
    y: 0,
    z: 0,
    p: 1
}

const cube2: oct.Cube = {
    world: "testmain",
    x: 0,
    y: 0,
    z: 0,
    p: 2
}

let cube4: oct.Cube = { // contents go in the center of 
    world: "testmain",
    x: 0,
    y: 0,
    z: 0,
    p: 4
}


// Copyright 2026 Alan Tracey Wootton
// See LICENSE
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.
