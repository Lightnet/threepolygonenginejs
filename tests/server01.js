//const HyperExpress = require('hyper-express');
//const webserver = new HyperExpress.Server();
import van from "mini-van-plate/van-plate";
import HyperExpress from 'hyper-express';
import LiveDirectory from 'live-directory';

import * as url from 'url';
    
import path from 'node:path';
//const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
//console.log("__filename: ", __filename)
//console.log("__dirname: ", __dirname)

const {script,a,label, body, button, input, li, p, ul} = van.tags;
const app = new HyperExpress.Server();

// Create a LiveDirectory instance to virtualize directory with our assets
//console.log("path.join(__dirname,'assets'): ", path.join(__dirname,'assets'))
let staticFiles = path.join(__dirname,'assets');
staticFiles = "./assets";
const LiveAssets = new LiveDirectory(staticFiles, {
  //static:false,
  //static: true,
  filter: {
    keep: {
      extensions: ['js'] // We only want to load .js files
    }
  }
});

//console.log("TEST");
//console.log(LiveAssets)
//const test = LiveAssets.get('client.js');
//console.log(test)
//console.log(LiveAssets.get('client.js'));

// Create GET route to serve 'Hello World'
app.get('/', (request, response) => {
  //response.send('Hello World');
  response.send((van.html(
    body(
      script({type:"module",src:'/assets/client.js'}),
    ),
  )));
})

app.get('/setcookie',(request, response)=>{
  return response
    .cookie(
      'testcookie',
      'TESTCOOKIE',
      new Date(Date.now() + 60*60*24 ),
      false)
    //.type('javascript')
    //.header('content-type',"application/javascript")
    .send('cookie');
})

app.get('/clearcookie',(request, response)=>{
  return response
    .cookie(
      'testcookie',
      'TESTCOOKIE',
      0,//clear by expire date
      false)
    //.type('javascript')
    //.header('content-type',"application/javascript")
    .send('cookie');
})

// Create static serve route to serve frontend assets
app.get('/assets/*', (request, response) => {
  // Strip away '/assets' from the request path to get asset relative path
  // Lookup LiveFile instance from our LiveDirectory instance.
  const path = request.path.replace('/assets/', '');
  const asset = LiveAssets.get(path);
  if (!asset) return response.status(404).send('Not Found');

  if (asset.cached) {
    //console.log("content: ", asset.content);
    //console.log(asset.extension)
    console.log(asset)
    //response.type("application/javascript");
    //response.type("javascript");
    return response
      //.type('javascript')
      .header('content-type',"application/javascript")
      .send(asset.content);
  }else{
    //console.log("stream");
    const readable = asset.stream();
    return readable.pipe(response);
  }
  //console.log("path:", path);
  ////let file = LiveAssets.get(path);
  //let file = LiveAssets.get('client.js');
  //console.log("file: ",file);
  //return response.send('test');

  // Return a 404 if no asset/file exists on the derived path
  //if (file === undefined) return response.status(404).send();
  
  // Set appropriate mime-type and serve file buffer as response body
  //return response.type(file.extension).send(file.buffer);
});

// Activate webserver by calling .listen(port, callback);
app.listen(80)
  .then((socket) => console.log('Webserver started on port http://localhost:80'))
  .catch((error) => console.log('Failed to start webserver on port 80'));