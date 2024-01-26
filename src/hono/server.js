
// 
// https://github.com/orgs/honojs/discussions/1355
// 
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

//import SQLDB from '../database/node_sql_database.js';
import { ORMSQLITE } from '../database/orm_sqlite.js';
import game from './game.js';
import auth from './auth.js';
import blog from './blog.js';
import forum from './forum.js';
import pages from './pages.js';
import { GameManagement } from '../game/gamemanagement.js';
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
//const db = new SQLDB();
const db = new ORMSQLITE();

const PORT = process.env.PORT || 3000;
const {head, body, style, script} = van.tags

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
  return c.html(pageHtml);
});

app.route('/', pages);

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
  GameNetwork.io = io;
  const gameManagement = new GameManagement({io:io});

  io.on('connection', (socket) => {
    console.log('a user connected');
    
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
  console.log(`hono server  http://localhost:${PORT}/resizecssrender`)
  console.log(`hono server  http://localhost:${PORT}/threeswitch`)
  console.log(`hono server  http://localhost:${PORT}/craftmobile`)
  console.log(`hono server  http://localhost:${PORT}/craftrapier`)
  console.log(`hono server  http://localhost:${PORT}/entitiesomponentssystems`)
}

//const server = serve(app)

export default app