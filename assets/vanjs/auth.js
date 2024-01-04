
import van from "https://cdn.jsdelivr.net/gh/vanjs-org/van/public/van-1.2.1.min.js";
const {button, input, label, div, table, tbody, td, tr,  a} = van.tags;



const LoginEL = () => {
  const user = van.state('guest');
  const pass = van.state('guest');

  function c_login(){
    console.log("Login...")
    console.log(user.val)
    console.log(pass.val)
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

const SignUpEL = () => {
  const user = van.state('guest');
  const pass = van.state('guest');

  function c_login(){
    console.log("Login...")
    console.log(user.val)
    console.log(pass.val)
  }

  return div({id:'Signup'},
  label('Sign Up'),
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

const ForgotEL = () => {
  return div({id:'Forgot'},)

}

export {
  LoginEL,
  SignUpEL,
  ForgotEL,
}