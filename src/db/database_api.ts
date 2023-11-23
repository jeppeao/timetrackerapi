
import loadEnvironment from "./../util/loadEnvironment.js";
import pg from "pg";
const { Pool } = pg;


loadEnvironment();


interface Userdata {
  user_id: number,
  user_name: string,
  password: string
}


const createPool = (
  user: string,
  host: string,
  database: string,
  password: string,
  port: string
) => {

  return new Pool({
    user,
    host,
    database,
    password, 
    port: parseInt(port)
  });
}

const pool = createPool(
  process.env.DB_USER || 'undefined_user',
  process.env.DB_HOST || 'undefined_host',
  process.env.DB_NAME || 'undefined_dbname',
  process.env.DB_PASSWORD || 'undefined_password',
  process.env.DB_PORT || 'undefined_port',
);

const setupTables = async ( ) => {
  const users = await new Promise((resolve, reject) => {
    pool.query(`CREATE TABLE IF NOT EXISTS users(
      user_id SERIAL PRIMARY KEY,
      user_name TEXT UNIQUE,
      password TEXT
    );`,
    (error, results) => {
      if (error) {
        reject(error);
      }
      resolve(results);
    });
  });

  const tags = await new Promise((resolve, reject) => {
    pool.query(`CREATE TABLE IF NOT EXISTS tags(
      tag_id SERIAL PRIMARY KEY,
      name TEXT,
      user_id INT,
      CONSTRAINT fk_user
        FOREIGN KEY(user_id)
          REFERENCES users(user_id)
          ON DELETE CASCADE
    );`,
      (error, results) => {
        if (error) {
          reject(error);
        }
        resolve(results);
      });
  });

  const blocks = await new Promise((resolve, reject) => {
    pool.query(`CREATE TABLE IF NOT EXISTS blocks(
      block_id SERIAL PRIMARY KEY,
      start_time TIMESTAMPTZ,
      end_time TIMESTAMPTZ,
      user_id INT,
      CONSTRAINT fk_user
        FOREIGN KEY(user_id)
          REFERENCES users(user_id)
          ON DELETE CASCADE
    );`,
      (error, results) => {
        if (error) {
          reject(error);
        }
        resolve(results);
      });
  });

  const blockTags = await new Promise((resolve, reject) => {
    pool.query(`CREATE TABLE IF NOT EXISTS blocktags(
      blocktag_id SERIAL PRIMARY KEY,
      block_id INT,
      tag_id INT,
      CONSTRAINT fk_block_id
        FOREIGN KEY(block_id)
          REFERENCES blocks(block_id)
          ON DELETE CASCADE,
      CONSTRAINT fk_tag_id
        FOREIGN KEY(tag_id)
          REFERENCES tags(tag_id)
          ON DELETE CASCADE
    );`,
      (error, results) => {
        if (error) {
          reject(error);
        }
        resolve(results);
      });
  });

  return Promise.all([users, tags, blocks, blockTags])
}

const createUser = (
  body: {user: string, password: string}
) => {
  return new Promise(function(resolve, reject) {
    const { user, password } = body;
    pool.query(`INSERT INTO users (user_name, password) VALUES ($1, $2) RETURNING *`, 
      [user, password], (error, results) => {
        if (error) {
          reject(error);
        }
        resolve(`new user created: ${results.rows[0]}`);
      });
  });
}

const getUser = (user: string): Promise<Userdata> => {
  return new Promise(function(resolve, reject) {
    pool.query(`SELECT * FROM users where user_name = $1`, 
      [user], (error, results) => {
        if (error) {
          reject(error);
        }
        resolve(results.rows[0] as Userdata);
      });
  });
}

const deleteUser = (user: string) => {
  return new Promise(function(resolve, reject) {
    pool.query(`DELETE FROM users WHERE user_name = $1 RETURNING *`, 
      [user], (error, results) => {
        if (error) {
          reject(error);
        }
        resolve(`user deleted: ${results.rows[0]}`);
      });
  });
}

const getPassword = (user: string) => {
  return new Promise(function(resolve, reject) {
    pool.query(`SELECT password FROM users WHERE user_name = $1`, 
      [user], (error, results) => {
        if (error) {
          reject(error);
        }
        resolve(results.rows[0]);
      });
  });
}

const setPassword = (body: {user: string, newPwd:string}) => {
  const { user, newPwd } = body;
  return new Promise(function(resolve, reject) {
    pool.query(`UPDATE users SET password = $2 WHERE user_name = $1`, 
      [user, newPwd], (error, results) => {
        if (error) {
          reject(error);
        }
        resolve(results.rows[0]);
      });
  });
}

const createBlock = async (
  body: {username: string, startTime: Date, endTime: Date }
  ) => {
  const { username, startTime, endTime } = body;
  const userID = (await getUser(username)).user_id;
  return new Promise(function(resolve, reject) {
    pool.query(
      `INSERT INTO blocks (user_id, start_time, end_time) 
       VALUES ($1, $2, $3) 
       RETURNING *`,
      [userID, startTime, endTime], (error, results) => {
        if (error){
          reject(error);
        } 
        resolve(results);
      });
  }); 
}

const getUserBlocks = async (body: {username:string, from: Date, to: Date}) => {
  const { username, from, to } = body;
  const userID = (await getUser(username)).user_id;
  const query = 
    `SELECT block_id, start_time, end_time 
     FROM blocks
     WHERE user_id = $1
     AND start_time >= $2
     AND end_time <= $3
     `;
  return new Promise(function(resolve, reject) {
    pool.query(query, [userID, from, to], (error, results) => {
      if (error){
        reject(error);
      } 
      resolve(results.rows);
    });
  }); 
}

const createTag = async (
  body: {username: string, name: string }
  ) => {
  const { username, name } = body;
  const userID = (await getUser(username)).user_id;
  return new Promise(function(resolve, reject) {
    pool.query(
      `INSERT INTO tags (user_id, name) 
       VALUES ($1, $2) 
       RETURNING *`,
      [userID, name], (error, results) => {
        if (error){
          reject(error);
        } 
        resolve(results);
      });
  }); 
}

const getUserTags = async (body: { username:string }) => {
  const { username } = body;
  const userID = (await getUser(username)).user_id;
  const query = 
    `SELECT name, tag_id 
     FROM tags
     WHERE user_id = $1
     `;
  return new Promise(function(resolve, reject) {
    pool.query(query, [userID], (error, results) => {
      if (error){
        reject(error);
      } 
      resolve(results.rows);
    });
  }); 
}

const createBlocktag = async (
  body: {tagID: string, blockID: string }
  ) => {
  const { tagID, blockID } = body;
  return new Promise(function(resolve, reject) {
    pool.query(
      `INSERT INTO tags (tag_id, block_id) 
       VALUES ($1, $2) 
       RETURNING *`,
      [tagID, blockID], (error, results) => {
        if (error){
          reject(error);
        } 
        resolve(results);
      });
  }); 
}

const getBlockTags = async (body: { blockID: number }) => {
  const { blockID } = body;
  const query = 
    `SELECT tag_id
     FROM blocktags
     WHERE block_id = $1
     `;
  return new Promise(function(resolve, reject) {
    pool.query(query, [blockID], (error, results) => {
      if (error){
        reject(error);
      } 
      resolve(results.rows);
    });
  }); 
}

export {
  Userdata,
  setupTables,
  createUser,
  deleteUser,
  getPassword,
  setPassword,
  getUser,
  createBlock,
  getUserBlocks,
  createTag,
  createBlocktag
}


