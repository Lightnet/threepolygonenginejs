// simple test three and ecs
// rework build

// https://www.geeksforgeeks.org/enums-in-javascript/#:~:text=Enums%20in%20JavaScript%20are%20used,readability%2C%20maintainability%20and%20prevent%20errors.
import { THREE, OrbitControls, ECS  } from "./dps.js";
import van from "https://cdn.jsdelivr.net/gh/vanjs-org/van/public/van-1.2.1.min.js";
//import { PhysicsFrameWork } from './physicsframework.js';

const {canvas, div} = van.tags;

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
      //console.log('init physics');
      //this.physics = new PhysicsFrameWork();
      //this.physics.event.listen("Ready",()=>{
        //console.log('init physics event...')
        //this.init();
        //this.init_editor();
      //});
    }else{
      this.setup();
    }

  }

  setup(){
    //Element html
    this.setupElement();
    this.setupRenderer();
    //window listen resize
    this.setupWindowResize();
    //ECS
    this.setupECS();
    this.setupSystems();
  }

  setupECS(){
    this.world = ECS.createWorld();
  }

  //setup for doc> body to attach element for renderer
  setupElement(){
    this.divEL = div({id:'CSSRENDER',style:"height:100%;width:100%;"});
    this.canvasEL = canvas({id:'CANVAS',style:"position:fixed;top:0px;left:0px;height:100%;width:100%;"});

    van.add(this.divEL,this.canvasEL);
    //set up doc for three, ecs and css
    van.add(document.body,this.divEL);
  }

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

  setupSystems(){
    ECS.addSystem(this.world, this.setupECSRender.bind(this));
  }

  update(){
    //compare time
    const newTime = performance.now();
    const frameTime = newTime - this.currentTime;  // in milliseconds, e.g. 16.64356
    this.currentTime = newTime
    //console.log(frameTime); //display 

    // run onUpdate for all added systems
    ECS.update(this.world, frameTime)
    // necessary cleanup step at the end of each frame loop
    ECS.cleanup(this.world)

    requestAnimationFrame(()=>{
      this.update();
    })
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
    //this.renderer.setAnimationLoop(this.update.bind(this));
    this.update();
  }

}

const app = new TriECSEngine();
app.run();