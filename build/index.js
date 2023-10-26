import express from 'express';
import loadEnvironment from './util/loadEnvironment.js';
import router from './router/router.js';
import { getCorsSetupper } from './middleware/cors.js';
import https from 'https';
import fs from 'fs';
import session from 'express-session';
import redis from 'redis';
import RedisStore from 'connect-redis';
const redisClient = redis.createClient();
redisClient.connect().catch(console.error);
const redisStore = new RedisStore({
    client: redisClient,
    prefix: "timetrackerApp:",
});
let env = process.env.NODE_ENV || 'development';
loadEnvironment(env);
let sessionOptions = {
    store: redisStore,
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: true,
        // maxAge: 1000 * 60 * 60 *24,
        httpOnly: true,
        sameSite: 'none',
    }
};
const server_certificates = {
    key: fs.readFileSync("server.key"),
    cert: fs.readFileSync("server.cert"),
};
const app = express();
app.use(getCorsSetupper(process.env.ALLOWED_ORIGIN));
app.use(session(sessionOptions));
app.get('/', (req, res, next) => {
    res.status(200).send('Hello World!');
});
app.use((req, res, next) => {
    console.log("SessionID: ", req.sessionID);
    console.log(req.session.user);
    req.session.user = "exampleUser";
    next();
});
app.use('/db', router);
const server = https.createServer(server_certificates, app);
server.listen(8443, function () {
    console.log(`Listening on port ${process.env.PORT}!`
        + ` Go to https://localhost:${process.env.PORT}/`);
});
