'use strict';

module.exports = (req, res) => {

  let output = {
    error: 'Route not found',
  };
  res.status(404).json(output);
};