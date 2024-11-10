/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

// https://www.w3schools.com/howto/howto_js_redirect_webpage.asp

//import van from "van";
import { THREE, ECS, van } from "../../triengine/dps.js";
import { useFetch } from "./useFetch.js";
const {button, input, label, div, table, tbody, tr, td, center} = van.tags;

const LoginEL = () => {
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
  }

  async function c_register(){
    window.location.href = "/";
  }

  async function c_recovery(){
    window.location.href = "/";
  }

  async function c_cancel(){
    window.location.href = "/";
  }

  return div({id:'login'},
  center(
    table(
      tbody(
        tr(
          td({colspan:"2"},center(label('ACCESS')))
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
            button({onclick:c_register,style:"width:100%"},'Register')
          )
        ),
        tr(
          td({colspan:"2"},
            button({onclick:c_recovery,style:"width:100%"},'Recovery')
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
  LoginEL,
}
