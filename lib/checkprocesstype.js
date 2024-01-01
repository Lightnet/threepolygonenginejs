export function CheckProcessType(){
  let typeServer = 'none';
  if((typeof process !== 'undefined') && (process.release.name === 'node')){
    typeServer='node';
  }
  if(typeof Bun == 'object'){
    typeServer='bun';
  }
  console.log('Process Type:',typeServer)
  return typeServer;
}