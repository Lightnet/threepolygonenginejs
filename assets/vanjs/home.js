import van from "https://cdn.jsdelivr.net/gh/vanjs-org/van/public/van-1.2.1.min.js";
const {button, input, label, div, script, pre, p, ul, li, a} = van.tags;

import appState from "./context.js";

export default function HomeEl(){

  function click_test(){
    appState.alias.val = "test1";
  }

  return div(
    label('home'),
    button({onclick:()=>click_test()},'test1')
  )
}