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

// need for just render right and no rigid
const RENDERABLE_FILTER = [ 'renderable','!rigid' ];
const CUBE_FILTER = [ 'cube' ];
//it need one for filter else hard to check right?
const PHYSICSABLE_FILTER = [ 'rigid' ];

class CorePolygon{
  //testing...
  RENDERABLE_FILTER = [ 'renderable' ];
  CUBE_FILTER = [ 'cube' ];
  PHYSICSABLE_FILTER = [ 'rigid' ];
  //debug
  stats = new Stats();
  //threejs
  clock = new THREE.Clock();
  scene = new THREE.Scene();
  orbitCamera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
  orbitControl=null;
  renderer=null;
  //ECS
  world=null;
  //physics
  physics=null;
  physicsType='None';
  //=============================================
  // INIT MAIN SET UP
  //=============================================
  constructor(args={}){
    //console.log(args);
    let isPhysics = false;
    //console.log(typeof args?.isPhysics);
    if(typeof args?.isPhysics == 'boolean'){
      isPhysics = args.isPhysics;
    }
    //console.log(isPhysics);
    let physicsType = args?.physicsType || "none";
    //physicsType = "ammo";
    //physicsType = "jolt";
    //physicsType = "rapier";

    this.physicsType = physicsType;

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
    //if physics need to setup after else the variable error for debug ui
    if(isPhysics==true){
      //console.log("PHYSICS!");
      this.setupPhysics(physicsType);
    }else{
      //console.log("NO PHYSICS!");
      this.setupInit();
    }
    
  }

  //=============================================
  // DOC HTML BODY ADD TO ...
  //=============================================
  setupElement(){
    van.add(document.body,this.stats.dom);
  }
  //=============================================
  // SETUP ENTITY COMPONENT SYSTEM
  //=============================================
  setupECS(){
    //console.log(this.scene);
    ECS.addSystem(this.world, this.rendererSystem.bind(this));
  }

  //=============================================
  // USER SETUP
  //=============================================
  // user set up when extend class
  async setupInit(){
    //? error?
    await this.setup();
  }

  async setup(){
    //console.log("setup core setup");
    this.setupECS();
    this.setupGUI();
    this.setupElement()
    await new Promise(resolve => setTimeout(resolve, 1));
    this.renderer.setAnimationLoop( this.update.bind(this));
    
  }
  //=============================================
  // LOAD PHYSICS
  //=============================================
  //Note there is need for await call for finish loading
  async setupPhysics(physicsType){
    console.log("physicsType: ", physicsType)
    if(!physicsType){
      console.log("ERROR NULL PHYSICS");
      return
    };
    if(physicsType=="ammo"){
      //const physics = new PhysicsAmmo();
      //load script what is needed
      const {default:_Physics} = await import("./physics_ammo.js");
      //console.log(_Physics)
      const physics = new _Physics();
      //console.log(physics);
      await physics.setup();
      //console.log("LOADED?");
      this.physics = physics;
      this.setupInit();
    }
    if(physicsType=="jolt"){
      const {default:_Physics} = await import("./physics_jolt.js");
      //console.log(_Physics)
      const physics = new _Physics();
      //console.log(physics);
      await physics.setup();
      //console.log("LOADED?");
      this.physics = physics;
      this.setupInit();
    }

    if(physicsType=="rapier"){
      const {default:_Physics} = await import("./physics_rapier.js");
      //console.log(_Physics)
      const physics = new _Physics();
      //console.log(physics);
      await physics.setup();
      //console.log("LOADED?");
      this.physics = physics;
      this.setupInit();
    }
  }

  //=============================================
  // DEBUG GUI
  //=============================================
  setupGUI(){
    this.gui = new GUI();
  }
  //=============================================
  // DOCS LISTEN EVENT RESIZE WINDOW
  //=============================================
  setupListeners(){
    window.addEventListener('resize',this.windowResize.bind(this));
  }
  //=============================================
  // Orbit Control
  //=============================================
  setupOrbitControl(){
    this.orbitControl = new OrbitControls( this.orbitCamera, this.renderer.domElement );
    //must be called after any manual changes to the camera's transform
    this.orbitControl.update();
  }
  //=============================================
  // WINDOW RESIZE FOR RENDERER and ORBIT CONTROL
  //=============================================
  windowResize(event){
    this.orbitCamera.aspect = window.innerWidth / window.innerHeight;
    this.orbitCamera.updateProjectionMatrix();
    this.renderer.setSize( window.innerWidth, window.innerHeight );
  }
  //=============================================
  // CREATE MESH CUBE/BOX
  //=============================================
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

  getEntityById(_entityId){
    return this.ECS.getEntityById(this.world, _entityId);
  }
  //===============================================
  // ECS GET ENTITY ID
  //===============================================
  getEntityId(_entity){
    return this.ECS.getEntityId(this.world, _entity);
  }
  //===============================================
  // ECS GET ENTITIES
  //===============================================
  // https://github.com/mreinstein/ecs/blob/main/ecs.js
  getEntities(componentNames, listenerType , listenerEntities){
    return this.ECS.getEntities(this.world, componentNames, listenerType, listenerEntities)
  }
  //===============================================
  // ECS ADDSYSTEM
  //===============================================
  addSystem(_func){
    //console.log("__func",_func)
    this.ECS.addSystem(this.world, _func);
  }
  //===============================================
  // ECS REMOVE ENTITIES
  //===============================================
  //remove all entities tags
  removeEntities(data=[]){
    this.ECS.removeEntities(this.world, data);
  }
  //===============================================
  // CREATE ENTITY
  //===============================================
  createEntity(){
    const ECS = this.ECS;
    const world = this.world;
    //const _ENTITY = ECS.addEntity(world);
    //console.log("createEntity")

    class ADDENTITY{
      constructor(_world){
        this.world = _world;
        this._ENTITY = ECS.addEntity(_world);;
      }
      addComponent=function(_name,_data){
        ECS.addComponent(this.world, this._ENTITY, _name, _data);
        return this;
      }
      addComponentToEntity=function(_name){
        ECS.addComponentToEntity(this.world, this._ENTITY, _name);
        return this;
      }
      //??
      cleanUp=function(){
        //console.log('Clean up');
        this.world = null;
        this._ENTITY = null;
        delete this.world;
        delete this._ENTITY;
        //console.log('this.world', this.world);
        //console.log('this._ENTITY', this._ENTITY);
      }
    }

    let _ENTITY = new ADDENTITY(world);
    //console.log(_ENTITY);
    return _ENTITY;
  }
  
  // https://github.com/mreinstein/ecs/issues/46
  addEntity(_world){
    let e;
    if(_world){
      e = ECS.addEntity(_world); // use params
    }else{
      e = ECS.addEntity(this.world); // use default
    }
    
    const chain = {
      addComponent: function (name, data={}) {
        ECS.addComponent(world, e, name, data);
        return chain;
      }
    };
  
    return chain;
  }

  // const w = ECS.createWorld()
  // const monster = entity(w).addComponent('health', { hitpoints: 7 })
  //                          .addComponent('pathFinding', { maxDistance: 128 })
  //                          .addComponent('aabb', { width: 12, height: 14, position: [ 32,  106 ] })
  //                          .addComponent('monster')

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
  //=============================================
  // UPDATE CALL FOR RENDER AND OTHERS
  //=============================================
  update(){
    const delta = this.clock.getDelta();
    ECS.update(this.world, delta);
    if(this.stats){
      this.stats.update();
    }

    if(this.physics){
      this.physics.update(delta);
    }
    
    if(this.orbitControl){
      this.orbitControl.update();
    }
    this.renderer.render( this.scene, this.orbitCamera );

    ECS.cleanup(this.world)
  }
  //=============================================
  // html element
  //=============================================
  get domElement(){
    return this.renderer.domElement;
  }
  //=============================================
  // SCENE
  //=============================================
  get scene(){
    return this.scene;
  }
  //=============================================
  // CAMERA
  //=============================================
  get camera(){
    return this.orbitCamera;
  }

  get physicsAPI(){
    return this.physics.API;
  }
}
//===============================================
//
//===============================================
export default CorePolygon;
/*
import CorePolygon from "{path}/corepolygon.js";
*/