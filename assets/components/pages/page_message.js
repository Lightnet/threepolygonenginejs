/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

import van from "van";
const {button, input, label, div, script, pre, p, ul, li, a} = van.tags;

function MessagePage(){

  return div({id:'message'},
    label('Message')
  )
}

export {
  MessagePage
}