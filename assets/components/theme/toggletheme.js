/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

/*
  Informtion: Context
*/

//import van from 'van';
import van from "vanjs-core";
//import { MessageBoard } from 'vanjs-ui';

const {button} = van.tags;

function ToggleTheme(){

  const themeState = van.state('light');

  function toggleTheme(){
    console.log("themeState.val",themeState.val)
    if(themeState.val == 'light'){
      themeState.val = 'dark';
    }else{
      themeState.val = 'light';
    }
    document.body.setAttribute("data-theme", themeState.val);
  }

  const isLight = van.derive(()=>{
    if(themeState.val == 'light'){
      //console.log("Hello?", 'light?');
      return 'light';
    }else{
      //console.log("Hello?", 'dark?');
      return 'dark';
    }
  })

  return button({onclick:toggleTheme},() => `Theme: ${isLight.val}`)
}

export {
  ToggleTheme
}