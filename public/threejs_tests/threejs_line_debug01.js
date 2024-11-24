/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

// https://www.youtube.com/watch?v=nwiaqLGAyjo How To Make An Object Follow A Path In Three.js
// https://www.youtube.com/watch?v=ohEtw-F1FR8&list=PLjcjAqAnHd1ENaMQ_xee0PQ2vVbUfnz2N

import van from "https://cdn.jsdelivr.net/npm/vanjs-core@1.5.2/src/van.min.js";
//import { FloatingWindow } from "https://cdn.jsdelivr.net/npm/vanjs-ui@0.10.1/dist/van-ui.min.js";
import * as THREE from 'https://unpkg.com/three@0.170.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.170.0/examples/jsm/controls/OrbitControls.js'
import Stats from 'https://unpkg.com/three@0.170.0/examples/jsm/libs/stats.module.js';
import { GUI } from 'https://unpkg.com/three@0.170.0/examples/jsm/libs/lil-gui.module.min.js';

const {div, button} = van.tags;

const stats = new Stats();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
//camera.position.z = 5;
//camera.position.set(0,0,100)
//camera.position.set(0,0,5)
camera.position.set(0,0,20)

let cube;
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );
window.addEventListener('resize', function(event) {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
});

// CAMERA CONTROL
const orbitControls = new OrbitControls( camera, renderer.domElement );
orbitControls.update()

function create_cube(){
  const geometry = new THREE.BoxGeometry( 1, 1, 1 );
  const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
  cube = new THREE.Mesh( geometry, material );
  scene.add( cube );
}

const myScene = {
  isPathfollow:true,
  isRotatefollow:true,
  speedTime:2000,
  frameTime:0,
  delta:0,
  lineColor:0xff0000,
}

var path;
var pathMesh;
//const pathMaterial = new THREE.LineBasicMaterial({color: 0xff0000});

function create_lines(){
  const points = [
    new THREE.Vector3(-10,0,10),
    new THREE.Vector3(-5,5,5),
    new THREE.Vector3(0,0,0),
    new THREE.Vector3(5,-5,5),
    new THREE.Vector3(10,0,10),
  ]

  path = new THREE.CatmullRomCurve3(points, true);
  console.log(path);
  //const pathGeometry = new THREE.BufferGeometry().setFromPoints( path.getPoints(50) );
  //const pathMaterial = new THREE.LineBasicMaterial({color: 0xff0000});
  //pathMesh = new THREE.Line( pathGeometry, pathMaterial );
  //scene.add( pathMesh );
  updateMeshPath(path)
}

function updateMeshPath(_path){
  if(pathMesh){
    scene.remove( pathMesh );
    //pathMesh.dispose();
    console.log(pathMesh)
  }
  const pathGeometry = new THREE.BufferGeometry().setFromPoints( _path.getPoints(50) );
  const pathMaterial = new THREE.LineBasicMaterial({color: myScene.lineColor});
  pathMesh = new THREE.Line( pathGeometry, pathMaterial );
  scene.add( pathMesh );
}

function create_light(){
  const light = new THREE.PointLight( 0xffffff, 3, 0, 0 );
	light.position.copy( camera.position );
	scene.add( light );
}

function animate(time) {
  myScene.delta = time;

  //number of points current 6
  if(myScene.isPathfollow){
    //console.log(time);
    const t = (time/myScene.speedTime % 6) / 6;
    //console.log("t:", t);
    myScene.frameTime = t.toFixed(5);
    const position = path.getPointAt(t);
    cube.position.copy(position);
    if(myScene.isRotatefollow){
      const tangent = path.getTangentAt(t).normalize()
      cube.lookAt(position.clone().add(tangent));
    }
    
  }

  stats.update();
  orbitControls.update();
	renderer.render( scene, camera );
}

function setup_info(){
  van.add(document.body, stats.dom);
}

function create_gui(){
  const gui = new GUI();
  const timeFolder = gui.addFolder('Time')
  timeFolder.add(myScene,'delta').listen().disable()
  timeFolder.add(myScene,'frameTime').listen().disable()
  //timeFolder.add()
  const pathFollowFolder = gui.addFolder('Path Follow')
  pathFollowFolder.add(myScene,'isPathfollow')
  pathFollowFolder.add(myScene,'isRotatefollow')
  pathFollowFolder.add(myScene,'speedTime',1,9000,1)

  const catmullRomCurve3Folder = gui.addFolder('CatmullRomCurve3')
  catmullRomCurve3Folder.add(path,'closed').onChange( value => {
    path.needsUpdate = true;
    updateMeshPath(path)
  })
  catmullRomCurve3Folder.addColor(myScene,'lineColor');
}

function setup_scene(){
  setup_info()
  create_cube()
  create_lines()
  create_light();

  create_gui()

}

setup_scene();