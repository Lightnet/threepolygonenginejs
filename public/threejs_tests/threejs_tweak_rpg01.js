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
  count:0,
};


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

// https://tweakpane.github.io/docs/monitor-bindings/
pane.addBinding(PARAMS, 'count',{
  interval: 100,
  view: 'graph',
  readonly: true,
});



function update(){
  PARAMS.count++;
  //console.log(PARAMS.count);
  if(PARAMS.count>30){
    PARAMS.count=0
  }
  requestAnimationFrame(update)
}
update();