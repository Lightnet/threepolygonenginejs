/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

import van from "van";
const {button, input, label, div, br, textarea, script, ul, li, a} = van.tags;


function GameObject_Settings(){

  return div(
    label("Settings")
  )
}

export {
  GameObject_Settings
}