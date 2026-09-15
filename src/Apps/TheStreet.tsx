
import * as THREE from 'three';

import { Canvas } from "@react-three/fiber";
import { Suspense, useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Scene } from "three";
import { Edges } from "@react-three/drei";

import * as messes from "../knotfree-ts-lib/3d/messageTypes";

import { AnythingToDomainName } from '../knotfree-ts-lib/avatars/testServermap';
// pubsub has a good name

import * as oct from "../knotfree-ts-lib/3d/Dns8Tree";

import { pubsub } from '../index';
import {Cmd_Lacky} from '../knotfree-ts-lib/avatars/Cmd_Lacky';
import {RPC_Gadget} from '../knotfree-ts-lib/avatars/RPC_Gadget';

// just a simple courtyard with a cobblestone texture on the ground. Maybe some frogs or kittens.

var replyCount = 0;// // ad hoc

export function TheStreet() {

    const domainName = AnythingToDomainName(window.location.href); // this is the name of the master. It's the domain name.

    // window.location name will get you a better one.

    const master = domainName[0]

    console.log("TheStreet", "has domainName", domainName);

    console.log("master", master);

    var ourCube: oct.Cube = {
        world: "testmain",
        x: 0,
        y: 0,
        z: 0,
        p: 0
    };

    var tmp = oct.StringToCube(master);
    if (tmp[1] === null) {
        ourCube = tmp[0];
    } else {
        console.error("Error parsing master domain name: ", tmp[1], " from href: ", window.location.href);
    }

    console.log("ourCube", ourCube);

    const cmdr = new Cmd_Lacky(); // I love it
    const rpc = new RPC_Gadget(pubsub,master,master + "-island-centre",cmdr);
    useEffect(() => {
        console.log("subscribing to our channel:", rpc.GetOurChannelName(), "to ", pubsub.getDebugName());
        pubsub.subscribe(rpc.GetOurChannelName(), "", false, (cmd: any, err: Error) => {
            replyCount++;
            rpc.ProcessCommand(cmd, err);
        });
    }, []); // empty dependency array means this effect runs once on mount and cleans up on unmount is that right?  yes.  see https://react.dev/reference/react/useEffect


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
                <StreetCanvas cube={ourCube} />
            </Canvas>
        </div>
    );
}

// we should try to make a glb blog in here and message it away to the parent window. 
// that's the plan.

function StreetCanvas({ cube }: { cube: oct.Cube }) {

    const cubeRef = useRef<THREE.Mesh>(null);

    return (<>
        <Suspense fallback={null}>

            <directionalLight position={[1, 1, 1]} intensity={0.8} />

            <pointLight position={[10, 10, 10]} />
            {/* <ambientLight intensity={0.5} /> */}

            <CubeWithEdges cube={cube} />

        </Suspense>
    </>
    );

}

export function CubeWithEdges({ cube }: { cube: oct.Cube }) {
    // const cube = props.cube

    const halfSize = (2 ** (cube.p - 1))

    const center = oct.CubeToCenter(cube)// ()[number, number, number] = [cube.x + halfSize, cube.y + halfSize, cube.z + halfSize]
    const width = halfSize * 2
    const size = width

    // console.log("CubeWithEdges cube:", cube, "halfSize:", halfSize, "width:", width, "size:", size, "center:", center)

    return (
        <mesh
            position={center}
        >
            <boxGeometry
                args={[size, size, size]}
            />
            <meshBasicMaterial color="lightblue" opacity={0.1} transparent />
            <Edges color="blue" />

        </mesh>
    );
}



