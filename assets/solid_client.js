import { createSignal, onCleanup} from "https://cdn.skypack.dev/solid-js";
import { render } from "https://cdn.skypack.dev/solid-js/web";
import html from "https://cdn.skypack.dev/solid-js/html";
import h from "https://cdn.skypack.dev/solid-js/h";

/*
const App = () => {
  const [count, setCount] = createSignal(0),
    timer = setInterval(() => setCount(count() + 1), 1000);
  onCleanup(() => clearInterval(timer));
  return html`<div>${count}</div>`;
  // or
  //return h("div", {}, count);
};
render(App, document.body);
*/

const ufetch = async (url, options)=>{
  try {
    if(options?.method){
    }else{
      options.method='POST';
    }
    options.headers={
      'Content-Type':'application/json',
    };
    const resp = await fetch(url,options)
    const data = await resp.json();
    //console.log(data)
    return data;
  } catch (error) {
    console.log("error: ",error);
    return {api:"TryError"};
  }
}

const LoginEL = () => {
  const [alias, setAlias] = createSignal('test');
  const [passphrase, setPassphrase] = createSignal('passwd');

  async function click_login(){
    console.log("click");
    console.log("alias",alias());
    const data = await ufetch('/api/auth/signin',{
      body:JSON.stringify({
        alias:alias(),
        passphrase:passphrase()
      })
    })
    console.log(data)
  }

  async function click_register(){
    console.log("click");
    console.log("alias",alias());
    const data = await ufetch('/api/auth/signup',{
      body:JSON.stringify({
        alias:alias(),
        passphrase:passphrase()
      })
    })
    console.log(data)
  }


  return h('div',{id:'access'},
    h('label',{},'Alias'),
    h('input',{value:alias,oninput:e=>setAlias(e.target.value)}),
    h('label',{},'Passphrase:'),
    h('input',{value:passphrase,oninput:e=>setPassphrase(e.target.value)}),
    h('button',{onclick:click_login},'login'),
    h('button',{onclick:click_register},'register'),
  );
}


const App = () => {
  const [count, setCount] = createSignal(0),
    timer = setInterval(() => setCount(count() + 1), 1000);
  onCleanup(() => clearInterval(timer));
  //return html`<div>${count}</div>`;

  return html`<div>
  <${LoginEL}>
  </div>`;
  // or
  //return h("div", {}, count);
};
render(App, document.body);