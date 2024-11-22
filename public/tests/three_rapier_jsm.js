/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

// testing
// https://github.com/mrdoob/three.js/blob/master/examples/physics_rapier_instancing.html

import { 
  THREE, 
  van, 
  RAPIER
} from '../triengine/dps.js';
import {TriEngine} from '../triengine/triengine.js';
import { RapierPhysics } from 'three/addons/physics/RapierPhysics.js';

const {canvas, div} = van.tags;

class ThreeRapierTest extends TriEngine{

  constructor(args){
    super(args);
    console.log("test init...");
    this.clock = new THREE.Clock();
  }

  init(){
    super.init();
    this.setup();
  }

  async setup(){
    console.log("setup three rapier...");
    this.physics = await RapierPhysics();

    this.setupScene();
  }

  setupScene(){
    this.scene.background = new THREE.Color( 0x666666 );
    this.camera.position.set(0,0,20);
    this.renderer.shadowMap.enabled = true;

    this.setupLights();
    this.setupFloor();
    this.setupBox();


    this.physics.addScene( this.scene );
  }

  setupLights(){
    const hemiLight = new THREE.HemisphereLight();
		this.scene.add( hemiLight );

		const dirLight = new THREE.DirectionalLight( 0xffffff, 3 );
		dirLight.position.set( 5, 5, 5 );
		dirLight.castShadow = true;
		dirLight.shadow.camera.zoom = 2;
		this.scene.add( dirLight );
  }

  setupFloor(){
    const floor = new THREE.Mesh(
      new THREE.BoxGeometry( 10, 5, 10 ),
      //new THREE.ShadowMaterial( { color: 0x444488 } )
      new THREE.MeshBasicMaterial( { color: 0x444488 } )
    );
    floor.position.y = - 2.5;
    floor.receiveShadow = true;
    floor.userData.physics = { mass: 0 };
    this.scene.add( floor );
  }

  setupBox(){
    const material = new THREE.MeshLambertMaterial();
		const matrix = new THREE.Matrix4();
		const color = new THREE.Color();

    const box = new THREE.Mesh(
      new THREE.BoxGeometry( 1, 1, 1 ),
      new THREE.MeshBasicMaterial( { color: 0x444444 } )
    );
    console.log(box)
    box.castShadow = true;
    box.receiveShadow = true;
    box.userData.physics = { mass: 1 };

    box.position.y = 10.0;
    this.scene.add( box );
  }

}


const ThreeEL = () => {
  const engine = van.state(null);
  const renderEL = canvas({id:'CanvasThreeJS'});

  function init(){
    //const renderer = new THREE.WebGLRenderer();
    engine.val = new ThreeRapierTest({canvas:renderEL});
    //console.log(engine.val);
  }

  init();

  return renderEL;
};

van.add(document.body,ThreeEL())