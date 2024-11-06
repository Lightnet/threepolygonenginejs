/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

import { Hono } from 'hono';

const route = new Hono();

//===============================================
// PROJECT
//===============================================

// GET PROJECT
route.get('/api/project',(c)=>{
  const db = c.get('db');
  const results = db.get_projects();
  //console.log(results);
  return c.json(results);
})
// CREATE PROJECT
route.post('/api/project', async(c)=>{
  const data = await c.req.json();
  const db = c.get('db');
  console.log(data);

  const results = db.create_project(data.name,data.content);
  console.log("results");
  console.log(results);
  return c.json(results);
})

// DELETE PROJECT
route.delete('/api/project/:id', async(c)=>{

  const id = c.req.param('id');
  const db = c.get('db');

  const result = db.project_delete(id);
  console.log("result: ",result)
  //console.log(db);

  return c.json(result);
})

//===============================================
// SCENE
//===============================================
// GET SCENE
route.get('/api/scene',(c)=>{
  const db = c.get('db');
  const results = db.get_scenes();
  //console.log(results);
  return c.json(results);
})
// CREATE ENTITIES
route.post('/api/scene', async(c)=>{
  const data = await c.req.json();
  const db = c.get('db');
  console.log(data);

  const results = db.create_scene(data.name,data.content);
  console.log("results");
  console.log(results);
  return c.json(results);
})

//===============================================
// ENTITY
//===============================================
//GET ENTITIES
route.get('/api/entity',(c)=>{
  const db = c.get('db');
  const results = db.get_entities();
  //console.log(results);
  return c.json(results);
})
// CREATE ENTITIES
route.post('/api/entity', async(c)=>{
  const data = await c.req.json();
  const db = c.get('db');
  console.log(data);

  const results = db.create_entity(data.name,data.content);
  console.log("results");
  console.log(results);
  return c.json(results);
})
// UPDATE ENTITY
route.put('/api/entity/:id',async (c)=>{
  const id = await c.req.param('id')
  const data = await c.req.json();
  if(data){
    console.log("data update... id: ", id);
    console.log(data);
    const db = c.get('db');
    const result = db.blog_update(id, data.title,data.content);
    return c.json(result);
  }
  
  return c.json({api:'ERROR'});
})

// DELETE ENTITY
route.delete('/api/entity/:id',(c)=>{
  const id = c.req.param('id');
  console.log('ID: ', id);
  const db = c.get('db');
  const result = db.blog_delete(id);
  console.log("result: ",result)
  //console.log(db);

  return c.json(result);
})

//===============================================
// SCRIPT
//===============================================
//GET SCRIPT
route.get('/api/script',(c)=>{
  const db = c.get('db');
  const results = db.get_scripts();
  //console.log(results);
  return c.json(results);
})
// CREATE SCRIPT
route.post('/api/script', async(c)=>{
  const data = await c.req.json();
  const db = c.get('db');
  console.log(data);

  const results = db.create_script(data.name,data.content);
  console.log("results");
  console.log(results);
  return c.json(results);
})

export default route;