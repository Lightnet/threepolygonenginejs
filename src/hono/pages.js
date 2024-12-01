/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

// pages for url
import fs from 'fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { Hono } from 'hono';
import van from "mini-van-plate/van-plate";

const __dirname = dirname(fileURLToPath(import.meta.url));

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
      script({src:"https://unpkg.com/three@0.170.0/examples/jsm/libs/ammo.wasm.js"}),
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
    "three": "https://unpkg.com/three@0.170.0/build/three.module.js",
    "three/addons/": "https://unpkg.com/three@0.170.0/examples/jsm/",
    "remove-array-items": "https://unpkg.com/remove-array-items@3.0.0/src/remove-array-items.js",
    "ecs":"https://unpkg.com/ecs@0.23.0/ecs.js"
  }
}
`),
    ),
    body(
      script({src:"https://unpkg.com/three@0.170.0/examples/jsm/libs/ammo.wasm.js"}),
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
  //{url:'/spacemobile',                              file:'/van_spacemobile.js'},
  {url:'/chat',                                       file:'/van_chat.js'},
  {url:'/craft',                                      file:'/craft.js'},
  {url:'/editor',                                     file:'/editor.js'},
  {url:'/login',                                      file:'/login.js'},
  {url:'/admin',                                      file:'/admin.js'},

  {url:'/threejs_test',                               file:'/threejs_test.js'},
  {url:'/flipclock',                                  file:'/tests/flip_clock.js'},
  {url:'/texteditortest',                             file:'/texteditortest.js'},
  
  //{url:'/three_css2drenderer',                      file:'/tests/three_css2drenderer.js'},
  //{url:'/three_css3d_class',                        file:'/tests/three_css3d_class.js'},
  //{url:'/three_css3drenderer_resize',               file:'/tests/three_css3drenderer_resize.js'},
  //{url:'/three_css3drenderer',                      file:'/tests/three_css3drenderer.js'},
  //{url:'/three_ecs',                                file:'/tests/three_ecs.js'},
  //{url:'/three_ecs_sample01',                       file:'/tests/three_ecs_sample01.js'},
  //{url:'/three_ecs_sample02',                       file:'/tests/three_ecs_sample02.js'},
  //{url:'/three_ecs_sample03',                       file:'/tests/three_ecs_sample03.js'},
  //{url:'/three_ecs_sample04',                       file:'/tests/three_ecs_sample04.js'},
  //{url:'/worker',                                   file:'/tests/worker_main.js'},
  //{url:'/ecs_worker',                               file:'/tests/ecs_worker_main.js'},
  //{url:'/threerapierjsm',                           file:'/tests/three_reapier_jsm.js'},
  //{url:'/threecss2d',                               file:'/tests/three_css2drenderer.js'},

  {url:'/threejs_turn_base01',                          file:'/turnbase/threejs_turn_base01.js'},
  {url:'/threejs_cannon01',                          file:'/threejs_cannones/threejs_cannon01.js'},
  
  {url:'/three_framework00',                          file:'/tests/three_framework00.js'},
  {url:'/three_rapier',                               file:'/tests/three_rapier.js'},
  {url:'/entitiesomponentssystems',                   file:'/tests/entitiesomponentssystems.js'},
  {url:'/timer_test',                                 file:'/tests/timer_test.js'},
  {url:'/ex_framework_threejs_physics_ammo',          file:'/triframework/ex_framework_threejs_physics_ammo.js'},
  {url:'/ex_framework_threejs_physics_jolt',          file:'/triframework/ex_framework_threejs_physics_jolt.js'},
  {url:'/ex_framework_threejs_physics_rapier',        file:'/triframework/ex_framework_threejs_physics_rapier.js'},
  {url:'/ex_threejs_scene01',                         file:'/triframework/ex_threejs_scene01.js'},

  {url:'/mobilespace',                                file:'/mobilespace/main.js'},
  {url:'/threejspolygon',                             file:'/threejspolygon/main.js'},
  {url:'/example_ammophysics01',                      file:'/threejspolygon/example_ammophysics01.js'},
  {url:'/example_joltphysics01',                      file:'/threejspolygon/example_joltphysics01.js'},
  {url:'/example_rapierphysics01',                    file:'/threejspolygon/example_rapierphysics01.js'},
  {url:'/example_base01',                             file:'/threejspolygon/example_base01.js'},
  {url:'/layercssrenderer01',                         file:'/threejspolygon/layercssrenderer01.js'},
  {url:'/layercssrenderer02',                         file:'/threejspolygon/layercssrenderer02.js'},
  {url:'/layercssrenderer03',                         file:'/threejspolygon/layercssrenderer03.js'},
];

var testFilesPath = __dirname + "../../../public/threejs_tests";

fs.readdir(testFilesPath, (err, files) => {
  if (err)
    console.log(err);
  else {
    //console.log("\nCurrent directory filenames:");
    files.forEach(file => {
      //console.log(file);
      try {
        let filesplits = file.split('.');
        if(filesplits[1] == 'js'){
          //console.log("found")
          //console.log(file.split('.')[0])
          urlandjs.push({url:'/'+filesplits[0],file:`/threejs_tests/${filesplits[0]}.js`})
        }  
      } catch (error) {
        
      }
      //{url:'/threejs_raycast02',file:'/threejs_tests/threejs_raycast02.js'},
    })
  }
})

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