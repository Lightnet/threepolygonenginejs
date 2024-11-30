/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

//import { FloatingWindow } from "https://cdn.jsdelivr.net/npm/vanjs-ui@0.10.1/dist/van-ui.min.js";
import van from "https://cdn.jsdelivr.net/npm/vanjs-core@1.5.2/src/van.min.js";
import * as THREE from 'https://unpkg.com/three@0.170.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.170.0/examples/jsm/controls/OrbitControls.js';
import Stats from 'https://unpkg.com/three@0.170.0/examples/jsm/libs/stats.module.js';
import { GUI } from 'https://unpkg.com/three@0.170.0/examples/jsm/libs/lil-gui.module.min.js';
//import { PointerLockControls  } from 'https://unpkg.com/three@0.170.0/examples/jsm/controls/PointerLockControls.js';

const _euler = new THREE.Euler( 0, 0, 0, 'YXZ' );
const _PI_2 = Math.PI / 2;

class Spaceship {
  radius = 0.5;
  height = 1.75;
  jumpSpeed = 10;
  onGround = false;
  maxSpeed = 10;
  input = new THREE.Vector3();
  velocity = new THREE.Vector3();
  #worldVelocity = new THREE.Vector3();//private var
  mesh = null;
  camera = new THREE.PerspectiveCamera( 70, window.innerWidth/window.innerHeight, 0.1, 200 );
  mousePointer = new THREE.Vector3();

  pointerSpeed = 1.0;
  // Set to constrain the pitch of the camera
	// Range is 0 to Math.PI radians
	minPolarAngle = 0; // radians
	maxPolarAngle = Math.PI; // radians

  constructor(scene){
    const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    const material = new THREE.MeshBasicMaterial( { color: 0x00ff00,wireframe:true } );
    this.mesh = new THREE.Mesh( geometry, material );

    //scene.add(this.camera);
    scene.add(this.mesh);
    this.camera.position.set(0,1,3);
    this.mesh.add(this.camera)

    document.addEventListener('keydown', this.onKeyDown.bind(this));
    document.addEventListener('keyup', this.onKeyUp.bind(this));
  
    document.addEventListener("mousemove", this.onMouseMove.bind(this));
  }

  update(dt){
    //console.log('update spaceship...')
    this.applyInputs(dt);
  }

  applyInputs(dt){
    this.velocity.x = this.input.x;
    this.velocity.z = this.input.z;

    this.mesh.translateX((this.velocity.x * dt));
    this.mesh.translateZ((this.velocity.z * dt)*-1);
    //console.log("this.mesh z:", this.mesh.position.z)
  }

  onMouseMove(event){
    //console.log(event.clientX)
    this.mousePointer.x = event.clientX / window.innerWidth - 0.5;
    this.mousePointer.y = event.clientY / window.innerHeight - 0.5;
    //console.log(this.mousePointer)
    if(this.mousePointer.y > 0){
      //console.log("up?")
    }
    if(this.mousePointer.y < 0){
      //console.log("down?")
    }
    console.log("x: ", event.movementX, " y: ", event.movementY)
    //= this.mesh;
     const camera = this.mesh;
  	_euler.setFromQuaternion( camera.quaternion );

  	_euler.y -= event.movementX * 0.002 * this.pointerSpeed;
  	_euler.x -= event.movementY * 0.002 * this.pointerSpeed;

  	_euler.x = Math.max( _PI_2 - this.maxPolarAngle, Math.min( _PI_2 - this.minPolarAngle, _euler.x ) );

  	camera.quaternion.setFromEuler( _euler );
  }

  get position(){
    //return this.camera.position;
    return this.mesh.position;
  }

  onKeyDown(event){
    //console.log('key down');
    // if(!this.controls.isLocked){
    //   this.controls.lock();
    //   console.log('locked');
    // }

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
      case 'Space':
        if(this.onGround){
          this.velocity.y += this.jumpSpeed;
        }
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

}

const {div, button, label, img} = van.tags;
const stats = new Stats();
var orbitControls;
var gridHelper;
var cube;
const clock = new THREE.Clock();
const scene = new THREE.Scene();
const orbitCamera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
//orbit_camera.position.z = 5;
orbitCamera.position.set( 0, 1, 5 );

var isLocked = false;

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

function setup_GridHelper(){
  const size = 10;
  const divisions = 10;

  gridHelper = new THREE.GridHelper( size, divisions );
  scene.add( gridHelper );
}

//===============================================
// SETUP SCENE
//===============================================
var player;
function setup_Scene(){
  player = new Spaceship(scene);
  setup_El();
  setup_GUI();
  //setup_cube();

  setup_GridHelper()

  renderer.setAnimationLoop( animate );
  van.add(document.body, renderer.domElement );
  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('keyup', onKeyUp);
  
}

function onKeyDown(event){
  //console.log("event.code: ", event.code);
  if((isLocked == false)&&(event.code !='Escape')){
    isLocked = true;
    renderer.domElement.requestPointerLock();
  }
  if((isLocked == true)&&(event.code =='Escape')){
    isLocked = false;
    renderer.ownerDocument.exitPointerLock();
  }
}

function onKeyUp(event){
  
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
const myWorld ={
  isDisplayOrbitControl:false,
  pos:{x:0,y:0,z:0},
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
  }
}

function setup_GUI(){
  const gui = new GUI();

  const cameraFolder = gui.addFolder('Orbit Camera').show(myWorld.isDisplayOrbitControl);
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
  gui.add(myWorld,'isDisplayOrbitControl').name('View Orbit Camera').onChange( value => {
    cameraFolder.show( value );
  } );
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
  if(player){
    player.update(delta);
  }

  // required if controls.enableDamping or controls.autoRotate are set to true
  if(orbitControls){
    orbitControls.update();
  }
	if(player){
    renderer.render( scene, player.camera );
  }else{
    renderer.render( scene, orbitCamera );
  }
	
}

//===============================================
// INIT
//===============================================

setup_Scene();