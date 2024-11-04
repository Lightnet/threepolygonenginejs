/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

import van from "vanjs-core";
import { HomeNavMenu } from "../navmenu.js";

const {button, input, label, div, table, tbody, tr, td} = van.tags;

const Page_Setting = () => {

  return div(
    HomeNavMenu(),
    label('Settings'),
    div(
      label('Theme Color?'),
    ),
    div(
      label('Cookie?'),
    ),
    div(
      label('Admin/Mod?'),
    ),
  )
}

export {
  Page_Setting
}