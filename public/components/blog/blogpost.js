/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

import van from "van";
import { Modal } from "vanjs-ui";
//import EditorJS from '/editorjs.js';

const {button, textarea, input, label, div, br, span, h1, p} = van.tags;

const BlogEL = () => {

  const isCreatePost = van.state(false);
  const blogs = van.state([]);
  const blogId = van.state('');
  const blogEditTitle = van.state('');
  const blogEditContent = van.state('');
  const blogsEL = div({id:'blogs'});

  async function get_blogs(){ 
    //console.log("post");
    try{
      const resp = await fetch('/api/blog');
      const data = await resp.json();
      //console.log(data);
      blogs.val = data;
    }catch(e){
      console.log("ERROR: ", e)
    }
  }

  get_blogs();

  async function blog_update(){
    console.log(blogId.val)
    console.log(blogEditTitle.val)
    console.log(blogEditContent.val)
    try{
      const resp = await fetch(`/api/blog/${blogId.val}`,{
        method:'PUT',
        headers:{
          'Content-Type':'application/json',
        },
        body:JSON.stringify({
          title:blogEditTitle.val,
          content:blogEditContent.val,
        })
      });
      const data = await resp.json();
      console.log(data);
      //blogs.val = data;
    }catch(e){
      console.log("ERROR: ", e)
    }
  }

  function setEditId(id){
    for(let _blog of blogs.val){
      if(_blog.id == id){
        console.log(_blog);
        blogId.val = _blog.id;
        //blogEditTitle.val = _blog.title;
        //blogEditContent.val = _blog.content;
        break;
      }
    }
  }

  const currentTitleEdit = van.derive(()=>{
    let text = ''
    for(let _blog of blogs.val){
      if(_blog.id == blogId.val){
        text = _blog.title;
        blogEditTitle.val = text;
        break;
      }
    }
    return text;
  });

  const currentContentEdit = van.derive(()=>{
    let text = ''
    for(let _blog of blogs.val){
      if(_blog.id == blogId.val){
        text = _blog.content;
        blogEditContent.val = text;
        break;
      }
    }
    return text;
  });
  
  async function delete_blog_id(id){
    const resp = await fetch(`/api/blog/${id}`,{
      method:'DELETE'
    })
    const data = await resp.json();
    console.log(data);
    if(data){
      if(data.api){
        if(data.api=='DELETE'){
          console.log('update delete???')
          let _blogs = blogs.val;
          _blogs.filter(item=>item.id != id);
          blogs.val = _blogs;

          document.getElementById(id).remove();
        }
      }
    }
  }

  van.derive(()=>{
    for(let _blog of blogs.val){
      console.log(_blog)
      van.add(blogsEL,div(
        {id:_blog.id},
        van.derive(()=>{
          if(blogId.val == _blog.id){
            return div(
              button({onclick:()=>blog_update()},`Update ID: ${_blog.id}`),
              br(),
              label('Title:'),
              br(),
              input({value:currentTitleEdit,oninput:e=>blogEditTitle.val=e.target.value }),
              br(),
              label('Content:'),
              br(),
              textarea({value:currentContentEdit,oninput:e=>blogEditContent.val=e.target.value }),
            )
          }else{
            return div(
              div({style:"",class:"cheader"},
                label(_blog.title),
                span({style:'float:right;'},
                  button({onclick:()=>delete_blog_id(_blog.id)},`Delete ID: ${_blog.id}`),
                  button({onclick:()=>setEditId(_blog.id )},`Edit ID: ${_blog.id}`),
                ),
              ),
              //br(),
              div({style:"min-height:40px;",class:"ccontent"},_blog.content),
            )
          }
        }),
      ))
    }
  })

  function btnCreateBlog(){
    isCreatePost.val = false;
    van.add(document.body, Modal({closed:isCreatePost},
      BlogPostEL({closed:isCreatePost})
    ));
  }

  return div({id:'blog'},
    div(
      label('[ Blog ]'),
      button({onclick:()=>btnCreateBlog()},`Create Blog`),
      div({id:'editorjs',style:"background:lightgray;"}),
      
    ),
    blogsEL,
  )
}

function BlogPostEL({closed}){

  const title = van.state('');
  const content = van.state('');

  async function bntCreatePost(){ 
    console.log("post")
    try{
      const resp = await fetch('/api/blog',{
        method:'POST',
        headers:{
          'Content-Type':'application/json',
        },
        body:JSON.stringify({
          title:title.val,
          content:content.val
        })
      })
      closed.val = true;
    }catch(e){
      console.log("ERROR: ", e)
    }
  }

  function clickClose(){
    console.log("close");
    closed.val = true;
  }

  return div({},
    label('New Blog:'),
    br(),
    label('Title:'),
    input({value:title, oninput:e=>title.val=e.target.value}),
    br(),
    label('Content:'),
    br(),
    textarea({style:"width:100%;height:200px;",value:content, oninput:e=>content.val=e.target.value}),
    br(),
    button({onclick:()=>bntCreatePost()},'Create'),
    button({onclick:()=>clickClose()},'Cancel'),
    
  );
}

export {
  BlogEL,
  //BlogPostEL
}