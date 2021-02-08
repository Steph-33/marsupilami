const express = require('express');
const userRouter = require('./userRoutes');
const friendRouter = require('./friendRoutes');

const router = express.Router();

router.use(userRouter);
router.use(friendRouter);

module.exports = router;