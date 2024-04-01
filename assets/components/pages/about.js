import van from "vanjs-core";
import { Router, Link, getRouterParams, navigate, getRouterQuery } from "vanjs-routing";

const {button, div, pre, p} = van.tags

function AboutComponent() {
  van.derive(() => {
    console.log(getRouterQuery()); // { section: "profile" }
  });

  return div(p("About"), Link({ href: "/" }, "Back to Home"));
}

export{
  AboutComponent
}