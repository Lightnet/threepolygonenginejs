/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

import van from "vanjs-core";
import { Router, Link, getRouterParams, navigate, getRouterQuery } from "vanjs-routing";
import { AccessNavMenu } from "../navmenu.js";
import { GameDataNavMenus } from "./game.js";

const {button, div, label} = van.tags;

function Page_GameData() {
  // van.derive(() => {
  //   console.log(getRouterQuery()); // { section: "profile" }
  // });

  return div(
    AccessNavMenu(),
    //label("Game"), Link({ href: "/" }, "Home")
    GameDataNavMenus(),
    label('Game Data Home'),
  );
}

function Page_GameData_Scripts() {

  return div(
    AccessNavMenu(),
    GameDataNavMenus(),
    label('Game Scripts'),
  );
}

function Page_GameData_Scenes() {

  return div(
    AccessNavMenu(),
    GameDataNavMenus(),
    label('Game Scenes'),
  );
}

function Page_GameData_Projects() {

  return div(
    AccessNavMenu(),
    GameDataNavMenus(),
    label('Game Projects'),
  );
}

function Page_GameData_Entities() {

  return div(
    AccessNavMenu(),
    GameDataNavMenus(),
    label('Game Entities'),
  );
}


export{
  Page_GameData,
  Page_GameData_Scripts,
  Page_GameData_Scenes,
  Page_GameData_Projects,
  Page_GameData_Entities,
}