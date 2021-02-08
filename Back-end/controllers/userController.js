// Imports
const bcrypt = require('bcrypt');
const { request, response } = require('express');
const jwtUtils = require('../utils/jwt.utils');
const models = require('../models');
require('express-async-errors');

const BadRequest = require('../utils/errors/bad_request');

function isString(value) {
  return typeof value === 'string' || value instanceof String;
}

// Contrôleurs
module.exports = {
  register: async (request, response) => {
    const user = {
      name: request.body.name,
      email: request.body.email,
      password: request.body.password,
      age: request.body.age,
      family: request.body.family,
      race: request.body.race,
      food: request.body.food,
      image: `${request.protocol}://${request.get('host')}/images/${
        request.file.filename
      }`,
    };
    const checkEmail = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    const checkName = /\b([A-ZÀ-ÿ][-,a-z. ']+[ ]*)+/;
    for (const key in user) {
      if (user[key] == null) {
        throw new BadRequest(
          'Mauvaise Requête',
          `Le champs ${key} n'est pas renseigné ❌`
        );
      }
    }
    for (const key in user) {
      if (!isString(user[key])) {
        throw new BadRequest(
          'Mauvaise Requête',
          `Le champs ${key} n'est pas une chaîne de caractères. ❌`
        );
      }
    }
    if (!checkName.test(user.name)) {
      throw new BadRequest(
        'Mauvaise Requête',
        `Le champ name est mal renseigné. Vous devez rentrer un nom valide. ❌`
      );
    }
    if (!checkEmail.test(user.email)) {
      throw new BadRequest(
        'Mauvaise Requête',
        `Le champ email est mal renseigné ex:hello@contact.com ❌`
      );
    }
    // TODO : check forms
    const userFound = await models.User.findOne({
      attributes: ['email'],
      where: { email: user.email },
    });
    if (!userFound) {
      bcrypt.hash(user.password, 5, async (err, bcryptedPassword) => {
        const newUser = await models.User.create({
          name: user.name,
          email: user.email,
          password: bcryptedPassword,
          age: user.age,
          family: user.family,
          race: user.race,
          image: user.image,
        });
        if (newUser) {
          return response.status(201).json({
            name: newUser.name,
            email: newUser.email,
          });
        } else {
          throw new ServerError(
            'Erreur Serveur',
            "Impossible d'ajouter cet utilisateur. ❌"
          );
        }
      });
    } else {
      throw new ConflictError(
        'Mauvaise Requête',
        'Un utilisateur possédant le même email existe déjà. ❌'
      );
    }
  },
  login: async (request, response) => {
    const userInfos = {
      email: request.body.email,
      password: request.body.password,
    };
    for (const key in userInfos) {
      if (userInfos[key] == null) {
        throw new BadRequest('Mauvaise Requête',`Le champs ${key} n'est pas renseigné ❌`);
      }
    }
    const userFound = await models.User.findOne({
      where: { email: userInfos.email },
    });
    if (userFound) {
      bcrypt.compare(
        userInfos.password,
        userFound.password,
        (errBycrypt, resBycrypt) => {
          const userToken = {
            name: userFound.name,
            email: userFound.email,
          };
          if (resBycrypt) {
            return response.status(200).json({
              token: jwtUtils.generateTokenForUser(userFound),
              user: userToken,
            });
          }
          return response.status(403).json({ error: 'Mot de passe incorrect ! ❌', });
        }
      );
    } else {
      throw new NotFoundError('Ressource introuvable',"L'utilisateur demandé n'existe pas ❌");
    }
  },
  getUserSession: async (request, response, cb) => {
    const headerAuth = request.headers['authorization'];
    const userId = jwtUtils.getUserId(headerAuth, response);
    if (userId < 0) {
      throw new BadRequest(
        'Mauvaise Requête',
        "Erreur lors de la lecture de l'id de l'utilisateur ❌"
      );
    }
    const user = await models.User.findOne({
      where: { id: userId },
    });
    if (user) {
      return cb(user.dataValues);
    }
    throw new NotFoundError(
      'Ressource introuvable',
      'Vous devez être connecté pour accéder à cette ressource ❌'
    );
  },
  getUserById : (id) => {
    return models.User.findByPk(id);
  }
};
