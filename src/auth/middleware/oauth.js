'use strict';

const superagent = require('superagent');

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const TOKEN_SERVER = process.env.TOKEN_SERVER;
const REDIRECT_URI = process.env.REDIRECT_URI;
const STATE = process.env.STATE;
const REMOTE_API = process.env.REMOTE_API;
const userModel  = require('../models/users-model.js');


module.exports = async (req, res, next) => {
  let code = req.query.code;
  console.log('(1) CODE:', code);

  let gitHubToken = await exchangeCodeForToken(code);
  console.log('(2)', gitHubToken);

  let remoteUser = await getRemoteUser(gitHubToken);
  console.log('(3) remoteUser: ', remoteUser);

  // Connect that with our database
  let localUser = await getLocalUser(remoteUser.login);
  console.log('(4)', localUser);
  req.user = localUser.user;
  req.token = localUser.token;
  next();
};


async function exchangeCodeForToken(code) {
  let tokenResponse = await superagent.post(TOKEN_SERVER)
    .send({
      code: code,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      state: STATE,
      // grant_type: 'authorization_code',
    });
  let access_token = tokenResponse.body.access_token;
  return access_token;
}

async function getRemoteUser(token) {
  let userResponse = await superagent.get(REMOTE_API)
    .set('user-agent', 'express-server')
    .set('Authorization', `token ${token}`);

  let user = userResponse.body;
  return user;
}


/*****************************************
Is this userId in our mongo database?
  If not, add it
    username: userId
    password: Math.random()
    users.save()
    store a hashed Password
  After save, or if you found a user ...
    set req.user to be that user object
    set req.token to be OUR token (Generate a token)
******************************************/
async function getLocalUser(userLogin) {
  let userInDB = await userModel.findOne({username: userLogin});

  if(!userInDB){
    let obj = {
      username: userLogin,
      password: Math.random(),
    };
    let record = new userModel(obj);
    let newUser = await record.save();
    let token = record.generateToken();
    let output = {
      user: newUser,
      token: token,
    };
    return output;
  } else {
    let output = {
      user: userInDB.username,
      token: userInDB.generateToken(),
    };
    return output;
  }
}
