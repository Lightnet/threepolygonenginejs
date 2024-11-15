/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

/*
  Information: Simple camera control test movment input no rotate camera.
*/
// https://discourse.threejs.org/t/move-the-camera-forward-in-the-direction-its-facing/8364/5
// https://discourse.threejs.org/t/sprite-facing-camera-always/42788/6
// https://discourse.threejs.org/t/how-can-i-rotate-a-sprite-to-face-particular-x-y-coordinates/44629
// https://stackoverflow.com/questions/69196643/threejs-how-to-move-the-camera-to-the-left-or-right-independent-of-its-rotation
// https://threejs.org/docs/#api/en/core/Object3D
// Translate an object by distance along an axis in object space. The axis is assumed to be normalized.
// .translateX ( distance : Float ) : this

//import { THREE, OrbitControls, ECS, van } from "/dps.js";
//import { FloatingWindow } from "vanjs-ui";
//import { FloatingWindow } from "https://cdn.jsdelivr.net/npm/vanjs-ui@0.10.1/dist/van-ui.min.js";
import van from "https://cdn.jsdelivr.net/npm/vanjs-core@1.5.2/src/van.min.js";
import * as THREE from 'https://unpkg.com/three@0.170.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.170.0/examples/jsm/controls/OrbitControls.js';
import { PointerLockControls  } from 'https://unpkg.com/three@0.170.0/examples/jsm/controls/PointerLockControls.js';
import Stats from 'https://unpkg.com/three@0.170.0/examples/jsm/libs/stats.module.js';
import { GUI } from 'https://unpkg.com/three@0.170.0/examples/jsm/libs/lil-gui.module.min.js';

const {div, button, style} = van.tags;

const stats = new Stats();
van.add(document.body, stats.dom);

class Player {
  maxSpeed = 10;
  input = new THREE.Vector3();
  velocity = new THREE.Vector3();
  camera = new THREE.PerspectiveCamera( 70, window.innerWidth/window.innerHeight, 0.1, 200 );
  controls = new PointerLockControls( this.camera,document.body );
  cameraHelper = new THREE.CameraHelper(this.camera);

  constructor(scene){
    this.position.set(0,2,5);
    scene.add(this.camera);
    scene.add(this.cameraHelper);

    document.addEventListener('keydown', this.onKeyDown.bind(this));
    document.addEventListener('keyup', this.onKeyUp.bind(this));
  }

  applyInputs(dt){
    if(this.controls.isLocked){
      //console.log('Player Update dt:', dt);
      this.velocity.x = this.input.x;
      this.velocity.z = this.input.z;
      this.controls.moveRight(this.velocity.x * dt);
      this.controls.moveForward(this.velocity.z * dt);

      document.getElementById('player-position').innerHTML = this.toString();
    }
  }

  onKeyDown(event){
    //console.log('key down');
    if(!this.controls.isLocked){
      this.controls.lock();
      console.log('locked');
    }

    switch(event.code){
      case 'KeyW':
        this.input.z = this.maxSpeed;
        break;
      case 'KeyA':
        this.input.x = -this.maxSpeed;
        break;
      case 'KeyS':
        this.input.z = -this.maxSpeed;
        break;
      case 'KeyD':
        this.input.x = this.maxSpeed;
        break;
      case 'KeyR':
        this.position.set(32,16,32);
        this.velocity.set(0, 0, 0);
        break;
    }
  }

  onKeyUp(event){
    //console.log('key up');
    switch(event.code){
      case 'KeyW':
        this.input.z = 0;
        break;
      case 'KeyA':
        this.input.x = 0;
        break;
      case 'KeyS':
        this.input.z = 0;
        break;
      case 'KeyD':
        this.input.x = 0;
        break;
    }
  }

  get position(){
    return this.camera.position;
  }

  toString(){
    let str = '';
    str += `X: ${this.position.x.toFixed(3)}`;
    str += ` Y: ${this.position.y.toFixed(3)}`;
    str += ` Z: ${this.position.z.toFixed(3)}`;
    return str;
  }

}

const scene = new THREE.Scene();
const player = new Player(scene);
const orbitCamera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
//orbitCamera.position.z = 5;
orbitCamera.position.set( 0, 1, 5 );
var controls;
var cube;

const renderer = new THREE.WebGLRenderer();
//renderer.setClearColor( 0xffffff, 0 );
renderer.setSize( window.innerWidth, window.innerHeight );
window.addEventListener('resize', function(event) {
  orbitCamera.aspect = window.innerWidth / window.innerHeight;
  orbitCamera.updateProjectionMatrix();
  player.camera.aspect = window.innerWidth / window.innerHeight;
  player.camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
});

function setup_cube(){
  const geometry = new THREE.BoxGeometry( 1, 1, 1 );
  const material0 = new THREE.MeshBasicMaterial( { color: 0x00ff00,wireframe:true } );
  cube = new THREE.Mesh( geometry, material0 );
  scene.add( cube );
}

function setup_GridHelper(){
  const size = 10;
  const divisions = 10;

  const gridHelper = new THREE.GridHelper( size, divisions );
  scene.add( gridHelper );
}

controls = new OrbitControls( orbitCamera, renderer.domElement );
//must be called after any manual changes to the camera's transform
controls.update();
// https://stackoverflow.com/questions/45343673/three-js-animate-in-real-time
var clock = new THREE.Clock();
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

  player.applyInputs(delta);

  //update_camera_move(delta)
  // required if controls.enableDamping or controls.autoRotate are set to true
  if(controls){
    controls.update();
  }
	
	//renderer.render( scene, orbit_camera );
  renderer.render( scene, player.controls.isLocked ? player.camera : orbitCamera );
}

function createUI( player){
  const gui = new GUI();

  const playerFolder = gui.addFolder('Player');
  playerFolder.add(player,'maxSpeed', 1, 20).name('Max Speed');
  playerFolder.add(player.cameraHelper,'visible').name('Show Camera Helper');

  gui.onChange(()=>{
    //change
  });
}

function setup_el(){
  van.add(document.head,style(`
#info{
  position:absolute;
  right:0;
  bottom:0;
  fontsize:24px;
  color:white;
  margin:8px;
}
`))
        
  van.add(document.body,div({id:'info'},
    div({id:'player-position'})
  ))

  van.add(document.body,div({style:`
    position:absolute;
  left:0;
  top:60px;
  fontsize:24px;
  color:white;
  margin:8px;
    `},
    div('Input Key = Lock Pointer to move camera'),
    div('Escape = Exit Lock Pointer'),
  ))
}

function setup(){
  setup_el();
  setup_cube();
  setup_GridHelper();
  createUI(player)
}

setup();

renderer.setAnimationLoop( animate );
van.add(document.body, renderer.domElement );