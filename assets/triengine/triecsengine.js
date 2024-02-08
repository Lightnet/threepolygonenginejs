/*
  Layout:
    There are predefine setup for UI. There are two renders Renderer and CSS3DRenderer.

*/

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
  //three.js
  renderer=null;
  camera=null;
  scene=null;
  cssRenderer=null;
  cssScene=null;
  cssCamera=null;
  clock=null;//
  //rapier
  physics=null;//
  isPhysics=false; // internal Physics?
  //html
  canvasEL=null;//this is for renderer canvas
  divEl=null;// CSSRENDERER
  //ECS
  world=null;// ECS
  //browser
  currentTime = performance.now()
  isRun=false; //run game loop
  
  constructor(args={}){
    //console.log("init...");
    this.clock = new THREE.Clock();

    if(args?.isPhysics==true){
      this.isPhysics=true
      //console.log('init physics');
      this.physics = new PhysicsFrameWork();
      this.physics.event.listen("Ready",()=>{
        //console.log('Physics ready!');
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

  //ECS
  blankSystem(world){
    const onUpdate = function (dt){ };

    return { 
      onUpdate
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
    //console.log("ECS set up...")
    //console.log(this.physics)
    this.setupECS();
    this.setupViews();
  }

  setupECS(){
    this.world = ECS.createWorld();
    
    if(this.isPhysics){
      this.setupECSPhysics();
    }
    // set up window listern for mouse to system
    ECS.addSystem(this.world, this.mousePositionSystem.bind(this));
    //ECS.addSystem(this.world, this.mousePositionLogSystem.bind(this));
    // set up window inner resize to system
    ECS.addSystem(this.world, this.resizeWindowInnerSystem);
    //ECS.addSystem(this.world, this.resizeWindowInnerlogSystem); //test
    //set up canvas renderer and system loop
    ECS.addSystem(this.world, this.ECSRendererSystem.bind(this));
    //setup CSS3DRenderer and system loop
    ECS.addSystem(this.world, this.cssRendererSystem.bind(this));
    

    //ECS.addSystem(this.world, this.querySystemTest);
  }

  setupElement(){
    this.divEL = div({id:'CSSRENDER',style:"height:100%;width:100%;"});
    this.canvasEL = canvas({id:'CANVAS',style:"position:fixed;top:0px;left:0px;height:100%;width:100%;"});

    van.add(this.divEL,this.canvasEL);
    //set up doc for three, ecs and css
    van.add(document.body,this.divEL);
  }

  //ECS render system
  ECSRendererSystem(world){

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
  GamePadSystem(world){
    var KEY={
      LEFT:false,
      RIGHT:false,
      UP:false,
      DOWN:false,
    }
  }

  //detect window resize only when user that will update when move to resize
  resizeWindowInnerSystem(world){

    const ECSInner = ECS.createEntity(world);
    ECS.addComponentToEntity(world, ECSInner, 'innerWidth', window.innerWidth || 0);
    ECS.addComponentToEntity(world, ECSInner, 'innerHeight', window.innerHeight || 0);
    ECS.addComponentToEntity(world, ECSInner, 'isResize', true);

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
  //log test resize window 
  resizeWindowInnerlogSystem(world){
    const onUpdate = function (dt) {
      const ECSWin = ECS.getEntity(world, ['innerWidth', 'innerHeight']);
      if(ECSWin){
        console.log("ECSWin");
        console.log(ECSWin);
      }
    }
    return { onUpdate}
  }
  // setup mouse event to get position x,y
  mousePositionSystem(world){
    //console.log("init mouse pointer...")
    const ECSPointer = ECS.createEntity(world);
    ECS.addComponentToEntity(world, ECSPointer, 'clientX', 1);// 0=will not work.
    ECS.addComponentToEntity(world, ECSPointer, 'clientY', 1);

    //ECS.addComponentToEntity(world, ECSPointer, 'clientX', 0);//fail undefined
    //ECS.addComponentToEntity(world, ECSPointer, 'clientY', 0);//fail undefined

    function mouseMovePoint(event){
      //console.log(event.clientX)
      ECSPointer.clientX = event.clientX;
      ECSPointer.clientY = event.clientY;
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
  //log mouse postion loop system
  mousePositionLogSystem(world){
    const onUpdate = function (dt) {
      const ECSPoint = ECS.getEntity(world, ['clientX','clientY']);
      //console.log("update pointer", ECSPoint);
      if(ECSPoint){
        console.log(ECSPoint);
      }
    }
    return { onUpdate }
  }

  //CSS3DRenderer for plane view size (width, height)
  resizeCSSScreenSystem(world){

    const screenToWorld = this.screenToWorld;//no variable from class

    const mainViewPort = ECS.createEntity(world);
    ECS.addComponentToEntity(world, mainViewPort, 'cssWindowWidth', window.innerWidth);
    ECS.addComponentToEntity(world, mainViewPort, 'cssWindowHeight', window.innerHeight);

    const onUpdate = function (dt) {
      //console.log("update???")
      //const ECSPoint = ECS.getEntity(world, ['clientX', 'clientY']);
      const ECSWin = ECS.getEntity(world, ['innerWidth', 'innerHeight','isResize']);
      const CSSWin = ECS.getEntity(world, ['cssWindowWidth', 'cssWindowHeight']);
      const ECSView = ECS.getEntity(world, ['cssCamera']);
      //console.log(Canvas);
      //if(ECSPoint && ECSWin && ECSView){
      if(ECSWin && ECSView && CSSWin){
        //console.log(ECSWin);
        //console.log(ECSPoint);
        //console.log(ECSView);
        if(ECSWin.isResize){//update if resize is true
          const pos = screenToWorld({
            x: 0,
            y: 0,
            canvasWidth: window.innerWidth,
            canvasHeight: window.innerHeight,
            camera:ECSView.cssCamera
          });
          //console.log(pos);
          CSSWin.cssWindowWidth = pos.x;
          CSSWin.cssWindowHeight = pos.y;
        }
      }
    }

    return { onUpdate }
  }
  //CSS3DObject resize Div element for canvas to fit to rendererwebgl screen
  resizeCSSViewDivSystem(world){
    const resizeViewPort = this.resizeViewPort.bind(this)

    const onUpdate = function (dt) {
      const ECSWin = ECS.getEntity(world, ['innerWidth', 'innerHeight']);
      const CSSWin = ECS.getEntity(world, ['cssWindowWidth', 'cssWindowHeight']);
      //console.log(CSSWin);
      if(ECSWin && CSSWin){
        if(ECSWin.isResize){
          resizeViewPort({
            x:CSSWin.cssWindowWidth,
            y:CSSWin.cssWindowHeight
          });
        }
      }
    }
    return { onUpdate }
  }
  // CSS3DOBJECT > CANVAS RENDERER resize to fit CSS3DRENDER for UI for html
  resizeCSS3DRendererToCanvasRenderer(world){
    const resizeRendererFromParent = this.resizeRendererFromParent.bind(this)

    const onUpdate = function (dt) {
      const ECSWin = ECS.getEntity(world, ['innerWidth', 'innerHeight']);
      const CSSWin = ECS.getEntity(world, ['cssWindowWidth', 'cssWindowHeight']);
      //console.log(CSSWin);
      if(ECSWin && CSSWin){
        if(ECSWin.isResize){
          resizeRendererFromParent({
            x:CSSWin.cssWindowWidth,
            y:CSSWin.cssWindowHeight
          });
        }
      }
    }
    return { onUpdate }
  }

  //need better code for resize update...
  // div element resize to fit the inner window
  resizeViewPort(size){
    //console.log(this.cssScreen)
    if(this.cssScreen){//this is div element
      let width = Math.abs(size.x*2);
      var offset = 0;//testing...
      this.cssScreen.style.width = ((width) + offset)+'px';
      this.cssScreen.style.height = ((size.y*2) + offset)+'px';
    }
  }

  //canvas render element resize width, height and camera update
  resizeRendererFromParent(size){
    //console.log(size);
    if(this.renderer){//make sure if renderer exist
      //let parent = this.renderer.domElement.parentNode;
      //let _width = parseFloat(String(parent.style.width).replace("px",""));
      //let _height = parseFloat(String(parent.style.height).replace("px",""));
      let offset = 0;//testing...
      let _width = Math.abs(size.x*2) + offset;
      let _height = size.y *2 + offset;
      this.renderer.domElement.style.width = _width + 'px';
      this.renderer.domElement.style.height = _height + 'px';
      this.camera.aspect = _width / _height;
      this.camera.updateProjectionMatrix();
    }
  }
  //create CSS3DRenderer and system loop
  //needs work on?
  cssRendererSystem(world){

    const _cssrenderer = new CSS3DRenderer();
    //STYLE
    _cssrenderer.domElement.style.position='fixed';
    _cssrenderer.domElement.style.top='0px';
    _cssrenderer.setSize(window.innerWidth,window.innerHeight);
    //assign to class var
    this.cssRenderer = _cssrenderer;
    this.cssScene = new THREE.Scene();
    this.cssCamera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    
    //setup
    this.cssCamera.position.set( 0, 0, 600 );
    this.cssCamera.lookAt(0,0,0);
    
    //add doc body for renderer
    van.add(document.body, _cssrenderer.domElement);
    //resize window
    window.addEventListener('resize',this.resizeCSSRenderer.bind(this));

    //console.log("init cssrenderer system...")
    const renderer = this.cssRenderer;
    const camera = this.cssCamera;
    const scene = this.cssScene;

    //set up ECS entity for update CSS3DRenderer
    const ECSCSSRender = ECS.createEntity(world);
    ECS.addComponentToEntity(world, ECSCSSRender, 'cssrenderer', renderer);
    ECS.addComponentToEntity(world, ECSCSSRender, 'cssCamera', camera);
    ECS.addComponentToEntity(world, ECSCSSRender, 'cssScene', scene);

    const onUpdate = function (dt) {
      //console.log("update???")
      const ECSCSS = ECS.getEntity(world, [ 'cssrenderer', 'cssCamera','cssScene']);
      //console.log(ECSCSS);
      //update CSS3Drenderer
      ECSCSS.cssrenderer.render(ECSCSS.cssScene,ECSCSS.cssCamera);
    }
    return { onUpdate }
  }

  resizeCSSRenderer(){
    if(this.cssRenderer){
      this.cssCamera.aspect = window.innerWidth / window.innerHeight;
      this.cssCamera.updateProjectionMatrix();
      this.cssRenderer.setSize( window.innerWidth, window.innerHeight );
    }
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

  setupViews(){
    this.createCssScreen();
    //console.log(this.renderer.domElement);
    this.cssScreen.appendChild(this.renderer.domElement);
    //this.setupWindowResize();
    ECS.addSystem(this.world, this.resizeCSSScreenSystem.bind(this)); //
    ECS.addSystem(this.world, this.resizeCSSViewDivSystem.bind(this)); //CSS3D Div resize
    ECS.addSystem(this.world, this.resizeCSS3DRendererToCanvasRenderer.bind(this)); // CSS3D Renderer resize
  }

  //set up phyiscs ECS
  setupECSPhysics(){
    ECS.addSystem(this.world, this.physicsSystem.bind(this))
  }

  //ECS SYSTEM SETUP & UPDATE
  physicsSystem(world){
    //console.log("setup Physics System");
    //console.log(this.physics)
    var physics = this.physics;
    const ECSPhysics = ECS.createEntity(world);
    ECS.addComponentToEntity(world, ECSPhysics, 'physicsWorld', physics)

    const onUpdate = function (dt) {
      const entity = ECS.getEntity(world, [ 'physicsWorld' ])
      if(entity?.physicsWorld){
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
    // console.log(frameTime); //display 
    // run onUpdate for all added systems
    if(this.world){//check if world exist if physics is enable is delay update var
      ECS.update(this.world, frameTime)
      // necessary cleanup step at the end of each frame loop
      ECS.cleanup(this.world)
    }

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

  // test
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