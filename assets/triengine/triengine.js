// 
//import * as three from 'https://unpkg.com/three@0.157.0/build/three.module.js';
//import { OrbitControls } from 'https://unpkg.com/three@0.157.0/examples/jsm/controls/OrbitControls.js';

import * as THREE from 'https://cdn.skypack.dev/three@0.128.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/controls/OrbitControls.js';

import van from "https://cdn.jsdelivr.net/gh/vanjs-org/van/public/van-1.2.1.min.js";
const {button, canvas, input, label, div, script, pre, p, ul, li, a} = van.tags;

console.log(OrbitControls);

class TriEngine {

  renderer = null;
  camera = null;
  scene = null;

  constructor(args){
    console.log("init...")
    let iscanvasEL = false
    if(args?.canvas){
      iscanvasEL = true;
    }
    console.log(this.renderer);
    if (iscanvasEL){
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

    window.addEventListener('resize',this.resize_window.bind(this));
    this.init();
  }

  init(){

  }

  update(){

  }

  resize_window(){
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize( window.innerWidth, window.innerHeight );
  }

};
/*
const ThreeEL = () => {
  const engine = van.state(null);
  const renderEL = canvas({id:'threejs'});
  function init(){
    //const renderer = new THREE.WebGLRenderer();
    engine.val = new TriEngine({canvas:renderEL});
    console.log(engine.val);//
  }
  init();
  return div(
    renderEL
  )
};
*/

export default TriEngine;
export {
  TriEngine,
  //ThreeEL,
}