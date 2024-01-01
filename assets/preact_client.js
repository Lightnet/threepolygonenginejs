// https://stackoverflow.com/questions/69891883/how-to-use-usestate-hook-with-preact-and-no-build-tools

//import { h, Component, render } from 'https://esm.sh/preact';
//import htm from 'https://esm.sh/htm';
import { h, render } from 'https://cdn.skypack.dev/preact';
import { useState } from 'https://cdn.skypack.dev/preact/hooks';
//import { html } from 'https://cdn.skypack.dev/htm/preact';
import htm from "https://cdn.skypack.dev/htm";

// Initialize htm with Preact
const html = htm.bind(h);

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

const AccessEL = () => {
  const [alias, setAlias] = useState('test');
  const [passphrase, setPassphrase] = useState('passwd');

  async function click_login(){
    console.log("click");
    console.log("alias",alias);
    const data = await ufetch('/api/auth/signin',{
      body:JSON.stringify({
        alias:alias,
        passphrase:passphrase
      })
    })
    console.log(data)
  }

  async function click_register(){
    console.log("click");
    console.log("alias",alias);
    const data = await ufetch('/api/auth/signup',{
      body:JSON.stringify({
        alias:alias,
        passphrase:passphrase
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
};

const App = (props)=> {
  return html`<div>
  <${AccessEL}/> 
  </div>`;
}

render(html`<${App} name="World" />`, document.body);
/*
const Counter = () => {
  const [count, setCount] = useState(0);
  const increment = () => {
    setCount(prevState => prevState + 1);
  };
  return html`
    <button onClick=${increment}>
      Count: ${count}
    </button>
  `;
};

const App = (props)=> {
  const click_test = () =>{
    console.log('test');
  }
  return html`<div>
  <label>Hello ${props.name}!</label>
  <button onClick=${click_test}>TEST</button>
  <${Counter}/> 
  </div>`;
}

render(html`<${App} name="World" />`, document.body);
*/