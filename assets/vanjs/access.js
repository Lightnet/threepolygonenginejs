import van from "https://cdn.jsdelivr.net/gh/vanjs-org/van/public/van-1.2.1.min.js";
const {button, input, label, div, script, pre, p, ul, li, a} = van.tags;

const AccessEL = () => {
  const alias = van.state('test')
  const passphrase = van.state('passwd')

  async function onClick_signup(){
    const data = await ufetch('/api/auth/signup',{
      body:JSON.stringify({
        alias:alias.val,
        passphrase:passphrase.val
      })
    })
    console.log(data)
    if(data){
      if(data.api){
        if(data.api=='CREATED'){
          
        }
      }
    }
  }

  async function onClick_signin(){
    const data = await ufetch('/api/auth/signin',{
      body:JSON.stringify({
        alias:alias.val,
        passphrase:passphrase.val
      })
    })
    console.log(data)
    if(data){
      if(data.api){
        if(data.api=='PASS'){
          document.getElementById('access').remove();
          van.add(document.body, IndexEL())
        }
      }
    }
  }

  return div({id:'access'},
    label('Alias: '),
    input({value:alias,oninput:e=>alias.val=e.target.value}),
    label('Passphrase: '),
    input({value:passphrase,oninput:e=>passphrase.val=e.target.value}),
    button({onclick:()=>onClick_signin()},'Sign In'),
    button({onclick:()=>onClick_signup()},'Sign Up'),
  )
}


export{
  AccessEL,
  
}


