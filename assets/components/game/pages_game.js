/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

import van from "vanjs-core";

import useFetch from "/libs/useFetch.js";
import { Router, Link, getRouterParams, navigate, getRouterQuery } from "vanjs-routing";
import { AccessNavMenu } from "../navmenu.js";
import { El_CreateEntityForm, El_CreateProjectForm, El_CreateSceneForm, El_CreateScriptForm, El_ProjectList, El_ScriptList, GameDataNavMenus } from "./game.js";

const {button, div, label, textarea} = van.tags;

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
    El_CreateScriptForm(),
    El_ScriptList(),
  );
}

function Page_GameData_Scenes() {

  return div(
    AccessNavMenu(),
    GameDataNavMenus(),
    label('Game Scenes'),
    El_CreateSceneForm(),
  );
}

function Page_GameData_Projects() {

  return div(
    AccessNavMenu(),
    GameDataNavMenus(),
    label('Game Projects'),
    El_CreateProjectForm(),
    El_ProjectList(),
  );
}

function Page_GameData_Entities() {

  const ElEntities = div();

  async function get_Entities(){
    try {
      let data = await useFetch('/api/entity');
      console.log(data)
      for (const item of data ){
        console.log(item)
        van.add(ElEntities, div(
          label("[ ID: "  + item.id + " ] "),
          label("[ Name: "  + item.name + " ] "),
          label('[ Content ]'),
          textarea(item.content),
        ))
      }
    } catch (error) {
      
    }
  }

  get_Entities();

  return div(
    AccessNavMenu(),
    GameDataNavMenus(),
    label('Game Entities'),
    El_CreateEntityForm(),
    div(
      ElEntities,
    )
  );
}


export{
  Page_GameData,
  Page_GameData_Scripts,
  Page_GameData_Scenes,
  Page_GameData_Projects,
  Page_GameData_Entities,
}