const express = require('express');
const userController = require('../controllers/userController');
const multer = require('../middlewares/multer-config');
const jwtUtils = require('../utils/jwt.utils');

const userRouter = express.Router();

userRouter.get('/user/me/', jwtUtils.authenticateJWT, async (request, response) => {
    const user = await userController.getUserById(request.user.userId);
    response.status(201).json(user);
  });

userRouter.post('/user/register/', multer, userController.register);
userRouter.post('/user/login/', userController.login);

module.exports = userRouter;
