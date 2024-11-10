/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

import van from "van";
import { useFetch } from "./useFetch.js";
const {button, input, label, div, table, tbody, tr, td, center} = van.tags;
import { Router, Link, getRouterParams, navigate } from "vanjs-routing";
import {
  aliasState,
  loginState
} from "/components/context.js";

const SignInEL = () => {
  const user = van.state('guest');
  const pass = van.state('guest');

  async function c_login(){
    console.log("Login...")
    console.log(user.val)
    console.log(pass.val)

    let data = await useFetch('/api/auth/signin',{
      method:'POST',
      body:JSON.stringify({
        alias:user.val,
        passphrase:pass.val,
      })
    });
    console.log(data);
    if(data){
      if(data.api){
        if(data.api == 'PASS'){
          aliasState.val = user.val
          loginState.val = true;
          pass.val = '';
          navigate('/')
        }
      }
    }
  }

  async function c_cancel(){
    navigate("/");
  }

  return div({id:'login'},
  center(
    table(
      tbody(
        tr(
          td({colspan:"2",class:"cheader"},
            center(
              label('ACCESS'),
            )
          ),
        ),
        tr(
          td(label('User:')),
          td(input({value:user, oninput:e=>user.val=e.target.value}))
        ),
        tr(
          td(label('Passphrase:')),
          td(input({value:pass, oninput:e=>pass.val=e.target.value}))
        ),
        tr(
          td({colspan:"2"},
            button({onclick:c_login,style:"width:100%"},'Login')
          )
        ),
        tr(
          td({colspan:"2"},
            button({onclick:()=>navigate("/forgot"),style:"width:100%"},'Forgot')
          )
        ),
        tr(
          td({colspan:"2"},
            button({onclick:c_cancel,style:"width:100%"},'Cancel')
          )
        )
      )
    )
    )
  )
}

export{
  SignInEL,
}
