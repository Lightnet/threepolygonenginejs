// 
//import * as three from 'https://unpkg.com/three@0.157.0/build/three.module.js';
//import { OrbitControls } from 'https://unpkg.com/three@0.157.0/examples/jsm/controls/OrbitControls.js';

//import * as THREE from 'https://cdn.skypack.dev/three@0.160.0/build/three.module.js';
//import { OrbitControls } from 'https://cdn.skypack.dev/three@0.160.0/examples/jsm/controls/OrbitControls.js';
import { THREE, OrbitControls  } from "./ThreeAPI.js";

import van from "https://cdn.jsdelivr.net/gh/vanjs-org/van/public/van-1.2.1.min.js";
import { PhysicsFrameWork } from './physicsframework.js';
const {button, canvas, input, label, div, script, pre, p, ul, li, a} = van.tags;

//console.log(OrbitControls);
//{style:`position:fixed;top:0px,left:0px;`}
const editorAreaEL=()=>{
  const editorAreaEL = div({
    id:'editorarea',
    style:"position:fixed;top:0px;left:0px;"
  });

  return editorAreaEL;
}


class TriEngine {

  renderer = null;
  camera = null;
  scene = null;

  clock=null;

  physics=null

  constructor(args){
    console.log("init...")
    this.clock = new THREE.Clock();
    
    // check for canvas element
    if (args?.canvas){
      const _renderer = new THREE.WebGLRenderer({
        canvas:args.canvas,
        antialias: true,
        //alpha: true,
      });
      this.renderer = _renderer;
      console.log(this.renderer)
    }else{
      console.log("ERROR Canvas Element needed!");
      throw new Error('Parameter is need Canvas Element!');
    }

    this.setup_render();
    this.setup_window_resize();
    // Check for physics
    if(args?.isPhysics){
      console.log('init physics');
      this.physics = new PhysicsFrameWork();
      this.physics.event.listen("Ready",()=>{
        console.log('init physics event...')
        this.init();
        this.init_editor();
      });
    }else{
      this.init();
    }
    //this.init_editor();
  }

  init(){
    
  }

  init_editor(){
    van.add(document.body,editorAreaEL())
  }

  setup_render(){
    this.renderer.setSize( window.innerWidth, window.innerHeight );

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    
    //const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    //const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    //const cube = new THREE.Mesh( geometry, material );
    //this.scene.add( cube );

    this.camera.position.z = 5;

    const self = this;

    this.controls = new OrbitControls(this.camera, this.renderer.domElement)

    function animate() {
      //requestAnimationFrame( animate );
      this.renderer.render( this.scene, this.camera );
      //cube.rotation.x += 0.01;
      //cube.rotation.y += 0.01;
      //this.controls.update()
      this.update();
    }
    //animate();
    this.renderer.setAnimationLoop(animate.bind(this));
  }

  setup_window_resize(){
    window.addEventListener('resize',this.resize_window.bind(this));
  }

  update(){
    if(this.physics){
      this.physics.update();
    }
  }

  resize_window(){
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize( window.innerWidth, window.innerHeight );
  }

};

const ThreeEL = () => {
  const engine = van.state(null);
  const renderEL = canvas({id:'threejs'});
  function init(){
    //const renderer = new THREE.WebGLRenderer();
    engine.val = new TriEngine({canvas:renderEL});
    //console.log(engine.val);//
  }
  init();
  return div({style:"position:fixed;top:0px;left:0px;"},
    renderEL
  )
};


export default TriEngine;
export {
  TriEngine,
  ThreeEL,
}