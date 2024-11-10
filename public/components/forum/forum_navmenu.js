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

function Forum_NavMenu(){

  return div(
    button({onclick:()=>navigate("/")},"Back"),
    //' ',
    //label("Forum"),
    //' ',
    //button({onclick:()=>navigate("/forum")},"Home"),
    //button({onclick:()=>navigate("/forum/account")},"Account"),
    button({onclick:()=>navigate("/forum/message")},"Message"),
    button({onclick:()=>navigate("/forum/settings")},"settings"),
    //button({onclick:()=>navigate("/forum/admin")},"admin"),
    ToggleTheme(),
  );
}

export {
  Forum_NavMenu
}

