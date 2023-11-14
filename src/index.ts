import express from 'express';
import { Request, Response, NextFunction } from 'express';
import https from 'https';
import fs from 'fs';
import loadEnvironment from './util/loadEnvironment.js';
import router from './router/router.js';
import { getCorsSetupper } from './middleware/cors.js';
import { sessionSetup } from './middleware/session.js';
import * as db from './db/database_api.js';


loadEnvironment();

const server_certificates = {
  key: fs.readFileSync("server.key"),
  cert: fs.readFileSync("server.cert"),
}

db.setupTables();

const app = express ();
app.use(express.json());
app.use(getCorsSetupper(process.env.ALLOWED_ORIGIN));
app.use(sessionSetup(process.env.SESSION_SECRET));
// app.use((req: Request, res: Response, next: NextFunction) => {
//   console.log("SessionID: ", req.sessionID)
//   console.log("User: ", req.session.user)
//   next();
// })

app.use('/', router);

const server = https.createServer(server_certificates, app);

server.listen(8443, function () {
  console.log(
    `Listening on port ${process.env.PORT}!`
    + ` Go to https://localhost:${process.env.PORT}/`
  );
});
