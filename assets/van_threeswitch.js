// testing

import { THREE, van } from "./triengine/dps.js";
const {button, canvas, input, label, div} = van.tags;


import { CSS3DRenderer, CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';
import { ThreeScene } from "./triengine/threescene.js";
/*
var content = '<div>' +
      '<h1>This is an H1 Element.</h1>' +
      '<span class="large">Hello Three.js cookbook</span>' +
      '<textarea> And this is a textarea</textarea>' +
    '</div>';
*/
var content = '<div>' +
'</div>';


class CSSRender{

  renderer = null;
  camera = null;
  scene = null;
  clock=null;
  divEl=null;
  cssScreen=null;//cssObject for threejs render

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

    this.setup_render();
    this.setup_window_resize();
    // init set up
    this.init();
  }

  init(){
    //div
    var cssElement = this.createTriCSS3DObject(content);
    cssElement.position.set(0, 0, 0);
    this.cssScreen = cssElement;
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

  createTriCSS3DObject(content, args) {
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
    this.divEl = div;
    // create a CSS3Dobject and return it.
    var object = new CSS3DObject(div);
    return object;
  }

  appendChild(_canvas){
    if(this.divEl){
      console.log("ADD CSS?")
      //console.log(this.divEl);
      //console.log(_canvas);
      this.divEl.appendChild(_canvas);
    }else{
      console.log("ERROR APPENDCHILD?");
    }
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
    this.camera.position.set( 0, 0, 630 );
    //this.camera.position.set( 0, 100, 0 );
    //this.camera.position.set( 100, 0, 0 );
    //this.camera.lookAt( 0, 0, 0 );

    //this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.update();
  }

  setup_window_resize(){
    window.addEventListener('resize',this.resize_window.bind(this));
  }

  //update render for css
  update(){
    requestAnimationFrame( this.update.bind(this) );
    this.renderer.render( this.scene, this.camera );
  }

  resize_window(){
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.resize_screen_three()
  }

  resize_screen_three(){
    if(this.cssScreen){
      let width = window.innerWidth / 2;
      let height = window.innerHeight / 2;
      //this.cssScreen.position.set(width*-1,height*-1,0);

      this.divEl.style.width = window.innerWidth+'px';
      this.divEl.style.height = window.innerHeight+'px';
    }
  }

  get_screen_el(){
    if(this.divEl){
      //console.log(this.divEl);
      //console.log(this.divEl.getBoundingClientRect());
      return this.divEl;
    }
    return null;
  }

}


const toggleThreeSwitch = ()=>{

  const isEditor = van.state(false);
  const cssRenderEL = div({id:'CSSRENDER',style:"position:fixed;top:0px;left:0px;height:100%;width:100%;"});
  const divEL = div({id:'CSSRENDER',style:"height:100%;width:100%;"});
  const canvasEL = canvas({id:'CANVAS',style:"position:fixed;top:0px;left:0px;height:100%;width:100%;"});

  //base scene
  const threeScene = new ThreeScene({
    canvas:canvasEL// canvas element
  });
  //console.log(threeScene.domElement());

  //screen for ui in div css format.
  const screenCSS = new CSSRender({
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
      let _divEl = screenCSS.get_screen_el();
      let rect = _divEl.getBoundingClientRect();
      //console.log(rect.height);
      //console.log(rect);
      //threeScene.resize(rect.width,rect.height);
      threeScene.resize(window.innerWidth,window.innerHeight);

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
van.add(document.body,toggleThreeSwitch())
