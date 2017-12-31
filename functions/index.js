'use strict';
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const express = require('express');
var db = admin.firestore();


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
  var gamecode = req.body.gameCode;
  if(gamecode){
    var gameRef = db.collection('games').doc(gamecode);
    var getGame = gameRef.get().then(doc => {
        if (!doc.exists) {
            res.status(400).send("Gamecode NOT found in database");
        } else {
            res.status(200).send("Gamecode found in database");
        }
    }).catch(err => {
        res.status(500).send("Database error");
    });
  }else{
    res.status(400).send("You did not send a gamecode");
  }
})

// Firebase HTTPS trigger
exports.app = functions.https.onRequest(app);
