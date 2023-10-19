import express from 'express';
import { Request, Response, NextFunction } from 'express';
const app = express ();

app.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.status(200).send('Hello World!');
})

exports = {
  app
}

console.log("hello")