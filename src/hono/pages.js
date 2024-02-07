//pages for testing

import { Hono } from 'hono';
import van from "mini-van-plate/van-plate"
const {head, body, style, script} = van.tags
const route = new Hono();

function scriptHtml(_script){
  const pageHtml = van.html(
    head(
      style(`
      body{
        background:gray;
        margin: 0px 0px 0px 0px;
        overflow: hidden;
      }
      `)
    ),
    body(
      script({type:"module",src:_script})
    ),
  );

  return pageHtml;
}

function scriptHtml02(_script){
  const pageHtml = van.html(
    head(
      style(`
      body{
        background:gray;
        margin: 0px 0px 0px 0px;
        overflow: hidden;
      }
      `),
      script({type:"importmap"},`{
  "imports": {
    "three": "https://unpkg.com/three@0.160.0/build/three.module.js",
    "three/addons/": "https://unpkg.com/three@0.160.0/examples/jsm/",
    "remove-array-items": "https://unpkg.com/remove-array-items@3.0.0/src/remove-array-items.js",
    "ecs":"https://cdn.skypack.dev/ecs"
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
  const pageHtml = van.html(
    head(
      style(`
      body{
        background:gray;
        margin: 0px 0px 0px 0px;
        overflow: hidden;
      }
      `),
      script({type:"importmap"},`{
  "imports": {
    "three": "https://unpkg.com/three@0.160.0/build/three.module.js",
    "three/addons/": "https://unpkg.com/three@0.160.0/examples/jsm/",
    "remove-array-items": "https://unpkg.com/remove-array-items@3.0.0/src/remove-array-items.js",
    "ecs":"https://unpkg.com/ecs@0.20.0/ecs.js"
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
  {url:'/threerapier',file:'/van_threerapier.js'},
  {url:'/craft',file:'/van_craft.js'},
  {url:'/three',file:'/van_three.js'},
  {url:'/threecss',file:'/van_threecss.js'},
  {url:'/threeswitch',file:'/van_threeswitch.js'},
  {url:'/resizecssrender',file:'/resizecssrender.js'},
  {url:'/entitiesomponentssystems',file:'/entitiesomponentssystems.js'},
  {url:'/chat',file:'/van_chat.js'},
  {url:'/worker',file:'/worker_main.js'},
  {url:'/ecs_worker',file:'/ecs_worker_main.js'},
  {url:'/triecs_sample',file:'/three_ecs_sample.js'},
  {url:'/triecs_sample02',file:'/three_ecs_sample02.js'},
  {url:'/triecs_sample03',file:'/three_ecs_sample03.js'},
  {url:'/threerapierjsm',file:'/three_reapier_jsm.js'},
  {url:'/css2dthree',file:'/css2dthree.js'},
  {url:'/css3dthree',file:'/css3dthree.js'},
]
//console.log("URLS...");
route.get("/:name", (c, next) => {
  let isFound = false;
  const name = c.req.param('name');
  let file = '';
  for (var idx in urlandjs){
    if(urlandjs[idx].url.match(name)){
      console.log("match...")
      file = urlandjs[idx].file;
      isFound=true;
      console.log(file);
      break;
    }
  }
  //const db = c.get('db');
  console.log("http://localhost:3000/"+name);
  if(isFound){
    const pageHtml = scriptHtml02(file);
    return c.html(pageHtml);
  }
  //return c.html('None');
  return next();
});


export default route;