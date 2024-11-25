/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

// testing resize

// https://threejs.org/docs/#api/en/core/Raycaster.intersectObject
// https://discourse.threejs.org/t/convert-screen-2d-to-world-3d-coordiate-system-without-using-raycaster/13739


import { 
  THREE,
  CSS3DRenderer, 
  CSS3DObject,
  van 
} from "/dps.js";
//import { CSS3DRenderer, CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';
import { ThreeScene } from "../triengine/threescene.js";
const {button, canvas, div} = van.tags;
//var content = '<div>' +'</div>';

class TriCSS3DRenderer{

  renderer = null;
  camera = null;
  scene = null;
  clock=null;
  viewDiv=null;
  viewSize={x:0,y:0};

  constructor(args){
    console.log("init...")
    this.clock = new THREE.Clock();

    if (args?.parent){
      const _renderer = new CSS3DRenderer({
        canvas:args.canvas,
        //antialias: true,
        //alpha: true,
      });
      this.renderer = _renderer;
      //console.log(this.renderer)
      van.add(args.parent,this.renderer.domElement);
    }else{
      console.log("ERROR Canvas Element needed!");
      //throw new Error('Parameter is need Canvas Element!');
    }

    this.init();
  }

  init(){
    this.setup();  
  }

  setup(){
    this.setupRenderer();
    this.setup_window_resize();
    this.setupViewDiv();
  }

  setupViewDiv(){
    let width =  window.innerWidth;
    let height = window.innerHeight;
    const viewDiv = div({id:'VIEWDIV',style:`width:${width};height:${height};`});
    viewDiv.style.background = new THREE.Color(Math.random() * 0xffffff).getStyle();
    this.viewDiv = viewDiv;
    var cssObject = new CSS3DObject(viewDiv);
    cssObject.position.set(0, 0, 0);
    this.scene.add(cssObject);
  }

  createCSS3DObject(content, args) {
    let width = args?.width || 800;
    let height = args?.height || 600;
    // convert the string to dome elements
    var wrapper = document.createElement('div');
    if(typeof content == 'string'){
      wrapper.innerHTML = content;
    }else{
      wrapper.appendChild(content);
    }
    var div = wrapper.firstChild;
    // set some values on the div to style it.
    // normally you do this directly in HTML and 
    // CSS files.
    div.style.width = width+'px';
    div.style.height = height+'px';
    //div.style.opacity = 0.7;
    div.style.background = new THREE.Color(Math.random() * 0xffffff).getStyle();
    // create a CSS3Dobject and return it.
    var object = new CSS3DObject(div);
    return object;
  }

  appendChild(_canvas){
    //console.log(this.viewDiv);
    if(this.viewDiv){
      //console.log(_canvas);
      this.viewDiv.appendChild(_canvas);
      window.dispatchEvent(new Event('resize'));
    }else{
      console.log("ERROR APPENDCHILD?");
    }
  }

  setupRenderer(){
    // setup renderer
    this.renderer.setSize( window.innerWidth, window.innerHeight );

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 5000 );
    //this.camera.position.z = 5;
    //fit screen?
    this.camera.position.set( 0, 0, 600 );
    //this.camera.lookAt( 0, 0, 0 );

    //this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.update();
  }

  setup_window_resize(){
    window.addEventListener('resize', this.resize_window.bind(this));
    //window.addEventListener( 'mousemove', this.onPointerMove.bind(this) );
  }

  onPointerMove( event ){
    this.pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	  this.pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    //console.log(this.pointer);

    const { clientX, clientY } = event
    const pos = this.screenToWorld({
        x: clientX,
        y: clientY,
        canvasWidth: window.innerWidth,
        canvasHeight: window.innerHeight,
        camera:this.camera
    })
    console.log(pos)
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

  //update render for css
  update(){
    this.renderer.render( this.scene, this.camera );
    requestAnimationFrame( this.update.bind(this) );
  }

  resize_window(event){

    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    //console.log(event);
    //const { clientX, clientY } = event;
    //console.log(clientX);
    const pos = this.screenToWorld({
        x: 1,
        y: 1,
        canvasWidth: window.innerWidth,
        canvasHeight: window.innerHeight,
        camera:this.camera
    })
    //console.log(pos);
    this.viewSize={
      x:Math.abs(pos.x*2),
      y:(pos.y*2)
    };
    this.resizeViewDiv();
  }

  //resize view port div element
  resizeViewDiv(){
    if(this.viewDiv){
      //console.log(this.viewSize);
      this.viewDiv.style.width = (this.viewSize.x)+'px';
      this.viewDiv.style.height = (this.viewSize.y)+'px';
    }
  }
}
//render element and set up for doc body
const toggleViewSwitchEL = ()=>{

  const isEditor = van.state(false);
  const cssRenderEL = div({id:'CSSRENDER',style:"position:fixed;top:0px;left:0px;height:100%;width:100%;"});
  const divEL = div({id:'DIVRENDER',style:"height:100%;width:100%;"});
  const canvasEL = canvas({id:'CANVAS',style:"position:fixed;top:0px;left:0px;height:100%;width:100%;"});

  //base scene
  const threeScene = new ThreeScene({
    canvas:canvasEL// canvas element
  });
  //console.log(threeScene.domElement());

  //screen for ui in div css format.
  const screenCSS = new TriCSS3DRenderer({
    parent:cssRenderEL // div element
  });

  function toggleSwitch(){
    isEditor.val = !isEditor.val;
    //console.log("Hello?",isEditor.val);
  }

  const setup_window_resize = ()=>{
    window.addEventListener('resize',resize_window.bind(this));
  }

  function resize_window(){
    if(isEditor.val == false){
      threeScene.resize(window.innerWidth,window.innerHeight);
    }
    if(isEditor.val == true){
      threeScene.resize(null,null,{parent:'sub'});
    }
  }

  function init(){
    setup_window_resize();
  }

  init();

  const showThreeType = van.derive(() =>{
    if(isEditor.val){
      console.log("CSS");
      screenCSS.appendChild(canvasEL);
      return cssRenderEL;
    }else{
      console.log("CANVAS");
      divEL.appendChild(canvasEL);
      return divEL;
    }
  })

  return div({style:'position:fixed;top:0px;left:0px;'},
    
    showThreeType,//threejs, editor UI CSS
    div({style:'position:fixed;top:0px;left:0px;'},//UI top
      button({onclick:toggleSwitch,textContent:'toggle'})
    )
    
  );
}

//set up canvas and editor element
van.add(document.body,toggleViewSwitchEL())
