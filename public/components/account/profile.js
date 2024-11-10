/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

import van from "vanjs-core";
const {button, input, label, div, script} = van.tags;
import useFetch from '/libs/useFetch.js';
const AccountEL = () => {

  const ELInfon = div()

  async function c_info(){
    try {
      let data = await useFetch('/api/user');
      console.log(data);
      if(data){
        ELInfon.innerHTML = '';//clear children
        van.add(ELInfon,div(
          div(
            label('Name:'+data.alias),
          ),
          div(
            label('Role:'+data.role),
          ),
          div(
            label('Date Join:'+data.join),
          ),          
        ))
      }

    } catch (error) {
      
    }
  }

  return div({id:'account'},
    div(
      label('Account'),
      button({onclick:c_info},'Info')
    ),
    ELInfon,
  )
}

export {
  AccountEL,
}
