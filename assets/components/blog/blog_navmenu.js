/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

import van from "vanjs-core";
import { Router, Link, getRouterParams, navigate } from "vanjs-routing";
const {button, input, label, div, script, pre, p, ul, li, a, table, tbody, tr,td} = van.tags;

function Blog_NavMenu(){

  return div(
    button({onclick:()=>navigate("/")},"Back"),
    ' ',
    label("Blog"),
    ' ',
    button({onclick:()=>navigate("/blog")},"Home"),
    button({onclick:()=>navigate("/blog")},"Create Post"),
    button({onclick:()=>navigate("/forum/settings")},"settings"),
    button({onclick:()=>navigate("/forum/admin")},"admin"),
  );
}

export {
  Blog_NavMenu
}

