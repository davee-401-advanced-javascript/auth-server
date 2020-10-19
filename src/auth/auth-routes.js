'use strict';

const express = require('express');
const router = express.Router();

const userModel = require('./models/users-model.js');
const basicAuth = require('./middleware/basic.js');
const bearerAuth = require('./middleware/bearer.js');
const oauth = require('./middleware/oauth.js');

router.post('/signup', handleSignUp);
router.post('/signin', basicAuth, handleSignIn);
router.get('/users', bearerAuth, getUsers);
router.get('/oauth', oauth, handleOAuthroute );

async function handleSignUp(req, res, next){
  try {
    let obj = {
      username: req.body.username,
      password: req.body.password,
    };
    let record = new userModel(obj);
    let newUser = await record.save();
    let token = record.generateToken();

    res.set('auth', token);

    let output = {
      token: token,
      user: newUser,
    };
    res.status(201).send(output);
  } catch (e) {
    next(e.message);
  }
}

async function handleSignIn(req, res, next){
  try {
    let output = {
      token: req.token,
      user: req.user,
    };
    res.set('auth', req.token);
    res.status(200).json(output);
  } catch(e) {
    next(e.message);
  }
}

async function getUsers(req, res, next) {
  try {
    let allUsers = await userModel.find({});
    res.set('auth', req.token);
    res.status(200).json(allUsers);
  } catch(e) {
    next(e);
  }
}

async function handleOAuthroute(req, res, next) {
  let output = {
    token: req.token,
    user: req.user,
  };
  res.status(200).json(output);
}


module.exports = router;