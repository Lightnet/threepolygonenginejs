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
import { GUI } from 'https://unpkg.com/three@0.170.0/examples/jsm/libs/lil-gui.module.min.js';
//import { PointerLockControls  } from 'https://unpkg.com/three@0.170.0/examples/jsm/controls/PointerLockControls.js';
//import TWEEN from 'https://unpkg.com/three@0.170.0/examples/jsm/libs/tween.module.js';

class CorePolygon{

  clock = new THREE.Clock();
  scene = new THREE.Scene();
  orbitCamera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
  orbitControl=null;
  renderer=null;

  constructor(args={}){

    let isAutoResize = args?.isAutoResize || true;
    let isResize = args?.isResize || true;
    let isOrbitControl = args?.isOrbitControl || true;

    this.orbitCamera.position.set( 0, 2, 5 );
    this.renderer = new THREE.WebGLRenderer();
    if(isResize){
      this.renderer.setSize( window.innerWidth, window.innerHeight );
    }
    if(isOrbitControl){
      this.setupOrbitControl();
    }
    if(isAutoResize){
      this.setupListeners();
    }
    this.setup();

    this.renderer.setAnimationLoop( this.update.bind(this));
  }

  setup(){

  }

  setupListeners(){
    window.addEventListener('resize',this.windowResize.bind(this));
  }

  setupOrbitControl(){
    this.orbitControl = new OrbitControls( this.orbitCamera, this.renderer.domElement );
    //must be called after any manual changes to the camera's transform
    this.orbitControl.update();
  }

  windowResize(event){
    this.orbitCamera.aspect = window.innerWidth / window.innerHeight;
    this.orbitCamera.updateProjectionMatrix();
    this.renderer.setSize( window.innerWidth, window.innerHeight );
  }

  update(){
    //const delta = this.clock.getDelta();

    if(this.orbitControl){
      this.orbitControl.update();
    }
    this.renderer.render( this.scene, this.orbitCamera );
  }

  get domElement(){
    return this.renderer.domElement;
  }

  get scene(){
    return this.scene;
  }

  get camera(){
    return this.orbitCamera;
  }
}

export default CorePolygon;