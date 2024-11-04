/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

import van from "vanjs-core";
import { Router, Link, getRouterParams, navigate, getRouterQuery } from "vanjs-routing";
//import { GameData_Entities } from "./page_gamedata";
import { AccessNavMenu } from "../navmenu.js";
import { GameDataNavMenus } from "../game/game.js";
//import { GameObject_SubMenu } from "../gameobject/gameobject_submenu.js";

const {button, div, pre, label} = van.tags

function Page_GameData_Entities() {
  van.derive(() => {
    console.log(getRouterQuery()); // { section: "profile" }
  });

  return div(
    //GameObject_SubMenu(),
    AccessNavMenu(),
    //label("Game"), Link({ href: "/" }, "Home")
    GameDataNavMenus(),
    label('Game Entities'),
  );
}

export{
  Page_GameData_Entities
}