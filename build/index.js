import express from 'express';
import loadEnvironment from './util/loadEnvironment.js';
import https from 'https';
import fs from 'fs';
let env = process.env.NODE_ENV || 'development';
loadEnvironment(env);
const server_certificates = {
    key: fs.readFileSync("server.key"),
    cert: fs.readFileSync("server.cert"),
};
const app = express();
app.get('/', (req, res, next) => {
    res.status(200).send('Hello World!');
});
const server = https.createServer(server_certificates, app);
server.listen(8443, function () {
    console.log(`Listening on port ${process.env.PORT}!`
        + ` Go to https://localhost:${process.env.PORT}/`);
});
