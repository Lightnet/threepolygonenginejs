

// https://codepen.io/shshaw/pen/vKzoLL
// https://stackoverflow.com/questions/19126432/rotate-a-div-using-javascript

console.log("CLIP TEST");
//import RAPIER from 'https://cdn.skypack.dev/@dimforge/rapier3d-compat';
import van from "https://cdn.jsdelivr.net/npm/vanjs-core@1.5.2/src/van.min.js";
//import { FloatingWindow } from "https://cdn.jsdelivr.net/npm/vanjs-ui@0.10.1/dist/van-ui.min.js";
//import * as THREE from 'https://unpkg.com/three@0.170.0/build/three.module.js';
//import { OrbitControls } from 'https://unpkg.com/three@0.170.0/examples/jsm/controls/OrbitControls.js'
//import { GUI } from 'https://unpkg.com/three@0.170.0/examples/jsm/libs/lil-gui.module.min.js';
const {div, button, style} = van.tags;
let timerId;

/*
rotated  {
  -webkit-transform : rotate(0deg); 
  -moz-transform : rotate(180deg); 
  -ms-transform : rotate(180deg); 
  -o-transform : rotate(180deg); 
  transform : rotate(180deg); 
}

*/

const cssFlipCard = style(`
.card {
   #border: 2px solid black;
   width: 120px;
   height: 150px;
   position: relative;
   transform-style: preserve-3d;
   -webkit-transition: 1s ease;
   --moz-transition: 1s ease;
   -o-transition: 1s ease;
   transition: 1s ease;
}

.card:hover {
  transform: rotateY(180deg);
}

.rotated {
  -webkit-transform : rotateY(180deg); 
  -moz-transform : rotateY(180deg); 
  -ms-transform : rotateY(180deg); 
  -o-transform : rotateY(180deg); 
  transform : rotateY(180deg); 
}

.card_front,
.card_back {
   position: absolute;
   height: 100%;
   width: 100%;
   border-radius: 6px;
   backface-visibility: hidden;


   /* Just styling the text nicely */
   line-height: 150px;
   font-family: sans-serif;
   font-size: 20px;
   text-align: center;
}

.card_front {
   background-color: yellow;
   z-index:1;
}

.card_back {
   background-color: pink;
   transform: rotateY(180deg);
}


  `)

const card = div({class:"card"},
  div({class:"card_front"},'Front'),
  div({class:"card_back"},'Back'),
)

function c_toggle(){
  console.log('c_toggle');
  //card.class.toggle('toggle')
  //document.getElementById('card').classList.toggle('rotated');
  card.classList.toggle('rotated')
}

function setup_flip(){
  van.add(document.head,cssFlipCard);
  van.add(document.body,card);
  van.add(document.body,button({onclick:c_toggle},'toggle'));
}

setup_flip();
