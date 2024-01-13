


import * as THREE from 'https://unpkg.com/three@0.157.0/build/three.module.js';
import van from "https://cdn.jsdelivr.net/gh/vanjs-org/van/public/van-1.2.1.min.js";
import { TriEngine } from './triengine/triengine.js';
//import RAPIER from 'https://cdn.skypack.dev/@dimforge/rapier3d-compat';

const {button, canvas, input, label, div, script, pre, p, ul, li, a} = van.tags;

class CraftMobile extends TriEngine{

  constructor(args){
    super(args);
  }

  init(){
    super.init();
    this.setup_BaseScene();
  }

  setup_lights(){
    //Add hemisphere light
    let hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.1 );
    hemiLight.color.setHSL( 0.6, 0.6, 0.6 );
    hemiLight.groundColor.setHSL( 0.1, 1, 0.4 );
    hemiLight.position.set( 0, 50, 0 );
    this.scene.add( hemiLight );

    //Add directional light
    let dirLight = new THREE.DirectionalLight( 0xffffff , 1);
    dirLight.color.setHSL( 0.1, 1, 0.95 );
    dirLight.position.set( -1, 1.75, 1 );
    dirLight.position.multiplyScalar( 100 );
    this.scene.add( dirLight );
  }

  setup_ground(){
    let pos = {x: 0, y: -1, z: 0};
    let scale = {x: 10, y: 0.1, z: 10};
    let quat = {x: 0, y: 0, z: 0, w: 1};
    let mass = 0;

    //threeJS Section
    let blockPlane = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshPhongMaterial({color: 0xa0afa4}));

    blockPlane.position.set(pos.x, pos.y, pos.z);
    blockPlane.scale.set(scale.x, scale.y, scale.z);

    blockPlane.castShadow = true;
    blockPlane.receiveShadow = true;

    this.scene.add(blockPlane);
    this.physics.create_body_ground();

  }

  setup_ball(){
    let pos = {x: 0, y: 20, z: 0};
    let radius = 1;
    let quat = {x: 0, y: 0, z: 0, w: 1};
    let mass = 1;

    //threeJS Section
    let ball = new THREE.Mesh(new THREE.SphereGeometry(radius), new THREE.MeshPhongMaterial({color: 0xff0505}));
    ball.position.set(pos.x, pos.y, pos.z);
    
    ball.castShadow = true;
    ball.receiveShadow = true;
    console.log(this.scene);

    this.scene.add(ball);

    let rigidBody = this.physics.create_body_cube({pos:{y:20}});

    ball.userData.physicsBody = rigidBody;
    this.physics.add_body_sync(ball);

  }

  setup_BaseScene(){
    this.setup_lights();
    this.setup_ground();
    this.setup_ball();
  }

  update(){
    super.update();
    //console.log("update?");
  }

}

const ThreeEL = () => {
  const engine = van.state(null);
  const renderEL = canvas({id:'threejs'});

  function init(){
    //const renderer = new THREE.WebGLRenderer();
    engine.val = new CraftMobile({canvas:renderEL,isPhysics:true});
    console.log(engine.val);//
  }

  init();

  return div(
    renderEL
  )
};

van.add(document.body,ThreeEL())




