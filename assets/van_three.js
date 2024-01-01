/*
  Information:
    vanjs main client entry point
*/
//import * as THREE from 'three';
//import * as THREE from 'https://unpkg.com/three@0.157.0/build/three.module.js';
import van from "https://cdn.jsdelivr.net/gh/vanjs-org/van/public/van-1.2.1.min.js";
import {ThreeEL} from './triengine/triengine.js';
van.add(document.body,ThreeEL())