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

const {button,style} = van.tags;

function ToggleTheme(){

  const themeState = van.state('light');

  //check if local storage theme exist
  const data_theme = localStorage.getItem("data-theme");
  if(data_theme){
    themeState.val = data_theme
  }

  function toggleTheme(){
    console.log("themeState.val",themeState.val)
    if(themeState.val == 'light'){
      themeState.val = 'dark';
    }else{
      themeState.val = 'light';
    }
    //set theme
    localStorage.setItem("data-theme", themeState.val);
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

function CheckTheme(){
  //document.body.setAttribute("data-theme", themeState.val);
  console.log("data-theme", document.body.getAttribute("data-theme"));
  const data_theme = localStorage.getItem("data-theme");
  if(data_theme){
    document.body.setAttribute("data-theme", data_theme);
    console.log("data-theme", document.body.getAttribute("data-theme"));
  }
}

/*
  color...pain...
  #light

  --cheader-color:#cccccc;
  --ccontent-color:#e6e6e6;
  --cbody-color:#e6e6e6;
  --cfont-color:#000000;

  #dark

  
*/

const UIStyle = style(`

  :root {
    --cheader-color:#cccccc;
    --ccontent-color:#e6e6e6;
    --cbody-color:#e6e6e6;
    --cfont-color:#000000;
  }
  
  [data-theme='dark'] {
    --cheader-color:#333333;
    --ccontent-color:#666666;
    --cbody-color:#1a1a1a;
    --cfont-color:#d9d9d9;
  }
  
  [data-theme='light'] {
    --cheader-color:#cccccc;
    --ccontent-color:#e6e6e6;
    --cbody-color:#e6e6e6;
    --cfont-color:#000000;
  }
  
  .cheader{
    background-color: var(--cheader-color);
  }
  
  .ccontent{
    background-color: var(--ccontent-color);
  }
  
  body{
    background-color: var(--cbody-color);
    color:var(--cfont-color);
  }
  
  `);
  /*
  #background-color: #66a3ff;

  */

export {
  ToggleTheme,
  UIStyle,
  CheckTheme,
}