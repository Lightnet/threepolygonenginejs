/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

import van from "vanjs-core";
import { Router, Link, getRouterParams, navigate } from "vanjs-routing";

const {button, div, label} = van.tags;

import {
  aliasState,
  loginState
} from "/components/context.js";
import { ToggleTheme } from "./theme/theme.js";

const HomeNavMenu=()=>{
  const draw_access = van.derive(()=>{
    //console.log(loginState.val);
    //return loginState.val;
    if(loginState.val){
      return AccessNavMenu();
    }else{
      return BaseNavMenu();
    }
  });

  return draw_access;
}

const BaseNavMenu=()=>{
  return div(    
    ' ',
    button({onclick:()=>navigate("/")},'Home'),
    ' ',
    //button({onclick:()=>navigate("/about")},'About'),
    //' ',
    button({onclick:()=>navigate("/blog")},'Blog'),
    ' ',
    //button({onclick:()=>navigate("/editor")},'Editor'),
    //' ',
    //button({onclick:()=>navigate("/help")},'Help'),
    //' ',
    //button({onclick:()=>navigate("/settings")},'Settings'),
    ' ',
    button({onclick:()=>navigate("/signin")},'Sign In'),
    ' ',
    button({onclick:()=>navigate("/signup")},'Sign Up'),
    ' ',
    //button({onclick:()=>navigate("/forgot")},'Forgot'),
    //' ',
    ToggleTheme()
  );
}

const AccessNavMenu=()=>{
  return div(    
    ' ',
    button({onclick:()=>navigate("/")},'Home'),
    //' ',
    //button({onclick:()=>navigate("/about")},'About'),
    ' ',
    button({onclick:()=>navigate("/blog")},'Blog'),
    ' ',
    button({onclick:()=>navigate("/account")},'Account'),
    ' ',
    button({onclick:()=>navigate("/message")},'Message'),
    ' ',
    button({onclick:()=>navigate("/forum")},'Forum'),
    ' ',
    //button({onclick:()=>navigate("/game")},'Game'),
    button({onclick:()=>navigate("/gamedata")},'Game Data'),
    button({onclick:()=>navigate("/mapper")},'Mapper'),
    ' ',
    //button({onclick:()=>navigate("/gameobject")},'GameObject'),
    //' ',
    button({onclick:()=>navigate("/editor")},'Editor'),
    ' ',
    //button({onclick:()=>navigate("/help")},'Help'),
    button({onclick:()=>navigate("/report")},'Report'),
    ' ',
    button({onclick:()=>navigate("/settings")},'Settings'),
    ' ',
    button({onclick:()=>navigate("/signout")},'Sign Out'),
    ' ',
    ToggleTheme()
  );
}

export{
  HomeNavMenu,
  AccessNavMenu
}