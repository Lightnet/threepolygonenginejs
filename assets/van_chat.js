import van from "https://cdn.jsdelivr.net/gh/vanjs-org/van/public/van-1.2.1.min.js";
const {button, canvas, input, label, div, script, pre, p, ul, li, a} = van.tags;
import '/socket.io/socket.io.js';

van.add(document.body,div('hello'))

var socket = io();
console.log(socket)
socket.on('connect', function() {
  console.log('connect');
});
socket.on('disconnect', function() {
  console.log('disconnect');
});