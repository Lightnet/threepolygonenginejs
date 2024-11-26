/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

// simple test three and ecs
// rework build

// https://www.geeksforgeeks.org/enums-in-javascript/#:~:text=Enums%20in%20JavaScript%20are%20used,readability%2C%20maintainability%20and%20prevent%20errors.
//import van from "https://cdn.jsdelivr.net/gh/vanjs-org/van/public/van-1.2.1.min.js";

import { 
  THREE, 
  OrbitControls, 
  ECS, 
  van,
  Stats,
  GUI
} from "/dps.js";

//const {canvas, div} = van.tags;

//protoype test build
class TriECSEngine{

  renderer = null;
  camera = null;
  scene = null;
  clock=null;
  physics=null
  canvasEL=null;
  divEl=null;
  world=null;
  currentTime = performance.now()
  isRun=false;

  constructor(args={}){
    console.log("init...");
    this.clock = new THREE.Clock();

    if(args?.isPhysics){
      this.setup();
    }else{
      this.setup();
    }
  }

  setup(){
    this.delta = 0
    //Element html
    this.setupElement();
    this.setupRenderer();
    //window listen resize
    this.setupWindowResize();
    //ECS
    this.setupECS();
    this.createGUI();
  }

  createGUI(){
    this.gui = new GUI();
    const gui = this.gui;
    gui.add(this,'delta').listen().disable()
    gui.add(this.orbitControls,'enabled').name('is orbitControls')
  }

  setupECS(){
    this.world = ECS.createWorld();
    ECS.addSystem(this.world, this.setupECSRender.bind(this));
    ECS.addSystem(this.world, this.setupOrbitControls.bind(this));
  }

  //setup for doc> body to attach element for renderer
  setupElement(){
    this.stats = new Stats();
    van.add(document.body,this.stats.dom);
    //this.divEL = div({id:'CSSRENDER',style:"height:100%;width:100%;"});
    //this.canvasEL = canvas({id:'CANVAS',style:"position:fixed;top:0px;left:0px;height:100%;width:100%;"});

    //van.add(this.divEL,this.canvasEL);
    //set up doc for three, ecs and css
    //van.add(document.body,this.divEL);
  }

  setupRenderer(){
    let config = {}
    if(this.canvasEL){
      config.canvas = this.canvasEL;
    }
    this.renderer = new THREE.WebGLRenderer(config);

    //const _renderer = new THREE.WebGLRenderer({
      //canvas:args.canvas,
      //antialias: true,
      //alpha: true,
    //});
    
    this.renderer.setSize( window.innerWidth, window.innerHeight );

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    this.camera.position.z = 5;
    van.add(document.body,this.renderer.domElement);
    console.log(this.renderer.domElement);
  }

  setupOrbitControls(world){
    //OrbitControls
    const Canvas = ECS.getEntity(world, [ 'renderer', 'camera']);
    //console.log(Canvas);
    const orbitControls = new OrbitControls( Canvas.camera, Canvas.renderer.domElement );
    this.orbitControls = orbitControls;

    const onUpdate = function (dt) {
      orbitControls.update()
    }

    return { onUpdate }
  }

  setupECSRender(world){
    //set up
    const renderer = this.renderer;
    const camera = this.camera;
    const scene = this.scene;

    const ECSCanvas = ECS.createEntity(world);
    
    ECS.addComponentToEntity(world, ECSCanvas, 'renderer', renderer);
    ECS.addComponentToEntity(world, ECSCanvas, 'camera', camera);
    ECS.addComponentToEntity(world, ECSCanvas, 'scene', scene);

    const onUpdate = function (dt) {
      //console.log("update???")
      const Canvas = ECS.getEntity(world, [ 'renderer', 'camera','scene']);
      //console.log(Canvas);
      Canvas.renderer.render(Canvas.scene,Canvas.camera);
    }

    return { onUpdate }
  }

  update(){
    //compare time
    const newTime = performance.now();
    const frameTime = newTime - this.currentTime;  // in milliseconds, e.g. 16.64356
    this.currentTime = newTime
    //console.log(frameTime); //display
    this.delta = frameTime;
    if(this.stats){
      this.stats.update();
    }

    // run onUpdate for all added systems
    ECS.update(this.world, frameTime)
    // necessary cleanup step at the end of each frame loop
    ECS.cleanup(this.world)

    // requestAnimationFrame(()=>{
    //   this.update();
    // })
  }

  setupWindowResize(){
    window.addEventListener('resize',this.resizeWindowHander.bind(this));
  }

  resizeWindowHander(){
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize( window.innerWidth, window.innerHeight );
  }

  run(){
    this.isRun=true;
    this.currentTime = performance.now()
    this.renderer.setAnimationLoop(this.update.bind(this));
    //this.update();
  }

}

class SampleTest extends TriECSEngine{
  constructor(args){
    super(args)
  }

  run(){
    super.run();
    console.log("run...");
    const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    const cube = new THREE.Mesh( geometry, material );
    this.scene.add( cube );
  }
}

const app = new SampleTest();
app.run();