import express from 'express';
const router = express.Router();
router.post("/", function (req, res, next) {
    res.cookie("name", "value");
    res.send("You are connected to the database api");
});
export default router;
