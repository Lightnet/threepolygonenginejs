/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

// protoype test

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

import { THREE, OrbitControls, van } from "/dps.js";
//import { PhysicsFrameWork } from './physics_rapier.js';
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


class TriFrameWork {

  renderer = null;
  camera = null;
  scene = null;
  clock=null;
  physics=null;
  isPhysics=false;
  physicsType="none";
  isResize=true;

  constructor(args){
    console.log("init: ",args)
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

    // if(args?.resize == 'parent'){
    // }else if(args?.resize == 'window'){
    //   //console.log("init resize...");
    //   this.setup_window_resize();
    // }else{
    //   this.setup_window_resize();
    // }
    // Check for physics
    if(args?.isPhysics){
      this.isPhysics = args.isPhysics
      console.log('init physics');
      if(args?.physicsType){
        this.initPhysics(args.physicsType)
      }
    }else{
      console.log("NO PHYSICS...");
      this.init();
    }
    //this.init_editor();
  }

  async init(){
    await this.setup();
  }

  async initPhysics(_type){
    console.log("Physics Type:", _type)
    if(_type == "ammo"){
      const {default:_physics} = await import('./framework_physics_ammo.js');
      this.physics = new _physics();
      //console.log(this.physics);
      await this.physics.init();
      await sleep(1000);
      await this.init();
    }else if (_type == "jolt"){
      const {default:_physics} = await import('./framework_physics_jolt.js');
      this.physics = new _physics();
      //console.log(this.physics);
      //await sleep(1000);
      await this.physics.init();
      await this.init();
    }else if (_type == "rapier"){
      const {default:_physics} = await import('./framework_physics_rapier.js');
      this.physics = new _physics();
      //console.log(this.physics);
      await this.physics.init();
      await this.init();
    }else{
      console.log("PHYSICS NOT SUPPORT!");
    }
    //await this.setup();
  }


  async setup(){
    this.setupRenderer();
    this.setupWindowResize();
  }

  init_editor(){
    van.add(document.body,editorAreaEL())
  }

  setupRenderer(){
    
    this.renderer.setSize( window.innerWidth, window.innerHeight );

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    this.camera.position.z = 5;
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    //this.renderer.setAnimationLoop(this.update.bind(this));
    //this.renderer.setAnimationLoop(this.update);//nope
    const self = this;
    this.renderer.setAnimationLoop(()=>{
      //const deltaTime = self.clock.getDelta();
      //console.log(deltaTime);
      self.update();
    });
  }

  setupWindowResize(){
    window.addEventListener('resize',this.resize_window.bind(this));
  }

  createMeshBox(){
    //const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    //const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    //const cube = new THREE.Mesh( geometry, material );
    //this.scene.add( cube );
  }

  update(){
    
    if(this.renderer){
      this.renderer.render( this.scene, this.camera );
    }
    //console.log(this.physics);
    //console.log(this.isPhysics);
    if(this.physics !=null && this.isPhysics==true){
      //console.log("update physics")
      const deltaTime = this.clock.getDelta();
      //console.log("deltaTime:",deltaTime);
      this.physics.update(deltaTime);
    }
  }

  resize_window(event){
    //this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.aspect = window.innerWidth / window.innerHeight
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

  physicsAPI(){
    return this.physics.API();
  }

  physicsWorld(){
    return this.physics.world;
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

export default TriFrameWork;
export {
  TriFrameWork,
  ThreeEL,
}