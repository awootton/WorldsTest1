
import { Canvas, createRoot } from "@react-three/fiber";
import { Cube } from "./Cube";
import { OrbitControls } from "@react-three/drei";
import { Duck, StreetCenter, AnotherDuck } from "./StreetCenter";
import { Suspense, useEffect } from "react";
import { MainWorldDisplay } from "./MainWorldDisplay";

import * as oct from "./knotfree-ts-lib/3d/UrlOctTree"

// import { render } from '@react-three/offscreen';

function WorldApp() {

  // who is calling us? log the window.location.href to see where we are
  console.log("WorldApp called from " + (window.location.href || "unknown location"));

  useEffect(() => {
    console.log("WorldApp useEffect called");
    // fetch the contents of dummyFile.txt and log it to the console
    // fetch('dummyFile.txt')
    //   .then(res => res.text())
    //   .then(text => {
    //     console.log("WorldApp fetched dummyFile.txt", text);
    //   })
    //   .catch(err => {
    //     console.error("WorldApp error fetching dummyFile.txt", err);
    //   });

    // // how about the duck? can we fetch the duck.glb file and log its contents?
    // fetch('Duck.glb')
    //   .then(res => res.arrayBuffer())
    //   .then(buffer => {
    //     // dump hex of the first 16 bytes of the buffer to the console
    //     const hex = Array.from(new Uint8Array(buffer.slice(0, 16)))
    //       .map(b => b.toString(16).padStart(2, '0'))
    //       .join(' ');
    //     console.log("WorldApp fetched Duck.glb", buffer.byteLength, hex);
    //     // we have some bytes.
    //     // can we make them back into a glb?
    //     const blob = new Blob([buffer], { type: 'model/gltf-binary' });
    //     const url = URL.createObjectURL(blob);
    //     console.log("WorldApp created URL for Duck.glb", url);
    //   })
    //   .catch(err => {
    //     console.error("WorldApp error fetching Duck.glb", err);
    //   });

    // now what? can we use this somewhere else?
    // send it in a message to ourselves? lol

  }, []); // empty dependency array means this runs once on mount

  console.log("WorldApp render called from " + (window.location.href || "unknown location"));

  const path = window.location.pathname

  console.log("WorldApp render path " + (path || "unknown location"));

  let cube: oct.Cube = {
    x: 0,
    y: 0,
    z: 0,
    p: 1,
    world: ""
  }

  let cubeName = ""
  if (path.startsWith("/") && (path.endsWith(".xyz") || path.endsWith(".vr"))) {

    cubeName = path.substring(1) // remove the leading "/"
    // remove the trailing ".xyz" or ".vr"
    cubeName = cubeName.replace(/\.xyz$|\.vr$/, "")
    console.log("WorldApp render extracted cubeName " + cubeName);
    // parse it to be sure.

    const [parsedCube, err] = oct.stringToCube(cubeName)
    if (err) {
      console.error("WorldApp render error parsing cubeName " + cubeName + ": " + err);
    } else {
      console.log("WorldApp render parsed cubeName " + cubeName + " to octree: ", parsedCube);
      cube = parsedCube
    }
  }

  console.log("WorldApp render rendering cube " + cube);


  // const frameBufferObject = useFBO()
  // this is the DEFAULT APP. We need cases for all the urls we are supporting in this example.
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

        <ambientLight args={[0xffffff]} intensity={0.2} />
        <directionalLight position={[1, 1, 1]} intensity={0.8} />

        <MainWorldDisplay />

        <OrbitControls />


        {/* <StreetCenter />

        <Cube />

        <Duck />

        <AnotherDuck />

        <Suspense fallback={null}>
         
        </Suspense> */}

      </Canvas>
    </div>
  );
}
// event.type is "message" when the message is received
// event.data is the data sent from the frame
// event.origin is the origin of the frame that sent the message
// event.source is the source of the frame that sent the message
// event.ports is an array of MessagePort objects that can be used to send messages back


function processMessageFromFrame(event: MessageEvent<any>) {
  // if (event.type !== "message") {
  if (event.data.type !== "init") {
    // console.error("WorldApp processMessageFromFrame got unexpected event type", event.type);
    return;
  }
  console.log("WorldApp processMessageFromFrame got message", "origin = ", event.origin, "source = ", event.source, "ports = ", event.ports);
  // source is a WindowProxy object that represents the frame that sent the message
  const offscreenCanvasRaw = event.data.payload.drawingSurface
  const offscreenCanvas = offscreenCanvasRaw as OffscreenCanvas
  if (!offscreenCanvas) {
    console.error("WorldApp processMessageFromFrame no offscreenCanvas in message", event.data)
    return
  }

  // can we stop the animation now?
  // To stop the animation loop in react-three-fiber, set frameloop to "never" in the root configuration
  // This will prevent automatic rendering unless you manually call root.advance()
  // See: https://docs.pmnd.rs/react-three-fiber/api/canvas#frameloop

  const width = event.data.payload.width || offscreenCanvas.width;
  const height = event.data.payload.height || offscreenCanvas.height;
  const pixelRatio = event.data.payload.pixelRatio || window.devicePixelRatio || 1;

  console.log("WorldApp processMessageFromFrame got offscreenCanvas", offscreenCanvas, width, height, pixelRatio);

  // try sending it back right now - see what blows up.
  // if ( true) {

  //   if (event.source) {
  //     event.source.postMessage({
  //       type: "returning-offscreenCanvas",
  //       payload: {
  //         // send back the offscreenCanvas and its dimensions?
  //         drawingSurface: offscreenCanvas,
  //         width,
  //         height
  //       }
  //     }, { targetOrigin: "*", transfer: [offscreenCanvas] });
  //   }

  //   offscreenCanvas.width = width // these are destroyed by the browser when the offscreenCanvas is transferred
  //   offscreenCanvas.height = height
  // }


  const element = (
    <>
      <Cube />
      <ambientLight args={[0xffffff]} intensity={0.2} />
      <directionalLight position={[1, 1, 1]} intensity={0.8} />
      {/* <OrbitControls /> */}
    </>
  )

  const root = createRoot(offscreenCanvas as any)

  const conf = root.configure({
    // events: createPointerEvents,
    size: {
      top: 0,
      left: 0,
      width,
      height,
      updateStyle: false
    },
    dpr: pixelRatio,
    // frameloop: "never", // stop the animation loop
  })

  // how do we get the gl context from the offscreenCanvas?
  // const gl = root.configure(). //.getContext("webgl");
  // if (!gl) {
  //   console.error("WorldApp processMessageFromFrame no webgl context in offscreenCanvas", offscreenCanvas);
  // }
  // console.log("WorldApp processMessageFromFrame has webgl context", gl);

  root.render(element)

  const gl = offscreenCanvas.getContext("webgl2") as WebGL2RenderingContext;
  if (!gl) {
    console.error("WorldApp processMessageFromFrame no webgl context in offscreenCanvas", offscreenCanvas);
    return;
  }
  console.log("WorldApp processMessageFromFrame has webgl context", gl);
  // gl.fenceSync = gl.fenceSync || gl.createSync; // for webgl2 compatibility
  // gl.waitSync = gl.waitSync || gl.waitSync; // for webgl2 compatibility
  // The WebGL2RenderingContext.fenceSync() method of the WebGL 2 API 
  // creates a new WebGLSync object and inserts it into the GL command stream.


  // const framebuffer = gl.createFramebuffer();

  // You can check if a framebuffer is complete at any time by calling glCheckFramebufferStatus 
  // and check if it returns GL_FRAMEBUFFER_COMPLETE. See the reference for other return 

  // if (!framebuffer) {
  //   console.error("WorldApp processMessageFromFrame no framebuffer created");
  //   return;
  // }

  // gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer); // unbind the offscreenCanvas?
  // gl.deleteFramebuffer(framebuffer); // delete the framebuffer

  // unhook the offscreenCanvas ?

  // const bits = offscreenCanvas.transferToImageBitmap();

  // offscreenCanvas.setRenderTarget(null); // unhook the offscreenCanvas from the WebGL context
  // offscreenCanvas.getContext() //.forceContextLoss(); // force the context to be lost, so it can be reused  

  // if (event.source) {
  //   event.source.postMessage({
  //     type: "ack",
  //     payload: {
  //       // send back the offscreenCanvas and its dimensions?
  //       drawingSurface: offscreenCanvas,
  //       width,
  //       height
  //     }
  //   }, { targetOrigin: "*", transfer: [offscreenCanvas] });
  // }


}
if (window.addEventListener) {
  // For standards-compliant web browsers
  window.addEventListener("message", processMessageFromFrame, false);
  console.log("WorldApp added message event listener");
}

export default WorldApp;
function getfromdone(document: Document, arg1: string): HTMLCanvasElement {
  throw new Error("Function not implemented.");
}

