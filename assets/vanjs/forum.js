import van from "https://cdn.jsdelivr.net/gh/vanjs-org/van/public/van-1.2.1.min.js"
const {button, input, label, div, script, pre, p, ul, li, a} = van.tags;


const ForumPageEL = () => {

  return div({id:'forum'},
  label('Forum'),
  BoardEL()
  )
}


const ForumEL = () => {
  return div({id:'forum'},
  label('Forum'),
  )
}

const BoardEL = () => {

  return div(
    div(
      label('Board')
    ),
    div(
      label('Content')
    )
  )
}

const TopicEL = () => {

  return div(

  )
}

const CommentEL = () => {

  return div(

  )
}

export {
  ForumEL,
  ForumPageEL
}