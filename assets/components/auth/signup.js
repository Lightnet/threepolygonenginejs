

import van from "van";
const {button, input, label, div, table, tbody, tr, td} = van.tags;

const SignUpEL = () => {

  const displayuser = van.state('guest');
  const username = van.state('guest');
  const pass = van.state('guest');
  const pass2 = van.state('guest');
  const email = van.state('guest');
  const email2 = van.state('guest');

  async function c_signup(){
    console.log("Login...")
    console.log(username.val)
    console.log(pass.val)

    let data = await useFetch('/api/auth/signup',{
      method:'POST',
      body:JSON.stringify({
        alias:username.val,
        passphrase:pass.val,
      })
    });
    console.log(data);
  }

  return div({id:'Signup'},
  label('Sign Up'),
  table(
    tbody(
      tr(
        td(label('Display User:')),
        td(input({value:displayuser, oninput:e=>displayuser.val=e.target.value}))
      ),
      tr(
        td(label('Login User:')),
        td(input({value:username, oninput:e=>username.val=e.target.value}))
      ),
      tr(
        td(label('Passphrase #1:')),
        td(input({value:pass2, oninput:e=>pass2.val=e.target.value}))
      ),
      tr(
        td(label('Passphrase #2:')),
        td(input({value:pass, oninput:e=>pass.val=e.target.value}))
      ),
      tr(
        td(label('Email #1:')),
        td(input({value:email, oninput:e=>email.val=e.target.value}))
      ),
      tr(
        td(label('Email #2:')),
        td(input({value:email2, oninput:e=>email2.val=e.target.value}))
      ),
      tr(
        td(
          button({onclick:c_signup},'Login')
        )
      )
    )
  )
  )
}

export{
  SignUpEL,
}
