/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

// testing card position and draw

// https://discourse.threejs.org/t/different-materials-on-plane-side-a-and-side-b/58310/3
// https://github.com/mrjasonweaver/threejs-color


//import { FloatingWindow } from "https://cdn.jsdelivr.net/npm/vanjs-ui@0.10.1/dist/van-ui.min.js";
import van from "https://cdn.jsdelivr.net/npm/vanjs-core@1.5.2/src/van.min.js";
import * as THREE from 'https://unpkg.com/three@0.170.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.170.0/examples/jsm/controls/OrbitControls.js';
import Stats from 'https://unpkg.com/three@0.170.0/examples/jsm/libs/stats.module.js';
import { GUI } from 'https://unpkg.com/three@0.170.0/examples/jsm/libs/lil-gui.module.min.js';
import { PointerLockControls  } from 'https://unpkg.com/three@0.170.0/examples/jsm/controls/PointerLockControls.js';
import TWEEN from 'https://unpkg.com/three@0.170.0/examples/jsm/libs/tween.module.js';

const {div, button, label, img} = van.tags;
const stats = new Stats();
const groupTween = new TWEEN.Group();

var orbitControls;
var gridHelper;
var cube;
var cards = [];
const clock = new THREE.Clock();
const scene = new THREE.Scene();
const orbitCamera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
//orbit_camera.position.z = 5;
orbitCamera.position.set( 0, 5, 9 );

const renderer = new THREE.WebGLRenderer();
//renderer.setClearColor( 0xffffff, 0 );
renderer.setSize( window.innerWidth, window.innerHeight );
window.addEventListener('resize', function(event) {
  orbitCamera.aspect = window.innerWidth / window.innerHeight;
  orbitCamera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
});

orbitControls = new OrbitControls( orbitCamera, renderer.domElement );
//must be called after any manual changes to the camera's transform
orbitControls.update();

function setup_cube(){
  const geometry = new THREE.BoxGeometry( 1, 1, 1 );
  const material0 = new THREE.MeshBasicMaterial( { color: 0x00ff00,wireframe:true } );
  cube = new THREE.Mesh( geometry, material0 );
  scene.add( cube );
}

function setup_card(){
  //test
  let cardmesh = create_card_mesh();
  cardmesh.position.set(0,1,5);
  scene.add( cardmesh );
  cards.push(cardmesh);

  //cards
  for (let i = 0; i < 11 ;i++){
    cardmesh = create_card_mesh();
    cardmesh.position.set((-6 + (1*i) + (0.2*i) ),0,2)
    cardmesh.rotation.x = Math.PI / 180 * 90;
    scene.add( cardmesh );
  }

  for (let i = 0; i < 11 ;i++){
    cardmesh = create_card_mesh();
    cardmesh.position.set((-6 + (1*i) + (0.2*i) ),0,4)
    cardmesh.rotation.x = Math.PI / 180 * 90;
    scene.add( cardmesh );
  }


  // cardmesh = create_card_mesh();
  // cardmesh.position.set(-5.5,0,0)
  // cardmesh.rotation.x = Math.PI / 180 * 90;
  // scene.add( cardmesh );

  // cardmesh = create_card_mesh();
  // cardmesh.position.set(-4,0,0)
  // cardmesh.rotation.x = Math.PI / 180 * 90;
  // scene.add( cardmesh );

}

function create_card_mesh(){
  //front side
  const material0 = new THREE.MeshBasicMaterial( { 
    color:'lightblue',
  });
  //back side
  const material1 = new THREE.MeshBasicMaterial( { 
    color:'Crimson',
  });
  const _geometry = new THREE.BoxGeometry( 1, 1.6, 0 );
  
  let mesh = new THREE.Mesh( 
    _geometry,
    //material1
    [ null,  null, null, null,
      material0,
      material1
    ]
    );
  return mesh

}



function setup_GridHelper(){
  const size = 10;
  const divisions = 10;

  gridHelper = new THREE.GridHelper( size, divisions );
  scene.add( gridHelper );
}

//===============================================
// SETUP SCENE
//===============================================
function setup_Scene(){

  setup_El();
  setup_card()
  setup_GUI();
  setup_cube();

  setup_GridHelper()

  renderer.setAnimationLoop( animate );
  van.add(document.body, renderer.domElement );
}
//===============================================
// Element html
//===============================================
function setup_El(){
  van.add(document.body, stats.dom);

  van.add(document.body,div({style:`
    position:absolute;
  left:0;
  top:60px;
  fontsize:24px;
  color:white;
  margin:8px;
    `},
    div('W,A,S,D KEY = Move Camera'),
  ))
}

//===============================================
// GUI
//===============================================
function CardPosRot(args){
  let x = args?.x || 0;
  let y = args?.y || 0;
  let z = args?.z || 0;

  let rx = args?.rx || 0;
  let ry = args?.ry || 0;
  let rz = args?.rz || 0;

  const card = cards[0];
  const rotTween = new TWEEN.Tween(card.rotation)
    .to({
      x: rx,
      y: ry,
      z: rz
    },1000)
    .easing(TWEEN.Easing.Back.Out);
  console.log(rotTween);
  rotTween.start();
  const posTween = new TWEEN.Tween(card.position).to({
    x: x,
    y: y,
    z: z
  }).easing(TWEEN.Easing.Back.Out);
  posTween.start();
  groupTween.add(rotTween);
  groupTween.add(posTween);
}

const myWorld ={
  pos:{x:0,y:0,z:0},
  isOrbitCamera:false,
  currentCard:null,
  toggle_camera:function(){
    console.log(this.isOrbitCamera)
    let isOrbitCamera = this.isOrbitCamera;
    this.isOrbitCamera = !isOrbitCamera;
  },
  getCameraDir:function(){
    const dir = new THREE.Vector3( 0, 0, 0 );
    orbitCamera.getWorldDirection(dir);
    console.log("get Direction : ",dir);
  },
  getCameraPos:function(){
    let pos = new THREE.Vector3( 0, 0, 0 );
    orbitCamera.getWorldPosition(pos);
    console.log("get Position : ",pos);
    this.pos.x = pos.x;
    this.pos.y = pos.y;
    this.pos.z = pos.z;
  },
  resetCamera:function(){
    orbitCamera.position.set(0,1,3)
    orbitCamera.rotation.set(0,0,0)
  },
  flip_card:function(){
    const card = cards[0];
    const rotTween = new TWEEN.Tween(card.rotation)
      .to({
        x:0,
        y: Math.PI / 180 * 180,
        z:0
      },1000)
      .easing(TWEEN.Easing.Back.Out);
    rotTween.start();
    groupTween.add(rotTween);
  },
  // https://discourse.threejs.org/t/rotate-a-plane-in-2-axis/46364
  reset_rotate_card:function(){
    const card = cards[0];
    const rotTween = new TWEEN.Tween(card.rotation)
      .to({
        x:0,
        y: 0,
        z:0
      },1000)
      .easing(TWEEN.Easing.Back.Out);
    rotTween.start();
    groupTween.add(rotTween);
  },
  reset_position_card:function(){
    const card = cards[0];
    const rotTween = new TWEEN.Tween(card.position)
      .to({
        x:0,
        y:1,
        z:2.5
      },1000)
      .easing(TWEEN.Easing.Back.Out);
    rotTween.start();
    groupTween.add(rotTween);
  },
  place_face_down_card:function(){
    console.log(TWEEN);
    const card = cards[0];
    const rotTween = new TWEEN.Tween(card.rotation)
      .to({
        x: Math.PI / 180 * 90,
        y: 0,
        z: 0
      },1000)
      .easing(TWEEN.Easing.Back.Out);
    console.log(rotTween);
    rotTween.start();
    const posTween = new TWEEN.Tween(card.position).to({
      x: 0,
      y: 0,
      z: 0
    }).easing(TWEEN.Easing.Back.Out);
    posTween.start();
    groupTween.add(rotTween);
    groupTween.add( posTween);
  },
  place_face_up_card:function(){
    console.log(TWEEN);
    const card = cards[0];
    const rotTween = new TWEEN.Tween(card.rotation)
      .to({
        x: -Math.PI / 180 * 90,
        y: 0,
        z: 0
      },1000)
      .easing(TWEEN.Easing.Back.Out);
    console.log(rotTween);
    rotTween.start();
    const posTween = new TWEEN.Tween(card.position).to({
      x: 0,
      y: 0,
      z: 2
    }).easing(TWEEN.Easing.Back.Out);
    posTween.start();
    groupTween.add(rotTween);
    groupTween.add( posTween);
  },

  place_face_up_card01:function(){
    let rot = -Math.PI / 180 * 90;
    CardPosRot({
      x:-5,
      z:2,
      rx:rot
    })
  },
  draw_card:function(){
    console.log(TWEEN);
    const card = cards[0];
    const rotTween = new TWEEN.Tween(card.rotation)
      .to({
        x: 0,
        y: 0,
        z: 0
      },1000)
      .easing(TWEEN.Easing.Back.Out);
    console.log(rotTween);
    rotTween.start();
    const posTween = new TWEEN.Tween(card.position).to({
      x: 0,
      y: 1,
      z: 4
    }).easing(TWEEN.Easing.Back.Out);
    posTween.start();
    groupTween.add(rotTween);
    groupTween.add( posTween);
  },
  reset_draw_card:function(){
    console.log(TWEEN);

    CardPosRot({
      x:5,
      z:4,
      rx:Math.PI / 180 * 90
    })
  }
}

function setup_GUI(){
  const gui = new GUI();
  const cameraFolder = gui.addFolder('Orbit Camera').show(myWorld.isOrbitCamera);
  cameraFolder.add(myWorld,'getCameraDir').name('Rotation')
  cameraFolder.add(myWorld,'getCameraPos').name('Position')
  const camPosFolder = cameraFolder.addFolder('Position');
  camPosFolder.add(orbitCamera.position,'x',-10,10).name('X: ')
  camPosFolder.add(orbitCamera.position,'y',-10,10).name('Y: ')
  camPosFolder.add(orbitCamera.position,'z',-10,10).name('Z: ')
  const camRotFolder = cameraFolder.addFolder('Rotate');
  camRotFolder.add(orbitCamera.rotation,'x',-3,3).name('X: ')
  camRotFolder.add(orbitCamera.rotation,'y',-3,3).name('Y: ')
  camRotFolder.add(orbitCamera.rotation,'z',-3,3).name('Z: ')
  cameraFolder.add(myWorld,'resetCamera').name(' RESET ')
  cameraFolder.add(orbitControls,'enabled');
  gui.add(myWorld, 'isOrbitCamera').name('Display Camera').onChange( value => {
    //console.log(value);
    cameraFolder.show(value)
  });

  const cardFolder = gui.addFolder('Card');
  const cardPostFolder = cardFolder.addFolder('Position');
  cardPostFolder.add(cards[0].position,'x',-3,3).name('X: ')
  cardPostFolder.add(cards[0].position,'y',-3,3).name('Y: ')
  cardPostFolder.add(cards[0].position,'z',-3,3).name('Z: ')

  const cardRotFolder = cardFolder.addFolder('Rotate');
  cardRotFolder.add(cards[0].rotation,'x',-3,3).name('X: ')
  cardRotFolder.add(cards[0].rotation,'y',-3,3).name('Y: ')
  cardRotFolder.add(cards[0].rotation,'z',-3,3).name('Z: ')
  cardFolder.add(myWorld,'flip_card').name('Flip H');
  cardFolder.add(myWorld,'reset_rotate_card').name('Reset Rotation');
  cardFolder.add(myWorld,'reset_position_card').name('Reset Position');

  cardFolder.add(myWorld,'reset_draw_card').name('Reset Draw');

  cardFolder.add(myWorld,'place_face_up_card01').name('place up 01');

  cardFolder.add(myWorld,'place_face_down_card').name('Place Face Down');
  cardFolder.add(myWorld,'place_face_up_card').name('Place Face Up V');
  cardFolder.add(myWorld,'draw_card').name('Draw V');

}

function animate() {
  const delta = clock.getDelta();
  //console.log("delta: ", delta);
  if(stats){
    stats.update();
  }
  if(cube){
    //cube.rotation.x += 0.01;
	  //cube.rotation.y += 0.01;
  }
  groupTween.update();

  // required if controls.enableDamping or controls.autoRotate are set to true
  if(orbitControls){
    orbitControls.update();
  }
	
	renderer.render( scene, orbitCamera );
}

//===============================================
// INIT
//===============================================

setup_Scene();