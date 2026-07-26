

//  GLTFExporter example

console.log('Exporting scene from make-a-glt-test1.ts  atw-test-scene.glb...');
console.log('Exporting scene from make-a-glt-test1.ts  atw-test-scene.glb...');

import { JSDOM } from 'jsdom';
// // import { Blob } from 'vblob';
// import * as fs from 'fs';

// import * as THREE from 'three'; // if I import this then it never comes back. 

// import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js'; // if I import this then it never comes back.



// no errors, just nothing. How does one do this? 

// // npx ts-node src/scripts/make-a-glt-test1.ts

// // getting 'link' error with txconfig.ts TSError:  Unable to compile TypeScript:
// // error TS5023: Unknown compiler option 'ignoreDeprecations'.
// // "

// console.log('Exporting scene from make-a-glt-test1.ts  atw-test-scene.glb...');
// console.log('Exporting scene from make-a-glt-test1.ts  atw-test-scene.glb...');
// console.log('Exporting scene from make-a-glt-test1.ts  atw-test-scene.glb...');
// console.log('Exporting scene from make-a-glt-test1.ts  atw-test-scene.glb...');

// // Define your export options
// const options = {
//     binary: true, // Set to true to export as .glb, false for .gltf
//     maxTextureSize: 4096 // Optimizes texture sizes
// };

// // Setup scene and object
// const scene = new THREE.Scene();
// const cube = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial());
// scene.add(cube);

// // Instantiate exporter
// const exporter = new GLTFExporter();

// console.log('Exporting scene from make-a-glt-test1.ts  atw-test-scene.glb...');

// /**
//  * Triggers the browser download prompt for the exported file
//  */
// function downloadFile(blob: Blob, filename: string): void {
//     // const link = document.createElement('a');
//     // link.href = URL.createObjectURL(blob);
//     // link.download = filename;
//     // link.click();
//     // URL.revokeObjectURL(link.href);

//     // save blob to file using Node.js fs module
//     const fs = require('fs');
//     const path = require('path');
//     const filePath = path.join(__dirname, filename);
//     fs.writeFileSync(filePath, Buffer.from(blob as any));
//     console.log(`File saved to ${filePath}`);
// }

// /**
//  * Parses the scene and exports it using standard callbacks
//  */
// export function exportScene(inputObject: THREE.Object3D): void {
//     exporter.parse(
//         inputObject,
//         (gltf) => {
//             if (gltf instanceof ArrayBuffer) {
//                 // If options.binary is true, result is an ArrayBuffer (.glb)
//                 const blob = new Blob([gltf], { type: 'application/octet-stream' });
//                 downloadFile(blob, './atw-test-scene.glb');
//             } else {
//                 // If options.binary is false, result is a JSON object (.gltf)
//                 const output = JSON.stringify(gltf, null, 2);
//                 const blob = new Blob([output], { type: 'text/plain' });
//                 downloadFile(blob, './atw-test-scene.gltf');
//             }
//         },
//         (error) => {
//             console.error('An error occurred while parsing the GLTF:', error);
//         },
//         options
//     );
// }

// exportScene(scene);

// /**
//  * Alternative: Using the Promise-based async parser method
//  */
// export async function exportSceneAsync(inputObject: THREE.Object3D): Promise<void> {
//     try {
//         const gltf = await exporter.parseAsync(inputObject, options);
        
//         if (gltf instanceof ArrayBuffer) {
//             const blob = new Blob([gltf], { type: 'application/octet-stream' });
//             downloadFile(blob, 'scene.glb');
//         } else {
//             const output = JSON.stringify(gltf, null, 2);
//             const blob = new Blob([output], { type: 'text/plain' });
//             downloadFile(blob, './scene.gltf');
//         }
//     } catch (error) {
//         console.error('Async export failed:', error);
//     }
// }