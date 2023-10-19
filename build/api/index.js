import express from 'express';
var app = express();
app.get('/', function (req, res, next) {
    res.status(200).send('Hello World!');
});
app.listen(3000, function () {
    console.log("Example app listening on port 3000");
});
console.log("hello");
