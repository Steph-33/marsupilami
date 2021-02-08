// Imports
require('dotenv').config();
let express = require('express');
let bodyParser = require('body-parser');
// let router = require('./routes');
let cors = require('cors');
let morgan = require('morgan');
const path = require('path');

// Instanciation du serveur
let server = express();

//Définition des Cors
server.use(cors());

// Configuration de Body Parser
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

// Utilisation du logger
server.use(morgan('dev'));

// Configuration des routes
server.get('/', (request, response) => {
  response.send("Bienvenue sur le Carnet d'Adresse du Marsupilami");
});
// server.use('/api/', router);

// Récupération des images depuis le dossier 'images'
// server.use('/images', express.static((__dirname, 'images')));

// Lancement du serveur
let port = process.env.PORT || 8080;
server.listen(port, () => {
  console.log(`Le serveur est bien lancé sur le port ${port} 🚀`);
});
