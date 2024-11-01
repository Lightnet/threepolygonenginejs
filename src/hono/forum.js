

import { Hono } from 'hono';

const route = new Hono();

//===============================================
// FORUM
//===============================================
// FORUM GET
route.get('/api/forum',(c)=>{
  const db = c.get('db');
  const results = db.get_forums();
  //console.log(results);
  return c.json(results);
})
// FORUM CREATE
route.post('/api/forum', async(c)=>{
  const data = await c.req.json();
  const db = c.get('db');
  //console.log(data);
  const results = db.forum_create(data.title,data.content);
  console.log("results");
  console.log(results);
  return c.json(results);
})
// FORUM UPDATE
route.put('/api/forum/:id',async (c)=>{
  const id = await c.req.param('id')
  const data = await c.req.json();
  if(data){
    console.log("data update... id: ", id);
    console.log(data);
    const db = c.get('db');
    const result = db.forum_update(id, data.title,data.content);
    return c.json(result);
  }
  return c.json({api:'ERROR'});
})
// FORUM DELETE
route.delete('/api/forum/:id',(c)=>{
  const id = c.req.param('id');
  console.log('ID: ', id);
  const db = c.get('db');
  const result = db.forum_delete(id);
  console.log("result: ",result)
  //console.log(db);
  return c.json(result);
})
//===============================================
// BOARD
//===============================================

// BOARD GET test
route.get('/api/board',(c)=>{
  const db = c.get('db');
  const results = db.get_boards();
  //console.log(results);
  return c.json(results);
})

// https://hono.dev/docs/api/routing
// BOARD GET
route.get('/api/board/:id',(c)=>{
  const db = c.get('db');
  console.log("board ID: ", c.req.param());
  const results = db.get_boards();
  //console.log(results);
  return c.json(results);
})

// BOARD CREATE
route.post('/api/board', async(c)=>{
  const data = await c.req.json();
  const db = c.get('db');
  //console.log(data);
  const results = db.board_create(data.title,data.content);
  console.log("results");
  console.log(results);
  return c.json(results);
})
// BOARD UPDATE
route.put('/api/board/:id',async (c)=>{
  const id = await c.req.param('id')
  const data = await c.req.json();
  if(data){
    console.log("data update... id: ", id);
    console.log(data);
    const db = c.get('db');
    const result = db.board_update(id, data.title,data.content);
    return c.json(result);
  }
  return c.json({api:'ERROR'});
})
// BOARD DELETE
route.delete('/api/board/:id',(c)=>{
  const id = c.req.param('id');
  console.log('ID: ', id);
  const db = c.get('db');
  const result = db.board_delete(id);
  console.log("result: ",result)
  //console.log(db);
  return c.json(result);
})


//===============================================
// BOARD
//===============================================

export default route;