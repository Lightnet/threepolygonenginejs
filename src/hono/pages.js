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
    "ecs":"https://unpkg.com/ecs@0.20.0/ecs.js"
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

route.get('/spacemobile', (c) => {
  //const db = c.get('db');
  const pageHtml = scriptHtml("/van_spacemobile.js");
  return c.html(pageHtml);
});

route.get('/threeammo', (c) => {
  //const db = c.get('db');
  const pageHtml = scriptHtml03("/van_threeammo.js");
  return c.html(pageHtml);
});

route.get('/threerapier', (c) => {
  //const db = c.get('db');
  console.log("/threerapier");
  const pageHtml = scriptHtml02("/van_threerapier.js");
  return c.html(pageHtml);
});
// https://threejs.org/docs/index.html#manual/en/introduction/Installation
route.get('/craft', (c) => {
  //const db = c.get('db');
  console.log("/craft");
  const pageHtml = scriptHtml02("/van_craft.js");
  return c.html(pageHtml);
});

route.get('/three', (c) => {
  //const db = c.get('db');
  console.log("/three");
  const pageHtml = scriptHtml02("/van_three.js");
  return c.html(pageHtml);
});

route.get('/threecss', (c) => {
  //const db = c.get('db');
  console.log("/threecss");
  const pageHtml = scriptHtml02("/van_threecss.js");
  return c.html(pageHtml);
});

route.get('/threeswitch', (c) => {
  //const db = c.get('db');
  console.log("/threeswitch");
  const pageHtml = scriptHtml02("/van_threeswitch.js");
  return c.html(pageHtml);
});

route.get('/resizecssrender', (c) => {
  //const db = c.get('db');
  console.log("/threeswitch");
  const pageHtml = scriptHtml02("/resizecssrender.js");
  return c.html(pageHtml);
});


route.get('/entitiesomponentssystems', (c) => {
  //const db = c.get('db');
  console.log("/entitiesomponentssystems");
  const pageHtml = scriptHtml02("/entitiesomponentssystems.js");
  return c.html(pageHtml);
});

route.get('/chat', (c) => {
  //const db = c.get('db');
  console.log("/chat");
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
      script({type:"module",src:"/van_chat.js"})
    ),
  );
  return c.html(pageHtml);
});

route.get('/worker', (c) => {
  //const db = c.get('db');
  console.log("/worker");
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
      script({type:"module",src:"/worker_main.js"})
    ),
  );
  return c.html(pageHtml);
});

route.get('/ecs_worker', (c) => {
  //const db = c.get('db');
  console.log("/ecs_worker");
  const pageHtml = scriptHtml02("/ecs_worker_main.js");
  return c.html(pageHtml);
});

route.get('/triecs_sample', (c) => {
  //const db = c.get('db');
  console.log("/triecs_sample");
  const pageHtml = scriptHtml02("/three_ecs_sample.js");
  return c.html(pageHtml);
});

route.get('/triecs_sample02', (c) => {
  //const db = c.get('db');
  console.log("/triecs_sample02");
  const pageHtml = scriptHtml02("/three_ecs_sample02.js");
  return c.html(pageHtml);
});

route.get('/triecs_sample03', (c) => {
  //const db = c.get('db');
  console.log("/triecs_sample03");
  const pageHtml = scriptHtml02("/three_ecs_sample03.js");
  return c.html(pageHtml);
});

route.get('/threerapierjsm', (c) => {
  //const db = c.get('db');
  console.log("/threerapierjsm");
  const pageHtml = scriptHtml02("/three_reapier_jsm.js");
  return c.html(pageHtml);
});
route.get('/css3dthree', (c) => {
  //const db = c.get('db');
  console.log("/css3dthree");
  const pageHtml = scriptHtml02("/css3dthree.js");
  return c.html(pageHtml);
});
route.get('/css2dthree', (c) => {
  //const db = c.get('db');
  console.log("/css3dthree");
  const pageHtml = scriptHtml02("/css2dthree.js");
  return c.html(pageHtml);
});

export default route;