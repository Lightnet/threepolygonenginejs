import van from "https://cdn.jsdelivr.net/gh/vanjs-org/van/public/van-1.2.1.min.js"
import { waitForElement } from "./helper.js";
//import EditorJS from '/editorjs.js';

const {button, textarea, input, label, div, br, h1, p} = van.tags;

const BlogEL = () => {
  const isBlogPost = van.state(false);
  
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
              div(
                button({onclick:()=>delete_blog_id(_blog.id)},`Delete ID: ${_blog.id}`),
                button({onclick:()=>setEditId(_blog.id )},`Edit ID: ${_blog.id}`),
              ),
              div({style:"background:darkgray;"},_blog.title),
              //br(),
              div({style:"background:lightgray;"},_blog.content),
            )
          }
        }),
      ))
    }
  })


  //waitForElement("#editorjs", 3000).then(function(){
    //alert("element is loaded.. do stuff");
    //loadEditor();
  //}).catch(()=>{
    //alert("element did not load in 3 seconds");
  //});

  function toggleBlog(){
    console.log(isBlogPost.val);
    if(isBlogPost.val==true){
      isBlogPost.val=false;
    }else{
      isBlogPost.val=true;
    }
  }

  //const isBlogText = van.derive(()=>String(isBlogPost.val))
  const isBlogText = 'test'

  function onClose(){
    console.log("CLOSE RIGHT?")
    isBlogPost.val=false
  }

  //console.log(editor);
  return div({id:'blog'},
    div(
      label('Blog'),
      div({id:'editorjs',style:"background:lightgray;"}),
      button({onclick:()=>toggleBlog()},`Toggle Post`),
      //button({onclick:()=>postBlog()},'Post Blog'),
    ),
    label('test blog'),
    div(
      van.derive(()=>{
        //console.log(isBlogPost.val)
        let el = null;
        if(isBlogPost.val){
          console.log("new blog???")
          //el = label('test my blog');
          el = BlogPostEL({onClose:onClose});
        }else{
          el = label('None');
        }
        console.log(el)
        return el;
      }),
    ),
    blogsEL,
  )
}

//van.add(document.body, BlogEL())

const BlogPostEL = ({onClose}) =>{

  const title = van.state('');
  const content = van.state('');

  async function click_post(){ 
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
    }catch(e){
      console.log("ERROR: ", e)
    }
  }

  function delete_post(){

  }

  function edit_post(){

  }

  function click_close(){
    console.log("close")
    if(typeof onClose == 'function'){
      onClose();
    }
  }

  return div({},
    label('New Blog:'),
    br(),
    label('Title:'),
    input({value:title, oninput:e=>title.val=e.target.value}),
    br(),
    label('Content:'),
    br(),
    textarea({value:content, oninput:e=>content.val=e.target.value}),
    br(),
    button({onclick:()=>click_post()},'Create Post'),
    button({onclick:()=>click_close()},'Close Post'),
    
  );
}

export {
  BlogEL,
  BlogPostEL
}