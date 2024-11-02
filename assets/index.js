/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

// https://developer.mozilla.org/en-US/docs/Web/CSS/:root
// https://stackoverflow.com/questions/77494641/use-data-theme-variable-value-in-css
import van from "vanjs-core";
import App from "./components/app.js";

const {style} = van.tags;

/*
  color...pain...
  #light

  --cheader-color:#cccccc;
  --ccontent-color:#e6e6e6;
  --cbody-color:#e6e6e6;
  --cfont-color:#000000;

  #dark

  
*/



van.add(document.head, style(`

:root {
  --cheader-color:#cccccc;
  --ccontent-color:#e6e6e6;
  --cbody-color:#e6e6e6;
  --cfont-color:#000000;
}

[data-theme='dark'] {
  --cheader-color:#333333;
  --ccontent-color:#666666;
  --cbody-color:#1a1a1a;
  --cfont-color:#d9d9d9;
}

[data-theme='light'] {
  --cheader-color:#cccccc;
  --ccontent-color:#e6e6e6;
  --cbody-color:#e6e6e6;
  --cfont-color:#000000;
}

.cheader{
  background-color: var(--cheader-color);
}

.ccontent{
  background-color: var(--ccontent-color);
}

body{
  background-color: var(--cbody-color);
  color:var(--cfont-color);
}

`))
/*
#background-color: #66a3ff;

*/


van.add(document.body, App())