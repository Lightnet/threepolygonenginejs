/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

import van from "vanjs-core";
import { Router, Link, getRouterParams, navigate, getRouterQuery } from "vanjs-routing";
import { GameObject_SubMenu } from "../gameobject/gameobject_submenu.js";

const {button, div, pre, label} = van.tags

function GameObjectPage() {
  van.derive(() => {
    console.log(getRouterQuery()); // { section: "profile" }
  });

  return div(
    GameObject_SubMenu(),
  );
}

export{
  GameObjectPage
}