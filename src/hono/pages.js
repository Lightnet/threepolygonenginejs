//pages for testing

import { Hono } from 'hono';
import van from "mini-van-plate/van-plate"
const {head, body, style, script} = van.tags
const route = new Hono();

route.get('/spacemobile', (c) => {
  const db = c.get('db');
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
      script({type:"module",src:"/van_spacemobile.js"})
    ),
  );
  return c.html(pageHtml);
});

route.get('/craftmobile', (c) => {
  const db = c.get('db');
  const pageHtml = van.html(
    head(
      style(`
      body{
        background:gray;
        margin: 0px 0px 0px 0px;
        overflow: hidden;
      }
      `),
      script({src:"https://unpkg.com/three@0.157.0/examples/jsm/libs/ammo.wasm.js"}),
    ),
    body(
      script({type:"module",src:"/van_craftmobile.js"})
    ),
  );
  return c.html(pageHtml);
});

route.get('/craftrapier', (c) => {
  //const db = c.get('db');
  console.log("/craftrapier");
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
      script({type:"module",src:"/van_craftrapier.js"})
    ),
  );
  return c.html(pageHtml);
});
// https://threejs.org/docs/index.html#manual/en/introduction/Installation
route.get('/craft', (c) => {
  //const db = c.get('db');
  console.log("/craft");
  const pageHtml = van.html(
    head(
      style(`
      body{
        background:gray;
        margin: 0px 0px 0px 0px;
        overflow: hidden;
      }
      `),
      script({type:"importmap"},`
{
  "imports": {
    "three": "https://unpkg.com/three@0.160.0/build/three.module.js",
    "three/addons/": "https://unpkg.com/three@0.160.0/examples/jsm/"
  }
}
`),
    ),
    body(
      script({type:"module",src:"/van_craft.js"})
    ),
  );
  return c.html(pageHtml);
});

route.get('/three', (c) => {
  //const db = c.get('db');
  console.log("/three");
  const pageHtml = van.html({style:"height:100%;width:100%;"},
    head(
      style(`
      body{
        background:gray;
        margin: 0px 0px 0px 0px;
        overflow: hidden;
      }
      `),
      script({type:"importmap"},`
{
  "imports": {
    "three": "https://unpkg.com/three@0.160.0/build/three.module.js",
    "three/addons/": "https://unpkg.com/three@0.160.0/examples/jsm/"
  }
}
`),
    ),
    body({style:"height:100%;width:100%;"},
      script({type:"module",src:"/van_three.js"})
    ),
  );
  return c.html(pageHtml);
});

route.get('/threecss', (c) => {
  //const db = c.get('db');
  console.log("/threecss");
  const pageHtml = van.html({style:"height:100%;width:100%;"},
    head(
      style(`
      body{
        background:gray;
        margin: 0px 0px 0px 0px;
        overflow: hidden;
      }
      `),
      script({type:"importmap"},`
{
  "imports": {
    "three": "https://unpkg.com/three@0.160.0/build/three.module.js",
    "three/addons/": "https://unpkg.com/three@0.160.0/examples/jsm/"
  }
}
`),
    ),
    body({style:"height:100%;width:100%;"},
      script({type:"module",src:"/van_threecss.js"})
    ),
  );
  return c.html(pageHtml);
});

route.get('/threeswitch', (c) => {
  //const db = c.get('db');
  console.log("/threeswitch");
  const pageHtml = van.html({style:"height:100%;width:100%;"},
    head(
      style(`
      body{
        background:gray;
        margin: 0px 0px 0px 0px;
        overflow: hidden;
      }
      `),
      script({type:"importmap"},`
{
  "imports": {
    "three": "https://unpkg.com/three@0.160.0/build/three.module.js",
    "three/addons/": "https://unpkg.com/three@0.160.0/examples/jsm/"
  }
}
`),
    ),
    body({style:"height:100%;width:100%;"},
      script({type:"module",src:"/van_threeswitch.js"})
    ),
  );
  return c.html(pageHtml);
});

route.get('/resizecssrender', (c) => {
  //const db = c.get('db');
  console.log("/threeswitch");
  const pageHtml = van.html({style:"height:100%;width:100%;"},
    head(
      style(`
      body{
        background:gray;
        margin: 0px 0px 0px 0px;
        overflow: hidden;
      }
      `),
      script({type:"importmap"},`
{
  "imports": {
    "three": "https://unpkg.com/three@0.160.0/build/three.module.js",
    "three/addons/": "https://unpkg.com/three@0.160.0/examples/jsm/"
  }
}
`),
    ),
    body({style:"height:100%;width:100%;"},
      script({type:"module",src:"/resizecssrender.js"})
    ),
  );
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

export default route;