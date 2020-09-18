'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const secret = 'sauce';

const users = mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
});

users.pre('save', async function () {
  this.password = await bcrypt.hash(this.password, 5);
  console.log('The password is', this.password);
});

users.methods.generateToken = function () {
  let token = jwt.sign({ username: this.username }, secret);
  return token;
};

users.statics.validateBasic = async function (username, password) {

  let user = await this.findOne({ username: username });

  let isValid = await bcrypt.compare(password, user.password);

  if (isValid) { return user; }
  else { return undefined; }

};

module.exports = mongoose.model('users', users);
