/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

import { Hono } from 'hono';

const route = new Hono();
// GET BLOGS
route.get('/api/blog',(c)=>{
  const db = c.get('db');
  const results = db.get_blogs();
  //console.log(results);
  return c.json(results);
})
// CREATE
route.post('/api/blog', async(c)=>{
  const data = await c.req.json();
  const db = c.get('db');
  //console.log(data);

  const results = db.blog_create(data.title,data.content);
  console.log("results", results);
  //console.log(results);

  return c.json(results);
})
// UPDATE
route.put('/api/blog/:id',async (c)=>{
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
//DELETE
route.delete('/api/blog/:id',(c)=>{
  const id = c.req.param('id');
  console.log('ID: ', id);
  const db = c.get('db');
  const result = db.blog_delete(id);
  console.log("result: ",result)
  //console.log(db);

  return c.json(result);
})

export default route;