/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

// pages for url

import { Hono } from 'hono';
import van from "mini-van-plate/van-plate"
const {head, body, style, script} = van.tags
const route = new Hono();

// function scriptHtml(_script){
//   const pageHtml = van.html(
//     head(
//       style(`
//       body{
//         background:gray;
//         margin: 0px 0px 0px 0px;
//         overflow: hidden;
//       }
//       `)
//     ),
//     body(
//       script({type:"module",src:_script})
//     ),
//   );
//   return pageHtml;
// }

function scriptHtml02(_script){
  //background:gray;
  const pageHtml = van.html(
    head(
      style(`
      body{
        margin: 0px 0px 0px 0px;
        overflow: hidden;
      }
      `),
      script({type:"importmap"},`{
  "imports": {
    "three": "https://unpkg.com/three@0.170.0/build/three.module.js",
    "three/addons/": "https://unpkg.com/three@0.170.0/examples/jsm/",
    "remove-array-items": "https://unpkg.com/remove-array-items@3.0.0/src/remove-array-items.js",
    "ecs":"https://cdn.skypack.dev/ecs",
    "vanjs-core":"https://cdn.jsdelivr.net/npm/vanjs-core@1.5.2/src/van.min.js",
    "van":"https://cdn.jsdelivr.net/gh/vanjs-org/van/public/van-1.5.2.min.js",
    "vanjs-ui":"https://cdn.jsdelivr.net/npm/vanjs-ui@0.10.1/dist/van-ui.min.js",
    "vanjs-ext":"https://cdn.jsdelivr.net/npm/vanjs-ext@0.6.1/src/van-x.js",
    "vanjs-routing":"https://cdn.jsdelivr.net/npm/vanjs-routing@1.1.3/dist/index.min.js"
  }
}
`),
    ),
    body(
      script({type:"module",src:_script})
    ),
  );

  return pageHtml;
}

function scriptHtml03(_script){
  // background:gray;
  const pageHtml = van.html(
    head(
      style(`
      body{
        
        margin: 0px 0px 0px 0px;
        overflow: hidden;
      }
      `),
      script({type:"importmap"},`{
  "imports": {
    "three": "https://unpkg.com/three@0.160.0/build/three.module.js",
    "three/addons/": "https://unpkg.com/three@0.160.0/examples/jsm/",
    "remove-array-items": "https://unpkg.com/remove-array-items@3.0.0/src/remove-array-items.js",
    "ecs":"https://unpkg.com/ecs@0.21.0/ecs.js"
  }
}
`),
    ),
    body(
      script({src:"https://unpkg.com/three@0.160.0/examples/jsm/libs/ammo.wasm.js"}),
      script({type:"module",src:_script}),
    ),
  );

  return pageHtml;
}

route.get('/threeammo', (c) => {
  //const db = c.get('db');
  const pageHtml = scriptHtml03("/van_threeammo.js");
  return c.html(pageHtml);
});

// https://threejs.org/docs/index.html#manual/en/introduction/Installation

var urlandjs = [
  //{url:'/spacemobile',file:'/van_spacemobile.js'},
  {url:'/chat',file:'/van_chat.js'},
  {url:'/craft',file:'/craft.js'},
  {url:'/editor',file:'/editor.js'},
  {url:'/login',file:'/login.js'},
  {url:'/admin',file:'/admin.js'},

  {url:'/threejs_test',file:'/threejs_test.js'},
  {url:'/flipclock',file:'/tests/flip_clock.js'},
  {url:'/texteditortest',file:'/texteditortest.js'},
  {url:'/threejs_mapping',file:'/threejs_tests/threejs_mapping.js'},
  {url:'/threejs_mc01',file:'/threejs_tests/threejs_mc01.js'},
  {url:'/threejs_mc02',file:'/threejs_tests/threejs_mc02.js'},
  {url:'/threejs_mc03',file:'/threejs_tests/threejs_mc03.js'},
  {url:'/threejs_mc04',file:'/threejs_tests/threejs_mc04.js'},
  {url:'/threejs_mc05',file:'/threejs_tests/threejs_mc05.js'},
  {url:'/threejs_mc06',file:'/threejs_tests/threejs_mc06.js'},
  {url:'/threejs_mc07',file:'/threejs_tests/threejs_mc07.js'},
  {url:'/threejs_mc08',file:'/threejs_tests/threejs_mc08.js'},
  {url:'/threejs_rapier01',file:'/threejs_tests/threejs_rapier01.js'},
  {url:'/threejs_rapier02',file:'/threejs_tests/threejs_rapier02.js'},
  {url:'/threejs_rapier03',file:'/threejs_tests/threejs_rapier03.js'},
  {url:'/threejs_rapier_spaceship01',file:'/threejs_tests/threejs_rapier_spaceship01.js'},
  {url:'/threejs_rapier_spaceship01',file:'/threejs_tests/threejs_rapier_spaceship02.js'},
  {url:'/threejs_rapier_controller01',file:'/threejs_tests/threejs_rapier_controller01.js'},
  {url:'/threejs_rapier_controller02',file:'/threejs_tests/threejs_rapier_controller02.js'},
  {url:'/threejs_rapier_controller03',file:'/threejs_tests/threejs_rapier_controller03.js'},
  {url:'/threejs_camera_forward01',file:'/threejs_tests/threejs_camera_forward01.js'},
  {url:'/threejs_camera_forward02',file:'/threejs_tests/threejs_camera_forward02.js'},
  {url:'/threejs_camera_forward03',file:'/threejs_tests/threejs_camera_forward03.js'},
  {url:'/threejs_tween01',file:'/threejs_tests/threejs_tween01.js'},
  {url:'/threejs_rapier_detect_collision01',file:'/threejs_tests/threejs_rapier_detect_collision01.js'},
  {url:'/threejs_rapier_detect_collision02',file:'/threejs_tests/threejs_rapier_detect_collision02.js'},
  {url:'/mobilespace',file:'/mobilespace/main.js'},
  {url:'/threejs_spaceship_control01',file:'/threejs_tests/threejs_spaceship_control01.js'},
  {url:'/card_game01',file:'/threejs_tests/card_game01.js'},
  {url:'/card_game02',file:'/threejs_tests/card_game02.js'},

  //{url:'/three',file:'/three_framework00.js'},
  
  // {url:'/entitiesomponentssystems',file:'/entitiesomponentssystems.js'},
  
  // {url:'/triecs_sample01',file:'/three_ecs_sample01.js'},
  // {url:'/triecs_sample02',file:'/three_ecs_sample02.js'},
  // {url:'/triecs_sample03',file:'/three_ecs_sample03.js'},
  // {url:'/triecs_sample04',file:'/three_ecs_sample04.js'},

  // {url:'/worker',file:'/worker_main.js'},
  // {url:'/ecs_worker',file:'/ecs_worker_main.js'},

  // {url:'/threeammo',file:'/three_ammo.js'},
  // {url:'/threerapier',file:'/three_rapier.js'},
  // {url:'/threerapierjsm',file:'/three_reapier_jsm.js'},

  // {url:'/threecss2d',file:'/three_css2drenderer.js'},
  // {url:'/threecss3d',file:'/three_css3drenderer.js'},
  // {url:'/three_css3srenderer_resize',file:'/three_css3drenderer_resize.js'},
]
//console.log("URLS...");
route.get("/:name", (c, next) => {
  let isFound = false;
  const name = c.req.param('name');
  let file = '';
  for (var idx in urlandjs){
    if(urlandjs[idx].url.match(name)){
      //console.log("match...")
      file = urlandjs[idx].file;
      isFound=true;
      //console.log(file);
      break;
    }
  }
  //const db = c.get('db');
  //console.log("http://localhost:3000/"+name);
  if(isFound){
    const pageHtml = scriptHtml02(file);
    return c.html(pageHtml);
  }
  //return c.html('None');
  return next();
});


export default route;
export {
  scriptHtml02
}