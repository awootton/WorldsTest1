import React, { useRef, useState } from 'react';
import { useTexture, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

export function StreetCenter() {

    const texture = useTexture('street.jpg');
    const meshRef = useRef<THREE.Mesh>(null);


    // can we get the bytes of the texture? yes we can
    // const bytes = texture.image.data; // this is a Uint8Array
    // console.log(bytes);  // is this the same as the original file? no it's not, it's the decoded image data

    return (<>
        <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[16, 0, 16]}>
            <planeGeometry args={[32, 32]} />
            <meshStandardMaterial map={texture} />
        </mesh>

    </>
    );
}

export function StreetCenter2() {

    const texture2 = useTexture('cobblestonesgrok512.jpg');

    // can we get the bytes of the texture? yes we can
    // const bytes = texture.image.data; // this is a Uint8Array
    // console.log(bytes);  // is this the same as the original file? no it's not, it's the decoded image data
    texture2.wrapS = THREE.RepeatWrapping;
    texture2.wrapT = THREE.RepeatWrapping;
    var repeats = 10  // for one meter cube 
    repeats = 20 // exaggerate like hell.
    texture2.repeat.set(repeats, repeats); // Adjust numbers to repeat texture across the faces

    return (<>

        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[16, 0, 16 - 32]}>
            <planeGeometry args={[32, 32]} />
            <meshStandardMaterial map={texture2}
            />
        </mesh>

    </>
    );
}

export function Duck() {
    const { scene } = useGLTF('Duck.glb');

    return (
        <>
            <primitive object={scene} />
        </>
    );
}

export function AnotherDuck() {

    // const [otherScene,setOtherScene] = useState<boolean>(useGLTF("Duck.glb"));


    const { scene } = useGLTF("/shiba/scene.gltf");

    return (
        <>
            <mesh position={[-5, 0, -5]} scale={1.8}>
                <primitive object={scene} />
            </mesh>

            {/* <mesh position={[-3, 0, -5]} scale={1.8}>
                <primitive object={otherScene} />
            </mesh> */}


        </>
    );
}


