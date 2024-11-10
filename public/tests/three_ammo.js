/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

/*
  Information:
    vanjs main client entry point
    Note working... odd way to load.
*/

// https://medium.com/@bluemagnificent/intro-to-javascript-3d-physics-using-ammo-js-and-three-js-dd48df81f591
// https://gist.github.com/BlueMagnificent/6ef76c65839a3d952228ba2f99d9b1e7
// https://github.com/mrdoob/three.js/blob/master/examples/physics_ammo_instancing.html

//import * as THREE from 'three';
//import * as THREE from 'https://unpkg.com/three@0.157.0/build/three.module.js';
//import * as Ammo from 'https://unpkg.com/three@0.157.0/examples/jsm/libs/ammo.wasm.js'; //nope oudate
//import 'https://unpkg.com/three@0.160.0/examples/jsm/libs/ammo.wasm.js';//does not work, load in browser
//console.log(Ammo);//check if loaded...

import { AmmoPhysics } from 'https://unpkg.com/three@0.160.0/examples/jsm/physics/AmmoPhysics.js';
import {TriEngine} from '../triengine/triengine.js';
import { THREE, van } from '../triengine/dps.js';
const {button, canvas, input, label, div} = van.tags;

let colGroupPlane = 1, colGroupRedBall = 2, colGroupGreenBall = 4;

class ThreeAmmoTest extends TriEngine{

  rigidBodies = []; 
  constructor(args){
    super(args);
    this.clock = new THREE.Clock();
  }

  async init(){
    super.init();
    this.setup();
  }

  async setup(){
    this.physicsWorld = await AmmoPhysics();
    console.log(this.physicsWorld);
    this.camera.position.set(0,0,50);
    this.createScene();
  }

  createScene(){
    this.createLights();
    this.createPhysicsGround();
    this.createPhysicsBox();
    this.physicsWorld.addScene( this.scene );
  }

  
  createLights(){
    const hemiLight = new THREE.HemisphereLight();
		this.scene.add( hemiLight );

		const dirLight = new THREE.DirectionalLight( 0xffffff, 3 );
		dirLight.position.set( 5, 5, 5 );
		dirLight.castShadow = true;
		//dirLight.shadow.camera.zoom = 2;
		this.scene.add( dirLight );
  }
  

  createPhysicsGround(){
    const floor = new THREE.Mesh(
      new THREE.BoxGeometry( 10, 5, 10 ),
      //new THREE.ShadowMaterial( { color: 0x444444 } )
      new THREE.MeshBasicMaterial( { color: 0x00ffff } )
    );
    floor.position.y = - 2.5;
    floor.receiveShadow = true;
    floor.userData.physics = { mass: 0 };
    this.scene.add( floor );
  }

  createPhysicsBox(){
    const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    const cube = new THREE.Mesh( geometry, material );
    cube.position.set(0,10,0)
    cube.userData.physics = { mass: 1 };
    //this.mesh = cube;
    this.scene.add( cube );
    //console.log(this.mesh);
  }

  update(){
    super.update()
    let deltaTime = this.clock.getDelta();
  }
  
}

const ThreeEL = () => {
  const engine = van.state(null);
  const renderEL = canvas({id:'threejs'});

  function init(){
    engine.val = new ThreeAmmoTest({canvas:renderEL,resize:'window'});
    console.log(engine.val);//
  }

  init();

  return div(
    renderEL
  )
};

van.add(document.body,ThreeEL())