// where we pretend to be several completely different apps, and split here.

// We're not running this on 3020 anymore. Each app is gettng it's own port. 
// It will be a mess.  We have to keep building it though so maybe the 3020 version can be useful.
// the mapping file will be in the metaverse-proto public folder.

import { TheDuckApp } from "./Apps/TheDuckApp";
import { TheCourtyardApp } from "./Apps/TheCourtyardApp";
import { TheShibaApp } from "./Apps/TheShibaApp"; import { TheParticleDemoApp } from "./Apps/AParticleDemoApp";
import { TheFormallyOrange4WestApp } from "./Apps/TheFormallyOrange-4west";
import { CylinderCanvas } from "./Apps/CylinderScene";
import { MqttComponent } from "./Apps/Mqtt5TestApp";
import { AnimationExample1 } from './Apps/AnimationExample'
import { AnimationExampleSceneExport } from './Apps/AnimationExample2'
import { PubSubTopicAndSubscribers } from "./knotfree-ts-lib/avatars/PubSubTopicAndSubscribers";
import { AnythingToDomainName, MasterToNickname } from "./knotfree-ts-lib/avatars/testServermap";
import { LinksToAll } from "./Apps/TheStreetAppMisc";
import { TheStreet } from "./Apps/TheStreet";

const path = window.location.pathname
const host = window.location.host
const hostname = window.location.hostname
const origin = window.location.origin
const href = window.location.href

// examples:
//   Path /
//   host localhost:3010
//   hostname localhost
//   origin http://localhost:3010
//   href http://localhost:3010/?domain=testmain-2n0u7w2p.vr&asset=undefined&type=undefined

// when testing we manually use a path. 
// it's not going to work. We're still getting the same iFrame over and over, regardless of the path.? nope. fixed

let count = 0
let errL : Error | null = null
// Server is running on port 4001
// Example URL: http://testmain-0n0u0e5p.zzz:4001/index.html
// Server is running on port 4002
// Example URL: http://testmain-2n0u4w2p.zzz:4002/index.html
// Server is running on port 4003
// Example URL: http://testmain-2n0u5w2p.zzz:4003/index.html
// Server is running on port 4004
// Example URL: http://testmain-2n0u7w2p.zzz:4004/index.html
// Server is running on port 4005
// Example URL: http://testmain-1n0u10w4p.zzz:4005/index.html
// Server is running on port 4006
// Example URL: http://testmain-0n1d0e9p.zzz:4006/index.html


// let's hack it this way, not the other way. : like in 
export const getEffectiveHref = () => {
    var tempHref = window.location.href
    if (tempHref == "http://localhost:3010/") {
        tempHref = "http://testmain-0n0u0e5p.zzz:4001"
    }
    return tempHref
}
var tempHref = getEffectiveHref()
// no, let's make links 

export var ourDomainName = AnythingToDomainName(tempHref)
export var kickname = MasterToNickname(ourDomainName[0])
export var domainName = ourDomainName[0]
export var err = ourDomainName[1]

// the is the debug default that only happens here.
// if (err && host == "localhost:3010") {
//     console.error("Error parsing domain name: ", err, " from href: ", window.location.href);
//     ourDomainName = ["testmain-2n0u4w2p", null]
//     kickname = "orange"
//     domainName = ourDomainName[0]
//     err = null
// }


export default function AppSplitter() {

    // What is your name? Really. What is your name?

    // if ( true ) {  // force orange as a test
    //     return <TheFormallyOrange4WestApp />; // no listeners, makes a gtlf.
    // }

    console.log("AppSplitter top! Ahoy! New island Spotted! called " + window.location.href);

    if (window.location.href === "http://localhost:3010/") {
        // just a page with links to the semi buried islands
        return <LinksToAll />;
    }

    // const [domainName, err] = utils.FindDomainName(window.location.hostname, window.location.search);

    if (domainName === "testmain-0n0u0e5p" ||
        href.includes("cobblestones") || path.includes("courtyard")
    ) {

        console.log("testmain-0n0u0e5p called0");

       // kickname = "cobblestones"

        // nice useEffect listener.
        return <TheCourtyardApp />;

    }

    // Is this REALLY 'the ex-orange stack>? yes domain name?
    if ((domainName === "testmain-2n0u4w2p") ||
        path.includes("stack") ||
        path.includes("orange") ||
        path.includes("cylinders")) {

        // just add 'stack' to the the path and it will write a glb testmain-2n0u4w2p
        // the 4 west is the orage on the 5 west is the duck and the 7wast is empty.

      //  kickname = "orange"

        return <TheFormallyOrange4WestApp />; // no listeners, makes a gtlf.
    }

    if (domainName === "testmain-2n0u5w2p" || path.includes("duck")) {

        console.log("testmain-2n0u5w2p called0");

      //  kickname = "duck"

        return <TheDuckApp />;  // no listeners, just a spinning animation with two cubes.  xxxxduck.

    }
    if (domainName == "testmain-2n0u7w2p" ||
        path.includes("particle")) {

        // the 7 west 

      //  kickname = "particle"

        return <TheParticleDemoApp />; // no listeners, just a particle demo.
    }

    if (domainName === "testmain-1n0u10w4p" || path.includes("street")) {

        console.log("testmain-1n0u10w4p called0");

     //   kickname = "the street"

        // nice useEffect listener.
        // this needs to be the damn street and right now it's not.
        return <TheStreet />;
    }

    // where's the 9p? that is the giant dirt Patch? 
    if (domainName === "testmain-0n1d0e9p" ||
        path.includes("dirt")) {

        console.log("testmain-0n1d0e9p called0");

     //   kickname       = "dirt"

        // nice useEffect listener.
        // this needs to be the damn street and right now it's not.
        return <TheShibaApp />;
    }

    if (path.includes("exporttest")) {
        return <CylinderCanvas />;
    }

    if (path.includes("ani1")) {
        return <AnimationExample1 />;
    }

    if (path.includes("ani2")) {
        return <AnimationExampleSceneExport />; // the TS one with the button.
    }

    if (path.includes("mqtt")) {

        console.log("called by mqtt");

        // nice useEffect listener.
        return <MqttComponent />;
    }

    // if (err) {
    //     console.log("AppSplitter FindDomainName error: " + err?.message);
    //     return (<div style={{
    //         fontSize: "8px"
    //     }}>FindDomainName Error {err.message}</div>);
    // }

    // console.log("AppSplitter we have a domainName = " + domainName);

    // TODO: testmain-2n0u7w2p is the no-content 4 meter we have now. We should send it a GLB.
    // Downloading a glb file with GLTFExporter
    // see this: https://discourse.threejs.org/t/how-to-export-a-scene-to-glb/22990/2

    // These must be uneerringly, relentlessly, correct. 


    // console.log("AppSplitter has path = " + path);

    return (<div style={{
        fontSize: "8px"
    }}>Not Found</div>);
}


// if (domainName === "testmain-2n0u5w2p" || path.includes("shiba")) {
//     //
//     console.log("testmain-2n0u5w2p called");

//     nickname = "shiba"

//     return <TheShibaApp />; // no listeners, just a dog
// }


