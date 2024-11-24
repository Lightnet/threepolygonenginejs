/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

// https://stackoverflow.com/questions/68301885/transforming-simplex-noise-value-to-color
// https://github.com/philfrei/SiVi
// https://stackoverflow.com/questions/13623663/i-cannot-generate-smooth-simplex-noise-in-javascript
// https://github.com/jackunion/tooloud
// 
import van from "https://cdn.jsdelivr.net/npm/vanjs-core@1.5.2/src/van.min.js";
//import { FloatingWindow } from "https://cdn.jsdelivr.net/npm/vanjs-ui@0.10.1/dist/van-ui.min.js";
//import * as THREE from 'https://unpkg.com/three@0.170.0/build/three.module.js';
//import { OrbitControls } from 'https://unpkg.com/three@0.170.0/examples/jsm/controls/OrbitControls.js';
//import Stats from 'https://unpkg.com/three@0.170.0/examples/jsm/libs/stats.module.js';
import { GUI } from 'https://unpkg.com/three@0.170.0/examples/jsm/libs/lil-gui.module.min.js';

import { SimplexNoise } from 'https://unpkg.com/three@0.170.0/examples/jsm/math/SimplexNoise.js';

const {div, canvas} = van.tags;

class RNG {
  m_w = 123456789;
  m_z = 987654321;
  mask = 0xffffffff;

  constructor(seed) {
    this.m_w = (123456789 + seed) & this.mask;
    this.m_z = (987654321 - seed) & this.mask;
  }

  // Returns number between 0 (inclusive) and 1.0 (exclusive),
  // just like Math.random().
  random() {
      this.m_z = (36969 * (this.m_z & 65535) + (this.m_z >> 16)) & this.mask;
      this.m_w = (18000 * (this.m_w & 65535) + (this.m_w >> 16)) & this.mask;
      let result = ((this.m_z << 16) + (this.m_w & 65535)) >>> 0;
      result /= 4294967296;
      return result;
  }
}

const params = {
  seed: 0,
  terrain:{
    scale: 30,
    magnitude: 0.5,
    offset: 0.2
  },
  color:{
    r:0,
    g:0,
    b:0,
  }
};

const rng = new RNG(params.seed);

const canvasTexture = document.createElement("canvas");
canvasTexture.style.width="800px";
canvasTexture.style.height="800px";
const ctx = canvasTexture.getContext("2d");
ctx.canvas.width = 64;
ctx.canvas.height = 64;

function generateTexture(){
  console.log(ctx.canvas.width);
  const simplex = new SimplexNoise(rng);
  for(let y = 0; y < ctx.canvas.width; y++) {
      for(let x = 0; x < ctx.canvas.width; x++) {
          let noise = simplex.noise(
            x / params.terrain.scale, 
            y / params.terrain.scale
          );
          noise = params.terrain.offset + params.terrain.magnitude * noise;
          //noise = (noise + 1) / 2;
          let color = Math.abs(noise) * 255;
          //console.log(color);
          ctx.fillStyle = `rgba(${color+params.color.r}, ${color+params.color.g}, ${color+params.color.b}, 1)`;          
          ctx.fillRect(x, y, 1, 1)
      }
  }
}
generateTexture();

van.add(document.body, canvasTexture)

function createGUI(){
  const gui = new GUI();
  gui.add(params,'seed',0,10000)
  gui.add(params.terrain,'scale',0,1,0.01)
  gui.add(params.terrain,'magnitude',0,1,0.01)
  gui.add(params.terrain,'offset',0,1,0.01)

  gui.add(params.color,'r',0,255,1)
  gui.add(params.color,'b',0,255,1)
  gui.add(params.color,'g',0,255,1)


  gui.onChange(()=>{
    generateTexture();
  });

}

createGUI();
