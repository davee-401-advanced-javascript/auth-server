'use strict';

const express = require('express');
const router = express.Router();

const bearerAuth = require('./auth/middleware/bearer.js');

router.get('/secret', bearerAuth, (req, res, next) => {
  res.status(200).send(`Welcome, ${req.user.username}, your token is Valid`);
});

module.exports = router;