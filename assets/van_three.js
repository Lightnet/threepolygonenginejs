/*
  Information:
    vanjs main client entry point
*/

import van from "https://cdn.jsdelivr.net/gh/vanjs-org/van/public/van-1.2.1.min.js";
import {ThreeEL} from './triengine/triengine.js';
van.add(document.body,ThreeEL())