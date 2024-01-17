

import van from "https://cdn.jsdelivr.net/gh/vanjs-org/van/public/van-1.2.1.min.js";
import { THREE } from "./triengine/ThreeAPI.js";
import {ThreeEL} from './triengine/triengine.js';
const {button, canvas, input, label, div, script, pre, p, ul, li, a} = van.tags;


import { CSS3DRenderer, CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';
import { ThreeScene } from "./threescene.js";

var content = '<div>' +
      '<h1>This is an H1 Element.</h1>' +
      '<span class="large">Hello Three.js cookbook</span>' +
      '<textarea> And this is a textarea</textarea>' +
    '</div>';


class CSSRender{

  renderer = null;
  camera = null;
  scene = null;
  clock=null;
  physics=null

  constructor(args){
    console.log("init...")
    this.clock = new THREE.Clock();
    
    // check for canvas element
    if (args?.canvas){
      const _renderer = new CSS3DRenderer({
        canvas:args.canvas,
        //antialias: true,
        //alpha: true,
      });
      this.renderer = _renderer;
      console.log(this.renderer)
      van.add(args.canvas,this.renderer.domElement)
    }else{
      console.log("ERROR Canvas Element needed!");
      throw new Error('Parameter is need Canvas Element!');
    }

    this.setup_render();
    this.setup_window_resize();
    // Check for physics
    this.init();
  }

  init(){
    const threejs = ThreeSceneEL();


    //var cssElement = this.createCSS3DObject(content);
    var cssElement = this.createCSS3DObject(threejs);
    //cssElement.position.set(100, 100, 100);
    cssElement.position.set(0, 0, 0);
    console.log(cssElement.position)
    this.scene.add(cssElement);
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

  init_editor(){
    //van.add(document.body,editorAreaEL())
  }

  setup_render(){
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    //console.log(this.renderer);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 5000 );
    //this.camera.position.z = 5;

    //this.camera.position.set( 600, 400, 1500 );
    this.camera.position.set( 0, 0, 800 );
    //this.camera.position.set( 0, 100, 0 );
    //this.camera.position.set( 100, 0, 0 );
    //this.camera.lookAt( 0, 0, 0 );

    //this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.update();
  }

  setup_window_resize(){
    window.addEventListener('resize',this.resize_window.bind(this));
  }

  update(){
    requestAnimationFrame( this.update.bind(this) );

    this.renderer.render( this.scene, this.camera );
    //console.log("update")
    //console.log(this.scene)
  }

  resize_window(){
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize( window.innerWidth, window.innerHeight );
  }
}

const ThreeRenderEL = () => {
  const engine = van.state(null);
  const renderEL = div({id:'CSSRENDER',style:"height:100%;width:100%;"});

  function init(){
    //const renderer = new THREE.WebGLRenderer();
    engine.val = new CSSRender({canvas:renderEL,isPhysics:true});
    console.log(engine.val);//
  }

  init();

  return renderEL;
};

const ThreeSceneEL = () => {
  const engine = van.state(null);
  const renderEL = canvas({id:'threejs'});

  function init(){
    //const renderer = new THREE.WebGLRenderer();
    engine.val = new ThreeScene({canvas:renderEL,isPhysics:true});
    console.log(engine.val);//
  }

  init();

  return div(
    renderEL
  )
};

const toggleThreeSwitch = ()=>{

  const isEditor = van.state(false);
  const renderEL = div({id:'CSSRENDER',style:"height:100%;width:100%;"});

  function toggleSwitch(){
    isEditor.val = !isEditor.val;
    console.log("Hello?",isEditor.val);
  }

  const showThreeType = van.derive(() =>{
    if(isEditor.val){
      new CSSRender({canvas:renderEL,isPhysics:true});

      return renderEL;
    }else{
      return ThreeSceneEL();
    }
  })

  return div({style:'position:fixed;top:0px;left:0px;'},
  button({onclick:toggleSwitch,textContent:'toggle'}),
  showThreeType)
}

van.add(document.body,toggleThreeSwitch())