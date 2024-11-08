/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/
// https://discourse.threejs.org/t/sprite-facing-camera-always/42788/6
// https://discourse.threejs.org/t/how-can-i-rotate-a-sprite-to-face-particular-x-y-coordinates/44629
// 

console.log("three js");

import { THREE, OrbitControls, ECS, van } from "/dps.js";
import { FloatingWindow } from "vanjs-ui";
//import { TriECSEngine } from "/components/triengine/triecsengine.js";
const {div, button, label, img} = van.tags;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

let placeholder = null;
let tileMapIndex = 0;

const renderer = new THREE.WebGLRenderer();
renderer.setClearColor( 0xffffff, 0 );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material0 = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material0 );
scene.add( cube );
cube.position.y = 2;

const point_geometry = new THREE.BoxGeometry( .1, 0.1, 0.1 );
const point_material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
const point_cube = new THREE.Mesh( point_geometry, point_material );
scene.add( point_cube );
point_cube.position.y = 2;

camera.position.z = 5;

const textureLoader = new THREE.TextureLoader();

// `/textures/minimap/style_b/tile_00${id}.png`
var MaxTileCount = 25;
var tileMaps = [];
var tileMeshMaps = [];

var tileMapGrids = [];


for (let it = 0; it < MaxTileCount;it++){
  let id = ""+it;
  if(id.length == 1){
    id = "0"+id;
  }
  tileMaps[it] = textureLoader.load( `/textures/minimap/style_b/tile_00${id}.png`);
  tileMaps[it].magFilter = THREE.NearestFilter;
}

for (let im = 0; im < MaxTileCount;im++){
  const basicmaterial = new THREE.MeshBasicMaterial( {
    map: tileMaps[im]
  });

  const mesh = new THREE.Mesh( new THREE.PlaneGeometry( 1, 1 ), 
    basicmaterial
  );
  //let facedir = - Math.PI / 12;
  //mesh.rotation.x = facedir;
  tileMeshMaps[im] = mesh
  //scene.add( mesh );
}
// SELECT TILEMAP INDEX
function tileMapId(_id){
  tileMapIndex = _id;
  if(placeholder){
    placeholder.geometry.dispose();
    placeholder.material.dispose();
    scene.remove( placeholder );
  }

  placeholder = tileMeshMaps[_id].clone()
  scene.add( placeholder );
}
// BUILD TILEMAP POSITION
function buildTileMapId(_id){
  //if none return
  if(!placeholder){return;}
  for(let i = 0; i < tileMapGrids.length;i++){
    if((tileMapGrids[i].position.x == placeholder.position.x ) &&(tileMapGrids[i].position.y == placeholder.position.y)){
      let phobj = tileMapGrids[i]
      phobj.geometry.dispose();
      phobj.material.dispose();
      tileMapGrids.splice(i, 1);
      scene.remove( phobj );
      break;
    }
  }

  let tileMesh = tileMeshMaps[_id].clone();
  tileMesh.position.copy(placeholder.position);
  tileMapGrids.push(tileMesh);
  scene.add( tileMesh );
  console.log("tileMapGrids: ",tileMapGrids.length);
}

function deleteTileMapPosition(){
  for(let i = 0; i < tileMapGrids.length;i++){
    if((tileMapGrids[i].position.x == placeholder.position.x ) &&(tileMapGrids[i].position.y == placeholder.position.y)){
      let phobj = tileMapGrids[i]
      phobj.geometry.dispose();
      phobj.material.dispose();
      tileMapGrids.splice(i, 1);
      scene.remove( phobj );
    }
  }
}

//tileMapId(0);

//tileMeshMaps[1].rotation.x = - Math.PI / 3;
//scene.add( tileMeshMaps[1] );
//console.log(tileMeshMaps[1].rotation.x);

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var plane = new THREE.Plane( new THREE.Vector3( 0, 0, 1 ), 0 );

window.addEventListener('resize', function(event) {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
});


window.addEventListener( 'pointermove', onPointerMove, { passive: false } );
function onPointerMove(event){
  //console.log("mouse move?");
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
  //console.log("mouse: ",mouse)
  // mouse.x = ( event.clientX  ) ;
	// mouse.y = - ( event.clientY  ) ;
	raycaster.setFromCamera( mouse, camera );

  let intersects = new THREE.Vector3();
  raycaster.ray.intersectPlane( plane, intersects );
  //console.log( raycaster.ray ); 
	//console.log("hit?", intersects );
  if(intersects){
    //point_cube.position.set(intersects)
    let grid_x = Math.floor(intersects.x+0.5);
    let grid_y = Math.floor(intersects.y+0.5);
    point_cube.position.x = grid_x
    point_cube.position.y = grid_y
    if(placeholder){
      placeholder.position.x = grid_x
      placeholder.position.y = grid_y
    }
  }

  // screen touch?
	// if(event.pointerType == 'pen' &&  event.pressure > 0) { // I am using pen on ms surface
	// 	var intersects = new THREE.Vector3();
	// 	raycaster.ray.intersectPlane(planeX, intersects);
  //   console.log(raycaster.ray);
	// 	console.log(intersects);
	// }
}

document.addEventListener("keydown", onDocumentKeyDown, false);

function onDocumentKeyDown(event) {
  console.log(event)
  var keyCode = event.which;
  // if (keyCode == 87) {      
  // }
  if(event.key == 'b'){
    buildTileMapId(tileMapIndex);
  }

  if(event.key == 'v'){
    deleteTileMapPosition();
  }

};

const controls = new OrbitControls( camera, renderer.domElement );
//controls.update() must be called after any manual changes to the camera's transform
camera.position.set( 0, 0, 5 );
controls.update();

function animate() {
	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;
  // required if controls.enableDamping or controls.autoRotate are set to true
	controls.update();
	renderer.render( scene, camera );
}

const closed = van.state(false)
// const width = van.state(227), height = van.state(190);

function selectID(_id){
  console.log("_id: ", _id)
  tileMapId(_id);
}
const ElTileMaps = div({style:"width:227;height:256px;"});

for (let i =0;i < 25;i++){
  let id = ""+i;
  if(id.length == 1){
    id = "0"+id;
  }
  van.add(ElTileMaps,img({style:"image-rendering: pixelated;border-style:solid;width:32px;height:32px;",src:`/textures/minimap/style_b/tile_00${id}.png`,onclick:()=>selectID(i)}));
}

van.add(document.body, FloatingWindow(
  {title: "Tile Map", closed, width:210, height:260, closeCross: null,x:0,y:0},
  ElTileMaps
))



