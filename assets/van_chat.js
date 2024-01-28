// testing chat message

import van from "https://cdn.jsdelivr.net/gh/vanjs-org/van/public/van-1.2.1.min.js";
const {button, canvas, input, label, div} = van.tags;
import '/socket.io/socket.io.js';

var socket = io();
console.log(socket)
socket.on('connect', function() {
  console.log('connect');
});
socket.on('disconnect', function() {
  console.log('disconnect');
});


//van.add(document.body,div('hello'))

const ChatUIEL = ()=>{

  const chatmessages = van.state('');

  function InputChatType(e){
    chatmessages.val=e.target.value;
    //console.log("E",e);
  }

  function InputChatEnter(e){
    //console.log(e)
    console.log(e.code)
    if(e.code == "Enter"){
      console.log(chatmessages.val)
      if(chatmessages.val == "/creategame"){
        socket.emit("api",{action:"creategame"});
      }
      if(chatmessages.val == "/reset"){
        socket.emit("api",{action:"reset"});
      }

      if(chatmessages.val == "/echo"){
        socket.emit("api",{action:"echo"});
      }
    }
  }


  return div({},
    div({style:`width:200px;height:200px;`}),
    div(
      input({value:chatmessages,oninput:e=>InputChatType(e),onkeyup:e=>InputChatEnter(e)}),
      button({},'Send')
    ),
  )
}

van.add(document.body,ChatUIEL)