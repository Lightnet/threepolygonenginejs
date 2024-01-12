import van from "https://cdn.jsdelivr.net/gh/vanjs-org/van/public/van-1.2.1.min.js"
const {button, input, label, div, script, pre, p, ul, li, a, table, tbody, tr,td} = van.tags;

async function useFetch(url, option){
  try {
    let options = option || {};
    options.headers={
      'Content-Type':'application/json',
    };
    const rep = await fetch(url, options);
    const data = await rep.json();
    return data;
  } catch (error) {
    console.log(error);
    return {api:'ERROR'};
  }
}

const ForumPageEL = () => {

  const isFourm = van.state(false);
  const forumID = van.state('');

  return div({id:'forum'},
  label('Forum'),
  //BoardEL()
  createForumEL(),
  getForumsEL,
  )
}

const getForumsEL = () => {

  const forumList = div();

  function editForum(id){
    console.log(id)
  }

  function deleteForum(id){

  }

  async function getForums(){
    try{
      const data = await useFetch('/api/forum');
      console.log(data);
      if(data){
        for(let i=0; i < data.length;i++){
          van.add(forumList,
            div(
              div({style:'background-color:lightblue;'},
                label(data[i].title),
                button({onclick:editForum(data[i].id)},'edit'),
              ),
              div(data[i].content),
            )
          );
        }
      }
    }catch(e){
      console.log(e);
    }
  }

  getForums();

  return div(forumList);
}

const createForumEL = () => {

  const forumTitle = van.state('test');
  const forumContent = van.state('test');

  async function c_createForum(){
    console.log("create forum")
    
    try{
      const data = await useFetch('/api/forum',{
        method:'POST',
        body:JSON.stringify({
          title:forumTitle.val,
          content:forumContent.val,
        })
      });
      console.log(data);
    }catch(e){

    }
    
  }

  return div({id:'createForum'},
  table(
    tbody(
      tr(
        td(label('Title:')),
        td(input({value:forumTitle, oninput:e=>forumTitle.val=e.target.value})),
      ),
      tr(
        td(label('Content:')),
        td(input({value:forumContent, oninput:e=>forumContent.val=e.target.value})),
      ),
      tr(
        button({onclick:c_createForum},'Create'),
        button('Cancel'),
      )
    )
  )
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