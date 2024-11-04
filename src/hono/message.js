/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

import { Hono } from 'hono';

const route = new Hono();
// GET BLOGS
route.get('/api/message',(c)=>{
  const db = c.get('db');
  const results = db.get_messages();
  //console.log(results);
  return c.json(results);
})


// CREATE
route.post('/api/message', async(c)=>{
  const data = await c.req.json();
  const db = c.get('db');
  //console.log(data);

  const results = db.create_message("","",data.subject,data.content);
  console.log("results", results);
  //console.log(results);

  return c.json(results);
})

//DELETE
route.delete('/api/message/:id',(c)=>{
  const id = c.req.param('id');
  console.log('ID: ', id);
  const db = c.get('db');
  const result = db.delete_message(id);
  console.log("result: ",result)
  //console.log(db);

  return c.json(result);
})



export default route;