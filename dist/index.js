!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.Template=t():e.Template=t()}("undefined"==typeof self?this:self,(()=>(()=>{"use strict";var e={d:(t,o)=>{for(var r in o)e.o(o,r)&&!e.o(t,r)&&Object.defineProperty(t,r,{enumerable:!0,get:o[r]})},o:(e,t)=>Object.prototype.hasOwnProperty.call(e,t),r:e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}},t={};e.r(t),e.d(t,{unwatch:()=>f,watch:()=>c,watchable:()=>p});const o=new Map,r=Symbol("watched");function n(e,t){let o=e,r=t;if("string"==typeof t&&t.includes(".")){const n=t.split(".");o=n.slice(0,-1).reduce(((e,t)=>Reflect.get(e,t,e)),e),r=n[n.length-1]}return{proxy:o,prop:r}}function p(e,t){if("object"!=typeof e)throw new Error("First parameter target is not an object!");Object.entries(e).forEach((([t,o])=>{"object"!=typeof o||o[r]||(e[t]=p(o))}));const f={get:(e,t,o)=>"string"==typeof t&&t.includes(".")?t.split(".").reduce(((e,t)=>Reflect.get(e,t,o)),e):Reflect.get(e,t,o),set(e,t,r,p){const{proxy:c,prop:f}=n(p,t),i=[...o.keys()].find((({proxy:e,prop:t})=>c===e&&f===t));return i&&o.get(i).forEach((e=>{Reflect.apply(e,void 0,[r,Reflect.get(c,f,c)])})),Reflect.set(e,f,r,c),!0}},i=new Proxy(e,f);return Array.isArray(t)&&t.forEach((({route:e,watcher:t})=>{if(!(e&&t&&t instanceof Function))throw new Error("Invalid route or watcher!");c(i,e,t)})),Reflect.defineProperty(i,r,{value:!0,writable:!1,enumerable:!1,configurable:!1}),i}function c(e,t,r){const{proxy:p,prop:c}=n(e,t),f=[...o.keys()].find((({proxy:e,prop:t})=>e===p&&t===c));f?o.get(f).push(r):o.set({proxy:p,prop:c},[r])}function f(e,t,r){const{proxy:p,prop:c}=n(e,t),f=[...o.keys()].find((({proxy:e,prop:t})=>e===p&&t===c));if(f){const e=o.get(f);e.includes(r)&&e.splice(e.indexOf(r),1)}}return t})()));