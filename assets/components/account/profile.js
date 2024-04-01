import van from "van";
const {button, input, label, div, script, pre, p, ul, li, a} = van.tags;

const AccountEL = () => {
  return div({id:'account'},
  label('Account')
  )
}

export {
  AccountEL,
}
