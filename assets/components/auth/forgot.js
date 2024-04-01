/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

import van from "van";
import { useFetch } from "./useFetch.js";
const {button, input, label, div, table, tbody, tr, td} = van.tags;

const ForgotEL = () => {
  const user = van.state('guest');
  const email = van.state('');

  async function btnForgot(){
    console.log(user.val)
    console.log(email.val)

    let data = await useFetch('/api/auth/forgot',{
      method:'POST',
      body:JSON.stringify({
        alias:user.val,
        email:email.val,
      })
    });
    console.log(data);
  }

  return div({id:'forgot'},
  label('Forgot'),
  table(
    tbody(
      tr(
        td(label('User:')),
        td(input({value:user, oninput:e=>user.val=e.target.value}))
      ),
      tr(
        td(label('E-Mail:')),
        td(input({value:email, oninput:e=>email.val=e.target.value}))
      ),
      tr(
        td(
          button({onclick:btnForgot},'Recovery')
        )
      )
    )
  )
  )
}

export{
  ForgotEL,
}
