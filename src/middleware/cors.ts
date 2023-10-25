import { Request, Response, NextFunction } from "express";

const getCorsSetupper = (ALLOWED_ORIGIN: string | undefined) => {
  if (!ALLOWED_ORIGIN) {
    console.log("ALLOWED_ORIGIN defaulted to '*'");
    ALLOWED_ORIGIN = '*';
  }
  return (req: Request, res: Response, next: NextFunction,) => {
    res.header(`Access-Control-Allow-Origin`, `${ALLOWED_ORIGIN}`);
    res.header(`Access-Control-Allow-Methods`, `POST`);
    res.header(`Access-Control-Allow-Headers`, `Content-Type`);
    next();
  }
}
export {
  getCorsSetupper,
}