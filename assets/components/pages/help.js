import van from "vanjs-core";
import { Router, Link, getRouterParams, navigate } from "vanjs-routing";

const {button, div, pre, p} = van.tags

function HelpComponent() {
  van.derive(() => {
    console.log(getRouterParams()); // { section: "profile" }
  });

  return div(
    p("Help"),
    Link({ href: "/" }, "Back to Home"),
    button({ onclick: () => navigate("/") }, "Back to Home (Imperative navigation)")
  );
}

export{
  HelpComponent
}