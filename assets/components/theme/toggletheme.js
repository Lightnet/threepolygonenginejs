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
import { MessageBoard } from 'vanjs-ui';

const {button} = van.tags;

function ToggleTheme(){

  const themeState = van.state('light');

  function toggleTheme(){
    
    if(themeState.val == 'light'){
      themeState.val = 'dark';
      document.body.setAttribute("data-theme", "dark");
    }else{
      themeState.val = 'light';
      document.body.setAttribute("data-theme", "light");
    }
    console.log("themeState.val",themeState.val)
  }

  return button({onclick:toggleTheme},'Theme')
}

export {
  ToggleTheme
}