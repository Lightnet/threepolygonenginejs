

//app.get('/page', (c) => {
  //const payload = c.get('jwtPayload')
  //console.log(payload)
  //const token = c.get('token')
  //console.log(token)
  //return c.text('You are authorized')
//})
//test
//app.get('/auth/page', (c) => {
  //const payload = c.get('jwtPayload')
  //console.log(payload)
  //return c.text('You are authorized')
//})

app.get('/setcookie', (c) => {
  setCookie(c, 'token', 'test',{
    httpOnly:true
  });
  return c.text('Hono!')
})

app.get('/getcookie', (c) => {
  const token = getCookie(c, 'token')
  console.log(token);
  return c.text('Hono!')
})

app.get('/delcookie', (c) => {
  deleteCookie(c, 'token')
  return c.text('Hono!')
})