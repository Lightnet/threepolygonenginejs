// rework build


// https://www.geeksforgeeks.org/enums-in-javascript/#:~:text=Enums%20in%20JavaScript%20are%20used,readability%2C%20maintainability%20and%20prevent%20errors.
import { THREE, OrbitControls, ECS  } from "./dps.js";
import van from "https://cdn.jsdelivr.net/gh/vanjs-org/van/public/van-1.2.1.min.js";
import { PhysicsFrameWork } from './physicsframework.js';

const {canvas, div} = van.tags;

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
  isPhysics=false;

  constructor(args={}){
    console.log("init...");
    this.clock = new THREE.Clock();

    if(args?.isPhysics==true){
      this.isPhysics=true
      //console.log('init physics');
      this.physics = new PhysicsFrameWork();
      this.physics.event.listen("Ready",()=>{
        console.log('Physics ready!');
        this.setup();
        //this.init_editor();
      });
    }else{
      this.setup();
    }

  }

  addSystem(world=null,_system){
    if(world){
      ECS.addSystem(world,_system)
    }else{
      ECS.addSystem(this.world,_system)
    }
    
  }

  getScene(){
    return this.scene;
  }

  getCamera(){
    return this.camera;
  }

  getPhysicsWorld(){
    return this.physicsWorld;
  }

  setup(){
    //Element html
    this.setupElement();
    this.setupRenderer();
    //window listen
    this.setupWindowResize();
    //ECS
    console.log("ECS set up...")
    //console.log(this.physics)
    this.setupECS();
  }

  setupECS(){
    this.world = ECS.createWorld();
    ECS.addSystem(this.world, this.setupECSRender.bind(this));
    if(this.isPhysics){
      this.setupECSPhysics();
    }
    
    ECS.addSystem(this.world, this.querySystemTest);
  }

  setupElement(){
    this.divEL = div({id:'CSSRENDER',style:"height:100%;width:100%;"});
    this.canvasEL = canvas({id:'CANVAS',style:"position:fixed;top:0px;left:0px;height:100%;width:100%;"});

    van.add(this.divEL,this.canvasEL);
    //set up doc for three, ecs and css
    van.add(document.body,this.divEL);
  }

  //canvas
  setupRenderer(){
    let config = {}
    if(this.canvasEL){
      config.canvas = this.canvasEL;
    }
    const _renderer = new THREE.WebGLRenderer(config);

    //const _renderer = new THREE.WebGLRenderer({
      //canvas:args.canvas,
      //antialias: true,
      //alpha: true,
    //});
    this.renderer = _renderer;


    this.renderer.setSize( window.innerWidth, window.innerHeight );

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    this.camera.position.z = 5;

  }
  //ECS render system
  setupECSRender(world){
    //set up
    const renderer = this.renderer;
    const camera = this.camera;
    const scene = this.scene;

    const ECSCanvas = ECS.createEntity(world);
    //console.log(ECSCanvas)

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
  //INPUT user control
  setupInput(world){
    var keys={
      "q":false,
    }
  }

  //div element 
  setupCSSRenderer(){

  }
  //set up phyiscs ECS
  setupECSPhysics(){
    ECS.addSystem(this.world, this.physicsSystem.bind(this))
  }

  //ECS SYSTEM SETUP & UPDATE
  physicsSystem(world){
    console.log("physicsSystem")
    console.log(this.physics)
    var physics = this.physics;
    

    const ECSPhysics = ECS.createEntity(world);
    ECS.addComponentToEntity(world, ECSPhysics, 'physicsWorld', physics)

    const onUpdate = function (dt) {
      const entity = ECS.getEntity(world, [ 'physicsWorld' ])
      if(entity.physicsWorld){
        entity.physicsWorld.update();
      }
    }

    return { onUpdate }

  }

  update(){
    if(this.isRun==false){
      return;
    }
    //compare time
    const newTime = performance.now();
    const frameTime = newTime - this.currentTime;  // in milliseconds, e.g. 16.64356
    this.currentTime = newTime
    //console.log(frameTime); //display 

    // run onUpdate for all added systems
    //console.log(this.world);
    if(this.world){//check if world exist if physics is enable is delay update var
      ECS.update(this.world, frameTime)
      // necessary cleanup step at the end of each frame loop
      ECS.cleanup(this.world)
    }

    //if(this.renderer){
      //this.renderer.render( this.scene, this.camera );
    //}
    //if(this.physics){
      //this.physics.update();
    //}

    requestAnimationFrame(this.update.bind(this));
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
    //this.renderer.setAnimationLoop(this.update.bind(this));
    this.currentTime = performance.now()
    this.update();
  }

  stop(){
    this.isRun = false;
  }

  //
  querySystemTest(world){

    const onUpdate = function (dt) {

      //const entity = ECS.getEntity(world, ['scene'])
      //console.log(entity);

    }

    return { onUpdate }
  }

}

export{
  TriECSEngine
}