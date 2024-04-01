

import van from "van";
import { Router, Link, getRouterParams, navigate, getRouterQuery } from "vanjs-routing";

const {button, input, label, div, br, textarea, script, ul, li, a} = van.tags;

const GameObject_SubMenu = ()=>{
  return div(
    button({onclick:()=>navigate('/')},'Back'),
    button({onclick:()=>navigate('/gameobject')},'Home'),
    button({onclick:()=>navigate('/gameobject/entity')},'Entity'),
    button({onclick:()=>navigate('/gameobject/settings')},'Settings'),
  )
}

export {
  GameObject_SubMenu
}