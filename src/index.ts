import express from 'express';
import { Request, Response, NextFunction } from 'express';
import loadEnvironment from './util/loadEnvironment.js';
import router from './router/router.js';
import { getCorsSetupper } from './middleware/cors.js';
import https from 'https';
import fs from 'fs';

let env = process.env.NODE_ENV || 'development';
loadEnvironment(env);

const server_certificates = {
  key: fs.readFileSync("server.key"),
  cert: fs.readFileSync("server.cert"),
}

const app = express ();
app.use(getCorsSetupper(process.env.ALLOWED_ORIGIN));

app.use('/db', router);
app.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.status(200).send('Hello World!');
})

const server = https.createServer(server_certificates, app);

server.listen(8443, function () {
    console.log(
      `Listening on port ${process.env.PORT}!`
      + ` Go to https://localhost:${process.env.PORT}/`
    );
  });
