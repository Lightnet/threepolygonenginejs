/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

// 
// https://github.com/orgs/honojs/discussions/1355
// 

import { Server } from 'socket.io'
//import { Server as HttpServer } from 'http'
import { serve } from '@hono/node-server';
import van from "mini-van-plate/van-plate"
import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono';
//import { html } from 'hono/html';
//import { logger } from 'hono/logger';
//import { getCookie, getSignedCookie, setCookie, setSignedCookie, deleteCookie } from 'hono/cookie';
//import { jwt } from 'hono/jwt'
// https://hono.dev/helpers/cookie

import SQLDB from '../database/node_sql_database.js';
//import { ORMSQLITE } from '../database/orm_sqlite.js';
import game from './game.js';
import auth from './auth.js';
import blog from './blog.js';
import forum from './forum.js';
import pages, { scriptHtml02 } from './pages.js';
import admin from './admin.js';
import message from './message.js';

import { GameManagement, socketGameSetup } from '../game/gamemanagement.js';
import { GameNetwork } from '../game/network.js';

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
const db = new SQLDB();
//const db = new ORMSQLITE();

const PORT = process.env.PORT || 3000;
const {head, body, style, script} = van.tags

// Web Fetch Server
const app = new Hono({ 
  //strict: false 
});

//middleware
//note this will request every action if set to '*' to allow all url
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

app.route('/', game);
app.route('/', auth);
app.route('/', message);
app.route('/', blog);
app.route('/', forum);
app.route('/', admin);

//<script type="module" src="/client.js"></script>
//<script type="module" src="/vanjs_client.js"></script>
//<script type="module" src="/solid_client.js"></script>
//<script type="module" src="/preact_client.js"></script>
//<script type="module" src="/van_three.js"></script>
app.get('/', (c) => {
  //const db = c.get('db');
  //console.log('db', db);
  //return c.text('Hono!')

  // background:gray;
  const pageHtml = scriptHtml02("/index.js");
    
  return c.html(pageHtml);
});

//set up static folder for public access
app.use('/*', serveStatic({ root: './assets' }));

app.route('/', pages);

//wild card url for router vanjs added last
app.use('/*',  (c) => {
  //const db = c.get('db');
  //console.log('db', db);
  //return c.text('Hono!')

  const pageHtml = scriptHtml02("/index.js");
  return c.html(pageHtml);
});

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
  GameNetwork.io = io;
  const gameManagement = new GameManagement({io:io});

  io.on('connection', (socket) => {
    console.log('a user connected');

    gameManagement.socketGameSetup(socket);
    //socketGameSetup(gameManagement,socket);
    /*
    socket.on('api', (data) => {
      console.log(data)
      if(data){
        if(data.action == "creategame"){
          gameManagement.createGameInstance();
        }
        if(data.action == "reset"){
          gameManagement.gameReset();
        }
        if(data.action == "echo"){
          gameManagement.echo();
        }
      } 
    });
    */
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });

  //console.log(io);
  console.log('Process Type:',typeServer)
  console.log(`hono server  http://localhost:${PORT}`)
  let urlList = [
    //`http://localhost:${PORT}/chat`,
    `http://localhost:${PORT}/craft`,
    //`http://localhost:${PORT}/three`,
    //`http://localhost:${PORT}/editor`,
    //`http://localhost:${PORT}/login`,
    `http://localhost:${PORT}/admin`,
    `http://localhost:${PORT}/threejs_test`,
    `http://localhost:${PORT}/texteditortest`,
    `http://localhost:${PORT}/threejs_mapping`,
    //`http://localhost:${PORT}/threecss2d`,
    //`http://localhost:${PORT}/threecss3d`,
    // `http://localhost:${PORT}/three_css3srenderer_resize`,
    // `http://localhost:${PORT}/threeammo`,
    // `http://localhost:${PORT}/threerapier`,
    // `http://localhost:${PORT}/threerapierjsm`,
    // `http://localhost:${PORT}/entitiesomponentssystems`,
    // `http://localhost:${PORT}/worker`,
    // `http://localhost:${PORT}/ecs_worker`,
    // `http://localhost:${PORT}/triecs_sample01`,
    // `http://localhost:${PORT}/triecs_sample02`,
    // `http://localhost:${PORT}/triecs_sample03`,
    // `http://localhost:${PORT}/triecs_sample04`,
  ];

  for(var myurl in urlList){
    console.log(urlList[myurl]);
  }
}

//const server = serve(app)

export default app