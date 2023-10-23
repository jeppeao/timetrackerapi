import express from 'express';
import loadEnvironment from './util/loadEnvironment.js';
let env = process.env.NODE_ENV || 'development';
loadEnvironment(env);
const app = express();
app.get('/', (req, res, next) => {
    res.status(200).send('Hello World!');
});
console.log(process.env.NODE_ENV);
app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`);
});
