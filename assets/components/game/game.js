/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

import van from "vanjs-core";
import { Router, Link, getRouterParams, navigate, getRouterQuery } from "vanjs-routing";
const {button, div, pre, p} = van.tags;

function GameDataNavMenus(){
  return div(
    button({onclick:()=>navigate('/gamedata')},'Home'),
    button({onclick:()=>navigate('/gamedata/entities')},'Entities'),
    button({onclick:()=>navigate('/gamedata/scenes')},'Scenes'),
    button({onclick:()=>navigate('/gamedata/projects')},'Projects'),
    button({onclick:()=>navigate('/gamedata/scripts')},'Scripts'),
  )
}

export {
  GameDataNavMenus,


}