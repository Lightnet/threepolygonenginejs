/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/
//

import * as THREE from 'https://unpkg.com/three@0.170.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.170.0/examples/jsm/controls/OrbitControls.js'
import ECS from "https://unpkg.com/ecs@0.23.0/ecs.js";
import van from "https://cdn.jsdelivr.net/gh/vanjs-org/van/public/van-1.5.2.min.js";
import RAPIER from 'https://cdn.skypack.dev/@dimforge/rapier3d-compat';
import { CSS3DRenderer, CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';
import Stats from 'https://unpkg.com/three@0.170.0/examples/jsm/libs/stats.module.js';
import { GUI } from 'https://unpkg.com/three@0.170.0/examples/jsm/libs/lil-gui.module.min.js';

export {
  THREE,
  OrbitControls,
  ECS,
  RAPIER,
  van,
  CSS3DRenderer,
  CSS3DObject,
  Stats,
  GUI,
}