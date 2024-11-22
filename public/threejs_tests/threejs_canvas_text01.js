/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/
//simple test tile map

// three.js Sprite Animation - Implement a Sprite Flipbook / Sprite Mixer
// https://www.youtube.com/watch?v=pGO1Hm-JB90&t=83s
// https://threejs.org/docs/#api/en/objects/Sprite
// https://en.threejs-university.com/2021/08/03/chapter-7-sprites-and-particles-in-three-js/
// https://threejs.org/docs/?q=PlaneGeometry#api/en/geometries/PlaneGeometry
// https://discourse.threejs.org/t/texture-blur-when-using-pixelart-three-js-editor/32535
// https://threejs.org/docs/#api/en/textures/CanvasTexture

import van from "https://cdn.jsdelivr.net/npm/vanjs-core@1.5.2/src/van.min.js";
import * as THREE from 'https://unpkg.com/three@0.170.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.170.0/examples/jsm/controls/OrbitControls.js';
import Stats from 'https://unpkg.com/three@0.170.0/examples/jsm/libs/stats.module.js';
import { GUI } from 'https://unpkg.com/three@0.170.0/examples/jsm/libs/lil-gui.module.min.js';

const {div, style, canvas} = van.tags;
const stats = new Stats();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setClearColor( 0x80a0e0);
renderer.setSize( window.innerWidth, window.innerHeight );
window.addEventListener('resize', function(event) {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
});

const myObject ={
  offset:{
    x:0,
    y:0,
  },
  tile:{
    x:8,
    y:12,
  },
  test:()=>{
    console.log('test');
  }
}

var mapTexture;
var canvasTexture;
var myCanvas;
// https://dustinpfister.github.io/2018/04/17/threejs-canvas-texture/
// https://threejs.org/docs/#api/en/textures/CanvasTexture
function create_sprite(){


  myCanvas = canvas();
  //const context = myCanvas.getContext("2d")
  const ctx = myCanvas.getContext("2d")
  console.log("ctx: ",ctx);
  myCanvas.width = 256;
  myCanvas.height = 256;
  ctx.fillStyle = '#0000ff';
  // ctx.fillRect(0, 0, myCanvas.width, myCanvas.height);
  // ctx.strokeStyle = '#ff00ff';
  // ctx.strokeRect(0, 0, myCanvas.width, myCanvas.height);

  canvasTexture = new THREE.CanvasTexture(myCanvas);

  ctx.font = "24px serif";
  ctx.fillStyle = "purple";
  ctx.fillText("Hello world", 3, 20);

  canvasTexture.needsUpdate = true;
  // PIXEL IMAGE
  canvasTexture.magFilter = THREE.NearestFilter;
  canvasTexture.wrapS = THREE.RepeatWrapping;
  canvasTexture.wrapT = THREE.RepeatWrapping;
  //console.log(canvasTexture);
  //console.log(canvasTexture.image);
  //ok
  //const context =canvasTexture.image.getContext("2d");
  //console.log("context: ",context)
  //context.fillStyle = '#000fff';
  //context.fillRect(0, 0, myCanvas.width, myCanvas.height);

  // method 1 - update texture change
  // var canvasTexture = new THREE.CanvasTexture(canvas);
  // method 2 - need update mannual
  // var canvasTexture = new THREE.Texture(canvas);
  // texture.needsUpdate = true;

  var canvasMaterial = new THREE.MeshBasicMaterial({
    map: canvasTexture,
    transparent:true
  });

  // var canvasMaterial = new THREE.MeshLambertMaterial({
  //   emissive: new THREE.Color(0xffffff),
  //   emissiveMap: canvasTexture
  // });


  // mapTexture = new THREE.TextureLoader().load( '/textures/characters/small_8_direction_characters.png' );
  // // PIXEL IMAGE
  // mapTexture.magFilter = THREE.NearestFilter;
  // mapTexture.wrapS = THREE.RepeatWrapping;
  // mapTexture.wrapT = THREE.RepeatWrapping;
  // //mapTexture.repeat.set(1, 1);
  // mapTexture.repeat.set(1/myObject.tile.x, 1/myObject.tile.y);// TILE MAP
  // //mapTexture.offset.x = 0.0125; // TILE MAP X
  // //mapTexture.offset.y = 0.5; // TILE MAP Y

  //const spritePlane = new THREE.PlaneGeometry(2, 2);
  // const spriteMaterial = new THREE.MeshBasicMaterial({
  //   map: mapTexture,
  //   side: THREE.DoubleSide,
  //   transparent:true,
  // });
  //const mesh = new THREE.Mesh(spritePlane, spriteMaterial);

  const spritePlane = new THREE.PlaneGeometry(2, 2);
  const mesh = new THREE.Mesh(spritePlane, canvasMaterial);
  mesh.scale.set(2,2,2)
  scene.add(mesh);
}

function setup_Helpers(){
  const size = 10;
  const divisions = 10;

  const gridHelper = new THREE.GridHelper( size, divisions );
  scene.add( gridHelper );
}

//var clock = new THREE.Clock();
var controls = new OrbitControls( camera, renderer.domElement );
function animate() {

  stats.update();
  controls.update();
  updateCanvasTexture();

	renderer.render( scene, camera );
}

function createGUI(){
  const gui = new GUI();
  //gui.add(myObject,'test')
  const tileMapFolder = gui.addFolder('Tile Map')

  //tileMapFolder.add(mapTexture.offset,'x',0 , 1 , 0.01).name('Offset x:')
  //tileMapFolder.add(mapTexture.offset,'y',0 , 1 , 0.01).name('Offset y:')

  // tileMapFolder.add(myObject.tile,'x',1 , 16 , 1).name('Tile x:').onChange( value => {
  //   mapTexture.repeat.x = 1 / value;
  // });
  // tileMapFolder.add(myObject.tile,'y',1 , 16 , 1).name('Tile y:').onChange( value => {
  //   mapTexture.repeat.y = 1 / value;
  // });
}

let count=0;
let countText=0;
function updateCanvasTexture(){
  count++
  //console.log(count);
  if(count > 30){
    count=0;
    countText++;
    if(countText> 30){
      countText=0
    }
    //console.log(countText)
    //reason texture need to update version draw
    canvasTexture.needsUpdate = true;//update text
    // methods 1
    const context = myCanvas.getContext("2d")
    // methods 2
    //const context =canvasTexture.image.getContext("2d");

    context.clearRect(0, 0, 256, 256);
    context.font = "24px serif";
    context.fillStyle = "purple";
    let text = "Hello world "+countText
    context.fillText(text, 3, 20);

  }
}

function setup_scene(){

  create_sprite();
  setup_Helpers();

  van.add(document.body, stats.dom);
  van.add(document.body, renderer.domElement);
  
  renderer.setAnimationLoop( animate );
  createGUI();
}

setup_scene()