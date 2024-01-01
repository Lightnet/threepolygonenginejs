import Database from 'better-sqlite3';

class SQLDB{

  static db = null;

  constructor(){
    this.initDB();
    //this.blog_create_table()
    //this.forum_create_table()
    return this;
  }

  initDB(){
    if (this.db == null){
      //console.log("init DB")
      this.db = new Database('database.sqlite', { 
        //verbose: console.log 
      });
    }
  }

  async user_create_table(){
    await this.db.exec(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      alias varchar(255) NOT NULL,
      passphrase varchar(255) NOT NULL,
      create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`);
  }

  async blog_create_table(){
    await this.db.exec(`CREATE TABLE IF NOT EXISTS blog (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      aliasId varchar(255),
      title varchar(255) NOT NULL,
      content varchar(255) NOT NULL,
      create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`);
  }

  async forum_create_table(){
    await this.db.exec(`CREATE TABLE IF NOT EXISTS forum (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      aliasId varchar(255),
      title varchar(255) NOT NULL,
      content varchar(255) NOT NULL,
      create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`);
  }
  //
  async user_delete_table(){
    await this.db.exec(`DROP TABLE users;`);
  }
  //
  user_exist(_alias){
    let stmt = this.db.prepare(`SELECT * FROM users WHERE alias = ?`)
    const userExist = stmt.get(_alias);
    return userExist;
  }
  //
  user_create(_alias,_passphrase){
    const stmt = this.db.prepare('INSERT INTO users (alias, passphrase) VALUES (?, ?)');
    stmt.run(_alias, _passphrase);
    return {api:"CREATED"};
  }
  //need to return token
  user_signin(_alias,_passphrase){
    let stmt = this.db.prepare(`SELECT * FROM users WHERE alias = ?`);
    const userExist = stmt.get(_alias);
    if(userExist){
      if(_passphrase == userExist.passphrase){
        return {api:"PASS"};
      }else{
        return {api:"DENIED"};
      }
    }else{
      return {api:"NONEXIST"};
    }
  }

  blog_create(_title,_content){
    const stmt = this.db.prepare('INSERT INTO blog (title, content) VALUES (?, ?)');
    stmt.run(_title, _content);
    return {api:"CREATED"};
  }

  get_blogs(){
    let stmt = this.db.prepare(`SELECT * FROM blog;`);
    const result = stmt.all();
    //console.log(result);
    return result;
  }

  blog_delete(_id){
    try{
      const stmt = this.db.prepare('DELETE FROM blog WHERE id=?')
      stmt.run(_id);
      return {api:'DELETE'};
    }catch(e){
      return {api:'DBERROR'};
    }
  }

  blog_update(_id,_title,_content){
    try{
      const stmt = this.db.prepare('UPDATE blog SET title=?, content=? WHERE id=?;')
      stmt.run(_title, _content, _id);
      return {api:'UPDATE'};
    }catch(e){
      console.log(e)
      return {api:'DBERROR'};
    }
  }


  //=============================================
  // FORUM
  get_forums(){
    let stmt = this.db.prepare(`SELECT * FROM forum;`);
    const result = stmt.all();
    //console.log(result);
    return result;
  }

  forum_create(_title,_content){
    const stmt = this.db.prepare('INSERT INTO forum (title, content) VALUES (?, ?)');
    stmt.run(_title, _content);
    return {api:"CREATED"};
  }

  forum_delete(_id){
    try{
      const stmt = this.db.prepare('DELETE FROM forum WHERE id=?')
      stmt.run(_id);
      return {api:'DELETE'};
    }catch(e){
      return {api:'DBERROR'};
    }
  }

  forum_update(_id,_title,_content){
    try{
      const stmt = this.db.prepare('UPDATE forum SET title=?, content=? WHERE id=?;')
      stmt.run(_title, _content, _id);
      return {api:'UPDATE'};
    }catch(e){
      console.log(e)
      return {api:'DBERROR'};
    }
  }


  //===================================
  // entity
  //===================================
  //
  entity_create(_title,_content){
    const stmt = this.db.prepare('INSERT INTO entity (title, content) VALUES (?, ?)');
    stmt.run(_title, _content);
    return {api:"CREATED"};
  }

  get_entities(){
    let stmt = this.db.prepare(`SELECT * FROM entity;`);
    const result = stmt.all();
    //console.log(result);
    return result;
  }

  entity_delete(_id){
    try{
      const stmt = this.db.prepare('DELETE FROM entity WHERE id=?')
      stmt.run(_id);
      return {api:'DELETE'};
    }catch(e){
      return {api:'DBERROR'};
    }
  }

  entity_update(_id,_title,_content){
    try{
      const stmt = this.db.prepare('UPDATE entity SET title=?, content=? WHERE id=?;')
      stmt.run(_title, _content, _id);
      return {api:'UPDATE'};
    }catch(e){
      console.log(e)
      return {api:'DBERROR'};
    }
  }
}

export default SQLDB;
// https://github.com/honojs/middleware/tree/main/packages/hello
// https://github.com/honojs/middleware
export function useDB(options){
  //console.log('config db???');
  //console.log(options);
  let _db;
  if(options){
    if(options.db){
      _db = options.db;
    }
  }

  return async (c, next) => {
    //console.log('set db???')
    c.set('db',_db)
    await next();
  }
}