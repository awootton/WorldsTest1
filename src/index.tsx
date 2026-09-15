import { StrictMode } from "react";
import * as ReactDOMClient from "react-dom/client";

import AppSpliter from "./AppSplitter";
import { PubSubTopicAndSubscribers } from "./knotfree-ts-lib/avatars/PubSubTopicAndSubscribers";
import { AnythingToDomainName, MasterToNickname as MasterToNickname } from "./knotfree-ts-lib/avatars/testServermap";

// this is supposed to supress a warning from the font loader. 

// I think it's from using a UTF-8 font glyph &#x2620; - skull and crossbones.
// unsupported GPOS table LookupType 8

// same trick for   if (typeof args[0] === 'string' && args[0].includes('THREE.Clock: This module has been deprecated. Please use THREE.Timer instead')) {

const originalWarn = console.warn;
console.warn = (...args) => {

  // 'THREE.Clock: This module has been deprecated. Please use THREE.Timer instead'

  if (typeof args[0] === 'string' && args[0].includes('THREE.Clock')) {
    return;
  }
  originalWarn(...args);
};

const originaldebug = console.debug;

console.debug = (...args) => {

  if (typeof args[0] === 'string' && args[0].includes('unsupported GPOS table LookupType 8')) {
    return;
  }
  if (typeof args[0] === 'string' && args[0].includes('unsupported GPOS table LookupType 6')) {
    return;
  }
  if (typeof args[0] === 'string' && args[0].includes('unsupported GPOS table LookupType 5')) {
    return;
  }
  originaldebug(...args);
};

const rootElement = document.getElementById("root");

export const getEffectiveHref = () => {
  var tempHref = window.location.href
  if (tempHref == "http://localhost:3010/") {
    tempHref = "http://testmain-0n0u0e5p.zzz:4001"
  }
  return tempHref
}
var tempWidowHref = getEffectiveHref();[]
const tempourDomainName = AnythingToDomainName(tempWidowHref)
export var nickname = MasterToNickname(tempourDomainName[0])

// Why the _pubsub suffix? It's used to distinguish the PubSubTopicAndSubscribers instance for this domain from other potential instances.
// yea, but there's only ever one now. 
const nameWithPubSubSuffix = tempourDomainName[0] // + "_pubsub"
console.log("In Index setting PubSubTopicAndSubscribers with temp ourDomainName: ", nameWithPubSubSuffix, " nickname: ", nickname)
// mount this as high as posibble
export const pubsub = new PubSubTopicAndSubscribers(nameWithPubSubSuffix, nickname);

if (rootElement) {
  const root = ReactDOMClient.createRoot(rootElement);

  root.render(
    <StrictMode>
      <AppSpliter />
    </StrictMode>
  );

}
if (!rootElement) {
  throw new Error("Root element not found");
}

