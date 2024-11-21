/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/
/*
  Information:
    This framework is to reduce some code builds.

    To handle entities that need to add to scene and render them.

    Physics components will be added later.

    To keep it very simple as possible as well add some helpers and premade mesh for test.
*/

import van from "https://cdn.jsdelivr.net/npm/vanjs-core@1.5.2/src/van.min.js";
import * as THREE from 'https://unpkg.com/three@0.170.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.170.0/examples/jsm/controls/OrbitControls.js';
import Stats from 'https://unpkg.com/three@0.170.0/examples/jsm/libs/stats.module.js';
import { GUI } from 'https://unpkg.com/three@0.170.0/examples/jsm/libs/lil-gui.module.min.js';
//import { PointerLockControls  } from 'https://unpkg.com/three@0.170.0/examples/jsm/controls/PointerLockControls.js';
//import TWEEN from 'https://unpkg.com/three@0.170.0/examples/jsm/libs/tween.module.js';
import ECS from "https://unpkg.com/ecs@0.23.0/ecs.js";

const RENDERABLE_FILTER = [ 'renderable' ];
const CUBE_FILTER = [ 'cube' ];
const PHYSICSABLE_FILTER = [ 'rigidcube' ];

class CorePolygon{
  stats = new Stats();
  clock = new THREE.Clock();
  scene = new THREE.Scene();
  orbitCamera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
  orbitControl=null;
  renderer=null;
  world=null;
  physics=null;

  constructor(args={}){

    let isAutoResize = args?.isAutoResize || true;
    let isResize = args?.isResize || true;
    let isOrbitControl = args?.isOrbitControl || true;
    this.ECS = ECS;
    this.world = ECS.addWorld();

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
    this.setupECS();
    this.setupGUI();
    this.setupElement()
    this.setup();
    
    this.renderer.setAnimationLoop( this.update.bind(this));
  }

  setupElement(){
    van.add(document.body,this.stats.dom);
  }

  setupECS(){
    //console.log(this.scene);
    ECS.addSystem(this.world, this.rendererSystem.bind(this));
  }

  // user set up when extend class
  setup(){

  }
  //Note there is need for await call for finish loading
  setupPhysics(){

  }
  //this for setup after script is loaded
  buildPhysics(){

  }
  //debug gui
  setupGUI(){
    this.gui = new GUI();
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

  createMeshCube(args){
    args = args || {};
    const width = args?.width || 1;
    const height = args?.height || 1;
    const depth = args?.depth || 1;
    const color = args?.color || 0x00ff00;
    const geometry = new THREE.BoxGeometry( width, height, depth );
    const material = new THREE.MeshBasicMaterial( { color: color } );
    const cube = new THREE.Mesh( geometry, material );
    return cube;
  }

  //===============================================
  // RENDER SYSTEM ECS
  //===============================================
  // https://github.com/mreinstein/ecs
  rendererSystem (world) {
    console.log(this.scene);
    const scene = this.scene;
    // data structure to store all entities that were added or removed last frame
    const result = {
      count: 0,
      entries: new Array(100)
    }
    const onUpdate = function (dt) {
      // optional 3rd parameter, can be 'added' or 'removed'. populates the list of entities that were
      // added since the last ECS.cleanup(...) call
      ECS.getEntities(world, RENDERABLE_FILTER, 'added', result);
      for (let i=0; i < result.count; i++){
        console.log('added new entity:', result.entries[i])
        //console.log(result.entries[i])
        scene.add(result.entries[i].mesh);
      }

      ECS.getEntities(world, RENDERABLE_FILTER, 'removed', result);
      for (let i=0; i < result.count; i++){
        //console.log('removed entity:', result.entries[i])
        scene.remove(result.entries[i].mesh);
      }
    }

    return { onUpdate }
  }

  update(){
    const delta = this.clock.getDelta();
    ECS.update(this.world, delta);
    if(this.stats){
      this.stats.update();
    }
    
    if(this.orbitControl){
      this.orbitControl.update();
    }
    this.renderer.render( this.scene, this.orbitCamera );

    ECS.cleanup(this.world)
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