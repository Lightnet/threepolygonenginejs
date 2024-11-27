/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/
// tile map by cols and rows select image to render.
// comment out the animations for stand alone animation
// turn into class for animation

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

class Sprite2DTileMap{
  isLoop=false;
  isPlay=false;
  playSpriteIndices=[];
  runningTileArrayIndex=0;
  currentTile=0;
  maxDisplayTime=0;
  elapsedTime=0;

  constructor(args={}){

    let texturePath = args?.path || '/textures/characters/small_8_direction_characters.png';
    let cols = args?.cols || 1;
    let rows = args?.rows || 1;

    this.width = args?.width || 1;
    this.height = args?.height || 1;

    this.cols = cols;
    this.rows = rows;

    let mapTexture = new THREE.TextureLoader().load(texturePath);
    mapTexture.magFilter = THREE.NearestFilter;
    mapTexture.wrapS = THREE.RepeatWrapping;
    mapTexture.wrapT = THREE.RepeatWrapping;
    mapTexture.repeat.set(
      1/cols,
      1/rows
    ); // MAP TILE cols and rows
    this.mapTexture = mapTexture;

    const spritePlane = new THREE.PlaneGeometry(this.width, this.height);
    this.spritePlane = spritePlane;

    const spriteMaterial = new THREE.MeshBasicMaterial({
      map: mapTexture,
      side: THREE.DoubleSide,
      transparent:true,
    });
    this.spriteMaterial = spriteMaterial;

    const mesh = new THREE.Mesh(spritePlane, spriteMaterial);
    mesh.scale.set(2,2,2)
    this.mesh = mesh;
  }

  textureTileMapIdx(index){
    const cols = this.cols;
    const rows = this.rows;
    const col = index % cols;
    const row = Math.floor( index / cols );

    this.mapTexture.offset.x = col / cols;
    this.mapTexture.offset.y = 1 - ( ( 1 + row ) / rows );
  }

  loopPlay(playSpriteIndices, totalDuration){
    this.isLoop=true;
    this.playSpriteIndices = playSpriteIndices;
    this.runningTileArrayIndex = 0;
    this.currentTile = playSpriteIndices[this.runningTileArrayIndex];
    this.maxDisplayTime = totalDuration / this.playSpriteIndices.length;
    this.isPlay = true;
    //console.log(myObject);
  }

  oncePlay(playSpriteIndices, totalDuration){
    this.isLoop=false;
    this.playSpriteIndices = playSpriteIndices;
    this.runningTileArrayIndex = 0;
    this.currentTile = playSpriteIndices[this.runningTileArrayIndex];
    this.maxDisplayTime = totalDuration / this.playSpriteIndices.length;
    this.isPlay = true;
    //console.log(myObject);
  }

  update(dt){
    if (!this.isPlay) return;
    this.elapsedTime += dt;
    if(this.maxDisplayTime > 0 && this.elapsedTime >= this.maxDisplayTime){
      this.elapsedTime = 0;
      if(this.isLoop){
        console.log("loop...")
        this.runningTileArrayIndex = (this.runningTileArrayIndex + 1) % this.playSpriteIndices.length;
      }else{
        
        let index = this.runningTileArrayIndex + 1
        console.log("once... index: ", index ," LEN:", this.playSpriteIndices.length)
        if (index >= this.playSpriteIndices.length){
          index = this.playSpriteIndices.length
          this.isPlay = false;
          console.log("Finish...")
        }
        this.runningTileArrayIndex = (index) % this.playSpriteIndices.length;
      }
      
      this.currentTile = this.playSpriteIndices[this.runningTileArrayIndex];
      this.textureTileMapIdx(this.currentTile)
    }
  }

}

var playerSprite2d;

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
  isLoop:true,
  play_up:function(){
    //loopPlay([8,16,24], 1.5); //up
    playerSprite2d.loopPlay([8,16,24], 1.5);
  },
  play_down:function(){
    //loopPlay([12,20,28], 1.5);
    playerSprite2d.loopPlay([12,20,28], 1.5);
  },
  play_right:function(){
    //loopPlay([10,18,26], 1.5);
    playerSprite2d.loopPlay([10,18,26], 1.5);
  },
  play_left:function(){
    console.log("loop")
    //loopPlay([14,22,30], 1.5);
    playerSprite2d.loopPlay([14,22,30], 1.5);
  },
  once_play_left:function(){
    console.log("once")
    //oncePlay([14,22,30], 1.5);
    playerSprite2d.oncePlay([14,22,30], 1.5);
  },
}

// var mapTexture;
// function create_sprite(){
//   mapTexture = new THREE.TextureLoader().load( '/textures/characters/small_8_direction_characters.png' );
//   // PIXEL IMAGE
//   mapTexture.magFilter = THREE.NearestFilter;
//   mapTexture.wrapS = THREE.RepeatWrapping;
//   mapTexture.wrapT = THREE.RepeatWrapping;
//   //mapTexture.repeat.set(1, 1);
//   mapTexture.repeat.set(1/myObject.tile.cols, 1/myObject.tile.rows); // MAP TILE cols and rows
//   //mapTexture.offset.x = 0.0125; // MAP TILE X
//   //mapTexture.offset.y = 0.5; // MAP TILE Y
//   const spritePlane = new THREE.PlaneGeometry(2, 2);
//   const spriteMaterial = new THREE.MeshBasicMaterial({
//     map: mapTexture,
//     side: THREE.DoubleSide,
//     transparent:true,
//   });
//   const mesh = new THREE.Mesh(spritePlane, spriteMaterial);
//   mesh.scale.set(2,2,2)
//   scene.add(mesh);
// }

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
  // if(myObject.isPlay){
  //   updateAnimation(dt);
  // }
  if(playerSprite2d){
    playerSprite2d.update(dt);
  }
  
  stats.update();
  controls.update();
	renderer.render( scene, camera );
}

function createGUI(){
  const gui = new GUI();
  gui.add(myObject,'deltaTime').listen().disable();
  const tileMapFolder = gui.addFolder('Tile Map')

  // tileMapFolder.add(mapTexture.offset,'x',0 , 1 , 0.01).name('Offset x:').listen();
  // tileMapFolder.add(mapTexture.offset,'y',0 , 1 , 0.01).name('Offset y:').listen();

  // tileMapFolder.add(myObject.tile,'cols',1 , 32 , 1).name('Cols:').onChange( value => {
  //   mapTexture.repeat.x = 1 / value;
  // });
  // tileMapFolder.add(myObject.tile,'rows',1 , 32 , 1).name('Rows:').onChange( value => {
  //   mapTexture.repeat.y = 1 / value;
  // });

  // tileMapFolder.add(myObject,'currentTileIndex', 0 , myObject.maxTile , 1).name('Image Index:').onChange( value => {
  //   textureTileMapIdx(value);
  // });
  const animationFolder = gui.addFolder('Animation')
  
  animationFolder.add(myObject,'play_up');
  animationFolder.add(myObject,'play_down');
  animationFolder.add(myObject,'play_right');
  animationFolder.add(myObject,'play_left');

  animationFolder.add(myObject,'once_play_left');

  animationFolder.add(myObject,'runningTileArrayIndex').listen();
  animationFolder.add(myObject,'currentTile').listen();
  animationFolder.add(myObject,'elapsedTime').listen().disable();
  animationFolder.add(myObject,'maxDisplayTime');
  // animationFolder.add(myObject,'maxDisplayTime').onChange( value => {
  //   myObject.totalDuration = value;
  // });

  animationFolder.add(myObject,'isPlay');
  animationFolder.add(myObject,'isLoop').listen();
}

// function textureTileMapIdx(index){
//   const cols = myObject.tile.cols;
//   const rows = myObject.tile.rows;
//   const col = index % cols;
//   const row = Math.floor( index / cols );
//   myObject.offset.x = col / cols
//   myObject.offset.y = 1 - ( ( 1 + row ) / rows )
//   mapTexture.offset.x = col / cols;
//   mapTexture.offset.y = 1 - ( ( 1 + row ) / rows );
// }

// function onKeyDown(event){
// }
// function onKeyUp(event){
// }

// function loopPlay(playSpriteIndices, totalDuration){
//   myObject.isLoop=true;
//   myObject.playSpriteIndices = playSpriteIndices;
//   myObject.runningTileArrayIndex = 0;
//   myObject.currentTile = playSpriteIndices[myObject.runningTileArrayIndex];
//   myObject.maxDisplayTime = totalDuration / myObject.playSpriteIndices.length;
//   myObject.isPlay = true;
//   //console.log(myObject);
// }

// function oncePlay(playSpriteIndices, totalDuration){
//   myObject.isLoop=false;
//   myObject.playSpriteIndices = playSpriteIndices;
//   myObject.runningTileArrayIndex = 0;
//   myObject.currentTile = playSpriteIndices[myObject.runningTileArrayIndex];
//   myObject.maxDisplayTime = totalDuration / myObject.playSpriteIndices.length;
//   myObject.isPlay = true;
//   //console.log(myObject);
// }

// let elapsedTime = 0;
// function updateAnimation(dt){
//   //console.log(dt)
//   elapsedTime += dt;
//   myObject.elapsedTime = elapsedTime.toFixed(4);//gui debug
//   //console.log(myObject.maxDisplayTime);
//   if(myObject.maxDisplayTime > 0 && elapsedTime >= myObject.maxDisplayTime){
//     elapsedTime = 0;
//     if(myObject.isLoop){
//       console.log("loop...")
//       myObject.runningTileArrayIndex = (myObject.runningTileArrayIndex + 1) % myObject.playSpriteIndices.length;
//     }else{
      
//       let index = myObject.runningTileArrayIndex + 1
//       console.log("once... index: ", index ," LEN:", myObject.playSpriteIndices.length)
//       if (index >= myObject.playSpriteIndices.length){
//         index = myObject.playSpriteIndices.length
//         myObject.isPlay = false;
//         console.log("Finish...")
//       }
//       myObject.runningTileArrayIndex = (index) % myObject.playSpriteIndices.length;
//     }
    
//     myObject.currentTile = myObject.playSpriteIndices[myObject.runningTileArrayIndex];
//     textureTileMapIdx(myObject.currentTile)
//   }
// }

function setup_scene(){

  //create_sprite();
  setup_Helpers();

  playerSprite2d = new Sprite2DTileMap({
    cols:8,
    rows:12,
  });

  scene.add(playerSprite2d.mesh);

  van.add(document.body, stats.dom);
  van.add(document.body, renderer.domElement);
  
  renderer.setAnimationLoop( animate );
  createGUI();

  //loopPlay([0,1,2,3,4], 1.5);
  loopPlay([8,16,24], 1.5); //up
}

setup_scene()