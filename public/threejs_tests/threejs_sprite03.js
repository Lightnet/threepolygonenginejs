/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/
// tile map by cols and rows select image to render.
// movement test

// three.js Sprite Animation - Implement a Sprite Flipbook / Sprite Mixer
// https://www.youtube.com/watch?v=pGO1Hm-JB90&t=83s
// https://discourse.threejs.org/t/how-to-draw-a-tilemap-in-three-js/5553/4
// https://threejs.org/docs/#api/en/objects/Sprite
// https://en.threejs-university.com/2021/08/03/chapter-7-sprites-and-particles-in-three-js/
// https://threejs.org/docs/?q=PlaneGeometry#api/en/geometries/PlaneGeometry
// https://discourse.threejs.org/t/texture-blur-when-using-pixelart-three-js-editor/32535
// 
// 

import van from "https://cdn.jsdelivr.net/npm/vanjs-core@1.5.2/src/van.min.js";
import * as THREE from 'https://unpkg.com/three@0.170.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.170.0/examples/jsm/controls/OrbitControls.js';
import Stats from 'https://unpkg.com/three@0.170.0/examples/jsm/libs/stats.module.js';
import { GUI } from 'https://unpkg.com/three@0.170.0/examples/jsm/libs/lil-gui.module.min.js';

const {div,style} = van.tags;

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
  deltaTime:0,
  offset:{
    x:0,
    y:0,
  },
  tile:{
    cols:8,
    rows:12,
  },
  maxTile: 8*12,
  currentTileIndex:0,
  test:()=>{
    console.log('test');
  },
  isPlay:false,
  playSpriteIndices:[],
  runningTileArrayIndex:0,
  currentTile:0,
  maxDisplayTime:1.5,
  elapsedTime:0,
  play_up:function(){
    loopPlay([8,16,24], 1.5); //up
  },
  play_down:function(){
    loopPlay([12,20,28], 1.5);
  },
  play_right:function(){
    loopPlay([10,18,26], 1.5);
  },
  play_left:function(){
    loopPlay([14,22,30], 1.5);
  },
}

var mapTexture;
function create_sprite(){
  mapTexture = new THREE.TextureLoader().load( '/textures/characters/small_8_direction_characters.png' );
  // PIXEL IMAGE
  mapTexture.magFilter = THREE.NearestFilter;
  mapTexture.wrapS = THREE.RepeatWrapping;
  mapTexture.wrapT = THREE.RepeatWrapping;
  //mapTexture.repeat.set(1, 1);
  mapTexture.repeat.set(1/myObject.tile.cols, 1/myObject.tile.rows); // MAP TILE cols and rows
  //mapTexture.offset.x = 0.0125; // MAP TILE X
  //mapTexture.offset.y = 0.5; // MAP TILE Y

  const spritePlane = new THREE.PlaneGeometry(2, 2);
  const spriteMaterial = new THREE.MeshBasicMaterial({
    map: mapTexture,
    side: THREE.DoubleSide,
    transparent:true,
  });
  const mesh = new THREE.Mesh(spritePlane, spriteMaterial);
  mesh.scale.set(2,2,2)
  scene.add(mesh);
}

function setup_Helpers(){
  const size = 10;
  const divisions = 10;

  const gridHelper = new THREE.GridHelper( size, divisions );
  scene.add( gridHelper );
}

var clock = new THREE.Clock();
var controls = new OrbitControls( camera, renderer.domElement );
function animate() {
  let dt = clock.getDelta();
  myObject.deltaTime = dt.toFixed(6);
  if(myObject.isPlay){
    updateAnimation(dt);
  }
  
  stats.update();
  controls.update();

	renderer.render( scene, camera );
}

function createGUI(){
  const gui = new GUI();
  gui.add(myObject,'deltaTime').listen().disable();
  const tileMapFolder = gui.addFolder('Tile Map')

  tileMapFolder.add(mapTexture.offset,'x',0 , 1 , 0.01).name('Offset x:').listen();
  tileMapFolder.add(mapTexture.offset,'y',0 , 1 , 0.01).name('Offset y:').listen();

  tileMapFolder.add(myObject.tile,'cols',1 , 32 , 1).name('Cols:').onChange( value => {
    mapTexture.repeat.x = 1 / value;
  });
  tileMapFolder.add(myObject.tile,'rows',1 , 32 , 1).name('Rows:').onChange( value => {
    mapTexture.repeat.y = 1 / value;
  });

  tileMapFolder.add(myObject,'currentTileIndex', 0 , myObject.maxTile , 1).name('Image Index:').onChange( value => {
    textureTileMapIdx(value);
  });
  const animationFolder = gui.addFolder('Animation')
  
  animationFolder.add(myObject,'play_up');
  animationFolder.add(myObject,'play_down');
  animationFolder.add(myObject,'play_right');
  animationFolder.add(myObject,'play_left');

  animationFolder.add(myObject,'runningTileArrayIndex').listen();
  animationFolder.add(myObject,'currentTile').listen();
  animationFolder.add(myObject,'elapsedTime').listen().disable();
  animationFolder.add(myObject,'maxDisplayTime');
  // animationFolder.add(myObject,'maxDisplayTime').onChange( value => {
  //   myObject.totalDuration = value;
  // });

  animationFolder.add(myObject,'isPlay');
}

function textureTileMapIdx(index){
  const cols = myObject.tile.cols;
  const rows = myObject.tile.rows;
  
  const col = index % cols;
  const row = Math.floor( index / cols );
  myObject.offset.x = col / cols
  myObject.offset.y = 1 - ( ( 1 + row ) / rows )
  mapTexture.offset.x = col / cols;
  mapTexture.offset.y = 1 - ( ( 1 + row ) / rows );
}

function onKeyDown(event){

}

function onKeyUp(event){

}

function loopPlay(playSpriteIndices, totalDuration){
  myObject.playSpriteIndices = playSpriteIndices;
  myObject.runningTileArrayIndex = 0;
  myObject.currentTile = playSpriteIndices[myObject.runningTileArrayIndex];
  myObject.maxDisplayTime = totalDuration / myObject.playSpriteIndices.length;
  //console.log(myObject);
}

let elapsedTime = 0;
function updateAnimation(dt){
  //console.log(dt)
  elapsedTime += dt;
  myObject.elapsedTime = elapsedTime.toFixed(4);//gui debug
  //console.log(myObject.maxDisplayTime);
  if(myObject.maxDisplayTime > 0 && elapsedTime >= myObject.maxDisplayTime){
    elapsedTime = 0;
    myObject.runningTileArrayIndex = (myObject.runningTileArrayIndex + 1) % myObject.playSpriteIndices.length;
    myObject.currentTile = myObject.playSpriteIndices[myObject.runningTileArrayIndex];
    textureTileMapIdx(myObject.currentTile)
  }
}

function setup_scene(){

  create_sprite();
  setup_Helpers();

  van.add(document.body, stats.dom);
  van.add(document.body, renderer.domElement);
  
  renderer.setAnimationLoop( animate );
  createGUI();

  //loopPlay([0,1,2,3,4], 1.5);
  loopPlay([8,16,24], 1.5); //up
}

setup_scene()