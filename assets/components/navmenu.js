/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

import van from "vanjs-core";
import { Router, Link, getRouterParams, navigate } from "vanjs-routing";

const {button, div, label} = van.tags;

const HomeNavMenu=()=>{
  return div(    
    ' ',
    button({onclick:()=>navigate("/")},'Home'),
    ' ',
    button({onclick:()=>navigate("/about")},'About'),
    ' ',
    button({onclick:()=>navigate("/blog")},'Blog'),
    ' ',
    button({onclick:()=>navigate("/account")},'Account'),
    ' ',
    button({onclick:()=>navigate("/game")},'Game'),
    ' ',
    button({onclick:()=>navigate("/gameobject")},'GameObject'),
    ' ',
    button({onclick:()=>navigate("/editor")},'Editor'),
    ' ',
    button({onclick:()=>navigate("/help")},'Help'),
    ' ',
    button({onclick:()=>navigate("/settings")},'Settings'),
    ' ',
    button({onclick:()=>navigate("/signin")},'Sign In'),
    ' ',
    button({onclick:()=>navigate("/signup")},'Sign Up'),
    ' ',
    button({onclick:()=>navigate("/signout")},'Sign Out'),
    ' ',
    button({onclick:()=>navigate("/forgot")},'Forgot'),
    ' ',
  );
}

export{
  HomeNavMenu
}