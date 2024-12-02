/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

import van from "https://cdn.jsdelivr.net/npm/vanjs-core@1.5.2/src/van.min.js";
import * as THREE from 'https://unpkg.com/three@0.170.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.170.0/examples/jsm/controls/OrbitControls.js';
import Stats from 'https://unpkg.com/three@0.170.0/examples/jsm/libs/stats.module.js';
//import { GUI } from 'https://unpkg.com/three@0.170.0/examples/jsm/libs/lil-gui.module.min.js';
import { Pane } from 'https://cdn.jsdelivr.net/npm/tweakpane@4.0.5/dist/tweakpane.min.js';
import SpriteAnimation2DTileMap from './spriteanimation2dtilemap.js';
import ProgressBar2D from "./progressbar2d.js";
import CanvasText2D from "./canvastext2d.js";

const {div,style} = van.tags;

const players = [];
const enemies = [];

var gridHelper;
const stats = new Stats();

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
//camera.position.z = 5;
camera.position.set(0, 0, 5);

const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor( 0x80a0e0);

window.addEventListener('resize', function(event) {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
});

// const geometry = new THREE.BoxGeometry( 1, 1, 1 );
// const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
// const cube = new THREE.Mesh( geometry, material );
// scene.add( cube );

var clock = new THREE.Clock();
var controls = new OrbitControls( camera, renderer.domElement );

function setup_Helpers(){
  const size = 10;
  const divisions = 10;

  gridHelper = new THREE.GridHelper( size, divisions );
  scene.add( gridHelper );
}

const myObject ={
  isRotate:true,
  test:()=>{
    console.log('test');
  },
  resetRotation(){
    cube.rotation.set(0,0,0)
  },
  playerAttack(){
    console.log('attack 1');
    players[0].isAttack=true;
    players[0].animationPlayer.oncePlay([14,22,30], 1.5);
  },
  enemyAttack(){
    console.log('attack 2');
    enemies[0].isAttack=true;
    enemies[0].animationPlayer.oncePlay([14,22,30], 1.5);
  }
}

function createTweakPane(){
  const myStyle = style(`
    /* Default wrapper view */
    .yourCustomContainer .tp-dfwv {
      min-width: 360px;
    }   
    `);
  van.add(document.body,myStyle)

  const pane = new Pane({
    title: 'Parameters',
    expanded: true,
  });

  const debugFolder = pane.addFolder({title: 'Debug',expanded: true,});
  debugFolder.addBinding(gridHelper, 'visible',{
    label:'Grid Helper'
    // options:{//list
    //   label:'test'
    // }
  })

  const orbitControlsFolder = pane.addFolder({title: 'Orbit Controls',expanded: false});
  orbitControlsFolder.addBinding(controls, 'autoRotate');
  orbitControlsFolder.addBinding(controls, 'autoRotateSpeed');
  orbitControlsFolder.addBinding(controls, 'dampingFactor');
  orbitControlsFolder.addBinding(controls, 'enableDamping');
  orbitControlsFolder.addBinding(controls, 'enablePan');
  orbitControlsFolder.addBinding(controls, 'enableRotate');
  orbitControlsFolder.addBinding(controls, 'enableZoom');
  orbitControlsFolder.addBinding(controls, 'panSpeed');
  orbitControlsFolder.addBinding(controls, 'rotateSpeed');
  orbitControlsFolder.addBinding(controls, 'screenSpacePanning');
  orbitControlsFolder.addBinding(controls, 'zoomToCursor');
  orbitControlsFolder.addBinding(controls, 'enabled');

  const playerFolder = pane.addFolder({title: 'Player',expanded: true});
  const playerAttack = playerFolder.addButton({title:'Attack'})
  playerAttack.on('click', () => {
    console.log('test')
    myObject.playerAttack();
  });

  const enemyFolder = pane.addFolder({title: 'Enemy',expanded: true});
  const enemyAttack = enemyFolder.addButton({title:'Attack'})
  enemyAttack.on('click', () => {
    console.log('test')
    myObject.enemyAttack();
  });
}

// function createGUI(){
//   const gui = new GUI();
//   gui.add(myObject,'test')
//   const debugFolder = gui.addFolder('Debug')
//   debugFolder.add(gridHelper,'visible').name('is Grid')
//   //debugFolder.add(gridHelper,'visible').name('is Grid')
//   const orbitControlsFolder = gui.addFolder('Orbit Controls').show(false)
//   orbitControlsFolder.add(controls, 'autoRotate')
//   orbitControlsFolder.add(controls, 'autoRotateSpeed')
//   orbitControlsFolder.add(controls, 'dampingFactor')
//   orbitControlsFolder.add(controls, 'enableDamping')
//   orbitControlsFolder.add(controls, 'enablePan')
//   orbitControlsFolder.add(controls, 'enableRotate')
//   orbitControlsFolder.add(controls, 'enableZoom')
//   orbitControlsFolder.add(controls, 'panSpeed')
//   orbitControlsFolder.add(controls, 'rotateSpeed')
//   orbitControlsFolder.add(controls, 'screenSpacePanning')
//   orbitControlsFolder.add(controls, 'zoomToCursor')
//   orbitControlsFolder.add(controls, 'enabled')
  
//   //const cubeFolder = gui.addFolder('Cube').show(false);
//   // cubeFolder.add(cube,'visible')
//   // cubeFolder.add(myObject,'isRotate')
//   // cubeFolder.add(myObject,'resetRotation')

//   const battleFolder = gui.addFolder('Battle').show();
//   battleFolder.add(myObject,'playerAttack')
//   battleFolder.add(myObject,'enemyAttack')
// }
var progressBar;
var canvasText;

function createCharacter(args={}){
  let x = args.x || 0;
  let y = args.y || 0;
  let z = args.z || 0;

  let playerSprite2D = new SpriteAnimation2DTileMap();
  playerSprite2D.mesh.position.set(x,y,z);
  scene.add(playerSprite2D.mesh);

  let cText2d = new CanvasText2D();
  cText2d.setText('10/10');
  cText2d.mesh.position.set(x,y+1,z+0.1)
  scene.add(cText2d.mesh);

  return {
    id:"",
    health:10,
    attack:1,
    animationPlayer:playerSprite2D,
    text2d:cText2d,
    animationState:"idle",
    isAttack:false,
    isHurt:false,
    isFinish:false,
    target:0,
  }
}


function setupEntities(){

  let tmpPlayer = createCharacter({
    x:-2,
    y:0,
    z:0,
  });

  players.push(tmpPlayer)

  let tmpEnemy =createCharacter({
    x:2,
    y:0,
    z:0,
  });

  enemies.push(tmpEnemy)

  // progressBar = new ProgressBar2D();
  // scene.add(progressBar.mesh);
  // console.log("progressBar.mesh: ", progressBar.mesh)

  // canvasText = new CanvasText2D();
  // canvasText.setText('Hello World');
  // canvasText.mesh.position.set(0,0,0.1)
  // scene.add(canvasText.mesh);

}
let pcount = 0;
function updateProgressBar(){
  pcount++;
  if(pcount>100){
    pcount = 0;
  }
  progressBar.update();
  progressBar.setPercent(pcount)
}

function updateAnimationPlayer(dt){
  for(const pa of  players){
    pa.animationPlayer.update(dt)
    if((pa.isAttack==true)&&
      (pa.animationPlayer.isPlay == false)&&
      (pa.animationPlayer.isLoop == false)
    ){
      pa.isAttack=false;
      console.log("END...")
      enemies[0].health -= pa.attack;
      enemies[0].text2d.setText(`${enemies[0].health}/10`);
    }
  }

  for(const pa of enemies){
    pa.animationPlayer.update(dt)
    if((pa.isAttack==true)&&
      (pa.animationPlayer.isPlay == false)&&
      (pa.animationPlayer.isLoop == false)
    ){
      pa.isAttack=false;
      console.log("END...")
      console.log("END...")
      players[0].health -= pa.attack;
      players[0].text2d.setText(`${players[0].health}/10`);
    }
  }
}

function setupLights(){
  const light1 = new THREE.DirectionalLight();
  light1.position.set(1, 1, 1);
  scene.add( light1 );

  const light2 = new THREE.DirectionalLight();
  light2.position.set(-1, 1, -0.5);
  scene.add( light2 );

  const ambient = new THREE.AmbientLight();
  ambient.intensity = 0.1;
  scene.add( light1 );
}

function setupScene(){
  setupLights()
  setup_Helpers();

  setupEntities();

  van.add(document.body, stats.dom);
  van.add(document.body, renderer.domElement);
  
  renderer.setAnimationLoop( animate );
  //createGUI();
  createTweakPane();
}

function animate() {
  const delta = clock.getDelta()
  // if(myObject.isRotate){
  //   cube.rotation.x += 0.01;
	//   cube.rotation.y += 0.01;
  // }
  //updateProgressBar();
  updateAnimationPlayer(delta)
	
  stats.update();
  controls.update();
	renderer.render( scene, camera );
}

setupScene()