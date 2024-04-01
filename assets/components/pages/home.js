import van from "vanjs-core";
import { Router, Link, getRouterParams, navigate } from "vanjs-routing";
import { HomeNavMenu } from "../navmenu.js";

const {button, div, label} = van.tags;

function HomeComponent() {
  return div(
    div(
      label("Home"), 
    ),
    HomeNavMenu(),
  );
}

export{
  HomeComponent
}