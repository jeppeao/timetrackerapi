import express from 'express';
import { login, logout, register } from './../middleware/authentication.js';
import { isAuthenticatedUser } from './../middleware/authentication.js';
import { createBlock, getUserBlocks } from '../middleware/dbActions.js';

const router = express.Router();

router.get("/", function (req, res, next) {
  res.send("You are connected to the database api")
})

router.post("/", isAuthenticatedUser, function (req, res, next) {
  res.send("You are connected to the database api")
})

router.post("/login", function (req, res, next) {
  login(req, res, next);
})

router.post("/logout", function (req, res, next) {
  logout(req, res, next);
})

router.post("/register", function (req, res, next) {
  register(req, res, next);
})

router.post("/db/createblock", isAuthenticatedUser, function (req, res, next) {
  createBlock(req, res, next);
})

router.post("/db/getBlocks", isAuthenticatedUser, function (req, res, next) {
  getUserBlocks(req, res, next);
})

export default router;
