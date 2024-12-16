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
//import { customAlphabet } from 'https://cdn.jsdelivr.net/npm/nanoid/nanoid.js'
//import nanoid from 'https://cdn.jsdelivr.net/npm/nanoid@5.0.9/+esm'
import { customAlphabet } from 'https://cdn.jsdelivr.net/npm/nanoid@5.0.9/+esm'

import SpriteAnimation2DTileMap from './spriteanimation2dtilemap.js';
import ProgressBar2D from "./progressbar2d.js";
import CanvasText2D from "./canvastext2d.js";

const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 10);
//abcdefghijklmnopqrstuvwxyz
//ABCDEFGHIJKLMNOPQRSTUVWXYZ

const {div,style} = van.tags;

const players = [];
const enemies = [];

var gridHelper;
const stats = new Stats();

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
//camera.position.z = 5;
camera.position.set(0, 2, 5);

const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor( 0x80a0e0);

var clock = new THREE.Clock();
var controls = new OrbitControls( camera, renderer.domElement );

window.addEventListener('resize', function(event) {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
});
//===============================================

//===============================================

function createMeshBox(args={}){
  //args = args || {};
  const width = args?.width || 1;
  const height = args?.height || 1;
  const depth = args?.depth || 1;
  //const color = args?.color || 0x00ff00;

  const x = args?.x || 0;
  const y = args?.y || 0;
  const z = args?.z || 0;

  const texture = new THREE.TextureLoader().load('/textures/prototypes/dark/texture_01.png' ); 
  const material = new THREE.MeshBasicMaterial({
    //color: 0x00ff00,
    map:texture,
  });
  //const geometry = new THREE.BoxGeometry( 1, 1, 1 );
  const geometry = new THREE.BoxGeometry( width, height, depth );
  
  const mesh = new THREE.Mesh( geometry, material );
  mesh.position.set(x,y,z);

  return mesh;
}

//===============================================
// HELPER
//===============================================
function setupHelpers(){
  const size = 10;
  const divisions = 10;

  gridHelper = new THREE.GridHelper( size, divisions );
  scene.add( gridHelper );
}

const myObject ={
  isRotate:true,
  memberid:"",
  health:0,
  attack:0,
  animationState:"idle",
  isAttack:false,
  isHurt:false,
  isFinish:false,
  target:0,
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
var gamemenu;
function createTweakPane(){
  const myStyle = style(`
    /* Default wrapper view */
    .yourCustomContainer .tp-dfwv {
      min-width: 360px;
    }   
    `);
  van.add(document.body,myStyle)

  const divGame = div({
    class:`yourCustomContainer`,
    style:`
position:fixed;
top:64px;
left:20px;    
    `
  })
  van.add(document.body,divGame);
//===============================================
// GAME
//===============================================

  gamemenu = new Pane({
    title: 'Menu',
    expanded: true,
    container:divGame
  });

  const cheatsFolder = gamemenu.addFolder({title: 'Cheats',expanded: false,});
  cheatsFolder.addButton({title:'Full Heal'})
  //cheatsFolder.addButton({title:'Full Heal'})
  //cheatsFolder.addButton({title:'Add Potions'})
  cheatsFolder.addButton({title:'Add Item'})
  const mapFolder = gamemenu.addFolder({title: 'Map',expanded: false,});
  mapFolder.addButton({title:'World'});
  mapFolder.addButton({title:'Scenes'});

  const inventoryFolder = gamemenu.addFolder({title: 'Inventory',expanded: false,});
  inventoryFolder.addButton({title:'Refresh'});

  const partyFolder = gamemenu.addFolder({title: 'Party',expanded: false,});
  partyFolder.addButton({title:'Add'});
  partyFolder.addButton({title:'Remove'});
  partyFolder.addButton({title:'Refresh'});

  const partiesFolder = gamemenu.addFolder({title: 'Parties',expanded: true,});
  let mylist;
  partiesFolder.addButton({title:'Update'}).on('click', () => {
    let members = [];
    let count = 0;
    for(const player of players){
      count++;
      members.push({
        text:"Member "+ count,
        value:player.id,
      })
    }

    mylist.options= members;
  });
  // partiesFolder.addButton({title:'Clear'}).on('click', () => {
  //   mylist.dispose();
  // });
  mylist = partiesFolder.addBlade({
    view: 'list',
    label: 'Members',
    options: [],
    value: 'memberid',
  });
  console.log(partiesFolder)
  mylist.on('change', (ev) => {
    myObject.memberid = ev.value;
    for(const player of players){
      if(player.id == ev.value){
        myObject.health = player.health;
        myObject.isAttack = player.isAttack;
        myObject.isHurt = player.isHurt;
        myObject.isFinish = player.isFinish;
        break;
      }
    }
  });

  const statusFolder = gamemenu.addFolder({title: 'Status',expanded: true,});
  statusFolder.addBinding(myObject,'health',{readonly:true});
  statusFolder.addBinding(myObject,'animationState',{readonly:true});
  statusFolder.addBinding(myObject,'attack',{readonly:true});
  statusFolder.addBinding(myObject,'isAttack',{readonly:true});
  statusFolder.addBinding(myObject,'isHurt',{readonly:true});
  statusFolder.addBinding(myObject,'isFinish',{readonly:true});
  statusFolder.addBinding(myObject,'target',{readonly:true});

  statusFolder.addButton({title:'Update'}).on('click', () => {
    console.log(myObject.memberid);
    for(const player of players){
      if(player.id == myObject.memberid){
        myObject.health = player.health;
        myObject.isAttack = player.isAttack;
        myObject.isHurt = player.isHurt;
        myObject.isFinish = player.isFinish;
        break;
      }
    }
  });

  const equipmentFolder = gamemenu.addFolder({title: 'Equipment ',expanded: false,});

  const actionsFolder = gamemenu.addFolder({title: 'Actions',expanded: true,});
  actionsFolder.addButton({title:'Attack'});
  actionsFolder.addButton({title:'Defend'});
  actionsFolder.addButton({title:'Skills'});
  actionsFolder.addButton({title:'Items'});
  actionsFolder.addButton({title:'Escape'});

//===============================================
// DEBUG
//===============================================
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

//===============================================
// CREATE TMP CHARACTERS
//===============================================
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
    id:nanoid(),
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
//===============================================
// SET UP CHARACTERS
//===============================================
function setupEntities(){

  let tmpPlayer = createCharacter({
    x:-2,
    y:1.5,
    z:0,
  });

  players.push(tmpPlayer)

  let tmpEnemy =createCharacter({
    x:2,
    y:1.5,
    z:0,
  });

  enemies.push(tmpEnemy)
}
//===============================================
// UPDATE ANIMATION CHARACTERS
//===============================================
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

function setupGround(){

  var pos = {x:-5,y:0,z:-5};
  var size = 11;

  for(let x = 0; x < size; x++){
    for(let z = 0; z < size; z++){
      console.log("x:", (pos.x + x)+ " z:", (pos.z + z));
      let mesh = createMeshBox({
        x: pos.x + x,
        z: pos.z + z,
      });
      scene.add(mesh);
    }
  }

  //createMeshBox()
}

function setupScene(){
  setupLights()
  setupHelpers();

  setupGround()

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
