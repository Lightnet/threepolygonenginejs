
//import van from 'van';
import van from "vanjs-core";
import {
  aliasState,
  loginState
} from "/components/context.js";
const {button, div, pre, p} = van.tags
const button_test = ()=>{

  function testa(){
    console.log("aliasState.val: ", aliasState.val)
    aliasState.val = 'testa';
  }
  function testb(){
    console.log("aliasState.val: ", aliasState.val)
    aliasState.val = 'testb';
  }

  return div(
    button({onclick:testa},'testa'),
    button({onclick:testb},'testb'),
  )
}
export {
  button_test
}