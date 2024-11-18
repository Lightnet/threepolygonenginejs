/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

// https://www.npmjs.com/package/ecs
// https://codepen.io/rvcristiand/pen/pogXXyB?editors=1111
// https://stackoverflow.com/questions/18260307/dat-gui-update-the-dropdown-list-values-for-a-controller

import van from "https://cdn.jsdelivr.net/npm/vanjs-core@1.5.2/src/van.min.js";
import * as THREE from 'https://unpkg.com/three@0.170.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.170.0/examples/jsm/controls/OrbitControls.js';
import Stats from 'https://unpkg.com/three@0.170.0/examples/jsm/libs/stats.module.js';
import { GUI } from 'https://unpkg.com/three@0.170.0/examples/jsm/libs/lil-gui.module.min.js';
import ECS from "https://unpkg.com/ecs@0.23.0/ecs.js";

const RENDERABLE_FILTER = [ 'renderable' ];
const CUBE_FILTER = [ 'cube' ];
const stats = new Stats();

// generates a new entity component system
const world = ECS.addWorld();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
//camera.position.z = 5;
camera.position.set(0, 0, 5);

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
window.addEventListener('resize', function(event) {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
});

// set up the cube
function setupCube(){
  const CUBE = ECS.addEntity(world)
  console.log(CUBE);
  ECS.addComponent(world, CUBE, 'rotation', { x: 0, y: 0,z:0 });

  const geometry = new THREE.BoxGeometry( 1, 1, 1 );
  const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
  const cube = new THREE.Mesh( geometry, material );
  //scene.add( cube );
  ECS.addComponent(world, CUBE, 'mesh', cube);
  ECS.addComponent(world, CUBE, 'isRotate', true);
  ECS.addComponentToEntity(world, CUBE, 'renderable');
  ECS.addComponentToEntity(world, CUBE, 'cube');
  //scene.add(cube);
}

function rotateSystem(world){
  const onUpdate = function (dt) {
    for (const entity of ECS.getEntities(world, [ 'rotation','mesh', 'isRotate'])) {
      if(entity.isRotate){
        entity.rotation.x += 0.01;
        entity.rotation.y += 0.01;
        entity.mesh.rotation.x = entity.rotation.x % Math.PI;
        entity.mesh.rotation.y = entity.rotation.y % Math.PI;
        //console.log(entity.mesh.rotation.x);
      }
    }
  }
  return {onUpdate}
}

// https://github.com/mreinstein/ecs
function rendererSystem (world) {
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
      console.log(result.entries[i])
      scene.add(result.entries[i].mesh);
    }

    ECS.getEntities(world, RENDERABLE_FILTER, 'removed', result);
    for (let i=0; i < result.count; i++){
      console.log('removed entity:', result.entries[i])
      scene.remove(result.entries[i].mesh);
    }
  }

  return { onUpdate }
}

let currentTime = performance.now();
var controls = new OrbitControls( camera, renderer.domElement );
function appLoop(){
  const newTime = performance.now()
  const frameTime = newTime - currentTime  // in milliseconds, e.g. 16.64356
  currentTime = newTime
  stats.update();
  controls.update();
  // run onUpdate for all added systems
  ECS.update(world, frameTime);
  
  renderer.render( scene, camera );

  // necessary cleanup step at the end of each frame loop
  ECS.cleanup(world)
}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

var controller_entities;
var EntitiesFolder;
const myScene = {
  entity_id:0,
  minx:-5,
  miny:-5,
  minz:-5,
  maxx:5,
  maxy:5,
  maxz:5,
  isRandom:true,
  isRotate:false,
  isCreateRotate:true,
  entityIds:[],
  currentEntityId:0,
  create_cube:function(){
    const CUBE = ECS.addEntity(world)
    ECS.addComponent(world, CUBE, 'rotation', { x: 0, y: 0,z:0 });

    const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    const cube = new THREE.Mesh( geometry, material );
    if(this.isRandom){
      cube.position.set(
        getRandomArbitrary(-5,5),
        getRandomArbitrary(-5,5),
        getRandomArbitrary(-5,5)
      )
    }
    ECS.addComponent(world, CUBE, 'mesh', cube);
    ECS.addComponentToEntity(world, CUBE, 'renderable')
    ECS.addComponentToEntity(world, CUBE, 'cube')
    ECS.addComponent(world, CUBE, 'isRotate', this.isCreateRotate);
    //scene.add(cube);
  },
  delete_cube:function(){
    console.log("this.entity_id: ", this.currentEntityId)
    const entity = ECS.getEntityById(world, this.currentEntityId);
    const deferredRemoval = false  // by default this is true. setting it to false immediately removes the component
    ECS.removeEntity(world, entity, deferredRemoval)
  },
  get_entities:function(){
    //let entities = ECS.getEntities(world, [ 'renderable' ])
    // //this.entityIds = entities;
    let entityIds = [];
    for (const entity of ECS.getEntities(world, [ 'renderable' ])){
      const entity_id = ECS.getEntityId(world, entity)
      console.log(entity_id);
      entityIds.push(entity_id); 
    }

    if(controller_entities){// if exist delete gui since they need to update html docs list
      controller_entities.destroy()//delete ui
      controller_entities = EntitiesFolder.add(myScene, 'currentEntityId', entityIds);
    }else{
      //create ui
      controller_entities = EntitiesFolder.add(myScene, 'currentEntityId', entityIds);
    }

  },
  remove_cubes:function(){
    ECS.removeEntities(world, ['cube']);
  },
  stop_rotate_cube:function(){
    console.log("this.entity_id: ", this.currentEntityId)
    const entity = ECS.getEntityById(world, this.currentEntityId);
    console.log(entity);
    entity.isRotate = this.isRotate;
  }
}

function createGUI(){
  const gui = new GUI();
  const cubeFolder = gui.addFolder('Cube');
  const ranPosFolder = cubeFolder.addFolder('Random Position');
  ranPosFolder.add(myScene, 'minx').name('Min X:');
  ranPosFolder.add(myScene, 'miny').name('Min Y:');
  ranPosFolder.add(myScene, 'minz').name('Min Z:');

  ranPosFolder.add(myScene, 'maxx').name('Max X:');
  ranPosFolder.add(myScene, 'maxy').name('Max Y:');
  ranPosFolder.add(myScene, 'maxz').name('Max Z:');

  cubeFolder.add(myScene, 'isRandom').name('is Random');
  cubeFolder.add(myScene, 'isCreateRotate').name('is Rotate');
  cubeFolder.add(myScene, 'create_cube').name('Create');
  
  const sceneFolder = gui.addFolder('Scene');
  sceneFolder.add(myScene, 'currentEntityId').name('Entity ID:').listen();
  sceneFolder.add(myScene, 'isRotate').name('isRotate')
  sceneFolder.add(myScene, 'stop_rotate_cube').name('Update Rotate')
  sceneFolder.add(myScene, 'delete_cube').name('Delete')
  
  EntitiesFolder = gui.addFolder('Entities');// folder
  EntitiesFolder.add(myScene, 'remove_cubes').name('Remove Cubes');
  EntitiesFolder.add(myScene, 'get_entities').name('Get Entities'); //get entities
  
}

function setupScene(){
  setupCube()

  ECS.addSystem(world, rotateSystem)
  ECS.addSystem(world, rendererSystem)

  van.add(document.body, renderer.domElement);
  van.add(document.body, stats.dom);
  createGUI();

  renderer.setAnimationLoop( appLoop );
}

setupScene();



