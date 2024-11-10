/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

async function useFetch(url, option){
  try {
    let options = option || {};
    options.headers={
      'Content-Type':'application/json',
    };
    const rep = await fetch(url, options);
    const data = await rep.json();
    return data;
  } catch (error) {
    console.log(error);
    return {api:'ERROR'};
  }
}

export default useFetch;
export {
  useFetch
}