import express from 'express';
var app = express();
var PORT = 3000;
app.get('/', function (req, res, next) {
    res.status(200).send('Hello World!');
});
app.listen(PORT, function () {
    console.log("Listening on port ".concat(PORT));
});
