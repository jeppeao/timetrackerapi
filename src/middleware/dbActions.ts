import { Request, Response, NextFunction } from 'express';
import * as dbApi from './../db/database_api.js';

const createBlock = async (
  req: Request,
  res: Response, 
  next: NextFunction) => {
    const { username, startTime, endTime } = req.body;
    const result = await dbApi.createBlock({username, startTime, endTime});
    if (result) {
      return res.status(200).send();
    }
    return res.status(500).send();
}

const getUserBlocks = async (
  req: Request,
  res: Response, 
  next: NextFunction) => {
    const { username, from, to } = req.body;
    const result = await dbApi.getUserBlocks({username, from, to});
    const data = await JSON.stringify(result);
    if (result) {
      return res.status(200).json(data);
    }
    return res.status(500).send();
}

export {
  createBlock,
  getUserBlocks
}