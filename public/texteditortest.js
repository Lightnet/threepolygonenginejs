//import "https://cdn.jsdelivr.net/npm/@editorjs/editorjs@latest";

//import "https://cdn.jsdelivr.net/npm/quill@2.0.2/dist/quill.snow.css";
import "https://cdn.jsdelivr.net/npm/quill@2.0.2/dist/quill.js"; //tool

//import "https://cdn.jsdelivr.net/npm/quill@2.0.2/dist/quill.core.js"; //none

import { THREE, ECS, van } from "/dps.js";
// https://stackoverflow.com/questions/73053123/editor-js-how-to-add-unique-block-id-for-each-editor-element-as-id-attribute
// height

const {div, style, link, button} = van.tags;

van.add(document.body, link({href:"https://cdn.jsdelivr.net/npm/quill@2.0.2/dist/quill.snow.css", rel:"stylesheet"}));
//van.add(document.body, link({href:"https://cdn.jsdelivr.net/npm/quill@2.0.2/dist/quill.core.css", rel:"stylesheet"}));
const myeditor = div({id:'editor'},'test');

van.add(document.body, myeditor);

//console.log(Quill);
const toolbarOptions = ['bold', 'italic', 'underline', 'strike'];

const quill = new Quill('#editor', {
  theme: 'snow',
  modules: {
    //toolbar: true,
    toolbar: false,
    //toolbar: toolbarOptions
  },
});

let q_insert = {"ops":[{"insert":"asdasd\n\nasdasd\n\neee\n"}]}

//quill.setContents(q_insert);

function c_content(){
  let c = quill.getContents();
  console.log(c);
  console.log(JSON.stringify(c));

  console.log("quill.getText()");
  console.log(quill.getText());
}

function set_content(){
quill.setText(`Hello World
  test next line
  test 2 line
  test 3 line
`);
}


van.add(document.body, button({onclick:c_content},'content'));
van.add(document.body, button({onclick:set_content},'set content'));






// const myeditor = div({id:'editorjs',style:"border-style:solid;"});

// const editor = new EditorJS({
//   holder: 'editorjs',
//   minHeight: 30,
//   tools: {},
//   data: {}, 
// });

// van.add(document.body, style(`
//   .codex-editor__redactor{
//     padding-bottom:20px !important;
//   }
// `));
// <div class="codex-editor__redactor" style="padding-bottom: 300px;"><div class="ce-block" data-id="silFvONn24"><div class="ce-block__content"><div class="ce-paragraph cdx-block" contenteditable="true" data-placeholder-active="" data-empty="true"></div></div></div></div>

// van.add(document.body, myeditor);
// console.log("init editor");