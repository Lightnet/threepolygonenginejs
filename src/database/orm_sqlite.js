// NODE | BUN SQLITE 

import { drizzle } from 'drizzle-orm/better-sqlite3';
import { eq, sql } from "drizzle-orm";
import { blogs, forums, users } from './schema.js';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';

import Database from 'better-sqlite3';

//note use drizzle-orm

// https://orm.drizzle.team/docs/rqb
// https://orm.drizzle.team/docs/column-types/sqlite
// https://github.com/drizzle-team/drizzle-orm/blob/main/drizzle-orm/src/sqlite-core/README.md
// 

// import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";
// https://www.propelauth.com/post/drizzle-an-orm-that-lets-you-just-write-sql
// https://orm.drizzle.team/kit-docs/conf
// npm i -D drizzle-kit

//note use this to create table
// npm exec drizzle-kit generate:sqlite --out migrations --schema src/database/schema.js

//orm sqlite
class ORMSQLITE{

  static db = null;
  sqlite = null;
  constructor(){

    this.initDB();

    return this;
  }

  initDB(){

    this.sqlite = new Database('database_orm.sqlite');
    this.db = drizzle(this.sqlite);
    // this will automatically run needed migrations on the database
    migrate(this.db, { migrationsFolder: './drizzle' });
  }

  user_exist(_alias){
    let result = this.db.select().from(users).where(eq(users.alias, _alias)).get();
    //console.log(result);
    return result;
  }

  user_create(_alias,_passphrase){
    try {
      let result = this.db.insert(users).values({
        alias:_alias,
        passphrase:_passphrase
      })
      .run();
      console.log(result);
      if(result){
        return {api:'CREATED'}
      }else{
        return {api:'NULL'}
      }
    } catch (error) {
      return {api:'ERROR'}
    }
  }

  user_signin(_alias,_passphrase){
    try {
      let result = this.db.select().from(users).where(eq(users.alias, _alias)).get();
      console.log(result);
      //return result;
      
      if(result){
        if(_passphrase == result.passphrase){
          return {api:"PASS"};
        }else{
          return {api:"DENIED"};
        }
      }else{
        return {api:"NONEXIST"};
      }
    } catch (error) {
      return {api:"ERROR"};
    }
  }

  blog_create(_title,_content){
    try{
      let result = this.db.insert(blogs).values({
        title:_title,
        content:_content
      })
      .run();
      console.log("result");
      console.log(result);
      if(result){
        return {api:'CREATED'}
      }else{
        return {api:'NULL'}
      }
    }catch(e){
      return {api:'DBERROR'};
    }
  }

  get_blogs(){
    try{
      let result = this.db.select().from(blogs).all();
      return result;
    }catch(e){
      return {api:'DBERROR'};
    }
  }

  blog_delete(_id){
    try{
      let result = this.db.delete(blogs)
        .where(eq(blogs.id, _id))
        .run();
        console.log(result);
      return {api:'DELETE'};
    }catch(e){
      return {api:'DBERROR'};
    }
  }

  blog_update(_id,_title,_content){
    try{
      let result = this.db.update(blogs).set({
        title:_title,
        content:_content
      })
      .where(eq(blogs.id, _id))
      .run();
      //console.log(result);
      if(result){
        
        return {api:'UPDATE'};
      }else{
        return {api:'ERROR'};
      }
    }catch(e){
      return {api:'DBERROR'};
    }
  }

  get_forums(){
    try{
      let result = this.db.select().from(forums).all();
      return result;
    }catch(e){
      return {api:'DBERROR'};
    }
  }

  forum_create(_title,_content){
    try{
      let result = this.db.insert(forums).values({
        title:_title,
        content:_content
      })
      .run();
      console.log("result");
      console.log(result);
      return {api:"CREATED"};
    }catch(e){
      return {api:'DBERROR'};
    }
  }

  forum_delete(_id){
    try{
      let result = this.db.delete(forums)
        .where(eq(blogs.id, _id))
        .run();
        console.log(result);
      return {api:'DELETE'};
    }catch(e){
      return {api:'DBERROR'};
    }
  }

  forum_update(_id,_title,_content){
    try{

      let result = this.db.update(blogs).set({
        title:_title,
        content:_content
      })
      .where(eq(blogs.id, _id))
      .run();
      
      if(result){
        return {api:'UPDATE'};
      }else{
        return {api:'ERROR'};
      }
    }catch(e){
      console.log(e)
      return {api:'DBERROR'};
    }
  }

}

export {
  ORMSQLITE
}