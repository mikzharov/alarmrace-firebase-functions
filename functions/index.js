'use strict';
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const express = require('express');


// const cors = require('cors')({origin: true});
const app = express();


const validateUserToken = (req, res, next) => {
  if (!req.headers.authorization) {
    res.status(403).send('Unauthorized');
    return;
  }

  let idToken;
  if (req.headers.authorization) {
    idToken = req.headers.authorization;
  }
  
  admin.auth().verifyIdToken(idToken).then(decodedIdToken => {
    req.user = decodedIdToken;
    next();
  }).catch(error => {
    res.status(403).send('Unauthorized');
  });
};

app.use(validateUserToken);
// app.use(cors);

app.post('/accept_invite', function (req, res) {
  if(req.gameCode){
    res.status(200).send("Gamecode found");
  }else{
    res.status(200).send("Gamecode NOT found");
  }
})

// Firebase HTTPS trigger
exports.app = functions.https.onRequest(app);
