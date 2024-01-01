//https://hono.dev/guides/middleware

//AUTH STUFF
import { Hono } from 'hono';
import { getCookie, getSignedCookie, setCookie, setSignedCookie, deleteCookie } from 'hono/cookie'
const app = new Hono({ 
  //strict: false 
});

app.use("*", checkAccess);

// https://hono.dev/getting-started/basic#request-and-response
app.post('/api/auth/signup', async (c) => {
  //const data = c.req.query()
  const data = await c.req.json()
  //console.log(data);
  //return c.text('Hono!')
  if(data){
    if((data.alias !=null)&&(data.passphrase !=null)){
      if((!data.alias)||(!data.passphrase)){
        return c.json({api:"EMPTY"});  
      }
      const db = c.get('db');
      const user = db.user_exist(data.alias);
      //console.log("user DB");
      //console.log(user);
      if(user){
        return c.json({api:'EXIST'});
      }else{
        const result = db.user_create(data.alias,data.passphrase);
        return c.json(result);
      }
    }
  }
  return c.json({api:"ERROR"});
})

app.post('/api/auth/signin', async (c) => {
  //const data = c.req.query()
  const data = await c.req.json()
  //console.log(data);
  if(data){
    if((data.alias !=null)&&(data.passphrase !=null)){
      if((!data.alias)||(!data.passphrase)){
        return c.json({api:"EMPTY"});  
      }
      const db = c.get('db');
      const result = db.user_signin(data.alias, data.passphrase);
      //console.log("user DB");
      //console.log(result);
      if(result){
        if(result?.api=='PASS'){
          let token = {alias: data.alias};
          token=JSON.stringify(token)
          setCookie(c, 'token', token,{
            httpOnly:true,
            path:"/"
          });
        }
      }
      
      return c.json(result);
    }
  }

  //return c.text('Hono!')
  return c.json({api:"ERROR"});
});

// https://hono.dev/helpers/cookie
app.post('/api/auth/signout', async (c) => {
  const tokenCookie = getCookie(c, 'token');
  if(tokenCookie){
    deleteCookie(c, 'token');
    return c.json({api:"PASS"});
  }

  return c.json({api:"ERROR"});
});

export async function checkAccess(c, next){
  console.log("access...");
  console.log(c);
  await next();
  console.log("access end...");
}

//get user data that is secure
app.get('/api/auth/user', async (c) => {
  //const data = c.req.query()

  //return c.text('Hono!')
  return c.json({api:"ERROR"});
});

export default app;