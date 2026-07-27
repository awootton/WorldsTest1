

// where we pretend to be several completely different apps, and split here.

import { TheDuckApp } from "./Apps/TheDuckApp";
import { TheCourtyardApp } from "./Apps/TheCourtyardApp";
import { TheShibaApp } from "./Apps/TheShibaApp"; import { TheParticleDemoApp } from "./Apps/AParticleDemoApp";
import { TheFormallyOrange4WestApp } from "./Apps/TheFormallyOrange-4west";
import { CylinderCanvas } from "./Apps/CylinderScene";
import * as oct from "./knotfree-ts-lib/3d/DomainNameOctTree";
import * as utils from "./knotfree-ts-lib/3d/utils";
import { MqttComponent } from "./Apps/Mqtt5TestApp";

const path = window.location.pathname
const host = window.location.host
const hostname = window.location.hostname
const origin = window.location.origin
const href = window.location.href

// console.log("AppSplitter Path " + path);
// console.log("AppSplitter host " + host);
// console.log("AppSplitter hostname " + hostname);
// console.log("AppSplitter origin " + origin);
// console.log("AppSplitter href " + href);

// AppSplitter.tsx:19 AppSplitter Path /
// AppSplitter.tsx:20 AppSplitter host localhost:3010
// AppSplitter.tsx:21 AppSplitter hostname localhost
// AppSplitter.tsx:22 AppSplitter origin http://localhost:3010
// AppSplitter.tsx:23 AppSplitter href http://localhost:3010/?domain=testmain-2n0u7w2p.vr&asset=undefined&type=undefined

// when testing we manually use a path. 
// it's not going to work. We're still getting the same iFrame over and over, regardless of the path.?

let count = 0

export default function AppSplitter() {

    const [domainName, err] = utils.FindDomainName(window.location.hostname, window.location.search);


    if (path.includes("exporttest")) {
        return <CylinderCanvas />;
    }

    if (href.includes("mqtt")) {

        console.log("called by mqtt");

        // nice useEffect listener.
        return <MqttComponent />;

    }

    if (err) {
        console.log("AppSplitter FindDomainName error: " + err.message);
        return (<div style={{
            fontSize: "8px"
        }}>FindDomainName Error {err.message}</div>);
    }

    console.log("AppSplitter we have a domainName = " + domainName);

    // TODO: testmain-2n0u7w2p is the no-content 4 meter we have now. We should send it a GLB.
    // Downloading a glb file with GLTFExporter
    // see this: https://discourse.threejs.org/t/how-to-export-a-scene-to-glb/22990/2

    // These must be uneerringly, relentlessly, correct. 

    // Is this REALLY 'the ex-orange stack>? yes domain name?
    if ((domainName === "testmain-2n0u4w2p") || path.includes("stack") || path.includes("cylinders")) {

        // just add 'stack' to the the path and it will write a glb testmain-2n0u4w2p
        // the 4 west is the orage on the 5 west is the duck and the 7wast is empty.

        return <TheFormallyOrange4WestApp />; // no listeners, makes a gtlf.
    }

    if (domainName == "testmain-2n0u7w2p" || path.includes("particle")) {
        // the 7 west 
        return <TheParticleDemoApp />; // no listeners, just a particle demo.
    }

    if (domainName === "testmain-2n0u5w2p" || path.includes("shiba")) {
        // 
        console.log("testmain-2n0u5w2p called");

        return <TheShibaApp />; // no listeners, just a dog
    }

    //     if (path.includes("street")) { // who is the master of the street? 
    // //     console.log("testmain- called0");
    // //     return <TheStreetApp />; // no listeners, just a bit of asphalt.
    //  else 

    if (domainName === "testmain-2n0u5w2p" || path.includes("duck")) {

        console.log("testmain-2n0u5w2p called0");

        return <TheDuckApp />;  // no listeners, just a spinning duck.

    }
    if (domainName === "testmain-0n0u0e5p" || href.includes("cobblestones")) {

        console.log("testmain-0n0u0e5p called0");

        // nice useEffect listener.
        return <TheCourtyardApp />;

    }
    console.log("AppSplitter has href = " + href);

    // else { 
    //     // the original: get rid of this.
    //     // has a weird listener.
    //     return <WorldApp />;
    // }

    return (<div style={{
        fontSize: "8px"
    }}>Not Found</div>);
}

