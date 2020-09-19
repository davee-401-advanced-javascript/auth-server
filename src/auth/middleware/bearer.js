'use strict';

const userModel = require('../models/users-model.js');

module.exports = async (req, res, next) => {
  if (!req.headers.authorization) { 
    next('Invalid Login'); 
  }
  try {
    let token = req.headers.authorization.split(' ').pop();
    let authenticated = await userModel.authenticateWithToken(token);
    req.user = authenticated;
    req.token = token;
    next();
  } catch(e) {
    console.log('Error from bearer', e);
    next('Invalid Login');
  }
};
