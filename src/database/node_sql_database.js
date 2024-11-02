// NODE SQLITE 

import Database from 'better-sqlite3';

//sqlite
class SQLDB{

  static db = null;

  constructor(){
    this.initDB();
    this.create_table_blog();
    this.create_table_forum();
    this.create_table_board();
    this.create_table_topic();
    this.create_table_comment();
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

  async create_table_user(){
    await this.db.exec(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      alias varchar(255) NOT NULL,
      passphrase varchar(255) NOT NULL,
      create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`);
  }

  async create_table_blog(){
    await this.db.exec(`CREATE TABLE IF NOT EXISTS blog (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      aliasId varchar(255),
      title varchar(255) NOT NULL,
      content varchar(255) NOT NULL,
      create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`);
  }

  async create_table_forum(){
    await this.db.exec(`CREATE TABLE IF NOT EXISTS forum (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      aliasId varchar(255),
      title varchar(255) NOT NULL,
      content varchar(255) NOT NULL,
      create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`);
  }

  async create_table_board(){
    await this.db.exec(`CREATE TABLE IF NOT EXISTS board (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      parentid varchar(255), 
      aliasId varchar(255),
      title varchar(255) NOT NULL,
      content varchar(255) NOT NULL,
      create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`);
  }

  async create_table_topic(){
    await this.db.exec(`CREATE TABLE IF NOT EXISTS topic (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      parentid varchar(255), 
      aliasId varchar(255),
      title varchar(255) NOT NULL,
      content varchar(255) NOT NULL,
      create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`);
  }

  async create_table_comment(){
    await this.db.exec(`CREATE TABLE IF NOT EXISTS comment (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      parentid varchar(255), 
      aliasId varchar(255),
      title varchar(255) NOT NULL,
      content varchar(255) NOT NULL,
      create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`);
  }

  async entity_create_table(){
    await this.db.exec(`CREATE TABLE IF NOT EXISTS entity (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      aliasId varchar(255),
      name varchar(255) NOT NULL,
      content text NOT NULL,
      create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`);
  }

  async scene_create_table(){
    await this.db.exec(`CREATE TABLE IF NOT EXISTS scene (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      aliasId varchar(255),
      name varchar(255) NOT NULL,
      content text,
      create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`);
  }

//===============================================
// USER
//===============================================
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

//===============================================
// BLOG
//===============================================
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

//===============================================
// FORUM
//===============================================
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
  // https://github.com/WiseLibs/better-sqlite3/blob/master/docs/api.md
  get_forumID(_id){
    try{
      let stmt = this.db.prepare(`SELECT * FROM board WHERE parentid=?;`);
      //stmt.run(_id);
      //const result = stmt.all();

      const result = stmt.all(_id);
      console.log(result);
      return result;
      //return {api:'PK'};
    }catch(e){
      console.log(e)
      return {api:'DBERROR'};
    }
  }
//===============================================
// BOARD
//===============================================
  get_boards(){
    let stmt = this.db.prepare(`SELECT * FROM board;`);
    const result = stmt.all();
    //console.log(result);
    return result;
  }

  get_boardID(_id){
    let stmt = this.db.prepare(`SELECT * FROM topic WHERE parentid=?;`);
    const result = stmt.all(_id);
    //console.log(result);
    return result;
  }

  board_create(_parentid,_title,_content){
    let id = _parentid + '';
    const stmt = this.db.prepare('INSERT INTO board (parentid, title, content) VALUES (?, ?, ?)');
    stmt.run(id,_title, _content);
    return {api:"CREATED"};
  }

  board_delete(_id){
    try{
      const stmt = this.db.prepare('DELETE FROM board WHERE id=?')
      stmt.run(_id);
      return {api:'DELETE'};
    }catch(e){
      return {api:'DBERROR'};
    }
  }

  board_update(_id,_title,_content){
    try{
      const stmt = this.db.prepare('UPDATE board SET title=?, content=? WHERE id=?;')
      stmt.run(_title, _content, _id);
      return {api:'UPDATE'};
    }catch(e){
      console.log(e)
      return {api:'DBERROR'};
    }
  }
//===================================
// FORUM TOPIC
//===================================
  create_topic(_parentid,_title,_content){
    let id = _parentid + '';
    const stmt = this.db.prepare('INSERT INTO topic (parentid, title, content) VALUES (?, ?, ?)');
    stmt.run(id,_title, _content);
    return {api:"CREATED"};
  }

  get_TopicID(_id){
    let stmt = this.db.prepare(`SELECT * FROM comment WHERE parentid=?;`);
    const result = stmt.all(_id);
    //console.log(result);
    return result;
  }
//===================================
// FORUM COMMENT
//===================================
  create_comment(_parentid,_title,_content){
    let id = _parentid + '';
    const stmt = this.db.prepare('INSERT INTO comment (parentid, title, content) VALUES (?, ?, ?)');
    stmt.run(id,_title, _content);
    return {api:"CREATED"};
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
