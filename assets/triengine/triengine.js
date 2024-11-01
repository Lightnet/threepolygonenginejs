/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

// protoype test

import { 
  THREE, 
  OrbitControls, 
  van  
} from "./_dps.js";
import { PhysicsFrameWork } from './physicsframework.js';
const {canvas} = van.tags;

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
  physics=null;
  isPhysics=false;

  constructor(args){
    //console.log("init...")
    this.clock = new THREE.Clock();
    
    // check for canvas element
    if (args?.canvas){
      const _renderer = new THREE.WebGLRenderer({
        canvas:args.canvas,
        antialias: true,
        //alpha: true,
      });
      this.renderer = _renderer;
      //console.log("this.renderer")
      //console.log(this.renderer)
    }else{
      console.log("ERROR Canvas Element needed!");
      //throw new Error('Parameter is need Canvas Element!');
    }

    this.setup_render();
    if(args?.resize == 'parent'){

    }else if(args?.resize == 'window'){
      //console.log("init resize...");
      this.setup_window_resize();
    }else{
      this.setup_window_resize();
    }
    // Check for physics
    if(args?.isPhysics){
      console.log('init physics');
      this.physics = new PhysicsFrameWork();
      this.physics.event.listen("Ready",()=>{
        //console.log('init physics event...')
        this.init();
        //this.init_editor();
      });
    }else{
      this.init();
    }
    //this.init_editor();
  }

  async init(){
    
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
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.renderer.setAnimationLoop(this.update.bind(this));
  }

  setup_window_resize(){
    window.addEventListener('resize',this.resize_window.bind(this));
  }

  update(){
    if(this.renderer){
      this.renderer.render( this.scene, this.camera );
    }
    if(this.physics !=null && this.isPhysics==true){
      this.physics.update();
    }
  }

  resize_window(){
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize( window.innerWidth, window.innerHeight );
  }

  resize(width, height, options=null){
    if(options){
      if(options?.parent=='sub'){
        //this is for css sub parent...
        //console.log(this.renderer.domElement);
        let parent = this.renderer.domElement.parentNode;

        let _width = parseFloat(String(parent.style.width).replace("px",""));
        let _height = parseFloat(String(parent.style.height).replace("px",""));
        //console.log("_width:",_width);
        //console.log("_height:",_height);
        this.camera.aspect = _width / _height;
        this.camera.updateProjectionMatrix();
        this.renderer.domElement.style.width = parent.style.width;
        this.renderer.domElement.style.height = parent.style.height;
        return;
      }
    }

    if(this.camera && this.renderer){
      //console.log("width:", width, " height:", height);
      //width =  window.innerWidth;
      //height =  window.innerHeight;
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize( width, height );
      //console.log(this.renderer.getSize());
    }
  }

  //
  resizeParent(){
    let parent = this.renderer.domElement.parentNode;

    let _width = parseFloat(String(parent.style.width).replace("px",""));
    let _height = parseFloat(String(parent.style.height).replace("px",""));
    //console.log("_width:",_width);
    //console.log("_height:",_height);
    this.camera.aspect = _width / _height;
    this.camera.updateProjectionMatrix();
    this.renderer.domElement.style.width = parent.style.width;
    this.renderer.domElement.style.height = parent.style.height;
  }

  domElement(){
    return this.renderer.domElement;
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