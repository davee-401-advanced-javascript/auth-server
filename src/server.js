'use strict';

const express = require('express');
var cors = require('cors');
const app = express();


const notFoundHandler = require('./middleware/404.js');
const errorHandler = require('./middleware/500.js');
const authRoutes = require('./auth/auth-routes.js');
const extraRoutes = require('./extra-route.js');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(authRoutes);
app.use(extraRoutes);

app.use('*', notFoundHandler);
app.use(errorHandler);

module.exports = {
  app,
  start: (port) => app.listen(port, console.log('Server up on PORT', port)),
};
