import van from "https://cdn.jsdelivr.net/gh/vanjs-org/van/public/van-1.2.1.min.js";
const {button, input, label, div, br, textarea, script, ul, li, a} = van.tags;

const GameEL = () => {

  const view = van.state('entity');

  return div({id:'game'},
  div(
    button({onclick:()=>view.val='home'},'home'),
    button({onclick:()=>view.val='entity'},'entity'),
    button({onclick:()=>view.val='settings'},'settings'),
  ),
  van.derive(()=>{
    let _view = view.val;
    if(_view=='home'){
      return EntityEL();
    }
    if(_view=='entity'){
      return EntityEL();
    }
    if(_view=='settings'){
      return EntityEL();
    }
  }),
  label('END')
  )
}

function create_entity(){
  console.log('TEST');
}

const EntityEL = () => {

  const entities = van.state([]);

  const entityId = van.state('')
  const entityContent = van.state(`
  {
    "id":"0000",
    "gameObject":{
      "x":"0",
      "y":"0",
      "z":"0"
    }
  }
  `);

  return div(
    label('ID:'),
    input({
      value:entityId,
      oninput:e=>entityId.val=e.target.value
    }),
    br(),
    label('Data Content:'),
    br(),
    textarea({
      style:`width:600px;height:400px;`,
      value:entityContent,
      oninput:e=>entityContent.val=e.target.value
    }),
    br(),
    button({onclick:()=>create_entity()},'ADD')
  )
};

export{
  GameEL
}