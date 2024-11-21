/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

import van from "https://cdn.jsdelivr.net/npm/vanjs-core@1.5.2/src/van.min.js";
//import * as THREE from 'https://unpkg.com/three@0.170.0/build/three.module.js';
//import { OrbitControls } from 'https://unpkg.com/three@0.170.0/examples/jsm/controls/OrbitControls.js';
//import Stats from 'https://unpkg.com/three@0.170.0/examples/jsm/libs/stats.module.js';
//import { GUI } from 'https://unpkg.com/three@0.170.0/examples/jsm/libs/lil-gui.module.min.js';
//import { PointerLockControls  } from 'https://unpkg.com/three@0.170.0/examples/jsm/controls/PointerLockControls.js';
//import TWEEN from 'https://unpkg.com/three@0.170.0/examples/jsm/libs/tween.module.js';

import CorePolygon from "./corepolygon.js";
console.log("init core...");
const corePolygon = new CorePolygon();
console.log(corePolygon);
van.add(document.body, corePolygon.domElement );