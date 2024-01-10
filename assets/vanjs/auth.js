
import van from "https://cdn.jsdelivr.net/gh/vanjs-org/van/public/van-1.2.1.min.js";
const {button, input, label, div, table, tbody, td, tr,  a} = van.tags;

// https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch

async function useFetch(url, option){
  try {
    let options = option || {};
    options.headers={
      'Content-Type':'application/json',
    };
    const rep = await fetch(url, options);
    const data = await rep.json();
    return data;
  } catch (error) {
    console.log(error);
    return {api:'ERROR'};
  }
}


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

const ForgotEL = () => {
  return div({id:'Forgot'},)

}

export {
  LoginEL,
  SignUpEL,
  ForgotEL,
}