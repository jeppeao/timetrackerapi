import express from 'express';
import { Request, Response, NextFunction } from 'express';


const app = express ();
const PORT = 3000;

app.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.status(200).send('Hello World!');
})


app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})

