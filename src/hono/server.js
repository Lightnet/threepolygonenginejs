
// 
// https://github.com/orgs/honojs/discussions/1355
// 
// 

import { Server } from 'socket.io'
import { Server as HttpServer } from 'http'
import { serve } from '@hono/node-server';
import van from "mini-van-plate/van-plate"
import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono';
//import { html } from 'hono/html';
//import { logger } from 'hono/logger';
//import { getCookie, getSignedCookie, setCookie, setSignedCookie, deleteCookie } from 'hono/cookie';
//import { jwt } from 'hono/jwt'
// https://hono.dev/helpers/cookie

//import SQLDB from '../database/node_sql_database.js';
import { ORMSQLITE } from '../database/orm_sqlite.js';
import game from './game.js';
import auth from './auth.js';
import blog from './blog.js';
import forum from './forum.js';

//middleware for db
//note it reload for every request
export function useDB(options){
  //console.log('config db???')
  //console.log(options);
  let _db;
  if(options){
    if(options.db){
      _db = options.db;
    }
  }
  //layer by layer
  return async (c, next) => {
    //console.log('set db???')
    c.set('db',_db)
    await next();
  }
}
// DATABASE
//const db = new SQLDB();
const db = new ORMSQLITE();

const PORT = process.env.PORT || 3000;
const {head, a, body, style, script, button, input, li, p, ul} = van.tags

// Web Fetch Server
const app = new Hono({ 
  //strict: false 
});

//middleware
//note this will request every action if set to '*' to aollow all url
app.use('*',useDB({
  db:db,
}));

//app.use(
  //'/auth/*',
  //jwt({
    //secret: 'it-is-very-secret',
    //cookie:'token',
  //})
//)
//app.use('*', logger())
//app.use('*', async (c, next) => {
  //console.log(`[${c.req.method}] ${c.req.url}`)
  //await next()
//})

app.route('/game', game);
app.route('/', auth);
app.route('/', blog);
app.route('/', forum);

//<script type="module" src="/client.js"></script>
//<script type="module" src="/vanjs_client.js"></script>
//<script type="module" src="/solid_client.js"></script>
//<script type="module" src="/preact_client.js"></script>
//<script type="module" src="/van_three.js"></script>
app.get('/', (c) => {
  const db = c.get('db');
  //console.log('db', db);
  //return c.text('Hono!')
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
      //p("Your user-agent is: ", req.headers["user-agent"] ?? "Unknown"),
      //p("👋Hello"),
      script({type:"module",src:"/vanjs_client.js"})
    ),
  );

  /*
  const pageHtml = html`
  <!doctype html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <title>hono js</title>
      <style>
        body{
          background:gray;
          margin: 0px 0px 0px 0px;
          overflow: hidden;
        }
      </style>
    </head>
    <body>
      <script type="module" src="/vanjs_client.js"></script>
    </body>
  </html>
  `;
  */
  return c.html(pageHtml);
});

app.get('/spacemobile', (c) => {
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

app.get('/craftmobile', (c) => {
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
      script({src:"https://unpkg.com/three@0.157.0/examples/jsm/libs/ammo.wasm.js"}),
      script({type:"module",src:"/van_craftmobile.js"})
    ),
  );
  return c.html(pageHtml);
});

app.get('/craftrapier', (c) => {
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
      //script({src:"https://unpkg.com/three@0.157.0/examples/jsm/libs/ammo.wasm.js"}),
      script({type:"module",src:"/van_craftrapier.js"})
    ),
  );
  return c.html(pageHtml);
});
// https://threejs.org/docs/index.html#manual/en/introduction/Installation
app.get('/craft', (c) => {
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
      //script({src:"https://unpkg.com/three@0.157.0/examples/jsm/libs/ammo.wasm.js"}),
      
      script({type:"module",src:"/van_craft.js"})
    ),
  );
  return c.html(pageHtml);
});

app.get('/three', (c) => {
  //const db = c.get('db');
  console.log("/craft");
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

app.get('/threecss', (c) => {
  //const db = c.get('db');
  console.log("/craft");
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

app.get('/threeswitch', (c) => {
  //const db = c.get('db');
  console.log("/craft");
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

app.get('/chat', (c) => {
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

//set up static folder for public access
app.use('/*', serveStatic({ root: './assets' }));

//https://stackoverflow.com/questions/4224606/how-to-check-whether-a-script-is-running-under-node-js
let typeServer = 'none';
if((typeof process !== 'undefined') && (process.release.name === 'node')){
  typeServer='node';
}
if(typeof Bun == 'object'){
  typeServer='bun';
}

// https://github.com/orgs/honojs/discussions/1781
// server base on bun api by fetch
if(typeServer=='node'){
  const server = serve({
    fetch: app.fetch,
    port:PORT
  });
  const io = new Server(server);
  io.on('connection', (socket) => {
    console.log('a user connected');
    console.log('a user connected');
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });
  //console.log(io);
  console.log('Process Type:',typeServer)
  console.log(`hono server  http://localhost:${PORT}`)
  console.log(`hono server  http://localhost:${PORT}/chat`)
  console.log(`hono server  http://localhost:${PORT}/craft`)
  console.log(`hono server  http://localhost:${PORT}/three`)
  console.log(`hono server  http://localhost:${PORT}/threecss`)
  console.log(`hono server  http://localhost:${PORT}/threeswitch`)
  console.log(`hono server  http://localhost:${PORT}/craftmobile`)
  console.log(`hono server  http://localhost:${PORT}/craftrapier`)
}

//const server = serve(app)

export default app