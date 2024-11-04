// NODE SQLITE 
// https://www.sqlite.org/datatype3.html
/*
SQLite does not have a separate Boolean storage class. Instead, Boolean values are stored as integers 0 (false) and 1 (true).

*/

import Database from 'better-sqlite3';
import { nanoid } from '../helpers.js';

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

    this.create_table_report();

    this.create_table_project();
    this.create_table_project_config();
    this.create_table_scene();
    this.create_table_entity();
    this.create_table_script();

    this.create_table_message();


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

  async create_table_report(){
    await this.db.exec(`CREATE TABLE IF NOT EXISTS report (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      aliasId varchar(255),
      title varchar(255) NOT NULL,
      content varchar(255) NOT NULL,
      isdone BOOLEAN DEFAULT 0,
      isclose BOOLEAN DEFAULT 0,
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
      parentid varchar(64), 
      aliasId varchar(64),
      title varchar(255) NOT NULL,
      content varchar(255) NOT NULL,
      create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`);
  }

  async create_table_message(){
    await this.db.exec(`CREATE TABLE IF NOT EXISTS comment (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      parentid varchar(64), 
      aliasId varchar(64),
      toAlias varchar(64),
      subject varchar(255) NOT NULL,
      content varchar(255) NOT NULL,
      create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`);
  }
//===============================================
// GAME
//===============================================
  async create_table_entity(){
    await this.db.exec(`CREATE TABLE IF NOT EXISTS entity (
      id varchar(64) PRIMARY KEY,
      parentid varchar(64),
      aliasId varchar(64),
      name varchar(255) NOT NULL,
      content text NOT NULL,
      create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`);
  }

  async create_table_scene(){
    await this.db.exec(`CREATE TABLE IF NOT EXISTS scene (
      id varchar(64) PRIMARY KEY,
      parentid varchar(64),
      aliasId varchar(64),
      name varchar(255) NOT NULL,
      content text,
      create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`);
  }

  async create_table_project(){
    await this.db.exec(`CREATE TABLE IF NOT EXISTS project (
      id varchar(64) PRIMARY KEY,
      aliasId varchar(255),
      name varchar(255) NOT NULL,
      content text,
      ispublic BOOLEAN DEFAULT 0,
      create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`);
  }

  async create_table_project_config(){
    await this.db.exec(`CREATE TABLE IF NOT EXISTS project_config (
      id varchar(64) PRIMARY KEY,
      parentid varchar(64),
      aliasId varchar(255),
      _key varchar(255) NOT NULL,
      _value text,
      create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`);
  }

  async create_table_script(){
    await this.db.exec(`CREATE TABLE IF NOT EXISTS script (
      id varchar(64) PRIMARY KEY,
      parentid varchar(64),
      aliasId varchar(64),
      name varchar(255) NOT NULL,
      content text,
      ispublic BOOLEAN DEFAULT 0,
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
// REPORT
//===============================================
create_message(_aliasid, _toalias, _title,_content){
  const stmt = this.db.prepare('INSERT INTO message (title, content) VALUES (?, ?)');
  stmt.run(_title, _content);
  return {api:"CREATED"};
}

get_messages(){
  let stmt = this.db.prepare(`SELECT * FROM message;`);
  const result = stmt.all();
  //console.log(result);
  return result;
}

delete_message(_id){
  try{
    const stmt = this.db.prepare('DELETE FROM message WHERE id=?')
    stmt.run(_id);
    return {api:'DELETE'};
  }catch(e){
    return {api:'DBERROR'};
  }
}
//===============================================
// REPORT
//===============================================
  create_report(_title,_content){
    const stmt = this.db.prepare('INSERT INTO report (title, content) VALUES (?, ?)');
    stmt.run(_title, _content);
    return {api:"CREATED"};
  }

  get_reports(){
    let stmt = this.db.prepare(`SELECT * FROM report;`);
    const result = stmt.all();
    //console.log(result);
    return result;
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
  create_entity(_name,_content){
    let uuid = nanoid();
    const stmt = this.db.prepare('INSERT INTO entity (id, name, content) VALUES (?, ?, ?)');
    stmt.run(uuid, _name, _content);
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
