'use strict';

const express = require('express');
const app = express();

const notFoundHandler = require('./middleware/404.js');
const errorHandler = require('./middleware/500.js');
const authRoutes = require('./auth/router.js');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(authRoutes);

app.use('*', notFoundHandler);
app.use(errorHandler);

module.exports = {
  app,
  start: (port) => app.listen(port, console.log('Server up on PORT', port)),
};
