// testing

import { THREE, van } from "./triengine/dps.js";
const {button, canvas, div} = van.tags;

import { CSS3DRenderer, CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';
import { ThreeScene } from "./triengine/threescene.js";

class TriCSS3DRenderer{

  renderer = null;
  camera = null;
  scene = null;
  clock=null;
  viewDiv=null;
  ViewSize={x:0,y:0};

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

    // init set up
    this.init();
  }

  init(){
    this.setupRenderer();
    this.setupWindowResize();
    this.setupView();
    this.run();
  }

  setupView(){
    //div
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
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    //console.log(this.renderer);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 5000 );
    //this.camera.position.z = 5;
    this.camera.position.set( 0, 0, 630 );
    //this.camera.lookAt( 0, 0, 0 );

    //this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    //this.update();
  }

  setupWindowResize(){
    window.addEventListener('resize',this.resizeWindow.bind(this));
  }

  //update render for css
  update(){
    requestAnimationFrame( this.update.bind(this) );
    this.renderer.render( this.scene, this.camera );
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

  resizeWindow(){
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    const pos = this.screenToWorld({
      x: 1,
      y: 1,
      canvasWidth: window.innerWidth,
      canvasHeight: window.innerHeight,
      camera:this.camera
    });
    this.viewSize={
      x:Math.abs(pos.x*2),
      y:(pos.y*2)
    };

    this.resizeViewDiv()
  }

  resizeViewDiv(){
    if(this.viewDiv){
      //this.viewDiv.style.width = window.innerWidth+'px';
      //this.viewDiv.style.height = window.innerHeight+'px';

      this.viewDiv.style.width = (this.viewSize.x)+'px';
      this.viewDiv.style.height = (this.viewSize.y)+'px';
    }
  }

  run(){
    this.update();
  }
}

const toggleViewSwitchEL = ()=>{

  const isEditor = van.state(false);
  const cssRenderEL = div({id:'CSSRENDER',style:"position:fixed;top:0px;left:0px;height:100%;width:100%;"});
  const divEL = div({id:'RENDERER',style:"height:100%;width:100%;"});
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

  function resize_window(){
    if(isEditor.val == false){
      threeScene.resize(window.innerWidth,window.innerHeight);
    }
    if(isEditor.val == true){
      threeScene.resizeParent();
    }
  }

  function init(){
    window.addEventListener('resize',resize_window.bind(this));
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
