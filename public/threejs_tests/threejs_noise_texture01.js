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
import * as THREE from 'https://unpkg.com/three@0.170.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.170.0/examples/jsm/controls/OrbitControls.js';
import Stats from 'https://unpkg.com/three@0.170.0/examples/jsm/libs/stats.module.js';
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
  },
  hexColor:0x00000
};

const rng = new RNG(params.seed);
const stats = new Stats();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
//camera.position.z = 5;
//camera.position.set(0, 2, 2);
camera.position.set(0, 0, 2);
var gridHelper;

const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setClearColor( 0x80a0e0);
renderer.setSize( window.innerWidth, window.innerHeight );
window.addEventListener('resize', function(event) {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
});

var clock = new THREE.Clock();
var controls = new OrbitControls( camera, renderer.domElement );

const myObject ={
  isRotate:true,
  test:()=>{
    console.log('test');
  },
  resetRotation(){
    cube.rotation.set(0,0,0)
  }
}

// const geometry = new THREE.BoxGeometry( 1, 1, 1 );
// const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
// const cube = new THREE.Mesh( geometry, material );
// scene.add( cube );

const canvasEl = document.createElement("canvas");
canvasEl.style.width="32px";
canvasEl.style.height="32px";
const ctx = canvasEl.getContext("2d");
ctx.canvas.width = 32;
ctx.canvas.height = 32;

function generateTexture(){
  //console.log(ctx.canvas.width);
  const simplex = new SimplexNoise(rng);
  for(let x = 0; x < ctx.canvas.width; x++) {
    for(let y = 0; y < ctx.canvas.height; y++) {
      for(let z = 0; z < ctx.canvas.width; z++) {
        let noise = simplex.noise3d(
          x / params.terrain.scale, 
          y / params.terrain.scale,
          z / params.terrain.scale
        );
        noise = params.terrain.offset + params.terrain.magnitude * noise;
        //console.log(noise);
        //noise = (noise + 1) / 2;
        let color = Math.abs(noise) * 255;
        //let color = Math.abs(noise);//too low?
        //console.log(color);
        ctx.fillStyle = `rgba(${color+params.color.r}, ${color+params.color.g}, ${color+params.color.b}, 1)`;          
        ctx.fillRect(x, y, 1, 1)
      }
    }
  }
}
generateTexture();
//van.add(document.body, canvasTexture)
var canvasTexture;
function setupSprite2DTexture(){
  canvasTexture = new THREE.CanvasTexture(canvasEl);
  canvasTexture.magFilter = THREE.NearestFilter;
  canvasTexture.wrapS = THREE.RepeatWrapping;
  canvasTexture.wrapT = THREE.RepeatWrapping;

  const spritePlane = new THREE.PlaneGeometry(1, 1);
  const spriteMaterial = new THREE.MeshBasicMaterial({
    map: canvasTexture,
    side: THREE.DoubleSide,
    transparent:true,
  });
  const mesh = new THREE.Mesh(spritePlane, spriteMaterial);
  mesh.scale.set(2,2,2)
  scene.add(mesh);
}

function hexToRgb(str) { 
  if ( /^#([0-9a-f]{3}|[0-9a-f]{6})$/ig.test(str) ) { 
      var hex = str.substr(1);
      hex = hex.length == 3 ? hex.replace(/(.)/g, '$1$1') : hex;
      var rgb = parseInt(hex, 16);               
      //return 'rgb(' + [(rgb >> 16) & 255, (rgb >> 8) & 255, rgb & 255].join(',') + ')';
      return {
        r:((rgb >> 16) & 255),
        g:( (rgb >> 8) & 255),
        b:(rgb & 255)
      }
  } 

  return false; 
}

function createGUI(){
  const gui = new GUI();
  gui.add(gridHelper,'visible').name('gridHelper')
  const noiseFolder = gui.addFolder('Noise')
  noiseFolder.add(params,'seed',0,10000)
  noiseFolder.add(params.terrain,'scale',0,100,0.01)
  noiseFolder.add(params.terrain,'magnitude',0,1,0.01)
  noiseFolder.add(params.terrain,'offset',0,1,0.01)

  const colorFolder = gui.addFolder('Color')
  colorFolder.add(params.color,'r',0,255,1).listen()
  colorFolder.add(params.color,'b',0,255,1).listen()
  colorFolder.add(params.color,'g',0,255,1).listen()
  // https://discourse.threejs.org/t/setting-color-in-3js-code-vs-what-lil-gui-uses/67907/2
  // 
  colorFolder.addColor(params,'color',255).onChange(value=>{
    //console.log(value);
    //console.log(value)
    //let rbg =hexToRgb('#'+value)
    //console.log(rbg);

  })


  gui.onChange(()=>{
    generateTexture();
    if(canvasTexture){
      canvasTexture.needsUpdate=true
    }
    
  });
}

function setup_Helpers(){
  const size = 10;
  const divisions = 10;

  gridHelper = new THREE.GridHelper( size, divisions );
  scene.add( gridHelper );
}

function setup_scene(){

  setup_Helpers();
  setupSprite2DTexture();

  van.add(document.body, stats.dom);
  van.add(document.body, renderer.domElement);
  
  renderer.setAnimationLoop( animate );
  createGUI();
}

function animate() {

  // if(myObject.isRotate){
  //   cube.rotation.x += 0.01;
	//   cube.rotation.y += 0.01;
  // }
	
  stats.update();
  controls.update();
	renderer.render( scene, camera );
}


setup_scene()
