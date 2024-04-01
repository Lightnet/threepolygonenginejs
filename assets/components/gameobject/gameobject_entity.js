
import van from "van";
const {button, input, label, div, br, textarea, script, ul, li, a} = van.tags;

const GameObjectEntity = () => {

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

export {
  GameObjectEntity
}