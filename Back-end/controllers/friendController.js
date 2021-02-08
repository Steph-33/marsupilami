const models = require('../models');
const express = require('express');

module.exports = {
  addFriend: async (request, response, userSession) => {
    console.log('userSession : ', userSession);
    const friend = {
      name: request.body.name,
      email: request.body.email,
      age: request.body.age,
      family: request.body.family,
      race: request.body.race,
      food: request.body.food,
      phone: request.body.phone,
      location: request.body.location,
      image: `${request.protocol}://${request.get('host')}/images/${
        request.file.filename
      }`,
      user_id: userSession,
    };
    for (const key in friend) {
      if (friend[key] == null) {
        return response.status(400).json({
          error: `Le champs ${key} n'est pas renseigné ❌`,
        });
      }
    }
    const friendFound = await models.Friend.findOne({
      attributes: ['name', 'user_id'],
      where: { name: friend.name, user_id: friend.user_id },
    });
    if (!friendFound) {
      const friend = await models.Friend.create({
        name: request.body.name,
        email: request.body.email,
        age: request.body.age,
        family: request.body.family,
        race: request.body.race,
        food: request.body.food,
        phone: request.body.phone,
        location: request.body.location,
        image: `${request.protocol}://${request.get('host')}/images/${
            request.file.filename
        }`,
        user_id: userSession,
      });
      if (friend) {
        return response.status(201).json({
          id: friend.id,
          name: friend.name,
          email: friend.email,
          user_id: friend.user_id,
        });
      } else {
        return response.status(401).json({
          error: "Impossible d'ajouter un ami. ❌",
        });
      }
    } else {
      return response.status(400).json({
        error:
          'Un ami existe déjà avec un nom identique et sous le même identifiant. ❌',
      });
    }
  },
  getFriendById: (request, response) => {
    models.Friend.findOne({
      attributes: [
        'id',
        'name',
        'email',
        'age',
        'family',
        'race',
        'food',
        'phone',
        'location',
        'image',
        'user_id',
      ],
      where: { id: request.params.id },
    })
      .then((friendFound) => {
        return response.status(200).json({
          id: friend.id,
          name: friend.name,
          email: friend.email,
          age: friend.age,
          family: friend.family,
          race: friend.race,
          food: friend.food,
          phone: friend.phone,
          location: friend.location,
          image: friend.image,
          user_id: friend.user_id,
        });
      })
      .catch(() => {
        response.status(404).json({
          error: "Aucun ami n'a été trouvé avec cet identifiant. ❌",
        });
      });
  },
  getAllFriends: (request, response) => {
    if(request.params.limit == 'null' || request.params.limit == undefined || request.params.limit == ""){
      request.params.limit = 20;
    }
    models.Friend.findAll({
      attributes: [
        'id',
        'name',
        'email',
        'age',
        'family',
        'race',
        'food',
        'phone',
        'location',
        'image',
        'user_id',
      ],
      limit : parseInt(request.params.limit),
    }).then((friends) => {
      response.status(201).json(friends);
    });
  },
  // Mettre à jour les informations sur un ami
  updateFriend: (request, response, userSession) => {
    const friend = {
        name: request.body.name,
        email: request.body.email,
        age: request.body.age,
        family: request.body.family,
        race: request.body.race,
        food: request.body.food,
        phone: request.body.phone,
        location: request.body.location,
        image: `${request.protocol}://${request.get('host')}/images/${
          request.file.filename
        }`,
        user_id: userSession,
    };
    if(userSession == request.body.user_id){
      models.Friend.update(friend, { where: { id: request.params.id } })
      .then(() => {
        response.status(201).json({
          message: 'Les informations sur votre ami ont été modifiées avec succès ! ',
        });
      })
      .catch(() => {
        response.status(400).json({
          error: "Les informations sur votre ami n'ont pas pu être modifiées. ❌",
        });
      });
    } else{
      response.status(403).json({
        error: "Vous n'êtes pas autorisé à modifier les informations sur cet ami !! ❌"
      })
    }
  },
  // Effacer un ami du répertoire
  deleteFriend: (request, response) => {
    models.Friend.destroy({ where: { id: request.params.id } })
      .then(() => {
        response.status(201).json({
          message: 'Votre ami a été supprimé du répertoire avec succès ! ',
        });
      })
      .catch(() => {
        response.status(400).json({
          error: "Votre ami n'a pas pu être supprimé du répertoire. ❌",
        });
      });
  },
};
