const express = require('express');
const friendController = require('../controllers/friendController');
const jwtUtils = require('../utils/jwt.utils')
const multer = require('../middlewares/multer-config');

const friendRouter = express.Router();

// Récupérer un ami id
friendRouter.get(
  '/friends/:id',
  friendController.getFriendById
);

// Récupération de l'ensemble des amis
friendRouter.get(
  '/friends',
  friendController.getAllFriends
);

// Récupération des amis avec une limite de nombre
friendRouter.get('/allfriends/:limit', friendController.getAllFriends);

// Ajout d'un ami dans le répertoire
friendRouter.post('/friends', jwtUtils.authenticateJWT, multer, async (request, response) => {
  console.log("request.user",request.user);
  const userId = request.user.userId;
  friendController.addFriend(request, response, userId);
});

// Mise à jour des informations d'un ami
friendRouter.put('/friends/:id', jwtUtils.authenticateJWT, multer, async (request, response) => {
  console.log("request.user",request.user);
  const userId = request.user.userId;
  friendController.updateFriend(request, response, userId);
});

// Suppression d'un ami du répertoire
friendRouter.delete('/friends/:id', jwtUtils.authenticateJWT, async(request, response) => {
  const userId = request.user.userId;
  friendController.deleteFriend(request, response, userId);
});

module.exports = friendRouter;
