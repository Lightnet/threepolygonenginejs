// rework build


// https://www.geeksforgeeks.org/enums-in-javascript/#:~:text=Enums%20in%20JavaScript%20are%20used,readability%2C%20maintainability%20and%20prevent%20errors.
import { 
  THREE,
  CSS3DRenderer,
  CSS3DObject,
  OrbitControls, 
  ECS,
  van
} from "./dps.js";
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
    
    //window listen
    //this.setupWindowResize();
    //ECS
    console.log("ECS set up...")
    //console.log(this.physics)
    this.setupECS();
    this.setupRenderer();
    this.setupCSSRenderer();
    this.setupViews();
    
  }

  setupECS(){
    this.world = ECS.createWorld();
    
    if(this.isPhysics){
      this.setupECSPhysics();
    }
    
    ECS.addSystem(this.world, this.querySystemTest);
    ECS.addSystem(this.world, this.mousePositionSystem.bind(this));
    //ECS.addSystem(this.world, this.mousePositionLogSystem.bind(this));
    ECS.addSystem(this.world, this.resizeWindowInnerSystem);
    //ECS.addSystem(this.world, this.resizeWindowInnerlogSystem); //test
    
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
    //const _renderer = new THREE.WebGLRenderer({canvas:args.canvas,antialias: true,alpha: true});
    const _renderer = new THREE.WebGLRenderer(config);
    this.renderer = _renderer;
    this.renderer.setSize( window.innerWidth, window.innerHeight );

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    this.camera.position.z = 5;

    ECS.addSystem(this.world, this.ECSRenderSystem.bind(this));
  }
  //ECS render system
  ECSRenderSystem(world){
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

  resizeWindowInnerSystem(world){

    const ECSInner = ECS.createEntity(world);
    ECS.addComponentToEntity(world, ECSInner, 'innerWidth', window.innerWidth || 0);
    ECS.addComponentToEntity(world, ECSInner, 'innerHeight', window.innerHeight || 0);
    ECS.addComponentToEntity(world, ECSInner, 'isResize', true);

    //let isResize = false;
    let width = window.innerWidth;
    let height = window.innerHeight;
    //console.log(ECSInner);

    const onUpdate = function (dt) {
      const ECSWin = ECS.getEntity(world, ['innerWidth', 'innerHeight','isResize']);
      if(ECSWin){
        ECSWin.innerWidth = window.innerWidth;
        ECSWin.innerHeight = window.innerHeight;
        if(width != window.innerWidth){
          width = window.innerWidth;
          //console.log("resize");
          ECSWin.isResize = true; 
        }else if(height != window.innerHeight){
          //console.log("resize");
          height = window.innerHeight
          ECSWin.isResize = true;
        }else{
          //console.log("no resize");
          ECSWin.isResize = false;
        }
        //console.log(ECSWin);
      }
    }

    return { 
      onUpdate
    };
  }

  resizeWindowInnerlogSystem(world){
    
    const onUpdate = function (dt) {
      const ECSWin = ECS.getEntity(world, ['innerWidth', 'innerHeight']);
      if(ECSWin){
        console.log("ECSWin");
        console.log(ECSWin);
      }
    }

    return { 
      onUpdate
    };
  }
  //get entity by unique id
  mousePositionSystem(world){
    console.log("init mouse pointer...")
    const ECSPointer = ECS.createEntity(world);
    //ECS.addComponentToEntity(world, ECSPointer, 'clientX', 0);//fail undefined
    //ECS.addComponentToEntity(world, ECSPointer, 'clientY', 0);//fail undefined

    ECS.addComponentToEntity(world, ECSPointer, 'clientX', 1);// 0=will not work.
    ECS.addComponentToEntity(world, ECSPointer, 'clientY', 1);

    function mouseMovePoint(event){
      //console.log(event.clientX)
      ECSPointer.clientX = event.clientX;
      ECSPointer.clientY = event.clientY;
      //console.log(world);
      //const ECSPoint = ECS.getEntity(world, ['clientX', 'clientY']);
      //console.log(ECSPoint)
      //const id1 = ECS.getEntityId(world, ECSPointer);
      //const e = ECS.getEntityById(world, id1);
      //console.log(id1);
      //console.log(e);
      //e.clientX = event.clientX;
      //e.clientY = event.clientY;
    }

    window.addEventListener('mousemove', mouseMovePoint);

    const onUpdate = function (dt) {
      //console.log("update pointer");
      const ECSPoint = ECS.getEntity(world, ['clientX','clientY']);
      //console.log("update pointer", ECSPoint);
      if(ECSPoint){
        console.log(ECSPoint);
      }
    }

    return { 
      //onUpdate
    };
  }

  mousePositionLogSystem(world){

    const onUpdate = function (dt) {
      const ECSPoint = ECS.getEntity(world, ['clientX','clientY']);
      //console.log("update pointer", ECSPoint);
      if(ECSPoint){
        console.log(ECSPoint);
      }
    }

    return { 
      onUpdate
    };
  }

  resizeCSSScreenSystem(world){

    const screenToWorld = this.screenToWorld;//no variable from class
    const resizeViewPort = this.resizeViewPort.bind(this);//has variable from class

    const onUpdate = function (dt) {
      //console.log("update???")
      //const ECSPoint = ECS.getEntity(world, ['clientX', 'clientY']);
      const ECSWin = ECS.getEntity(world, ['innerWidth', 'innerHeight']);
      const ECSView = ECS.getEntity(world, ['cssCamera']);
      //console.log(Canvas);
      //if(ECSPoint && ECSWin && ECSView){
      if(ECSWin && ECSView){
        //console.log(ECSWin);
        //console.log(ECSPoint);
        //console.log(ECSView);
        if(ECSWin.isResize){//update if resize is true
          const pos = screenToWorld({
            x: 1,
            y: 1,
            canvasWidth: window.innerWidth,
            canvasHeight: window.innerHeight,
            camera:ECSView.cssCamera
          });
          //console.log(pos);
          resizeViewPort(pos);
        }
      }
    }

    return { 
      onUpdate 
    }
  }

  resizeViewPort(pos){
    //console.log(this.cssScreen)
    
    if(this.cssScreen){
      let width = Math.abs(pos.x*2);
      var offset = -10;//testing...
      this.cssScreen.style.width = ((width) + offset)+'px';
      this.cssScreen.style.height = ((pos.y*2) + offset)+'px';
    }
    
  }

  //div element 
  setupCSSRenderer(){
    const _cssrenderer = new CSS3DRenderer();
    //STYLE
    _cssrenderer.domElement.style.position='fixed';
    _cssrenderer.domElement.style.top='0px';
    _cssrenderer.setSize(window.innerWidth,window.innerHeight);
    //assign to class var
    this.cssRenderer = _cssrenderer;
    this.cssScene = new THREE.Scene();
    this.cssCamera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    //setup ECS loop
    ECS.addSystem(this.world, this.cssRendererSystem.bind(this));
    //config
    this.cssCamera.position.set( 0, 0, 610 );
    this.cssCamera.lookAt(0,0,0);
    
    //add doc body for renderer
    van.add(document.body, _cssrenderer.domElement);
    //resize window
    window.addEventListener('resize',this.resizeCSSRenderer.bind(this));
    //setup
    //this.createCssScreen();
  }

  resizeCSSRenderer(){
    this.cssCamera.aspect = window.innerWidth / window.innerHeight;
    this.cssCamera.updateProjectionMatrix();
    this.cssRenderer.setSize( window.innerWidth, window.innerHeight );
  }

  cssRendererSystem(world){
    console.log("init cssrenderer system...")
    const renderer = this.cssRenderer;
    const camera = this.cssCamera;
    const scene = this.cssScene;
    //console.log(renderer)
    //console.log(camera)
    //console.log(scene)

    const ECSCSSRender = ECS.createEntity(world);

    ECS.addComponentToEntity(world, ECSCSSRender, 'cssrenderer', renderer);
    ECS.addComponentToEntity(world, ECSCSSRender, 'cssCamera', camera);
    ECS.addComponentToEntity(world, ECSCSSRender, 'cssScene', scene);

    const onUpdate = function (dt) {
      //console.log("update???")
      const ECSCSS = ECS.getEntity(world, [ 'cssrenderer', 'cssCamera','cssScene']);
      //console.log(ECSCSS);
      ECSCSS.cssrenderer.render(ECSCSS.cssScene,ECSCSS.cssCamera);
    }
    return { onUpdate }
  }

  createCssScreen(){
    const cssDiv = div({id:'DIVSCREEN01',style:"width:800px;height:600px;"})
    cssDiv.style.width = window.innerWidth + 'px';
    cssDiv.style.height = window.innerHeight + 'px';
    cssDiv.style.backgroundColor ="lightblue";

    //var cssDiv = document.createElement('div');
    //cssDiv.style.width = 800+'px';
    //cssDiv.style.height = 600+'px';
    //cssDiv.style.background = new THREE.Color(Math.random() * 0xffffff).getStyle();
    this.cssScreen = cssDiv;
    var cssElement = new CSS3DObject(cssDiv);
    //console.log(cssElement)
    //cssElement.position.set(0, 0, 0);
    this.cssScene.add(cssElement);
    //console.log(this.cssScene);

    //window.addEventListener('resize',this.cssResizeScreen.bind(this));
    //window.addEventListener('resize',this.cssResizeScreen);//nope
  }

  //https://discourse.threejs.org/t/convert-screen-2d-to-world-3d-coordiate-system-without-using-raycaster/13739/6
  screenToWorld({ x, y, canvasWidth, canvasHeight, camera }) {
    const coords = new THREE.Vector3(
        (x / canvasWidth) * 2 - 1,
        -(y / canvasHeight) * 2 + 1,
        0.5
    )
    const worldPosition = new THREE.Vector3()
    const plane = new THREE.Plane(new THREE.Vector3(0.0, 0.0, 1.0))//face camera?
    const raycaster = new THREE.Raycaster()
    raycaster.setFromCamera(coords, camera)
    return raycaster.ray.intersectPlane(plane, worldPosition)
  }

  cssResizeScreen(event){
    //console.log(this.cssScene);
    if(this.cssScreen){
      this.cssScreen.style.width = window.innerWidth + 'px';
      this.cssScreen.style.height = window.innerHeight + 'px';
    }
  }

  setupViews(){
    this.createCssScreen();
    //console.log(this.renderer.domElement);
    this.cssScreen.appendChild(this.renderer.domElement);
    this.setupWindowResize();
    ECS.addSystem(this.world, this.resizeCSSScreenSystem.bind(this)); //
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