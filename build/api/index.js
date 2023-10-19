import express from 'express';
var app = express();
app.get('/', function (req, res, next) {
    res.status(200).send('Hello World!');
});
exports = {
    app: app
};
console.log("hello");
