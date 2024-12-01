

import van from "https://cdn.jsdelivr.net/npm/vanjs-core@1.5.2/src/van.min.js";
import { Pane } from 'https://cdn.jsdelivr.net/npm/tweakpane@4.0.5/dist/tweakpane.min.js';
const {div,style} = van.tags;

const myStyle = style(`
  /* Default wrapper view */
  .yourCustomContainer .tp-dfwv {
    min-width: 360px;
  }   
  `);
van.add(document.body,myStyle)

const PARAMS = {
  factor: 123,
  title: 'hello',
  color: '#ff0055',
  percentage: 50,
  theme: 'dark',
  size:8,
  text:'text',
};

const pane = new Pane({
  title: 'Parameters',
  expanded: true,
});

pane.addBinding(PARAMS, 'factor');
pane.addBinding(PARAMS, 'title');
pane.addBinding(PARAMS, 'color');

// `min` and `max`: slider
pane.addBinding(
  PARAMS, 'percentage',
  {min: 0, max: 100, step: 10}
);


const divPane = div({style:`position:fixed;top:0px;left:0px;`,class:'yourCustomContainer'})
van.add(document.body,divPane)
const pane0 = new Pane({
  title: 'Parameters',
  container:divPane,
  expanded: true,
});


pane0.addButton({
  title: 'test',
  //label: 'counter',   // optional
}).on('click', () => {
  console.log('test')
});

// `options`: list
pane.addBinding(
  PARAMS, 'theme',
  {options: {Dark: 'dark', Light: 'light'}}
);

const f = pane.addFolder({
  title: 'Title',
  expanded: true,
});

// f.addBinding(PARAMS, 'text');
f.addBinding(PARAMS, 'size');

const b = pane.addBinding(
  PARAMS, 'size',
  {min: 8, max: 100, step: 1}
);

b.on('change', function(ev) {
  console.log(`change: ${ev.value}`);
});


// const pane2 = new Pane({
//   title: 'Parameters2',
//   expanded: true,
  
// });