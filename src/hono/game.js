

import { Hono } from 'hono';

const route = new Hono();
//GET ENTITIES
route.get('/api/entity',(c)=>{
  const db = c.get('db');
  const results = db.get_blogs();
  //console.log(results);
  return c.json(results);
})
// CREATE ENTITIES
route.post('/api/entity', async(c)=>{
  const data = await c.req.json();
  const db = c.get('db');
  //console.log(data);

  const results = db.blog_create(data.title,data.content);
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

export default route;