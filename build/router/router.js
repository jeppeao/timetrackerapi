import express from 'express';
import { login, logout, register } from './../middleware/authentication.js';
const router = express.Router();
router.post("/", function (req, res, next) {
    res.send("You are connected to the database api");
});
router.post("/login", function (req, res, next) {
    login(req, res, next)
        .then(response => res.send("You are logged in"));
});
router.post("/logout", function (req, res, next) {
    logout(req, res, next);
    res.send("You are logged out");
});
router.post("/register", function (req, res, next) {
    register(req, res, next);
    res.send("");
});
export default router;
