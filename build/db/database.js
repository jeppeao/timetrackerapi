import pg from "pg";
const { Pool } = pg;
const createPool = (user, host, database, password, port) => {
    return new Pool({
        user,
        host,
        database,
        password,
        port: parseInt(port)
    });
};
const setupTables = async (pool) => {
    const users = await new Promise((resolve, reject) => {
        pool.query(`CREATE TABLE IF NOT EXISTS users(
      user_id SERIAL PRIMARY KEY,
      user_name TEXT,
      password TEXT
    );`, (error, results) => {
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
    );`, (error, results) => {
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
    );`, (error, results) => {
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
    );`, (error, results) => {
            if (error) {
                reject(error);
            }
            resolve(results);
        });
    });
    return Promise.all([users, tags, blocks, blockTags]);
};
const createUser = (pool, body) => {
    return new Promise(function (resolve, reject) {
        const { user, password } = body;
        pool.query(`INSERT INTO users (user, password) VALUES ($1, $2) RETURNING *`, [user, password], (error, results) => {
            if (error) {
                reject(error);
            }
            resolve(`new user created: ${results.rows[0]}`);
        });
    });
};
const getUser = (pool, user) => {
    return new Promise(function (resolve, reject) {
        pool.query(`SELECT * FROM users where user_name = $1`, [user], (error, results) => {
            if (error) {
                reject(error);
            }
            resolve(results.rows[0]);
        });
    });
};
const deleteUser = (pool, user) => {
    return new Promise(function (resolve, reject) {
        pool.query(`DELETE FROM users WHERE user_name = $1 RETURNING *`, [user], (error, results) => {
            if (error) {
                reject(error);
            }
            resolve(`user deleted: ${results.rows[0]}`);
        });
    });
};
const getPassword = (pool, user) => {
    return new Promise(function (resolve, reject) {
        pool.query(`SELECT password FROM users WHERE user_name = $1`, [user], (error, results) => {
            if (error) {
                reject(error);
            }
            resolve(results.rows[0]);
        });
    });
};
const setPassword = (pool, body) => {
    const { user, newPwd } = body;
    return new Promise(function (resolve, reject) {
        pool.query(`UPDATE users SET password = $2 WHERE user_name = $1`, [user, newPwd], (error, results) => {
            if (error) {
                reject(error);
            }
            resolve(results.rows[0]);
        });
    });
};
export { setupTables, createUser, deleteUser, getPassword, setPassword, getUser, createPool };
