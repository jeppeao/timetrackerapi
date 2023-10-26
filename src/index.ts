import express from 'express';
import { Request, Response, NextFunction } from 'express';
import https from 'https';
import fs from 'fs';
import loadEnvironment from './util/loadEnvironment.js';
import router from './router/router.js';
import { getCorsSetupper } from './middleware/cors.js';
import { sessionSetup } from './middleware/session.js';
import * as db from './db/database.js';


let env = process.env.NODE_ENV || 'development';
loadEnvironment(env);

const server_certificates = {
  key: fs.readFileSync("server.key"),
  cert: fs.readFileSync("server.cert"),
}

const app = express ();

app.use(getCorsSetupper(process.env.ALLOWED_ORIGIN));
app.use(sessionSetup(process.env.SESSION_SECRET));

app.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.status(200).send('Hello World!');
})
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log("SessionID: ", req.sessionID)
  console.log(req.session.user)
  req.session.user = "exampleUser"
  next();
})
app.use('/db', router);

const pool = db.createPool(
  process.env.DB_USER || 'undefined_user',
  process.env.DB_HOST || 'undefined_host',
  process.env.DB_NAME || 'undefined_dbname',
  process.env.DB_PASSWORD || 'undefined_password',
  process.env.DB_PORT || 'undefined_port',
);
db.setupTables(pool);

const server = https.createServer(server_certificates, app);

server.listen(8443, function () {
    console.log(
      `Listening on port ${process.env.PORT}!`
      + ` Go to https://localhost:${process.env.PORT}/`
    );
  });
