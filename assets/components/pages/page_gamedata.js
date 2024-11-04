/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

import van from "vanjs-core";
import { Router, Link, getRouterParams, navigate, getRouterQuery } from "vanjs-routing";
import {AccessNavMenu} from "/components/navmenu.js";
import { GameDataNavMenus } from "../game/game.js";
const {button, div, pre, label} = van.tags

function Page_GameData() {
  van.derive(() => {
    console.log(getRouterQuery()); // { section: "profile" }
  });

  return div(
    AccessNavMenu(),
    //label("Game"), Link({ href: "/" }, "Home")
    GameDataNavMenus(),
    label('Game Data Home'),
  );
}

export{
  Page_GameData,
}