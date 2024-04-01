/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

import van from "van";
const {button, input, label, div, script, pre, p, ul, li, a} = van.tags;

const AccountEL = () => {
  return div({id:'account'},
  label('Account')
  )
}

export {
  AccountEL,
}
