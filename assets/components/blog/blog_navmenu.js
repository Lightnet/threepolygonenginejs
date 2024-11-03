/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

import van from "vanjs-core";
import { Router, Link, getRouterParams, navigate } from "vanjs-routing";
import { ToggleTheme } from "../theme/theme.js";
const {button, input, label, div, script, pre, p, ul, li, a, table, tbody, tr,td} = van.tags;

function Blog_NavMenu(){

  return div(
    //button({onclick:()=>navigate("/")},"Back"),
    button({onclick:()=>navigate("/")},"Home"),
    button({onclick:()=>navigate("/blog")},"Blog"),
    ToggleTheme(),
    //' ',
    //label("Blog"),
    //' ',
    //button({onclick:()=>navigate("/blog")},"Home"),
    //button({onclick:()=>navigate("/blog")},"Create Post"),
    //button({onclick:()=>navigate("/forum/settings")},"Settings"),
    //button({onclick:()=>navigate("/forum/admin")},"Admin"),
  );
}

export {
  Blog_NavMenu
}

