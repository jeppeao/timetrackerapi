import express from 'express';
import loadEnvironment from './util/loadEnvironment.js';
let env = process.env.NODE_ENV || 'development';
await loadEnvironment(env);
const app = express();
app.get('/', (req, res, next) => {
    res.status(200).send('Hello World!');
});
app.listen(process.env.port, () => {
    console.log(`Listening on port ${process.env.PORT}`);
});
