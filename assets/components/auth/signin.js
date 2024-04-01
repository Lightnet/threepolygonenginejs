

import van from "van";
import { useFetch } from "./useFetch.js";
const {button, input, label, div, table, tbody, tr, td} = van.tags;

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
  }

  return div({id:'login'},
  label('Login'),
  table(
    tbody(
      tr(
        td(label('User:')),
        td(input({value:user, oninput:e=>user.val=e.target.value}))
      ),
      tr(
        td(label('Passphrase:')),
        td(input({value:pass, oninput:e=>pass.val=e.target.value}))
      ),
      tr(
        td(
          button({onclick:c_login},'Login')
        )
      )
    )
  )
  )
}

export{
  SignInEL,
}
